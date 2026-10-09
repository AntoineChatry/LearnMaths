import numpy as np

y = np.array([0] * 50 + [1] * 30 + [2] * 20)    # classes observées (chapitre Vraisemblance)
p_hat = np.bincount(y) / y.size                  # loi empirique : 0,5 0,3 0,2
H = -(p_hat @ np.log(p_hat))                     # son entropie, en nats

for q in [[1/3, 1/3, 1/3], [0.6, 0.25, 0.15], [0.5, 0.3, 0.2]]:
    q = np.array(q)
    perte = -np.mean(np.log(q[y]))               # -1/N somme des ln q(y_n)
    kl = p_hat @ np.log(p_hat / q)
    print(perte.round(4), (H + kl).round(4), kl.round(4))
