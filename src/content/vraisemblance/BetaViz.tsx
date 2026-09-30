import { Coordinates, Line, Mafs, Plot, Theme } from "mafs";
import { useState } from "react";
import { Tex } from "../../components/Tex";
import { texNum } from "../../lib/tex";

const PRIORS: { label: string; a: number; b: number }[] = [
  { label: "uniforme, Beta(1, 1)", a: 1, b: 1 },
  { label: "prudent, Beta(2, 2)", a: 2, b: 2 },
  { label: "convaincu que θ ≈ 1/2, Beta(10, 10)", a: 10, b: 10 },
  { label: "pessimiste, Beta(2, 8)", a: 2, b: 8 },
];
const NS = [0, 1, 3, 5, 10, 20, 50, 100];
const GRID = 400;

// Unnormalized log of θ^(a-1) (1-θ)^(b-1), normalized numerically on a grid.
function betaDensity(a: number, b: number): (t: number) => number {
  const logf = (t: number) => (a - 1) * Math.log(t) + (b - 1) * Math.log(1 - t);
  let m = -Infinity;
  const xs = Array.from({ length: GRID }, (_, i) => (i + 0.5) / GRID);
  for (const t of xs) m = Math.max(m, logf(t));
  const z = xs.reduce((s, t) => s + Math.exp(logf(t) - m), 0) / GRID;
  return (t) => (t <= 0 || t >= 1 ? 0 : Math.exp(logf(t) - m) / z);
}

// Coin with unknown bias θ: prior Beta(a, b), k heads in n tosses, posterior Beta(a + k, b + n - k).
export function BetaViz() {
  const [pi, setPi] = useState(1);
  const [ni, setNi] = useState(2);
  const [ratio, setRatio] = useState(0.7);
  const { a, b } = PRIORS[pi];
  const n = NS[ni];
  const k = Math.round(ratio * n);
  const prior = betaDensity(a, b);
  const like = betaDensity(k + 1, n - k + 1); // likelihood θ^k (1-θ)^(n-k), rescaled to area 1
  const post = betaDensity(a + k, b + n - k);
  const mle = n > 0 ? k / n : NaN;
  const mean = (a + k) / (a + b + n);
  const map = a + k > 1 && b + n - k > 1 ? (a + k - 1) / (a + b + n - 2) : NaN;
  const yMax = 8;
  const clip = (f: (t: number) => number) => (t: number) => Math.min(f(t), yMax + 1);

  return (
    <figure className="viz" aria-label="Estimation d'une probabilité : a priori, vraisemblance et a posteriori">
      <Mafs height={300} viewBox={{ x: [-0.02, 1.02], y: [-1, yMax], padding: 0 }} preserveAspectRatio={false} pan={false}>
        <Coordinates.Cartesian xAxis={{ lines: 0.1, labels: (v) => String(Math.round(v * 10) / 10).replace(".", ",") }} yAxis={{ lines: 2 }} />
        <Plot.OfX y={clip(prior)} domain={[0.001, 0.999]} color={Theme.foreground} weight={2} style="dashed" />
        {n > 0 && <Plot.OfX y={clip(like)} domain={[0.001, 0.999]} color={Theme.green} weight={2} />}
        <Plot.OfX y={clip(post)} domain={[0.001, 0.999]} color={Theme.red} weight={3} />
        <Line.Segment point1={[mean, -0.3]} point2={[mean, 0.3]} color={Theme.red} weight={4} />
        {n > 0 && <Line.Segment point1={[mle, -0.3]} point2={[mle, 0.3]} color={Theme.green} weight={4} />}
      </Mafs>
      <div className="viz-controls">
        <label>
          a priori
          <select value={pi} onChange={(e) => setPi(Number(e.target.value))}>
            {PRIORS.map((p, i) => (
              <option key={p.label} value={i}>
                {p.label}
              </option>
            ))}
          </select>
        </label>
        <label>
          lancers <Tex>n</Tex>
          <input type="range" min={0} max={NS.length - 1} step={1} value={ni} onChange={(e) => setNi(Number(e.target.value))} />
          <span className="viz-readout">{n}</span>
        </label>
        <label>
          proportion de piles
          <input type="range" min={0} max={1} step={0.1} value={ratio} onChange={(e) => setRatio(Number(e.target.value))} />
          <span className="viz-readout">
            {k}/{n}
          </span>
        </label>
      </div>
      <div className="viz-formulas">
        <Tex>{`\\text{a posteriori} : \\text{Beta}(${a} + ${k},\\ ${b} + ${n - k}) \\qquad E(\\theta \\mid \\text{données}) = \\frac{${a + k}}{${a + b + n}} \\approx ${texNum(mean, 3)}`}</Tex>
        <Tex>{`\\hat\\theta_{\\text{MLE}} = ${n > 0 ? `\\frac{${k}}{${n}} \\approx ${texNum(mle, 3)}` : "\\text{non défini}"} \\qquad \\hat\\theta_{\\text{MAP}} = ${Number.isNaN(map) ? "\\text{au bord}" : `\\frac{${a + k - 1}}{${a + b + n - 2}} \\approx ${texNum(map, 3)}`}`}</Tex>
        <p className="viz-delta">
          En pointillés l'a priori, en vert la vraisemblance (mise à l'échelle), en rouge l'a posteriori, proportionnel
          à leur produit. Les traits sur l'axe marquent l'estimateur du maximum de vraisemblance (vert) et la moyenne a
          posteriori (rouge). Avec peu de lancers, l'a priori tire l'estimation vers lui ; quand n grandit, les données
          l'emportent.
        </p>
      </div>
    </figure>
  );
}
