import { useState } from "react";
import { Coordinates, Ellipse, Mafs, Point, Polyline, Theme } from "mafs";
import { Tex } from "../../components/Tex";
import { texNum } from "../../lib/tex";

// f(x, y) = ½(λx x² + λy y²): eigenvalues 0.04 (flat, along x) and 1 (steep, along y), κ = 25.
type V = [number, number];
const LX = 0.04;
const LY = 1;
const START: V = [-5, 1.5];
const DRAWN = 40;
const MAX_ITER = 5000;
const TOL = 1e-3;
const FAR = 50;
const LEVELS = [0.02, 0.08, 0.2, 0.4, 0.7, 1.1];
// Optimal settings (Goh, 2017) with λ1 = 0.04, λn = 1.
const ETA_OPT = (2 / (Math.sqrt(LX) + Math.sqrt(LY))) ** 2;
const BETA_OPT = ((Math.sqrt(LY) - Math.sqrt(LX)) / (Math.sqrt(LY) + Math.sqrt(LX))) ** 2;

// Heavy ball: z ← βz + ∇f(w), w ← w − ηz. Returns the drawn points and the number of steps to ‖w‖ < TOL.
function run(eta: number, beta: number): { pts: V[]; steps: number | null } {
  let [x, y] = START;
  let [zx, zy] = [0, 0];
  const pts: V[] = [[x, y]];
  for (let k = 1; k <= MAX_ITER; k++) {
    zx = beta * zx + LX * x;
    zy = beta * zy + LY * y;
    x -= eta * zx;
    y -= eta * zy;
    if (k <= DRAWN) pts.push([x, y]);
    if (Math.abs(x) > FAR || Math.abs(y) > FAR) return { pts, steps: null };
    if (Math.hypot(x, y) < TOL) return { pts, steps: k };
  }
  return { pts, steps: null };
}

// Spectral radius of R = [[β, λ], [−ηβ, 1 − ηλ]] (trace 1 + β − ηλ, determinant β).
function rate(eta: number, beta: number, lam: number): number {
  const tr = 1 + beta - eta * lam;
  const disc = tr * tr - 4 * beta;
  if (disc < 0) return Math.sqrt(beta);
  const s = Math.sqrt(disc);
  return Math.max(Math.abs(tr + s), Math.abs(tr - s)) / 2;
}

const plain = (n: number, d = 2) => texNum(n, d).replace("{,}", ",");

export function MomentumViz() {
  const [eta, setEta] = useState(1.5);
  const [beta, setBeta] = useState(0.5);
  const gd = run(eta, 0);
  const mo = run(eta, beta);
  const rGd = Math.max(rate(eta, 0, LX), rate(eta, 0, LY));
  const rMo = Math.max(rate(eta, beta, LX), rate(eta, beta, LY));
  const stepsTex = (s: number | null) =>
    s === null ? "\\text{ne converge pas}" : `\\|w\\| < 10^{-3} \\text{ en } ${s} \\text{ pas}`;

  return (
    <figure className="viz" aria-label="Descente de gradient avec et sans momentum sur un bol allongé">
      <Mafs height={300} viewBox={{ x: [-5.5, 5.5], y: [-2, 2] }} pan={false}>
        <Coordinates.Cartesian />
        {LEVELS.map((c) => (
          <Ellipse
            key={c}
            center={[0, 0]}
            radius={[Math.sqrt((2 * c) / LX), Math.sqrt((2 * c) / LY)]}
            color={Theme.foreground}
            fillOpacity={0}
            strokeOpacity={0.25}
            weight={1.5}
          />
        ))}
        <Polyline points={gd.pts} color={Theme.red} weight={2} fillOpacity={0} />
        <Polyline points={mo.pts} color={Theme.blue} weight={2.5} fillOpacity={0} />
        {mo.pts.slice(1).map(([x, y], i) => (
          <Point key={i} x={x} y={y} color={Theme.blue} opacity={0.8} />
        ))}
        <Point x={START[0]} y={START[1]} color={Theme.orange} />
      </Mafs>
      <div className="viz-controls">
        <label>
          Pas η
          <input type="range" min={0.1} max={3.5} step={0.01} value={eta} onChange={(e) => setEta(Number(e.target.value))} />
          <span className="viz-readout">{plain(eta)}</span>
        </label>
        <label>
          Momentum β
          <input type="range" min={0} max={0.95} step={0.01} value={beta} onChange={(e) => setBeta(Number(e.target.value))} />
          <span className="viz-readout">{plain(beta)}</span>
        </label>
        <button
          type="button"
          onClick={() => {
            setEta(ETA_OPT);
            setBeta(BETA_OPT);
          }}
        >
          Réglages optimaux
        </button>
      </div>
      <div className="viz-formulas">
        <span>
          <Tex>{"f(x, y) = \\tfrac12\\,(0{,}04\\,x^2 + y^2)"}</Tex> &emsp; <Tex>{"\\kappa = 25"}</Tex>
        </span>
        <span style={{ color: Theme.red }}>
          <Tex>{`\\text{gradient : } \\rho = ${texNum(rGd, 3)}`}</Tex> &emsp; <Tex>{stepsTex(gd.steps)}</Tex>
        </span>
        <span style={{ color: Theme.blue }}>
          <Tex>{`\\text{momentum : } \\rho = ${texNum(rMo, 3)}`}</Tex> &emsp; <Tex>{stepsTex(mo.steps)}</Tex>
        </span>
        <p className="viz-delta">
          Même pas η pour les deux ; seul le momentum (bleu) garde la mémoire des gradients passés. On trace les{" "}
          {DRAWN} premiers pas. <Tex>\rho</Tex> est le facteur de réduction de l'erreur par pas, dans la pire direction
          propre : la méthode converge si et seulement si <Tex>{"\\rho < 1"}</Tex>.
        </p>
      </div>
    </figure>
  );
}
