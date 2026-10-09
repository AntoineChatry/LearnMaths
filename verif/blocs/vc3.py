import numpy as np
from math import e, log, sqrt

def ecart_vc(d, m, delta):  # Mohri, corollaire 3.19
    return sqrt(2 * d * log(e * m / d) / m) + sqrt(log(1 / delta) / (2 * m))

def meilleur_intervalle(y):  # ERM sur les intervalles : erreurs = nb de 1 - max(0, meilleur bloc de (+1 pour 1, -1 pour 0))
    s = 2 * y - 1
    meilleur = courant = 0
    for v in s:
        courant = max(0, courant + v)
        meilleur = max(meilleur, courant)
    return (y.sum() - meilleur) / len(y)

rng = np.random.default_rng(0)
delta = 0.05
for m in [50, 200, 1000, 5000]:
    erreurs = np.array([meilleur_intervalle(rng.integers(0, 2, m)) for _ in range(2000)])
    plancher = 0.5 - ecart_vc(2, m, delta)
    print(m, np.median(erreurs), round(plancher, 3), np.mean(erreurs < plancher))
