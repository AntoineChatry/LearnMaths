# Step 8 prototype: backprop of the mean cross-entropy of a 20-32-3 ReLU net, checked by central differences
# (PRML 5.69); cost of one full gradient by backprop vs by central differences; plain gradient descent with
# several steps on the 30 expert games (He init, fixed seed), loss and survival on the 40 app games.
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


def loss(P, X, Y):
    S = np.maximum(X @ P[0].T + P[1], 0) @ P[2].T + P[3]
    Z = S - S.max(axis=1, keepdims=True)
    return -np.sum(Y * (Z - np.log(np.exp(Z).sum(axis=1, keepdims=True)))) / len(X)


def grads(P, X, Y):
    W1, b1, W2, b2 = P
    Z = X @ W1.T + b1
    H = np.maximum(Z, 0)
    S = H @ W2.T + b2
    E = np.exp(S - S.max(axis=1, keepdims=True))
    D2 = (E / E.sum(axis=1, keepdims=True) - Y) / len(X)
    D1 = (D2 @ W2) * (Z > 0)
    return [D1.T @ X, D1.sum(0), D2.T @ H, D2.sum(0)]


def init(seed):
    rng = np.random.default_rng(seed)
    return [rng.normal(0, np.sqrt(2 / 20), (32, 20)), np.zeros(32), rng.normal(0, np.sqrt(2 / 32), (3, 32)), np.zeros(3)]


# Central differences on every parameter, on a 200-example batch.
P = init(0)
Xb, Yb = Xn[:200], Y[:200]
t0 = time.time()
G = grads(P, Xb, Yb)
t_bp = time.time() - t0
t0 = time.time()
err = 0.0
count = 0
for k in range(4):
    flat = P[k].ravel()
    gk = G[k].ravel()
    for i in range(flat.size):
        old = flat[i]
        flat[i] = old + 1e-5
        lp = loss(P, Xb, Yb)
        flat[i] = old - 1e-5
        lm = loss(P, Xb, Yb)
        flat[i] = old
        err = max(err, abs((lp - lm) / 2e-5 - gk[i]))
        count += 1
t_fd = time.time() - t0
print(f"{count} parametres ; ecart max backprop / diff. centrees {err:.2e} ; backprop {t_bp*1000:.2f} ms, diff. centrees {t_fd*1000:.0f} ms")

for eta in [0.1, 0.3, 1.0]:
    P = init(0)
    t0 = time.time()
    losses = []
    for it in range(300):
        losses.append(loss(P, Xn, Y))
        G = grads(P, Xn, Y)
        P = [p - eta * gp for p, gp in zip(P, G)]
    losses.append(loss(P, Xn, Y))
    tt = time.time() - t0
    W1, b1, W2, b2 = P
    f = lambda v: np.maximum(W1 @ v + b1, 0) @ W2.T + b2
    s = g["_evaluate"](lambda p: int(np.argmax(f((perc(p) - mu) @ M))) - 1)
    print(f"eta={eta}: perte {losses[0]:.3f} -> {losses[100]:.3f} (100 it) -> {losses[-1]:.4f} (300 it) en {tt:.1f}s ; survie40 {s:.1f}")
