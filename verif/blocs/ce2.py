import numpy as np

np.seterr(divide="ignore")  # 1/0 donne inf, sans avertissement

def kl(p, q):  # divergence de Kullback-Leibler, en bits
    p, q = np.asarray(p, float), np.asarray(q, float)
    m = p > 0
    return p[m] @ np.log2(p[m] / q[m])

p, q = [1/2, 1/2], [3/4, 1/4]               # Cover et Thomas, exemple 2.3.1
print(kl(p, q).round(4), kl(q, p).round(4), kl(p, p))
print(kl([0.9, 0.1], [1.0, 0.0]), kl([1.0, 0.0], [0.9, 0.1]).round(3))

rng = np.random.default_rng(0)
d = [kl(rng.dirichlet(np.ones(5)), rng.dirichlet(np.ones(5))) for _ in range(100_000)]
print(min(d) >= 0, round(min(d), 5))
