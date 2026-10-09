import numpy as np
from math import ceil, log

def taille_test(eps, delta, K=1):  # n tel que 2 K e^{-2 n eps^2} <= delta
    return ceil(log(2 * K / delta) / (2 * eps**2))

print(taille_test(0.01, 0.05), taille_test(0.01, 0.05, K=1000))
print(ceil(1 / (4 * 0.05 * 0.01**2)), ceil(1000 / (4 * 0.05 * 0.01**2)))   # Tchebychev, 1 puis 1000 modèles

# Vérification : un classifieur de précision réelle p, testé 100 000 fois sur n exemples
rng = np.random.default_rng(0)
n = taille_test(0.01, 0.05)
for p in [0.5, 0.9]:
    precision = rng.binomial(n, p, size=100_000) / n
    print(p, np.mean(np.abs(precision - p) > 0.01))
