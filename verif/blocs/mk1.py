import numpy as np

# Pays d'Oz (Grinstead et Snell, exemple 11.1) : états Pluie, Beau, Neige
P = np.array([[1/2, 1/4, 1/4],
              [1/2, 0,   1/2],
              [1/4, 1/4, 1/2]])
print(P.sum(axis=1))                          # chaque ligne est une loi : somme 1
P2 = P @ P
print(P2[0, 2], sum(P[0, k] * P[k, 2] for k in range(3)))   # p(2) Pluie -> Neige, deux façons
for n in [2, 3, 6]:
    print(n, np.linalg.matrix_power(P, n).round(3).tolist())
