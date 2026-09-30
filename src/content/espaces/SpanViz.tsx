import { useState } from "react";
import { Coordinates, Line, Mafs, Point, Theme, Vector, useMovablePoint } from "mafs";
import { Tex } from "../../components/Tex";
import { texNum } from "../../lib/tex";

const snap = (v: number) => Math.round(v * 2) / 2;
const clamp = (v: number, lo: number, hi: number) => Math.max(lo, Math.min(hi, v));
const constrain = ([x, y]: [number, number]): [number, number] => [clamp(snap(x), -3, 3), clamp(snap(y), -3, 3)];
const TARGET: [number, number] = [3, -1];

// λu + μv: try to reach the target. With u and v on the same line, only that line is reachable.
export function SpanViz() {
  const u = useMovablePoint([1, 1], { color: Theme.green, constrain });
  const v = useMovablePoint([1, -1], { color: Theme.red, constrain });
  const [l, setL] = useState(0.5);
  const [m, setM] = useState(0.5);
  const w: [number, number] = [l * u.x + m * v.x, l * u.y + m * v.y];
  const det = u.x * v.y - u.y * v.x;
  const hit = Math.hypot(w[0] - TARGET[0], w[1] - TARGET[1]) < 0.06;
  const zeroU = u.x === 0 && u.y === 0;
  const zeroV = v.x === 0 && v.y === 0;
  // Direction of the line spanned when u and v are collinear (and not both zero).
  const dir = !zeroU ? u.point : v.point;

  let verdict: string;
  if (Math.abs(det) > 1e-9) verdict = hit ? "Atteint : b est une combinaison de u et v." : "u et v sont indépendants : tout le plan est atteignable. Règle λ et μ pour atteindre b.";
  else if (zeroU && zeroV) verdict = "u et v sont nuls : on n'atteint que l'origine.";
  else verdict = "u et v sont colinéaires : leurs combinaisons restent sur la droite en pointillés.";

  const slider = (label: string, value: number, set: (x: number) => void) => (
    <label>
      <Tex>{label}</Tex>
      <input type="range" min={-3} max={3} step={0.1} value={value} onChange={(e) => set(Number(e.target.value))} />
      <span className="viz-readout">{texNum(value, 1).replace("{,}", ",")}</span>
    </label>
  );

  return (
    <figure className="viz" aria-label="Combinaisons linéaires de deux vecteurs">
      <Mafs height={300} viewBox={{ x: [-4.5, 4.5], y: [-3.5, 3.5], padding: 0 }} pan={false}>
        <Coordinates.Cartesian />
        {Math.abs(det) <= 1e-9 && !(zeroU && zeroV) && (
          <Line.ThroughPoints point1={[0, 0]} point2={dir} style="dashed" color={Theme.foreground} opacity={0.5} />
        )}
        <Point x={TARGET[0]} y={TARGET[1]} color={Theme.orange} />
        <Vector tip={w} color={Theme.blue} weight={4} />
        <Vector tip={u.point} color={Theme.green} weight={3} />
        <Vector tip={v.point} color={Theme.red} weight={3} />
        {u.element}
        {v.element}
      </Mafs>
      <div className="viz-controls">
        {slider("\\lambda", l, setL)}
        {slider("\\mu", m, setM)}
      </div>
      <div className="viz-formulas">
        <Tex>{`\\lambda u + \\mu v = ${texNum(l, 1)}\\,(${texNum(u.x)},\\ ${texNum(u.y)}) + ${texNum(m, 1)}\\,(${texNum(v.x)},\\ ${texNum(v.y)}) = (${texNum(w[0])},\\ ${texNum(w[1])}) \\qquad b = (3,\\ -1)`}</Tex>
        <p className="viz-delta">{verdict}</p>
      </div>
    </figure>
  );
}
