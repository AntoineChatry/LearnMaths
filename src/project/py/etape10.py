# Step 10 check: the player assembles the training loop, entrainer(X, Y, rng), and the robot's brain,
# cerveau(W1, b1, W2, b2, mu, M, partie). Success: the training loss on the 100 expert games goes below the best
# loss any linear softmax can reach on the same data, then cerveau must agree with the network's own scores.
import time

TRAIN10 = range(1000, 1100)
# Cross-entropy of the best linear softmax on these 100 games: 0.111964 (Newton, the ridge going to 0, gradient
# 1e-10; the loss is convex, so no linear brain does better). Measured in verif/blocs/proj_seuil10.py.
LIN_BEST = 0.11196


def _ce(S, Y):
    Z = S - S.max(axis=1, keepdims=True)
    return float(-np.sum(Y * (Z - np.log(np.exp(Z).sum(axis=1, keepdims=True)))) / len(S))


def _etape10():
    X, A = _expert_data(percevoir, seeds=TRAIN10)
    Y = np.eye(3)[A + 1]
    mu, M = normaliser(X)
    mu, M = np.asarray(mu, dtype=float).ravel(), np.asarray(M, dtype=float)
    Xn = (X - mu) @ M
    k = Xn.shape[1]
    t0 = time.perf_counter()
    out = entrainer(Xn.copy(), Y.copy(), np.random.default_rng(0))
    t_train = time.perf_counter() - t0
    try:
        P = [np.asarray(o, dtype=float) for o in out] if len(out) == 4 else None
    except (TypeError, ValueError):
        P = None
    want = [(32, k), (32,), (3, 32), (3,)]
    if P is None or [p.shape for p in P] != want:
        _result(ok=False, pb="forme", got=None if P is None else [list(p.shape) for p in P], want=[list(w) for w in want])
        return
    W1, b1, W2, b2 = P
    perte = _ce(np.maximum(Xn @ W1.T + b1, 0) @ W2.T + b2, Y)
    if not np.isfinite(perte) or perte >= LIN_BEST:
        _result(ok=False, pb="perte", perte=perte if np.isfinite(perte) else None, seuil=LIN_BEST, t_train=t_train)
        return

    def ref(p):
        v = (_vec(percevoir(p)) - mu) @ M
        return int(np.argmax(np.maximum(W1 @ v + b1, 0) @ W2.T + b2)) - 1

    # cerveau must play the network's best score on every position of two expert games.
    for s in (1000, 1001):
        p = Partie(s)
        while p.vivant and p.tick < MAX_TICKS:
            got = cerveau(W1.copy(), b1.copy(), W2.copy(), b2.copy(), mu.copy(), M.copy(), p)
            if got != ref(p):
                _result(ok=False, pb="cerveau", got=repr(got)[:40], ref=ref(p), tick=p.tick, perte=perte)
                return
            p.jouer(expert(p))
    survie = _evaluate(lambda p: cerveau(W1, b1, W2, b2, mu, M, p))
    _result(ok=True, perte=perte, seuil=LIN_BEST, survie=survie, t_train=t_train)


if _dep_error:
    _result(dep=_dep_error)
else:
    _etape10()
