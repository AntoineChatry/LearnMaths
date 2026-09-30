# Shared world of the project steps, run after the engine (PY_ENGINE) and before the player's code.
# Names starting with "_" belong to the harness; the player uses Partie, expert and the functions of earlier steps.
import json

import numpy as np

CTX = json.loads(CTX_JSON)
_trace = []
_dep_error = None

TRAIN_SEEDS = range(1000, 1030)  # the expert games the robot learns from (the same in every step)
EVAL_SEEDS = range(1, 41)
FILM_MAX = 160


def _depths(partie):
    """For each action -1, 0, +1: how many ticks one can survive at best, seeing only the visible meteors."""
    occ = set(partie.meteores)
    out = []
    for a in (-1, 0, 1):
        c0 = min(COLS - 1, max(0, partie.x + a))
        if (c0, 1) in occ:
            out.append(0)
            continue
        reach, depth = {c0}, 1
        for k in range(2, ROWS):
            nxt = {c + d for c in reach for d in (-1, 0, 1) if 0 <= c + d < COLS and (c + d, k) not in occ}
            if not nxt:
                break
            reach, depth = nxt, k
        out.append(depth)
    return out


def expert(partie):
    """Le joueur expert : il voit tous les météores et joue le coup qui permet de survivre le plus longtemps."""
    d = _depths(partie)
    best = max(d)
    if d[1] == best:
        return 0
    cands = [a for a in (-1, 1) if d[a + 1] == best]
    return min(cands, key=lambda a: abs(partie.x + a - COLS // 2))


def _vision_ref(partie):
    occ = set(partie.meteores)
    v = np.zeros(20)
    for h in range(1, 5):
        for dx in range(-2, 3):
            c = partie.x + dx
            if c < 0 or c >= COLS or (c, h) in occ:
                v[5 * (h - 1) + dx + 2] = 1.0
    return v


def _vec(v):
    """The player's vector as a flat float array, or None if it can't be read as numbers."""
    try:
        return np.asarray(v, dtype=float).ravel()
    except (TypeError, ValueError):
        return None


def _expert_data(percevoir, seeds=TRAIN_SEEDS):
    """Plays the expert on the training games; returns the robot's visions X and the expert's actions A."""
    X, A = [], []
    for s in seeds:
        p = Partie(s)
        while p.vivant and p.tick < MAX_TICKS:
            a = expert(p)
            X.append(_vec(percevoir(p)))
            A.append(a)
            p.jouer(a)
    return np.array(X), np.array(A)


def _play(policy, seed, film=False, vision=None):
    """One game driven by policy(partie) -> action. Returns the ticks survived and, if film, the frames."""
    p = Partie(seed)
    frames = []
    while p.vivant and p.tick < MAX_TICKS:
        if film and len(frames) < FILM_MAX:
            v = vision(p).tolist() if vision else None
            frames.append(["f", p.tick, p.x, [list(m) for m in p.meteores], v, True])
        p.jouer(int(policy(p)))
    if film:
        # Last frame: the end of the game (a skipped stretch if it lasted more than FILM_MAX ticks).
        frames.append(["f", p.tick, p.x, [list(m) for m in p.meteores], None, p.vivant])
    return p.tick, frames


def _evaluate(policy):
    """Mean survival over fixed games (so the same brain always gets the same score), plus one random filmed game."""
    _trace.extend(_play(policy, CTX["seed"], film=True)[1])
    return float(np.mean([_play(policy, s)[0] for s in EVAL_SEEDS]))


def _result(**kw):
    _trace.append(["res", kw])


def _loss(Xa, T, Y):
    return float(((Xa @ T - Y) ** 2).sum() / len(Xa))


def _descent(gradient, Xa, Y, pas, iters=300):
    """Gradient descent from T = 0 with the player's gradient; returns T and the losses (stops on divergence)."""
    T = np.zeros((Xa.shape[1], Y.shape[1]))
    losses = []
    with np.errstate(all="ignore"):
        return _descent_loop(gradient, Xa, Y, pas, iters, T, losses)


def _descent_loop(gradient, Xa, Y, pas, iters, T, losses):
    for _ in range(iters):
        L = _loss(Xa, T, Y)
        if not np.isfinite(L) or L > 1e6:
            losses.append(1e6)  # capped: JSON has no infinity
            break
        losses.append(L)
        T = T - pas * np.asarray(gradient(T, Xa, Y), dtype=float)
    return T, losses


def _first_below(losses, target):
    return next((i for i, L in enumerate(losses) if L <= target), None)


# Functions validated in earlier steps (the player's own code), in order.
for _num, _code in CTX.get("deps", []):
    if _code is None:
        _dep_error = f"Termine d'abord l'étape {_num}."
        break
    try:
        exec(_code, globals())
    except Exception as _e:
        _dep_error = f"Ton code de l'étape {_num} ne s'exécute plus : {type(_e).__name__}: {_e}"
        break
