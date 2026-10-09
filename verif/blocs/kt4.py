import numpy as np

ref = np.array([0.4, 0.3, 0.2, 0.1])   # pi_ref : le modèle de départ, sur 4 réponses possibles
r = np.array([0.0, 1.0, 2.0, 3.0])     # la note du modèle de récompense pour chaque réponse

def kl(a, b):
    m = a > 0
    return a[m] @ np.log(a[m] / b[m])

def objectif(pi, beta):                # récompense moyenne moins la laisse KL
    return pi @ r - beta * kl(pi, ref)

def optimale(beta):                    # pi* = pi_ref exp(r / beta) / Z
    w = ref * np.exp(r / beta)
    return w / w.sum(), np.log(w.sum())

rng = np.random.default_rng(0)
for beta in [5.0, 1.0, 0.2]:
    pi, logZ = optimale(beta)
    autres = max(objectif(rng.dirichlet(np.ones(4)), beta) for _ in range(20_000))
    print(beta, pi.round(3), round(pi @ r, 3), round(kl(pi, ref), 3))
    print("  ", round(objectif(pi, beta), 4), round(beta * logZ, 4), autres < objectif(pi, beta))
