from math import comb, e

def sauer(m, d):  # borne du lemme de Sauer : nombre de sous-ensembles d'au plus d points parmi m
    return sum(comb(m, i) for i in range(d + 1))

d = 3                                      # demi-plans du plan
for m in [3, 4, 10, 100, 1000]:
    print(m, f"{2**m:.1e}", sauer(m, d), f"{(e * m / d)**d:.1e}")
