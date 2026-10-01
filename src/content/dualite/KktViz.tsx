import { Circle, Coordinates, Mafs, Point, Theme, Vector, useMovablePoint } from "mafs";
import { Tex } from "../../components/Tex";
import { texNum } from "../../lib/tex";

// min ‖x − p‖² subject to g(x) = ‖x‖² − 1 ≤ 0: the projection of p onto the unit disk.
// Inactive (‖p‖ ≤ 1): x* = p, λ = 0. Active: x* = p/‖p‖ and 2(x* − p) + 2λx* = 0 gives λ = ‖p‖ − 1.
type V = [number, number];
const clamp = (v: number, lo: number, hi: number) => Math.max(lo, Math.min(hi, v));
const snap = ([x, y]: V): V => [clamp(Math.round(x * 20) / 20, -2.8, 2.8), clamp(Math.round(y * 20) / 20, -2.2, 2.2)];
const LEVEL_RADII = [0.5, 1, 1.5, 2];
const SCALE = 0.5; // arrows drawn at half their length

export function KktViz() {
  const p = useMovablePoint([1.8, 1.2], { color: Theme.orange, constrain: snap });
  const [px, py] = p.point;
  const r = Math.hypot(px, py);
  const active = r > 1;
  const xs: V = active ? [px / r, py / r] : [px, py];
  const lam = active ? r - 1 : 0;
  const g = xs[0] ** 2 + xs[1] ** 2 - 1;
  const fStar = (xs[0] - px) ** 2 + (xs[1] - py) ** 2;
  // −∇f(x*) = 2(p − x*) and λ∇g(x*) = 2λx*: equal at the optimum (stationarity of the Lagrangian).
  const minusGradF: V = [2 * (px - xs[0]), 2 * (py - xs[1])];

  return (
    <figure className="viz" aria-label="Projection d'un point sur le disque unité et conditions KKT">
      <Mafs height={340} viewBox={{ x: [-3, 3], y: [-2.3, 2.3] }} pan={false}>
        <Coordinates.Cartesian />
        <Circle center={[0, 0]} radius={1} color={Theme.green} fillOpacity={0.12} weight={2.5} />
        {LEVEL_RADII.map((rad) => (
          <Circle key={rad} center={p.point} radius={rad} color={Theme.foreground} fillOpacity={0} strokeOpacity={0.2} weight={1.5} />
        ))}
        {active && (
          <>
            {/* The two arrows are collinear by construction: the thick blue one underneath, the dashed red one on top. */}
            <Vector tail={xs} tip={[xs[0] + SCALE * minusGradF[0], xs[1] + SCALE * minusGradF[1]]} color={Theme.blue} weight={5} opacity={0.6} />
            <Vector tail={xs} tip={[xs[0] + SCALE * 2 * xs[0], xs[1] + SCALE * 2 * xs[1]]} color={Theme.red} weight={2} style="dashed" />
          </>
        )}
        <Point x={xs[0]} y={xs[1]} color={Theme.blue} />
        {p.element}
      </Mafs>
      <div className="viz-formulas">
        <span>
          <Tex>{"\\min \\|x - p\\|^2"}</Tex> &emsp; <Tex>{"\\text{sous } g(x) = \\|x\\|^2 - 1 \\le 0"}</Tex>
        </span>
        <span>
          <Tex>{`x^\\star = (${texNum(xs[0], 2)} ;\\ ${texNum(xs[1], 2)})`}</Tex> &emsp; <Tex>{`f(x^\\star) = ${texNum(fStar, 3)}`}</Tex>
        </span>
        <span style={{ color: active ? Theme.red : Theme.green }}>
          <Tex>{`g(x^\\star) = ${texNum(g, 3)}`}</Tex> &emsp; <Tex>{`\\lambda = ${texNum(lam, 3)}`}</Tex> &emsp;{" "}
          <Tex>{`\\lambda\\, g(x^\\star) = 0`}</Tex> &emsp;{" "}
          <Tex>{active ? "\\text{contrainte active}" : "\\text{contrainte inactive}"}</Tex>
        </span>
        <p className="viz-delta">
          Déplace le point orange <Tex>p</Tex>. Le point bleu est la solution, le point du disque vert le plus proche
          de <Tex>p</Tex>. Si <Tex>p</Tex> est dans le disque, la contrainte ne sert à rien : <Tex>{"x^\\star = p"}</Tex>{" "}
          et <Tex>{"\\lambda = 0"}</Tex>. Sinon, la solution est sur le bord, <Tex>{"\\lambda > 0"}</Tex>, et la flèche
          bleue <Tex>{"-\\nabla f(x^\\star)"}</Tex> est exactement <Tex>\lambda</Tex> fois la flèche rouge{" "}
          <Tex>{"\\nabla g(x^\\star)"}</Tex>, qui pointe hors du disque.
        </p>
      </div>
    </figure>
  );
}
