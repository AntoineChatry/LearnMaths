import numpy as np

T = 1000
beta = np.linspace(1e-4, 0.02, T)
alpha, abar = 1 - beta, np.cumprod(1 - beta)
poids, mu, s = np.array([0.3, 0.7]), np.array([-2.0, 2.0]), 0.5     # données : 0,3 N(-2, 0,5²) + 0,7 N(2, 0,5²)

def score(x, t):                                 # grad log q_t(x), exact : q_t est encore un mélange de gaussiennes
    m = np.sqrt(abar[t - 1]) * mu                # chaque composante devient N(sqrt(abar) mu, abar s² + 1 - abar)
    v = abar[t - 1] * s**2 + 1 - abar[t - 1]
    dens = poids * np.exp(-(x[:, None] - m)**2 / (2 * v))
    return (dens * (m - x[:, None]) / v).sum(axis=1) / dens.sum(axis=1)

def eps_ideal(x, t):                             # le meilleur prédicteur du bruit : -sqrt(1 - abar) x score
    return -np.sqrt(1 - abar[t - 1]) * score(x, t)

rng = np.random.default_rng(0)
x = rng.standard_normal(100000)                  # algorithme 2 de Ho et al. : on part du bruit pur
for t in range(T, 0, -1):
    z = rng.standard_normal(x.size) if t > 1 else 0
    x = (x - beta[t - 1] / np.sqrt(1 - abar[t - 1]) * eps_ideal(x, t)) / np.sqrt(alpha[t - 1]) + np.sqrt(beta[t - 1]) * z
print(round(x.mean(), 3), round((x > 0).mean(), 3), round(x[x > 0].std(), 3), round(x[x < 0].mean(), 3))
# cible : moyenne 0,8 ; 70 % à droite ; écart-type 0,5 dans chaque bosse ; bosse de gauche centrée en -2
