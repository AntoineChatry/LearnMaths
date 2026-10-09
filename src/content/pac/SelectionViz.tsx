import { Coordinates, Line, Mafs, Plot, Polyline, Theme } from "mafs";
import { useMemo, useState } from "react";
import { Tex } from "../../components/Tex";
import { texNum } from "../../lib/tex";

const MS = [20, 50, 100, 200, 500, 1000]; // training examples
const LOG_K = [0, 1, 2, 3, 4, 5, 6]; // K = 10^k hypotheses tried
const DELTA = 0.05;

// Bound of the finite-class theorem: |R - R_emp| <= gap for all K hypotheses, with probability 1 - DELTA.
const gap = (K: number, m: number) => Math.sqrt((Math.log(K) + Math.log(2 / DELTA)) / (2 * m));

// Median training error of the best of K classifiers on random labels: the K errors are independent
// Bin(m, 1/2) / m, and P(min <= k/m) = 1 - (1 - F(k))^K.
function medianBest(m: number, K: number, cdf: number[]) {
  for (let k = 0; k <= m; k++) {
    const pMin = -Math.expm1(K * Math.log1p(-Math.min(cdf[k], 1 - 1e-16)));
    if (cdf[k] >= 1 || pMin >= 0.5) return k / m;
  }
  return 1;
}

// CDF of Bin(m, 1/2), from log binomial coefficients.
function binomCdf(m: number) {
  const lf = [0];
  for (let k = 1; k <= m; k++) lf.push(lf[k - 1] + Math.log(k));
  const out: number[] = [];
  let s = 0;
  for (let k = 0; k <= m; k++) {
    s += Math.exp(lf[m] - lf[k] - lf[m - k] - m * Math.LN2);
    out.push(s);
  }
  return out;
}

export function SelectionViz() {
  const [mi, setMi] = useState(1); // m = 50
  const [ki, setKi] = useState(3); // K = 1000
  const m = MS[mi];
  const K = 10 ** LOG_K[ki];
  const cdf = useMemo(() => binomCdf(m), [m]);
  const curve = useMemo(
    () => Array.from({ length: 121 }, (_, i) => [i / 20, medianBest(m, 10 ** (i / 20), cdf)] as [number, number]),
    [m, cdf],
  );
  const best = medianBest(m, K, cdf);
  const floor = 0.5 - gap(K, m);

  return (
    <figure className="viz" aria-label="Erreur d'entraînement du meilleur de K classifieurs sur des étiquettes aléatoires, et la borne">
      <Mafs height={280} viewBox={{ x: [-0.3, 6.2], y: [-0.08, 0.64], padding: 0 }} preserveAspectRatio={false} pan={false}>
        <Coordinates.Cartesian
          xAxis={{ lines: 1, labels: (v) => (v === 0 ? "1" : `10${"⁰¹²³⁴⁵⁶"[v]}`) }}
          yAxis={{ lines: 0.1, labels: (v) => texNum(v, 1).replace("{,}", ",") }}
        />
        <Line.Segment point1={[0, 0.5]} point2={[6, 0.5]} color={Theme.foreground} style="dashed" />
        <Polyline points={curve} color={Theme.red} weight={3} fillOpacity={0} />
        <Plot.OfX y={(x) => Math.max(0.5 - gap(10 ** x, m), -0.1)} domain={[0, 6]} color={Theme.blue} weight={2} />
        <Line.Segment point1={[LOG_K[ki], -0.05]} point2={[LOG_K[ki], 0.55]} color={Theme.foreground} opacity={0.4} />
      </Mafs>
      <div className="viz-controls">
        <label>
          <span>
            exemples <Tex>m</Tex>
          </span>
          <input type="range" min={0} max={MS.length - 1} step={1} value={mi} onChange={(e) => setMi(Number(e.target.value))} />
          <span className="viz-readout">{m}</span>
        </label>
        <label>
          <span>
            classifieurs essayés <Tex>K</Tex>
          </span>
          <input type="range" min={0} max={LOG_K.length - 1} step={1} value={ki} onChange={(e) => setKi(Number(e.target.value))} />
          <span className="viz-readout">{K.toLocaleString("fr-FR")}</span>
        </label>
      </div>
      <div className="mi-body">
        <table className="mi-table mode-table">
          <tbody>
            <tr>
              <th>
                <span className="kl-swatch" style={{ background: "var(--margin)" }} /> erreur d'entraînement du meilleur
              </th>
              <td className="viz-readout">{texNum(best, 3).replace("{,}", ",")}</td>
            </tr>
            <tr>
              <th>
                <span className="kl-swatch" style={{ background: "var(--ink)" }} /> plancher garanti
              </th>
              <td className="viz-readout">{floor > 0 ? texNum(floor, 3).replace("{,}", ",") : "aucun"}</td>
            </tr>
            <tr>
              <th>
                <span className="kl-swatch" style={{ background: "var(--text)" }} /> vrai risque de chacun
              </th>
              <td className="viz-readout">0,5</td>
            </tr>
          </tbody>
        </table>
        <p className="viz-delta">
          Étiquettes tirées à pile ou face, axe horizontal en nombre de classifieurs essayés. En rouge, la médiane
          exacte de la meilleure erreur d'entraînement ; en bleu, le plancher <Tex>{"0{,}5 - \\varepsilon"}</Tex> de
          la borne, qui tient avec probabilité 95 %. Plus on essaie de modèles, plus le meilleur paraît bon, alors
          qu'aucun ne vaut mieux que le hasard.
        </p>
      </div>
    </figure>
  );
}
