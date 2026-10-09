# Step 7 prototype: variance of the pre-activations y_l through 30 ReLU layers of width 256 (He et al. 2015, eq. 9),
# fed with real whitened visions, for He (std sqrt(2/n)), Xavier (sqrt(1/n)) and std 0.01. Several seeds.
import sys
from pathlib import Path

import numpy as np

sys.path.insert(0, str(Path(__file__).parent))
from proj_monde import load

g = load()
X, A = g["_expert_data"](g["percevoir"])
mu, M = g["normaliser"](X)
Xn = (X - mu) @ M
print("inputs: mean square", round(float((Xn**2).mean()), 4))

LAYERS, WIDTH = 30, 256


def variances(std_of_n, seed, batch=500):
    rng = np.random.default_rng(seed)
    x = Xn[rng.choice(len(Xn), batch, replace=False)]
    out = []
    for l in range(LAYERS):
        n = x.shape[1]
        W = rng.normal(0, std_of_n(n), size=(WIDTH, n))
        y = x @ W.T
        out.append(float(y.var()))
        x = np.maximum(y, 0)
    return np.array(out)


for name, f in [("He", lambda n: np.sqrt(2 / n)), ("Xavier", lambda n: np.sqrt(1 / n)), ("0.01", lambda n: 0.01)]:
    for seed in range(3):
        v = variances(f, seed)
        print(f"{name:6s} graine {seed}: Var[y_1] {v[0]:.3g}  Var[y_10] {v[9]:.3g}  Var[y_30] {v[-1]:.3g}  ratio y30/y1 {v[-1]/v[0]:.3g}")
print("theorie Xavier : ratio 2^-29 =", 2.0**-29, "; 0.01 : (0.01^2 * 256 / 2)^29 =", (1e-4 * 256 / 2) ** 29)
