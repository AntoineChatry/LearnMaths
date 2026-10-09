import numpy as np
from math import lgamma, log

def log_queue(N, k, p=0.5):  # ln P(S >= k), S ~ Bin(N, p), sans dépassement de capacité
    j = np.arange(k, N + 1)
    lgam = np.vectorize(lgamma)
    t = lgam(N + 1) - lgam(j + 1) - lgam(N - j + 1) + j * log(p) + (N - j) * log(1 - p)
    return t.max() + np.log(np.exp(t - t.max()).sum())

def kl(q, p):  # divergence entre Bernoulli(q) et Bernoulli(p), en nats
    return q * log(q / p) + (1 - q) * log((1 - q) / (1 - p))

print(round(kl(0.75, 0.5), 4), 2 * 0.25**2)          # exposant de Chernoff, exposant de Hoeffding
for N in [100, 1000, 10000, 100000]:
    print(N, round(-log_queue(N, 3 * N // 4) / N, 4))
