# Deterministic SVD sign check, to run both in CPython and in Pyodide: does np.linalg.svd pick the same signs?
import numpy as np

i = np.arange(500)[:, None]
j = np.arange(20)[None, :]
X = (((i * 7 + j * 13) % 11 == 0) | ((i * j) % 5 == 1)).astype(float)
U, s, Vt = np.linalg.svd(X - X.mean(axis=0), full_matrices=False)
print("s[:3]", np.round(s[:3], 6).tolist())
print("signes de la 1re coordonnee de chaque axe", np.sign(Vt[:, 0]).astype(int).tolist())
