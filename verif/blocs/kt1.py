import numpy as np

x = np.linspace(-8, 8, 4001)
dx = x[1] - x[0]

def gauss(x, mu, s):
    return np.exp(-(x - mu) ** 2 / (2 * s * s)) / (s * np.sqrt(2 * np.pi))

p = 0.5 * gauss(x, -2, 0.6) + 0.5 * gauss(x, 2, 0.6)    # deux bosses, en -2 et en 2

def kl(a, b):  # divergence en nats, par une somme de Riemann
    return np.sum(a * np.log(a / b)) * dx

# Toutes les gaussiennes q(mu, s) d'une grille, et les deux sens de la divergence
grille = [(mu, s) for mu in np.arange(-3, 3.01, 0.05) for s in np.arange(0.3, 3.01, 0.01)]
directe = min(grille, key=lambda m: kl(p, gauss(x, *m)))      # min de D(p || q)
inverse = min(grille, key=lambda m: kl(gauss(x, *m), p))      # min de D(q || p)
print(f"{abs(directe[0]):.2f} {directe[1]:.2f} | {inverse[0]:.2f} {inverse[1]:.2f}")
print(f"{np.sqrt(0.6**2 + 2**2):.2f}")                       # écart type de p
for q in [directe, inverse]:
    print(f"{kl(p, gauss(x, *q)):.3f} {kl(gauss(x, *q), p):.3f}")
# 0.00 2.09 | 2.00 0.60
# 2.09
# 0.432 0.871
# 3.960 0.692
