import { useState } from "react";
import { Coordinates, Line, Mafs, Plot, Theme } from "mafs";

// Smallest integer N ≥ 2 from which 2^n > n^k for all n ≥ N (comparison in log2).
function crossover(k: number): number {
  let last = 2;
  for (let n = 2; n <= 400; n++) {
    if (n <= k * Math.log2(n)) last = n + 1;
  }
  return last;
}

export function GrowthViz() {
  const [k, setK] = useState(3);
  const N = crossover(k);

  return (
    <figure className="viz" aria-label="Comparaison de n^k et 2^n en échelle logarithmique">
      <Mafs height={340} viewBox={{ x: [0, 100], y: [0, 100] }} preserveAspectRatio={false} pan={false}>
        <Coordinates.Cartesian xAxis={{ lines: 10 }} yAxis={{ lines: 10 }} />
        <Plot.OfX y={(n) => n} color={Theme.red} weight={3} />
        <Plot.OfX y={(n) => k * Math.log2(n)} domain={[1, 100]} color={Theme.blue} weight={3} />
        {N <= 100 && <Line.Segment point1={[N, 0]} point2={[N, N]} style="dashed" color={Theme.foreground} />}
      </Mafs>
      <div className="viz-controls">
        <label>
          Degré k
          <input type="range" min={1} max={12} step={1} value={k} onChange={(e) => setK(Number(e.target.value))} />
          <span className="viz-readout">k = {k}</span>
        </label>
        <span className="viz-readout">
          <span style={{ color: "var(--margin)" }}>log₂(2ⁿ) = n</span> dépasse{" "}
          <span style={{ color: "var(--ink)" }}>log₂(nᵏ) = k·log₂ n</span> pour de bon dès n = {N}
        </span>
      </div>
    </figure>
  );
}
