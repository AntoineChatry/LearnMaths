// "Meteor rain": the robot sits on the bottom row and dodges falling meteors.
// The same rules exist in TypeScript (live play with the keyboard) and in Python (evaluations, exported repo),
// driven by the same LCG so that a seed gives the exact same game in both.

export const COLS = 9;
export const ROWS = 10;
export const SPAWN_P = 0.28;
export const MAX_PER_ROW = 3;
export const MAX_TICKS = 300;

export type Meteor = [number, number];
export type GameState = { x: number; meteors: Meteor[]; tick: number; alive: boolean; rng: number };

// Numerical Recipes LCG: next = (1664525 * s + 1013904223) mod 2^32. Returns a float in [0, 1).
export function lcg(s: number): [number, number] {
  const next = (Math.imul(1664525, s) + 1013904223) >>> 0;
  return [next, next / 4294967296];
}

export function newGame(seed: number): GameState {
  return { x: Math.floor(COLS / 2), meteors: [], tick: 0, alive: true, rng: seed >>> 0 };
}

// One tick: the robot moves (−1, 0, +1, clamped), meteors fall one row, collision check, then a new top row.
export function step(g: GameState, action: number): GameState {
  if (!g.alive) return g;
  const x = Math.min(COLS - 1, Math.max(0, g.x + action));
  let meteors: Meteor[] = g.meteors.map(([mx, my]) => [mx, my - 1]);
  const alive = !meteors.some(([mx, my]) => mx === x && my === 0);
  meteors = meteors.filter(([, my]) => my >= 0);
  let rng = g.rng;
  let spawned = 0;
  for (let c = 0; c < COLS; c++) {
    let r: number;
    [rng, r] = lcg(rng);
    if (r < SPAWN_P && spawned < MAX_PER_ROW) {
      meteors.push([c, ROWS - 1]);
      spawned++;
    }
  }
  return { x, meteors, tick: g.tick + 1, alive, rng };
}

export const PY_ENGINE = `COLS, ROWS, SPAWN_P, MAX_PER_ROW, MAX_TICKS = ${COLS}, ${ROWS}, ${SPAWN_P}, ${MAX_PER_ROW}, ${MAX_TICKS}


def lcg(s):
    """Numerical Recipes LCG: returns (next state, float in [0, 1))."""
    nxt = (1664525 * s + 1013904223) % 2**32
    return nxt, nxt / 4294967296


class Partie:
    """Pluie de météores : le robot, sur la ligne du bas, esquive les météores qui tombent."""

    def __init__(self, graine):
        self.x = COLS // 2
        self.meteores = []
        self.tick = 0
        self.vivant = True
        self._rng = graine % 2**32

    def jouer(self, action):
        """action : -1 (gauche), 0 (rester) ou +1 (droite)."""
        if not self.vivant:
            return
        self.x = min(COLS - 1, max(0, self.x + action))
        self.meteores = [(mx, my - 1) for (mx, my) in self.meteores]
        if any(mx == self.x and my == 0 for (mx, my) in self.meteores):
            self.vivant = False
        self.meteores = [(mx, my) for (mx, my) in self.meteores if my >= 0]
        n = 0
        for c in range(COLS):
            self._rng, r = lcg(self._rng)
            if r < SPAWN_P and n < MAX_PER_ROW:
                self.meteores.append((c, ROWS - 1))
                n += 1
        self.tick += 1
`;
