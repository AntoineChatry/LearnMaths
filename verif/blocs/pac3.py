import numpy as np
from math import log

grille = np.arange(10_001) / 10_000    # H : 10 001 seuils t ; h_t(x) = 1 si x >= t
cible = 0.3712                         # la vraie règle est dans H : le cas réalisable
rng = np.random.default_rng(0)

def apprendre(x, y):  # ERM : le plus petit seuil de la grille qui ne se trompe sur aucun exemple
    plus_grand_negatif = x[y == 0].max(initial=0.0)
    return grille[grille > plus_grand_negatif][0]

delta = 0.05
for m in [25, 100, 400, 1600]:
    risques = []
    for _ in range(2000):
        x = rng.random(m)
        y = (x >= cible).astype(int)
        risques.append(abs(apprendre(x, y) - cible))   # x uniforme : le risque est l'écart des seuils
    borne = (log(len(grille)) + log(1 / delta)) / m
    print(m, round(np.median(risques), 4), round(borne, 4), np.mean(np.array(risques) > borne))
