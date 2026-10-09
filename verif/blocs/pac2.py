import numpy as np
from math import log, sqrt

def ecart(K, m, delta):  # la borne : avec proba >= 1 - delta, |R - R_emp| <= ecart pour les K hypothèses
    return sqrt((log(K) + log(2 / delta)) / (2 * m))

rng = np.random.default_rng(0)
m, delta = 50, 0.05
for K in [1, 10, 100, 1000, 10000]:
    # 2 000 répétitions de l'expérience : les K erreurs d'entraînement sont des Bin(m, 1/2) / m indépendantes
    erreurs = rng.binomial(m, 0.5, size=(2000, K)) / m
    meilleure = np.median(erreurs.min(axis=1))
    echec = np.mean(np.abs(erreurs - 0.5).max(axis=1) > ecart(K, m, delta))
    print(K, meilleure, round(0.5 - ecart(K, m, delta), 3), echec)
