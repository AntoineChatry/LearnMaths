# Step 6 harness candidate: Newton's method (IRLS, Bishop PRML 4.3.3) on the linear softmax with a small ridge
# (the softmax Hessian is singular along "add the same vector to every class"). Compared with sklearn.
import sys
import time
from pathlib import Path

import numpy as np
from sklearn.linear_model import LogisticRegression

sys.path.insert(0, str(Path(__file__).parent))
from proj_monde import load

g = load()
perc = g["percevoir"]
X, A = g["_expert_data"](perc)
Y = np.eye(3)[A + 1]
mu, M = g["normaliser"](X)
Xn = (X - mu) @ M
Xa = np.hstack([Xn, np.ones((len(X), 1))])
N, d = Xa.shape


def softmax(S):
    E = np.exp(S - S.max(axis=1, keepdims=True))
    return E / E.sum(axis=1, keepdims=True)


def objective(T, lam):
    return -np.sum(Y * np.log(softmax(Xa @ T))) / N + lam / 2 * np.sum(T * T)


def newton(lam, iters=30):
    T = np.zeros((d, 3))
    hist = []
    for it in range(iters):
        P = softmax(Xa @ T)
        G = (Xa.T @ (P - Y) / N + lam * T).T.ravel()  # class-major
        H = np.zeros((3 * d, 3 * d))
        for j in range(3):
            for k in range(3):
                w = P[:, j] * ((j == k) - P[:, k])
                H[j * d:(j + 1) * d, k * d:(k + 1) * d] = (Xa * w[:, None]).T @ Xa / N
        H += lam * np.eye(3 * d)
        step = np.linalg.solve(H, G).reshape(3, d).T
        T = T - step
        hist.append(objective(T, lam))
        if np.abs(step).max() < 1e-10:
            break
    return T, hist


def surv(T, seeds):
    W, b = T[:-1].T, T[-1]
    return np.mean([g["_play"](lambda p: int(np.argmax(W @ ((perc(p) - mu) @ M) + b)) - 1, s)[0] for s in seeds])


for lam in [1e-3, 1e-4, 1e-5]:
    t0 = time.time()
    T, hist = newton(lam)
    tt = time.time() - t0
    print(f"lam={lam:g} its {len(hist)} obj {hist[-1]:.5f} ({tt:.2f}s) survie40 {surv(T, range(1, 41)):.1f} survie200 {surv(T, range(1, 201)):.1f}")
    print("   obj par iteration", [round(h, 5) for h in hist[:8]])
    # sklearn reference: its penalty is ||W||^2 / 2 with C = 1 / (N lam), mean vs sum convention; bias not penalized.
    lr = LogisticRegression(C=1 / (N * lam), max_iter=10000, tol=1e-12).fit(Xn, A)
    print("   sklearn perte", round(-np.mean(np.log(lr.predict_proba(Xn)[np.arange(N), A + 1])), 5),
          "notre perte", round(-np.sum(Y * np.log(softmax(Xa @ T))) / N, 5))
