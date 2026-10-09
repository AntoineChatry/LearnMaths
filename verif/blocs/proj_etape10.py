# Runs src/project/py/etape10.py in CPython against several player solutions (reference steps 6-9 loaded).
import sys
import time
from pathlib import Path

sys.path.insert(0, str(Path(__file__).parent))
from proj_etape8 import PREV, player  # noqa: E402  (reruns the step 8 variants, ~5 s)
from proj_etape9 import PLAYERS as ADAMS  # noqa: E402  (reruns the step 9 variants, ~5 s)
from proj_monde import ROOT, load  # noqa: E402

POST = (ROOT / "py" / "etape10.py").read_text(encoding="utf-8")
BASE = PREV + player() + ADAMS["reference"]


def entrainer(passes):
    return f'''
def entrainer(X, Y, rng):
    W1, b1 = initialiser(X.shape[1], 32, rng)
    W2, b2 = initialiser(32, 3, rng)
    params = [W1, b1, W2, b2]
    m = [np.zeros_like(p) for p in params]
    v = [np.zeros_like(p) for p in params]
    t = 0
    for passe in range({passes}):
        ordre = rng.permutation(len(X))
        for i in range(0, len(X), 256):
            lot = ordre[i:i + 256]
            grads = gradients(*params, X[lot], Y[lot])
            t += 1
            for k in range(4):
                params[k], m[k], v[k] = pas_adam(params[k], grads[k], m[k], v[k], t, 0.003)
    return params
'''


CERVEAU = '''
def cerveau(W1, b1, W2, b2, mu, M, partie):
    v = (percevoir(partie) - mu) @ M
    return int(np.argmax(propager(W1, b1, W2, b2, v[None])[0])) - 1
'''
CERVEAU_BRUT = '''
def cerveau(W1, b1, W2, b2, mu, M, partie):
    return int(np.argmax(propager(W1, b1, W2, b2, percevoir(partie)[None])[0])) - 1
'''
STARTER = '''
def entrainer(X, Y, rng):
    W1, b1 = initialiser(X.shape[1], 32, rng)
    W2, b2 = initialiser(32, 3, rng)
    return [W1, b1, W2, b2]

def cerveau(W1, b1, W2, b2, mu, M, partie):
    return 0
'''
PLAYERS = {
    "reference": entrainer(60) + CERVEAU,
    "2 passes": entrainer(2) + CERVEAU,
    "cerveau sans normalisation": entrainer(60) + CERVEAU_BRUT,
    "starter": STARTER,
}

print("\n=== etape 10 ===")
for name, code in PLAYERS.items():
    g = load(seed=7)
    t0 = time.time()
    exec(BASE + code, g)
    exec(POST, g)
    res = [e for e in g["_trace"] if e[0] == "res"][0][1]
    print(f"--- {name} ({time.time() - t0:.1f}s)", res)
