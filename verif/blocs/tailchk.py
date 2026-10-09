from scipy.stats import binom
from math import exp, log
kl = lambda q, p: q*log(q/p) + (1-q)*log((1-q)/(1-p))
for q, N in [(0.9, 100), (0.55, 100), (0.75, 20)]:
    k = -(-int(round(q*N*1e6)) // 10**6)
    print(q, N, f"{binom.sf(k-1, N, 0.5):.2e}", f"{exp(-2*N*(q-.5)**2):.2e}", f"{exp(-N*kl(q,.5)):.2e}", min(1, 1/(4*N*(q-.5)**2)))
