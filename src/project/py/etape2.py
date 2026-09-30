# Step 2 check: decider(W, b, vision) against argmax(W @ vision + b) - 1, then a game with a random brain.
def _etape2():
    rng = np.random.default_rng(CTX["seed"])
    wrong, first = 0, None
    for _ in range(300):
        W = np.round(rng.normal(size=(3, 20)), 2)
        b = np.round(rng.normal(size=3), 2)
        v = (rng.random(20) < 0.3).astype(float)
        ref = int(np.argmax(W @ v + b)) - 1
        got = decider(W, b, v)
        try:
            ok = int(got) == got and int(got) == ref
        except (TypeError, ValueError):
            ok = False
        if not ok:
            wrong += 1
            if first is None:
                first = {"scores": (W @ v + b).round(2).tolist(), "ref": ref, "got": repr(got)}
    if wrong:
        _result(wrong=wrong, total=300, first=first)
        return
    W = rng.normal(size=(3, 20))
    b = np.zeros(3)
    survie = _evaluate(lambda p: decider(W, b, _vec(percevoir(p))))
    _result(wrong=0, total=300, survie=survie)


if _dep_error:
    _result(dep=_dep_error)
else:
    _etape2()
