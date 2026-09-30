import { useState } from "react";
import { Coordinates, Line, Mafs, Plot, Theme, useMovablePoint } from "mafs";
import { Tex } from "../../components/Tex";
import { texNum } from "../../lib/tex";

const LEVELS = [1, 4, 9];
const FAR = 12;
const EPS = 1e-9;
type Curve = { key: string; k: number; xy: (t: number) => [number, number]; domain: [number, number] };

// Level curves λ1 u² + λ2 v² = k in the eigenbasis (u along the eigenvector of λ1, at angle theta), drawn back in (x, y).
function levelCurves(l1: number, l2: number, theta: number): Curve[] {
  const c = Math.cos(theta);
  const s = Math.sin(theta);
  const rot = (u: number, v: number): [number, number] => [u * c - v * s, u * s + v * c];
  const out: Curve[] = [];
  for (const k of [...LEVELS, ...LEVELS.map((x) => -x)]) {
    const pos1 = Math.abs(l1) > EPS && k / l1 > 0;
    const pos2 = Math.abs(l2) > EPS && k / l2 > 0;
    const r1 = pos1 ? Math.sqrt(k / l1) : Math.abs(l1) > EPS ? Math.sqrt(-k / l1) : 0;
    const r2 = pos2 ? Math.sqrt(k / l2) : Math.abs(l2) > EPS ? Math.sqrt(-k / l2) : 0;
    if (pos1 && pos2) {
      out.push({ key: `e${k}`, k, xy: (t) => rot(r1 * Math.cos(t), r2 * Math.sin(t)), domain: [0, 2 * Math.PI] });
    } else if (pos1 && r2 > 0) {
      const T = Math.asinh(FAR / r2);
      for (const sg of [1, -1]) out.push({ key: `h${k}${sg}`, k, xy: (t) => rot(sg * r1 * Math.cosh(t), r2 * Math.sinh(t)), domain: [-T, T] });
    } else if (pos2 && r1 > 0) {
      const T = Math.asinh(FAR / r1);
      for (const sg of [1, -1]) out.push({ key: `h${k}${sg}`, k, xy: (t) => rot(r1 * Math.sinh(t), sg * r2 * Math.cosh(t)), domain: [-T, T] });
    } else if (pos1) {
      for (const sg of [1, -1]) out.push({ key: `l${k}${sg}`, k, xy: (t) => rot(sg * r1, t), domain: [-FAR, FAR] });
    } else if (pos2) {
      for (const sg of [1, -1]) out.push({ key: `l${k}${sg}`, k, xy: (t) => rot(t, sg * r2), domain: [-FAR, FAR] });
    }
  }
  return out;
}

function Slider({ name, value, set }: { name: string; value: number; set: (v: number) => void }) {
  return (
    <label>
      {name}
      <input type="range" min={-3} max={3} step={0.5} value={value} onChange={(e) => set(Number(e.target.value))} />
      <span className="viz-readout">{texNum(value, 1).replace("{,}", ",")}</span>
    </label>
  );
}

// A = [[a, b], [b, c]]: the level curves of xᵀAx are ellipses, hyperbolas or lines depending on the signs of the eigenvalues.
export function QuadViz() {
  const [a, setA] = useState(2);
  const [b, setB] = useState(1);
  const [c, setC] = useState(2);
  const p = useMovablePoint([1, 0.5], { color: Theme.blue });

  const m = (a + c) / 2;
  const r = Math.hypot((a - c) / 2, b);
  const l1 = m + r;
  const l2 = m - r;
  const theta = 0.5 * Math.atan2(2 * b, a - c);
  const u: [number, number] = [Math.cos(theta), Math.sin(theta)];
  const q = a * p.x * p.x + 2 * b * p.x * p.y + c * p.y * p.y;

  const verdict =
    l2 > EPS
      ? ["viz-verdict-ok", "Définie positive : un bol, dont le fond est en 0. Les courbes de niveau sont des ellipses."]
      : l1 < -EPS
        ? ["viz-verdict-ko", "Définie négative : un dôme, dont le sommet est en 0."]
        : l1 > EPS && l2 < -EPS
          ? ["viz-verdict-ko", "Indéfinie : une selle. Ça monte le long d'un axe propre (courbes bleues) et ça descend le long de l'autre (rouges)."]
          : l1 > EPS || l2 < -EPS
            ? ["", "Semi-définie : une gouttière. Une valeur propre est nulle, et la forme vaut 0 sur toute une droite."]
            : ["", "Matrice nulle : la forme vaut 0 partout."];

  return (
    <figure className="viz" aria-label="Courbes de niveau d'une forme quadratique">
      <Mafs height={340} viewBox={{ x: [-5, 5], y: [-3.5, 3.5], padding: 0 }} pan={false}>
        <Coordinates.Cartesian subdivisions={false} />
        {r > EPS && (
          <>
            <Line.ThroughPoints point1={[0, 0]} point2={u} style="dashed" color={Theme.foreground} opacity={0.4} />
            <Line.ThroughPoints point1={[0, 0]} point2={[-u[1], u[0]]} style="dashed" color={Theme.foreground} opacity={0.4} />
          </>
        )}
        {levelCurves(l1, l2, theta).map((cv) => (
          <Plot.Parametric key={cv.key} xy={cv.xy} domain={cv.domain} color={cv.k > 0 ? Theme.blue : Theme.red} weight={2} opacity={0.35 + 0.2 * LEVELS.indexOf(Math.abs(cv.k))} />
        ))}
        {p.element}
      </Mafs>
      <div className="viz-controls">
        <Slider name="a" value={a} set={setA} />
        <Slider name="b" value={b} set={setB} />
        <Slider name="c" value={c} set={setC} />
      </div>
      <div className="viz-formulas">
        <Tex>{`A = \\begin{pmatrix} ${texNum(a, 1)} & ${texNum(b, 1)} \\\\ ${texNum(b, 1)} & ${texNum(c, 1)} \\end{pmatrix} \\qquad \\lambda_1 = ${texNum(l1)}, \\ \\lambda_2 = ${texNum(l2)}`}</Tex>
        <Tex>{`x = (${texNum(p.x)},\\ ${texNum(p.y)}) \\qquad x^\\top A x = ${texNum(q)}`}</Tex>
        <p className="viz-delta">
          <span className={verdict[0]}>{verdict[1]}</span> Courbes tracées : <Tex>{"x^\\top A x = \\pm 1, \\pm 4, \\pm 9"}</Tex>.
        </p>
      </div>
    </figure>
  );
}
