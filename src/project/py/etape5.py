# Step 5 check: normaliser(X) -> (mu, M), the robot then sees (vision - mu) @ M. Judged by the condition number
# of the Hessian 2 Xa^T Xa / N (standardization: 2 stars, PCA whitening: kappa = 1, 3 stars) and by gradient descent.
def _kappa(Xa):
    return float(np.linalg.cond(Xa) ** 2)  # kappa(Xa^T Xa) = kappa(Xa)^2


def _etape5():
    X, A = _expert_data(percevoir)
    Y = np.eye(3)[A + 1]
    N = len(X)
    ones = np.ones((N, 1))
    Xa = np.hstack([X, ones])
    mu, M = normaliser(X)
    mu, M = np.asarray(mu, dtype=float).ravel(), np.asarray(M, dtype=float)
    if mu.shape != (20,) or M.ndim != 2 or M.shape[0] != 20:
        _result(shape=[list(mu.shape), list(M.shape)])
        return
    Xn = (X - mu) @ M
    Xna = np.hstack([Xn, ones])
    sd = X.std(axis=0)
    k_std = _kappa(np.hstack([(X - X.mean(axis=0)) / np.where(sd > 0, sd, 1), ones]))
    best = _loss(Xa, np.linalg.lstsq(Xa, Y, rcond=None)[0], Y)
    best_n = _loss(Xna, np.linalg.lstsq(Xna, Y, rcond=None)[0], Y)
    info = dict(moyenne=float(np.abs(Xn.mean(axis=0)).max()), k_brut=_kappa(Xa), k=_kappa(Xna), k_std=k_std,
                perte=best_n, best=best, dims=int(M.shape[1]))
    if not np.isfinite(info["k"]) or best_n > best * (1 + 1e-6) + 1e-12:
        _result(**info)
        return
    its_brut = _first_below(_descent(gradient, Xa, Y, float(choisir_pas(Xa)))[1], best * 1.01)
    T, losses = _descent(gradient, Xna, Y, float(choisir_pas(Xna)))
    its = _first_below(losses, best * 1.01)
    info.update(its=its, its_brut=its_brut, pertes=losses, cible=best * 1.01)
    if its is None:
        _result(**info)
        return
    W, b = T[:-1].T, T[-1]
    _result(**info, survie=_evaluate(lambda p: decider(W, b, (_vec(percevoir(p)) - mu) @ M)))


if _dep_error:
    _result(dep=_dep_error)
else:
    _etape5()
