import { Coordinates, Line, Mafs, Theme, useMovablePoint } from "mafs";
import { Tex } from "../../components/Tex";
import { texNum } from "../../lib/tex";

const snap = (v: number) => Math.round(v * 2) / 2;
const clamp = (v: number, lo: number, hi: number) => Math.max(lo, Math.min(hi, v));
const constrain = ([x, y]: [number, number]): [number, number] => [clamp(snap(x), 0, 6), clamp(snap(y), 0, 5)];

// Least-squares line y = a + b t through draggable points; the residuals are orthogonal to both columns (1 and t).
export function RegressionViz() {
  const pts = [
    useMovablePoint([1, 1], { color: Theme.blue, constrain }),
    useMovablePoint([2, 3], { color: Theme.blue, constrain }),
    useMovablePoint([4, 2.5], { color: Theme.blue, constrain }),
    useMovablePoint([5, 4.5], { color: Theme.blue, constrain }),
  ];
  const n = pts.length;
  const St = pts.reduce((s, p) => s + p.x, 0);
  const Stt = pts.reduce((s, p) => s + p.x * p.x, 0);
  const Sy = pts.reduce((s, p) => s + p.y, 0);
  const Sty = pts.reduce((s, p) => s + p.x * p.y, 0);
  // Normal equations: [n St; St Stt] [a; b] = [Sy; Sty].
  const D = n * Stt - St * St;
  const ok = Math.abs(D) > 1e-9;
  const b = ok ? (n * Sty - St * Sy) / D : 0;
  const a = ok ? (Sy - b * St) / n : 0;
  const r = pts.map((p) => p.y - (a + b * p.x));
  const sse = r.reduce((s, x) => s + x * x, 0);
  const s1 = r.reduce((s, x) => s + x, 0);
  const st = r.reduce((s, x, i) => s + pts[i].x * x, 0);
  // Round away float noise so the sums display as exactly 0.
  const z = (v: number) => (Math.abs(v) < 1e-9 ? 0 : v);

  return (
    <figure className="viz" aria-label="Droite des moindres carrés et résidus">
      <Mafs height={300} viewBox={{ x: [-0.5, 6.5], y: [-0.5, 5.5], padding: 0 }} pan={false}>
        <Coordinates.Cartesian subdivisions={false} />
        {ok && <Line.ThroughPoints point1={[0, a]} point2={[1, a + b]} color={Theme.green} />}
        {ok && pts.map((p, i) => <Line.Segment key={i} point1={p.point} point2={[p.x, a + b * p.x]} color={Theme.red} style="dashed" />)}
        {pts.map((p, i) => (
          <g key={i}>{p.element}</g>
        ))}
      </Mafs>
      <div className="viz-formulas">
        {ok ? (
          <>
            <Tex>{`\\hat y = ${texNum(a)} ${b < 0 ? "-" : "+"} ${texNum(Math.abs(b))}\\,t \\qquad \\sum r_i^2 = ${texNum(sse)}`}</Tex>
            <Tex>{`\\sum r_i = ${texNum(z(s1))} \\qquad \\sum t_i\\, r_i = ${texNum(z(st))}`}</Tex>
            <p className="viz-delta">
              En pointillés rouges, les résidus <Tex>{"r_i = y_i - \\hat y_i"}</Tex>. Leur somme des carrés est
              minimale, et les deux sommes du bas restent nulles quoi que tu fasses : c'est l'orthogonalité.
            </p>
          </>
        ) : (
          <p className="viz-delta">Tous les points ont la même abscisse : les colonnes 1 et t sont liées, la droite n'est pas unique.</p>
        )}
      </div>
    </figure>
  );
}
