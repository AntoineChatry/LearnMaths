import { useState } from "react";
import { Tex } from "../../components/Tex";
import { texNum } from "../../lib/tex";

const TOKENS = ["souris", "croquettes", "pâtes", "salades", "chaussures"];
// Invented logits, the same as in the lesson's code.
const LOGITS = [3.0, 2.5, 1.0, 0.5, -1.0];
const TEMPS = [0.1, 0.25, 0.5, 0.75, 1, 1.5, 2, 3, 5, 10];
const HISTORY = 12;

function softmax(z: number[], t: number): number[] {
  const m = Math.max(...z);
  const e = z.map((v) => Math.exp((v - m) / t));
  const s = e.reduce((a, b) => a + b, 0);
  return e.map((v) => v / s);
}

const pct = (x: number) => `${texNum(100 * x, 1).replace("{,}", ",")} %`;

// Next-token law at temperature T, and sampling by inverting the cumulative distribution function.
export function TokenViz() {
  const [ti, setTi] = useState(4); // T = 1
  const [draws, setDraws] = useState<{ u: number; k: number }[]>([]);
  const t = TEMPS[ti];
  const p = softmax(LOGITS, t);
  const cdf = p.map((_, i) => p.slice(0, i + 1).reduce((a, b) => a + b, 0));
  const last = draws[0];

  function draw() {
    const u = Math.random();
    let k = cdf.findIndex((c) => u < c);
    if (k === -1) k = p.length - 1; // rounding: the last cumulative value can fall just below 1
    setDraws((d) => [{ u, k }, ...d].slice(0, HISTORY));
  }

  return (
    <figure className="viz" aria-label="Loi du token suivant selon la température">
      <div className="token-body">
        <p className="token-context">
          Le chat mange des <span className="token-blank">…</span>
        </p>
        <div className="token-bars">
          {TOKENS.map((name, i) => (
            <div key={name} className={`token-row${last?.k === i ? " token-row-drawn" : ""}`}>
              <span className="token-name">
                <span className={`token-key token-c${i}`} />
                {name}
              </span>
              <span className="token-track">
                <span className={`token-bar token-c${i}`} style={{ width: `${100 * p[i]}%` }} />
              </span>
              <span className="viz-readout">{pct(p[i])}</span>
            </div>
          ))}
        </div>
        <p className="token-label">Fonction de répartition : [0, 1] découpé en segments de longueurs p₁, …, p₅</p>
        <div className="token-cdf">
          {p.map((q, i) => (
            <span key={i} className={`token-seg token-c${i}`} style={{ width: `${100 * q}%` }} />
          ))}
          {last && <span className="token-u" style={{ left: `${100 * last.u}%` }} />}
        </div>
        <div className="token-axis">
          <span>0</span>
          <span>1</span>
        </div>
        <p className="token-draw">
          {last ? (
            <>
              <Tex>{`u = ${texNum(last.u, 3)}`}</Tex> tombe dans le segment de « {TOKENS[last.k]} ». Derniers tirages :{" "}
              {draws.map((d) => TOKENS[d.k]).join(", ")}.
            </>
          ) : (
            "Tire un nombre u uniforme sur [0, 1] : le token est celui dont le segment contient u."
          )}
        </p>
      </div>
      <div className="viz-controls">
        <label>
          température <Tex>T</Tex>
          <input
            type="range"
            min={0}
            max={TEMPS.length - 1}
            step={1}
            value={ti}
            onChange={(e) => {
              setTi(Number(e.target.value));
              setDraws([]);
            }}
          />
          <span className="viz-readout">{String(t).replace(".", ",")}</span>
        </label>
        <button type="button" className="btn btn-primary" onClick={draw}>
          Tirer un token
        </button>
      </div>
      <div className="viz-formulas">
        <Tex>{`p_i = \\frac{e^{z_i / T}}{\\sum_j e^{z_j / T}} \\qquad T = ${texNum(t, 2)}`}</Tex>
        <p className="viz-delta">
          {t < 1
            ? "Sous 1, la température creuse les écarts : la masse se concentre sur « souris », et quand T tend vers 0 le tirage devient un argmax."
            : t > 1
              ? "Au-dessus de 1, elle aplatit la loi : les tokens improbables remontent, et quand T grandit on tend vers la loi uniforme (20 % chacun)."
              : "À T = 1, ce sont les probabilités que le modèle a apprises."}
        </p>
      </div>
    </figure>
  );
}
