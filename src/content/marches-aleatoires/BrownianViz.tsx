import { Coordinates, Mafs, Plot, Polyline, Text, Theme } from "mafs";
import { useMemo, useState } from "react";
import { Tex } from "../../components/Tex";

const NS = [4, 16, 64, 256, 1024, 4096];
const PATHS = 5;
const COLORS = [Theme.blue, Theme.red, Theme.green, Theme.orange, Theme.violet];

// Seeded generator (mulberry32), so that a draw can be replayed.
function rng(seed: number) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// Simple random walks of n steps of +-1, rescaled as S_[nt] / sqrt(n) on [0, 1] (Donsker).
function walks(n: number, seed: number) {
  const u = rng(seed);
  return Array.from({ length: PATHS }, () => {
    const pts: [number, number][] = [[0, 0]];
    let s = 0;
    for (let k = 1; k <= n; k++) {
      s += u() < 0.5 ? -1 : 1;
      pts.push([k / n, s / Math.sqrt(n)]);
    }
    return pts;
  });
}

export function BrownianViz() {
  const [ni, setNi] = useState(1);
  const [seed, setSeed] = useState(7);
  const n = NS[ni];
  const paths = useMemo(() => walks(n, seed), [n, seed]);

  return (
    <figure className="viz" aria-label="Marches aléatoires remises à l'échelle vers le mouvement brownien">
      <Mafs height={300} viewBox={{ x: [-0.12, 1.06], y: [-4.6, 4.2], padding: 0 }} preserveAspectRatio={false} pan={false}>
        <Coordinates.Cartesian xAxis={{ lines: 0.25, labels: false }} yAxis={{ lines: 1, labels: false }} />
        {/* time labels at the bottom, where the paths rarely go */}
        {[0.25, 0.5, 0.75, 1].map((v) => (
          <Text key={v} x={v} y={-4.25} size={14}>
            {String(v).replace(".", ",")}
          </Text>
        ))}
        {[-3, -2, -1, 1, 2, 3].map((v) => (
          <Text key={v} x={-0.02} y={v} attach="w" size={14}>
            {String(v).replace("-", "−")}
          </Text>
        ))}
        <Plot.OfX y={(t) => 2 * Math.sqrt(t)} domain={[0, 1]} color={Theme.foreground} opacity={0.5} style="dashed" />
        <Plot.OfX y={(t) => -2 * Math.sqrt(t)} domain={[0, 1]} color={Theme.foreground} opacity={0.5} style="dashed" />
        {paths.map((pts, i) => (
          <Polyline key={i} points={pts} color={COLORS[i]} weight={n > 256 ? 1.2 : 2} />
        ))}
      </Mafs>
      <div className="viz-controls">
        <label>
          <span>
            pas <Tex>n</Tex>
          </span>
          <input type="range" min={0} max={NS.length - 1} step={1} value={ni} onChange={(e) => setNi(Number(e.target.value))} />
          <span className="viz-readout">{n.toLocaleString("fr-FR")}</span>
        </label>
        <button type="button" className="btn" onClick={() => setSeed((s) => s + 1)}>
          relancer
        </button>
      </div>
      <div className="viz-formulas">
        <span style={{ display: "flex", flexWrap: "wrap", columnGap: "1.5em", alignItems: "baseline" }}>
          <Tex>{`t \\mapsto \\frac{S_{\\lfloor ${n} t \\rfloor}}{\\sqrt{${n}}}`}</Tex>
          <Tex>{`\\text{pas en temps } \\tfrac1{${n}}`}</Tex>
          <Tex>{`\\text{pas en espace } \\tfrac{1}{\\sqrt{${n}}}`}</Tex>
        </span>
        <p className="viz-delta">
          Cinq marches de <Tex>n</Tex> pas de ±1, remises à l'échelle : le temps est divisé par <Tex>n</Tex>, l'espace
          par <Tex>{"\\sqrt n"}</Tex>. Les tirets sont <Tex>{"\\pm 2\\sqrt t"}</Tex>, entre lesquels un mouvement
          brownien se trouve avec probabilité 0,95 à chaque instant. Quand <Tex>n</Tex> grandit, les marches deviennent
          des courbes continues mais très irrégulières.
        </p>
      </div>
    </figure>
  );
}
