import { Coordinates, Line, Mafs, Theme, Vector, useMovablePoint } from "mafs";
import { Tex } from "../../components/Tex";
import { texNum } from "../../lib/tex";

const snap = (v: number) => Math.round(v * 2) / 2;
const clamp = (v: number, lo: number, hi: number) => Math.max(lo, Math.min(hi, v));
const constrain = ([x, y]: [number, number]): [number, number] => [clamp(snap(x), -4, 4), clamp(snap(y), -3, 3)];

type Props = { showProjection?: boolean };

// Two vectors a and b from the origin: dot product, norms, angle and, optionally, the projection of a onto b.
export function DotViz({ showProjection = false }: Props) {
  // Start with a projection that is visibly shorter than b (k = 0.6).
  const a = useMovablePoint([1, 3], { color: Theme.blue, constrain });
  const b = useMovablePoint([3, 1], { color: Theme.green, constrain });
  const dot = a.x * b.x + a.y * b.y;
  const na = Math.hypot(a.x, a.y);
  const nb = Math.hypot(b.x, b.y);
  const degenerate = na < 1e-9 || nb < 1e-9;
  const cos = degenerate ? 0 : dot / (na * nb);
  const angle = (Math.acos(clamp(cos, -1, 1)) * 180) / Math.PI;
  // Projection of a onto the line of b: (a·b / ‖b‖²) b.
  const k = degenerate ? 0 : dot / (nb * nb);
  const proj: [number, number] = [k * b.x, k * b.y];

  let verdict = "Produit scalaire positif : a et b vont plutôt dans le même sens (angle aigu).";
  if (degenerate) verdict = "Un vecteur nul n'a pas de direction : l'angle n'est pas défini.";
  else if (Math.abs(dot) < 1e-9) verdict = "Produit scalaire nul : a et b sont orthogonaux.";
  else if (dot < 0) verdict = "Produit scalaire négatif : a et b vont plutôt en sens contraires (angle obtus).";

  return (
    <figure className="viz" aria-label="Produit scalaire de deux vecteurs a et b">
      <Mafs height={320} viewBox={{ x: [-4.5, 4.5], y: [-3.5, 3.5], padding: 0 }} pan={false}>
        <Coordinates.Cartesian />
        {showProjection && !degenerate && (
          <>
            <Line.Segment point1={a.point} point2={proj} style="dashed" color={Theme.foreground} opacity={0.5} />
            <Vector tip={proj} color={Theme.orange} weight={5} />
          </>
        )}
        <Vector tip={a.point} color={Theme.blue} weight={3} />
        <Vector tip={b.point} color={Theme.green} weight={3} />
        {a.element}
        {b.element}
      </Mafs>
      <div className="viz-formulas">
        <span>
          <span style={{ color: Theme.blue }}>
            <Tex>{`a = (${texNum(a.x)},\\ ${texNum(a.y)})`}</Tex>
          </span>
          <Tex>{"\\qquad"}</Tex>
          <span style={{ color: Theme.green }}>
            <Tex>{`b = (${texNum(b.x)},\\ ${texNum(b.y)})`}</Tex>
          </span>
        </span>
        <Tex>{`a \\cdot b = ${texNum(a.x)} \\times ${texNum(b.x)} + ${texNum(a.y)} \\times ${texNum(b.y)} = ${texNum(dot)}`}</Tex>
        {!degenerate && (
          <Tex>{`\\|a\\| \\approx ${texNum(na)} \\quad \\|b\\| \\approx ${texNum(nb)} \\quad \\cos\\theta = \\frac{a \\cdot b}{\\|a\\|\\,\\|b\\|} \\approx ${texNum(cos)} \\quad \\theta \\approx ${texNum(angle, 1)}^\\circ`}</Tex>
        )}
        {showProjection && !degenerate && (
          <span style={{ color: Theme.orange }}>
            <Tex>{`\\text{projeté de } a \\text{ sur } b : \\frac{a \\cdot b}{\\|b\\|^2}\\,b \\approx ${texNum(k)}\\,b`}</Tex>
          </span>
        )}
        <p className="viz-delta">{verdict}</p>
      </div>
    </figure>
  );
}
