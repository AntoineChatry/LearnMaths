# Step 9 sizing: separate timings (expert data collection, training, evaluation) and stability of the 20-32-3 net
# trained by Adam (full batch vs mini-batch) on 100 expert games, vs the linear softmax on the same data.
import sys
import time
from pathlib import Path

import numpy as np

sys.path.insert(0, str(Path(__file__).parent))
from proj_monde import load

g = load()
perc = g["percevoir"]


def softmax(S):
    E = np.exp(S - S.max(axis=1, keepdims=True))
    return E / E.sum(axis=1, keepdims=True)


def newton_lin(Xa, Y, lam=1e-5):
    N, d = Xa.shape
    T = np.zeros((d, 3))
    for _ in range(30):
        P = softmax(Xa @ T)
        G = (Xa.T @ (P - Y) / N + lam * T).T.ravel()
        H = np.zeros((3 * d, 3 * d))
        for j in range(3):
            for k in range(3):
                w = P[:, j] * ((j == k) - P[:, k])
                H[j * d:(j + 1) * d, k * d:(k + 1) * d] = (Xa * w[:, None]).T @ Xa / N
        step = np.linalg.solve(H + lam * np.eye(3 * d), G).reshape(3, d).T
        T -= step
        if np.abs(step).max() < 1e-9:
            break
    return lambda v: np.append(v, 1) @ T


def mlp(X, Y, H, iters, lr, seed, batch=None, epochs=None):
    rng = np.random.default_rng(seed)
    d = X.shape[1]
    P = {"W1": rng.normal(0, np.sqrt(2 / d), (H, d)), "b1": np.zeros(H),
         "W2": rng.normal(0, np.sqrt(2 / H), (3, H)), "b2": np.zeros(3)}
    m = {k: np.zeros_like(v) for k, v in P.items()}
    s = {k: np.zeros_like(v) for k, v in P.items()}
    n = len(X)
    t = 0

    def step(Xb, Yb):
        nonlocal t
        t += 1
        Z = Xb @ P["W1"].T + P["b1"]
        Hh = np.maximum(Z, 0)
        dS = (softmax(Hh @ P["W2"].T + P["b2"]) - Yb) / len(Xb)
        dZ = (dS @ P["W2"]) * (Z > 0)
        G = {"W1": dZ.T @ Xb, "b1": dZ.sum(0), "W2": dS.T @ Hh, "b2": dS.sum(0)}
        for k in P:
            m[k] = 0.9 * m[k] + 0.1 * G[k]
            s[k] = 0.999 * s[k] + 0.001 * G[k] ** 2
            P[k] -= lr * (m[k] / (1 - 0.9**t)) / (np.sqrt(s[k] / (1 - 0.999**t)) + 1e-8)

    if batch is None:
        for _ in range(iters):
            step(X, Y)
    else:
        for _ in range(epochs):
            idx = rng.permutation(n)
            for i in range(0, n, batch):
                j = idx[i:i + batch]
                step(X[j], Y[j])
    return lambda v: np.maximum(P["W1"] @ v + P["b1"], 0) @ P["W2"].T + P["b2"]


def surv(f, mu, M, seeds):
    return np.mean([g["_play"](lambda p: int(np.argmax(f((perc(p) - mu) @ M))) - 1, s)[0] for s in seeds])


print("\n=== bench9 ===")
t0 = time.perf_counter()
X, A = g["_expert_data"](perc, seeds=range(1000, 1000 + int(sys.argv[2]) if len(sys.argv) > 2 else 1100))
print(f"collecte parties expert: {time.perf_counter()-t0:.2f}s  N={len(X)}")
Y = np.eye(3)[A + 1]
mu, M = g["normaliser"](X)
Xn = (X - mu) @ M
t0 = time.perf_counter()
f = newton_lin(np.hstack([Xn, np.ones((len(X), 1))]), Y)
print(f"newton lineaire: {time.perf_counter()-t0:.2f}s")
t0 = time.perf_counter()
s40 = surv(f, mu, M, range(1, 41))
print(f"eval 40 parties (lineaire): {time.perf_counter()-t0:.2f}s  survie40 {s40:.1f}")

configs = [("plein lot 500 it", dict(iters=500)),
           ("mini-lot 256 x 5 ep", dict(iters=None, batch=256, epochs=5)),
           ("mini-lot 256 x 10 ep", dict(iters=None, batch=256, epochs=10))]
if len(sys.argv) > 1:  # part 2: longer mini-batch runs (lr 0.003), and full batch timed alone
    configs = [("mini-lot 256 x 60 ep", dict(batch=256, epochs=60)),
               ][:1 if len(sys.argv) > 3 else 2]
for name, kw in configs:
    r40, r200, tt = [], [], []
    for seed in range(int(sys.argv[3]) if len(sys.argv) > 3 else 4):
        t0 = time.perf_counter()
        f = mlp(Xn, Y, 32, kw.pop("iters", None) if False else kw.get("iters"), 0.01 if kw.get("batch") is None else 0.003,
                seed, kw.get("batch"), kw.get("epochs"))
        tt.append(time.perf_counter() - t0)
        r40.append(surv(f, mu, M, range(1, 41)))
        r200.append(surv(f, mu, M, range(1, 201)))
    print(f"{name}: train {np.mean(tt):.2f}s/graine  survie40 {np.round(r40)}  survie200 {np.round(r200)} moy {np.mean(r200):.1f}")
