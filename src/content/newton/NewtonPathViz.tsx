import { useState } from "react";
import { Coordinates, Ellipse, Mafs, Point, Polyline, Theme, useMovablePoint } from "mafs";
import { Tex } from "../../components/Tex";
import { texNum } from "../../lib/tex";

// f(x, y) = sqrt(1 + x² + K y²): convex, not quadratic, elongated bowl with elliptic level curves.
type V = [number, number];
const K = 10;
const q = ([x, y]: V) => x * x + K * y * y;
const f = (w: V) => Math.sqrt(1 + q(w));
const LEVELS = [1.5, 2, 2.5, 3, 3.5, 4];
const STEPS = 12;
const FAR = 30;
const clamp = (v: number, lo: number, hi: number) => Math.max(lo, Math.min(hi, v));

function grad(w: V): V {
  const s = Math.sqrt(1 + q(w));
  return [w[0] / s, (K * w[1]) / s];
}

// Newton direction: solve H d = -g with the 2×2 Hessian of f.
function newtonDir(w: V): V {
  const s = 1 + q(w);
  const u: V = [w[0], K * w[1]];
  const a = 1 / Math.sqrt(s) - (u[0] * u[0]) / s ** 1.5;
  const b = -(u[0] * u[1]) / s ** 1.5;
  const d = K / Math.sqrt(s) - (u[1] * u[1]) / s ** 1.5;
  const g = grad(w);
  const det = a * d - b * b;
  return [-(d * g[0] - b * g[1]) / det, -(-b * g[0] + a * g[1]) / det];
}

// Backtracking line search (Boyd, algorithm 9.2) with alpha = 0.25, beta = 0.5.
function backtrack(w: V, dir: V): number {
  const g = grad(w);
  const slope = g[0] * dir[0] + g[1] * dir[1];
  let t = 1;
  while (f([w[0] + t * dir[0], w[1] + t * dir[1]]) > f(w) + 0.25 * t * slope && t > 1e-12) t /= 2;
  return t;
}

function path(start: V, kind: "gradient" | "newton" | "pur"): V[] {
  const pts: V[] = [start];
  let w = start;
  for (let k = 0; k < STEPS; k++) {
    const g = grad(w);
    const dir: V = kind === "gradient" ? [-g[0], -g[1]] : newtonDir(w);
    const t = kind === "pur" ? 1 : backtrack(w, dir);
    w = [w[0] + t * dir[0], w[1] + t * dir[1]];
    pts.push(w);
    if (Math.abs(w[0]) > FAR || Math.abs(w[1]) > FAR) break;
  }
  return pts;
}

export function NewtonPathViz() {
  const [pure, setPure] = useState(false);
  const start = useMovablePoint([3, 0.8], {
    color: Theme.orange,
    constrain: ([x, y]) => [clamp(Math.round(x * 10) / 10, -3.8, 3.8), clamp(Math.round(y * 20) / 20, -1.4, 1.4)],
  });
  const gd = path(start.point, "gradient");
  const nt = path(start.point, pure ? "pur" : "newton");
  const gLast = gd[gd.length - 1];
  const nLast = nt[nt.length - 1];
  const diverged = Math.abs(nLast[0]) > FAR || Math.abs(nLast[1]) > FAR;
  const q0 = q(start.point);
  // f − min f, in scientific notation once it is small; below 1e-15 it is rounding noise.
  const gapTex = (w: V) => {
    const v = f(w) - 1;
    if (v < 1e-15) return "f - 1 < 10^{-15}";
    if (v >= 1e-3) return `f - 1 = ${texNum(v, 3)}`;
    const e = Math.ceil(-Math.log10(v));
    return `f - 1 = ${texNum(v * 10 ** e, 1)} \\cdot 10^{-${e}}`;
  };

  return (
    <figure className="viz" aria-label="Descente de gradient et méthode de Newton sur un bol allongé non quadratique">
      <Mafs height={320} viewBox={{ x: [-4, 4], y: [-1.5, 1.5] }} pan={false}>
        <Coordinates.Cartesian />
        {LEVELS.map((c) => (
          <Ellipse
            key={c}
            center={[0, 0]}
            radius={[Math.sqrt(c * c - 1), Math.sqrt((c * c - 1) / K)]}
            color={Theme.foreground}
            fillOpacity={0}
            strokeOpacity={0.25}
            weight={1.5}
          />
        ))}
        {pure && <Ellipse center={[0, 0]} radius={[1, 1 / Math.sqrt(K)]} color={Theme.green} fillOpacity={0.08} strokeStyle="dashed" weight={2} />}
        <Polyline points={gd} color={Theme.red} weight={2} fillOpacity={0} />
        <Polyline points={nt} color={Theme.blue} weight={3} fillOpacity={0} />
        {nt.slice(1).map(([x, y], i) => (
          <Point key={i} x={x} y={y} color={Theme.blue} />
        ))}
        {start.element}
      </Mafs>
      <div className="viz-controls">
        <label>
          <input type="checkbox" checked={pure} onChange={(e) => setPure(e.target.checked)} />
          <span>
            Newton pur (pas <Tex>{"t = 1"}</Tex>, sans recherche linéaire)
          </span>
        </label>
      </div>
      <div className="viz-formulas">
        <Tex>{"f(x, y) = \\sqrt{1 + x^2 + 10\\,y^2} \\qquad \\min f = 1 \\text{ en } (0, 0)"}</Tex>
        <span>
          <span style={{ color: Theme.red }}>
            <Tex>{`\\text{gradient : } ${gapTex(gLast)}`}</Tex>
          </span>
          <Tex>{"\\qquad"}</Tex>
          <span style={{ color: Theme.blue }}>
            {diverged ? (
              <Tex>{"\\text{Newton : diverge}"}</Tex>
            ) : (
              <Tex>{`\\text{Newton : } ${gapTex(nLast)}`}</Tex>
            )}
          </span>
        </span>
        <p className="viz-delta">
          {STEPS} pas de chaque méthode depuis le point orange, que tu peux déplacer.
          {pure
            ? " Le gradient (rouge) garde sa recherche linéaire ; Newton (bleu) prend le pas plein."
            : " Même recherche linéaire pour les deux : seule la direction change."}{" "}
          Le gradient part perpendiculairement aux lignes de niveau et zigzague ; Newton vise directement le centre.
          {pure &&
            (q0 < 1
              ? " Départ dans l'ellipse verte : Newton pur converge, et très vite."
              : " Départ hors de l'ellipse verte : le pas plein saute de l'autre côté, de plus en plus loin.")}
        </p>
      </div>
    </figure>
  );
}
