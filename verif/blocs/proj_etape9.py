# Runs src/project/py/etape9.py in CPython against several pas_adam variants (reference steps 6-8 loaded).
import sys
import time
from pathlib import Path

sys.path.insert(0, str(Path(__file__).parent))
from proj_etape8 import PREV, player  # noqa: E402  (also reruns the step 8 variants, ~5 s)
from proj_monde import ROOT, load  # noqa: E402

POST = (ROOT / "py" / "etape9.py").read_text(encoding="utf-8")
GRADS = player()


def adam(body):
    return f'''
def pas_adam(theta, g, m, v, t, alpha, beta1=0.9, beta2=0.999, eps=1e-8):
{body}
'''


PLAYERS = {
    "reference": adam('''    m = beta1 * m + (1 - beta1) * g
    v = beta2 * v + (1 - beta2) * g**2
    m_hat = m / (1 - beta1**t)
    v_hat = v / (1 - beta2**t)
    return theta - alpha * m_hat / (np.sqrt(v_hat) + eps), m, v'''),
    "sans correction": adam('''    m = beta1 * m + (1 - beta1) * g
    v = beta2 * v + (1 - beta2) * g**2
    return theta - alpha * m / (np.sqrt(v) + eps), m, v'''),
    "eps dans la racine": adam('''    m = beta1 * m + (1 - beta1) * g
    v = beta2 * v + (1 - beta2) * g**2
    m_hat = m / (1 - beta1**t)
    v_hat = v / (1 - beta2**t)
    return theta - alpha * m_hat / np.sqrt(v_hat + eps), m, v'''),
    "starter": adam('''    return theta, m, v'''),
}

print("\n=== etape 9 ===")
for name, code in PLAYERS.items():
    g = load(seed=7)
    t0 = time.time()
    exec(PREV + GRADS + code, g)
    exec(POST, g)
    res = [e for e in g["_trace"] if e[0] == "res"][0][1]
    p = res.pop("pertes", None)
    if p:
        res["perte"] = f"{p[0]:.4f} -> {p[-1]:.4f} ({len(p) - 1} passes)"
    print(f"--- {name} ({time.time() - t0:.1f}s)", res)
