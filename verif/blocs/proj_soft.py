# Step 6 prototype: linear softmax trained by plain gradient descent on whitened inputs (step 5).
# How many iterations, which step, which survival (40 fixed games, as in the app, and 200 games)?
import sys
import time
from pathlib import Path

import numpy as np

sys.path.insert(0, str(Path(__file__).parent))
from proj_monde import load

g = load()
perc = g["percevoir"]
X, A = g["_expert_data"](perc)
Y = np.eye(3)[A + 1]
mu, M = g["normaliser"](X)
Xn = (X - mu) @ M
Xa = np.hstack([Xn, np.ones((len(X), 1))])
N = len(X)


def softmax(S):
    E = np.exp(S - S.max(axis=1, keepdims=True))
    return E / E.sum(axis=1, keepdims=True)


def ce(T):
    return -np.sum(Y * np.log(softmax(Xa @ T))) / N


def surv(T, seeds):
    W, b = T[:-1].T, T[-1]
    return np.mean([g["_play"](lambda p: int(np.argmax(W @ ((perc(p) - mu) @ M) + b)) - 1, s)[0] for s in seeds])


lam = np.linalg.eigvalsh(Xa.T @ Xa / N)
print("eig Xa^T Xa / N", lam.min(), lam.max())
for eta in [1.0, 2.0, 4.0]:
    T = np.zeros((21, 3))
    t0 = time.time()
    for it in range(1, 3001):
        T -= eta * Xa.T @ (softmax(Xa @ T) - Y) / N
        if it in (100, 300, 1000, 3000):
            print(f"eta={eta} it={it} perte {ce(T):.4f} survie40 {surv(T, range(1, 41)):.1f} survie200 {surv(T, range(1, 201)):.1f} ({time.time()-t0:.1f}s)")
