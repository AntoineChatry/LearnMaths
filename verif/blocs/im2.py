import numpy as np

def H(p):
    p = np.asarray(p, dtype=float).ravel()
    p = p[p > 0]
    return p @ np.log2(1 / p)

def info_mutuelle(P):  # P[y, x] : loi jointe ; KL entre la jointe et le produit des marges
    px, py = P.sum(axis=0), P.sum(axis=1)
    Q = np.outer(py, px)
    m = P > 0
    return P[m] @ np.log2(P[m] / Q[m])

P = np.array([[1/8,  1/16, 1/32, 1/32],          # la loi jointe de la section 1
              [1/16, 1/8,  1/32, 1/32],
              [1/16, 1/16, 1/16, 1/16],
              [1/4,  0,    0,    0   ]])
px, py = P.sum(axis=0), P.sum(axis=1)
print(H(px) + H(py) - H(P), info_mutuelle(P))
print(info_mutuelle(np.outer(py, px)))            # mêmes marges, mais indépendantes
print(info_mutuelle(np.diag(px)), H(px))          # Y = X : I(X ; X) = H(X)
