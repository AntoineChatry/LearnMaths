// Independent bench for diffusion: Gaussian conditioning for the posterior, finite differences for the scores.
import katex from "file:///F:/WebWorkspace/LearnMaths/node_modules/katex/dist/katex.mjs";
import { diffusionGenerators as gens, diffusionCards as cards, isEquivalent, ce } from "./bundle_di.mjs";

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
  if ((m = s.match(/^(-?)\\frac(\d)(\d)$/))) return (m[1] ? -1 : 1) * (+m[2] / +m[3]);
  if ((m = s.match(/^(-?)\\frac\{(\d+)\}\{(\d+)\}$/))) return (m[1] ? -1 : 1) * (+m[2] / +m[3]);
  if ((m = s.match(/^(-?)\\frac(\d)\{(\d+)\}$/))) return (m[1] ? -1 : 1) * (+m[2] / +m[3]);
  if (/^-?\d+$/.test(s)) return +s;
  throw new Error("bad value " + s);
};
const field = (p, re) => { const m = p.match(re); if (!m) throw new Error("no " + re); return val(m[1]); };
const logNormal = (x, m, v) => -((x - m) ** 2) / (2 * v) - 0.5 * Math.log(2 * Math.PI * v);
const fdScore = (f, x) => (f(x + 1e-5) - f(x - 1e-5)) / 2e-5;

function expected(id, e) {
  const p = e.promptTex;
  if (id === "di-avant") {
    const alphas = [...p.matchAll(/\\alpha_\d = (\\frac\{\d+\}\{\d+\})/g)].map((m) => val(m[1]));
    if (alphas.length) return alphas.reduce((a, b) => a * b, 1);
    const ab = field(p, /\\bar\\alpha_t = (\S+)/);
    if (p.includes("\\mathbb E")) return Math.sqrt(ab) * field(p, /x_0 = (-?\d+)/);
    if (p.includes("\\mathrm{Var}")) return 1 - ab;
    return Math.sqrt(1 - ab);
  }
  if (id === "di-bruit") {
    const ab = field(p, /\\bar\\alpha_t = (\S+)/), eps = field(p, /\\varepsilon = (-?\d+)/);
    if (p.includes("x_t = \\ ?")) return Math.sqrt(ab) * field(p, /x_0 = (-?\d+)/) + Math.sqrt(1 - ab) * eps;
    const xt = field(p, /x_t = (\S+)/);
    return (xt - Math.sqrt(1 - ab) * eps) / Math.sqrt(ab);
  }
  if (id === "di-posterieur") {
    const ab1 = field(p, /\\bar\\alpha_\{t-1\} = (\S+)/), b = field(p, /\\beta_t = (\S+)/);
    const a = 1 - b, ab = a * ab1;
    // Var(x_{t-1} | x_t, x_0) by conditioning the Gaussian pair (x_{t-1}, x_t) given x_0.
    const C00 = 1 - ab1, C01 = Math.sqrt(a) * (1 - ab1), C11 = 1 - ab;
    return C00 - (C01 * C01) / C11;
  }
  if (id === "di-score") {
    if (p.includes("m = ")) {
      const m = field(p, /m = (-?\d+)/), v = field(p, /v = (\S+)/), x = field(p, /x = (-?\d+)/);
      return fdScore((y) => logNormal(y, m, v), x);
    }
    const ab = field(p, /\\bar\\alpha_t = (\S+)/), x = field(p, /x_t = (-?\d+)/);
    const c = p.includes("c = ") ? field(p, /c = (-?\d+)/) : null;
    const logq = c === null ? (y) => logNormal(y, 0, 1) : (y) => logNormal(y, Math.sqrt(ab) * c, 1 - ab);
    return -Math.sqrt(1 - ab) * fdScore(logq, x);
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
    if (Math.abs(exp) < 1e-9) st.zero++;
    const got = num(e.answerTex);
    const tol = g.id === "di-score" ? 1e-6 : 1e-9; // finite differences
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
const alt = [["\\frac{12}{5}", "2,4"], ["-\\frac{3}{5}", "-0.6"], ["\\frac{1}{6}", "\\frac{2}{12}"]];
for (const [a, b] of alt) console.log("alt", b, isEquivalent(b, a));
for (const g of gens) for (let i = 0; i < 4; i++) { const e = g.make(); console.log(g.id, "|", e.promptTex, "|", e.answerTex); }
console.log("seconds", (Date.now() - T0) / 1000);
