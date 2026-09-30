# Step 1 check: the player's percevoir(partie) against the reference vision, on every state of expert games.
def _etape1():
    wrong, total, first = 0, 0, None
    for i in range(6):
        p = Partie(CTX["seed"] + i)
        while p.vivant and p.tick < MAX_TICKS:
            v, ref = _vec(percevoir(p)), _vision_ref(p)
            total += 1
            if v is None or v.shape != (20,) or not np.array_equal(v, ref):
                wrong += 1
                if first is None:
                    first = {"x": p.x, "meteores": [list(m) for m in p.meteores], "ref": ref.tolist(),
                             "got": None if v is None else v.tolist()}
            p.jouer(expert(p))
    def vision(p):
        v = _vec(percevoir(p))
        return v if v is not None and v.shape == (20,) else np.zeros(20)

    _, frames = _play(expert, CTX["seed"], film=True, vision=vision)
    _trace.extend(frames)
    _result(wrong=wrong, total=total, first=first)


if _dep_error:
    _result(dep=_dep_error)
else:
    _etape1()
