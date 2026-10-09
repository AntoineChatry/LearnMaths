import numpy as np
from fractions import Fraction

def H(p):  # entropie en bits d'un tableau de probabilités, quelle que soit sa forme
    p = np.asarray(p, dtype=float).ravel()
    p = p[p > 0]
    return p @ np.log2(1 / p)

# Cover et Thomas, exemple 2.2.1 ; MacKay, exercice 8.6. Lignes : y = 1..4, colonnes : x = 1..4.
P = np.array([[1/8,  1/16, 1/32, 1/32],
              [1/16, 1/8,  1/32, 1/32],
              [1/16, 1/16, 1/16, 1/16],
              [1/4,  0,    0,    0   ]])
px, py = P.sum(axis=0), P.sum(axis=1)
H_X_sachant_y = np.array([H(ligne / ligne.sum()) for ligne in P])          # H(X | y) pour chaque y
H_X_sachant_Y = py @ H_X_sachant_y                                # leur moyenne
H_Y_sachant_X = px @ [H(col / col.sum()) for col in P.T]
print(H(px), H(py), H(P))
print(H_X_sachant_y)
print(H_X_sachant_Y, H_Y_sachant_X, H(px) + H_Y_sachant_X)
print(Fraction(H_X_sachant_Y), Fraction(H_Y_sachant_X), Fraction(H(P)))
