# Step 3 check: apprendre(X, Y) must return a least-squares fit (W, b). Any minimizer passes: the check is the
# normal equation Xa^T (Xa T - Y) = 0, which holds for every least-squares solution.
def _etape3():
    X, A = _expert_data(percevoir)
    Y = np.eye(3)[A + 1]
    N = len(X)
    W, b = apprendre(X, Y)
    W, b = np.asarray(W, dtype=float), np.asarray(b, dtype=float).ravel()
    if W.shape != (3, 20) or b.shape != (3,):
        _result(shape=[list(W.shape), list(b.shape)])
        return
    Xa = np.hstack([X, np.ones((N, 1))])
    T = np.vstack([W.T, b])
    normal = float(np.abs(Xa.T @ (Xa @ T - Y)).max() / N)
    best = _loss(Xa, np.linalg.lstsq(Xa, Y, rcond=None)[0], Y)
    if normal > 1e-6:
        _result(normal=normal, loss=_loss(Xa, T, Y), best=best, n=N)
        return
    survie = _evaluate(lambda p: decider(W, b, _vec(percevoir(p))))
    _result(normal=normal, loss=_loss(Xa, T, Y), best=best, n=N, survie=survie)


if _dep_error:
    _result(dep=_dep_error)
else:
    _etape3()
