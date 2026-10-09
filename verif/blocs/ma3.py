import numpy as np
from scipy.stats import norm

rng = np.random.default_rng(0)
n = 1000                                          # pas par unité de temps
lois = {
    "±1": lambda size: rng.choice([-1.0, 1.0], size),
    "uniforme": lambda size: rng.uniform(-np.sqrt(3), np.sqrt(3), size),   # moyenne 0, variance 1
}
for nom, tirer in lois.items():
    S = tirer((10000, n)).cumsum(axis=1) / np.sqrt(n)   # S_[nt] / sqrt(n) pour t dans [0, 1]
    fin, maxi = S[:, -1], S.max(axis=1)
    moitie = S[:, n // 2 - 1]
    print(nom, round(fin.var(), 2), round(np.cov(moitie, fin)[0, 1], 2),
          round((fin > 1).mean(), 3), round((maxi > 1).mean(), 3))
print(round(norm.sf(1), 3), round(2 * norm.sf(1), 3))   # P(B_1 > 1) et P(max B > 1) = 2 P(B_1 > 1)
