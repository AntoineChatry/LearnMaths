# Per-class behaviour of least squares vs linear softmax (Newton, lambda = 1e-5): is it Bishop's fig. 4.5 masking?
import sys
from pathlib import Path

import numpy as np

sys.path.insert(0, str(Path(__file__).parent))
import proj_newton as pn  # noqa: E402  (prints its own experiment first)

Xa, Y, A = pn.Xa, pn.Y, pn.A
T_ls = np.linalg.lstsq(Xa, Y, rcond=None)[0]
T_sm, _ = pn.newton(1e-5)
for name, T in [("moindres carres", T_ls), ("softmax", T_sm)]:
    pred = np.argmax(Xa @ T, 1)
    conf = np.zeros((3, 3), int)
    for a, p in zip(A + 1, pred):
        conf[a, p] += 1
    print(name, "matrice de confusion (ligne = expert -1/0/+1, colonne = robot)")
    print(conf)
    print("  rappel par classe", np.round(conf.diagonal() / conf.sum(1), 3), "predictions par classe", conf.sum(0))
