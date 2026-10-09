# Step 9 check: pas_adam(theta, g, m, v, t, alpha) must follow Kingma & Ba's Algorithm 1 exactly (checked on random
# cases). Then the 20-32-3 network is trained with the player's init (step 7), gradients (step 8) and Adam, on 100
# expert games (mini-batches of 256, 60 passes, fixed seed), and compared with the linear softmax trained by Newton on
# the same games (as in step 6). Both are evaluated on the same 40 games. Phase timings are returned too.
import time

TRAIN9 = range(1000, 1100)  # more games than steps 3-8: the network has 771 parameters, the linear brain 63
HIDDEN, BATCH, EPOCHS, ALPHA = 32, 256, 60, 0.003
B1, B2, EPS = 0.9, 0.999, 1e-8
RIDGE = 1e-5


def _adam_ref(theta, g, m, v, t, alpha, correct=True, eps_inside=False):
    m = B1 * m + (1 - B1) * g
    v = B2 * v + (1 - B2) * g * g
    mh, vh = (m / (1 - B1**t), v / (1 - B2**t)) if correct else (m, v)
    step = mh / np.sqrt(vh + EPS) if eps_inside else mh / (np.sqrt(vh) + EPS)
    return theta - alpha * step, m, v


def _player_adam(theta, g, m, v, t, alpha):
    out = pas_adam(theta.copy(), g.copy(), m.copy(), v.copy(), t, alpha)
    try:
        return [np.asarray(o, dtype=float) for o in out] if len(out) == 3 else None
    except (TypeError, ValueError):
        return None


def _same(a, b):
    return all(x.shape == y.shape and np.allclose(x, y, rtol=1e-9, atol=1e-12) for x, y in zip(a, b))


def _check_adam(rng):
    for t in (1, 2, 10, 1000):
        args = [rng.normal(size=(4, 3)), rng.normal(size=(4, 3)) * 1e-2, rng.normal(size=(4, 3)) * 1e-2,
                rng.random((4, 3)) * 1e-4, t, 0.003]
        got, ref = _player_adam(*args), _adam_ref(*args)
        if got is None:
            return dict(pb="nombre")
        if not _same(got, ref):
            k = next(i for i in range(3) if not (got[i].shape == ref[i].shape and np.allclose(got[i], ref[i], rtol=1e-9, atol=1e-12)))
            return dict(pb="valeur", t=t, which=["theta", "m", "v"][k],
                        no_corr=_same(got, _adam_ref(*args, correct=False)),
                        eps_in=_same(got, _adam_ref(*args, eps_inside=True)))
    return None


def _newton_lin(Xa, Y):
    N, d = Xa.shape
    T = np.zeros((d, 3))
    for _ in range(30):
        P = np.asarray(softmax(Xa @ T), dtype=float)
        G = (Xa.T @ (P - Y) / N + RIDGE * T).T.ravel()
        H = np.zeros((3 * d, 3 * d))
        for j in range(3):
            for k in range(j, 3):  # the Hessian is symmetric: 6 blocks instead of 9 (slow matmuls in Pyodide)
                w = P[:, j] * ((j == k) - P[:, k])
                H[j * d:(j + 1) * d, k * d:(k + 1) * d] = (Xa * w[:, None]).T @ Xa / N
                H[k * d:(k + 1) * d, j * d:(j + 1) * d] = H[j * d:(j + 1) * d, k * d:(k + 1) * d].T
        step = np.linalg.solve(H + RIDGE * np.eye(3 * d), G).reshape(3, d).T
        T = T - step
        if np.abs(step).max() < 1e-9:
            break
    return T


def _etape9():
    pb = _check_adam(np.random.default_rng(CTX["seed"]))
    if pb:
        _result(ok=False, **pb)
        return
    times = {}
    t0 = time.perf_counter()
    X, A = _expert_data(percevoir, seeds=TRAIN9)
    Y = np.eye(3)[A + 1]
    mu, M = normaliser(X)
    mu, M = np.asarray(mu, dtype=float).ravel(), np.asarray(M, dtype=float)
    Xn = (X - mu) @ M
    N = len(Xn)
    times["collecte"] = time.perf_counter() - t0

    t0 = time.perf_counter()
    T = _newton_lin(np.hstack([Xn, np.ones((N, 1))]), Y)
    W, b = T[:-1].T, T[-1]
    survie_lin = float(np.mean([_play(lambda p: decider(W, b, (_vec(percevoir(p)) - mu) @ M), s)[0] for s in EVAL_SEEDS]))
    times["lineaire"] = time.perf_counter() - t0

    t0 = time.perf_counter()
    rng = np.random.default_rng(0)  # fixed: the same brain every run
    W1, b1 = (np.asarray(a, dtype=float) for a in initialiser(Xn.shape[1], HIDDEN, rng))
    W2, b2 = (np.asarray(a, dtype=float) for a in initialiser(HIDDEN, 3, rng))
    P = [W1, b1, W2, b2]
    m = [np.zeros_like(p) for p in P]
    v = [np.zeros_like(p) for p in P]
    t = 0
    losses = [float(entropie_croisee(_vec(propager(*P, Xn)).reshape(N, 3), Y))]
    for _ in range(EPOCHS):
        order = rng.permutation(N)
        for i in range(0, N, BATCH):
            j = order[i:i + BATCH]
            G = gradients(*P, Xn[j], Y[j])
            t += 1
            for k in range(4):
                P[k], m[k], v[k] = (np.asarray(o, dtype=float) for o in pas_adam(P[k], np.asarray(G[k], dtype=float), m[k], v[k], t, ALPHA))
        losses.append(float(entropie_croisee(_vec(propager(*P, Xn)).reshape(N, 3), Y)))
    times["entrainement"] = time.perf_counter() - t0

    t0 = time.perf_counter()
    W1, b1, W2, b2 = P
    survie = _evaluate(lambda p: int(np.argmax(_vec(propager(W1, b1, W2, b2, ((_vec(percevoir(p)) - mu) @ M)[None])))) - 1)
    times["evaluation"] = time.perf_counter() - t0
    _result(ok=True, n=int(N), pas=t, pertes=losses, survie=survie, survie_lin=survie_lin, temps=times)


if _dep_error:
    _result(dep=_dep_error)
else:
    _etape9()
