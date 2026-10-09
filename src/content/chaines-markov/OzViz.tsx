import { Coordinates, Mafs, Polygon, Theme } from "mafs";
import { useState } from "react";
import { Tex } from "../../components/Tex";

// Land of Oz chain (Grinstead and Snell, example 11.1): Rain, Nice, Snow.
const P = [
  [1 / 2, 1 / 4, 1 / 4],
  [1 / 2, 0, 1 / 2],
  [1 / 4, 1 / 4, 1 / 2],
];
const STATES = ["Pluie", "Beau", "Neige"];
const STARTS: { label: string; u: number[] }[] = [
  { label: "Pluie", u: [1, 0, 0] },
  { label: "Beau", u: [0, 1, 0] },
  { label: "Neige", u: [0, 0, 1] },
  { label: "au hasard", u: [1 / 3, 1 / 3, 1 / 3] },
];
const N_MAX = 10;
const HALF = 0.3; // half-width of a bar

const step = (u: number[]) => [0, 1, 2].map((j) => u.reduce((s, ui, i) => s + ui * P[i][j], 0));
const fmt = (x: number) => x.toFixed(3).replace(".", "{,}");

// The law of X_n is u P^n: bars for the three states, a slider for n and a choice of starting law.
export function OzViz() {
  const [si, setSi] = useState(1);
  const [n, setN] = useState(0);
  let u = STARTS[si].u;
  for (let t = 0; t < n; t++) u = step(u);

  return (
    <figure className="viz" aria-label="Loi de la météo au pays d'Oz après n jours">
      <Mafs height={240} viewBox={{ x: [-0.45, 3.6], y: [-0.14, 1.08], padding: 0 }} preserveAspectRatio={false} pan={false}>
        <Coordinates.Cartesian
          xAxis={{ lines: 1, labels: (v) => STATES[v - 1] ?? "" }}
          yAxis={{ lines: 0.25, labels: (v) => (v > 0 && v <= 1 ? String(v).replace(".", ",") : "") }}
        />
        {u.map((p, i) => (
          <Polygon
            key={i}
            points={[
              [i + 1 - HALF, 0],
              [i + 1 + HALF, 0],
              [i + 1 + HALF, p],
              [i + 1 - HALF, p],
            ]}
            color={Theme.blue}
            fillOpacity={0.4}
          />
        ))}
      </Mafs>
      <div className="viz-controls">
        <span>départ :</span>
        {STARTS.map((s, i) => (
          <button key={s.label} type="button" className={i === si ? "btn btn-primary" : "btn"} onClick={() => setSi(i)}>
            {s.label}
          </button>
        ))}
      </div>
      <div className="viz-controls">
        <label>
          <span>
            jour <Tex>n</Tex>
          </span>
          <input type="range" min={0} max={N_MAX} step={1} value={n} onChange={(e) => setN(Number(e.target.value))} />
          <span className="viz-readout">{n}</span>
        </label>
      </div>
      <div className="viz-formulas">
        <Tex>{`u^{(${n})} = u\\,P^{${n}} \\approx (${u.map(fmt).join(";\\ ")})`}</Tex>
        <p className="viz-delta">
          Probabilité de chaque temps au jour <Tex>n</Tex>, pour le point de départ choisi. Quel que soit le départ,
          les barres se rapprochent de (0,4 ; 0,2 ; 0,4) en quelques jours.
        </p>
      </div>
    </figure>
  );
}
