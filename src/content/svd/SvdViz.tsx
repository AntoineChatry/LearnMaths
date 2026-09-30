import { Circle, Coordinates, Mafs, Plot, Theme, Vector, useMovablePoint } from "mafs";
import { Tex } from "../../components/Tex";
import { texNum } from "../../lib/tex";

const snap = (v: number) => Math.round(v * 2) / 2;
const clamp = (v: number, lo: number, hi: number) => Math.max(lo, Math.min(hi, v));
const constrain = ([x, y]: [number, number]): [number, number] => [clamp(snap(x), -3, 3), clamp(snap(y), -3, 3)];

// The unit circle is sent to an ellipse: its axes are σ1 u1 and σ2 u2, images of the orthonormal v1 and v2.
export function SvdViz() {
  const c1 = useMovablePoint([2, 1], { color: Theme.foreground, constrain });
  const c2 = useMovablePoint([0.5, 1.5], { color: Theme.foreground, constrain });
  const A = [
    [c1.x, c2.x],
    [c1.y, c2.y],
  ];
  const apply = ([x, y]: [number, number]): [number, number] => [A[0][0] * x + A[0][1] * y, A[1][0] * x + A[1][1] * y];

  // Eigen-decomposition of the symmetric AᵀA = [[p, q], [q, r]]: v1 at angle theta, σi = √λi.
  const p = c1.x * c1.x + c1.y * c1.y;
  const q = c1.x * c2.x + c1.y * c2.y;
  const r = c2.x * c2.x + c2.y * c2.y;
  const m = (p + r) / 2;
  const h = Math.hypot((p - r) / 2, q);
  const s1 = Math.sqrt(m + h);
  const s2 = Math.sqrt(Math.max(m - h, 0));
  const theta = 0.5 * Math.atan2(2 * q, p - r);
  const v1: [number, number] = [Math.cos(theta), Math.sin(theta)];
  const v2: [number, number] = [-Math.sin(theta), Math.cos(theta)];
  const flat = s2 < 1e-9;

  return (
    <figure className="viz" aria-label="Une matrice envoie le cercle unité sur une ellipse">
      <Mafs height={320} viewBox={{ x: [-4.5, 4.5], y: [-3.5, 3.5], padding: 0 }} pan={false}>
        <Coordinates.Cartesian subdivisions={false} />
        <Circle center={[0, 0]} radius={1} color={Theme.foreground} fillOpacity={0} strokeStyle="dashed" />
        <Plot.Parametric xy={(t) => apply([Math.cos(t), Math.sin(t)])} domain={[0, 2 * Math.PI]} color={Theme.blue} weight={2} />
        <Vector tip={v1} color={Theme.green} weight={2} />
        <Vector tip={v2} color={Theme.orange} weight={2} />
        <Vector tip={apply(v1)} color={Theme.green} weight={4} />
        {!flat && <Vector tip={apply(v2)} color={Theme.orange} weight={4} />}
        {c1.element}
        {c2.element}
      </Mafs>
      <div className="viz-formulas">
        <Tex>{`A = \\begin{pmatrix} ${texNum(A[0][0])} & ${texNum(A[0][1])} \\\\ ${texNum(A[1][0])} & ${texNum(A[1][1])} \\end{pmatrix} \\qquad \\sigma_1 = ${texNum(s1)}, \\ \\sigma_2 = ${texNum(s2)} \\qquad \\sigma_1 \\sigma_2 = ${texNum(s1 * s2)} = |\\det A|`}</Tex>
        <p className="viz-delta">
          {flat
            ? "σ₂ = 0 : le cercle est écrasé sur un segment, A est de rang 1 (ou 0)."
            : `Le cercle pointillé devient l'ellipse bleue. Les vecteurs fins v₁, v₂ (orthogonaux) sont envoyés sur ses axes, de longueurs σ₁ et σ₂. Conditionnement σ₁/σ₂ = ${texNum(s1 / s2, 1).replace("{,}", ",")}.`}
        </p>
      </div>
    </figure>
  );
}
