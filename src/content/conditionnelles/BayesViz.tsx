import { useState } from "react";
import { Tex } from "../../components/Tex";
import { texNum } from "../../lib/tex";

// 2000 rather than 1000: at 1 % and 95 %, 1000 people would round away the only false negative.
const POP = 2000;
const COLS = 80;
const PREVALENCES = [0.001, 0.005, 0.01, 0.02, 0.05, 0.1, 0.2, 0.5];
const pct = (x: number) => `${texNum(100 * x, 1).replace("{,}", ",")} %`;

function Slider({ label, value, set, min, max, step, text }: { label: string; value: number; set: (v: number) => void; min: number; max: number; step: number; text: string }) {
  return (
    <label>
      {label}
      <input type="range" min={min} max={max} step={step} value={value} onChange={(e) => set(Number(e.target.value))} />
      <span className="viz-readout">{text}</span>
    </label>
  );
}

// Natural frequencies: 1000 people split by disease status and test result; P(D | +) = TP / (TP + FP).
export function BayesViz() {
  const [pi, setPi] = useState(2); // index into PREVALENCES: 1 %
  const [sens, setSens] = useState(0.95);
  const [spec, setSpec] = useState(0.95);
  const prev = PREVALENCES[pi];
  const sick = Math.round(POP * prev);
  const tp = Math.round(sick * sens);
  const fn = sick - tp;
  const fp = Math.round((POP - sick) * (1 - spec));
  const tn = POP - sick - fp;
  // Exact posterior, not the rounded counts.
  const post = (sens * prev) / (sens * prev + (1 - spec) * (1 - prev));
  const cells = [...Array(tp).fill("tp"), ...Array(fn).fill("fn"), ...Array(fp).fill("fp"), ...Array(tn).fill("tn")];

  return (
    <figure className="viz" aria-label={`${POP} personnes réparties selon la maladie et le résultat du test`}>
      <svg className="bayes-grid" viewBox={`0 0 ${COLS} ${POP / COLS}`} role="img" aria-label={`${tp} vrais positifs, ${fp} faux positifs`}>
        {cells.map((c, i) => (
          <rect key={i} x={(i % COLS) + 0.1} y={Math.floor(i / COLS) + 0.1} width={0.8} height={0.8} rx={0.15} className={`bayes-${c}`} />
        ))}
      </svg>
      <p className="bayes-legend">
        {[
          ["tp", `malade, test + (${tp})`],
          ["fn", `malade, test − (${fn})`],
          ["fp", `sain, test + (${fp})`],
          ["tn", `sain, test − (${tn})`],
        ].map(([k, text]) => (
          <span key={k} className="bayes-item">
            <span className={`bayes-key bayes-${k}`} />
            {text}
          </span>
        ))}
      </p>
      <div className="viz-controls">
        <Slider label="prévalence" value={pi} set={setPi} min={0} max={PREVALENCES.length - 1} step={1} text={pct(prev)} />
        <Slider label="sensibilité" value={sens} set={setSens} min={0.5} max={0.999} step={0.001} text={pct(sens)} />
        <Slider label="spécificité" value={spec} set={setSpec} min={0.5} max={0.999} step={0.001} text={pct(spec)} />
      </div>
      <div className="viz-formulas">
        <Tex>{`P(M \\mid +) = \\frac{P(+ \\mid M)\\,P(M)}{P(+ \\mid M)\\,P(M) + P(+ \\mid M^c)\\,P(M^c)} = ${texNum(post, 3)}`}</Tex>
        <p className="viz-delta">
          Sur {POP} personnes, {tp + fp} ont un test positif, dont {tp} seulement sont malades : parmi les positifs, la
          proportion de malades est d'environ {pct(post)}. Tant que la maladie est rare, les faux positifs, pris dans
          la grande masse des gens sains, restent nombreux.
        </p>
      </div>
    </figure>
  );
}
