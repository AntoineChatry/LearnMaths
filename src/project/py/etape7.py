# Step 7 check: initialiser(n_entree, n_sortie, rng) must follow He et al. 2015 (eq. 10: W ~ N(0, 2 / n_entree),
# b = 0), and propager(W1, b1, W2, b2, X) must compute relu(X W1^T + b1) W2^T + b2. Then the variance of the
# pre-activations through 30 ReLU layers of width 256 (eq. 9) with the player's init vs Xavier's, and one game
# played by the untrained 20-32-3 network.
HIDDEN = 32
DEPTH, WIDTH = 30, 256


def _forward_ref(W1, b1, W2, b2, X):
    return np.maximum(X @ W1.T + b1, 0) @ W2.T + b2


def _check_init(n_in, n_out, rng):
    """None if initialiser(n_in, n_out) looks like He's init, else a dict describing the first problem."""
    W, b = initialiser(n_in, n_out, rng)
    W, b = np.asarray(W, dtype=float), np.asarray(b, dtype=float)
    if W.shape != (n_out, n_in) or b.shape != (n_out,):
        return dict(pb="forme", n_in=n_in, n_out=n_out, w=list(W.shape), b=list(b.shape))
    if np.any(b != 0):
        return dict(pb="biais")
    w = W.ravel()
    ratio = float(w.var() * n_in / 2)  # 1 for He's init; standard error about sqrt(2 / 65536) = 0.006
    if abs(float(w.mean())) > 5 * np.sqrt(2 / n_in / w.size) or abs(ratio - 1) > 0.05:
        return dict(pb="variance", n_in=n_in, mean=float(w.mean()), var=float(w.var()), ref=2 / n_in)
    kurt = float(((w - w.mean()) ** 4).mean() / w.var() ** 2)  # 3 for a Gaussian, 1.8 for a uniform law
    if abs(kurt - 3) > 0.2:
        return dict(pb="loi", kurt=kurt)
    return None


def _depth_variances(init, rng, X):
    """Var of the pre-activations y_l of each layer (He et al., eq. 9), inputs X, ReLU between layers."""
    x, out = X, []
    for _ in range(DEPTH):
        W, b = init(x.shape[1], WIDTH, rng)
        y = x @ np.asarray(W, dtype=float).T + np.asarray(b, dtype=float)
        out.append(float(y.var()))
        x = np.maximum(y, 0)
    return out


def _xavier(n_in, n_out, rng):
    return rng.normal(0, np.sqrt(1 / n_in), size=(n_out, n_in)), np.zeros(n_out)


def _etape7():
    rng = np.random.default_rng(CTX["seed"])
    W1, b1 = rng.normal(size=(HIDDEN, 20)), rng.normal(size=HIDDEN)
    W2, b2 = rng.normal(size=(3, HIDDEN)), rng.normal(size=3)
    Xt = rng.normal(size=(50, 20))
    ref = _forward_ref(W1, b1, W2, b2, Xt)
    S = _vec(propager(W1, b1, W2, b2, Xt.copy()))
    if S is None or S.size != ref.size or not np.allclose(S.reshape(ref.shape), ref, rtol=1e-9, atol=1e-9):
        lin = Xt @ W1.T @ W2.T + b1 @ W2.T + b2  # the same network without the ReLU
        no_relu = S is not None and S.size == ref.size and np.allclose(S.reshape(ref.shape), lin, rtol=1e-9, atol=1e-9)
        _result(fwd=False, size=None if S is None else int(S.size), no_relu=bool(no_relu),
                ref=ref[0].tolist(), got=None if S is None or S.size != ref.size else S.reshape(ref.shape)[0].tolist())
        return
    for n_in, n_out in [(256, 256), (1024, 64)]:
        pb = _check_init(n_in, n_out, rng)
        if pb:
            _result(fwd=True, init=False, **pb)
            return
    X, A = _expert_data(percevoir)
    mu, M = normaliser(X)
    mu, M = np.asarray(mu, dtype=float).ravel(), np.asarray(M, dtype=float)
    Xn = (X - mu) @ M
    batch = Xn[rng.choice(len(Xn), 200, replace=False)]
    he = _depth_variances(initialiser, rng, batch)
    xavier = _depth_variances(_xavier, rng, batch)
    W1, b1 = (np.asarray(a, dtype=float) for a in initialiser(Xn.shape[1], HIDDEN, rng))
    W2, b2 = (np.asarray(a, dtype=float) for a in initialiser(HIDDEN, 3, rng))
    survie = _evaluate(lambda p: int(np.argmax(_vec(propager(W1, b1, W2, b2, ((_vec(percevoir(p)) - mu) @ M)[None])))) - 1)
    _result(fwd=True, init=True, he=he, xavier=xavier, survie=survie)


if _dep_error:
    _result(dep=_dep_error)
else:
    _etape7()
