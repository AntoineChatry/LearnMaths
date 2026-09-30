// Top-down grid world shared by the quest levels. Math coordinates: x to the right, y up, cell centers at integers.
export type Cell = [number, number];
export type Turret = { x: number; y: number; r: number };

export type WorldCtx = {
  w: number;
  h: number;
  walls: Cell[];
  start: Cell;
  exit: Cell;
  crystals: Cell[];
  turrets: Turret[];
};

// Events recorded by the Python world, replayed by the scene.
export type WorldEvent =
  | ["move", number, number]
  | ["bump", number, number, number, number]
  | ["pick", number]
  | ["shot", number, number, number, number, number | null]
  | ["zap", number, number, number]
  | ["exit"];

// Parses an ASCII map, top row first: '#' wall, 'S' start, 'E' exit, '*' crystal, 'T' turret, '.' floor.
export function parseMap(rows: string[], turretRange = 2.5): WorldCtx {
  const h = rows.length;
  const w = rows[0].length;
  const ctx: WorldCtx = { w, h, walls: [], start: [0, 0], exit: [0, 0], crystals: [], turrets: [] };
  rows.forEach((row, i) => {
    const y = h - 1 - i;
    [...row].forEach((ch, x) => {
      if (ch === "#") ctx.walls.push([x, y]);
      else if (ch === "S") ctx.start = [x, y];
      else if (ch === "E") ctx.exit = [x, y];
      else if (ch === "*") ctx.crystals.push([x, y]);
      else if (ch === "T") ctx.turrets.push({ x, y, r: turretRange });
    });
  });
  return ctx;
}

const RAY_STEP = 0.05;
const RAY_MAX = 40;
export const HIT_RADIUS = 0.4;

// Same ray marching as the Python world (tirer): stops on a wall, the border or the first live turret.
export function castRay(ctx: WorldCtx, from: Cell, angleDeg: number, alive: boolean[]): { end: [number, number]; hit: number | null } {
  const a = (angleDeg * Math.PI) / 180;
  const dx = Math.cos(a);
  const dy = Math.sin(a);
  const walls = new Set(ctx.walls.map(([x, y]) => `${x},${y}`));
  for (let s = RAY_STEP; s <= RAY_MAX; s += RAY_STEP) {
    const px = from[0] + dx * s;
    const py = from[1] + dy * s;
    const cx = Math.round(px);
    const cy = Math.round(py);
    if (cx < 0 || cy < 0 || cx >= ctx.w || cy >= ctx.h || walls.has(`${cx},${cy}`)) return { end: [px, py], hit: null };
    for (let i = 0; i < ctx.turrets.length; i++) {
      const t = ctx.turrets[i];
      if (alive[i] && Math.hypot(px - t.x, py - t.y) < HIT_RADIUS) return { end: [px, py], hit: i };
    }
  }
  return { end: [from[0] + dx * RAY_MAX, from[1] + dy * RAY_MAX], hit: null };
}

// Python side of the world: the `robot` object. Levels may append their own functions after it.
export const ROBOT_PRELUDE = `import json, math
CTX = json.loads(CTX_JSON)
_trace = []

class RobotDetruit(Exception):
    pass

class Robot:
    MAX_ACTIONS = 400

    def __init__(self):
        self._x, self._y = CTX["start"]
        self._walls = set(tuple(c) for c in CTX["walls"])
        self._crystals = {i: tuple(c) for i, c in enumerate(CTX["crystals"])}
        self._turrets = [dict(t, alive=True) for t in CTX["turrets"]]
        self._actions = 0

    def _count(self):
        self._actions += 1
        if self._actions > self.MAX_ACTIONS:
            raise RuntimeError("plus de " + str(self.MAX_ACTIONS) + " actions : le robot est à court d'énergie")

    def _free(self, x, y):
        if not (0 <= x < CTX["w"] and 0 <= y < CTX["h"]) or (x, y) in self._walls:
            return False
        return not any(t["alive"] and (t["x"], t["y"]) == (x, y) for t in self._turrets)

    def _arrive(self):
        for i, t in enumerate(self._turrets):
            if t["alive"] and math.hypot(t["x"] - self._x, t["y"] - self._y) <= t["r"]:
                _trace.append(["zap", i, self._x, self._y])
                raise RobotDetruit("la tourelle en " + str((t["x"], t["y"])) + " t'a vu")
        for i, c in list(self._crystals.items()):
            if c == (self._x, self._y):
                _trace.append(["pick", i])
                del self._crystals[i]
        if (self._x, self._y) == tuple(CTX["exit"]) and not self._crystals:
            _trace.append(["exit"])

    def _walk(self, dx, dy, n):
        if n != int(n) or n < 0:
            raise ValueError("le nombre de cases doit être un entier positif, pas " + repr(n))
        for _ in range(int(n)):
            self._count()
            nx, ny = self._x + dx, self._y + dy
            if not self._free(nx, ny):
                _trace.append(["bump", self._x, self._y, dx, dy])
                return
            self._x, self._y = nx, ny
            _trace.append(["move", nx, ny])
            self._arrive()

    def droite(self, n=1):
        self._walk(1, 0, n)

    def gauche(self, n=1):
        self._walk(-1, 0, n)

    def haut(self, n=1):
        self._walk(0, 1, n)

    def bas(self, n=1):
        self._walk(0, -1, n)

    def position(self):
        return (self._x, self._y)

    def scanner(self):
        return {
            "cristaux": list(self._crystals.values()),
            "tourelles": [(t["x"], t["y"]) for t in self._turrets if t["alive"]],
            "sortie": tuple(CTX["exit"]),
        }

    def tirer(self, angle):
        self._count()
        a = math.radians(float(angle))
        dx, dy = math.cos(a), math.sin(a)
        x0, y0 = self._x, self._y
        s, hit = ${RAY_STEP}, None
        px, py = x0 + dx * ${RAY_MAX}, y0 + dy * ${RAY_MAX}
        while s <= ${RAY_MAX}:
            qx, qy = x0 + dx * s, y0 + dy * s
            # floor(q + 0.5) like JS Math.round: Python's round() sends halves to the even integer.
            cx, cy = math.floor(qx + 0.5), math.floor(qy + 0.5)
            if not (0 <= cx < CTX["w"] and 0 <= cy < CTX["h"]) or (cx, cy) in self._walls:
                px, py = qx, qy
                break
            found = next((i for i, t in enumerate(self._turrets) if t["alive"] and math.hypot(qx - t["x"], qy - t["y"]) < ${HIT_RADIUS}), None)
            if found is not None:
                px, py, hit = qx, qy, found
                self._turrets[found]["alive"] = False
                break
            s += ${RAY_STEP}
        _trace.append(["shot", x0, y0, px, py, hit])
        return hit is not None

robot = Robot()
`;
