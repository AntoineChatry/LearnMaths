import numpy as np

P = np.array([[1/2, 1/4, 1/4],     # pays d'Oz : Pluie, Beau, Neige
              [1/2, 0,   1/2],
              [1/4, 1/4, 1/2]])
# pi P = pi  <=>  pi est vecteur propre à gauche (donc de P transposée) pour la valeur propre 1
vals, vecs = np.linalg.eig(P.T)
pi = np.real(vecs[:, np.argmin(abs(vals - 1))])
pi = pi / pi.sum()                       # on normalise pour obtenir une loi
print(pi.round(3), (pi @ P).round(3))
# autre méthode : résoudre pi (P - I) = 0 avec la contrainte sum(pi) = 1
A = np.vstack([(P - np.eye(3)).T, np.ones(3)])
print(np.linalg.lstsq(A, [0, 0, 0, 1], rcond=None)[0].round(3))

# marche aléatoire sur le graphe de Levin et Peres (figure 1.4) : pi proportionnelle aux degrés
aretes = [(1, 2), (1, 3), (2, 3), (2, 4), (3, 4), (3, 5)]
G = np.zeros((5, 5))
for a, b in aretes:
    G[a - 1, b - 1] = G[b - 1, a - 1] = 1
deg = G.sum(axis=1)
Q = G / deg[:, None]                     # P(x, y) = 1/deg(x) pour chaque voisin y
print(deg, (deg / deg.sum() @ Q * 12).round(3))
