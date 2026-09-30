import { Coordinates, Line, Mafs, Point, Polygon, Theme } from "mafs";
import { useMemo, useState } from "react";
import { Tex } from "../../components/Tex";
import { texNum } from "../../lib/tex";

const N = 150;
const SIGMAS = [0.5, 0.75, 1, 1.5, 2];
const RHOS = [-0.9, -0.6, -0.3, 0, 0.3, 0.6, 0.9];

// Deterministic standard normal pairs (mulberry32 + Box-Muller).
function normalPairs(n: number, seed: number): [number, number][] {
  let s = seed >>> 0;
  const rand = () => {
    s = (s + 0x6d2b79f5) >>> 0;
    let t = s;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
  const out: [number, number][] = [];
  for (let i = 0; i < n; i++) {
    const r = Math.sqrt(-2 * Math.log(1 - rand()));
    const a = 2 * Math.PI * rand();
    out.push([r * Math.cos(a), r * Math.sin(a)]);
  }
  return out;
}

// N(0, Σ) in 2D: samples x = L z, contour ellipses {x : xᵀΣ⁻¹x = k²} traced as L (cos t, sin t) k, and eigen axes.
export function GaussViz() {
  const [i1, setI1] = useState(3);
  const [i2, setI2] = useState(2);
  const [ir, setIr] = useState(5);
  const z = useMemo(() => normalPairs(N, 11), []);
  const s1 = SIGMAS[i1];
  const s2 = SIGMAS[i2];
  const rho = RHOS[ir];
  const c = rho * s1 * s2;
  // Cholesky factor of Σ = [[s1², c], [c, s2²]].
  const l11 = s1;
  const l21 = c / s1;
  const l22 = Math.sqrt(s2 * s2 - l21 * l21);
  const apply = ([a, b]: [number, number]): [number, number] => [l11 * a, l21 * a + l22 * b];
  const pts = z.map(apply);
  const ellipse = (k: number) =>
    Array.from({ length: 96 }, (_, j) => {
      const t = (2 * Math.PI * j) / 96;
      return apply([k * Math.cos(t), k * Math.sin(t)]);
    });
  // Eigen decomposition of the 2×2 covariance.
  const a = s1 * s1;
  const d = s2 * s2;
  const root = Math.sqrt(((a - d) / 2) ** 2 + c * c);
  const lam1 = (a + d) / 2 + root;
  const lam2 = (a + d) / 2 - root;
  let v: [number, number] = Math.abs(c) > 1e-12 ? [lam1 - d, c] : a >= d ? [1, 0] : [0, 1];
  const nv = Math.hypot(v[0], v[1]);
  v = [v[0] / nv, v[1] / nv];
  const w: [number, number] = [-v[1], v[0]];
  const r1 = 2 * Math.sqrt(lam1);
  const r2 = 2 * Math.sqrt(lam2);

  const slider = (label: string, idx: number, set: (n: number) => void, values: number[]) => (
    <label>
      <Tex>{label}</Tex>
      <input type="range" min={0} max={values.length - 1} step={1} value={idx} onChange={(e) => set(Number(e.target.value))} />
      <span className="viz-readout">{String(values[idx]).replace(".", ",")}</span>
    </label>
  );

  return (
    <figure className="viz" aria-label="Gaussienne en dimension 2 : échantillons, ellipses de niveau et axes propres">
      <Mafs height={340} viewBox={{ x: [-4.5, 4.5], y: [-4.5, 4.5] }} pan={false}>
        <Coordinates.Cartesian xAxis={{ lines: 1 }} yAxis={{ lines: 1 }} />
        {pts.map((p, j) => (
          <Point key={j} x={p[0]} y={p[1]} color={Theme.blue} opacity={0.5} svgCircleProps={{ r: 3 }} />
        ))}
        <Polygon points={ellipse(1)} color={Theme.green} fillOpacity={0.05} />
        <Polygon points={ellipse(2)} color={Theme.green} fillOpacity={0} />
        <Line.Segment point1={[-r1 * v[0], -r1 * v[1]]} point2={[r1 * v[0], r1 * v[1]]} color={Theme.red} weight={3} />
        <Line.Segment point1={[-r2 * w[0], -r2 * w[1]]} point2={[r2 * w[0], r2 * w[1]]} color={Theme.orange} weight={3} />
      </Mafs>
      <div className="viz-controls">
        {slider("\\sigma_1", i1, setI1, SIGMAS)}
        {slider("\\sigma_2", i2, setI2, SIGMAS)}
        {slider("\\rho", ir, setIr, RHOS)}
      </div>
      <div className="viz-formulas">
        <Tex>{`\\Sigma = \\begin{pmatrix} ${texNum(a)} & ${texNum(c)} \\\\ ${texNum(c)} & ${texNum(d)} \\end{pmatrix} \\qquad \\lambda_1 \\approx ${texNum(lam1)},\\ \\lambda_2 \\approx ${texNum(lam2)}`}</Tex>
        <p className="viz-delta">
          {N} tirages x = Lz, avec z ~ N(0, I) et Σ = LLᵀ. En vert, les ellipses où la densité est constante
          (distance de Mahalanobis 1 et 2). Leurs axes, en rouge et orange, suivent les vecteurs propres de Σ, avec
          des demi-longueurs 2√λ₁ et 2√λ₂ pour l'ellipse extérieure.
          {rho === 0 ? " Avec ρ = 0, les axes sont ceux des coordonnées : les deux composantes sont indépendantes." : ""}
        </p>
      </div>
    </figure>
  );
}
