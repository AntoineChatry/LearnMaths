import { useState } from "react";
import { Coordinates, Ellipse, Mafs, Point, Polyline, Theme, useMovablePoint } from "mafs";
import { Tex } from "../../components/Tex";
import { texNum } from "../../lib/tex";

// Same bowl as above: f(x, y) = x² + 5y², gradient (2x, 10y), minimum at (0, 0).
const f = (x: number, y: number) => x * x + 5 * y * y;
const LEVELS = [0.25, 1, 2.25, 4, 6.25, 9, 12.25, 16];
const STEPS = 25;
// Beyond that, the trajectory has gone off to infinity: no point drawing it further.
const FAR = 40;

const snap = (v: number) => Math.round(v * 4) / 4;
const clamp = (v: number, lo: number, hi: number) => Math.max(lo, Math.min(hi, v));

function trajectory(start: [number, number], eta: number): [number, number][] {
  const pts: [number, number][] = [start];
  let [x, y] = start;
  for (let t = 0; t < STEPS; t++) {
    x = x - eta * 2 * x;
    y = y - eta * 10 * y;
    pts.push([x, y]);
    if (Math.abs(x) > FAR || Math.abs(y) > FAR) break;
  }
  return pts;
}

export function DescentViz() {
  const [eta, setEta] = useState(0.05);
  const start = useMovablePoint([-4, 1.5], {
    color: Theme.orange,
    constrain: ([x, y]) => [clamp(snap(x), -4, 4), clamp(snap(y), -2, 2)],
  });
  const pts = trajectory(start.point, eta);
  const last = pts[pts.length - 1];
  const diverged = Math.abs(last[0]) > FAR || Math.abs(last[1]) > FAR;

  // Each step multiplies y by (1 − 10η) and x by (1 − 2η).
  const ry = 1 - 10 * eta;
  const rx = 1 - 2 * eta;
  let verdict: string;
  let verdictClass: string;
  if (Math.abs(ry) > 1 + 1e-9) {
    verdict = "η > 0,2 : |1 − 10η| > 1, chaque pas fait grandir y. La descente diverge.";
    verdictClass = "viz-verdict-ko";
  } else if (Math.abs(ry + 1) < 1e-9) {
    verdict = "η = 0,2 : 1 − 10η = −1, y rebondit d'un bord à l'autre sans jamais diminuer.";
    verdictClass = "viz-verdict-ko";
  } else if (ry < -1e-9) {
    verdict = "0,1 < η : 1 − 10η < 0, y change de signe à chaque pas. Zigzag.";
    verdictClass = "viz-verdict-ko";
  } else {
    verdict = "η ≤ 0,1 : y décroît sans changer de signe. Pas de zigzag.";
    verdictClass = "viz-verdict-ok";
  }

  return (
    <figure className="viz" aria-label="Descente de gradient sur f(x, y) = x² + 5y²">
      <Mafs height={340} viewBox={{ x: [-4.5, 4.5], y: [-2.5, 2.5] }} pan={false}>
        <Coordinates.Cartesian />
        {LEVELS.map((c) => (
          <Ellipse
            key={c}
            center={[0, 0]}
            radius={[Math.sqrt(c), Math.sqrt(c / 5)]}
            color={Theme.foreground}
            fillOpacity={0}
            strokeOpacity={0.25}
            weight={1.5}
          />
        ))}
        <Polyline points={pts} color={Theme.blue} weight={2.5} fillOpacity={0} />
        {pts.slice(1).map(([x, y], i) => (
          <Point key={i} x={x} y={y} color={Theme.blue} opacity={0.8} />
        ))}
        {start.element}
      </Mafs>
      <div className="viz-controls">
        <label>
          Pas η
          <input type="range" min={0.01} max={0.21} step={0.01} value={eta} onChange={(e) => setEta(Number(e.target.value))} />
          <span className="viz-readout">{texNum(eta).replace("{,}", ",")}</span>
        </label>
        <span className="viz-readout">
          {diverged ? (
            <>La trajectoire sort du cadre après {pts.length - 1} pas.</>
          ) : (
            <>
              Après {STEPS} pas : <Tex>{`(x, y) \\approx (${texNum(last[0], 3)},\\ ${texNum(last[1], 3)})`}</Tex>,{" "}
              <Tex>{`f \\approx ${texNum(f(last[0], last[1]), 4)}`}</Tex>
            </>
          )}
        </span>
      </div>
      <div className="viz-formulas">
        <Tex>{`(x, y) \\leftarrow (x, y) - \\eta\\,(2x,\\ 10y) = \\big((1 - 2\\eta)\\,x,\\ (1 - 10\\eta)\\,y\\big)`}</Tex>
        <Tex>{`1 - 2\\eta = ${texNum(rx)} \\qquad 1 - 10\\eta = ${texNum(ry)}`}</Tex>
        <p className="viz-delta">
          <span className={verdictClass}>{verdict}</span>
        </p>
      </div>
    </figure>
  );
}
