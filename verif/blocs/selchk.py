# Independent check of SelectionViz: median of the min of K iid Bin(m, 1/2)/m, and the bound floor.
from math import log, sqrt
from scipy.stats import binom
def median_best(m, K):
    for k in range(m + 1):
        if 1 - (1 - binom.cdf(k, m, 0.5)) ** K >= 0.5:
            return k / m
for m, K in [(50, 10**5), (50, 10**6), (1000, 10**3), (20, 10**6)]:
    print(m, K, median_best(m, K), round(0.5 - sqrt((log(K) + log(40)) / (2 * m)), 3))
