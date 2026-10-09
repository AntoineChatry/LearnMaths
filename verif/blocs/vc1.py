import itertools
import numpy as np
from scipy.optimize import linprog

def intervalle(y):  # réalisable par un intervalle [a, b] : les 1 forment un seul bloc
    return "0" not in "".join(map(str, y)).strip("0")

def demi_plan(X, y):  # existe-t-il w, b avec w.x + b >= 1 sur les 1 et <= -1 sur les 0 ? (programme linéaire)
    s = 2 * np.array(y) - 1
    A = -s[:, None] * np.hstack([X, np.ones((len(X), 1))])
    res = linprog(np.zeros(3), A_ub=A, b_ub=-np.ones(len(X)), bounds=(None, None))
    return res.status == 0

rng = np.random.default_rng(0)
for m in range(1, 7):
    X = rng.normal(size=(m, 2))                       # m points du plan, en position générale
    etiquetages = list(itertools.product([0, 1], repeat=m))
    print(m, 2**m, sum(map(intervalle, etiquetages)), sum(demi_plan(X, y) for y in etiquetages))
