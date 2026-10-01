import { useState } from "react";
import { Tex } from "../../components/Tex";
import { texNum } from "../../lib/tex";

// Computation graph of MML example 5.14: f(x) = sqrt(x² + exp(x²)) + cos(x² + exp(x²)).
type Name = "x" | "a" | "b" | "c" | "d" | "e" | "f";

const NODES: { name: Name; op: string; def: string; cx: number; cy: number }[] = [
  { name: "x", op: "x", def: "x \\text{ (entrée)}", cx: 40, cy: 120 },
  { name: "a", op: "( )²", def: "a = x^2", cx: 135, cy: 120 },
  { name: "b", op: "exp", def: "b = e^a", cx: 230, cy: 50 },
  { name: "c", op: "+", def: "c = a + b", cx: 325, cy: 120 },
  { name: "d", op: "√", def: "d = \\sqrt c", cx: 420, cy: 50 },
  { name: "e", op: "cos", def: "e = \\cos c", cx: 420, cy: 190 },
  { name: "f", op: "+", def: "f = d + e", cx: 515, cy: 120 },
];
const EDGES: [Name, Name][] = [
  ["x", "a"],
  ["a", "b"],
  ["a", "c"],
  ["b", "c"],
  ["c", "d"],
  ["c", "e"],
  ["d", "f"],
  ["e", "f"],
];
const FORWARD: Name[] = ["a", "b", "c", "d", "e", "f"];
const BACKWARD: Name[] = ["f", "d", "e", "c", "b", "a", "x"];
const STEPS = FORWARD.length + BACKWARD.length;
const R = 24;

const pos = (n: Name) => NODES.find((m) => m.name === n)!;

export function GraphViz() {
  const [x, setX] = useState(0.8);
  const [step, setStep] = useState(0);

  // Forward pass: intermediate variables (MML 5.123-5.128).
  const v: Record<Name, number> = { x, a: 0, b: 0, c: 0, d: 0, e: 0, f: 0 };
  v.a = x * x;
  v.b = Math.exp(v.a);
  v.c = v.a + v.b;
  v.d = Math.sqrt(v.c);
  v.e = Math.cos(v.c);
  v.f = v.d + v.e;
  // Backward pass: adjoints ∂f/∂node (MML 5.139-5.142).
  const g: Record<Name, number> = { f: 1, d: 1, e: 1, c: 0, b: 0, a: 0, x: 0 };
  g.c = g.d / (2 * Math.sqrt(v.c)) + g.e * -Math.sin(v.c);
  g.b = g.c;
  g.a = g.b * Math.exp(v.a) + g.c;
  g.x = g.a * 2 * x;
  // Closed form (MML 5.110).
  const s = x * x + Math.exp(x * x);
  const closed = 2 * x * (1 / (2 * Math.sqrt(s)) - Math.sin(s)) * (1 + Math.exp(x * x));

  const nf = Math.min(step, FORWARD.length);
  const nb = Math.max(0, step - FORWARD.length);
  const hasValue = (n: Name) => n === "x" || FORWARD.indexOf(n) < nf;
  const hasGrad = (n: Name) => BACKWARD.indexOf(n) < nb;
  const current: Name | null = step === 0 ? null : step <= FORWARD.length ? FORWARD[step - 1] : BACKWARD[nb - 1];
  const backward = step > FORWARD.length;
  const t = (n: number) => texNum(n, 3);

  const forwardTex: Record<Name, string> = {
    x: "",
    a: `a = x^2 = ${t(v.a)}`,
    b: `b = e^a = ${t(v.b)}`,
    c: `c = a + b = ${t(v.c)}`,
    d: `d = \\sqrt c = ${t(v.d)}`,
    e: `e = \\cos c = ${t(v.e)}`,
    f: `f = d + e = ${t(v.f)}`,
  };
  const backwardTex: Record<Name, string> = {
    f: "\\frac{\\partial f}{\\partial f} = 1",
    d: "\\frac{\\partial f}{\\partial d} = 1",
    e: "\\frac{\\partial f}{\\partial e} = 1",
    c: `\\frac{\\partial f}{\\partial c} = \\frac{\\partial f}{\\partial d}\\cdot\\frac{1}{2\\sqrt c} + \\frac{\\partial f}{\\partial e}\\cdot(-\\sin c) = ${t(g.c)}`,
    b: `\\frac{\\partial f}{\\partial b} = \\frac{\\partial f}{\\partial c}\\cdot 1 = ${t(g.b)}`,
    a: `\\frac{\\partial f}{\\partial a} = \\frac{\\partial f}{\\partial b}\\cdot e^a + \\frac{\\partial f}{\\partial c}\\cdot 1 = ${t(g.a)}`,
    x: `\\frac{\\partial f}{\\partial x} = \\frac{\\partial f}{\\partial a}\\cdot 2x = ${t(g.x)}`,
  };

  const edgeClass = (from: Name, to: Name) => {
    if (current === null) return "graph-edge";
    if (!backward && to === current) return "graph-edge graph-edge-fwd";
    // Backward: the edges that carry a gradient into the current node, from its children.
    if (backward && from === current && hasGrad(to)) return "graph-edge graph-edge-bwd";
    return "graph-edge";
  };

  return (
    <figure className="viz" aria-label="Graphe de calcul de l'exemple 5.14 de MML : passe avant puis passe arrière">
      <svg className="graph-viz" viewBox="0 0 555 240" role="img" aria-label="Graphe de calcul : x, a, b, c, d, e, f">
        <defs>
          <marker id="graph-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
            <path d="M 0 0 L 10 5 L 0 10 z" className="graph-arrow-head" />
          </marker>
        </defs>
        {EDGES.map(([from, to]) => {
          const p = pos(from);
          const q = pos(to);
          const len = Math.hypot(q.cx - p.cx, q.cy - p.cy);
          const ux = (q.cx - p.cx) / len;
          const uy = (q.cy - p.cy) / len;
          return (
            <line
              key={from + to}
              x1={p.cx + ux * R}
              y1={p.cy + uy * R}
              x2={q.cx - ux * (R + 2)}
              y2={q.cy - uy * (R + 2)}
              className={edgeClass(from, to)}
              markerEnd="url(#graph-arrow)"
            />
          );
        })}
        {NODES.map((n) => (
          <g key={n.name} className={`graph-node${n.name === current ? " graph-node-current" : ""}`}>
            <circle cx={n.cx} cy={n.cy} r={R} />
            <text x={n.cx} y={n.cy} className="graph-op">
              {n.op}
            </text>
            <text x={n.cx} y={n.cy - R - 8} className="graph-name">
              {n.name}
            </text>
          </g>
        ))}
      </svg>
      <div className="viz-controls">
        <label>
          entrée <Tex>x</Tex>
          <input type="range" min={-1.5} max={1.5} step={0.05} value={x} onChange={(e) => setX(Number(e.target.value))} />
          <span className="viz-readout">{texNum(x).replace("{,}", ",")}</span>
        </label>
        <span className="graph-buttons">
          <button type="button" className="btn btn-grade" disabled={step === 0} onClick={() => setStep(step - 1)}>
            Étape précédente
          </button>
          <button type="button" className="btn btn-grade" disabled={step === STEPS} onClick={() => setStep(step + 1)}>
            Étape suivante
          </button>
          <button type="button" className="btn btn-grade" disabled={step === 0} onClick={() => setStep(0)}>
            Recommencer
          </button>
        </span>
      </div>
      <div className="viz-formulas">
        <table className="value-table graph-table">
          <thead>
            <tr>
              <th>nœud</th>
              <th>valeur</th>
              <th>
                <Tex>{"\\partial f / \\partial \\,\\cdot"}</Tex>
              </th>
            </tr>
          </thead>
          <tbody>
            {NODES.map((n) => (
              <tr key={n.name} className={n.name === current ? "graph-row-current" : undefined}>
                <td>
                  <Tex>{n.def}</Tex>
                </td>
                <td>{hasValue(n.name) ? <Tex>{t(v[n.name])}</Tex> : "…"}</td>
                <td>{hasGrad(n.name) ? <Tex>{t(g[n.name])}</Tex> : "…"}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {current !== null && <Tex>{backward ? backwardTex[current] : forwardTex[current]}</Tex>}
        <p className="viz-delta">
          {step === 0
            ? "Clique sur « Étape suivante » : la passe avant calcule les valeurs, dans le sens des flèches."
            : !backward
              ? `Passe avant, étape ${step} sur ${FORWARD.length}.${step === FORWARD.length ? " La valeur de f est connue : on repart de la sortie." : ""}`
              : step < STEPS
                ? `Passe arrière, étape ${nb} sur ${BACKWARD.length} : chaque nœud reçoit le gradient de ses enfants, en rouge.`
                : "Passe arrière terminée. Formule développée de MML (5.110), pour comparer :"}
        </p>
        {step === STEPS && (
          <Tex>{`2x\\left(\\frac{1}{2\\sqrt{x^2 + e^{x^2}}} - \\sin\\big(x^2 + e^{x^2}\\big)\\right)\\big(1 + e^{x^2}\\big) = ${t(closed)}`}</Tex>
        )}
      </div>
    </figure>
  );
}
