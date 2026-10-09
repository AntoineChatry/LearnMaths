import numpy as np
from scipy.stats import norm

bmin, bmax = 0.1, 20.0                           # VP SDE de Song et al. (éq. 32)
beta = lambda t: bmin + t * (bmax - bmin)
def a(t):                                        # x(t) | x(0) ~ N(a(t) x(0), 1 - a(t)²)  (éq. 33)
    return np.exp(-0.25 * t**2 * (bmax - bmin) - 0.5 * t * bmin)

poids, mu, s = np.array([0.3, 0.7]), np.array([-2.0, 2.0]), 0.5
def score(x, t):                                 # grad log p_t(x), exact pour le mélange de gaussiennes
    m, v = a(t) * mu, a(t)**2 * s**2 + 1 - a(t)**2
    dens = poids * np.exp(-(x[:, None] - m)**2 / (2 * v))
    return (dens * (m - x[:, None]) / v).sum(axis=1) / dens.sum(axis=1)

rng = np.random.default_rng(0)
N = 1000
dt = 1 / N
z0 = rng.standard_normal(50000)                  # bruit de départ, au temps t = 1
x_sde, x_ode = z0.copy(), z0.copy()
for k in range(N, 0, -1):                        # on remonte le temps de t = 1 à t = 0
    t = k / N
    f_sde = -0.5 * beta(t) * x_sde - beta(t) * score(x_sde, t)           # éq. 6 : f - g² score
    x_sde = x_sde - f_sde * dt + np.sqrt(beta(t) * dt) * rng.standard_normal(x_sde.size)
    f_ode = -0.5 * beta(t) * x_ode - 0.5 * beta(t) * score(x_ode, t)     # éq. 13 : f - g² score / 2
    x_ode = x_ode - f_ode * dt
for x in (x_sde, x_ode):
    print(round(x.mean(), 2), round((x > 0).mean(), 3), round(x[x > 0].std(), 2))
# l'équation déterministe envoie chaque bruit sur un point précis : la frontière est au quantile 30 %
print(round(norm.ppf(0.3), 3), round(z0[x_ode < 0].max(), 3), round(z0[x_ode > 0].min(), 3))
