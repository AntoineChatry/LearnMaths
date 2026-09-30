import { useState } from "react";
import { Coordinates, Line, Mafs, Point, Theme } from "mafs";
import { Tex } from "../../components/Tex";
import { texNum } from "../../lib/tex";

const LAST = 30;

// Partial sums S_0, …, S_30 of 1 + q + q² + …, accumulated as in the Python loop.
function partialSums(q: number): number[] {
  const sums: number[] = [];
  let s = 0;
  let term = 1;
  for (let k = 0; k <= LAST; k++) {
    s += term;
    sums.push(s);
    term *= q;
  }
  return sums;
}

export function GeometricViz() {
  const [q, setQ] = useState(0.5);
  const sums = partialSums(q);
  const converges = Math.abs(q) < 1;
  const limit = 1 / (1 - q);

  return (
    <figure className="viz" aria-label="Sommes partielles de la série géométrique de raison q">
      <Mafs height={340} viewBox={{ x: [-1, LAST + 1], y: [-3, 12] }} preserveAspectRatio={false} pan={false}>
        <Coordinates.Cartesian xAxis={{ lines: 5 }} yAxis={{ lines: 2 }} />
        {converges && (
          <Line.Segment point1={[-10, limit]} point2={[LAST + 10, limit]} style="dashed" color={Theme.green} />
        )}
        {sums.slice(1).map((s, i) => (
          <Line.Segment key={`seg${i}`} point1={[i, sums[i]]} point2={[i + 1, s]} color={Theme.blue} opacity={0.35} />
        ))}
        {sums.map((s, N) => (
          <Point key={N} x={N} y={s} color={Theme.blue} svgCircleProps={{ r: 4 }} />
        ))}
      </Mafs>
      <div className="viz-controls">
        <label>
          Raison q
          <input type="range" min={-1.2} max={1.2} step={0.05} value={q} onChange={(e) => setQ(Math.round(Number(e.target.value) * 100) / 100)} />
          <span className="viz-readout">q = {texNum(q).replace("{,}", ",")}</span>
        </label>
        <span className="viz-readout">
          S₁₀ ≈ {texNum(sums[10], 4).replace("{,}", ",")} · S₃₀ ≈ {texNum(sums[LAST], 4).replace("{,}", ",")}
        </span>
        <span className={converges ? "viz-verdict-ok" : "viz-verdict-ko"}>
          {converges ? "|q| < 1 : la série converge." : "|q| ≥ 1 : la série diverge."}
        </span>
      </div>
      <div className="viz-formulas">
        {converges ? (
          <Tex>{`\\sum_{k=0}^{+\\infty} q^k = \\frac{1}{1-q} \\approx ${texNum(limit, 4)} \\quad \\text{(ligne verte)}`}</Tex>
        ) : (
          <Tex>{"\\text{Les termes } q^k \\text{ ne tendent pas vers } 0 : \\text{les sommes partielles ne se stabilisent pas.}"}</Tex>
        )}
      </div>
    </figure>
  );
}
