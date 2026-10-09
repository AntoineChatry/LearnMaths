import numpy as np

# graphe du web de Manning et al., figure 21.4 : liens sortants de chaque page d0 ... d6
liens = {0: [2], 1: [1, 2], 2: [0, 2, 3], 3: [3, 4], 4: [6], 5: [5, 6], 6: [3, 4, 6]}
N, alpha = 7, 0.14                       # alpha : probabilité de téléportation
A = np.zeros((N, N))
for i, js in liens.items():
    A[i, js] = 1
P = (1 - alpha) * A / A.sum(axis=1, keepdims=True) + alpha / N
print(P[0].round(2), P[2].round(2))      # lignes de l'exemple 21.1

x = np.ones(N) / N                       # itération de la puissance : x <- x P
for t in range(100):
    x = x @ P
print(x.round(2))
print(np.abs(x @ P - x).max() < 1e-12)

# formule de Brin et Page : PR(A) = (1 - d) + d * somme des PR(T) / C(T), avec d = 1 - alpha
d = 1 - alpha
PR = np.ones(N)
for t in range(100):
    PR = (1 - d) + d * (PR / A.sum(axis=1)) @ A
print(PR.sum().round(3), (PR / N).round(2))
