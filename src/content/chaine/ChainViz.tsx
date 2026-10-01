import { Circle, Coordinates, Mafs, Plot, Point, Theme, Vector } from "mafs";
import { useState } from "react";
import { Tex } from "../../components/Tex";
import { texNum } from "../../lib/tex";

// MML example 5.8: f(x1, x2) = x1² + 2 x2 along the path x(t) = (sin t, cos t), the unit circle.
const LEVELS = [-2, -1, 0, 1, 2, 3];
const GRAD_SCALE = 0.35;

export function ChainViz() {
  const [t, setT] = useState(1);
  const x1 = Math.sin(t);
  const x2 = Math.cos(t);
  const g: [number, number] = [2 * x1, 2]; // ∇f
  const v: [number, number] = [Math.cos(t), -Math.sin(t)]; // x'(t)
  const dfdt = g[0] * v[0] + g[1] * v[1];
  const value = x1 * x1 + 2 * x2;

  return (
    <figure className="viz" aria-label="Règle de la chaîne le long d'un chemin : gradient et vitesse">
      <Mafs height={340} viewBox={{ x: [-2.5, 2.5], y: [-1.5, 1.5] }} pan={false}>
        <Coordinates.Cartesian />
        {LEVELS.map((c) => (
          <Plot.OfX key={c} y={(s) => (c - s * s) / 2} color={Theme.foreground} opacity={0.3} weight={1.5} />
        ))}
        <Plot.OfX y={(s) => (value - s * s) / 2} color={Theme.blue} weight={2.5} />
        <Circle center={[0, 0]} radius={1} color={Theme.orange} fillOpacity={0} weight={2} />
        <Vector tail={[x1, x2]} tip={[x1 + GRAD_SCALE * g[0], x2 + GRAD_SCALE * g[1]]} color={Theme.red} weight={3} />
        <Vector tail={[x1, x2]} tip={[x1 + v[0], x2 + v[1]]} color={Theme.green} weight={3} />
        <Point x={x1} y={x2} color={Theme.orange} />
      </Mafs>
      <div className="viz-controls">
        <label>
          temps <Tex>t</Tex>
          <input type="range" min={0} max={6.28} step={0.02} value={t} onChange={(e) => setT(Number(e.target.value))} />
          <span className="viz-readout">{texNum(t).replace("{,}", ",")}</span>
        </label>
      </div>
      <div className="viz-formulas">
        <span>
          <span style={{ color: Theme.red }}>
            <Tex>{`\\frac{\\partial f}{\\partial x} = (2x_1,\\ 2) = (${texNum(g[0])},\\ ${texNum(g[1])})`}</Tex>
          </span>
          <Tex>{"\\qquad"}</Tex>
          <span style={{ color: Theme.green }}>
            <Tex>{`\\frac{dx}{dt} = (\\cos t,\\ -\\sin t) = (${texNum(v[0])},\\ ${texNum(v[1])})`}</Tex>
          </span>
        </span>
        <Tex>{`\\frac{df}{dt} = \\frac{\\partial f}{\\partial x}\\,\\frac{dx}{dt} = ${texNum(dfdt, 3)} \\qquad 2\\sin t\\,(\\cos t - 1) = ${texNum(2 * x1 * (x2 - 1), 3)}`}</Tex>
        <p className="viz-delta">
          {Math.abs(dfdt) < 0.03
            ? "Ici la vitesse longe la ligne de niveau (en bleu) : f ne varie pas, df/dt ≈ 0."
            : dfdt > 0
              ? "La vitesse fait un angle aigu avec le gradient : f augmente le long du chemin."
              : "La vitesse fait un angle obtus avec le gradient : f diminue le long du chemin."}{" "}
          Le point parcourt le cercle unité (orange). Gradient réduit à 35 %.
        </p>
      </div>
    </figure>
  );
}
