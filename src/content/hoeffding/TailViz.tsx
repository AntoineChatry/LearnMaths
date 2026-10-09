import { Coordinates, Line, Mafs, Plot, Polyline, Theme } from "mafs";
import { useMemo, useState } from "react";
import { Tex } from "../../components/Tex";

const QS = [0.55, 0.6, 0.65, 0.7, 0.75, 0.8, 0.9]; // threshold on the proportion of heads
const NS = Array.from({ length: 40 }, (_, i) => 10 * (i + 1)); // 10 … 400
const N_MAX = 400;
const Y_MIN = -30; // log10 axis, clipped below 10^-30

const LN10 = Math.log(10);
// ln k! for k = 0 … N_MAX
const LOG_FACT = (() => {
  const t = [0];
  for (let k = 1; k <= N_MAX; k++) t.push(t[k - 1] + Math.log(k));
  return t;
})();

// log10 P(S_N >= ceil(qN)) for S_N ~ Bin(N, 1/2), by log-sum-exp.
function log10Tail(N: number, q: number) {
  const k0 = Math.ceil(q * N - 1e-9);
  const terms: number[] = [];
  for (let j = k0; j <= N; j++) terms.push(LOG_FACT[N] - LOG_FACT[j] - LOG_FACT[N - j] - N * Math.LN2);
  const m = Math.max(...terms);
  return (m + Math.log(terms.reduce((s, t) => s + Math.exp(t - m), 0))) / LN10;
}

// Axis label 10⁻⁵ for v = -5.
const SUP: Record<string, string> = { "-": "⁻", "0": "⁰", "1": "¹", "2": "²", "3": "³", "4": "⁴", "5": "⁵", "6": "⁶", "7": "⁷", "8": "⁸", "9": "⁹" };
const powLabel = (v: number) => (v === 0 ? "1" : `10${[...String(v)].map((c) => SUP[c]).join("")}`);

const klBern =(q: number, p: number) => q * Math.log(q / p) + (1 - q) * Math.log((1 - q) / (1 - p));

// Three bounds on P(proportion of heads >= q), in log10: Chebyshev, Hoeffding, Chernoff (KL exponent).
const bounds = (N: number, q: number) => {
  const e = q - 0.5;
  return {
    cheb: Math.min(0, Math.log10(1 / (4 * N * e * e))),
    hoef: (-2 * N * e * e) / LN10,
    kl: (-N * klBern(q, 0.5)) / LN10,
  };
};

// 2.8 × 10^{-7} from a log10 value.
function sci(l: number) {
  if (l > -0.0001) return "1";
  const ex = Math.floor(l);
  let m = Math.round(10 ** (l - ex) * 10) / 10;
  let e = ex;
  if (m >= 10) [m, e] = [1, ex + 1];
  return `${String(m).replace(".", "{,}")} \\times 10^{${e}}`;
}

export function TailViz() {
  const [qi, setQi] = useState(4); // q = 3/4, Vershynin's question 2.1.1
  const [ni, setNi] = useState(9); // N = 100
  const q = QS[qi];
  const N = NS[ni];
  const exact = useMemo(() => Array.from({ length: N_MAX }, (_, i) => [i + 1, log10Tail(i + 1, q)] as [number, number]), [q]);
  const b = bounds(N, q);
  const ex = log10Tail(N, q);
  const clip = (f: (n: number) => number) => (n: number) => Math.max(f(n), Y_MIN - 1);
  const rows: [string, string, number][] = [
    ["vraie probabilité", "var(--text)", ex],
    ["Tchebychev", "var(--ok)", b.cheb],
    ["Hoeffding", "var(--ink)", b.hoef],
    ["Chernoff (KL)", "var(--margin)", b.kl],
  ];

  return (
    <figure className="viz" aria-label="Probabilité d'obtenir au moins une proportion q de piles, et trois bornes, en échelle logarithmique">
      <Mafs height={300} viewBox={{ x: [-10, N_MAX + 10], y: [Y_MIN - 2, 1.5], padding: 0 }} preserveAspectRatio={false} pan={false}>
        <Coordinates.Cartesian xAxis={{ lines: 50, labels: (v) => String(v) }} yAxis={{ lines: 5, labels: powLabel }} />
        <Polyline points={exact.map(([n, l]) => [n, Math.max(l, Y_MIN - 1)])} color={Theme.foreground} weight={2} fillOpacity={0} />
        <Plot.OfX y={clip((n) => bounds(n, q).cheb)} domain={[1, N_MAX]} color={Theme.green} weight={2} />
        <Plot.OfX y={clip((n) => bounds(n, q).hoef)} domain={[1, N_MAX]} color={Theme.blue} weight={2} />
        <Plot.OfX y={clip((n) => bounds(n, q).kl)} domain={[1, N_MAX]} color={Theme.red} weight={2} style="dashed" />
        <Line.Segment point1={[N, Y_MIN]} point2={[N, 1]} color={Theme.foreground} opacity={0.4} />
      </Mafs>
      <div className="viz-controls">
        <label>
          <span>
            proportion de piles <Tex>{"\\ge q"}</Tex>
          </span>
          <input type="range" min={0} max={QS.length - 1} step={1} value={qi} onChange={(e) => setQi(Number(e.target.value))} />
          <span className="viz-readout">{String(q).replace(".", ",")}</span>
        </label>
        <label>
          <span>
            lancers <Tex>N</Tex>
          </span>
          <input type="range" min={0} max={NS.length - 1} step={1} value={ni} onChange={(e) => setNi(Number(e.target.value))} />
          <span className="viz-readout">{N}</span>
        </label>
      </div>
      <div className="mi-body">
        <table className="mi-table mode-table">
          <caption>
            proportion de piles <Tex>{`\\hat p \\ge ${String(q).replace(".", "{,}")}`}</Tex>,{" "}
            <span className="mi-key">
              <Tex>{`N = ${N}`}</Tex> lancers
            </span>
          </caption>
          <tbody>
            {rows.map(([label, color, l]) => (
              <tr key={label}>
                <th>
                  <span className="kl-swatch" style={{ background: color }} /> {label}
                </th>
                <td>
                  <Tex>{sci(l)}</Tex>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <p className="viz-delta">
          Axe vertical en puissances de 10. Tchebychev ne décroît que comme 1/N : une courbe presque plate. Hoeffding
          et Chernoff décroissent exponentiellement, des droites qui plongent ; la pente de Chernoff, la divergence KL,
          est celle de la vraie probabilité. Les dents de scie de celle-ci viennent de l'arrondi : il faut au moins
          ⌈qN⌉ piles, un seuil qui avance par sauts.
        </p>
      </div>
    </figure>
  );
}
