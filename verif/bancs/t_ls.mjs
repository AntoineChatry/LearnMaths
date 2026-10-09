// Independent bench for loi-stationnaire: stationary laws recomputed numerically from the matrix or graph in the prompt.
import katex from "file:///F:/WebWorkspace/LearnMaths/node_modules/katex/dist/katex.mjs";
import { loiStationnaireGenerators as gens, loiStationnaireCards as cards, isEquivalent, ce } from "./bundle_ls.mjs";

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
  if ((m = s.match(/^\\frac\{(\d+)\}\{(\d+)\}$/))) return +m[1] / +m[2];
  if ((m = s.match(/^(\d+)\{,\}(\d+)$/))) return +`${m[1]}.${m[2]}`;
  if (/^\d+$/.test(s)) return +s;
  throw new Error("bad value " + s);
};
const matrix = (p) => {
  const m = p.match(/\\begin\{pmatrix\} (.*?) \\end\{pmatrix\}/);
  if (!m) throw new Error("no matrix");
  const A = m[1].split(" \\\\ ").map((r) => r.split(" & ").map(val));
  for (const r of A) if (Math.abs(r.reduce((a, b) => a + b, 0) - 1) > 1e-12 || r.some((x) => x < 0)) throw new Error("not stochastic");
  return A;
};
// Stationary law by iterating the lazy chain (I + P) / 2 from the uniform law: works for periodic chains too.
const stationary = (P) => {
  const n = P.length;
  let mu = Array(n).fill(1 / n);
  for (let t = 0; t < 5000; t++) mu = mu.map((_, j) => 0.5 * mu[j] + 0.5 * mu.reduce((s, x, i) => s + x * P[i][j], 0));
  const res = Math.max(...mu.map((x, j) => Math.abs(mu.reduce((s, y, i) => s + y * P[i][j], 0) - x)));
  if (res > 1e-12) throw new Error("not converged");
  return mu;
};

function expected(id, e) {
  const p = e.promptTex;
  if (id === "ls-deux-etats" || id === "ls-trois-etats") {
    const pi = stationary(matrix(p));
    let m;
    if ((m = p.match(/\\pi\((\d)\) = \\ \?/))) return pi[m[1] - 1];
    if ((m = p.match(/\\mathbb E_\{(\d)\}\(\\text\{retour en \} \1\)/))) return 1 / pi[m[1] - 1];
    throw new Error("kind");
  }
  if (id === "ls-graphe") {
    const edges = [...p.matchAll(/\\\{(\d), (\d)\\\}/g)].map((m) => [+m[1], +m[2]]);
    const n = Math.max(...edges.flat());
    if (!/^.*à (\d) sommets/.test(e.intro) || +e.intro.match(/à (\d) sommets/)[1] !== n) throw new Error("vertex count");
    const P = Array.from({ length: n }, () => Array(n).fill(0));
    for (const [a, b] of edges) { if (a === b) throw new Error("loop"); P[a - 1][b - 1] = 1; P[b - 1][a - 1] = 1; }
    for (const r of P) { const s = r.reduce((a, b) => a + b, 0); if (s === 0) throw new Error("isolated"); r.forEach((_, j) => (r[j] /= s)); }
    const pi = stationary(P);
    let m;
    if ((m = p.match(/\\pi\((\d)\) = \\ \?/))) return pi[m[1] - 1];
    if ((m = p.match(/\\mathbb E_\{(\d)\}/))) return 1 / pi[m[1] - 1];
    throw new Error("kind");
  }
  if (id === "ls-pagerank") {
    const N = +p.match(/N = (\d+)/)[1];
    const a = val(p.match(/\\alpha = (\S+)/)[1]);
    const k = +p.match(/k = (\d+)/)[1];
    const linked = p.includes("i \\to j");
    if (!linked && !p.includes("i \\not\\to j")) throw new Error("link");
    // Build a concrete web of N pages where i has k links, and read P(i, j) off the full matrix.
    const out = Array.from({ length: k }, (_, t) => (linked ? t : t + 1)); // j = page 0
    const row = Array(N).fill(a / N);
    for (const o of out) row[o] += (1 - a) / k;
    if (Math.abs(row.reduce((s, x) => s + x, 0) - 1) > 1e-12) throw new Error("row");
    return row[0];
  }
}

const issues = [];
const stats = {};
for (const g of gens) {
  const st = (stats[g.id] = { n: 0, mismatch: 0, selfFail: 0, mutAccepted: 0, zero: 0, answers: new Set() });
  for (let i = 0; i < N_RUNS; i++) {
    if (Date.now() - T0 > 180000) throw new Error("time guard: bench over 180 s");
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
    if (!Number.isFinite(got) || Math.abs(got - exp) > 1e-9 * Math.max(1, Math.abs(exp))) {
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
const alt = [
  ["\\frac{2}{5}", "0,4"],
  ["\\frac{5}{2}", "2.5"],
  ["\\frac{47}{150}","\\frac{0.85}{3}+\\frac{0.15}{5}"],
];
for (const [a, b] of alt) console.log("alt", b, isEquivalent(b, a));
for (const g of gens) for (let i = 0; i < 3; i++) { const e = g.make(); console.log(g.id, "|", e.promptTex, "|", e.answerTex); }
console.log("seconds", (Date.now() - T0) / 1000);
