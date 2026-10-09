# Seed variance of the 20-32-3 network, and a linear softmax (no hidden layer) for comparison with least squares.
import sys
from pathlib import Path

import numpy as np

sys.path.insert(0, str(Path(__file__).parent))
import proj_mlp as pm  # runs the first experiment too; fine for a prototype

for norm_name, Xn, norm in [("whitened", pm.Xn, (pm.mu, pm.M)), ("raw", pm.X, (np.zeros(20), np.eye(20)))]:
    s = [pm.survival(pm.train(Xn, 32, 300, 0.01, seed=k)[0], norm) for k in range(8)]
    print(norm_name, "H=32 300 it, survie par graine", [round(x) for x in s], "moyenne", round(np.mean(s), 1))

# Linear softmax regression trained with Adam (cross-entropy), no hidden layer.
rng = np.random.default_rng(0)
Xa = np.hstack([pm.Xn, np.ones((len(pm.Xn), 1))])
T = np.zeros((21, 3))
m = np.zeros_like(T); v = np.zeros_like(T)
for t in range(1, 1001):
    Pr = pm.softmax(Xa @ T)
    G = Xa.T @ (Pr - pm.Y) / len(Xa)
    m = 0.9 * m + 0.1 * G; v = 0.999 * v + 0.001 * G**2
    T -= 0.05 * (m / (1 - 0.9**t)) / (np.sqrt(v / (1 - 0.999**t)) + 1e-8)
L = -np.sum(pm.Y * np.log(pm.softmax(Xa @ T))) / len(Xa)
W, b = T[:-1].T, T[-1]
s = pm.g["_evaluate"](lambda p: int(np.argmax(W @ ((pm.g["percevoir"](p) - pm.mu) @ pm.M) + b)) - 1)
print("linear softmax: loss", round(L, 3), "survie", s)
acc_lin = np.mean(np.argmax(Xa @ T, 1) == pm.A + 1)
print("linear softmax train accuracy", round(acc_lin, 3))
