import numpy as np

T = 1000
beta = np.linspace(1e-4, 0.02, T)                # calendrier linéaire de Ho et al. (section 4)
abar = np.cumprod(1 - beta)                      # abar_t = (1 - beta_1) ... (1 - beta_t)

rng = np.random.default_rng(0)
n = 100000                                       # « données » : 0,3 N(-2, 0,5²) + 0,7 N(2, 0,5²)
x0 = np.where(rng.random(n) < 0.3, -2.0, 2.0) + 0.5 * rng.standard_normal(n)
for t in [1, 100, 250, 500, 1000]:
    a = abar[t - 1]
    xt = np.sqrt(a) * x0 + np.sqrt(1 - a) * rng.standard_normal(n)   # éq. 4, sans passer par les pas
    print(t, f"{a:.2g}", round(np.sqrt(a), 3), round(xt.mean(), 2), round(xt.var(), 2), round((xt > 0).mean(), 2))
