import { useState } from "react";
import { Coordinates, Mafs, Plot, Polygon, Theme } from "mafs";
import { Tex } from "../../components/Tex";
import { texNum } from "../../lib/tex";

const BIG_N = 100_000;
const RECTS = Array.from({ length: 13 }, (_, i) => i + 1);

function partialSum(p: number): number {
  let s = 0;
  for (let n = 1; n <= BIG_N; n++) s += n ** -p;
  return s;
}

// ∫₁ᴺ x^(−p) dx, computed via the antiderivative.
function integral(p: number): number {
  return Math.abs(p - 1) < 1e-9 ? Math.log(BIG_N) : (BIG_N ** (1 - p) - 1) / (1 - p);
}

export function SeriesIntegralViz() {
  const [p, setP] = useState(2);
  const f = (x: number) => x ** -p;
  const S = partialSum(p);
  const I = integral(p);

  return (
    <figure className="viz" aria-label="Comparaison entre la série des 1/n^p et l'intégrale de 1/x^p">
      <Mafs height={320} viewBox={{ x: [0, 13], y: [0, 1.3] }} preserveAspectRatio={false} pan={false}>
        <Coordinates.Cartesian xAxis={{ lines: 1 }} yAxis={{ lines: 0.25 }} />
        {RECTS.map((n) => (
          <Polygon
            key={n}
            points={[
              [n - 1, 0],
              [n, 0],
              [n, f(n)],
              [n - 1, f(n)],
            ]}
            color={n === 1 ? Theme.red : Theme.blue}
            fillOpacity={0.25}
            weight={1}
          />
        ))}
        <Plot.OfX y={f} domain={[0.3, 13]} color={Theme.foreground} weight={3} />
      </Mafs>
      <div className="viz-controls">
        <label>
          Exposant p
          <input type="range" min={0.5} max={3} step={0.1} value={p} onChange={(e) => setP(Math.round(Number(e.target.value) * 10) / 10)} />
          <span className="viz-readout">p = {texNum(p, 1).replace("{,}", ",")}</span>
        </label>
        <span className={p > 1 ? "viz-verdict-ok" : "viz-verdict-ko"}>
          {p > 1 ? "p > 1 : l'intégrale converge, la série aussi." : "p ≤ 1 : l'intégrale diverge, la série aussi."}
        </span>
      </div>
      <div className="viz-formulas">
        <Tex>{`\\sum_{n=1}^{10^5} \\frac{1}{n^{${texNum(p, 1)}}} \\approx ${texNum(S, 4)} \\qquad \\int_1^{10^5} \\frac{dx}{x^{${texNum(p, 1)}}} \\approx ${texNum(I, 4)}`}</Tex>
        {p > 1 && (
          <Tex>{`\\text{Borne pour tout } N : \\ \\sum_{n=1}^{N} \\frac{1}{n^{p}} \\le 1 + \\frac{1}{p-1} = ${texNum(1 + 1 / (p - 1), 4)}`}</Tex>
        )}
      </div>
    </figure>
  );
}
