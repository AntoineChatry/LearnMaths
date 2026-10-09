import { Coordinates, Line, Mafs, Plot, Polyline, Text, Theme } from "mafs";
import { useMemo, useState } from "react";
import { Tex } from "../../components/Tex";

// VP SDE of Song et al. (equations 32-33), the continuous limit of the DDPM schedule: step t of 1000 is time t / 1000.
const B_MIN = 0.1;
const B_MAX = 20;
const STEPS = 1000;
const beta = (u: number) => B_MIN + u * (B_MAX - B_MIN);
const signal = (u: number) => Math.exp(-0.25 * u * u * (B_MAX - B_MIN) - 0.5 * u * B_MIN); // sqrt(abar)

// Data: 0.3 N(-2, 0.5^2) + 0.7 N(2, 0.5^2); the noised law stays a two-component mixture.
const W = [0.3, 0.7];
const MU = [-2, 2];
const S2 = 0.25;
function mixture(u: number) {
  const a = signal(u);
  return { m: MU.map((m) => a * m), v: a * a * S2 + 1 - a * a };
}
function density(x: number, u: number) {
  const { m, v } = mixture(u);
  return W.reduce((s, w, k) => s + (w * Math.exp(-((x - m[k]) ** 2) / (2 * v))) / Math.sqrt(2 * Math.PI * v), 0);
}
function score(x: number, u: number) {
  const { m, v } = mixture(u);
  let num = 0;
  let den = 0;
  for (let k = 0; k < 2; k++) {
    const d = W[k] * Math.exp(-((x - m[k]) ** 2) / (2 * v));
    num += (d * (m[k] - x)) / v;
    den += d;
  }
  return num / den;
}

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

const PARTICLES = 40;
const KEEP = 4; // keep one point in KEEP for drawing

// Reverse-time SDE (equation 6) or probability flow ODE (equation 13), from t = 1 back to t = 0, exact score.
function generate(stochastic: boolean, seed: number) {
  const u = rng(seed);
  const normal = () => Math.sqrt(-2 * Math.log(1 - u())) * Math.cos(2 * Math.PI * u());
  const dt = 1 / STEPS;
  return Array.from({ length: PARTICLES }, () => {
    let x = normal();
    const pts: [number, number][] = [[0, x]];
    for (let k = STEPS; k > 0; k--) {
      const t = k / STEPS;
      const b = beta(t);
      const drift = -0.5 * b * x - (stochastic ? 1 : 0.5) * b * score(x, t);
      x = x - drift * dt + (stochastic ? Math.sqrt(b * dt) * normal() : 0);
      if ((STEPS - k + 1) % KEEP === 0) pts.push([STEPS - k + 1, x]);
    }
    return pts;
  });
}

const fmt = (x: number, d = 3) => x.toFixed(d).replace(".", "{,}");

export function DiffusionViz() {
  const [t, setT] = useState(500);
  const [stochastic, setStochastic] = useState(true);
  const [seed, setSeed] = useState(3);
  const paths = useMemo(() => generate(stochastic, seed), [stochastic, seed]);
  const u = t / STEPS;
  const a = signal(u);

  return (
    <figure className="viz" aria-label="Modèle de diffusion : bruitage des données et génération à rebours">
      <Mafs height={190} viewBox={{ x: [-4.4, 4.4], y: [-0.1, 0.7], padding: 0 }} preserveAspectRatio={false} pan={false}>
        <Coordinates.Cartesian xAxis={{ lines: 1 }} yAxis={false} />
        <Plot.OfX y={(x) => Math.exp(-(x * x) / 2) / Math.sqrt(2 * Math.PI)} color={Theme.foreground} opacity={0.4} style="dashed" />
        <Plot.OfX y={(x) => density(x, u)} color={Theme.red} weight={2.5} />
      </Mafs>
      <Mafs height={220} viewBox={{ x: [-40, STEPS + 30], y: [-4.2, 4.2], padding: 0 }} preserveAspectRatio={false} pan={false}>
        <Line.Segment point1={[0, 0]} point2={[STEPS, 0]} color={Theme.foreground} opacity={0.25} />
        {paths.map((pts, i) => (
          <Polyline key={i} points={pts} color={pts[pts.length - 1][1] > 0 ? Theme.blue : Theme.green} weight={1.2} />
        ))}
        <Line.Segment point1={[STEPS - t, -4]} point2={[STEPS - t, 4]} color={Theme.red} weight={2} />
        <Text x={0} y={-3.7} attach="e" size={13}>
          bruit (t = 1000)
        </Text>
        <Text x={STEPS} y={-3.7} attach="w" size={13}>
          données (t = 0)
        </Text>
      </Mafs>
      <div className="viz-controls">
        <label>
          <span>
            pas <Tex>t</Tex>
          </span>
          <input type="range" min={0} max={STEPS} step={10} value={t} onChange={(e) => setT(Number(e.target.value))} />
          <span className="viz-readout">{t}</span>
        </label>
      </div>
      <div className="viz-controls">
        <button type="button" className={stochastic ? "btn btn-primary" : "btn"} onClick={() => setStochastic(true)}>
          aléatoire (EDS inverse)
        </button>
        <button type="button" className={!stochastic ? "btn btn-primary" : "btn"} onClick={() => setStochastic(false)}>
          déterministe (flot)
        </button>
        <button type="button" className="btn" onClick={() => setSeed((s) => s + 1)}>
          relancer
        </button>
      </div>
      <div className="viz-formulas">
        <span style={{ display: "flex", flexWrap: "wrap", columnGap: "1.5em", alignItems: "baseline" }}>
          <Tex>{`\\sqrt{\\bar\\alpha_t} \\approx ${fmt(a)}`}</Tex>
          <Tex>{`1 - \\bar\\alpha_t \\approx ${fmt(1 - a * a)}`}</Tex>
        </span>
        <p className="viz-delta">
          En haut : la loi des données bruitées au pas <Tex>t</Tex> (en rouge), à côté de <Tex>{"N(0, 1)"}</Tex> (en
          tirets). En bas : 40 générations, du bruit pur (à gauche) jusqu'aux données (à droite), guidées par le score
          exact ; le trait rouge marque le pas choisi. Chaque trajectoire est colorée selon la bosse où elle arrive.
        </p>
      </div>
    </figure>
  );
}
