import numpy as np

h = np.array([1, 3, 8, 4, 1, 1, 6, 9, 3, 1.0])   # loi cible connue à une constante près
n = len(h)

def metropolis(h, x0, pas, rng):
    x, xs, acc = x0, np.empty(pas, dtype=int), 0
    for t in range(pas):
        y = x + rng.choice([-1, 1])               # proposition symétrique : un voisin au hasard
        if 0 <= y < n and rng.random() < min(1, h[y] / h[x]):   # Z n'intervient jamais
            x, acc = y, acc + 1
        xs[t] = x
    return xs, acc / pas

rng = np.random.default_rng(0)
xs, taux = metropolis(h, 0, 200000, rng)
print((h / h.sum()).round(3))
print((np.bincount(xs, minlength=n) / len(xs)).round(3), round(taux, 2))

# matrice de transition exacte de la chaîne de Metropolis (Levin et Peres, équation 3.5)
P = np.zeros((n, n))
for x in range(n):
    for y in (x - 1, x + 1):
        if 0 <= y < n:
            P[x, y] = 0.5 * min(1, h[y] / h[x])
    P[x, x] = 1 - P[x].sum()
pi = h / h.sum()
print(np.abs(pi @ P - pi).max() < 1e-15, np.allclose(pi[:, None] * P, (pi[:, None] * P).T))

# graphe de Levin et Peres (figure 1.4) : la marche simple visite chaque sommet en proportion de son degré ;
# en acceptant le pas x -> y avec probabilité min(1, deg(x)/deg(y)), on la rend uniforme (exemple 3.3)
voisins = {0: [1, 2], 1: [0, 2, 3], 2: [0, 1, 3, 4], 3: [1, 2], 4: [2]}
deg = {x: len(v) for x, v in voisins.items()}
for metro in (False, True):
    x, compte = 0, np.zeros(5)
    for t in range(200000):
        y = rng.choice(voisins[x])
        if not metro or rng.random() < min(1, deg[x] / deg[y]):
            x = y
        compte[x] += 1
    print(metro, (compte / compte.sum()).round(3))
