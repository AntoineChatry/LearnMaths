import numpy as np

def log_p(x):                                   # 0,3 N(-2, 0,5²) + 0,7 N(2, 0,5²), sans la constante
    return np.logaddexp(np.log(0.3) - (x + 2)**2 / 0.5, np.log(0.7) - (x - 2)**2 / 0.5)

def metropolis(pas, n, rng, x=0.0):
    xs, acc = np.empty(n), 0
    for t in range(n):
        y = x + pas * rng.standard_normal()      # proposition gaussienne centrée sur x
        if np.log(rng.random()) < log_p(y) - log_p(x):
            x, acc = y, acc + 1
        xs[t] = x
    return xs, acc / n

rng = np.random.default_rng(0)
for pas in [0.1, 1.0, 3.0, 30.0]:
    xs, taux = metropolis(pas, 20000, rng)
    sauts = np.sum(np.diff(np.sign(xs)) != 0)    # passages d'un mode à l'autre
    print(pas, round(taux, 2), round(xs.mean(), 2), round((xs > 0).mean(), 2), sauts)
# vraie moyenne : 0,3 x (-2) + 0,7 x 2 = 0,8 ; vraie masse à droite : 0,7
