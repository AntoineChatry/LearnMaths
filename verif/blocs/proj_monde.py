# Loads the project world (engine.ts PY_ENGINE + monde.py) into a dict, with reference solutions of steps 1-5,
# so that later steps can be prototyped in CPython. Usage: from proj_monde import load; g = load()
import json
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2] / "src" / "project"

REF = '''
def percevoir(partie):
    x = partie.x
    meteores = set(partie.meteores)
    vision = np.zeros(20)
    for h in range(1, 5):
        for dx in range(-2, 3):
            c = x + dx
            if c < 0 or c > 8 or (c, h) in meteores:
                vision[5 * (h - 1) + dx + 2] = 1
    return vision


def decider(W, b, vision):
    return int(np.argmax(W @ vision + b)) - 1


def apprendre(X, Y):
    Xa = np.hstack([X, np.ones((len(X), 1))])
    T = np.linalg.lstsq(Xa, Y, rcond=None)[0]
    return T[:-1].T, T[-1]


def gradient(T, Xa, Y):
    return 2 * Xa.T @ (Xa @ T - Y) / len(Xa)


def choisir_pas(Xa):
    lam = np.linalg.eigvalsh(2 * Xa.T @ Xa / len(Xa))
    return 2 / (lam[-1] + lam[0])


def normaliser(X):
    mu = X.mean(axis=0)
    U, s, Vt = np.linalg.svd(X - mu, full_matrices=False)
    return mu, Vt.T / (s / np.sqrt(len(X)))
'''


def load(seed=0):
    ts = (ROOT / "engine.ts").read_text(encoding="utf-8")
    m = re.search(r"PY_ENGINE = `(.*?)`;", ts, re.S)
    engine = m.group(1).replace("${COLS}", "9").replace("${ROWS}", "10").replace("${SPAWN_P}", "0.28")
    engine = engine.replace("${MAX_PER_ROW}", "3").replace("${MAX_TICKS}", "300")
    g = {"CTX_JSON": json.dumps({"seed": seed, "deps": []})}
    exec(engine, g)
    exec((ROOT / "py" / "expert.py").read_text(encoding="utf-8"), g)
    exec((ROOT / "py" / "monde.py").read_text(encoding="utf-8"), g)
    exec(REF, g)
    return g
