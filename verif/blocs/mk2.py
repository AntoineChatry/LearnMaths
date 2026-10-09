import numpy as np

P = np.array([[1/2, 1/4, 1/4],
              [1/2, 0,   1/2],
              [1/4, 1/4, 1/2]])
u = np.array([1/3, 1/3, 1/3])                 # jour 0 : météo tirée au hasard
for n in [1, 2, 3, 10]:
    print(n, (u @ np.linalg.matrix_power(P, n)).round(3))
# trajectoire Pluie, Pluie, Beau, Neige en partant de Pluie
print(P[0, 0] * P[0, 1] * P[1, 2])
rng = np.random.default_rng(0)
X = np.zeros((100000, 4), dtype=int)          # 100 000 chaînes simulées, toutes parties de Pluie (état 0)
for t in range(1, 4):
    for i in range(100000):
        X[i, t] = rng.choice(3, p=P[X[i, t - 1]])
print((X[:, 1:] == [0, 1, 2]).all(axis=1).mean(), np.bincount(X[:, 3]) / 100000)
print(np.linalg.matrix_power(P, 3)[0].round(3))
