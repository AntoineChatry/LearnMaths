import warnings
import numpy as np
from sklearn.neural_network import MLPRegressor

warnings.filterwarnings("ignore")                # 20 passes suffisent ici, on tait l'avertissement de convergence
T = 1000
beta = np.linspace(1e-4, 0.02, T)
alpha, abar = 1 - beta, np.cumprod(1 - beta)
rng = np.random.default_rng(0)

# algorithme 1 de Ho et al. : x_0 tiré des données, t au hasard, on bruite, on apprend à retrouver le bruit
n = 300000
x0 = np.where(rng.random(n) < 0.3, -2.0, 2.0) + 0.5 * rng.standard_normal(n)
t = rng.integers(1, T + 1, n)
eps = rng.standard_normal(n)
xt = np.sqrt(abar[t - 1]) * x0 + np.sqrt(1 - abar[t - 1]) * eps
reseau = MLPRegressor(hidden_layer_sizes=(64, 64), max_iter=20, random_state=0)
reseau.fit(np.column_stack([xt, t / T]), eps)    # perte : || eps - eps_theta(x_t, t) ||²  (éq. 14)
m = np.sqrt(abar[t - 1])[:, None] * np.array([-2.0, 2.0])          # prédicteur idéal du bloc précédent
v = (abar[t - 1] * 0.25 + 1 - abar[t - 1])[:, None]
dens = np.array([0.3, 0.7]) * np.exp(-(xt[:, None] - m)**2 / (2 * v))
ideal = -np.sqrt(1 - abar[t - 1]) * (dens * (m - xt[:, None]) / v).sum(axis=1) / dens.sum(axis=1)
print(round(np.mean((reseau.predict(np.column_stack([xt, t / T])) - eps)**2), 3), round(np.mean((ideal - eps)**2), 3))

# algorithme 2 avec le réseau appris à la place du vrai bruit
x = rng.standard_normal(20000)
for s in range(T, 0, -1):
    e = reseau.predict(np.column_stack([x, np.full(x.size, s / T)]))
    z = rng.standard_normal(x.size) if s > 1 else 0
    x = (x - beta[s - 1] / np.sqrt(1 - abar[s - 1]) * e) / np.sqrt(alpha[s - 1]) + np.sqrt(beta[s - 1]) * z
print(round(x.mean(), 2), round((x > 0).mean(), 2), round(x[x > 0].std(), 2), round(x[x < 0].mean(), 2))
