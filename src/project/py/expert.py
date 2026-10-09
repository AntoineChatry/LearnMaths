# The expert player, shared by the project steps (prelude) and the downloaded program (cerveau.py).
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
