import { Coordinates, Mafs, Plot, Polygon, Theme } from "mafs";
import { useMemo, useState } from "react";
import { Tex } from "../../components/Tex";
import { texNum } from "../../lib/tex";

const LAWS: { label: string; values: number[]; p: number[] }[] = [
  { label: "dé équilibré", values: [1, 2, 3, 4, 5, 6], p: [1, 1, 1, 1, 1, 1].map((v) => v / 6) },
  { label: "pièce truquée (p = 0,1)", values: [0, 1], p: [0.9, 0.1] },
  { label: "loi asymétrique", values: [0, 1, 2, 3, 4, 5], p: [0.5, 0.25, 0.12, 0.07, 0.04, 0.02] },
];
const NS = [1, 2, 3, 5, 10, 20, 50, 100];

const phi = (z: number) => Math.exp(-(z * z) / 2) / Math.sqrt(2 * Math.PI);

// Exact law of S_n = X_1 + … + X_n by repeated convolution, drawn on the standardized scale (S_n - nμ)/(σ√n).
export function CltViz() {
  const [li, setLi] = useState(2);
  const [ni, setNi] = useState(0);
  const law = LAWS[li];
  const n = NS[ni];
  const { mu, sigma } = useMemo(() => {
    const m = law.values.reduce((s, v, i) => s + v * law.p[i], 0);
    const v = law.values.reduce((s, x, i) => s + (x - m) ** 2 * law.p[i], 0);
    return { mu: m, sigma: Math.sqrt(v) };
  }, [law]);
  // Values are consecutive integers starting at law.values[0], so a convolution of probability vectors suffices.
  const pmf = useMemo(() => {
    let acc = [1];
    for (let k = 0; k < n; k++) {
      const next = new Array(acc.length + law.p.length - 1).fill(0);
      acc.forEach((a, i) => law.p.forEach((b, j) => (next[i + j] += a * b)));
      acc = next;
    }
    return acc;
  }, [law, n]);
  const scale = sigma * Math.sqrt(n);
  const width = 1 / scale;
  const start = n * law.values[0];
  const bars = pmf
    .map((q, k) => ({ z: (start + k - n * mu) / scale, h: q * scale }))
    .filter((b) => b.z > -4.6 && b.z < 4.6 && b.h > 1e-4);
  const gap = Math.max(...bars.map((b) => Math.abs(b.h - phi(b.z))));

  return (
    <figure className="viz" aria-label="Théorème central limite : loi exacte d'une somme standardisée">
      <Mafs height={300} viewBox={{ x: [-4.5, 4.5], y: [-0.05, 0.75], padding: 0 }} preserveAspectRatio={false} pan={false}>
        <Coordinates.Cartesian xAxis={{ lines: 1 }} yAxis={{ lines: 0.25, labels: (v) => String(v).replace(".", ",") }} />
        {bars.map((b, k) => (
          <Polygon
            key={k}
            points={[
              [b.z - width / 2, 0],
              [b.z + width / 2, 0],
              [b.z + width / 2, b.h],
              [b.z - width / 2, b.h],
            ]}
            color={Theme.blue}
            fillOpacity={0.35}
            weight={n >= 50 ? 0.5 : 1.5}
          />
        ))}
        <Plot.OfX y={phi} color={Theme.red} weight={3} />
      </Mafs>
      <div className="viz-controls">
        <label>
          loi de chaque <Tex>{"X_i"}</Tex>
          <select value={li} onChange={(e) => setLi(Number(e.target.value))}>
            {LAWS.map((l, i) => (
              <option key={l.label} value={i}>
                {l.label}
              </option>
            ))}
          </select>
        </label>
        <label>
          <Tex>n</Tex>
          <input type="range" min={0} max={NS.length - 1} step={1} value={ni} onChange={(e) => setNi(Number(e.target.value))} />
          <span className="viz-readout">{n}</span>
        </label>
      </div>
      <div className="viz-formulas">
        <Tex>{`\\mu = ${texNum(mu, 3)} \\quad \\sigma = ${texNum(sigma, 3)} \\qquad \\frac{S_n - n\\mu}{\\sigma\\sqrt n} \\qquad \\max |\\text{barre} - \\varphi| \\approx ${texNum(gap, 3)}`}</Tex>
        <p className="viz-delta">
          Loi exacte de la somme de {n} tirage{n > 1 ? "s" : ""} indépendant{n > 1 ? "s" : ""}, recentrée et mise à
          l'échelle, en barres de surface égale à leur probabilité. En rouge, la densité normale standard φ. Même en
          partant d'une loi très asymétrique, les barres épousent la cloche quand n grandit ; la pièce truquée, très
          déséquilibrée, converge plus lentement.
        </p>
      </div>
    </figure>
  );
}
