import numpy as np

rng = np.random.default_rng(0)
for d in [2, 10, 100, 1000, 10000]:
    X = rng.standard_normal((2000, d))           # 2 000 vecteurs aléatoires, coordonnées N(0, 1)
    normes = np.linalg.norm(X, axis=1)
    print(d, round(np.sqrt(d), 1), round(normes.mean(), 1), round(normes.std(), 2), round(normes.min() / normes.max(), 2))
