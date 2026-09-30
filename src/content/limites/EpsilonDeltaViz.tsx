import { useState } from "react";
import { Coordinates, Line, Mafs, Plot, Point, Polygon, Theme } from "mafs";

const A = 2;
const f = (x: number) => 0.5 * x * x + 1;
const L = f(A);

// Largest gap |f(x) − L| on ]a − δ, a + δ[, estimated by sampling.
function worstGap(delta: number): number {
  let worst = 0;
  for (let i = 0; i <= 400; i++) {
    const x = A - delta + (2 * delta * i) / 400;
    worst = Math.max(worst, Math.abs(f(x) - L));
  }
  return worst;
}

const fmt = (n: number) => n.toFixed(3).replace(".", ",");

export function EpsilonDeltaViz() {
  const [eps, setEps] = useState(1);
  const [delta, setDelta] = useState(0.8);
  const [round, setRound] = useState(1);

  const wins = worstGap(delta) < eps;

  const tighten = () => {
    setEps((e) => Math.max(0.02, e / 2));
    setRound((r) => r + 1);
  };
  const restart = () => {
    setEps(1);
    setDelta(0.8);
    setRound(1);
  };

  const far = 50;
  return (
    <figure className="viz" aria-label="Jeu epsilon-delta autour de x = 2 pour f(x) = x²/2 + 1">
      <Mafs height={340} viewBox={{ x: [0, 4], y: [0, 6] }} pan={false}>
        <Coordinates.Cartesian />
        <Polygon
          points={[
            [-far, L - eps],
            [far, L - eps],
            [far, L + eps],
            [-far, L + eps],
          ]}
          color={Theme.yellow}
          fillOpacity={0.45}
          strokeOpacity={0}
        />
        <Polygon
          points={[
            [A - delta, -far],
            [A + delta, -far],
            [A + delta, far],
            [A - delta, far],
          ]}
          color={Theme.blue}
          fillOpacity={0.08}
          strokeStyle="dashed"
          weight={1}
        />
        <Plot.OfX y={f} color={Theme.foreground} opacity={0.35} />
        <Plot.OfX y={f} domain={[A - delta, A + delta]} color={wins ? Theme.green : Theme.red} weight={4} />
        <Line.Segment point1={[A, 0]} point2={[A, L]} style="dashed" color={Theme.foreground} opacity={0.5} />
        <Point x={A} y={L} color={Theme.foreground} />
      </Mafs>
      <div className="viz-controls">
        <span>Manche {round}</span>
        <span className="viz-readout">ε = {fmt(eps)} (choisi par l'adversaire)</span>
        <label>
          Ton δ
          <input
            type="range"
            min={0.005}
            max={1.5}
            step={0.005}
            value={delta}
            onChange={(e) => setDelta(Number(e.target.value))}
          />
          <span className="viz-readout">{fmt(delta)}</span>
        </label>
        <span className={wins ? "viz-verdict-ok" : "viz-verdict-ko"}>
          {wins ? "La courbe reste dans la bande : manche gagnée." : "La courbe sort de la bande : réduis δ."}
        </span>
        {wins ? (
          <button type="button" className="btn btn-quiet" onClick={tighten}>
            L'adversaire divise ε par 2
          </button>
        ) : (
          round > 1 && (
            <button type="button" className="btn btn-quiet" onClick={restart}>
              Recommencer
            </button>
          )
        )}
      </div>
    </figure>
  );
}
