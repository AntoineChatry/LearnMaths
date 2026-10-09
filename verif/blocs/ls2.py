import numpy as np

def tv(mu, pi):                          # distance en variation totale
    return 0.5 * np.abs(mu - pi).sum()

def suite(P, mu, pi, T=6):               # distance à pi après 1, 2, ..., T pas
    out = []
    for _ in range(T):
        mu = mu @ P
        out.append(round(float(tv(mu, pi)), 4))
    return out

oz = np.array([[1/2, 1/4, 1/4], [1/2, 0, 1/2], [1/4, 1/4, 1/2]])
print(np.round(np.linalg.eigvals(oz), 2), suite(oz, np.eye(3)[0], np.array([0.4, 0.2, 0.4])))

# urne d'Ehrenfest à 4 boules (Grinstead et Snell, exemple 11.17) : période 2
E = np.zeros((5, 5))
for k in range(5):
    if k > 0: E[k, k - 1] = k / 4
    if k < 4: E[k, k + 1] = (4 - k) / 4
pi = np.array([1, 4, 6, 4, 1]) / 16
print((pi @ E - pi).round(12), suite(E, np.eye(5)[0], pi))
L = (np.eye(5) + E) / 2                  # version paresseuse : reste sur place une fois sur deux
print(suite(L, np.eye(5)[0], pi, T=12)[1::2])

# deux états absorbants : la limite dépend du départ
D = np.array([[1, 0, 0], [1/2, 0, 1/2], [0, 0, 1]])
for depart in [0, 1, 2]:
    print(depart, (np.eye(3)[depart] @ np.linalg.matrix_power(D, 50)).round(3))
