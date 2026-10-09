import { Coordinates, Line, Mafs, Point, Text, Theme } from "mafs";
import { useState } from "react";
import { Tex } from "../../components/Tex";

const T_MAX = 30;
// Presets of Levin and Peres, figure 1.2, plus the flip chain (period 2).
const PRESETS: { label: string; p: number; q: number }[] = [
  { label: "p = q = 0,5", p: 0.5, q: 0.5 },
  { label: "p = 0,2, q = 0,1", p: 0.2, q: 0.1 },
  { label: "p = 0,95, q = 0,7", p: 0.95, q: 0.7 },
  { label: "bascule", p: 1, q: 1 },
];
const fmt = (x: number, d = 2) => x.toFixed(d).replace(".", "{,}");

// Two-state frog of Levin and Peres (example 1.1): mu_t(e) from the east pad, against pi(e) = q / (p + q).
export function FrogViz() {
  const [p, setP] = useState(0.2);
  const [q, setQ] = useState(0.1);
  const mu: number[] = [1];
  for (let t = 1; t <= T_MAX; t++) mu.push(mu[t - 1] * (1 - p) + (1 - mu[t - 1]) * q);
  const pi = q / (p + q);
  const lambda = 1 - p - q;

  return (
    <figure className="viz" aria-label="Convergence de la chaîne à deux états vers sa loi stationnaire">
      <Mafs height={260} viewBox={{ x: [-5.5, T_MAX + 2.5], y: [-0.14, 1.1], padding: 0 }} preserveAspectRatio={false} pan={false}>
        <Coordinates.Cartesian
          xAxis={{ lines: 5, labels: (v) => (v > 0 ? String(v) : "") }}
          yAxis={{ lines: 0.25, labels: false }}
        />
        {/* y labels left of the axis, so that they do not cover the points at t = 0 */}
        {[0.25, 0.5, 0.75, 1].map((v) => (
          <Text key={v} x={-0.3} y={v} attach="w" size={15}>
            {String(v).replace(".", ",")}
          </Text>
        ))}
        <Line.Segment point1={[0, pi]} point2={[T_MAX, pi]} color={Theme.red} style="dashed" />
        {mu.slice(1).map((m, t) => (
          <Line.Segment key={t} point1={[t, mu[t]]} point2={[t + 1, m]} color={Theme.blue} opacity={0.5} />
        ))}
        {mu.map((m, t) => (
          <Point key={t} x={t} y={m} color={Theme.blue} />
        ))}
      </Mafs>
      <div className="viz-controls">
        {PRESETS.map((pr) => (
          <button
            key={pr.label}
            type="button"
            className={pr.p === p && pr.q === q ? "btn btn-primary" : "btn"}
            onClick={() => {
              setP(pr.p);
              setQ(pr.q);
            }}
          >
            {pr.label}
          </button>
        ))}
      </div>
      <div className="viz-controls">
        <label>
          <span>
            <Tex>p</Tex> (est → ouest)
          </span>
          <input type="range" min={0.05} max={1} step={0.05} value={p} onChange={(e) => setP(Number(e.target.value))} />
          <span className="viz-readout">{p.toFixed(2).replace(".", ",")}</span>
        </label>
        <label>
          <span>
            <Tex>q</Tex> (ouest → est)
          </span>
          <input type="range" min={0.05} max={1} step={0.05} value={q} onChange={(e) => setQ(Number(e.target.value))} />
          <span className="viz-readout">{q.toFixed(2).replace(".", ",")}</span>
        </label>
      </div>
      <div className="viz-formulas">
        <span style={{ color: Theme.red }}>
          <Tex>{`\\pi(e) = \\frac{q}{p + q} \\approx ${fmt(pi, 3)}`}</Tex>
        </span>
        <Tex>{"{\\mu_t(e) - \\pi(e) = (1 - p - q)^t\\,\\big(1 - \\pi(e)\\big)}"}</Tex>
        <Tex>{`1 - p - q = ${fmt(lambda)}`}</Tex>
        <p className="viz-delta">
          Points bleus : probabilité d'être sur le nénuphar est au jour <Tex>t</Tex>, en partant de l'est. Tirets
          rouges : la loi stationnaire. L'écart est multiplié par <Tex>1 - p - q</Tex> chaque jour : il change de
          signe quand ce nombre est négatif, et ne diminue plus du tout quand il vaut −1.
        </p>
      </div>
    </figure>
  );
}
