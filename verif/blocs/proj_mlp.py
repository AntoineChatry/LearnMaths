# Prototype of steps 6-10: a 20-H-3 ReLU network, softmax + cross-entropy, backprop, Adam, in plain numpy.
# Measures survival (40 fixed games) against the linear brain, and the CPU time.
import sys
import time

import numpy as np

sys.path.insert(0, str(__import__("pathlib").Path(__file__).parent))
from proj_monde import load

g = load()
t0 = time.time()
X, A = g["_expert_data"](g["percevoir"])
print("N", len(X), "data s", round(time.time() - t0, 2))
Y = np.eye(3)[A + 1]
mu, M = g["normaliser"](X)


def forward(P, Xb):
    Z = Xb @ P["W1"].T + P["b1"]
    H = np.maximum(Z, 0)
    S = H @ P["W2"].T + P["b2"]
    return Z, H, S


def softmax(S):
    E = np.exp(S - S.max(axis=1, keepdims=True))
    return E / E.sum(axis=1, keepdims=True)


def loss_grad(P, Xb, Yb):
    Z, H, S = forward(P, Xb)
    Pr = softmax(S)
    n = len(Xb)
    L = -np.sum(Yb * np.log(Pr + 1e-300)) / n
    dS = (Pr - Yb) / n
    dW2 = dS.T @ H
    db2 = dS.sum(0)
    dH = dS @ P["W2"]
    dZ = dH * (Z > 0)
    return L, {"W1": dZ.T @ Xb, "b1": dZ.sum(0), "W2": dW2, "b2": db2}


def train(Xn, H=32, iters=500, lr=0.01, seed=0, batch=None):
    rng = np.random.default_rng(seed)
    d = Xn.shape[1]
    P = {"W1": rng.normal(0, np.sqrt(2 / d), (H, d)), "b1": np.zeros(H),
         "W2": rng.normal(0, np.sqrt(2 / H), (3, H)), "b2": np.zeros(3)}
    m = {k: np.zeros_like(v) for k, v in P.items()}
    v = {k: np.zeros_like(v) for k, v in P.items()}
    b1, b2, eps = 0.9, 0.999, 1e-8
    losses = []
    for t in range(1, iters + 1):
        if batch:
            idx = rng.integers(0, len(Xn), batch)
            L, G = loss_grad(P, Xn[idx], Y[idx])
        else:
            L, G = loss_grad(P, Xn, Y)
        losses.append(L)
        for k in P:
            m[k] = b1 * m[k] + (1 - b1) * G[k]
            v[k] = b2 * v[k] + (1 - b2) * G[k] ** 2
            P[k] -= lr * (m[k] / (1 - b1**t)) / (np.sqrt(v[k] / (1 - b2**t)) + eps)
    return P, losses


def survival(P, norm):
    mu_, M_ = norm

    def pol(p):
        v = (g["percevoir"](p) - mu_) @ M_
        return int(np.argmax(forward(P, v[None])[2][0])) - 1
    return g["_evaluate"](pol)


Xn = (X - mu) @ M
for H, iters, lr in [(32, 300, 0.01), (32, 500, 0.01), (32, 1000, 0.01), (64, 500, 0.01), (16, 500, 0.01)]:
    t0 = time.time()
    P, losses = train(Xn, H, iters, lr)
    tt = time.time() - t0
    t0 = time.time()
    s = survival(P, (mu, M))
    print(f"H={H} iters={iters} lr={lr} loss {losses[0]:.3f}->{losses[-1]:.3f} train {tt:.1f}s survie {s:.1f} eval {time.time()-t0:.1f}s")

# Same without normalization, to see if step 5 matters.
P, losses = train(X, 32, 500, 0.01)
print("raw X: loss", round(losses[-1], 3), "survie", survival(P, (np.zeros(20), np.eye(20))))
