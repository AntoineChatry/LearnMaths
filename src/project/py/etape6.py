# Step 6 check: softmax(S) and entropie_croisee(S, Y) on random scores, then on huge scores (stability, Goodfellow
# et al. 4.1). The linear brain is then trained on the cross-entropy by Newton's method (IRLS, Bishop PRML 4.3.3)
# with the player's softmax, on the inputs normalized in step 5, and compared with least squares (step 3).
# The softmax ignores adding the same vector to the 3 columns of T, so the Hessian is singular without a small ridge.
RIDGE = 1e-5


def _softmax_ref(S):
    E = np.exp(S - S.max(axis=1, keepdims=True))
    return E / E.sum(axis=1, keepdims=True)


def _ce_ref(S, Y):
    Z = S - S.max(axis=1, keepdims=True)
    return float(-np.sum(Y * (Z - np.log(np.exp(Z).sum(axis=1, keepdims=True)))) / len(S))


def _num(v):
    try:
        return float(v)
    except (TypeError, ValueError):
        return None


def _player_softmax(S):
    with np.errstate(all="ignore"):
        P = _vec(softmax(S.copy()))
    return None if P is None or P.size != S.size else P.reshape(S.shape)


def _player_ce(S, Y):
    with np.errstate(all="ignore"):
        return _num(entropie_croisee(S.copy(), Y.copy()))


def _newton(Xa, Y, iters=30):
    """Newton's method on the mean cross-entropy + RIDGE / 2 ||T||^2, T of size d x 3, from T = 0."""
    N, d = Xa.shape
    T = np.zeros((d, 3))
    losses = []
    for _ in range(iters):
        S = Xa @ T
        P = _player_softmax(S)
        L = _player_ce(S, Y)
        if P is None or L is None or not np.all(np.isfinite(P)) or not np.isfinite(L):
            return None, losses
        losses.append(L)
        G = (Xa.T @ (P - Y) / N + RIDGE * T).T.ravel()  # PRML 4.109, class by class
        H = np.zeros((3 * d, 3 * d))
        for j in range(3):
            for k in range(3):
                w = P[:, j] * ((j == k) - P[:, k])
                H[j * d:(j + 1) * d, k * d:(k + 1) * d] = (Xa * w[:, None]).T @ Xa / N
        step = np.linalg.solve(H + RIDGE * np.eye(3 * d), G).reshape(3, d).T
        T = T - step
        if np.abs(step).max() < 1e-9:
            break
    losses.append(_player_ce(Xa @ T, Y))
    return T, losses


def _etape6():
    rng = np.random.default_rng(CTX["seed"])
    S = rng.normal(0, 3, size=(200, 3))
    Y = np.eye(3)[rng.integers(0, 3, 200)]
    P, ref = _player_softmax(S), _softmax_ref(S)
    if P is None or not np.allclose(P, ref, rtol=1e-6, atol=1e-12):
        bad = 0 if P is None else int(np.argmax(np.abs(np.nan_to_num(P - ref, nan=1.0)).max(axis=1)))
        _result(soft=False, s=S[bad].tolist(), ref=ref[bad].tolist(), got=None if P is None else P[bad].tolist())
        return
    L, L_ref = _player_ce(S, Y), _ce_ref(S, Y)
    if L is None or not np.isclose(L, L_ref, rtol=1e-6):
        s2, y2 = S[:2], Y[:2]
        _result(soft=True, ce=False, s=s2.tolist(), y=y2.argmax(axis=1).tolist(), ref=_ce_ref(s2, y2),
                got=_player_ce(s2, y2), full_ref=L_ref, full_got=L)
        return
    # Huge scores: exp(1000) overflows, so a naive softmax returns nan and a naive log(softmax) returns inf.
    big = np.array([[1000.0, 999.0, -1000.0]])
    Pb = _player_softmax(big)
    stable_soft = Pb is not None and bool(np.allclose(Pb, _softmax_ref(big), rtol=1e-6, atol=1e-12))
    Lb = _player_ce(np.array([[0.0, 800.0, 0.0]]), np.array([[1.0, 0.0, 0.0]]))
    stable_ce = Lb is not None and bool(np.isclose(Lb, 800.0, rtol=1e-9))

    X, A = _expert_data(percevoir)
    Yx = np.eye(3)[A + 1]
    N = len(X)
    mu, M = normaliser(X)
    mu, M = np.asarray(mu, dtype=float).ravel(), np.asarray(M, dtype=float)
    Xa = np.hstack([(X - mu) @ M, np.ones((N, 1))])
    T, losses = _newton(Xa, Yx)
    info = dict(soft=True, ce=True, stable_soft=stable_soft, stable_ce=stable_ce, pertes=losses)
    if T is None:
        _result(**info, train=False)
        return
    # Least squares (step 3) on the same games, for comparison.
    Xr = np.hstack([X, np.ones((N, 1))])
    T_ls = np.linalg.lstsq(Xr, Yx, rcond=None)[0]
    W_ls, b_ls = T_ls[:-1].T, T_ls[-1]
    survie_ls = float(np.mean([_play(lambda p: decider(W_ls, b_ls, _vec(percevoir(p))), s)[0] for s in EVAL_SEEDS]))
    W, b = T[:-1].T, T[-1]
    survie = _evaluate(lambda p: decider(W, b, (_vec(percevoir(p)) - mu) @ M))
    _result(**info, train=True, its=len(losses) - 1, perte=losses[-1], survie=survie, survie_ls=survie_ls)


if _dep_error:
    _result(dep=_dep_error)
else:
    _etape6()
