# Does the hidden layer beat the linear softmax reliably? Linear (Newton, ridge 1e-5) vs 20-H-3 ReLU nets trained
# by full-batch Adam on the cross-entropy, with 30 or 100 expert games, evaluated on 40 (app) and 200 games.
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


def mlp(X, Y, H, iters, lr, seed):
    rng = np.random.default_rng(seed)
    d = X.shape[1]
    P = {"W1": rng.normal(0, np.sqrt(2 / d), (H, d)), "b1": np.zeros(H),
         "W2": rng.normal(0, np.sqrt(2 / H), (3, H)), "b2": np.zeros(3)}
    m = {k: np.zeros_like(v) for k, v in P.items()}
    s = {k: np.zeros_like(v) for k, v in P.items()}
    n = len(X)
    for t in range(1, iters + 1):
        Z = X @ P["W1"].T + P["b1"]
        Hh = np.maximum(Z, 0)
        dS = (softmax(Hh @ P["W2"].T + P["b2"]) - Y) / n
        dZ = (dS @ P["W2"]) * (Z > 0)
        G = {"W1": dZ.T @ X, "b1": dZ.sum(0), "W2": dS.T @ Hh, "b2": dS.sum(0)}
        for k in P:
            m[k] = 0.9 * m[k] + 0.1 * G[k]
            s[k] = 0.999 * s[k] + 0.001 * G[k] ** 2
            P[k] -= lr * (m[k] / (1 - 0.9**t)) / (np.sqrt(s[k] / (1 - 0.999**t)) + 1e-8)
    return lambda v: np.maximum(P["W1"] @ v + P["b1"], 0) @ P["W2"].T + P["b2"]


def surv(f, mu, M, seeds):
    return np.mean([g["_play"](lambda p: int(np.argmax(f((perc(p) - mu) @ M))) - 1, s)[0] for s in seeds])


for n_games in [30, 100]:
    X, A = g["_expert_data"](perc, seeds=range(1000, 1000 + n_games))
    Y = np.eye(3)[A + 1]
    mu, M = g["normaliser"](X)
    Xn = (X - mu) @ M
    f = newton_lin(np.hstack([Xn, np.ones((len(X), 1))]), Y)
    print(f"{n_games} parties (N={len(X)}): lineaire survie40 {surv(f, mu, M, range(1, 41)):.1f} survie200 {surv(f, mu, M, range(1, 201)):.1f}")
    for H, iters in [(32, 500), (64, 1000)]:
        r40, r200 = [], []
        t0 = time.time()
        for seed in range(4):
            f = mlp(Xn, Y, H, iters, 0.01, seed)
            r40.append(surv(f, mu, M, range(1, 41)))
            r200.append(surv(f, mu, M, range(1, 201)))
        print(f"   H={H} {iters} it: survie40 {np.round(r40)} survie200 {np.round(r200)} moy200 {np.mean(r200):.1f} ({time.time()-t0:.0f}s)")
