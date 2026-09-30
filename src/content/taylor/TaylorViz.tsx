import { useState } from "react";
import { Coordinates, Mafs, Plot, Theme } from "mafs";
import { Tex } from "../../components/Tex";

type Spec = {
  label: string;
  tex: string;
  f: (x: number) => number;
  // Coefficient of x^k in the expansion at 0.
  coef: (k: number) => number;
  // Pieces of the axis where to draw f (avoiding points where it doesn't exist).
  domains: [number, number][];
  // General term in LaTeX.
  series: string;
};

const fact = (k: number): number => (k <= 1 ? 1 : k * fact(k - 1));

const SPECS: Spec[] = [
  {
    label: "exp",
    tex: "e^x",
    f: Math.exp,
    coef: (k) => 1 / fact(k),
    domains: [[-7, 7]],
    series: "1 + x + \\frac{x^2}{2!} + \\frac{x^3}{3!} + \\cdots",
  },
  {
    label: "sin",
    tex: "\\sin x",
    f: Math.sin,
    coef: (k) => (k % 2 === 1 ? (-1) ** ((k - 1) / 2) / fact(k) : 0),
    domains: [[-7, 7]],
    series: "x - \\frac{x^3}{3!} + \\frac{x^5}{5!} - \\cdots",
  },
  {
    label: "cos",
    tex: "\\cos x",
    f: Math.cos,
    coef: (k) => (k % 2 === 0 ? (-1) ** (k / 2) / fact(k) : 0),
    domains: [[-7, 7]],
    series: "1 - \\frac{x^2}{2!} + \\frac{x^4}{4!} - \\cdots",
  },
  {
    label: "ln(1+x)",
    tex: "\\ln(1+x)",
    f: (x) => Math.log(1 + x),
    coef: (k) => (k === 0 ? 0 : (-1) ** (k + 1) / k),
    domains: [[-0.999, 7]],
    series: "x - \\frac{x^2}{2} + \\frac{x^3}{3} - \\cdots",
  },
  {
    label: "1/(1−x)",
    tex: "\\frac{1}{1-x}",
    f: (x) => 1 / (1 - x),
    coef: () => 1,
    domains: [
      [-7, 0.995],
      [1.005, 7],
    ],
    series: "1 + x + x^2 + x^3 + \\cdots",
  },
];

const TOL = 0.01;

// Largest interval around 0, explored in steps of 0.001, where |f − Pₙ| < 0.01.
function validRange(spec: Spec, P: (x: number) => number): [number, number] {
  const ok = (x: number) => {
    const y = spec.f(x);
    return Number.isFinite(y) && Math.abs(y - P(x)) < TOL;
  };
  let hi = 0;
  while (hi < 6 && ok(hi + 0.001)) hi += 0.001;
  let lo = 0;
  while (lo > -6 && ok(lo - 0.001)) lo -= 0.001;
  return [lo, hi];
}

const fmt = (x: number) => x.toFixed(2).replace(".", ",").replace("-", "−");

export function TaylorViz() {
  const [which, setWhich] = useState(0);
  const [n, setN] = useState(1);
  const spec = SPECS[which];

  const coefs = Array.from({ length: n + 1 }, (_, k) => spec.coef(k));
  const P = (x: number) => {
    // Horner's scheme: ((c_n x + c_{n−1}) x + …) x + c_0.
    let s = 0;
    for (let k = n; k >= 0; k--) s = s * x + coefs[k];
    return s;
  };
  const [lo, hi] = validRange(spec, P);

  return (
    <figure className="viz" aria-label="Polynôme de Taylor d'ordre n en 0, comparé à la fonction">
      <Mafs height={360} viewBox={{ x: [-6, 6], y: [-4, 4] }} preserveAspectRatio={false} pan={false}>
        <Coordinates.Cartesian />
        {spec.domains.map((d) => (
          <Plot.OfX key={d.join()} y={spec.f} domain={d} color={Theme.foreground} weight={3} opacity={0.6} />
        ))}
        <Plot.OfX y={P} color={Theme.red} weight={3} />
        <Plot.OfX y={() => -3.8} domain={[lo, hi]} color={Theme.green} weight={6} />
      </Mafs>
      <div className="viz-controls">
        <span>
          {SPECS.map((s, i) => (
            <button
              key={s.label}
              type="button"
              className="btn btn-quiet"
              aria-pressed={i === which}
              style={{ marginRight: "1rem", fontWeight: i === which ? 700 : 400 }}
              onClick={() => setWhich(i)}
            >
              {s.label}
            </button>
          ))}
        </span>
        <label>
          Ordre n
          <input type="range" min={0} max={15} step={1} value={n} onChange={(e) => setN(Number(e.target.value))} />
          <span className="viz-readout">n = {n}</span>
        </label>
        <span className="viz-readout">
          Écart sous 0,01 pour x entre {fmt(lo)} et {fmt(hi)} (trait vert)
        </span>
      </div>
      <div className="viz-formulas">
        <Tex>{`${spec.tex} = ${spec.series}`}</Tex>
      </div>
    </figure>
  );
}
