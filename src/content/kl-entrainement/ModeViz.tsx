import { Coordinates, Mafs, Plot, Theme } from "mafs";
import { useMemo, useState } from "react";
import { Tex } from "../../components/Tex";
import { texNum } from "../../lib/tex";

const SIGMA = 0.6; // width of each bump of p
const HALF = [0, 0.5, 1, 1.5, 1.75, 2, 2.5, 3]; // bumps at -d and +d

const LOG_SQRT_2PI = 0.5 * Math.log(2 * Math.PI);
const logGauss = (x: number, mu: number, s: number) => -0.5 * ((x - mu) / s) ** 2 - Math.log(s) - LOG_SQRT_2PI;

// log p(x) for p = N(-d, SIGMA^2)/2 + N(d, SIGMA^2)/2, by log-sum-exp so that it never underflows.
function logP(x: number, d: number) {
  const a = logGauss(x, -d, SIGMA);
  const b = logGauss(x, d, SIGMA);
  const m = Math.max(a, b);
  return m + Math.log(0.5 * Math.exp(a - m) + 0.5 * Math.exp(b - m));
}

// Trapezoid rule on [lo, hi].
function integrate(f: (x: number) => number, lo: number, hi: number, n = 800) {
  const h = (hi - lo) / n;
  let s = 0.5 * (f(lo) + f(hi));
  for (let i = 1; i < n; i++) s += f(lo + i * h);
  return s * h;
}

// D(p || q) and D(q || p) in nats, for q = N(mu, s^2).
function forwardKl(d: number, mu: number, s: number) {
  return integrate((x) => Math.exp(logP(x, d)) * (logP(x, d) - logGauss(x, mu, s)), -d - 8 * SIGMA, d + 8 * SIGMA);
}
function reverseKl(d: number, mu: number, s: number) {
  return integrate((x) => Math.exp(logGauss(x, mu, s)) * (logGauss(x, mu, s) - logP(x, d)), mu - 8 * s, mu + 8 * s, 400);
}

// Minimizer of D(q || p) over Gaussians q: coarse grid (mu >= 0, p is symmetric), then pattern search.
function reverseFit(d: number): [number, number] {
  let best: [number, number] = [0, 1];
  let bestV = Infinity;
  for (let mu = 0; mu <= d + 0.5; mu += 0.1) {
    for (let ls = Math.log(0.3); ls <= Math.log(4); ls += 0.05) {
      const v = reverseKl(d, mu, Math.exp(ls));
      if (v < bestV) [best, bestV] = [[mu, ls], v];
    }
  }
  for (let step = 0.05; step > 1e-4; step /= 2) {
    let moved = true;
    while (moved) {
      moved = false;
      for (const [dm, dl] of [[step, 0], [-step, 0], [0, step], [0, -step]]) {
        const c: [number, number] = [Math.max(0, best[0] + dm), best[1] + dl];
        const v = reverseKl(d, c[0], Math.exp(c[1]));
        if (v < bestV - 1e-12) [best, bestV, moved] = [c, v, true];
      }
    }
  }
  return [best[0], Math.exp(best[1])];
}

// One Gaussian fitted to two bumps, in each direction of the KL divergence (PRML fig. 10.3, Goodfellow fig. 3.6).
export function ModeViz() {
  const [di, setDi] = useState(5); // d = 2
  const d = HALF[di];
  const fits = useMemo(() => {
    const fwd: [number, number] = [0, Math.sqrt(SIGMA * SIGMA + d * d)]; // moment matching
    const rev = reverseFit(d);
    return [fwd, rev].map(([mu, s]) => ({ mu, s, pq: forwardKl(d, mu, s), qp: reverseKl(d, mu, s) }));
  }, [d]);
  const [fwd, rev] = fits;
  const p = (x: number) => Math.exp(logP(x, d));
  const q = (mu: number, s: number) => (x: number) => Math.exp(logGauss(x, mu, s));
  const row = (color: string, f: (typeof fits)[number]) => (
    <tr>
      <th>
        <span className="kl-swatch" style={{ background: color }} /> <Tex>{`\\mathcal N(${texNum(f.mu, 2)},\\ ${texNum(f.s, 2)}^2)`}</Tex>
      </th>
      <td className="viz-readout">{texNum(f.pq, 3).replace("{,}", ",")}</td>
      <td className="viz-readout">{texNum(f.qp, 3).replace("{,}", ",")}</td>
    </tr>
  );

  return (
    <figure className="viz" aria-label="Une gaussienne ajustée à un mélange de deux bosses, dans les deux sens de la divergence KL">
      <Mafs height={280} viewBox={{ x: [-5.5, 5.5], y: [-0.1, 0.72], padding: 0 }} preserveAspectRatio={false} pan={false}>
        <Coordinates.Cartesian xAxis={{ lines: 1 }} yAxis={false} />
        <Plot.OfX y={p} color={Theme.foreground} weight={2} style="dashed" />
        <Plot.OfX y={q(fwd.mu, fwd.s)} color={Theme.blue} weight={3} />
        <Plot.OfX y={q(rev.mu, rev.s)} color={Theme.red} weight={3} />
      </Mafs>
      <div className="viz-controls">
        <label>
          <span>
            écart des bosses <Tex>d</Tex>
          </span>
          <input type="range" min={0} max={HALF.length - 1} step={1} value={di} onChange={(e) => setDi(Number(e.target.value))} />
          <span className="viz-readout">{texNum(d, 2).replace("{,}", ",")}</span>
        </label>
      </div>
      <div className="mi-body">
        <table className="mi-table mode-table">
          <caption>
            <Tex>p</Tex> en pointillés ; en bleu, le <Tex>q</Tex> qui minimise <Tex>{"D(p \\| q)"}</Tex>, en rouge celui
            qui minimise <Tex>{"D(q \\| p)"}</Tex> ; en nats
          </caption>
          <thead>
            <tr>
              <th>
                <Tex>q</Tex>
              </th>
              <th>
                <Tex>{"D(p \\| q)"}</Tex>
              </th>
              <th>
                <Tex>{"D(q \\| p)"}</Tex>
              </th>
            </tr>
          </thead>
          <tbody>
            {/* Theme.* only resolves inside .MafsView: use the app tokens they map to (index.css). */}
            {row("var(--ink)", fwd)}
            {row("var(--margin)", rev)}
          </tbody>
        </table>
        <p className="viz-delta">
          {d < 1.75
            ? "Les bosses se chevauchent encore : les deux sens donnent une gaussienne centrée, un peu plus étroite pour D(q‖p)."
            : "Les bosses sont séparées. D(p‖q), en bleu, couvre les deux et met de la masse dans le creux ; D(q‖p), en rouge, en choisit une (l'autre donnerait la même valeur) et ignore la seconde."}
        </p>
      </div>
    </figure>
  );
}
