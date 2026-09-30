import { Coordinates, Line, Mafs, Plot, Point, Polygon, Theme, useMovablePoint } from "mafs";

const X_MAX = 4.5;
const f = (t: number) => 0.5 * (t - 1) * (t - 3);
// Antiderivative of f that vanishes at 0: F(x) = ∫_0^x f(t) dt.
const F = (x: number) => x ** 3 / 6 - x ** 2 + 1.5 * x;

// Outline of the region between the curve and the axis, positive part (sign = 1) or negative part (sign = -1).
function areaPolygon(x: number, sign: 1 | -1): [number, number][] {
  const steps = 80;
  const pts: [number, number][] = [[0, 0]];
  for (let i = 0; i <= steps; i++) {
    const t = (x * i) / steps;
    const y = f(t);
    pts.push([t, sign === 1 ? Math.max(0, y) : Math.min(0, y)]);
  }
  pts.push([x, 0]);
  return pts;
}

const fmt = (n: number) => n.toFixed(3).replace(".", ",").replace("-", "−");

export function AccumulationViz() {
  const p = useMovablePoint([2, 0], {
    constrain: ([x]) => [Math.min(X_MAX, Math.max(0.01, x)), 0],
    color: Theme.foreground,
  });
  const x = p.x;
  const Fx = F(x);
  const fx = f(x);

  return (
    <figure className="viz" aria-label="Aire accumulée F(x) sous la courbe de f, tracée en direct">
      <Mafs height={340} viewBox={{ x: [-0.3, 4.8], y: [-1, 3] }} preserveAspectRatio={false} pan={false}>
        <Coordinates.Cartesian subdivisions={2} />
        <Polygon points={areaPolygon(x, 1)} color={Theme.green} fillOpacity={0.3} strokeOpacity={0} />
        <Polygon points={areaPolygon(x, -1)} color={Theme.red} fillOpacity={0.3} strokeOpacity={0} />
        <Plot.OfX y={f} domain={[0, X_MAX]} color={Theme.blue} weight={3} />
        <Plot.OfX y={F} domain={[0, x]} color={Theme.foreground} weight={3} />
        <Line.PointSlope point={[x, Fx]} slope={fx} color={Theme.foreground} style="dashed" opacity={0.6} />
        <Line.Segment point1={[x, 0]} point2={[x, Fx]} style="dashed" color={Theme.foreground} opacity={0.4} />
        <Point x={x} y={Fx} color={Theme.foreground} />
        {p.element}
      </Mafs>
      <div className="viz-controls">
        <span className="viz-readout">x = {fmt(x)}</span>
        <span className="viz-readout">F(x) = aire verte − aire rouge = {fmt(Fx)}</span>
        <span className="viz-readout">f(x) = pente de la tangente à F = {fmt(fx)}</span>
      </div>
    </figure>
  );
}
