import { Circle, Coordinates, Mafs, Polygon, Theme, Vector, useMovablePoint } from "mafs";
import { useState } from "react";
import { Tex } from "../../components/Tex";
import { texNum } from "../../lib/tex";

const R_MIN = 0.3;
const R_MAX = 4;
const SAMPLES = 24;

const polar = (r: number, t: number): [number, number] => [r * Math.cos(t), r * Math.sin(t)];

// Polar coordinates f(r, θ) = (r cos θ, r sin θ): image of the small rectangle
// [r0, r0 + h] × [θ0, θ0 + h], next to its linearization by the Jacobian at (r0, θ0).
export function PolarViz() {
  const [h, setH] = useState(0.6);
  const p = useMovablePoint([2.5, 2], {
    // Upper half-plane only, so the frame can zoom on it.
    constrain: ([x, yRaw]) => {
      const y = Math.max(0, yRaw);
      const r = Math.hypot(x, y);
      if (r < 1e-9) return [R_MIN, 0];
      const s = Math.min(Math.max(r, R_MIN), R_MAX) / r;
      return [x * s, y * s];
    },
  });
  const r0 = Math.hypot(p.x, p.y);
  const t0 = Math.atan2(p.y, p.x);

  // Boundary of the curved patch: inner arc, outer arc (reversed), joined by two radial segments.
  const inner = Array.from({ length: SAMPLES + 1 }, (_, i) => polar(r0, t0 + (h * i) / SAMPLES));
  const outer = Array.from({ length: SAMPLES + 1 }, (_, i) => polar(r0 + h, t0 + (h * (SAMPLES - i)) / SAMPLES));
  const patch = [...inner, ...outer];

  // Jacobian columns at (r0, θ0): ∂f/∂r = (cos θ, sin θ) and ∂f/∂θ = (−r sin θ, r cos θ).
  const dr: [number, number] = [h * Math.cos(t0), h * Math.sin(t0)];
  const dt: [number, number] = [-h * r0 * Math.sin(t0), h * r0 * Math.cos(t0)];
  const [px, py] = [p.x, p.y];
  const para: [number, number][] = [
    [px, py],
    [px + dr[0], py + dr[1]],
    [px + dr[0] + dt[0], py + dr[1] + dt[1]],
    [px + dt[0], py + dt[1]],
  ];

  const exact = h * ((r0 + h) ** 2 - r0 ** 2) / 2;
  const linear = r0 * h * h;

  return (
    <figure className="viz" aria-label="Coordonnées polaires : image d'un petit rectangle et son approximation par la jacobienne">
      <Mafs height={360} viewBox={{ x: [-5.2, 5.2], y: [-0.3, 5.3] }} pan={false}>
        <Coordinates.Polar lines={1} />
        <Circle center={[0, 0]} radius={r0} color={Theme.foreground} fillOpacity={0} strokeOpacity={0.25} weight={1} />
        <Polygon points={patch} color={Theme.red} fillOpacity={0.25} weight={2} />
        <Polygon points={para} color={Theme.blue} fillOpacity={0.1} weight={2} strokeStyle="dashed" />
        <Vector tail={[px, py]} tip={[px + dr[0], py + dr[1]]} color={Theme.green} weight={2} />
        <Vector tail={[px, py]} tip={[px + dt[0], py + dt[1]]} color={Theme.green} weight={2} />
        {p.element}
      </Mafs>
      <div className="viz-controls">
        <span>
          <Tex>{`r_0 = ${texNum(r0)} \\qquad \\theta_0 = ${texNum(t0)}\\ \\text{rad}`}</Tex>
        </span>
        <label>
          côté <Tex>h</Tex>
          <input type="range" min={0.05} max={1} step={0.05} value={h} onChange={(e) => setH(Number(e.target.value))} />
          <span className="viz-readout">{String(h).replace(".", ",")}</span>
        </label>
      </div>
      <div className="viz-formulas">
        <Tex>{`\\text{aire de l'image (rouge)} = ${texNum(exact, 4)} \\qquad |\\det J|\\,h^2 = r_0 h^2 = ${texNum(linear, 4)}`}</Tex>
        <Tex>{`\\frac{\\text{aire de l'image}}{h^2} = ${texNum(exact / (h * h), 3)} \\quad\\longrightarrow\\quad r_0 = ${texNum(r0, 3)} \\text{ quand } h \\to 0`}</Tex>
        <p className="viz-delta">
          En rouge, l'image exacte du petit rectangle de côté h en (r, θ). En pointillés bleus, le parallélogramme
          engendré par les colonnes de la jacobienne (flèches vertes), multipliées par h. Plus h est petit, plus les
          deux se confondent. Éloigne le point de l'origine : le même rectangle en (r, θ) couvre plus de surface.
        </p>
      </div>
    </figure>
  );
}
