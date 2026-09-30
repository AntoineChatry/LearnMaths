import { Coordinates, Line, Mafs, MovablePoint, Plot, Polygon, Theme } from "mafs";
import { useState } from "react";
import { Tex } from "../../components/Tex";
import { texNum } from "../../lib/tex";

const LAMBDAS = [0.5, 1, 1.5, 2];
const X_MAX = 5;
const BIN = 0.25;
const N_DRAW = 500;

const clamp = (v: number, lo: number, hi: number) => Math.max(lo, Math.min(hi, v));

// Inverse transform sampling for the exponential law: x = F^{-1}(u) = -ln(1 - u) / lambda.
export function InverseViz() {
  const [li, setLi] = useState(1);
  const [u, setU] = useState(0.6);
  const [samples, setSamples] = useState<number[]>([]);
  const lambda = LAMBDAS[li];
  const inv = (v: number) => -Math.log(1 - v) / lambda;
  const x = inv(u);
  const lTex = lambda === 1 ? "" : texNum(lambda, 1); // coefficient 1 is not written

  // Histogram scaled as a density: count / (N * bin width).
  const bins = Array.from({ length: X_MAX / BIN }, () => 0);
  for (const s of samples) if (s < X_MAX) bins[Math.floor(s / BIN)] += 1;
  const beyond = samples.filter((s) => s >= X_MAX).length;

  function draw() {
    const out: number[] = [];
    for (let i = 0; i < N_DRAW; i++) out.push(inv(Math.random()));
    setSamples(out);
  }

  return (
    <figure className="viz" aria-label="Tirage d'une loi exponentielle par inversion de la fonction de répartition">
      <Mafs height={320} viewBox={{ x: [-0.3, X_MAX], y: [-0.1, 2.1], padding: 0 }} preserveAspectRatio={false} pan={false}>
        <Coordinates.Cartesian xAxis={{ lines: 1 }} yAxis={{ lines: 0.5, labels: (v) => String(v).replace(".", ",") }} />
        {samples.length > 0 &&
          bins.map((c, i) => (
            <Polygon
              key={i}
              points={[
                [i * BIN, 0],
                [(i + 1) * BIN, 0],
                [(i + 1) * BIN, c / (samples.length * BIN)],
                [i * BIN, c / (samples.length * BIN)],
              ]}
              color={Theme.green}
              fillOpacity={0.3}
              weight={1}
            />
          ))}
        <Plot.OfX y={(t) => lambda * Math.exp(-lambda * t)} domain={[0, X_MAX]} color={Theme.red} weight={3} />
        <Plot.OfX y={(t) => 1 - Math.exp(-lambda * t)} domain={[0, X_MAX]} color={Theme.blue} weight={3} />
        <Line.Segment point1={[0, u]} point2={[x, u]} color={Theme.foreground} style="dashed" opacity={0.6} />
        <Line.Segment point1={[x, u]} point2={[x, 0]} color={Theme.foreground} style="dashed" opacity={0.6} />
        <MovablePoint
          point={[0, u]}
          onMove={([, y]) => setU(clamp(y, 0.01, 0.99))}
          constrain={([, y]) => [0, clamp(y, 0.01, 0.99)]}
          color={Theme.blue}
        />
      </Mafs>
      <div className="viz-controls">
        <label>
          paramètre <Tex>\lambda</Tex>
          <input
            type="range"
            min={0}
            max={LAMBDAS.length - 1}
            step={1}
            value={li}
            onChange={(e) => {
              setLi(Number(e.target.value));
              setSamples([]);
            }}
          />
          <span className="viz-readout">{String(lambda).replace(".", ",")}</span>
        </label>
        <button type="button" className="btn btn-primary" onClick={draw}>
          Tirer {N_DRAW} valeurs
        </button>
      </div>
      <div className="viz-formulas">
        <span style={{ color: Theme.blue }}>
          <Tex>{`F(x) = 1 - e^{-${lTex}x} \\qquad u = ${texNum(u, 2)} \\;\\mapsto\\; x = F^{-1}(u) = ${lambda === 1 ? "-\\ln(1 - u)" : `-\\frac{\\ln(1 - u)}{${lTex}}`} \\approx ${texNum(x, 2)}`}</Tex>
        </span>
        <span style={{ color: Theme.red }}>
          <Tex>{`f(x) = ${lTex}\\,e^{-${lTex}x}`}</Tex>
        </span>
        <p className="viz-delta">
          {samples.length > 0
            ? `En vert, l'histogramme de ${N_DRAW} tirages u ↦ F⁻¹(u), mis à l'échelle d'une densité : il épouse la courbe rouge.${beyond > 0 ? ` ${beyond} tirage(s) dépassent ${X_MAX} et sortent du cadre.` : ""}`
            : "Déplace u sur l'axe vertical : on lit x en redescendant depuis la courbe bleue. Les u uniformes tombent surtout là où F monte vite, c'est-à-dire là où la densité est grande."}
        </p>
      </div>
    </figure>
  );
}
