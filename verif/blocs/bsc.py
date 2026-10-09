import numpy as np

def H(p):
    p = np.asarray(p, dtype=float).ravel()
    p = p[p > 0]
    return p @ np.log2(1 / p)

for e in [0, 0.01, 0.05, 0.1, 0.15, 0.2, 0.3, 0.4, 0.5]:
    P = np.array([[(1 - e) / 2, e / 2], [e / 2, (1 - e) / 2]])
    I = H(P.sum(0)) + H(P.sum(1)) - H(P)
    print(e, round(H(P) - H(P.sum(0)), 3), round(I, 3), round(H(P), 3))
