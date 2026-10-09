# Runs src/project/py/etape6.py in CPython against several player solutions and prints the harness result.
import sys
import time
from pathlib import Path

sys.path.insert(0, str(Path(__file__).parent))
from proj_monde import ROOT, load

POST = (ROOT / "py" / "etape6.py").read_text(encoding="utf-8")

PLAYERS = {
    "stable": '''
def softmax(S):
    E = np.exp(S - S.max(axis=1, keepdims=True))
    return E / E.sum(axis=1, keepdims=True)

def entropie_croisee(S, Y):
    Z = S - S.max(axis=1, keepdims=True)
    logp = Z - np.log(np.exp(Z).sum(axis=1, keepdims=True))
    return -np.sum(Y * logp) / len(S)
''',
    "naive": '''
def softmax(S):
    E = np.exp(S)
    return E / E.sum(axis=1, keepdims=True)

def entropie_croisee(S, Y):
    return -np.mean(np.sum(Y * np.log(softmax(S)), axis=1))
''',
    "softmax faux": '''
def softmax(S):
    return np.exp(S)

def entropie_croisee(S, Y):
    return 0.0
''',
    "perte somme": '''
def softmax(S):
    E = np.exp(S - S.max(axis=1, keepdims=True))
    return E / E.sum(axis=1, keepdims=True)

def entropie_croisee(S, Y):
    return -np.sum(Y * np.log(softmax(S)))
''',
    "starter": '''
def softmax(S):
    E = np.exp(S)
    return E

def entropie_croisee(S, Y):
    return 0.0
''',
}

for name, code in PLAYERS.items():
    g = load(seed=7)
    t0 = time.time()
    exec(code, g)
    exec(POST, g)
    res = [e for e in g["_trace"] if e[0] == "res"][0][1]
    res.pop("pertes", None) if name != "stable" else None
    print(f"--- {name} ({time.time() - t0:.1f}s)", res)
