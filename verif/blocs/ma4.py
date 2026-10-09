import numpy as np

rng = np.random.default_rng(0)
# Ornstein-Uhlenbeck dx = -lam x dt + dB (diffusion q = 1), schéma d'Euler-Maruyama
lam, dt, T = 0.5, 0.01, 20.0
x = np.full(10000, 3.0)                           # 10 000 trajectoires, toutes parties de 3
for k in range(int(T / dt)):
    x = x - lam * x * dt + np.sqrt(dt) * rng.standard_normal(10000)
print(round(x.mean(), 2), round(x.var(), 2), 1 / (2 * lam))   # loi stationnaire N(0, q / 2 lam)

# la même idée en temps discret : x <- sqrt(1 - beta) x + sqrt(beta) eps garde la variance 1
beta = 0.02
x0 = np.full(10000, 3.0)
x = x0.copy()
for t in range(1, 201):
    x = np.sqrt(1 - beta) * x + np.sqrt(beta) * rng.standard_normal(10000)
    if t in (10, 50, 200):
        abar = (1 - beta) ** t                    # forme fermée : N(sqrt(abar) x0, (1 - abar))
        print(t, round(x.mean(), 3), round(3 * np.sqrt(abar), 3), round(x.var(), 3), round(1 - abar, 3))
