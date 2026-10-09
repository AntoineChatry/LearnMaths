import { useState } from "react";
import { Tex } from "../../components/Tex";
import { texNum } from "../../lib/tex";

const EPS = [0, 0.01, 0.05, 0.1, 0.15, 0.2, 0.3, 0.4, 0.5];
const SCALE = 2; // bits for the full width: H(X, Y) = 1 + H2(eps) never exceeds 2

const h2 = (e: number) => (e === 0 || e === 1 ? 0 : -e * Math.log2(e) - (1 - e) * Math.log2(1 - e));
const pct = (bits: number) => `${(100 * bits) / SCALE}%`;
const fr = (x: number, digits: number) => texNum(x, digits).replace("{,}", ",");

// Binary symmetric channel with a uniform input bit: MacKay's figure 8.1 for H(X), H(Y), H(X, Y) and I(X; Y).
export function ChannelViz() {
  const [ei, setEi] = useState(4); // eps = 0.15, MacKay's example
  const e = EPS[ei];
  const noise = h2(e); // H(Y | X) = H(X | Y)
  const joint = 1 + noise;
  const info = 1 - noise;
  const cells = [
    [(1 - e) / 2, e / 2],
    [e / 2, (1 - e) / 2],
  ];

  return (
    <figure className="viz" aria-label="Entropies et information mutuelle d'un canal binaire symétrique">
      <div className="mi-body">
        <table className="mi-table">
          <caption>
            loi jointe <Tex>{"p(x, y)"}</Tex>
          </caption>
          <thead>
            <tr>
              <th />
              <th>
                <Tex>{"y = 0"}</Tex>
              </th>
              <th>
                <Tex>{"y = 1"}</Tex>
              </th>
            </tr>
          </thead>
          <tbody>
            {cells.map((row, x) => (
              <tr key={x}>
                <th>
                  <Tex>{`x = ${x}`}</Tex>
                </th>
                {row.map((v, y) => (
                  <td key={y} className="viz-readout">
                    {fr(v, 3)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
        <div className="mi-bars">
          <span className="mi-label">
            <Tex>{"H(X, Y)"}</Tex>
          </span>
          <span className="mi-track">
            <span className="mi-seg token-c4" style={{ left: 0, width: pct(joint) }} />
          </span>
          <span className="mi-label">
            <Tex>{"H(X)"}</Tex>
          </span>
          <span className="mi-track">
            <span className="mi-seg token-c0" style={{ left: 0, width: pct(noise) }} />
            <span className="mi-seg token-c1" style={{ left: pct(noise), width: pct(info) }} />
          </span>
          <span className="mi-label">
            <Tex>{"H(Y)"}</Tex>
          </span>
          <span className="mi-track">
            <span className="mi-seg token-c1" style={{ left: pct(noise), width: pct(info) }} />
            <span className="mi-seg token-c2" style={{ left: pct(1), width: pct(noise) }} />
          </span>
        </div>
        <p className="token-label">
          <span className="mi-key">
            <span className="kl-swatch token-c0" /> <Tex>{"H(X \\mid Y)"}</Tex>
          </span>{" "}
          <span className="mi-key">
            <span className="kl-swatch token-c1" /> <Tex>{"I(X ; Y)"}</Tex>
          </span>{" "}
          <span className="mi-key">
            <span className="kl-swatch token-c2" /> <Tex>{"H(Y \\mid X)"}</Tex>
          </span>{" "}
          — échelle de 0 à 2 bits
        </p>
      </div>
      <div className="viz-controls">
        <label>
          <span>
            probabilité d'inversion <Tex>\varepsilon</Tex>
          </span>
          <input type="range" min={0} max={EPS.length - 1} step={1} value={ei} onChange={(ev) => setEi(Number(ev.target.value))} />
          <span className="viz-readout">{fr(e, 2)}</span>
        </label>
      </div>
      <div className="viz-formulas">
        <Tex>{`H(Y \\mid X) = H_2(\\varepsilon) \\approx ${texNum(noise, 3)}`}</Tex>
        <Tex>{`I(X ; Y) = 1 - H_2(\\varepsilon) \\approx ${texNum(info, 3)}`}</Tex>
        <p className="viz-delta">
          {e === 0
            ? "Sans bruit, Y est une copie de X : les deux barres se superposent, et chaque bit reçu apporte un bit entier."
            : e === 0.5
              ? "À ε = 0,5, la sortie est une pièce équilibrée, indépendante de l'entrée : la part commune disparaît, I(X ; Y) = 0."
              : "Le bruit ajoute de l'incertitude propre à chaque variable, et la part commune, l'information mutuelle, rétrécit d'autant."}
        </p>
      </div>
    </figure>
  );
}
