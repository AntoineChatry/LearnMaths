import { useState } from "react";
import { Coordinates, Line, Mafs, Point, Theme } from "mafs";
import { Tex } from "../../components/Tex";
import { texNum } from "../../lib/tex";

// First equation fixed: x + 2y = 4. The second, a x + b y = c, is set with the sliders.
const A1 = 1, B1 = 2, C1 = 4;

type Vec2 = [number, number];
// Two points on the line a x + b y = c (assumes (a, b) ≠ (0, 0)).
function linePoints(a: number, b: number, c: number): [Vec2, Vec2] {
  if (b !== 0) return [[0, c / b], [1, (c - a) / b]];
  return [[c / a, 0], [c / a, 1]];
}

const signed = (n: number, v: string) => (n === 0 ? "" : `${n < 0 ? "-" : "+"} ${Math.abs(n) === 1 ? "" : Math.abs(n)}${v}`);
const lhs = (a: number, b: number) => {
  const s = `${a === 0 ? "" : `${a === -1 ? "-" : a === 1 ? "" : a}x`} ${a === 0 ? (b === 0 ? "0" : `${b === -1 ? "-" : b === 1 ? "" : b}y`) : signed(b, "y")}`;
  return s.trim();
};

export function SystemViz() {
  const [a, setA] = useState(2);
  const [b, setB] = useState(-1);
  const [c, setC] = useState(3);

  const det = A1 * b - B1 * a;
  let verdict: string;
  let solution: Vec2 | null = null;
  if (a === 0 && b === 0) {
    verdict = c === 0 ? "La seconde équation dit 0 = 0 : elle n'apporte rien, toute la droite bleue est solution." : `La seconde équation dit 0 = ${c} : aucune solution.`;
  } else if (det !== 0) {
    solution = [(C1 * b - B1 * c) / det, (A1 * c - C1 * a) / det];
    verdict = "Les droites se coupent en un seul point : une solution unique.";
  } else if (A1 * c === C1 * a && B1 * c === C1 * b) {
    verdict = "Les deux équations décrivent la même droite : une infinité de solutions.";
  } else {
    verdict = "Droites parallèles distinctes : aucune solution.";
  }

  const slider = (label: string, value: number, set: (v: number) => void, min: number, max: number) => (
    <label>
      <Tex>{label}</Tex>
      <input type="range" min={min} max={max} step={1} value={value} onChange={(e) => set(Number(e.target.value))} />
      <span className="viz-readout">{value}</span>
    </label>
  );

  return (
    <figure className="viz" aria-label="Deux équations à deux inconnues, vues comme deux droites">
      <Mafs height={300} viewBox={{ x: [-5, 5], y: [-3.5, 3.5], padding: 0 }} pan={false}>
        <Coordinates.Cartesian />
        <Line.ThroughPoints point1={linePoints(A1, B1, C1)[0]} point2={linePoints(A1, B1, C1)[1]} color={Theme.blue} weight={3} />
        {!(a === 0 && b === 0) && (
          <Line.ThroughPoints point1={linePoints(a, b, c)[0]} point2={linePoints(a, b, c)[1]} color={Theme.orange} weight={3} />
        )}
        {solution && <Point x={solution[0]} y={solution[1]} color={Theme.red} />}
      </Mafs>
      <div className="viz-controls">
        {slider("a", a, setA, -3, 3)}
        {slider("b", b, setB, -3, 3)}
        {slider("c", c, setC, -6, 6)}
      </div>
      <div className="viz-formulas">
        <Tex>{`\\begin{cases} x + 2y = 4 \\\\ ${lhs(a, b)} = ${c} \\end{cases}${solution ? ` \\qquad (x, y) = (${texNum(solution[0])},\\ ${texNum(solution[1])})` : ""}`}</Tex>
        <p className="viz-delta">{verdict}</p>
      </div>
    </figure>
  );
}
