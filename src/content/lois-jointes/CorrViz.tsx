import { Coordinates, Line, Mafs, Point, Theme } from "mafs";
import { useMemo, useState } from "react";
import { Tex } from "../../components/Tex";
import { texNum } from "../../lib/tex";

const N = 200;
const RHOS = [-0.9, -0.7, -0.5, -0.3, 0, 0.3, 0.5, 0.7, 0.9];

// Deterministic standard normal pairs (mulberry32 + Box-Muller), so the cloud only changes with rho.
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
    const u1 = 1 - rand();
    const u2 = rand();
    const r = Math.sqrt(-2 * Math.log(u1));
    out.push([r * Math.cos(2 * Math.PI * u2), r * Math.sin(2 * Math.PI * u2)]);
  }
  return out;
}

// Empirical covariance with the 1/N convention, and the top eigenvector of the 2×2 matrix.
function stats(pts: [number, number][]) {
  const n = pts.length;
  const mx = pts.reduce((s, p) => s + p[0], 0) / n;
  const my = pts.reduce((s, p) => s + p[1], 0) / n;
  let sxx = 0;
  let syy = 0;
  let sxy = 0;
  for (const [x, y] of pts) {
    sxx += (x - mx) ** 2;
    syy += (y - my) ** 2;
    sxy += (x - mx) * (y - my);
  }
  sxx /= n;
  syy /= n;
  sxy /= n;
  const half = (sxx + syy) / 2;
  const lam = half + Math.sqrt(((sxx - syy) / 2) ** 2 + sxy ** 2);
  // Eigenvector of [[sxx, sxy], [sxy, syy]] for lam.
  let v: [number, number] = Math.abs(sxy) > 1e-12 ? [lam - syy, sxy] : sxx >= syy ? [1, 0] : [0, 1];
  const norm = Math.hypot(v[0], v[1]);
  v = [v[0] / norm, v[1] / norm];
  return { mx, my, sxx, syy, sxy, corr: sxy / Math.sqrt(sxx * syy), lam, v };
}

// A cloud of points with adjustable correlation, and a non-linear case where the correlation is close to zero.
export function CorrViz() {
  const [ri, setRi] = useState(6); // rho = 0.5
  const [square, setSquare] = useState(false);
  const base = useMemo(() => normalPairs(N, 7), []);
  const rho = RHOS[ri];
  const pts: [number, number][] = square
    ? base.map(([a]) => [a, a * a - 1])
    : base.map(([a, b]) => [a, rho * a + Math.sqrt(1 - rho * rho) * b]);
  const st = stats(pts);
  const len = 2 * Math.sqrt(st.lam);
  const axisA: [number, number] = [st.mx - len * st.v[0], st.my - len * st.v[1]];
  const axisB: [number, number] = [st.mx + len * st.v[0], st.my + len * st.v[1]];

  return (
    <figure className="viz" aria-label="Nuage de points, covariance et corrélation">
      <Mafs height={340} viewBox={{ x: [-3.5, 3.5], y: [-3.5, 6], padding: 0 }} preserveAspectRatio={false} pan={false}>
        <Coordinates.Cartesian xAxis={{ lines: 1 }} yAxis={{ lines: 1 }} />
        {pts.map((p, i) => (
          <Point key={i} x={p[0]} y={p[1]} color={Theme.blue} opacity={0.55} svgCircleProps={{ r: 3 }} />
        ))}
        <Line.Segment point1={axisA} point2={axisB} color={Theme.red} weight={4} />
      </Mafs>
      <div className="viz-controls">
        <label>
          corrélation visée <Tex>\rho</Tex>
          <input
            type="range"
            min={0}
            max={RHOS.length - 1}
            step={1}
            value={ri}
            disabled={square}
            onChange={(e) => setRi(Number(e.target.value))}
          />
          <span className="viz-readout">{square ? "—" : String(rho).replace(".", ",")}</span>
        </label>
        <label>
          <input type="checkbox" checked={square} onChange={(e) => setSquare(e.target.checked)} />
          <Tex>{"Y = X^2 - 1"}</Tex>
        </label>
      </div>
      <div className="viz-formulas">
        <Tex>{`\\hat\\Sigma = \\begin{pmatrix} ${texNum(st.sxx)} & ${texNum(st.sxy)} \\\\ ${texNum(st.sxy)} & ${texNum(st.syy)} \\end{pmatrix} \\qquad \\widehat{\\text{corr}} = \\frac{${texNum(st.sxy)}}{\\sqrt{${texNum(st.sxx)} \\times ${texNum(st.syy)}}} \\approx ${texNum(st.corr)}`}</Tex>
        <p className="viz-delta">
          {square
            ? "Y est une fonction de X, donc parfaitement dépendante, et pourtant la corrélation est proche de 0 : la covariance ne mesure que la tendance linéaire."
            : `${N} points. En rouge, la direction de plus grande variance, c'est-à-dire le vecteur propre de la matrice de covariance pour sa plus grande valeur propre : c'est le premier axe de la PCA.`}
        </p>
      </div>
    </figure>
  );
}
