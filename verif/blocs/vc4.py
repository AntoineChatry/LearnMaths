import itertools
from mpmath import mp, mpf, pi, sin

mp.dps = 60                                     # omega devient énorme : calcul en haute précision

def omega(y):  # la fréquence qui réalise l'étiquetage y sur les points x_i = 10^(-i)
    return pi * (1 + sum((1 - yi) * 10**i for i, yi in enumerate(y, 1)))

for m in [3, 6, 10]:
    x = [mpf(10) ** -i for i in range(1, m + 1)]
    reussis = sum(
        all((sin(omega(y) * xi) > 0) == bool(yi) for xi, yi in zip(x, y))
        for y in itertools.product([0, 1], repeat=m)
    )
    print(m, 2**m, reussis)
