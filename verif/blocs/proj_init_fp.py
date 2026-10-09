# False rejections of a correct He init by etape7._check_init, over 2000 random generators per shape.
import re
import sys
from pathlib import Path

import numpy as np

sys.path.insert(0, str(Path(__file__).parent))
from proj_monde import ROOT

src = (ROOT / "py" / "etape7.py").read_text(encoding="utf-8")
g = {"np": np}
exec(re.search(r"(?s)def _check_init.*?return None\n", src).group(0), g)
g["initialiser"] = lambda n_in, n_out, rng: (rng.normal(0, np.sqrt(2 / n_in), size=(n_out, n_in)), np.zeros(n_out))
fails = {}
for shape in [(256, 256), (1024, 64)]:
    fails[shape] = sum(g["_check_init"](*shape, np.random.default_rng(s)) is not None for s in range(2000))
print("rejets d'une init de He correcte sur 2000 :", fails)
