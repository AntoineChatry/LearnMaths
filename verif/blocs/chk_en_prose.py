import numpy as np
from scipy import integrate, stats

H = lambda p: sum(q * np.log2(1 / q) for q in p if q > 0)
print("ln2", np.log(2), "log2 27", np.log2(27), "die", np.log2(6))
print("shannon decomposition", H([1/2, 1/3, 1/6]), H([1/2, 1/2]) + 0.5 * H([2/3, 1/3]))
print("shannon ABCD", H([1/2, 1/4, 1/8, 1/8]), 0.5 * 1 + 0.25 * 2 + 0.125 * 3 * 2)
print("kraft 0,10,110,111", 2**-1 + 2**-2 + 2**-3 + 2**-3)
# Gaussian differential entropy vs formula, and sign change threshold
for s2 in [1.0, 0.05, 1 / (2 * np.pi * np.e)]:
    d = stats.norm(0, np.sqrt(s2))
    num = integrate.quad(lambda x: -d.pdf(x) * np.log(d.pdf(x)), -60 * np.sqrt(s2), 60 * np.sqrt(s2))[0]
    print("gauss", s2, num, 0.5 * (1 + np.log(2 * np.pi * s2)))
# Maximum entropy given variance: compare Gaussian with Laplace and uniform of variance 1
print("laplace var1", stats.laplace(scale=1 / np.sqrt(2)).entropy(), "uniform var1", stats.uniform(-np.sqrt(3), 2 * np.sqrt(3)).entropy(), "gauss", stats.norm().entropy())
# T=1 distribution in the viz
z = np.array([3.0, 2.5, 1.0, 0.5, -1.0]); p = np.exp(z - z.max()); p /= p.sum(); print("T=1", p.round(3))
# Surprises at T = 0.1 (max shown in viz)
p = np.exp((z - z.max()) / 0.1); p /= p.sum(); print("T=0.1 surprises", np.log2(1 / p).round(2))
# Block coding: Huffman on pairs of English letters gets below H + 1/2
