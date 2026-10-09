# Step 10 threshold: cross-entropy of the best linear softmax (Newton, ridge 1e-5) on the 100 expert games, vs the
# training loss of the 20-32-3 network (Adam, mini-batches 256 x 60 passes, alpha 0.003) for 8 seeds, and for
# shorter trainings (10 and 20 passes) to see how much margin the criterion leaves.
import sys
from pathlib import Path

import numpy as np

sys.path.insert(0, str(Path(__file__).parent))
from proj_monde import load

g = load()
X, A = g["_expert_data"](g["percevoir"], seeds=range(1000, 1100))
Y = np.eye(3)[A + 1]
mu, M = g["normaliser"](X)
Xn = (X - mu) @ M
N = len(Xn)


def softmax(S):
    E = np.exp(S - S.max(axis=1, keepdims=True))
    return E / E.sum(axis=1, keepdims=True)


def ce(S):
    Z = S - S.max(axis=1, keepdims=True)
    return float(-np.sum(Y * (Z - np.log(np.exp(Z).sum(axis=1, keepdims=True)))) / N)


Xa = np.hstack([Xn, np.ones((N, 1))])
for lam in [1e-5, 1e-7, 1e-9, 1e-11]:
    T = np.zeros((21, 3))
    for _ in range(40):
        P = softmax(Xa @ T)
        G = (Xa.T @ (P - Y) / N + lam * T).T.ravel()
        H = np.zeros((63, 63))
        for j in range(3):
            for k in range(3):
                w = P[:, j] * ((j == k) - P[:, k])
                H[j * 21:(j + 1) * 21, k * 21:(k + 1) * 21] = (Xa * w[:, None]).T @ Xa / N
        step = np.linalg.solve(H + lam * np.eye(63), G).reshape(3, 21).T
        T -= step
        if np.abs(step).max() < 1e-10:
            break
    print(f"lineaire ridge {lam:g}: perte {ce(Xa @ T):.6f} max|T| {np.abs(T).max():.1f} gradient {np.abs(Xa.T @ (softmax(Xa @ T) - Y) / N).max():.1e}")
if len(sys.argv) > 1:
    sys.exit()


def train(seed, epochs):
    rng = np.random.default_rng(seed)
    P = [rng.normal(0, np.sqrt(2 / 20), (32, 20)), np.zeros(32), rng.normal(0, np.sqrt(2 / 32), (3, 32)), np.zeros(3)]
    m = [np.zeros_like(p) for p in P]
    v = [np.zeros_like(p) for p in P]
    t = 0
    for _ in range(epochs):
        order = rng.permutation(N)
        for i in range(0, N, 256):
            j = order[i:i + 256]
            Xb, Yb = Xn[j], Y[j]
            Z = Xb @ P[0].T + P[1]
            Hh = np.maximum(Z, 0)
            D2 = (softmax(Hh @ P[2].T + P[3]) - Yb) / len(Xb)
            D1 = (D2 @ P[2]) * (Z > 0)
            G = [D1.T @ Xb, D1.sum(0), D2.T @ Hh, D2.sum(0)]
            t += 1
            for k in range(4):
                m[k] = 0.9 * m[k] + 0.1 * G[k]
                v[k] = 0.999 * v[k] + 0.001 * G[k] ** 2
                P[k] = P[k] - 0.003 * (m[k] / (1 - 0.9**t)) / (np.sqrt(v[k] / (1 - 0.999**t)) + 1e-8)
    return ce(np.maximum(Xn @ P[0].T + P[1], 0) @ P[2].T + P[3])


for epochs in [10, 20, 60]:
    print(f"reseau {epochs} passes, 8 graines:", [round(train(s, epochs), 4) for s in range(8)])
