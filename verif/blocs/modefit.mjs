// Copy of the numeric part of ModeViz.tsx, to time it and compare with scipy.
const SIGMA = 0.6;
const LOG_SQRT_2PI = 0.5 * Math.log(2 * Math.PI);
const logGauss = (x, mu, s) => -0.5 * ((x - mu) / s) ** 2 - Math.log(s) - LOG_SQRT_2PI;
function logP(x, d) {
  const a = logGauss(x, -d, SIGMA), b = logGauss(x, d, SIGMA), m = Math.max(a, b);
  return m + Math.log(0.5 * Math.exp(a - m) + 0.5 * Math.exp(b - m));
}
function integrate(f, lo, hi, n = 800) {
  const h = (hi - lo) / n;
  let s = 0.5 * (f(lo) + f(hi));
  for (let i = 1; i < n; i++) s += f(lo + i * h);
  return s * h;
}
const forwardKl = (d, mu, s) => integrate((x) => Math.exp(logP(x, d)) * (logP(x, d) - logGauss(x, mu, s)), -d - 8 * SIGMA, d + 8 * SIGMA);
const reverseKl = (d, mu, s) => integrate((x) => Math.exp(logGauss(x, mu, s)) * (logGauss(x, mu, s) - logP(x, d)), mu - 8 * s, mu + 8 * s, 400);
let evals = 0;
function reverseFit(d) {
  let best = [0, 1], bestV = Infinity;
  for (let mu = 0; mu <= d + 0.5; mu += 0.1)
    for (let ls = Math.log(0.3); ls <= Math.log(4); ls += 0.05) {
      const v = reverseKl(d, mu, Math.exp(ls)); evals++;
      if (v < bestV) [best, bestV] = [[mu, ls], v];
    }
  for (let step = 0.05; step > 1e-4; step /= 2) {
    let moved = true, it = 0;
    while (moved) {
      moved = false;
      if (++it > 10000) { console.log("STUCK", d, step, best, bestV); return null; }
      for (const [dm, dl] of [[step, 0], [-step, 0], [0, step], [0, -step]]) {
        const c = [Math.max(0, best[0] + dm), best[1] + dl];
        const v = reverseKl(d, c[0], Math.exp(c[1])); evals++;
        if (v < bestV - 1e-12) [best, bestV, moved] = [c, v, true];
      }
    }
  }
  return [best[0], Math.exp(best[1])];
}
for (const d of [0, 0.5, 1, 1.5, 1.75, 2, 2.5, 3]) {
  evals = 0;
  const t = performance.now();
  const r = reverseFit(d);
  const ms = performance.now() - t;
  if (!r) continue;
  const sf = Math.sqrt(SIGMA * SIGMA + d * d);
  console.log(d, ms.toFixed(0) + "ms", evals, `fwd s=${sf.toFixed(3)} ${forwardKl(d, 0, sf).toFixed(3)} ${reverseKl(d, 0, sf).toFixed(3)} | rev ${r[0].toFixed(3)} ${r[1].toFixed(3)} ${forwardKl(d, ...r).toFixed(3)} ${reverseKl(d, ...r).toFixed(3)}`);
}
