import { useState } from "react";
import { Coordinates, Line, Mafs, Plot, Point, Polygon, Theme } from "mafs";
import { Tex } from "../../components/Tex";

type Mode = "continue" | "saut";

const JUMP = 1.3;
const FUNCS: Record<Mode, { f: (x: number) => number; tex: string; y: [number, number] }> = {
  continue: {
    f: (x) => x ** 3 - x - 1,
    tex: "f(x) = x^3 - x - 1",
    y: [-1.8, 5.5],
  },
  saut: {
    f: (x) => (x < JUMP ? x - 1.8 : x - 0.8),
    tex: "f(x) = \\begin{cases} x - 1{,}8 & \\text{si } x < 1{,}3 \\\\ x - 0{,}8 & \\text{si } x \\ge 1{,}3 \\end{cases}",
    y: [-1.2, 1.5],
  },
};

const MAX_STEPS = 30;
const fmt = (n: number, d = 6) => n.toFixed(d).replace(".", ",").replace("-", "−");

export function DichotomyViz() {
  const [mode, setMode] = useState<Mode>("continue");
  const [steps, setSteps] = useState<[number, number][]>([[1, 2]]);
  const { f, tex, y } = FUNCS[mode];

  const [a, b] = steps[steps.length - 1];
  const m = (a + b) / 2;
  const n = steps.length - 1;

  const next = () => {
    if (n >= MAX_STEPS) return;
    setSteps((s) => [...s, f(a) * f(m) <= 0 ? [a, m] : [m, b]]);
  };
  const reset = (to: Mode = mode) => {
    setMode(to);
    setSteps([[1, 2]]);
  };

  const far = 50;
  const signColor = (v: number) => (v < 0 ? Theme.red : Theme.green);
  const shown = steps.slice(-6);
  const offset = steps.length - shown.length;

  return (
    <figure className="viz" aria-label="Méthode de dichotomie pas à pas sur l'intervalle [1, 2]">
      <Mafs key={mode} height={320} viewBox={{ x: [0.9, 2.1], y }} preserveAspectRatio={false} pan={false}>
        <Coordinates.Cartesian subdivisions={2} />
        <Polygon
          points={[
            [a, -far],
            [b, -far],
            [b, far],
            [a, far],
          ]}
          color={Theme.yellow}
          fillOpacity={0.4}
          strokeOpacity={0}
        />
        {mode === "continue" ? (
          <Plot.OfX y={f} color={Theme.blue} weight={3} />
        ) : (
          <>
            <Plot.OfX y={f} domain={[0, JUMP - 1e-9]} color={Theme.blue} weight={3} />
            <Plot.OfX y={f} domain={[JUMP, 3]} color={Theme.blue} weight={3} />
          </>
        )}
        <Line.Segment point1={[m, -far]} point2={[m, far]} style="dashed" color={Theme.foreground} opacity={0.6} />
        <Point x={a} y={f(a)} color={signColor(f(a))} />
        <Point x={b} y={f(b)} color={signColor(f(b))} />
        <Point x={m} y={f(m)} color={Theme.foreground} opacity={0.7} />
      </Mafs>
      <div className="viz-controls">
        <button type="button" className="btn btn-primary" onClick={next} disabled={n >= MAX_STEPS}>
          Étape suivante
        </button>
        <button type="button" className="btn btn-quiet" onClick={() => reset()}>
          Recommencer
        </button>
        <button
          type="button"
          className="btn btn-quiet"
          onClick={() => reset(mode === "continue" ? "saut" : "continue")}
        >
          {mode === "continue" ? "Essayer avec une fonction à saut" : "Revenir à la fonction continue"}
        </button>
      </div>
      <div className="viz-formulas">
        <Tex>{tex}</Tex>
        <span className="viz-readout">
          Étape {n} : [a, b] = [{fmt(a)} ; {fmt(b)}], longueur {fmt(b - a, 8)}, prochain milieu m = {fmt(m)}, f(m) ={" "}
          {fmt(f(m), 4)}
        </span>
        <span className={mode === "continue" ? "viz-verdict-ok" : "viz-verdict-ko"}>
          {mode === "continue"
            ? "f est continue et f(a), f(b) sont de signes contraires : le TVI garantit une racine dans [a, b] à chaque étape."
            : "f(a) et f(b) sont toujours de signes contraires, mais f n'est pas continue : l'intervalle se resserre sur le saut, pas sur une racine."}
        </span>
      </div>
      <table className="value-table">
        <thead>
          <tr>
            <th>étape</th>
            <th>a</th>
            <th>b</th>
            <th>b − a</th>
          </tr>
        </thead>
        <tbody>
          {shown.map(([sa, sb], i) => (
            <tr key={offset + i}>
              <td>{offset + i}</td>
              <td>{fmt(sa)}</td>
              <td>{fmt(sb)}</td>
              <td>{fmt(sb - sa, 8)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </figure>
  );
}
