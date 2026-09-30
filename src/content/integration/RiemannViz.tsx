import { useState } from "react";
import { Coordinates, Mafs, Plot, Polygon, Theme } from "mafs";

const A = 0;
const B = 3;
const f = (x: number) => (x * x) / 4 + 1;
// ∫_0^3 (x²/4 + 1) dx = 27/12 + 3
const EXACT = 5.25;

type Method = "gauche" | "droite" | "milieu";

const METHODS: { id: Method; label: string }[] = [
  { id: "gauche", label: "À gauche" },
  { id: "droite", label: "À droite" },
  { id: "milieu", label: "Au milieu" },
];

// Abscissa where the height of rectangle no. i is read.
function samplePoint(method: Method, i: number, h: number): number {
  if (method === "gauche") return A + i * h;
  if (method === "droite") return A + (i + 1) * h;
  return A + (i + 0.5) * h;
}

const fmt = (n: number, digits = 5) => n.toFixed(digits).replace(".", ",").replace("-", "−");

export function RiemannViz() {
  const [n, setN] = useState(4);
  const [method, setMethod] = useState<Method>("gauche");

  const h = (B - A) / n;
  const rects = Array.from({ length: n }, (_, i) => {
    const x0 = A + i * h;
    return { x0, height: f(samplePoint(method, i, h)) };
  });
  const sum = rects.reduce((s, r) => s + r.height * h, 0);
  const error = sum - EXACT;
  // The left/right error decreases like 1/n, the midpoint error like 1/n²: it is displayed multiplied accordingly.
  const scaled = method === "milieu" ? error * n * n : error * n;

  return (
    <figure className="viz" aria-label="Somme de Riemann de f(x) = x²/4 + 1 sur [0, 3]">
      <Mafs height={320} viewBox={{ x: [-0.3, 3.4], y: [-0.4, 3.6] }} preserveAspectRatio={false} pan={false}>
        <Coordinates.Cartesian subdivisions={2} />
        {rects.map((r) => (
          <Polygon
            key={r.x0}
            points={[
              [r.x0, 0],
              [r.x0 + h, 0],
              [r.x0 + h, r.height],
              [r.x0, r.height],
            ]}
            color={Theme.blue}
            fillOpacity={0.18}
            weight={1.5}
          />
        ))}
        <Plot.OfX y={f} domain={[-0.3, 3.4]} color={Theme.red} weight={3} />
      </Mafs>
      <div className="viz-controls">
        <label>
          Nombre de rectangles
          <input type="range" min={1} max={60} step={1} value={n} onChange={(e) => setN(Number(e.target.value))} />
          <span className="viz-readout">n = {n}</span>
        </label>
        {METHODS.map((m) => (
          <button
            key={m.id}
            type="button"
            className={m.id === method ? "btn btn-primary" : "btn btn-quiet"}
            aria-pressed={m.id === method}
            onClick={() => setMethod(m.id)}
          >
            {m.label}
          </button>
        ))}
      </div>
      <div className="viz-controls">
        <span className="viz-readout">Somme = {fmt(sum)}</span>
        <span className="viz-readout">Valeur exacte = 5,25</span>
        <span className={Math.abs(error) < 0.01 ? "viz-verdict-ok" : "viz-verdict-ko"}>Erreur = {fmt(error)}</span>
        <span className="viz-readout">
          {method === "milieu" ? "Erreur × n²" : "Erreur × n"} = {fmt(scaled, 3)}
        </span>
      </div>
    </figure>
  );
}
