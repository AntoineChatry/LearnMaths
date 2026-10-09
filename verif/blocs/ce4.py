import numpy as np

def perplexite(probas):  # probabilités données par le modèle aux tokens réellement observés
    return np.exp(-np.mean(np.log(probas)))

A = [1/3] * 5                     # red red red red blue, modèle uniforme
B = [0.8, 0.8, 0.8, 0.8, 0.1]     # modèle qui a appris que red est fréquent
print(perplexite(A).round(2), perplexite(B).round(2))

perte = -np.mean(np.log(B))       # la perte d'entraînement : nats par token
bits = perte / np.log(2)          # la même, en bits par token
print(perte.round(3), bits.round(3), np.exp(perte).round(2), (2 ** bits).round(2))
