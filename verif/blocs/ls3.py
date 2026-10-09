import numpy as np

P = np.array([[1/2, 1/4, 1/4], [1/2, 0, 1/2], [1/4, 1/4, 1/2]])
rng = np.random.default_rng(0)
n = 100000
x = np.zeros(n, dtype=int)               # une seule chaîne, 100 000 jours, partie de Pluie
for t in range(1, n):
    x[t] = rng.choice(3, p=P[x[t - 1]])
for T in [100, 1000, 100000]:
    print(T, (np.bincount(x[:T], minlength=3) / T).round(3))
for etat in [0, 1, 2]:                   # temps moyen entre deux passages par l'état
    passages = np.flatnonzero(x == etat)
    print(etat, round(np.diff(passages).mean(), 2))
