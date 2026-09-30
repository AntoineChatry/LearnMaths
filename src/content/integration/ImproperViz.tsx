import { useState } from "react";
import { Coordinates, Mafs, Plot, Theme } from "mafs";

const VIEW_MAX = 12;
const fmt = (n: number) => n.toFixed(4).replace(".", ",");

export function ImproperViz() {
  // Bound A = 10^k, set on a logarithmic scale.
  const [k, setK] = useState(1);
  const A = 10 ** k;
  const shownA = Math.min(A, VIEW_MAX + 1);

  return (
    <figure className="viz" aria-label="Aires sous 1/x et 1/x² entre 1 et A">
      <Mafs height={300} viewBox={{ x: [0, VIEW_MAX], y: [0, 1.2] }} preserveAspectRatio={false} pan={false}>
        <Coordinates.Cartesian
          xAxis={{ lines: 1 }}
          // Step of 0.2: without rounding, floats display as "0.6000000000000001".
          yAxis={{ lines: 0.2, labels: (v) => Number(v.toFixed(1)).toString().replace(".", ",") }}
        />
        <Plot.Inequality
          y={{ "<=": (x) => (x >= 1 && x <= shownA ? 1 / x : 0), ">=": 0 }}
          color={Theme.blue}
          fillOpacity={0.15}
          strokeOpacity={0}
        />
        <Plot.Inequality
          y={{ "<=": (x) => (x >= 1 && x <= shownA ? 1 / (x * x) : 0), ">=": 0 }}
          color={Theme.red}
          fillOpacity={0.3}
          strokeOpacity={0}
        />
        <Plot.OfX y={(x) => 1 / x} domain={[0.8, VIEW_MAX]} color={Theme.blue} weight={3} />
        <Plot.OfX y={(x) => 1 / (x * x)} domain={[0.9, VIEW_MAX]} color={Theme.red} weight={3} />
      </Mafs>
      <div className="viz-controls">
        <label>
          Borne A
          <input type="range" min={0} max={9} step={0.1} value={k} onChange={(e) => setK(Number(e.target.value))} />
          <span className="viz-readout">
            A = 10<sup>{k.toFixed(1).replace(".", ",")}</sup> ≈ {A < 1e4 ? A.toFixed(A < 100 ? 1 : 0).replace(".", ",") : A.toExponential(1).replace(".", ",")}
          </span>
        </label>
      </div>
      <div className="viz-controls">
        <span className="viz-readout" style={{ color: "var(--margin)" }}>
          ∫₁ᴬ 1/x² dx = 1 − 1/A = {fmt(1 - 1 / A)}
        </span>
        <span className="viz-readout" style={{ color: "var(--ink)" }}>
          ∫₁ᴬ 1/x dx = ln A = {fmt(Math.log(A))}
        </span>
      </div>
    </figure>
  );
}
