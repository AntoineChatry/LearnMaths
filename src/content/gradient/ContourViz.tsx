import { useState } from "react";
import { Coordinates, Ellipse, Mafs, Theme, Vector, useMovablePoint } from "mafs";
import { Tex } from "../../components/Tex";
import { texNum } from "../../lib/tex";

// The chapter's elongated bowl: f(x, y) = x² + 5y². Its level lines are ellipses.
const f = (x: number, y: number) => x * x + 5 * y * y;
const grad = (x: number, y: number): [number, number] => [2 * x, 10 * y];
const LEVELS = [1, 4, 9, 16];
// The gradient is drawn scaled down, otherwise it leaves the frame.
const ARROW_SCALE = 0.2;

const snap = (v: number) => Math.round(v * 4) / 4;
const clamp = (v: number, lo: number, hi: number) => Math.max(lo, Math.min(hi, v));

// Level line x² + 5y² = c: ellipse with semi-axes √c and √(c/5).
function Level({ c, highlight = false }: { c: number; highlight?: boolean }) {
  if (c <= 1e-9) return null;
  return (
    <Ellipse
      center={[0, 0]}
      radius={[Math.sqrt(c), Math.sqrt(c / 5)]}
      color={highlight ? Theme.blue : Theme.foreground}
      fillOpacity={0}
      strokeOpacity={highlight ? 1 : 0.3}
      weight={highlight ? 3 : 1.5}
    />
  );
}

type Props = { showGradient?: boolean };

export function ContourViz({ showGradient = false }: Props) {
  const [angle, setAngle] = useState(90);
  const p = useMovablePoint([2, 1], {
    constrain: ([x, y]) => [clamp(snap(x), -4, 4), clamp(snap(y), -2, 2)],
  });
  const value = f(p.x, p.y);
  const [gx, gy] = grad(p.x, p.y);
  const norm = Math.hypot(gx, gy);
  const theta = (angle * Math.PI) / 180;
  const u: [number, number] = [Math.cos(theta), Math.sin(theta)];
  const du = gx * u[0] + gy * u[1];

  let verdict = "";
  let verdictClass = "";
  if (showGradient && norm > 1e-9) {
    const cos = du / norm;
    if (cos > 0.995) {
      verdict = "u pointe dans le sens du gradient : c'est la plus forte montée.";
      verdictClass = "viz-verdict-ok";
    } else if (cos < -0.995) {
      verdict = "u pointe à l'opposé du gradient : c'est la plus forte descente.";
      verdictClass = "viz-verdict-ok";
    } else if (Math.abs(cos) < 0.05) {
      verdict = "u longe la ligne de niveau : f ne varie presque pas.";
      verdictClass = "viz-verdict-ok";
    }
  }

  return (
    <figure className="viz" aria-label="Lignes de niveau de f(x, y) = x² + 5y²">
      <Mafs height={340} viewBox={{ x: [-4.5, 4.5], y: [-2.5, 2.5] }} pan={false}>
        <Coordinates.Cartesian />
        {LEVELS.map((c) => (
          <Level key={c} c={c} />
        ))}
        <Level c={value} highlight />
        {showGradient && norm > 1e-9 && (
          <Vector
            tail={p.point}
            tip={[p.x + ARROW_SCALE * gx, p.y + ARROW_SCALE * gy]}
            color={Theme.red}
            weight={3}
          />
        )}
        {showGradient && <Vector tail={p.point} tip={[p.x + u[0], p.y + u[1]]} color={Theme.green} weight={3} />}
        {p.element}
      </Mafs>
      <div className="viz-controls">
        <span>
          Point <Tex>{`(x, y) = (${texNum(p.x)},\\ ${texNum(p.y)})`}</Tex>
        </span>
        <span className="viz-readout">
          <Tex>{`f(x, y) = ${texNum(value, 4)}`}</Tex>
        </span>
        {showGradient && (
          <label>
            Direction u
            <input type="range" min={0} max={355} step={5} value={angle} onChange={(e) => setAngle(Number(e.target.value))} />
            <span className="viz-readout">{angle}°</span>
          </label>
        )}
      </div>
      <div className="viz-formulas">
        {showGradient ? (
          <>
            <span>
              <span style={{ color: Theme.red }}>
                <Tex>{`\\nabla f(x, y) = (2x,\\ 10y) = (${texNum(gx)},\\ ${texNum(gy)})`}</Tex>
              </span>{" "}
              <Tex>{`\\quad \\|\\nabla f\\| \\approx ${texNum(norm)} \\quad \\text{(flèche réduite à 1/5)}`}</Tex>
            </span>
            <span>
              <span style={{ color: Theme.green }}>
                <Tex>{`u = (${texNum(u[0])},\\ ${texNum(u[1])})`}</Tex>
              </span>{" "}
              <Tex>{`\\qquad D_u f = \\nabla f \\cdot u \\approx ${texNum(du)}`}</Tex>
            </span>
            <p className="viz-delta">
              <span className={verdictClass}>{verdict || "Tourne u : la pente varie entre −‖∇f‖ et +‖∇f‖."}</span>
            </p>
          </>
        ) : (
          <Tex>{`\\text{Ligne de niveau en bleu : } x^2 + 5y^2 = ${texNum(value, 4)}`}</Tex>
        )}
      </div>
    </figure>
  );
}
