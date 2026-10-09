import { Coordinates, Line, Mafs, Plot, Polygon, Theme } from "mafs";
import { useMemo, useState } from "react";
import { Tex } from "../../components/Tex";

const STEPS = [0.1, 0.3, 1, 3, 10, 30];
const N = 3000;
const X_MIN = -5;
const X_MAX = 5;
const BINS = 40;
const BIN_W = (X_MAX - X_MIN) / BINS;

// Target: 0.3 N(-2, 0.5^2) + 0.7 N(2, 0.5^2), normalized density.
const SIGMA = 0.5;
const gauss = (x: number, m: number) => Math.exp(-((x - m) ** 2) / (2 * SIGMA * SIGMA)) / (SIGMA * Math.sqrt(2 * Math.PI));
const density = (x: number) => 0.3 * gauss(x, -2) + 0.7 * gauss(x, 2);

// Seeded generator (mulberry32), so that a run can be replayed.
function rng(seed: number) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function run(step: number, seed: number) {
  const u = rng(seed);
  const normal = () => Math.sqrt(-2 * Math.log(1 - u())) * Math.cos(2 * Math.PI * u());
  let x = 0;
  let acc = 0;
  const xs: number[] = [];
  for (let t = 0; t < N; t++) {
    const y = x + step * normal();
    if (u() < Math.min(1, density(y) / density(x))) {
      x = y;
      acc++;
    }
    xs.push(x);
  }
  return { xs, rate: acc / N };
}

const fmt = (x: number, d = 2) => x.toFixed(d).replace(".", ",").replace("-", "−");

// Random-walk Metropolis on a two-mode target: histogram of the chain against the density, and its trace.
export function MetropolisViz() {
  const [si, setSi] = useState(2);
  const [seed, setSeed] = useState(1);
  const step = STEPS[si];
  const { xs, rate } = useMemo(() => run(step, seed), [step, seed]);
  const hist = useMemo(() => {
    const h = Array(BINS).fill(0);
    for (const x of xs) {
      const b = Math.floor((x - X_MIN) / BIN_W);
      if (b >= 0 && b < BINS) h[b]++;
    }
    return h.map((c) => c / (N * BIN_W)); // same scale as the density
  }, [xs]);
  const mean = xs.reduce((s, x) => s + x, 0) / N;
  const right = xs.filter((x) => x > 0).length / N;

  return (
    <figure className="viz" aria-label="Algorithme de Metropolis sur une loi à deux bosses">
      <Mafs height={220} viewBox={{ x: [X_MIN - 0.4, X_MAX + 0.4], y: [-0.12, 0.85], padding: 0 }} preserveAspectRatio={false} pan={false}>
        <Coordinates.Cartesian xAxis={{ lines: 1 }} yAxis={false} />
        {hist.map((v, b) =>
          v > 0 ? (
            <Polygon
              key={b}
              points={[
                [X_MIN + b * BIN_W, 0],
                [X_MIN + (b + 1) * BIN_W, 0],
                [X_MIN + (b + 1) * BIN_W, v],
                [X_MIN + b * BIN_W, v],
              ]}
              color={Theme.blue}
              fillOpacity={0.35}
              weight={1}
            />
          ) : null,
        )}
        <Plot.OfX y={density} domain={[X_MIN, X_MAX]} color={Theme.red} weight={2.5} />
      </Mafs>
      <Mafs height={140} viewBox={{ x: [-60, N + 60], y: [X_MIN, X_MAX], padding: 0 }} preserveAspectRatio={false} pan={false}>
        <Line.Segment point1={[0, 0]} point2={[N, 0]} color={Theme.foreground} opacity={0.3} />
        <Plot.Parametric
          t={[0, N - 1]}
          xy={(t) => [t, xs[Math.round(t)]]}
          color={Theme.blue}
          weight={1}
          minSamplingDepth={12}
          maxSamplingDepth={12}
        />
      </Mafs>
      <div className="viz-controls">
        <label>
          <span>
            pas <Tex>\sigma</Tex>
          </span>
          <input type="range" min={0} max={STEPS.length - 1} step={1} value={si} onChange={(e) => setSi(Number(e.target.value))} />
          <span className="viz-readout">{String(step).replace(".", ",")}</span>
        </label>
        <button type="button" className="btn" onClick={() => setSeed((s) => s + 1)}>
          relancer
        </button>
      </div>
      <div className="mi-body">
        <table className="mi-table mode-table">
          <tbody>
            <tr>
              <th>propositions acceptées</th>
              <td className="viz-readout" style={{ whiteSpace: "nowrap" }}>{Math.round(100 * rate)} %</td>
            </tr>
            <tr>
              <th>moyenne de la chaîne (vraie : 0,8)</th>
              <td className="viz-readout" style={{ whiteSpace: "nowrap" }}>{fmt(mean)}</td>
            </tr>
            <tr>
              <th>temps à droite de 0 (vrai : 70 %)</th>
              <td className="viz-readout" style={{ whiteSpace: "nowrap" }}>{Math.round(100 * right)} %</td>
            </tr>
          </tbody>
        </table>
        <p className="viz-delta">
          En haut : histogramme des {N.toLocaleString("fr-FR")} positions de la chaîne (en bleu), partie de 0, et
          densité cible (en rouge). En bas : la trajectoire au fil des itérations. Un pas trop petit reste coincé dans
          une bosse ; un pas trop grand propose surtout des points improbables, presque tous refusés.
        </p>
      </div>
    </figure>
  );
}
