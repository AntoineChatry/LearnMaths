# Linear softmax at convergence (sklearn LogisticRegression, lbfgs) vs least squares vs MLP, on 200 games,
# 5x4 vision. Settles whether the hidden layer or the loss makes the difference.
import sys
from pathlib import Path

import numpy as np
from sklearn.linear_model import LogisticRegression
from sklearn.neural_network import MLPClassifier

sys.path.insert(0, str(Path(__file__).parent))
from proj_monde import load

g = load()
perc = g["percevoir"]
X, A = g["_expert_data"](perc)
Y = np.eye(3)[A + 1]
SEEDS = range(1, 201)


def surv(f):
    t = [g["_play"](lambda p: int(np.argmax(f(perc(p)))) - 1, s)[0] for s in SEEDS]
    return np.mean(t), np.std(t) / np.sqrt(len(t))


Xa = np.hstack([X, np.ones((len(X), 1))])
T = np.linalg.lstsq(Xa, Y, rcond=None)[0]
print("moindres carres      survie %.1f +- %.1f" % surv(lambda v: np.append(v, 1) @ T))

for C in [1e4, 100, 1, 0.1]:
    lr = LogisticRegression(C=C, max_iter=5000, tol=1e-10).fit(X, A)
    ll = -np.mean(np.log(lr.predict_proba(X)[np.arange(len(A)), A + 1]))
    print(f"softmax lin C={C:g}  perte {ll:.4f} acc {lr.score(X, A):.3f} survie %.1f +- %.1f" % surv(lambda v: lr.decision_function(v[None])[0]))

for H in [16, 32, 64]:
    for seed in range(3):
        m = MLPClassifier((H,), max_iter=2000, random_state=seed, tol=1e-6).fit(X, A)
        print(f"MLP H={H} graine {seed} acc {m.score(X, A):.3f} survie %.1f +- %.1f" % surv(lambda v: m.predict_proba(v[None])[0]))
