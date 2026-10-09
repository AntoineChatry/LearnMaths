// Independent bench for chaines-markov: answers recomputed from the matrices and data in the prompt.
import katex from "file:///F:/WebWorkspace/LearnMaths/node_modules/katex/dist/katex.mjs";
import { chainesMarkovGenerators as gens, chainesMarkovCards as cards, isEquivalent, ce } from "./bundle_mk.mjs";

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
const law = (p) => {
  const m = p.match(/u = \((.*?)\) \\qquad/);
  if (!m) throw new Error("no u");
  const u = m[1].split(",\\ ").map(val);
  if (Math.abs(u.reduce((a, b) => a + b, 0) - 1) > 1e-12) throw new Error("u not a law");
  return u;
};

function expected(id, e) {
  const p = e.promptTex;
  if (id === "mk-deux-pas") {
    const A = matrix(p);
    const [, j, i] = p.match(/P\(X_2 = (\d) \\mid X_0 = (\d)\)/).map(Number);
    return A[i - 1].reduce((s, a, k) => s + a * A[k][j - 1], 0);
  }
  if (id === "mk-loi") {
    const A = matrix(p), u = law(p);
    const j = +p.match(/P\(X_1 = (\d)\)/)[1];
    return u.reduce((s, ui, i) => s + ui * A[i][j - 1], 0);
  }
  if (id === "mk-trajectoire") {
    const A = matrix(p), u = law(p);
    const path = p.match(/= \(([\d, ]+)\)\\big\)/)[1].split(", ").map((x) => +x - 1);
    let r = u[path[0]];
    for (let t = 1; t < path.length; t++) r *= A[path[t - 1]][path[t]];
    return r;
  }
  if (id === "mk-bigramme") {
    let m;
    if ((m = p.match(/C\(\\text\{(\S+)\}\) = (\d+) \\qquad C\(\\text\{\1 (\S+)\}\) = (\d+)/))) return +m[4] / +m[2];
    const given = [...p.matchAll(/P\(([^|]+?) \\mid ([^)]+?)\) = (\\frac\{\d+\}\{\d+\})/g)];
    // The given transitions must chain the sentence: <s> -> w1 -> w2 -> </s>.
    const sent = p.match(/P\(\\texttt\{<s>\}\\ (.*)\) = \\ \?/)[1].split("\\ ");
    const states = ["\\texttt{<s>}", ...sent];
    if (given.length !== states.length - 1) throw new Error("count");
    given.forEach((g, k) => { if (g[2] !== states[k] || g[1] !== states[k + 1]) throw new Error("chain " + g[0]); });
    return given.reduce((x, g) => x * val(g[3]), 1);
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
    if (exp === 0) st.zero++;
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
// Alternative forms a learner may type.
const alt = [
  ["\\frac{3}{8}", "0,375"],
  ["\\frac{3}{8}", "0.375"],
  ["0{,}58", "0,58"],
  ["0{,}58", "\\frac{58}{100}"],
  ["\\frac{1}{16}", "0.0625"],
];
for (const [a, b] of alt) console.log("alt", b, isEquivalent(b, a));
for (const g of gens) for (let i = 0; i < 3; i++) { const e = g.make(); console.log(g.id, "|", e.promptTex, "|", e.answerTex); }
console.log("seconds", (Date.now() - T0) / 1000);
