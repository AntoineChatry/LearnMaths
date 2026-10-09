import numpy as np
from math import log
from scipy.spatial.distance import pdist

rng = np.random.default_rng(0)
N, d = 300, 5000
centres = 10 * rng.standard_normal((5, d))
X = centres[rng.integers(0, 5, N)] + rng.standard_normal((N, d))   # 300 points en 5 grappes, en dimension 5 000
D2 = pdist(X) ** 2                                # les 44 850 distances au carré d'origine
for k in [200, 800, 3200]:
    A = rng.standard_normal((k, d)) / np.sqrt(k)  # projection aléatoire (Mohri, lemme 15.4)
    eps = np.abs(pdist(X @ A.T) ** 2 / D2 - 1).max()   # pire déformation sur toutes les paires
    print(k, round(eps, 3), round(20 * log(N) / eps**2))
