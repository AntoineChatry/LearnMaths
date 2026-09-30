import { useState } from "react";
import { Coordinates, Line, Mafs, Plot, Point, Theme, useMovablePoint } from "mafs";
import { Tex } from "../../components/Tex";
import { texNum } from "../../lib/tex";

// f(x) = eˣ − 2x : convex, minimum at x = ln 2.
const f = (x: number) => Math.exp(x) - 2 * x;
const df = (x: number) => Math.exp(x) - 2;
const d2f = (x: number) => Math.exp(x);

const clamp = (x: number) => Math.min(2.6, Math.max(-0.5, x));

export function NewtonViz() {
  const p = useMovablePoint([2.5, f(2.5)], {
    constrain: ([x]) => [clamp(x), f(clamp(x))],
  });
  const [steps, setSteps] = useState(0);
  const x0 = p.x;

  // Osculating parabola at x0: order-2 expansion.
  const q = (x: number) => f(x0) + df(x0) * (x - x0) + 0.5 * d2f(x0) * (x - x0) ** 2;
  const x1 = x0 - df(x0) / d2f(x0);

  const step = () => {
    p.setPoint([x1, f(x1)]);
    setSteps((s) => s + 1);
  };
  const reset = () => {
    p.setPoint([2.5, f(2.5)]);
    setSteps(0);
  };

  return (
    <figure className="viz" aria-label="Méthode de Newton : on saute au sommet de la parabole osculatrice">
      <Mafs height={340} viewBox={{ x: [-1, 3], y: [-0.5, 9] }} preserveAspectRatio={false} pan={false}>
        <Coordinates.Cartesian />
        <Plot.OfX y={f} color={Theme.blue} weight={3} />
        <Plot.OfX y={q} color={Theme.red} weight={2} style="dashed" />
        <Line.Segment point1={[x1, 0]} point2={[x1, q(x1)]} style="dashed" color={Theme.red} opacity={0.6} />
        <Point x={x1} y={q(x1)} color={Theme.red} />
        {p.element}
      </Mafs>
      <div className="viz-controls">
        <span className="viz-readout">
          x = {texNum(x0, 6).replace("{,}", ",")} · f′(x) = {texNum(df(x0), 6).replace("{,}", ",")}
        </span>
        <button type="button" className="btn btn-quiet" onClick={step}>
          Sauter au sommet de la parabole (pas de Newton)
        </button>
        <button type="button" className="btn btn-quiet" onClick={reset}>
          Repartir de x = 2,5
        </button>
        <span className="viz-readout">{steps} pas</span>
      </div>
      <div className="viz-formulas">
        <Tex>{"f(x) = e^x - 2x \\qquad \\text{minimum en } x = \\ln 2 \\approx 0{,}693147"}</Tex>
        <Tex>{`x_{\\text{suivant}} = x - \\frac{f'(x)}{f''(x)} \\approx ${texNum(x1, 6)}`}</Tex>
      </div>
    </figure>
  );
}
