import katex from "file:///F:/WebWorkspace/LearnMaths/node_modules/katex/dist/katex.mjs";
import { entropieGenerators as gens, entropieCards, isEquivalent, ce } from "./bundle_en.mjs";

const r = String.raw;
const N = 2000;
let rendered = 0, katexErr = 0;
const render = (t, where, display = true) => {
  rendered++;
  try { katex.renderToString(t, { throwOnError: true, displayMode: display }); }
  catch (e) { if (katexErr++ < 10) console.log("KATEX", where, "|", t.slice(0, 160), "|", e.message.slice(0, 100)); }
};
const inline = (s, where) => { for (const m of (s ?? "").matchAll(/\$([^$]+)\$/g)) render(m[1], where, false); };
const num = (tex) => ce.parse(tex).N().re;
const log2 = Math.log2;

// Independent recomputation of the expected answer from the prompt only.
const fracVal = (s) => { const m = s.match(/\\frac\{(\d+)\}\{(\d+)\}/); return m ? +m[1] / +m[2] : +s; };
function expected(id, e) {
  const p = e.promptTex;
  if (id === "en-surprise") {
    if (e.intro.startsWith("Deux")) { const ps = [...p.matchAll(/\\frac\{1\}\{(\d+)\}/g)].map((m) => 1 / +m[1]); return log2(1 / (ps[0] * ps[1])); }
    if (e.intro.startsWith("Apprendre")) { const h = +p.match(/h = (\d+)/)[1]; return 2 ** -h; }
    const q = 1 / +p.match(/\\frac\{1\}\{(\d+)\}/)[1];
    return p.includes("nats") ? Math.log(1 / q) : log2(1 / q);
  }
  if (id === "en-dyadique") {
    const ps = p.match(/\\left\((.*)\\right\)/)[1].split(",\\ ").map(fracVal);
    if (Math.abs(ps.reduce((a, b) => a + b, 0) - 1) > 1e-12) throw new Error("not a distribution " + p);
    return ps.reduce((s, q) => s + q * log2(1 / q), 0);
  }
  if (id === "en-uniforme") {
    const K = +p.match(/K = (\d+)/)[1];
    return e.intro.includes("nats") ? Math.log(K) : log2(K);
  }
  if (id === "en-decomposition") {
    // Build the full distribution over all symbols, then take its entropy directly.
    const groups = [...p.matchAll(/P\(\w\) = (\\frac\{\d+\}\{\d+\}|\d+),\\ (\d+) \\text/g)].map((m) => [fracVal(m[1]), +m[2]]);
    if (Math.abs(groups.reduce((s, g) => s + g[0], 0) - 1) > 1e-12) throw new Error("groups " + p);
    let H = 0;
    for (const [q, n] of groups) for (let i = 0; i < n; i++) H += (q / n) * log2(n / q);
    return H;
  }
  if (id === "en-huffman") {
    const w = p.match(/n = \((.*)\)/)[1].split(",\\ ").map(Number);
    const W = w.reduce((a, b) => a + b, 0);
    // Exhaustive search: best expected length over all length vectors satisfying Kraft (prefix code exists).
    const K = w.length;
    let best = Infinity;
    const l = new Array(K).fill(1);
    const rec = (i) => {
      if (i === K) {
        if (l.reduce((s, li) => s + 2 ** -li, 0) <= 1 + 1e-12) best = Math.min(best, w.reduce((s, wi, j) => s + wi * l[j], 0));
        return;
      }
      for (let v = 1; v <= K - 1; v++) { l[i] = v; rec(i + 1); }
    };
    rec(0);
    return best / W;
  }
}

const issues = [];
const stats = {};
for (const g of gens) {
  stats[g.id] = { n: 0, mismatch: 0, selfFail: 0, mutAccepted: 0, answers: new Set() };
  for (let i = 0; i < N; i++) {
    const e = g.make();
    const s = stats[g.id];
    s.n++;
    s.answers.add(e.answerTex);
    render(e.promptTex, g.id); render(e.answerTex, g.id);
    for (const t of e.solution) render(t, g.id);
    inline(e.intro, g.id); inline(e.hint, g.id);
    const exp = expected(g.id, e);
    const got = num(e.answerTex);
    if (!Number.isFinite(got) || Math.abs(got - exp) > 1e-9 * Math.max(1, Math.abs(exp))) {
      s.mismatch++;
      if (issues.length < 10) issues.push({ id: g.id, prompt: e.promptTex, answer: e.answerTex, got, exp });
    }
    if (!isEquivalent(e.answerTex, e.answerTex)) s.selfFail++;
    if (isEquivalent(`${e.answerTex}+\\frac{1}{8}`, e.answerTex) || isEquivalent(`2\\left(${e.answerTex}\\right)`, e.answerTex)) s.mutAccepted++;
    // The last solution line must end with the answer's value.
    const last = e.solution.at(-1);
  }
}
for (const [id, s] of Object.entries(stats)) console.log(id, "n", s.n, "mismatch", s.mismatch, "selfFail", s.selfFail, "mutationAccepted", s.mutAccepted, "distinct answers", s.answers.size);
console.log("issues", JSON.stringify(issues, null, 1));
for (const c of entropieCards) { inline(c.front, c.id); inline(c.back, c.id); }
console.log("rendered", rendered, "katex errors", katexErr);

// How the checker treats natural student inputs.
for (const [a, b] of [
  [r`\log_2(6)`, r`\log_2 6`], [r`\frac{\ln 6}{\ln 2}`, r`\log_2 6`], [r`1+\log_2 3`, r`\log_2 6`], [r`\log_2 7`, r`\log_2 6`],
  [r`\ln(10)`, r`\ln 10`], [r`\ln 2+\ln 5`, r`\ln 10`], [r`3\ln(2)`, r`3\ln 2`], [r`\ln 8`, r`3\ln 2`], [r`\ln 2^3`, r`3\ln 2`],
  [r`2.585`, r`\log_2 6`], [r`\frac{7}{4}`, r`\frac{7}{4}`], [r`1.75`, r`\frac{7}{4}`], [r`1,75`, r`\frac{7}{4}`], [r`2^{-5}`, r`\frac{1}{32}`],
  [r`\log_2 100`, r`\log_2 100`], [r`2\log_2 10`, r`\log_2 100`],
]) console.log(`[${a}] vs [${b}] ->`, isEquivalent(a, b));
