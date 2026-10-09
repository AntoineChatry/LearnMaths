import numpy as np

def H(p):
    p = np.asarray(p, dtype=float).ravel()
    p = p[p > 0]
    return p @ np.log2(1 / p)

def info_mutuelle(a, b):  # deux variables discrètes, données par leurs valeurs sur des issues équiprobables
    va, ia = np.unique(a, return_inverse=True)
    vb, ib = np.unique(b, return_inverse=True)
    P = np.zeros((len(va), len(vb)))
    np.add.at(P, (ia, ib), 1 / len(a))
    return H(P.sum(axis=1)) + H(P.sum(axis=0)) - H(P)

x = np.array([-1, 0, 1])                    # X uniforme sur {-1, 0, 1}
y = x ** 2                                  # Y est une fonction de X
print(np.corrcoef(x, y)[0, 1].round(3), info_mutuelle(x, y).round(3))

x = np.arange(8)                            # X uniforme sur 0..7 : 3 bits
c = x % 2                                   # l'étiquette à prédire : la parité
print(info_mutuelle(c, x), info_mutuelle(c, x // 2), info_mutuelle(c, x % 4))
