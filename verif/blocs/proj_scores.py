# Largest |score| reached by the Newton-trained linear softmax (exp overflows past ~709 in float64), and the
# least-squares survival on the 40 app games, for the step 6 message.
import sys
from pathlib import Path

import numpy as np

sys.path.insert(0, str(Path(__file__).parent))
import proj_newton as pn  # noqa: E402

T, hist = pn.newton(1e-5)
S = pn.Xa @ T
print("max |score|", np.abs(S).max(), "max ecart dans une ligne", (S.max(1) - S.min(1)).max())
print("max |T|", np.abs(T).max())
Xr = np.hstack([pn.X, np.ones((len(pn.X), 1))])
T_ls = np.linalg.lstsq(Xr, pn.Y, rcond=None)[0]
W, b = T_ls[:-1].T, T_ls[-1]
print("LS survie40", pn.g["_evaluate"](lambda p: int(np.argmax(W @ pn.perc(p) + b)) - 1))
