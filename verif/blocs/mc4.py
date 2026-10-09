import numpy as np
from scipy import stats

k, n = 7, 10                                     # 7 « face » sur 10 lancers, a priori uniforme sur theta
def log_post(theta):                             # log p(D | theta) + log p(theta), à une constante près
    if not 0 < theta < 1:
        return -np.inf
    return k * np.log(theta) + (n - k) * np.log(1 - theta)

rng = np.random.default_rng(0)
theta, xs = 0.5, []
for t in range(60000):
    prop = theta + 0.2 * rng.standard_normal()
    if np.log(rng.random()) < log_post(prop) - log_post(theta):
        theta = prop
    xs.append(theta)
xs = np.array(xs[10000:])                        # on jette le début de la chaîne (rodage)
exact = stats.beta(k + 1, n - k + 1)             # a posteriori exact : loi Beta(8, 4)
print(round(xs.mean(), 3), round(exact.mean(), 3))
print(np.percentile(xs, [2.5, 97.5]).round(3), np.array(exact.interval(0.95)).round(3))
print(round((xs > 0.5).mean(), 3), round(exact.sf(0.5), 3))
