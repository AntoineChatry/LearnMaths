// Gradient golf: f(x, y) = a x² + b y², gradient (2a x, 2b y), minimum (the hole) at (0, 0).
export type GolfLevel = { a: number; b: number; start: [number, number] };

export const GOLF_LEVELS: GolfLevel[] = [
  { a: 1, b: 1, start: [3, 2] },
  { a: 1, b: 3, start: [-3, 1.5] },
  { a: 1, b: 5, start: [-4, 1.5] },
  { a: 0.5, b: 4, start: [4, -1.5] },
];

export const HOLE_RADIUS = 0.1;
export const MAX_STEPS = 100;
// Beyond that the ball has flown off to infinity.
export const FAR = 50;
// η slider grid: 0.01 to 1.00.
export const ETA_MIN = 0.01;
export const ETA_MAX = 1;
export const ETA_STEP = 0.01;

export type Shot = { path: [number, number][]; outcome: "hole" | "diverged" | "short" };

export function shoot(level: GolfLevel, eta: number): Shot {
  const { a, b } = level;
  let [x, y] = level.start;
  const path: [number, number][] = [[x, y]];
  for (let t = 0; t < MAX_STEPS; t++) {
    x = x - eta * 2 * a * x;
    y = y - eta * 2 * b * y;
    path.push([x, y]);
    if (Math.hypot(x, y) < HOLE_RADIUS) return { path, outcome: "hole" };
    if (Math.abs(x) > FAR || Math.abs(y) > FAR) return { path, outcome: "diverged" };
  }
  return { path, outcome: "short" };
}

// Par = fewest steps reachable with an η on the slider grid (brute force over the same grid as the player).
export function par(level: GolfLevel): { steps: number; eta: number } {
  let best = { steps: Infinity, eta: NaN };
  const n = Math.round((ETA_MAX - ETA_MIN) / ETA_STEP);
  for (let i = 0; i <= n; i++) {
    const eta = Math.round((ETA_MIN + i * ETA_STEP) * 100) / 100;
    const s = shoot(level, eta);
    if (s.outcome === "hole" && s.path.length - 1 < best.steps) best = { steps: s.path.length - 1, eta };
  }
  return best;
}

// 3 stars at par, 2 up to twice par, 1 for any hole.
export function stars(steps: number, parSteps: number): number {
  if (steps <= parSteps) return 3;
  if (steps <= 2 * parSteps) return 2;
  return 1;
}
