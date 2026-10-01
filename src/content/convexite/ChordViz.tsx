import { useState } from "react";
import { Coordinates, Line, Mafs, Plot, Point, Theme, useMovablePoint } from "mafs";
import { Tex } from "../../components/Tex";
import { texNum } from "../../lib/tex";

type Fn = { label: string; tex: string; f: (x: number) => number; df: (x: number) => number | null; convex: boolean };

const FNS: Fn[] = [
  { label: "x²/2 (convexe)", tex: "\\tfrac12 x^2", f: (x) => x * x / 2, df: (x) => x, convex: true },
  {
    label: "log(eˣ + e⁻ˣ) (convexe)",
    tex: "\\log(e^x + e^{-x})",
    f: (x) => Math.log(Math.exp(x) + Math.exp(-x)),
    df: (x) => Math.tanh(x),
    convex: true,
  },
  // |x| is not differentiable at 0: no tangent there.
  { label: "|x| (convexe)", tex: "|x|", f: (x) => Math.abs(x), df: (x) => (x === 0 ? null : Math.sign(x)), convex: true },
  { label: "x⁴/8 − x² (non convexe)", tex: "\\tfrac18 x^4 - x^2", f: (x) => x ** 4 / 8 - x * x, df: (x) => x ** 3 / 2 - 2 * x, convex: false },
];
const XMIN = -3;
const XMAX = 3;
const clamp = (v: number, lo: number, hi: number) => Math.max(lo, Math.min(hi, v));
const onAxis = ([x]: [number, number]): [number, number] => [clamp(Math.round(x * 10) / 10, XMIN, XMAX), 0];

export function ChordViz() {
  const [fi, setFi] = useState(0);
  const [theta, setTheta] = useState(0.3);
  const [tangent, setTangent] = useState(false);
  const a = useMovablePoint([-2, 0], { color: Theme.orange, constrain: onAxis });
  const b = useMovablePoint([2.5, 0], { color: Theme.orange, constrain: onAxis });
  const { f, df, tex } = FNS[fi];
  const x = a.x;
  const y = b.x;
  const z = theta * x + (1 - theta) * y;
  const chord = theta * f(x) + (1 - theta) * f(y);
  const below = f(z) <= chord + 1e-12;
  const slope = df(x);
  const tan = (t: number) => f(x) + (slope ?? 0) * (t - x);
  // The tangent is a global underestimator iff it stays below the graph on the whole window.
  let tanBelow = true;
  for (let t = XMIN; t <= XMAX + 1e-9; t += 0.01) if (tan(t) > f(t) + 1e-9) tanBelow = false;

  return (
    <figure className="viz" aria-label="Corde et tangente d'une fonction, convexe ou non">
      <Mafs height={320} viewBox={{ x: [XMIN, XMAX], y: [-2.5, 5] }} preserveAspectRatio={false} pan={false}>
        <Coordinates.Cartesian />
        <Plot.OfX y={f} domain={[XMIN - 0.5, XMAX + 0.5]} color={Theme.blue} weight={3} />
        {tangent && slope !== null && (
          <Plot.OfX y={tan} domain={[XMIN - 0.5, XMAX + 0.5]} color={Theme.green} style="dashed" weight={2} />
        )}
        <Line.Segment point1={[x, f(x)]} point2={[y, f(y)]} color={Theme.foreground} weight={2} />
        <Line.Segment point1={[z, f(z)]} point2={[z, chord]} color={below ? Theme.green : Theme.red} weight={4} />
        <Point x={z} y={chord} color={Theme.foreground} />
        <Point x={z} y={f(z)} color={Theme.blue} />
        <Point x={x} y={f(x)} color={Theme.orange} opacity={0.6} />
        <Point x={y} y={f(y)} color={Theme.orange} opacity={0.6} />
        {a.element}
        {b.element}
      </Mafs>
      <div className="viz-controls">
        <label>
          <span>fonction</span>
          <select value={fi} onChange={(e) => setFi(Number(e.target.value))}>
            {FNS.map((fn, i) => (
              <option key={fn.label} value={i}>
                {fn.label}
              </option>
            ))}
          </select>
        </label>
        <label>
          <span>
            <Tex>\theta</Tex>
          </span>
          <input type="range" min={0} max={1} step={0.01} value={theta} onChange={(e) => setTheta(Number(e.target.value))} />
          <span className="viz-readout">{texNum(theta).replace("{,}", ",")}</span>
        </label>
        <label>
          <input type="checkbox" checked={tangent} onChange={(e) => setTangent(e.target.checked)} />
          <span>
            tangente en <Tex>x</Tex>
          </span>
        </label>
      </div>
      <div className="viz-formulas">
        <span>
          <Tex>{`f(x) = ${tex}`}</Tex> &emsp; <Tex>{`x = ${texNum(x, 1)}`}</Tex> &emsp; <Tex>{`y = ${texNum(y, 1)}`}</Tex>
        </span>
        <span style={{ color: below ? Theme.green : Theme.red }}>
          <Tex>{`f(\\theta x + (1-\\theta) y) = ${texNum(f(z), 3)}`}</Tex> &emsp;{" "}
          <Tex>{below ? "\\le" : ">"}</Tex> &emsp; <Tex>{`\\theta f(x) + (1-\\theta) f(y) = ${texNum(chord, 3)}`}</Tex>
        </span>
        {tangent && (
          <span style={{ color: Theme.green }}>
            {slope === null ? (
              <Tex>{"\\text{pas de tangente en } x = 0 \\text{ : } |x| \\text{ n'y est pas dérivable}"}</Tex>
            ) : (
              <Tex>{tanBelow ? "\\text{la tangente reste sous le graphe}" : "\\text{la tangente passe au-dessus du graphe}"}</Tex>
            )}
          </span>
        )}
        <p className="viz-delta">
          Déplace les deux points orange sur l'axe : ce sont <Tex>x</Tex> et <Tex>y</Tex>. Le segment noir est la corde,
          le point bleu est <Tex>{"f(\\theta x + (1-\\theta)y)"}</Tex> et le point noir la corde au même endroit. Le
          trait vertical est vert si la corde est au-dessus du graphe, rouge sinon. Une fonction est convexe quand il
          reste vert pour tous les choix.
        </p>
      </div>
    </figure>
  );
}
