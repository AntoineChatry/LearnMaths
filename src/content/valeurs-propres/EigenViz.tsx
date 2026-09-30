import { useState } from "react";
import { Coordinates, Mafs, Theme, Vector, useMovablePoint } from "mafs";
import { Tex } from "../../components/Tex";
import { texNum } from "../../lib/tex";

type M2 = [[number, number], [number, number]];
const PRESETS: { label: string; A: M2 }[] = [
  { label: "Symétrique", A: [[2, 1], [1, 2]] },
  { label: "Triangulaire", A: [[3, 1], [0, 2]] },
  { label: "Cisaillement", A: [[1, 1], [0, 1]] },
  { label: "Rotation", A: [[0, -1], [1, 0]] },
];
const R = 2;
const STEP = (5 * Math.PI) / 180;
// x stays on the circle of radius 2, at angles that are multiples of 5°.
const constrain = ([x, y]: [number, number]): [number, number] => {
  const t = Math.round(Math.atan2(y, x) / STEP) * STEP;
  return [R * Math.cos(t), R * Math.sin(t)];
};

// Drag x around the circle: Ax generally points elsewhere, except along the eigen-directions.
export function EigenViz() {
  const [k, setK] = useState(0);
  const A = PRESETS[k].A;
  const x = useMovablePoint([R * Math.cos(STEP * 6), R * Math.sin(STEP * 6)], { color: Theme.blue, constrain });
  const ax: [number, number] = [A[0][0] * x.x + A[0][1] * x.y, A[1][0] * x.x + A[1][1] * x.y];
  const cross = x.x * ax[1] - x.y * ax[0];
  const aligned = Math.abs(cross) < 1e-6;
  const lambda = (ax[0] * x.x + ax[1] * x.y) / (R * R);
  const deg = Math.round((Math.atan2(x.y, x.x) * 180) / Math.PI);

  return (
    <figure className="viz" aria-label="Chercher les directions que la matrice ne fait pas tourner">
      <Mafs height={320} viewBox={{ x: [-6.5, 6.5], y: [-4.5, 4.5], padding: 0 }} pan={false}>
        <Coordinates.Cartesian subdivisions={false} />
        <Vector tip={ax} color={aligned ? Theme.green : Theme.red} weight={4} />
        <Vector tip={x.point} color={Theme.blue} weight={3} />
        {x.element}
      </Mafs>
      <div className="viz-controls">
        {PRESETS.map((p, i) => (
          <button key={p.label} type="button" className={i === k ? "btn" : "btn btn-quiet"} onClick={() => setK(i)}>
            {p.label}
          </button>
        ))}
      </div>
      <div className="viz-formulas">
        <Tex>{`A = \\begin{pmatrix} ${A[0][0]} & ${A[0][1]} \\\\ ${A[1][0]} & ${A[1][1]} \\end{pmatrix} \\qquad x = (${texNum(x.x)},\\ ${texNum(x.y)}) \\qquad Ax = (${texNum(ax[0])},\\ ${texNum(ax[1])})`}</Tex>
        <p className="viz-delta">
          {aligned ? (
            <>
              Vecteur propre (angle {deg}°) : <Tex>{`Ax = ${texNum(lambda)}\\,x`}</Tex>, la matrice ne fait que l'étirer.
            </>
          ) : (
            <>Angle {deg}° : Ax (en rouge) ne pointe pas dans la direction de x (en bleu). Fais tourner x.</>
          )}
        </p>
      </div>
    </figure>
  );
}
