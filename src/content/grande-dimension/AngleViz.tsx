import { Coordinates, Line, Mafs, Plot, Theme } from "mafs";
import { useMemo, useState } from "react";
import { Tex } from "../../components/Tex";

const DIMS = [2, 3, 5, 10, 30, 100, 300, 1000, 10000];
const GRID = 18001; // angle grid on [0, 180] degrees, step 0.01

// The angle between two independent uniform directions of R^d has density proportional to
// sin^(d-2)(theta) on [0, pi]. Returns the density normalized to a peak of 1, and the CDF.
function angleLaw(d: number) {
  const logw = Array.from({ length: GRID }, (_, i) => {
    const s = Math.sin((Math.PI * i) / (GRID - 1));
    return d === 2 ? 0 : s > 0 ? (d - 2) * Math.log(s) : -Infinity;
  });
  const peak = Math.max(...logw);
  const w = logw.map((l) => Math.exp(l - peak));
  const cdf: number[] = [];
  let acc = 0;
  for (let i = 0; i < GRID; i++) {
    acc += w[i];
    cdf.push(acc);
  }
  return { w, cdf: cdf.map((c) => c / acc) };
}

const quantile = (cdf: number[], p: number) => (180 * cdf.findIndex((c) => c >= p)) / (GRID - 1);
const deg = (x: number) => x.toFixed(1).replace(".", ",");

export function AngleViz() {
  const [di, setDi] = useState(5); // d = 100
  const d = DIMS[di];
  const { w, cdf } = useMemo(() => angleLaw(d), [d]);
  const at = (theta: number) => w[Math.round((theta / 180) * (GRID - 1))];
  const lo = quantile(cdf, 0.025);
  const hi = quantile(cdf, 0.975);
  const near = cdf[Math.round((100 / 180) * (GRID - 1))] - cdf[Math.round((80 / 180) * (GRID - 1))];

  return (
    <figure className="viz" aria-label="Loi de l'angle entre deux directions aléatoires selon la dimension">
      <Mafs height={240} viewBox={{ x: [-10, 196], y: [-0.18, 1.12], padding: 0 }} preserveAspectRatio={false} pan={false}>
        <Coordinates.Cartesian xAxis={{ lines: 45, labels: (v) => `${v}°` }} yAxis={false} />
        <Line.Segment point1={[lo, 0]} point2={[lo, 1.05]} color={Theme.foreground} opacity={0.4} />
        <Line.Segment point1={[hi, 0]} point2={[hi, 1.05]} color={Theme.foreground} opacity={0.4} />
        <Plot.OfX y={at} domain={[0, 180]} color={Theme.blue} weight={3} minSamplingDepth={10} />
      </Mafs>
      <div className="viz-controls">
        <label>
          <span>
            dimension <Tex>d</Tex>
          </span>
          <input type="range" min={0} max={DIMS.length - 1} step={1} value={di} onChange={(e) => setDi(Number(e.target.value))} />
          <span className="viz-readout">{d.toLocaleString("fr-FR")}</span>
        </label>
      </div>
      <div className="mi-body">
        <table className="mi-table mode-table">
          <tbody>
            <tr>
              <th>95 % des angles entre</th>
              <td className="viz-readout">
                {deg(lo)}° et {deg(hi)}°
              </td>
            </tr>
            <tr>
              <th>angle entre 80° et 100°</th>
              <td className="viz-readout">{(100 * near).toFixed(1).replace(".", ",")} %</td>
            </tr>
          </tbody>
        </table>
        <p className="viz-delta">
          Densité de l'angle entre deux directions tirées au hasard, proportionnelle à{" "}
          <Tex>{"\\sin^{d-2}\\theta"}</Tex> et ramenée à un maximum de 1 ; les traits verticaux encadrent 95 % des
          tirages. En dimension 2, tous les angles sont également probables ; en grande dimension, presque tous sont
          proches de 90°.
        </p>
      </div>
    </figure>
  );
}
