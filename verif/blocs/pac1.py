import numpy as np

rng = np.random.default_rng(0)
m = 50
y = rng.integers(0, 2, m)              # étiquettes tirées à pile ou face : il n'y a rien à apprendre
for K in [1, 10, 100, 1000, 10000]:
    H = rng.integers(0, 2, (K, m))     # K classifieurs au hasard, et leurs prédictions sur les m exemples
    erreurs = (H != y).mean(axis=1)    # erreur d'entraînement de chacun
    print(K, erreurs.min())            # celle du meilleur ; son vrai risque reste 0,5
