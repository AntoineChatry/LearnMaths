import { useState } from "react";
import { Coordinates, Line, Mafs, Plot, Point, Theme, useMovablePoint } from "mafs";
import { Tex } from "../../components/Tex";

type Fn = {
  label: string;
  tex: string;
  dtex: string;
  f: (x: number) => number;
  df: (x: number) => number;
  min: number;
  max: number;
  view: { x: [number, number]; y: [number, number] };
  start: number;
};

const FUNCS: Record<string, Fn> = {
  carre: {
    label: "x²",
    tex: "f(x) = x^2",
    dtex: "f'(x) = 2x",
    f: (x) => x * x,
    df: (x) => 2 * x,
    min: -2.4,
    max: 2.4,
    view: { x: [-3, 3], y: [-1.5, 6] },
    start: 1,
  },
  sin: {
    label: "sin x",
    tex: "f(x) = \\sin x",
    dtex: "f'(x) = \\cos x",
    f: Math.sin,
    df: Math.cos,
    min: -3.1,
    max: 3.1,
    view: { x: [-3.5, 3.5], y: [-2, 2] },
    start: 0.5,
  },
  exp: {
    label: "eˣ",
    tex: "f(x) = e^x",
    dtex: "f'(x) = e^x",
    f: Math.exp,
    df: Math.exp,
    min: -2.5,
    max: 1.6,
    view: { x: [-3, 2.5], y: [-1, 5.5] },
    start: 0,
  },
  ln: {
    label: "ln x",
    tex: "f(x) = \\ln x",
    dtex: "f'(x) = \\frac{1}{x}",
    f: Math.log,
    df: (x) => 1 / x,
    min: 0.2,
    max: 4.5,
    view: { x: [-0.5, 5], y: [-2.5, 2.5] },
    start: 1,
  },
};

const fmt = (n: number) => n.toFixed(3).replace(".", ",").replace("-", "−");

export function TangentViz() {
  const [name, setName] = useState("carre");
  const [h, setH] = useState(1);
  const fn = FUNCS[name];

  const p = useMovablePoint([fn.start, 0], {
    constrain: ([x]) => [Math.min(fn.max, Math.max(fn.min, x)), 0],
  });
  const a = Math.min(fn.max, Math.max(fn.min, p.x));
  const fa = fn.f(a);
  const secantSlope = (fn.f(a + h) - fa) / h;
  const tangentSlope = fn.df(a);

  const choose = (key: string) => {
    setName(key);
    p.setPoint([FUNCS[key].start, 0]);
  };

  return (
    <figure className="viz" aria-label="Tangente et sécante à une courbe en un point mobile">
      <Mafs key={name} height={340} viewBox={fn.view} preserveAspectRatio={false} pan={false}>
        <Coordinates.Cartesian />
        <Plot.OfX
          y={fn.f}
          domain={name === "ln" ? [0.01, fn.view.x[1]] : undefined}
          color={Theme.blue}
          weight={3}
        />
        <Line.PointSlope point={[a, fa]} slope={secantSlope} color={Theme.foreground} opacity={0.4} style="dashed" />
        <Line.PointSlope point={[a, fa]} slope={tangentSlope} color={Theme.red} weight={2} />
        <Line.Segment point1={[a, 0]} point2={[a, fa]} style="dashed" color={Theme.foreground} opacity={0.35} />
        <Point x={a + h} y={fn.f(a + h)} color={Theme.foreground} opacity={0.6} />
        <Point x={a} y={fa} color={Theme.red} />
        {p.element}
      </Mafs>
      <div className="viz-controls">
        {Object.entries(FUNCS).map(([key, f]) => (
          <button
            key={key}
            type="button"
            className={key === name ? "btn btn-primary" : "btn btn-quiet"}
            onClick={() => choose(key)}
          >
            {f.label}
          </button>
        ))}
        <label>
          h
          <input type="range" min={0.01} max={1.5} step={0.01} value={h} onChange={(e) => setH(Number(e.target.value))} />
          <span className="viz-readout">{fmt(h)}</span>
        </label>
      </div>
      <div className="viz-formulas">
        <Tex>{`${fn.tex} \\qquad ${fn.dtex}`}</Tex>
        <span className="viz-readout">
          a = {fmt(a)} · pente de la sécante (pointillés) = {fmt(secantSlope)} · pente de la tangente f′(a) ={" "}
          {fmt(tangentSlope)}
        </span>
      </div>
    </figure>
  );
}
