import numpy as np

rng = np.random.default_rng(0)
for d in [2, 10, 100, 1000, 10000]:
    X = rng.standard_normal((2000, d))
    Y = rng.standard_normal((2000, d))
    cos = (X * Y).sum(axis=1) / (np.linalg.norm(X, axis=1) * np.linalg.norm(Y, axis=1))
    angles = np.degrees(np.arccos(cos))
    print(d, round(np.sqrt((cos**2).mean() * d), 2), np.percentile(angles, [2.5, 97.5]).round(1))
