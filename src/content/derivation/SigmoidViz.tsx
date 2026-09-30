import { useState } from "react";
import { Coordinates, Line, Mafs, Plot, Theme } from "mafs";
import { Tex } from "../../components/Tex";
import { texNum } from "../../lib/tex";

const sigma = (z: number) => 1 / (1 + Math.exp(-z));

export function SigmoidViz() {
  const [k, setK] = useState(1);
  const s = (z: number) => 0.5 + Math.atan(k * z) / Math.PI;
  const slope = k / Math.PI;
  const matched = Math.abs(slope - 0.25) < 0.005;

  return (
    <figure className="viz" aria-label="La sigmoïde comparée à une arctangente normalisée">
      <Mafs height={300} viewBox={{ x: [-8, 8], y: [-0.25, 1.25] }} preserveAspectRatio={false} pan={false}>
        <Coordinates.Cartesian xAxis={{ lines: 2 }} yAxis={{ lines: 0.5 }} />
        <Line.Segment point1={[-50, 1]} point2={[50, 1]} style="dashed" color={Theme.foreground} opacity={0.4} />
        <Plot.OfX y={sigma} color={Theme.blue} weight={3} />
        <Plot.OfX y={s} color={Theme.red} weight={3} />
      </Mafs>
      <div className="viz-controls">
        <label>
          k
          <input
            type="range"
            min={0.2}
            max={3}
            step={0.005}
            value={k}
            onChange={(e) => setK(Math.round(Number(e.target.value) * 1000) / 1000)}
          />
          <span className="viz-readout">k = {String(k).replace(".", ",")}</span>
        </label>
        <span className={matched ? "viz-verdict-ok" : ""}>
          {matched ? "Même pente en 0 : tu es sur k = π/4 ≈ 0,785." : "Cherche le k qui donne la même pente en 0."}
        </span>
      </div>
      <div className="viz-formulas">
        <p>
          <span style={{ color: "var(--ink)" }}>
            <Tex>{"\\sigma(z) = \\frac{1}{1+e^{-z}}"}</Tex>
          </span>
          {"   "}
          <span style={{ color: "var(--margin)" }}>
            <Tex>{"s_k(z) = \\frac{1}{2} + \\frac{\\arctan(kz)}{\\pi}"}</Tex>
          </span>
        </p>
        <Tex>{`\\text{Pentes en } 0 : \\ \\sigma'(0) = 0{,}25 \\qquad s_k'(0) = \\frac{k}{\\pi} \\approx ${texNum(slope, 3)}`}</Tex>
        <Tex>{`\\text{Reste à parcourir en } z = 6 : \\ 1 - \\sigma(6) \\approx ${texNum(1 - sigma(6), 4)} \\qquad 1 - s_k(6) \\approx ${texNum(1 - s(6), 4)}`}</Tex>
      </div>
    </figure>
  );
}
