import { Coordinates, Line, Mafs, Plot, Polyline, Theme } from "mafs";
import { useMemo, useState } from "react";
import { Tex } from "../../components/Tex";

const M_MAX = 60;
const Y_MAX = 62;
const SUP: Record<string, string> = { "0": "⁰", "1": "¹", "2": "²", "3": "³", "4": "⁴", "5": "⁵", "6": "⁶", "7": "⁷", "8": "⁸", "9": "⁹" };
const powLabel = (v: number) => (v === 0 ? "1" : `2${[...String(v)].map((c) => SUP[c]).join("")}`);

// Sauer's bound sum_{i<=d} C(m, i), as a float (exact up to 2^53).
function sauer(m: number, d: number) {
  let c = 1;
  let s = 1;
  for (let i = 1; i <= Math.min(d, m); i++) {
    c = (c * (m - i + 1)) / i;
    s += c;
  }
  return s;
}

// Integer below 10^6 written in full, otherwise mantissa × 10^k.
function bigTex(n: number) {
  if (n < 1e6) return Math.round(n).toLocaleString("fr-FR").replace(/ | /g, "\\,");
  const k = Math.floor(Math.log10(n));
  return `{${(n / 10 ** k).toFixed(1).replace(".", "{,}")} \\times 10^{${k}}}`; // braces: no line break
}

export function GrowthViz() {
  const [d, setD] = useState(3);
  const [m, setM] = useState(20);
  const curve = useMemo(
    () => Array.from({ length: M_MAX }, (_, i) => [i + 1, Math.log2(sauer(i + 1, d))] as [number, number]),
    [d],
  );
  const s = sauer(m, d);

  return (
    <figure className="viz" aria-label="Fonction de croissance : 2 puissance m contre la borne de Sauer">
      <Mafs height={280} viewBox={{ x: [-2, M_MAX + 3], y: [-7, Y_MAX], padding: 0 }} preserveAspectRatio={false} pan={false}>
        <Coordinates.Cartesian xAxis={{ lines: 10, labels: (v) => String(v) }} yAxis={{ lines: 10, labels: powLabel }} />
        <Plot.OfX y={(x) => Math.min(x, Y_MAX)} domain={[0, M_MAX]} color={Theme.foreground} style="dashed" />
        <Plot.OfX y={(x) => Math.min(d * Math.log2((Math.E * x) / d), Y_MAX)} domain={[d, M_MAX]} color={Theme.blue} weight={2} />
        <Polyline points={curve} color={Theme.red} weight={3} fillOpacity={0} />
        <Line.Segment point1={[m, 0]} point2={[m, Y_MAX - 2]} color={Theme.foreground} opacity={0.4} />
      </Mafs>
      <div className="viz-controls">
        <label>
          <span>
            dimension VC <Tex>d</Tex>
          </span>
          <input type="range" min={1} max={10} step={1} value={d} onChange={(e) => setD(Number(e.target.value))} />
          <span className="viz-readout">{d}</span>
        </label>
        <label>
          <span>
            points <Tex>m</Tex>
          </span>
          <input type="range" min={1} max={M_MAX} step={1} value={m} onChange={(e) => setM(Number(e.target.value))} />
          <span className="viz-readout">{m}</span>
        </label>
      </div>
      <div className="mi-body">
        <table className="mi-table mode-table">
          <tbody>
            <tr>
              <th>
                <span className="kl-swatch" style={{ background: "var(--text)" }} /> étiquetages possibles{" "}
                <Tex>{"2^m"}</Tex>
              </th>
              <td className="viz-readout">
                <Tex>{bigTex(2 ** m)}</Tex>
              </td>
            </tr>
            <tr>
              <th>
                <span className="kl-swatch" style={{ background: "var(--margin)" }} /> borne de Sauer
              </th>
              <td className="viz-readout">
                <Tex>{bigTex(s)}</Tex>
              </td>
            </tr>
            <tr>
              <th>
                <span className="kl-swatch" style={{ background: "var(--ink)" }} /> <Tex>{"(em/d)^d"}</Tex>
              </th>
              <td className="viz-readout">{m >= d ? <Tex>{bigTex(((Math.E * m) / d) ** d)}</Tex> : "—"}</td>
            </tr>
          </tbody>
        </table>
        <p className="viz-delta">
          Axe vertical en échelle logarithmique. Tant que <Tex>{"m \\le d"}</Tex>, la borne de Sauer vaut{" "}
          <Tex>{"2^m"}</Tex> : la classe peut tout réaliser. Au-delà, elle ne croît plus que comme un polynôme de
          degré <Tex>d</Tex>, et décroche de l'exponentielle.
        </p>
      </div>
    </figure>
  );
}
