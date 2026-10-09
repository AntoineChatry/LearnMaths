import numpy as np
from math import comb, pi, sqrt

rng = np.random.default_rng(0)
pas = rng.choice([-1, 1], size=(10000, 1000))     # 10 000 marches de 1 000 pas de ±1
S = pas.cumsum(axis=1)
for n in [10, 100, 1000]:
    print(n, round(S[:, n - 1].mean(), 2), round(S[:, n - 1].std(), 1), round(sqrt(n), 1))

# probabilité d'être revenu en 0 au temps 2m (Grinstead et Snell, théorème 12.1)
for m in [1, 5, 50]:
    exact = comb(2 * m, m) / 4**m
    print(2 * m, round(exact, 4), round(1 / sqrt(pi * m), 4), round((S[:, 2 * m - 1] == 0).mean(), 4))

# retour à l'origine en dimension 1, 2, 3 avant 10 000 pas (Pólya)
for d in [1, 2, 3]:
    revenus = 0
    for _ in range(1000):
        axes = rng.integers(0, d, 10000)
        signes = rng.choice([-1, 1], 10000)
        pos = np.zeros((10000, d), dtype=int)
        pos[np.arange(10000), axes] = signes
        chemin = pos.cumsum(axis=0)
        revenus += (np.abs(chemin).sum(axis=1) == 0).any()
    print(d, revenus / 1000)
