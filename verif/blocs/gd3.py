import numpy as np

def softmax(z):
    e = np.exp(z - z.max())
    return e / e.sum()

def stats(logits):  # poids max moyen, et taille moyenne du gradient de softmax (norme de diag(p) - p pT)
    p = [softmax(z) for z in logits]
    return np.mean([x.max() for x in p]), np.mean([np.linalg.norm(np.diag(x) - np.outer(x, x)) for x in p])

rng = np.random.default_rng(0)
for dk in [16, 64, 512]:
    q = rng.standard_normal((1000, dk))           # 1 000 requêtes
    k = rng.standard_normal((1000, 10, dk))       # 10 clés chacune
    scores = np.einsum("nd,nkd->nk", q, k)        # produits scalaires q . k
    brut, echelle = stats(scores), stats(scores / np.sqrt(dk))
    print(dk, round(scores.std(), 1), np.round(brut, 3), np.round(echelle, 3))
