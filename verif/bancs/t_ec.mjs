import katex from "file:///F:/WebWorkspace/LearnMaths/node_modules/katex/dist/katex.mjs";
import { entropieCroiseeGenerators as gens, entropieCroiseeCards as cards, isEquivalent, ce } from "./bundle_ec.mjs";

const r = String.raw;
const N = 3000;
let rendered = 0, katexErr = 0;
const render = (t, where, display = true) => {
  rendered++;
  try { katex.renderToString(t, { throwOnError: true, displayMode: display }); }
  catch (e) { if (katexErr++ < 10) console.log("KATEX", where, "|", t.slice(0, 160), "|", e.message.slice(0, 100)); }
};
const inline = (s, where) => { for (const m of (s ?? "").matchAll(/\$([^$]+)\$/g)) render(m[1], where, false); };
const num = (tex) => ce.parse(tex).N().re;
const log2 = Math.log2;
const fracVal = (s) => { const m = s.match(/^\\frac\{(\d+)\}\{(\d+)\}$/); if (m) return +m[1] / +m[2]; if (!/^\d+$/.test(s)) throw new Error("bad entry " + s); return +s; };
// All laws written as \left( a,\ b, ... \right) in the prompt, keyed by the name before " = ".
function laws(p) {
  const out = {};
  for (const m of p.matchAll(/(\w) = \\left\((.*?)\\right\)/g)) {
    const v = m[2].split(",\\ ").map(fracVal);
    out[m[1]] = v;
  }
  return out;
}
const isLaw = (v) => Math.abs(v.reduce((a, b) => a + b, 0) - 1) < 1e-12 && v.every((x) => x > 0);

function expected(id, e) {
  const p = e.promptTex;
  if (id === "ec-croisee") {
    const L = laws(p);
    if (!isLaw(L.p)) throw new Error("p " + p);
    if (e.intro.includes("uniforme")) {
      const K = +e.intro.match(/sur (\d+) symboles/)[1];
      if (L.p.length !== K) throw new Error("K " + p);
      return L.p.reduce((s, x) => s + x * log2(K), 0);
    }
    if (!isLaw(L.q) || L.q.length !== L.p.length) throw new Error("q " + p);
    return L.p.reduce((s, x, i) => s + x * log2(1 / L.q[i]), 0);
  }
  if (id === "ec-kl") {
    const L = laws(p);
    if (!isLaw(L.p) || !isLaw(L.q) || L.p.length !== L.q.length) throw new Error("laws " + p);
    const [P, Q] = e.intro.includes("(p \\,\\|\\, q)") ? [L.p, L.q] : e.intro.includes("(q \\,\\|\\, p)") ? [L.q, L.p] : [null, null];
    if (!P) throw new Error("direction " + e.intro);
    return P.reduce((s, x, i) => s + x * log2(x / Q[i]), 0);
  }
  if (id === "ec-perplexite") {
    let m;
    if ((m = p.match(/^q\(w_i \\mid w_\{<i\}\) = \\frac\{1\}\{(\d+)\}/))) return Math.exp(-Math.log(1 / +m[1]));
    if ((m = p.match(/^L = (\d*)\\ln 2 \\text\{ nats/))) return Math.exp((m[1] ? +m[1] : 1) * Math.log(2));
    if ((m = p.match(/^L = (\d+) \\text\{ bits/))) return 2 ** +m[1];
    const q = laws(p).q;
    const n = +e.intro.match(/de (\d+) tokens/)[1];
    if (q.length !== n) throw new Error("n " + p);
    return Math.exp(-q.reduce((s, x) => s + Math.log(x), 0) / n);
  }
}

const issues = [];
const stats = {};
for (const g of gens) {
  stats[g.id] = { n: 0, mismatch: 0, selfFail: 0, mutAccepted: 0, answers: new Set(), zero: 0 };
  for (let i = 0; i < N; i++) {
    const e = g.make();
    const s = stats[g.id];
    s.n++;
    s.answers.add(e.answerTex);
    render(e.promptTex, g.id); render(e.answerTex, g.id);
    for (const t of e.solution) render(t, g.id);
    inline(e.intro, g.id); inline(e.hint, g.id);
    let exp;
    try { exp = expected(g.id, e); } catch (err) { s.mismatch++; if (issues.length < 10) issues.push({ id: g.id, err: err.message }); continue; }
    if (Math.abs(exp) < 1e-12) s.zero++;
    const got = num(e.answerTex);
    if (!Number.isFinite(got) || Math.abs(got - exp) > 1e-9 * Math.max(1, Math.abs(exp))) {
      s.mismatch++;
      if (issues.length < 10) issues.push({ id: g.id, prompt: e.promptTex, answer: e.answerTex, got, exp });
    }
    if (!isEquivalent(e.answerTex, e.answerTex)) s.selfFail++;
    if (isEquivalent(`${e.answerTex}+\\frac{1}{8}`, e.answerTex) || isEquivalent(`2\\left(${e.answerTex}\\right)`, e.answerTex)) s.mutAccepted++;
  }
}
for (const [id, s] of Object.entries(stats)) console.log(id, "n", s.n, "mismatch", s.mismatch, "selfFail", s.selfFail, "mutationAccepted", s.mutAccepted, "zeroAnswers", s.zero, "distinct", s.answers.size);
console.log("issues", JSON.stringify(issues, null, 1));
for (const c of cards) { inline(c.front, c.id); inline(c.back, c.id); }
console.log("rendered", rendered, "katex errors", katexErr);
for (const [a, b] of [
  [r`0.625`, r`\frac{5}{8}`], [r`0,625`, r`\frac{5}{8}`], [r`\frac{10}{16}`, r`\frac{5}{8}`], [r`2^3`, r`8`], [r`e^{3\ln 2}`, r`8`], [r`-\frac{1}{4}`, r`\frac{1}{4}`],
]) console.log(`[${a}] vs [${b}] ->`, isEquivalent(a, b));
