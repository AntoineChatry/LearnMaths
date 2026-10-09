import heapq
import numpy as np

def huffman_longueurs(p):
    # On fusionne les deux symboles les moins probables, jusqu'à n'en garder qu'un (MacKay, algorithme 5.4)
    tas = [(pi, i, [i]) for i, pi in enumerate(p)]
    heapq.heapify(tas)
    l = np.zeros(len(p), dtype=int)
    while len(tas) > 1:
        p1, i1, s1 = heapq.heappop(tas)
        p2, _, s2 = heapq.heappop(tas)
        l[s1 + s2] += 1                   # chaque fusion ajoute un bit aux mots de ces symboles
        heapq.heappush(tas, (p1 + p2, i1, s1 + s2))
    return l

p = np.array([0.25, 0.25, 0.2, 0.15, 0.15])          # MacKay, exemple 5.15
l = huffman_longueurs(p)
print(l, (p @ l).round(4), (p @ np.log2(1 / p)).round(4), (2.0 ** -l).sum())

# Fréquences des 26 lettres et de l'espace en anglais (MacKay, table 2.9)
anglais = np.array([.0575, .0128, .0263, .0285, .0913, .0173, .0133, .0313, .0599, .0006,
                    .0084, .0335, .0235, .0596, .0689, .0192, .0008, .0508, .0567, .0706,
                    .0334, .0069, .0119, .0073, .0164, .0007, .1928])
l = huffman_longueurs(anglais)
shannon = np.ceil(np.log2(1 / anglais))              # longueurs du théorème 5.1
print((anglais @ np.log2(1 / anglais)).round(2), (anglais @ l).round(2), (anglais @ shannon).round(2))
