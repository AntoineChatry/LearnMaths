# Runs src/project/py/etape8.py in CPython against several player solutions (with reference steps 6-7 loaded).
import sys
import time
from pathlib import Path

sys.path.insert(0, str(Path(__file__).parent))
from proj_monde import ROOT, load

POST = (ROOT / "py" / "etape8.py").read_text(encoding="utf-8")
PREV = '''
def softmax(S):
    E = np.exp(S - S.max(axis=1, keepdims=True))
    return E / E.sum(axis=1, keepdims=True)

def entropie_croisee(S, Y):
    Z = S - S.max(axis=1, keepdims=True)
    return -np.sum(Y * (Z - np.log(np.exp(Z).sum(axis=1, keepdims=True)))) / len(S)

def initialiser(n_entree, n_sortie, rng):
    return rng.normal(0, np.sqrt(2 / n_entree), size=(n_sortie, n_entree)), np.zeros(n_sortie)

def propager(W1, b1, W2, b2, X):
    return np.maximum(X @ W1.T + b1, 0) @ W2.T + b2
'''


def player(mask="(Z > 0)", div="len(X)", dw2="D2.T @ H", extra=""):
    return f'''
def gradients(W1, b1, W2, b2, X, Y):
    Z = X @ W1.T + b1
    H = np.maximum(Z, 0)
    D2 = (softmax(H @ W2.T + b2) - Y) / {div}
    D1 = (D2 @ W2) * {mask}
    {extra}
    return D1.T @ X, D1.sum(axis=0), {dw2}, D2.sum(axis=0)
'''


PLAYERS = {
    "reference": player(),
    "sans masque ReLU": player(mask="1"),
    "somme (pas /N)": player(div="1"),
    "dW2 transpose": player(dw2="H.T @ D2"),
    "masque Z >= 0": player(mask="(Z >= 0)"),
    "starter": '''
def gradients(W1, b1, W2, b2, X, Y):
    return np.zeros_like(W1), np.zeros_like(b1), np.zeros_like(W2), np.zeros_like(b2)
''',
}

for name, code in PLAYERS.items():
    g = load(seed=7)
    t0 = time.time()
    exec(PREV + code, g)
    exec(POST, g)
    res = [e for e in g["_trace"] if e[0] == "res"][0][1]
    p = res.pop("pertes", None)
    if p:
        res["perte"] = f"{p[0]:.4f} -> {p[-1]:.4f} ({len(p) - 1} pas)"
    print(f"--- {name} ({time.time() - t0:.1f}s)", res)
