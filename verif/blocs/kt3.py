import numpy as np

def softmax(z, T):
    e = np.exp((z - z.max()) / T)
    return e / e.sum()

def perte(z, v, T):  # entropie croisée avec les cibles douces du professeur, à la température T
    return -softmax(v, T) @ np.log(softmax(z, T))

v = np.array([4.0, 1.0, -1.0, -4.0])   # logits du professeur (moyenne nulle)
z = np.array([2.0, 1.0, 0.0, -3.0])    # logits de l'élève (moyenne nulle)

T = 2.0
p, q = softmax(v, T), softmax(z, T)
H, D = -(p @ np.log(p)), p @ np.log(p / q)
print(round(perte(z, v, T), 4), round(H + D, 4))

h = 1e-6                               # gradient par différences finies
num = np.array([(perte(z + h * e, v, T) - perte(z - h * e, v, T)) / (2 * h) for e in np.eye(4)])
print(num.round(4), ((q - p) / T).round(4))

for T in [1, 5, 20, 100]:
    g = (softmax(z, T) - softmax(v, T)) / T
    print(T, (T**2 * g).round(3))
print((z - v) / 4)
