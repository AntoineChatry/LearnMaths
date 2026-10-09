import numpy as np

np.seterr(divide="ignore")  # 1/0 donne inf, sans avertissement

def entropie_croisee(p, q):  # en bits : p la vraie loi, q la loi qui a servi à construire le code
    p, q = np.asarray(p, float), np.asarray(q, float)
    m = p > 0
    return p[m] @ np.log2(1 / q[m])

uniforme = np.array([1/4, 1/4, 1/4, 1/4])   # code de longueur 2 pour chaque symbole
shannon = np.array([1/2, 1/4, 1/8, 1/8])    # code 0, 10, 110, 111
print(entropie_croisee(shannon, shannon), entropie_croisee(shannon, uniforme))
print(entropie_croisee(uniforme, uniforme), entropie_croisee(uniforme, shannon))
