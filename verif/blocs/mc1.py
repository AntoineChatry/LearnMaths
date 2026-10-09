import numpy as np

def stationnaire(pi, P):
    return np.allclose(pi @ P, pi)

def equilibre_detaille(pi, P):                # pi(x) P(x, y) = pi(y) P(y, x) pour tous x, y
    F = pi[:, None] * P                       # F[x, y] : flux de probabilité de x vers y
    return np.allclose(F, F.T)

# chaîne à trois états qui ne saute qu'entre voisins
P = np.array([[1/2, 1/2, 0], [1/4, 1/2, 1/4], [0, 1/2, 1/2]])
pi = np.array([1, 2, 1]) / 4
print(stationnaire(pi, P), equilibre_detaille(pi, P))

# marche biaisée sur un cycle de 5 sommets (Levin et Peres, exemple 1.22)
n, p = 5, 0.8
C = np.zeros((n, n))
for k in range(n):
    C[k, (k + 1) % n], C[k, (k - 1) % n] = p, 1 - p   # sens horaire avec probabilité 0,8
u = np.ones(n) / n
print(stationnaire(u, C), equilibre_detaille(u, C))
