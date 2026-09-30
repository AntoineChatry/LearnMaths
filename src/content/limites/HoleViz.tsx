import { Circle, Coordinates, Line, Mafs, Plot, Point, Theme, useMovablePoint } from "mafs";

const f = (x: number) => (x * x - 1) / (x - 1);

export function HoleViz() {
  const p = useMovablePoint([-0.5, 0], {
    constrain: ([x]) => [Math.min(3.5, Math.max(-1.5, x)), 0],
  });
  const x = p.x;
  const atHole = Math.abs(x - 1) < 1e-12;
  const y = atHole ? NaN : f(x);

  const zoom = () => p.setPoint([1 + (x - 1) / 10, 0]);
  const reset = () => p.setPoint([-0.5, 0]);

  return (
    <figure className="viz" aria-label="Courbe de f(x) = (x² − 1)/(x − 1), avec un trou en x = 1">
      <Mafs height={320} viewBox={{ x: [-1.5, 3.5], y: [-0.5, 4.5] }} pan={false}>
        <Coordinates.Cartesian subdivisions={2} />
        <Plot.OfX y={f} color={Theme.blue} weight={3} />
        {!atHole && (
          <>
            <Line.Segment point1={[x, 0]} point2={[x, y]} style="dashed" color={Theme.red} />
            <Line.Segment point1={[0, y]} point2={[x, y]} style="dashed" color={Theme.red} />
            <Point x={x} y={y} color={Theme.red} />
          </>
        )}
        <Circle center={[1, 2]} radius={0.07} color={Theme.blue} fillOpacity={0} weight={2} />
        <Point x={1} y={2} color={Theme.background} />
        {p.element}
      </Mafs>
      <div className="viz-controls">
        <span className="viz-readout">
          x = {x.toPrecision(8)}
          {"  →  "}
          {atHole ? "f(1) n'existe pas : division par zéro" : `f(x) = ${y.toPrecision(8)}`}
        </span>
        <button type="button" className="btn btn-quiet" onClick={zoom}>
          Diviser la distance à 1 par 10
        </button>
        <button type="button" className="btn btn-quiet" onClick={reset}>
          Remettre x à −0,5
        </button>
      </div>
    </figure>
  );
}
