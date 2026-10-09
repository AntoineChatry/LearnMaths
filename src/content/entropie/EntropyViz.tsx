import { useState } from "react";
import { Tex } from "../../components/Tex";
import { texNum } from "../../lib/tex";

const TOKENS = ["souris", "croquettes", "pâtes", "salades", "chaussures"];
// Same invented logits as in the Lois discrètes chapter and in this lesson's code.
const LOGITS = [3.0, 2.5, 1.0, 0.5, -1.0];
const TEMPS = [0.1, 0.25, 0.5, 0.75, 1, 1.5, 2, 3, 5, 10];
const MAX = Math.log2(TOKENS.length);

function softmax(z: number[], t: number): number[] {
  const m = Math.max(...z);
  const e = z.map((v) => Math.exp((v - m) / t));
  const s = e.reduce((a, b) => a + b, 0);
  return e.map((v) => v / s);
}

const fr = (x: number, digits: number) => texNum(x, digits).replace("{,}", ",");

// Entropy of the next-token law as the temperature changes: each token's surprise, and their average.
export function EntropyViz() {
  const [ti, setTi] = useState(4); // T = 1
  const t = TEMPS[ti];
  const p = softmax(LOGITS, t);
  const h = p.map((q) => Math.log2(1 / q));
  const H = p.reduce((s, q, i) => s + q * h[i], 0);

  return (
    <figure className="viz" aria-label="Entropie de la loi du token suivant selon la température">
      <div className="token-body">
        <p className="token-context">
          Le chat mange des <span className="token-blank">…</span>
        </p>
        <div className="token-bars">
          {TOKENS.map((name, i) => (
            <div key={name} className="token-row entropy-row">
              <span className="token-name">
                <span className={`token-key token-c${i}`} />
                {name}
              </span>
              <span className="token-track">
                <span className={`token-bar token-c${i}`} style={{ width: `${100 * p[i]}%` }} />
              </span>
              <span className="viz-readout">{fr(100 * p[i], 1)} %</span>
              <span className="viz-readout">{h[i] > 99 ? "> 99" : fr(h[i], 2)} bits</span>
            </div>
          ))}
        </div>
        <p className="token-label">Entropie : la surprise moyenne, sur une échelle de 0 à log₂ 5</p>
        <div className="token-track">
          <span className="token-bar token-c0" style={{ width: `${(100 * H) / MAX}%` }} />
        </div>
      </div>
      <div className="viz-controls">
        <label>
          <span>
            température <Tex>T</Tex>
          </span>
          <input type="range" min={0} max={TEMPS.length - 1} step={1} value={ti} onChange={(e) => setTi(Number(e.target.value))} />
          <span className="viz-readout">{String(t).replace(".", ",")}</span>
        </label>
      </div>
      <div className="viz-formulas">
        <Tex>{`H = \\sum_i p_i \\log_2 \\frac{1}{p_i} \\approx ${texNum(H, 3)} \\text{ bits} \\qquad \\log_2 5 \\approx ${texNum(MAX, 3)}`}</Tex>
        <p className="viz-delta">
          {t < 1
            ? "Sous 1, la loi se concentre sur « souris » : sa surprise tend vers 0, celle des autres explose, mais elles pèsent de moins en moins, et l'entropie tend vers 0."
            : t > 1
              ? "Au-dessus de 1, la loi s'aplatit : toutes les surprises se rapprochent de log₂ 5 ≈ 2,32 bits, et l'entropie aussi, son maximum."
              : "À T = 1, la loi apprise par le modèle : il hésite surtout entre deux tokens."}
        </p>
      </div>
    </figure>
  );
}
