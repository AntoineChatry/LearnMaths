import numpy as np
from math import comb, exp

def queue(N, k):
    return sum(comb(N, j) for j in range(k, N + 1)) / 2**N

for N in [20, 100, 400]:
    print(N, f"{queue(N, 3 * N // 4):.1e}", f"{exp(-N / 8):.1e}", 4 / N)

# Lemme de Hoeffding pour X ~ Bernoulli(p), à valeurs dans [0, 1] : E[e^{l(X - p)}] <= e^{l^2 / 8}
l = np.linspace(-30, 30, 6001)
for p in [0.01, 0.3, 0.5, 0.9]:
    mgf = (1 - p) * np.exp(-l * p) + p * np.exp(l * (1 - p))
    print(p, bool(np.all(mgf <= np.exp(l**2 / 8))), round(float(np.max(mgf / np.exp(l**2 / 8))), 6))
