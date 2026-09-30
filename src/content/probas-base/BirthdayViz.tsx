import { Coordinates, Mafs, Plot, Point, Theme } from "mafs";
import { useMemo, useState } from "react";
import { Tex } from "../../components/Tex";
import { texNum } from "../../lib/tex";

const SPACES = [
  { label: "365 jours", N: 365 },
  { label: "10 000", N: 1e4 },
  { label: "un million", N: 1e6 },
  { label: "2³² (hachage de 32 bits)", N: 2 ** 32 },
];
const T_MAX = 4;
const SAMPLES = 20;

// P(at least one match) among k draws from N equally likely values: 1 - N(N-1)...(N-k+1) / N^k, via a log-sum.
function matchProb(k: number, N: number): number {
  let logNo = 0;
  for (let j = 1; j < k; j++) logNo += Math.log1p(-j / N);
  return 1 - Math.exp(logNo);
}

const fr = (x: number, d = 3) => texNum(x, d).replace("{,}", ",");
// Integer with thin spaces between groups of three digits, for LaTeX.
const groups = (n: number) => String(n).replace(/\B(?=(\d{3})+(?!\d))/g, "\\,");

// Birthday problem at any scale: with k in units of √N, the exact points of every N fall on 1 - exp(-t²/2).
export function BirthdayViz() {
  const [si, setSi] = useState(0);
  const [t, setT] = useState(23 / Math.sqrt(365));
  const N = SPACES[si].N;
  const k = Math.max(1, Math.round(t * Math.sqrt(N)));
  const exact = matchProb(k, N);
  const approx = 1 - Math.exp((-k * (k - 1)) / (2 * N));
  const points = useMemo(
    () =>
      Array.from({ length: SAMPLES }, (_, i) => {
        const ki = Math.max(1, Math.round((T_MAX * (i + 1) * Math.sqrt(N)) / SAMPLES));
        return [ki / Math.sqrt(N), matchProb(ki, N)] as [number, number];
      }),
    [N],
  );

  return (
    <figure className="viz" aria-label="Probabilité d'une collision parmi k tirages">
      <Mafs height={260} viewBox={{ x: [-0.2, T_MAX + 0.2], y: [-0.1, 1.1], padding: 0 }} pan={false}>
        <Coordinates.Cartesian xAxis={{ lines: 1 }} yAxis={{ lines: 0.25, labels: (v) => String(v).replace(".", ",") }} />
        <Plot.OfX y={(x) => 1 - Math.exp((-x * x) / 2)} domain={[0, T_MAX]} color={Theme.blue} weight={2} />
        {points.map(([x, y]) => (
          <Point key={x} x={x} y={y} color={Theme.foreground} opacity={0.45} />
        ))}
        <Point x={k / Math.sqrt(N)} y={exact} color={Theme.red} />
      </Mafs>
      <div className="viz-controls">
        <label>
          N
          <select value={si} onChange={(e) => setSi(Number(e.target.value))}>
            {SPACES.map((s, i) => (
              <option key={s.label} value={i}>
                {s.label}
              </option>
            ))}
          </select>
        </label>
        <label>
          k
          <input type="range" min={0.05} max={T_MAX} step={0.01} value={t} onChange={(e) => setT(Number(e.target.value))} />
          <span className="viz-readout">{k.toLocaleString("fr-FR")}</span>
        </label>
      </div>
      <div className="viz-formulas">
        <Tex>{`k = ${groups(k)} \\qquad \\binom{k}{2} = ${groups((k * (k - 1)) / 2)} \\text{ paires} \\qquad P(\\text{collision}) = ${texNum(exact, 3)} \\qquad 1 - e^{-k(k-1)/2N} = ${texNum(approx, 3)}`}</Tex>
        <p className="viz-delta">
          Axe horizontal : <Tex>{"k / \\sqrt N"}</Tex>. Points pâles : la probabilité exacte pour cette valeur de N ; courbe
          bleue : l'approximation <Tex>{"1 - e^{-t^2/2}"}</Tex>. Change N : les points restent sur la même courbe. Ici,
          la probabilité d'une collision vaut {fr(exact)}.
        </p>
      </div>
    </figure>
  );
}
