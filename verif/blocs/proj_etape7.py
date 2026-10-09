# Runs src/project/py/etape7.py in CPython against several player solutions and prints the harness result.
import sys
import time
from pathlib import Path

sys.path.insert(0, str(Path(__file__).parent))
from proj_monde import ROOT, load

POST = (ROOT / "py" / "etape7.py").read_text(encoding="utf-8")
FWD = '''
def propager(W1, b1, W2, b2, X):
    return np.maximum(X @ W1.T + b1, 0) @ W2.T + b2
'''
PLAYERS = {
    "reference": FWD + '''
def initialiser(n_entree, n_sortie, rng):
    return rng.normal(0, np.sqrt(2 / n_entree), size=(n_sortie, n_entree)), np.zeros(n_sortie)
''',
    "sans ReLU": '''
def propager(W1, b1, W2, b2, X):
    return (X @ W1.T + b1) @ W2.T + b2

def initialiser(n_entree, n_sortie, rng):
    return rng.normal(0, np.sqrt(2 / n_entree), size=(n_sortie, n_entree)), np.zeros(n_sortie)
''',
    "Xavier": FWD + '''
def initialiser(n_entree, n_sortie, rng):
    return rng.normal(0, np.sqrt(1 / n_entree), size=(n_sortie, n_entree)), np.zeros(n_sortie)
''',
    "uniforme": FWD + '''
def initialiser(n_entree, n_sortie, rng):
    a = np.sqrt(6 / n_entree)
    return rng.uniform(-a, a, size=(n_sortie, n_entree)), np.zeros(n_sortie)
''',
    "std fixe 0.1": FWD + '''
def initialiser(n_entree, n_sortie, rng):
    return rng.normal(0, 0.1, size=(n_sortie, n_entree)), np.zeros(n_sortie)
''',
    "biais 0.1": FWD + '''
def initialiser(n_entree, n_sortie, rng):
    return rng.normal(0, np.sqrt(2 / n_entree), size=(n_sortie, n_entree)), np.full(n_sortie, 0.1)
''',
    "transposee": FWD + '''
def initialiser(n_entree, n_sortie, rng):
    return rng.normal(0, np.sqrt(2 / n_entree), size=(n_entree, n_sortie)), np.zeros(n_sortie)
''',
    "n_sortie": FWD + '''
def initialiser(n_entree, n_sortie, rng):
    return rng.normal(0, np.sqrt(2 / n_sortie), size=(n_sortie, n_entree)), np.zeros(n_sortie)
''',
}

for name, code in PLAYERS.items():
    for seed in (7, 8):
        g = load(seed=seed)
        t0 = time.time()
        exec(code, g)
        exec(POST, g)
        res = [e for e in g["_trace"] if e[0] == "res"][0][1]
        he, xa = res.pop("he", None), res.pop("xavier", None)
        extra = f" he y1 {he[0]:.3g} y30 {he[-1]:.3g} | xavier y1 {xa[0]:.3g} y30 {xa[-1]:.3g}" if he else ""
        print(f"--- {name} graine {seed} ({time.time() - t0:.1f}s)", res, extra)
