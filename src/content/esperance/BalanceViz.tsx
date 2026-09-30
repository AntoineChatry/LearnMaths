import { Coordinates, Line, Mafs, MovablePoint, Polygon, Theme } from "mafs";
import { useState } from "react";
import { Tex } from "../../components/Tex";
import { texNum } from "../../lib/tex";

const XS = [0, 1, 2, 3, 4, 5, 6];
const MAX_W = 5;
const HALF = 0.3; // half-width of a bar
const PRESETS: { label: string; w: number[] }[] = [
  { label: "concentrée", w: [0, 0, 1, 5, 1, 0, 0] },
  { label: "uniforme", w: [2, 2, 2, 2, 2, 2, 2] },
  { label: "deux bosses", w: [4, 1, 0, 0, 0, 1, 4] },
  { label: "asymétrique", w: [5, 3, 2, 1, 1, 0, 1] },
];

const clamp = (v: number, lo: number, hi: number) => Math.max(lo, Math.min(hi, v));

// A discrete law on {0, …, 6} whose weights are dragged: the mean is the balance point, sigma the spread.
export function BalanceViz() {
  const [w, setW] = useState(PRESETS[0].w);
  const total = w.reduce((a, b) => a + b, 0);
  const p = w.map((v) => (total > 0 ? v / total : 0));
  const mu = XS.reduce((s, x, i) => s + x * p[i], 0);
  const v = XS.reduce((s, x, i) => s + (x - mu) ** 2 * p[i], 0);
  const sigma = Math.sqrt(v);

  function move(i: number, y: number) {
    const next = [...w];
    next[i] = clamp(Math.round(y), 0, MAX_W);
    // Keep at least one positive weight, otherwise there is no law.
    if (next.some((u) => u > 0)) setW(next);
  }

  return (
    <figure className="viz" aria-label="Espérance comme point d'équilibre d'une loi">
      <Mafs height={300} viewBox={{ x: [-0.8, 6.8], y: [-1.5, 5.6], padding: 0 }} preserveAspectRatio={false} pan={false}>
        <Coordinates.Cartesian xAxis={{ lines: 1 }} yAxis={{ lines: 1, labels: false }} />
        {XS.map((x, i) => (
          <Polygon
            key={x}
            points={[
              [x - HALF, 0],
              [x + HALF, 0],
              [x + HALF, w[i]],
              [x - HALF, w[i]],
            ]}
            color={Theme.blue}
            fillOpacity={0.35}
          />
        ))}
        {/* The fulcrum sits at the mean; the bar below spans mu - sigma to mu + sigma. */}
        <Polygon
          points={[
            [mu, 0],
            [mu - 0.22, -0.55],
            [mu + 0.22, -0.55],
          ]}
          color={Theme.red}
          fillOpacity={0.9}
        />
        <Line.Segment point1={[mu - sigma, -1]} point2={[mu + sigma, -1]} color={Theme.green} weight={4} />
        <Line.Segment point1={[mu - sigma, -1.2]} point2={[mu - sigma, -0.8]} color={Theme.green} weight={3} />
        <Line.Segment point1={[mu + sigma, -1.2]} point2={[mu + sigma, -0.8]} color={Theme.green} weight={3} />
        {XS.map((x, i) => (
          <MovablePoint
            key={x}
            point={[x, w[i]]}
            onMove={([, y]) => move(i, y)}
            constrain={([, y]) => [x, clamp(Math.round(y), 0, MAX_W)]}
            color={Theme.blue}
          />
        ))}
      </Mafs>
      <div className="viz-controls">
        {PRESETS.map((pr) => (
          <button key={pr.label} type="button" className="btn" onClick={() => setW(pr.w)}>
            {pr.label}
          </button>
        ))}
      </div>
      <div className="viz-formulas">
        <Tex>{`p(x) \\propto (${w.join(",\\ ")}) \\qquad \\text{total } ${total}`}</Tex>
        <span style={{ color: Theme.red }}>
          <Tex>{`E(X) = \\sum_x x\\, p(x) \\approx ${texNum(mu, 2)}`}</Tex>
        </span>
        <span style={{ color: Theme.green }}>
          <Tex>{`V(X) = \\sum_x (x - \\mu)^2 p(x) \\approx ${texNum(v, 2)} \\qquad \\sigma \\approx ${texNum(sigma, 2)}`}</Tex>
        </span>
        <p className="viz-delta">
          Tire les barres vers le haut ou le bas. Le triangle rouge est le point où la règle tiendrait en équilibre ; le
          segment vert va de μ − σ à μ + σ.
        </p>
      </div>
    </figure>
  );
}
