import { useState } from "react";
import { Coordinates, Line, Mafs, Point, Polygon, Theme } from "mafs";

const L = 1;
const u = (n: number) => L + (2 * (-1) ** n) / n;
const SHOWN = 120;
const indices = Array.from({ length: SHOWN }, (_, i) => i + 1);

// Index N wins if all terms from N onward stay within the band (checked well beyond the screen).
function allInside(N: number, eps: number): boolean {
  for (let n = N; n <= 5000; n++) {
    if (Math.abs(u(n) - L) >= eps) return false;
  }
  return true;
}

const fmt = (x: number) => x.toFixed(4).replace(".", ",");

export function EpsilonNViz() {
  const [eps, setEps] = useState(0.5);
  const [N, setN] = useState(3);
  const [round, setRound] = useState(1);

  const wins = allInside(N, eps);

  const tighten = () => {
    setEps((e) => Math.max(1 / 32, e / 2));
    setRound((r) => r + 1);
  };
  const restart = () => {
    setEps(0.5);
    setN(3);
    setRound(1);
  };

  const far = 1000;
  return (
    <figure className="viz" aria-label="Jeu epsilon-N pour la suite u_n = 1 + 2(-1)^n / n">
      <Mafs height={320} viewBox={{ x: [0, SHOWN], y: [-1.2, 3.2] }} preserveAspectRatio={false} pan={false}>
        <Coordinates.Cartesian xAxis={{ lines: 10 }} yAxis={{ lines: 1 }} />
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
        <Line.Segment point1={[N, -far]} point2={[N, far]} style="dashed" color={Theme.blue} />
        {indices.map((n) => {
          const inside = Math.abs(u(n) - L) < eps;
          const color = n < N ? Theme.foreground : inside ? Theme.green : Theme.red;
          return <Point key={n} x={n} y={u(n)} color={color} opacity={n < N ? 0.35 : 1} svgCircleProps={{ r: 3 }} />;
        })}
      </Mafs>
      <div className="viz-controls">
        <span>Manche {round}</span>
        <span className="viz-readout">ε = {fmt(eps)} (choisi par l'adversaire)</span>
        <label>
          Ton rang N
          <input type="range" min={1} max={SHOWN} step={1} value={N} onChange={(e) => setN(Number(e.target.value))} />
          <span className="viz-readout">N = {N}</span>
        </label>
        <span className={wins ? "viz-verdict-ok" : "viz-verdict-ko"}>
          {wins
            ? "Tous les termes à partir de N restent dans la bande : manche gagnée."
            : "Un terme d'indice ≥ N sort de la bande : recule N vers la droite."}
        </span>
        {wins ? (
          eps > 1 / 32 && (
            <button type="button" className="btn btn-quiet" onClick={tighten}>
              L'adversaire divise ε par 2
            </button>
          )
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
