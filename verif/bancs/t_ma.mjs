// Independent bench for marches-aleatoires: answers recomputed by other methods than the generator's formulas.
import katex from "file:///F:/WebWorkspace/LearnMaths/node_modules/katex/dist/katex.mjs";
import { marchesAleatoiresGenerators as gens, marchesAleatoiresCards as cards, isEquivalent, ce } from "./bundle_ma.mjs";

const N_RUNS = 3000;
const T0 = Date.now();
let rendered = 0, katexErr = 0;
const render = (t, where, display = true) => {
  rendered++;
  try { katex.renderToString(t, { throwOnError: true, displayMode: display }); }
  catch (e) { if (katexErr++ < 10) console.log("KATEX", where, "|", t.slice(0, 160), "|", e.message.slice(0, 100)); }
};
const inline = (s, where) => { for (const m of (s ?? "").matchAll(/\$([^$]+)\$/g)) render(m[1], where, false); };
const num = (tex) => ce.parse(tex.replace(/(\d)\s*(?:\{,\}|,)\s*(?=\d)/g, "$1.")).N().re;
const val = (s) => {
  s = s.trim();
  let m;
  if ((m = s.match(/^\\frac(\d)(\d)$/))) return +m[1] / +m[2];
  if ((m = s.match(/^\\frac\{(\d+)\}\{(\d+)\}$/))) return +m[1] / +m[2];
  if (/^-?\d+$/.test(s)) return +s;
  throw new Error("bad value " + s);
};
const field = (p, re) => { const m = p.match(re); if (!m) throw new Error("no " + re); return val(m[1]); };

// Law of S_n by exact convolution of n steps of +-1.
const walkLaw = (n) => {
  let law = new Map([[0, 1]]);
  for (let i = 0; i < n; i++) {
    const next = new Map();
    for (const [k, p] of law) for (const d of [-1, 1]) next.set(k + d, (next.get(k + d) ?? 0) + p / 2);
    law = next;
  }
  return law;
};
// Gaussian elimination for the hitting probability h and expected time g on {a..b}, step up with probability p.
const solveHitting = (a, b, p, x) => {
  const n = b - a - 1; // interior states a+1..b-1
  const solve = (rhs) => {
    const M = Array.from({ length: n }, (_, i) => { const r = Array(n + 1).fill(0); r[i] = 1; if (i + 1 < n) r[i + 1] = -p; if (i > 0) r[i - 1] = -(1 - p); r[n] = rhs(i); return r; });
    for (let c = 0; c < n; c++) {
      const piv = M[c][c];
      for (let j = c; j <= n; j++) M[c][j] /= piv;
      for (let r = 0; r < n; r++) if (r !== c && M[r][c] !== 0) { const f = M[r][c]; for (let j = c; j <= n; j++) M[r][j] -= f * M[c][j]; }
    }
    return M.map((r) => r[n]);
  };
  const h = solve((i) => (i === n - 1 ? p : 0)); // h(x) = p h(x+1) + (1-p) h(x-1), h(b) = 1, h(a) = 0
  const g = solve(() => 1); // g(x) = 1 + p g(x+1) + (1-p) g(x-1), g = 0 at the ends
  return { h: h[x - a - 1], g: g[x - a - 1] };
};

function expected(id, e) {
  const p = e.promptTex;
  if (id === "ma-position") {
    let m;
    if ((m = p.match(/^2m = (\d+) /))) return walkLaw(+m[1]).get(0);
    const n = field(p, /n = (\d+)/), k = field(p, /k = (-?\d+)/);
    return walkLaw(n).get(k) ?? 0;
  }
  if (id === "ma-ruine") {
    const x = field(p, /x = (-?\d+)/), b = field(p, /b = (-?\d+)/);
    if (p.includes("p = ")) return solveHitting(0, b, field(p, /p = (\\frac\d\d)/), x).h;
    const a = field(p, /a = (-?\d+)/);
    const r = solveHitting(a, b, 0.5, x);
    return p.includes("avant") ? r.h : r.g;
  }
  if (id === "ma-brownien") {
    let m;
    const cov = (s, t) => Math.min(s, t);
    if ((m = p.match(/B_\{(\d+)\} - B_\{(\d+)\}/))) { const t = +m[1], s = +m[2]; return cov(t, t) + cov(s, s) - 2 * cov(s, t); }
    if ((m = p.match(/B_\{(\d+)\} \+ B_\{(\d+)\}/))) { const s = +m[1], t = +m[2]; return cov(s, s) + cov(t, t) + 2 * cov(s, t); }
    if ((m = p.match(/\\sigma\(B_\{(\d+)\}\)/))) return Math.sqrt(+m[1]);
    const n = field(p, /n = (\d+)/);
    return Math.sqrt(1 / n);
  }
  if (id === "ma-rappel") {
    if (p.includes("\\beta = ")) {
      const beta = field(p, /\\beta = (\\frac\{\d+\}\{\d+\})/), x0 = field(p, /x_0 = (\d+)/);
      const t = +p.match(/x_\{(\d)\}\)/)[1];
      let mean = x0, v = 0;
      for (let i = 0; i < t; i++) { mean *= Math.sqrt(1 - beta); v = (1 - beta) * v + beta; }
      return p.includes("\\mathbb E") ? mean : v;
    }
    if (p.includes("b^2")) {
      const a = field(p, /a = (\\frac\d\d)/), b2 = field(p, /b\^2 = (\d+)/);
      let v = 0;
      for (let i = 0; i < 20000; i++) v = a * a * v + b2;
      return v;
    }
    const lam = field(p, /\\lambda = (\S+)/), q = field(p, /q = (\d+)/);
    const dt = 1e-5;
    return (q * dt) / (1 - (1 - lam * dt) ** 2); // fixed point of v <- (1 - lam dt)^2 v + q dt (Euler-Maruyama)
  }
}

const issues = [];
const stats = {};
for (const g of gens) {
  const st = (stats[g.id] = { n: 0, mismatch: 0, selfFail: 0, mutAccepted: 0, zero: 0, answers: new Set() });
  for (let i = 0; i < N_RUNS; i++) {
    if (Date.now() - T0 > 120000) throw new Error("time guard: bench over 120 s");
    const e = g.make();
    st.n++;
    st.answers.add(e.answerTex);
    render(e.promptTex, g.id); render(e.answerTex, g.id, false);
    for (const t of e.solution) render(t, g.id);
    inline(e.intro, g.id); inline(e.hint, g.id);
    let exp;
    try { exp = expected(g.id, e); } catch (err) { st.mismatch++; if (issues.length < 10) issues.push({ id: g.id, err: err.message, prompt: e.promptTex }); continue; }
    if (Math.abs(exp) < 1e-12) st.zero++;
    const got = num(e.answerTex);
    const tol = g.id === "ma-rappel" && !e.promptTex.includes("\\beta") && !e.promptTex.includes("b^2") ? 1e-4 : 1e-9;
    if (!Number.isFinite(got) || Math.abs(got - exp) > tol * Math.max(1, Math.abs(exp))) {
      st.mismatch++;
      if (issues.length < 10) issues.push({ id: g.id, prompt: e.promptTex, answer: e.answerTex, got, exp });
    }
    if (!isEquivalent(e.answerTex, e.answerTex)) st.selfFail++;
    if (isEquivalent(`${e.answerTex}+\\frac{1}{1000}`, e.answerTex) || isEquivalent(`2\\left(${e.answerTex}\\right)+\\frac{1}{7}`, e.answerTex)) st.mutAccepted++;
  }
}
for (const [id, st] of Object.entries(stats)) console.log(id, "n", st.n, "mismatch", st.mismatch, "selfFail", st.selfFail, "mutationAccepted", st.mutAccepted, "zero%", (100 * st.zero / st.n).toFixed(1), "distinct", st.answers.size);
console.log("issues", JSON.stringify(issues, null, 1));
for (const c of cards) { inline(c.front, c.id); inline(c.back, c.id); }
console.log("rendered", rendered, "katex errors", katexErr);
const alt = [["\\frac{3}{10}", "0,3"], ["\\frac{1}{10}", "0.1"], ["\\frac{5}{16}", "\\frac{10}{32}"]];
for (const [a, b] of alt) console.log("alt", b, isEquivalent(b, a));
for (const g of gens) for (let i = 0; i < 4; i++) { const e = g.make(); console.log(g.id, "|", e.promptTex, "|", e.answerTex); }
console.log("seconds", (Date.now() - T0) / 1000);
