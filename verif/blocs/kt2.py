import numpy as np

# Un modèle à variable latente z dans {0, 1, 2}, et une donnée x observée
prior = np.array([0.5, 0.3, 0.2])           # p(z)
vrais = np.array([0.1, 0.6, 0.3])           # p(x | z) pour la donnée x
jointe = prior * vrais                      # p(x, z)
px = jointe.sum()                           # p(x) = 0,29
post = jointe / px                          # la vraie loi a posteriori p(z | x)

def elbo(q):
    return q @ (np.log(jointe) - np.log(q))

def kl(a, b):
    return a @ np.log(a / b)

for q in [np.array([1/3, 1/3, 1/3]), np.array([0.2, 0.5, 0.3]), post]:
    print(round(np.log(px), 4), round(elbo(q), 4), round(kl(q, post), 4))

# Terme KL d'un VAE, une dimension : q = N(mu, sigma^2), prior N(0, 1)
mu, sigma = 1.0, 0.5
formule = 0.5 * (mu**2 + sigma**2 - 1 - np.log(sigma**2))
rng = np.random.default_rng(0)
z = mu + sigma * rng.standard_normal(1_000_000)          # reparamétrisation
log_q = -0.5 * ((z - mu) / sigma) ** 2 - np.log(sigma) - 0.5 * np.log(2 * np.pi)
log_p = -0.5 * z**2 - 0.5 * np.log(2 * np.pi)
print(round(formule, 4), round(np.mean(log_q - log_p), 4))
