import { useState } from "react";
import { Coordinates, Line, Mafs, Plot, Point, Theme, useMovablePoint } from "mafs";
import { Tex } from "../../components/Tex";
import { texNum } from "../../lib/tex";

const f = (x: number) => x * x;
const df = (x: number) => 2 * x;
const STEPS = 20;

// "= 0,4" if the displayed value is exact, "≈ 0,026" if it is rounded.
function valueTex(v: number, digits: number): string {
  if (Math.abs(v) >= 1e4) return "= \\text{énorme}";
  const exact = Math.abs(Number(v.toFixed(digits)) - v) < 1e-12;
  return `${exact ? "=" : "\\approx"} ${texNum(v, digits)}`;
}

export function GradientDescentViz() {
  const [eta, setEta] = useState(0.3);
  const start = useMovablePoint([2.5, f(2.5)], {
    constrain: ([x]) => {
      const x0 = Math.min(3, Math.max(-3, Math.round(x * 10) / 10));
      return [x0, f(x0)];
    },
  });
  const x0 = start.x;

  // The iterates are computed by the actual loop, not by the formula (1 − 2η)^k x₀.
  const xs = [x0];
  for (let k = 0; k < STEPS; k++) {
    const x = xs[k];
    xs.push(x - eta * df(x));
  }
  const inView = (x: number) => Math.abs(x) <= 4.5;
  const r = 1 - 2 * eta;

  let verdict: string;
  let verdictClass: string;
  if (Math.abs(Math.abs(r) - 1) < 1e-9) {
    verdict = "|1 − 2η| = 1 : x rebondit entre x₀ et −x₀ pour toujours.";
    verdictClass = "viz-verdict-ko";
  } else if (Math.abs(r) > 1) {
    verdict = "|1 − 2η| > 1 : chaque pas enjambe le minimum et atterrit plus loin. Ça diverge.";
    verdictClass = "viz-verdict-ko";
  } else if (Math.abs(r) < 1e-9) {
    verdict = "η = 1/2 : le minimum est atteint en un seul pas.";
    verdictClass = "viz-verdict-ok";
  } else if (r < 0) {
    verdict = "−1 < 1 − 2η < 0 : ça converge, mais en zigzag de part et d'autre du minimum.";
    verdictClass = "viz-verdict-ok";
  } else {
    verdict = "0 < 1 − 2η < 1 : ça converge sans jamais dépasser le minimum.";
    verdictClass = "viz-verdict-ok";
  }

  return (
    <figure className="viz" aria-label="Descente de gradient sur f(x) = x² avec un pas réglable">
      <Mafs height={340} viewBox={{ x: [-4, 4], y: [-1, 11] }} preserveAspectRatio={false} pan={false}>
        <Coordinates.Cartesian subdivisions={2} />
        <Plot.OfX y={f} color={Theme.blue} weight={3} />
        {xs.slice(0, -1).map((x, i) =>
          inView(x) && inView(xs[i + 1]) ? (
            <Line.Segment key={i} point1={[x, f(x)]} point2={[xs[i + 1], f(xs[i + 1])]} color={Theme.red} opacity={0.6} />
          ) : null,
        )}
        {xs.slice(1).map((x, i) =>
          inView(x) ? <Point key={i} x={x} y={f(x)} color={Theme.red} opacity={Math.max(0.25, 1 - i / 12)} /> : null,
        )}
        {start.element}
      </Mafs>
      <div className="viz-controls">
        <label>
          Pas η
          <input type="range" min={0.05} max={1.2} step={0.05} value={eta} onChange={(e) => setEta(Math.round(Number(e.target.value) * 100) / 100)} />
          <span className="viz-readout">η = {String(eta).replace(".", ",")}</span>
        </label>
        <span className={verdictClass}>{verdict}</span>
      </div>
      <div className="viz-formulas">
        <Tex>{`x_{k+1} = x_k - \\eta \\cdot 2x_k = (1 - 2\\eta)\\,x_k = ${texNum(r, 2)}\\,x_k`}</Tex>
        <Tex>
          {`x_0 = ${texNum(x0, 1)},\\ ${[1, 2, 3, 4, 5]
            .map((k) => `x_{${k}} ${valueTex(xs[k], 3)}`)
            .join(",\\ ")},\\ \\dots,\\ x_{${STEPS}} ${valueTex(xs[STEPS], 4)}`}
        </Tex>
      </div>
    </figure>
  );
}
