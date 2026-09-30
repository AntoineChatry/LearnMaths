import { useState } from "react";
import { Circle, Coordinates, Line, Mafs, Plot, Point, Theme } from "mafs";
import { Tex } from "../../components/Tex";
import { texNum } from "../../lib/tex";

const X0 = 2;
const left = (x: number) => 2 * x - 1;

const fmt = (n: number) => String(n).replace(".", ",").replace("-", "−");

export function PiecewiseViz() {
  const [k, setK] = useState(1);
  const right = (x: number) => -x + k;
  const limLeft = left(X0);
  const value = right(X0);
  const jump = value - limLeft;
  const continuous = Math.abs(jump) < 1e-9;

  return (
    <figure className="viz" aria-label="Fonction définie par morceaux avec un paramètre k réglable">
      <Mafs height={320} viewBox={{ x: [-1, 5], y: [-3, 7] }} preserveAspectRatio={false} pan={false}>
        <Coordinates.Cartesian />
        <Plot.OfX y={left} domain={[-5, X0]} color={Theme.blue} weight={3} />
        <Plot.OfX y={right} domain={[X0, 10]} color={Theme.blue} weight={3} />
        {!continuous && (
          <>
            <Line.Segment point1={[X0, limLeft]} point2={[X0, value]} style="dashed" color={Theme.red} />
            <Circle center={[X0, limLeft]} radius={0.08} color={Theme.blue} fillOpacity={0} weight={2} />
          </>
        )}
        <Point x={X0} y={value} color={Theme.blue} />
      </Mafs>
      <div className="viz-controls">
        <label>
          k
          <input type="range" min={0} max={8} step={0.5} value={k} onChange={(e) => setK(Number(e.target.value))} />
          <span className="viz-readout">{fmt(k)}</span>
        </label>
        <span className={continuous ? "viz-verdict-ok" : "viz-verdict-ko"}>
          {continuous ? "Les deux morceaux se raccordent : f est continue en 2." : `Saut de hauteur ${fmt(jump)} en x = 2.`}
        </span>
      </div>
      <div className="viz-formulas">
        <Tex>{`f(x) = \\begin{cases} 2x - 1 & \\text{si } x < 2 \\\\ -x + ${texNum(k, 1)} & \\text{si } x \\ge 2 \\end{cases}`}</Tex>
        <Tex>{`\\lim_{x \\to 2^-} f(x) = 3 \\qquad f(2) = \\lim_{x \\to 2^+} f(x) = ${texNum(value, 1)}`}</Tex>
      </div>
    </figure>
  );
}
