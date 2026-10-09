# Step 8 check: gradients(W1, b1, W2, b2, X, Y) must return the gradients of the mean cross-entropy of the 20-32-3
# network (backpropagation, Bishop PRML 5.53-5.57). Checked against the exact gradients, then by central differences
# (PRML 5.69) on a few weights, with the cost of a full gradient both ways. Then 100 steps of plain gradient descent
# with the player's gradients, from the player's He init: loss curve and one filmed game (no survival claim here).
import time

HIDDEN = 32
STEPS, ETA = 100, 1.0


def _grads_ref(W1, b1, W2, b2, X, Y):
    Z = X @ W1.T + b1
    H = np.maximum(Z, 0)
    D2 = (_softmax_ref(H @ W2.T + b2) - Y) / len(X)
    D1 = (D2 @ W2) * (Z > 0)
    return [D1.T @ X, D1.sum(0), D2.T @ H, D2.sum(0)]


def _softmax_ref(S):
    E = np.exp(S - S.max(axis=1, keepdims=True))
    return E / E.sum(axis=1, keepdims=True)


def _loss_ref(P, X, Y):
    S = np.maximum(X @ P[0].T + P[1], 0) @ P[2].T + P[3]
    Z = S - S.max(axis=1, keepdims=True)
    return float(-np.sum(Y * (Z - np.log(np.exp(Z).sum(axis=1, keepdims=True)))) / len(X))


def _player_grads(P, X, Y):
    out = gradients(*[p.copy() for p in P], X.copy(), Y.copy())
    try:
        return [np.asarray(o, dtype=float) for o in out] if len(out) == 4 else None
    except (TypeError, ValueError):
        return None


NAMES = ["W1", "b1", "W2", "b2"]


def _etape8():
    rng = np.random.default_rng(CTX["seed"])
    N = 40
    P = [rng.normal(0, np.sqrt(2 / 20), (HIDDEN, 20)), rng.normal(0, 0.5, HIDDEN),
         rng.normal(0, np.sqrt(2 / HIDDEN), (3, HIDDEN)), rng.normal(0, 0.5, 3)]
    X = rng.normal(size=(N, 20))
    Y = np.eye(3)[rng.integers(0, 3, N)]
    ref = _grads_ref(*P, X, Y)
    got = _player_grads(P, X, Y)
    if got is None:
        _result(ok=False, pb="nombre")
        return
    for k in range(4):
        if got[k].shape != ref[k].shape:
            _result(ok=False, pb="forme", name=NAMES[k], want=list(ref[k].shape), shape=list(got[k].shape))
            return
    for k in range(4):
        if not np.allclose(got[k], ref[k], rtol=1e-6, atol=1e-10):
            i = int(np.argmax(np.abs(got[k] - ref[k])))
            # Central difference on that parameter, so the player sees the true slope.
            Q = [p.copy() for p in P]
            flat = Q[k].reshape(-1)
            flat[i] += 1e-5
            lp = _loss_ref(Q, X, Y)
            flat[i] -= 2e-5
            lm = _loss_ref(Q, X, Y)
            slope = (lp - lm) / 2e-5
            g_flat = got[k].reshape(-1)
            mean_off = bool(np.allclose(got[k], N * ref[k], rtol=1e-6, atol=1e-10))
            Z = X @ P[0].T + P[1]
            D2 = (_softmax_ref(np.maximum(Z, 0) @ P[2].T + P[3]) - Y) / N
            no_mask = k < 2 and bool(np.allclose(got[k], [(D2 @ P[2]).T @ X, (D2 @ P[2]).sum(0)][k], rtol=1e-6, atol=1e-10))
            idx = list(np.unravel_index(i, ref[k].shape))
            _result(ok=False, pb="valeur", name=NAMES[k], idx=[int(j) for j in idx], slope=slope,
                    got=float(g_flat[i]), mean_off=mean_off, no_mask=no_mask)
            return
    # Gradient checking (PRML 5.69) on 5 random weights of W1, and the cost of a full gradient both ways.
    checks = []
    for _ in range(5):
        i = int(rng.integers(0, P[0].size))
        Q = [p.copy() for p in P]
        flat = Q[0].reshape(-1)
        flat[i] += 1e-5
        lp = _loss_ref(Q, X, Y)
        flat[i] -= 2e-5
        lm = _loss_ref(Q, X, Y)
        checks.append([(lp - lm) / 2e-5, float(got[0].reshape(-1)[i])])
    n_params = sum(p.size for p in P)
    t0 = time.perf_counter()
    for _ in range(50):
        _player_grads(P, X, Y)
    t_bp = (time.perf_counter() - t0) / 50
    t0 = time.perf_counter()
    for _ in range(2 * n_params):
        _loss_ref(P, X, Y)
    t_fd = time.perf_counter() - t0

    # A short training with the player's gradients and init, on the expert games.
    Xe, A = _expert_data(percevoir)
    Ye = np.eye(3)[A + 1]
    mu, M = normaliser(Xe)
    mu, M = np.asarray(mu, dtype=float).ravel(), np.asarray(M, dtype=float)
    Xn = (Xe - mu) @ M
    W1, b1 = (np.asarray(a, dtype=float) for a in initialiser(Xn.shape[1], HIDDEN, rng))
    W2, b2 = (np.asarray(a, dtype=float) for a in initialiser(HIDDEN, 3, rng))
    Q = [W1, b1, W2, b2]
    losses = []
    for _ in range(STEPS):
        losses.append(float(entropie_croisee(_vec(propager(*Q, Xn)).reshape(len(Xn), 3), Ye)))
        Q = [q - ETA * gq for q, gq in zip(Q, _player_grads(Q, Xn, Ye))]
    losses.append(float(entropie_croisee(_vec(propager(*Q, Xn)).reshape(len(Xn), 3), Ye)))
    W1, b1, W2, b2 = Q
    _trace.extend(_play(lambda p: int(np.argmax(_vec(propager(W1, b1, W2, b2, ((_vec(percevoir(p)) - mu) @ M)[None])))) - 1,
                        CTX["seed"], film=True)[1])
    _result(ok=True, checks=checks, n_params=int(n_params), t_bp=t_bp, t_fd=t_fd, pertes=losses)


if _dep_error:
    _result(dep=_dep_error)
else:
    _etape8()
