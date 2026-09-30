# Step 4 check: gradient(T, Xa, Y) of L(T) = ||Xa T - Y||^2 / N, and the step choisir_pas(Xa), judged by how
# fast gradient descent reaches the least-squares loss compared with the optimal step 2 / (lmax + lmin).
def _etape4():
    X, A = _expert_data(percevoir)
    Y = np.eye(3)[A + 1]
    N = len(X)
    Xa = np.hstack([X, np.ones((N, 1))])
    rng = np.random.default_rng(CTX["seed"])
    T0 = rng.normal(size=(21, 3))
    g = np.asarray(gradient(T0, Xa, Y), dtype=float)
    ref = 2 * Xa.T @ (Xa @ T0 - Y) / N
    if g.shape != ref.shape or not np.allclose(g, ref, rtol=1e-6, atol=1e-9):
        # Central finite difference on one weight, to show what the true slope is.
        e = np.zeros_like(T0)
        e[0, 0] = 1e-6
        slope = (_loss(Xa, T0 + e, Y) - _loss(Xa, T0 - e, Y)) / 2e-6
        _result(grad=False, shape=list(g.shape), slope=slope, got=float(g.ravel()[0]) if g.size else None)
        return
    lam = np.linalg.eigvalsh(2 * Xa.T @ Xa / N)
    lmin, lmax = float(lam[0]), float(lam[-1])
    pas = float(choisir_pas(Xa))
    target = _loss(Xa, np.linalg.lstsq(Xa, Y, rcond=None)[0], Y) * 1.01
    T, losses = _descent(gradient, Xa, Y, pas)
    its = _first_below(losses, target)
    its_opt = _first_below(_descent(gradient, Xa, Y, 2 / (lmax + lmin))[1], target)
    info = dict(grad=True, pas=pas, lmin=lmin, lmax=lmax, its=its, its_opt=its_opt, pertes=losses, cible=target)
    if its is None:
        _result(**info)
        return
    W, b = T[:20].T, T[20]
    _result(**info, survie=_evaluate(lambda p: decider(W, b, _vec(percevoir(p)))))


if _dep_error:
    _result(dep=_dep_error)
else:
    _etape4()
