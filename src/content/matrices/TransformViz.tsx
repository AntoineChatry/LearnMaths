import { Coordinates, Line, Mafs, Polygon, Theme, Vector, useMovablePoint } from "mafs";
import { Tex } from "../../components/Tex";
import { texNum } from "../../lib/tex";

const snap = (v: number) => Math.round(v * 2) / 2;
const clamp = (v: number, lo: number, hi: number) => Math.max(lo, Math.min(hi, v));
const constrain = ([x, y]: [number, number]): [number, number] => [clamp(snap(x), -3, 3), clamp(snap(y), -3, 3)];

type Vec2 = [number, number];
const PRESETS: { label: string; c1: Vec2; c2: Vec2 }[] = [
  { label: "Identité", c1: [1, 0], c2: [0, 1] },
  { label: "Rotation d'un quart de tour", c1: [0, 1], c2: [-1, 0] },
  { label: "Étirement", c1: [2, 0], c2: [0, 0.5] },
  { label: "Cisaillement", c1: [1, 0], c2: [1, 1] },
  { label: "Écrasement sur une droite", c1: [1, 0.5], c2: [2, 1] },
];
// The sample vector x whose image Ax is shown.
const X: Vec2 = [2, 1];
const GRID = [-6, -5, -4, -3, -2, -1, 0, 1, 2, 3, 4, 5, 6];

// The matrix's columns are the images of e1 and e2: drag them and the whole grid follows.
export function TransformViz() {
  const c1 = useMovablePoint([1, 0.5], { color: Theme.green, constrain });
  const c2 = useMovablePoint([-0.5, 1], { color: Theme.red, constrain });
  const A = (p: Vec2): Vec2 => [p[0] * c1.x + p[1] * c2.x, p[0] * c1.y + p[1] * c2.y];
  const ax = A(X);

  return (
    <figure className="viz" aria-label="Une matrice 2 × 2 transforme la grille du plan">
      <Mafs height={340} viewBox={{ x: [-4, 4], y: [-3.5, 3.5], padding: 0 }} pan={false}>
        <Coordinates.Cartesian subdivisions={false} />
        {GRID.map((k) => (
          <g key={k}>
            <Line.Segment point1={A([k, -6])} point2={A([k, 6])} color={Theme.indigo} opacity={0.35} />
            <Line.Segment point1={A([-6, k])} point2={A([6, k])} color={Theme.indigo} opacity={0.35} />
          </g>
        ))}
        <Polygon points={[[0, 0], A([1, 0]), A([1, 1]), A([0, 1])]} color={Theme.yellow} fillOpacity={0.25} />
        <Vector tip={ax} color={Theme.blue} weight={3} />
        <Vector tip={c1.point} color={Theme.green} weight={3} />
        <Vector tip={c2.point} color={Theme.red} weight={3} />
        {c1.element}
        {c2.element}
      </Mafs>
      <div className="viz-controls">
        {PRESETS.map((p) => (
          <button
            key={p.label}
            type="button"
            className="btn btn-quiet"
            onClick={() => {
              c1.setPoint(p.c1);
              c2.setPoint(p.c2);
            }}
          >
            {p.label}
          </button>
        ))}
      </div>
      <div className="viz-formulas">
        <Tex>{`A = \\begin{pmatrix} ${texNum(c1.x)} & ${texNum(c2.x)} \\\\ ${texNum(c1.y)} & ${texNum(c2.y)} \\end{pmatrix} \\qquad A \\begin{pmatrix} 2 \\\\ 1 \\end{pmatrix} = 2 \\begin{pmatrix} ${texNum(c1.x)} \\\\ ${texNum(c1.y)} \\end{pmatrix} + 1 \\begin{pmatrix} ${texNum(c2.x)} \\\\ ${texNum(c2.y)} \\end{pmatrix} = \\begin{pmatrix} ${texNum(ax[0])} \\\\ ${texNum(ax[1])} \\end{pmatrix}`}</Tex>
        <p className="viz-delta">
          Vert : image de <Tex>{"e_1 = (1, 0)"}</Tex>, première colonne. Rouge : image de <Tex>{"e_2 = (0, 1)"}</Tex>,
          seconde colonne. Bleu : image de <Tex>{"x = (2, 1)"}</Tex>. En jaune, l'image du carré unité.
        </p>
      </div>
    </figure>
  );
}
