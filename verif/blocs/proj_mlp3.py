# Does the hidden layer help? Compare least squares, linear softmax and ReLU networks (several widths, long
# training, 5 init seeds), on the 5x4 vision and on wider visions (the bottleneck may be what the robot sees).
import sys
from pathlib import Path

import numpy as np

sys.path.insert(0, str(Path(__file__).parent))
from proj_monde import load

g = load()


def make_vision(half, rows):
    n = (2 * half + 1) * rows

    def vis(p):
        occ = set(p.meteores)
        v = np.zeros(n)
        for h in range(1, rows + 1):
            for dx in range(-half, half + 1):
                c = p.x + dx
                if c < 0 or c > 8 or (c, h) in occ:
                    v[(2 * half + 1) * (h - 1) + dx + half] = 1
        return v
    return vis


def softmax(S):
    E = np.exp(S - S.max(axis=1, keepdims=True))
    return E / E.sum(axis=1, keepdims=True)


def adam_train(P, grad_fn, iters, lr):
    m = {k: np.zeros_like(v) for k, v in P.items()}
    s = {k: np.zeros_like(v) for k, v in P.items()}
    for t in range(1, iters + 1):
        L, G = grad_fn(P)
        for k in P:
            m[k] = 0.9 * m[k] + 0.1 * G[k]
            s[k] = 0.999 * s[k] + 0.001 * G[k] ** 2
            P[k] -= lr * (m[k] / (1 - 0.9**t)) / (np.sqrt(s[k] / (1 - 0.999**t)) + 1e-8)
    return P, L


def mlp(X, Y, H, iters, lr, seed):
    rng = np.random.default_rng(seed)
    d = X.shape[1]
    P = {"W1": rng.normal(0, np.sqrt(2 / d), (H, d)), "b1": np.zeros(H),
         "W2": rng.normal(0, np.sqrt(2 / H), (3, H)), "b2": np.zeros(3)}

    def gf(P):
        Z = X @ P["W1"].T + P["b1"]
        Hh = np.maximum(Z, 0)
        Pr = softmax(Hh @ P["W2"].T + P["b2"])
        n = len(X)
        dS = (Pr - Y) / n
        dZ = (dS @ P["W2"]) * (Z > 0)
        return -np.sum(Y * np.log(Pr + 1e-300)) / n, {"W1": dZ.T @ X, "b1": dZ.sum(0), "W2": dS.T @ Hh, "b2": dS.sum(0)}
    P, L = adam_train(P, gf, iters, lr)

    def f(v):
        return np.maximum(P["W1"] @ v + P["b1"], 0) @ P["W2"].T + P["b2"]
    return f, L


def softlin(X, Y, iters, lr):
    P = {"W": np.zeros((3, X.shape[1])), "b": np.zeros(3)}

    def gf(P):
        Pr = softmax(X @ P["W"].T + P["b"])
        dS = (Pr - Y) / len(X)
        return -np.sum(Y * np.log(Pr + 1e-300)) / len(X), {"W": dS.T @ X, "b": dS.sum(0)}
    P, L = adam_train(P, gf, iters, lr)
    return (lambda v: P["W"] @ v + P["b"]), L


def lsq(X, Y):
    Xa = np.hstack([X, np.ones((len(X), 1))])
    T = np.linalg.lstsq(Xa, Y, rcond=None)[0]
    return lambda v: np.append(v, 1) @ T


def report(name, f, X, A, vis):
    acc = np.mean([np.argmax(f(x)) == a + 1 for x, a in zip(X, A)])
    surv = g["_evaluate"](lambda p: int(np.argmax(f(vis(p)))) - 1)
    print(f"  {name:28s} acc {acc:.3f}  survie {surv:6.1f}")
    return surv


for half, rows in [(2, 4), (4, 4), (4, 9)]:
    vis = make_vision(half, rows)
    X, A = g["_expert_data"](vis)
    Y = np.eye(3)[A + 1]
    print(f"vision {2*half+1}x{rows} (d={X.shape[1]}), N={len(X)}")
    report("moindres carres", lsq(X, Y), X, A, vis)
    report("softmax lineaire 1000 it", softlin(X, Y, 1000, 0.05)[0], X, A, vis)
    for H, iters in [(32, 1000), (128, 1000)]:
        s = [report(f"MLP H={H} {iters} it graine {k}", mlp(X, Y, H, iters, 0.01, k)[0], X, A, vis) for k in range(3)]
        print(f"  -> moyenne {np.mean(s):.1f}")
