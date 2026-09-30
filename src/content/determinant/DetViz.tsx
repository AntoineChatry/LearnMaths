import { Coordinates, Mafs, Polygon, Theme, Vector, useMovablePoint } from "mafs";
import { Tex } from "../../components/Tex";
import { texNum } from "../../lib/tex";

const snap = (v: number) => Math.round(v * 2) / 2;
const clamp = (v: number, lo: number, hi: number) => Math.max(lo, Math.min(hi, v));
const constrain = ([x, y]: [number, number]): [number, number] => [clamp(snap(x), -3, 3), clamp(snap(y), -3, 3)];
const par = (v: number) => (v < 0 ? `(${texNum(v)})` : texNum(v));

// The unit square is sent to the parallelogram built on the columns; det is its signed area.
export function DetViz() {
  const c1 = useMovablePoint([2, 0.5], { color: Theme.green, constrain });
  const c2 = useMovablePoint([0.5, 1.5], { color: Theme.red, constrain });
  const det = c1.x * c2.y - c2.x * c1.y;
  const color = det > 0 ? Theme.green : det < 0 ? Theme.red : Theme.foreground;

  let verdict: string;
  if (det > 0) verdict = `Aire ${texNum(det).replace("{,}", ",")} fois celle du carré unité, orientation conservée (on tourne de la colonne verte vers la rouge dans le sens direct).`;
  else if (det < 0) verdict = `Aire ${texNum(-det).replace("{,}", ",")} fois celle du carré unité, orientation retournée : le plan a été retourné comme dans un miroir.`;
  else verdict = "Déterminant nul : le carré est écrasé sur une droite (ou un point), les colonnes sont liées.";

  return (
    <figure className="viz" aria-label="Le déterminant comme aire signée du parallélogramme des colonnes">
      <Mafs height={300} viewBox={{ x: [-4, 4], y: [-3.5, 3.5], padding: 0 }} pan={false}>
        <Coordinates.Cartesian subdivisions={false} />
        <Polygon points={[[0, 0], [1, 0], [1, 1], [0, 1]]} color={Theme.foreground} fillOpacity={0} strokeStyle="dashed" />
        <Polygon points={[[0, 0], c1.point, [c1.x + c2.x, c1.y + c2.y], c2.point]} color={color} fillOpacity={0.25} />
        <Vector tip={c1.point} color={Theme.green} weight={3} />
        <Vector tip={c2.point} color={Theme.red} weight={3} />
        {c1.element}
        {c2.element}
      </Mafs>
      <div className="viz-formulas">
        <Tex>{`\\det \\begin{pmatrix} ${texNum(c1.x)} & ${texNum(c2.x)} \\\\ ${texNum(c1.y)} & ${texNum(c2.y)} \\end{pmatrix} = ${par(c1.x)} \\times ${par(c2.y)} - ${par(c2.x)} \\times ${par(c1.y)} =${texNum(det)}`}</Tex>
        <p className="viz-delta">{verdict}</p>
      </div>
    </figure>
  );
}
