import numpy as np

T = 1000
beta = np.linspace(1e-4, 0.02, T)
alpha, abar = 1 - beta, np.cumprod(1 - beta)

t, x0 = 300, 1.5                                 # on remonte de x_300 à x_299, en connaissant x_0
b, a, ab, ab1 = beta[t - 1], alpha[t - 1], abar[t - 1], abar[t - 2]
# formule de Ho et al. (éq. 6 et 7) pour q(x_{t-1} | x_t, x_0)
coef_x0 = np.sqrt(ab1) * b / (1 - ab)
coef_xt = np.sqrt(a) * (1 - ab1) / (1 - ab)
var_post = (1 - ab1) / (1 - ab) * b

# vérification directe : (x_{t-1}, x_t) sachant x_0 est un couple gaussien, on conditionne
m = np.array([np.sqrt(ab1) * x0, np.sqrt(ab) * x0])           # moyennes
C = np.array([[1 - ab1, np.sqrt(a) * (1 - ab1)],              # covariances
              [np.sqrt(a) * (1 - ab1), 1 - ab]])
pente = C[0, 1] / C[1, 1]                                     # E(x_{t-1} | x_t) = m0 + pente (x_t - m1)
print(round(coef_xt, 6), round(pente, 6))
print(round(coef_x0 * x0, 6), round(m[0] - pente * m[1], 6))
print(round(var_post, 6), round(C[0, 0] - C[0, 1]**2 / C[1, 1], 6))

# et par simulation : on garde les tirages où x_t tombe près de 0,7
rng = np.random.default_rng(0)
xs1 = np.sqrt(ab1) * x0 + np.sqrt(1 - ab1) * rng.standard_normal(4_000_000)
xst = np.sqrt(a) * xs1 + np.sqrt(b) * rng.standard_normal(4_000_000)
garde = np.abs(xst - 0.7) < 0.005
print(round(xs1[garde].mean(), 4), round(coef_x0 * x0 + coef_xt * 0.7, 4), round(xs1[garde].var(), 5), round(var_post, 5))
