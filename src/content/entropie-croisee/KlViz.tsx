import { useState } from "react";
import { Tex } from "../../components/Tex";
import { texNum } from "../../lib/tex";

const TOKENS = ["souris", "croquettes", "pâtes", "salades", "chaussures"];
// Same invented logits as in the Lois discrètes and Entropie chapters.
const LOGITS = [3.0, 2.5, 1.0, 0.5, -1.0];
const TEMPS = [0.25, 0.5, 0.75, 1, 1.5, 2, 3, 5];
const SCALE = 3; // bits shown by a full bar; H(p, q) stays below it for every T above

function softmax(z: number[], t: number): number[] {
  const m = Math.max(...z);
  const e = z.map((v) => Math.exp((v - m) / t));
  const s = e.reduce((a, b) => a + b, 0);
  return e.map((v) => v / s);
}

const fr = (x: number, digits: number) => texNum(x, digits).replace("{,}", ",");

// True law p (the softmax at T = 1) against a model q at another temperature: H(p, q) = H(p) + KL(p || q).
export function KlViz() {
  const [ti, setTi] = useState(1); // T = 0.5
  const t = TEMPS[ti];
  const p = softmax(LOGITS, 1);
  const q = softmax(LOGITS, t);
  const H = p.reduce((s, pi) => s + pi * Math.log2(1 / pi), 0);
  const cross = p.reduce((s, pi, i) => s + pi * Math.log2(1 / q[i]), 0);
  const klpq = cross - H;
  const klqp = q.reduce((s, qi, i) => s + qi * Math.log2(qi / p[i]), 0);

  return (
    <figure className="viz" aria-label="Entropie croisée d'un modèle mal calibré, décomposée en entropie plus divergence">
      <div className="token-body">
        <p className="token-context">
          Le chat mange des <span className="token-blank">…</span>
        </p>
        <p className="token-label">
          <span className="kl-swatch kl-true" /> vraie loi <Tex>p</Tex> <span className="kl-swatch token-c0" /> modèle{" "}
          <Tex>q</Tex>
        </p>
        <div className="token-bars">
          {TOKENS.map((name, i) => (
            <div key={name} className="token-row kl-row">
              <span className="token-name">{name}</span>
              <span className="kl-tracks">
                <span className="token-track kl-track">
                  <span className="token-bar kl-true" style={{ width: `${100 * p[i]}%` }} />
                </span>
                <span className="token-track kl-track">
                  <span className="token-bar token-c0" style={{ width: `${100 * q[i]}%` }} />
                </span>
              </span>
              <span className="viz-readout">{fr(100 * p[i], 1)} %</span>
              <span className="viz-readout">{q[i] < 0.0005 ? "< 0,1" : fr(100 * q[i], 1)} %</span>
            </div>
          ))}
        </div>
        <p className="token-label">
          Entropie croisée <Tex>{"H(p, q)"}</Tex> : l'entropie <Tex>{"H(p)"}</Tex>, puis la divergence, sur une échelle
          de 0 à 3 bits
        </p>
        <div className="token-track kl-stack">
          <span className="token-bar kl-true" style={{ width: `${(100 * H) / SCALE}%` }} />
          <span className="token-bar token-c1" style={{ width: `${(100 * klpq) / SCALE}%` }} />
        </div>
      </div>
      <div className="viz-controls">
        <label>
          <span>
            température du modèle <Tex>T</Tex>
          </span>
          <input type="range" min={0} max={TEMPS.length - 1} step={1} value={ti} onChange={(e) => setTi(Number(e.target.value))} />
          <span className="viz-readout">{String(t).replace(".", ",")}</span>
        </label>
      </div>
      <div className="viz-formulas">
        <Tex>{`H(p, q) \\approx ${texNum(cross, 3)} = \\underbrace{${texNum(H, 3)}}_{H(p)} + \\underbrace{${texNum(klpq, 3)}}_{D_{\\mathrm{KL}}(p \\| q)} \\text{ bits}`}</Tex>
        <Tex>{`D_{\\mathrm{KL}}(q \\| p) \\approx ${texNum(klqp, 3)} \\text{ bits}`}</Tex>
        <p className="viz-delta">
          {t < 1
            ? "Sous 1, le modèle est trop sûr de lui : il donne presque rien aux tokens rares, et chacun lui coûte très cher quand il arrive. Ici, D(p‖q) dépasse D(q‖p)."
            : t > 1
              ? "Au-dessus de 1, le modèle est trop hésitant : il gaspille des probabilités sur des tokens rares. Ici, c'est D(q‖p) qui dépasse D(p‖q)."
              : "À T = 1, le modèle est la vraie loi : la divergence est nulle, et l'entropie croisée tombe sur son plancher, l'entropie."}
        </p>
      </div>
    </figure>
  );
}
