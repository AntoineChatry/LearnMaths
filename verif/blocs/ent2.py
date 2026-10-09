import numpy as np

def entropie(p):
    p = np.asarray(p, dtype=float)
    p = p[p > 0]                          # convention 0 log(1/0) = 0
    return p @ np.log2(1 / p)

print(entropie([1/8] * 8))                                      # 8 cas équiprobables
print(entropie([1/2, 1/4, 1/8, 1/16, 1/64, 1/64, 1/64, 1/64]))  # Bishop, section 1.6
print(entropie([0.9, 0.1]).round(3), entropie([1.0, 0.0]))
print((entropie([0.5, 0.3, 0.2]) * np.log(2)).round(4))         # en nats : le 1,0297 du chapitre Vraisemblance
