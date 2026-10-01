import { Circle, Coordinates, Ellipse, Mafs, Point, Theme, Vector, useMovablePoint } from "mafs";
import { Tex } from "../../components/Tex";
import { texNum } from "../../lib/tex";

// f(x) = xᵀSx with S = [[2, 1], [1, 2]] (eigenvalues 3 along (1, 1), 1 along (1, −1)), on the unit circle h(x) = ‖x‖² = 1.
type V = [number, number];
const S = [
  [2, 1],
  [1, 2],
];
const f = ([x, y]: V) => S[0][0] * x * x + 2 * S[0][1] * x * y + S[1][1] * y * y;
const LEVELS = [0.5, 1, 2, 3, 4.5];
const SCALE = 0.35; // gradient arrows are drawn at 35 % of their length
const onCircle = ([x, y]: V): V => {
  const n = Math.hypot(x, y) || 1;
  // Snap the angle to whole degrees so that the eigenvectors (45°, 135°…) can be reached exactly.
  const t = Math.round((Math.atan2(y / n, x / n) * 180) / Math.PI) * (Math.PI / 180);
  return [Math.cos(t), Math.sin(t)];
};
// Level set xᵀSx = c: an ellipse with semi-axes √(c/3) along (1, 1) and √c along (1, −1).
const levelEllipse = (c: number, key: string, opacity: number, color: string) => (
  <Ellipse
    key={key}
    center={[0, 0]}
    radius={[Math.sqrt(c / 3), Math.sqrt(c)]}
    angle={Math.PI / 4}
    color={color}
    fillOpacity={0}
    strokeOpacity={opacity}
    weight={1.5}
  />
);

export function LagrangeViz() {
  const p = useMovablePoint([Math.cos(0.3), Math.sin(0.3)], { color: Theme.orange, constrain: onCircle });
  const [x, y] = p.point;
  const gf: V = [2 * (S[0][0] * x + S[0][1] * y), 2 * (S[1][0] * x + S[1][1] * y)];
  const gh: V = [2 * x, 2 * y];
  const value = f(p.point);
  // Component of ∇f along the tangent (−y, x): zero exactly at the constrained critical points.
  const tangential = -y * gf[0] + x * gf[1];
  const critical = Math.abs(tangential) < 1e-9;
  const deg = Math.round((Math.atan2(y, x) * 180) / Math.PI);

  return (
    <figure className="viz" aria-label="Gradient de f et gradient de la contrainte sur le cercle unité">
      <Mafs height={380} viewBox={{ x: [-2.3, 2.3], y: [-2.3, 2.3] }} pan={false}>
        <Coordinates.Cartesian />
        {LEVELS.map((c) => levelEllipse(c, String(c), 0.2, Theme.foreground))}
        {levelEllipse(value, "current", 0.9, Theme.blue)}
        <Circle center={[0, 0]} radius={1} color={Theme.red} fillOpacity={0} weight={2.5} />
        <Vector tail={p.point} tip={[x + SCALE * gh[0], y + SCALE * gh[1]]} color={Theme.red} weight={3} />
        <Vector tail={p.point} tip={[x + SCALE * gf[0], y + SCALE * gf[1]]} color={Theme.blue} weight={3} />
        <Point x={Math.SQRT1_2} y={Math.SQRT1_2} color={Theme.green} opacity={0.5} />
        <Point x={-Math.SQRT1_2} y={-Math.SQRT1_2} color={Theme.green} opacity={0.5} />
        <Point x={Math.SQRT1_2} y={-Math.SQRT1_2} color={Theme.green} opacity={0.5} />
        <Point x={-Math.SQRT1_2} y={Math.SQRT1_2} color={Theme.green} opacity={0.5} />
        {p.element}
      </Mafs>
      <div className="viz-formulas">
        <span>
          <Tex>{"f(x) = x^\\top S x"}</Tex> &emsp; <Tex>{"S = \\begin{pmatrix} 2 & 1 \\\\ 1 & 2 \\end{pmatrix}"}</Tex> &emsp;{" "}
          <Tex>{"h(x) = \\|x\\|^2 = 1"}</Tex>
        </span>
        <span>
          <Tex>{`\\text{angle} = ${deg}^\\circ`}</Tex> &emsp; <Tex>{`f(x) = ${texNum(value, 3)}`}</Tex>
        </span>
        <span style={{ color: critical ? Theme.green : Theme.foreground }}>
          {critical ? (
            <>
              <Tex>{"\\nabla f = \\lambda \\nabla h"}</Tex> &emsp; <Tex>{`\\lambda = ${texNum(value, 3)}`}</Tex> &emsp;{" "}
              <Tex>{"\\text{point critique}"}</Tex>
            </>
          ) : (
            <>
              <Tex>{"\\text{composante tangentielle de } \\nabla f"}</Tex> &emsp;{" "}
              <Tex>{`= ${texNum(tangential, 3)}`}</Tex>
            </>
          )}
        </span>
        <p className="viz-delta">
          Fais glisser le point orange sur le cercle rouge (la contrainte). Flèche rouge : <Tex>{"\\nabla h"}</Tex>,
          perpendiculaire au cercle. Flèche bleue : <Tex>{"\\nabla f"}</Tex>, perpendiculaire à la ligne de niveau bleue
          qui passe par le point. Tant que <Tex>{"\\nabla f"}</Tex> a une composante le long du cercle, on peut encore
          augmenter ou diminuer <Tex>f</Tex> en glissant. Aux quatre points verts, les deux flèches sont alignées :
          la ligne de niveau touche le cercle sans le traverser.
        </p>
      </div>
    </figure>
  );
}
