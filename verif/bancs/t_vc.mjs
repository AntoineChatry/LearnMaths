// Independent bench for vc-dimension: answers recomputed from the prompt (brute force for growth functions).
import katex from "file:///F:/WebWorkspace/LearnMaths/node_modules/katex/dist/katex.mjs";
import { vcDimensionGenerators as gens, vcDimensionCards as cards, isEquivalent, ce } from "./bundle_vc.mjs";

const N_RUNS = 3000;
let rendered = 0, katexErr = 0;
const render = (t, where, display = true) => {
  rendered++;
  try { katex.renderToString(t, { throwOnError: true, displayMode: display }); }
  catch (e) { if (katexErr++ < 10) console.log("KATEX", where, "|", t.slice(0, 160), "|", e.message.slice(0, 100)); }
};
const inline = (s, where) => { for (const m of (s ?? "").matchAll(/\$([^$]+)\$/g)) render(m[1], where, false); };
const num = (tex) => ce.parse(tex.replace(/(\d)\s*(?:\{,\}|,)\s*(?=\d)/g, "$1.")).N().re;
const int = (p, name) => { const m = p.match(new RegExp("(?:^|\\s)" + name + " = (\\d+)")); if (!m) throw new Error("no " + name); return +m[1]; };

// Brute force: count labelings of m ordered points that a predicate accepts.
const count = (m, ok) => { let c = 0; for (let mask = 0; mask < 1 << m; mask++) { const y = Array.from({ length: m }, (_, i) => (mask >> i) & 1); if (ok(y)) c++; } return c; };
const s = (y) => y.join("");
const threshold = (y) => /^0*1*$/.test(s(y));
const rays = (y) => /^0*1*$/.test(s(y)) || /^1*0*$/.test(s(y));
const interval = (y) => /^0*1*0*$/.test(s(y));
const C = (m, k) => { let c = 1; for (let i = 1; i <= k; i++) c = (c * (m - i + 1)) / i; return Math.round(c); };

function expected(id, e) {
  const p = e.promptTex, intro = e.intro;
  if (id === "vc-dichotomies") {
    const m = int(p, "m");
    if (intro.includes("deux sens")) return count(m, rays);
    if (intro.includes("seuils")) return count(m, threshold);
    if (intro.includes("intervalles")) return count(m, interval);
    throw new Error("kind");
  }
  if (id === "vc-dimension") {
    let m;
    if ((m = p.match(/w \\in \\mathbb R\^\{(\d+)\}/))) {
      if (!intro.includes(`\\mathbb R^{${m[1]}}`)) throw new Error("intro n");
      return +m[1] + 1;
    }
    if ((m = p.match(/\\text\{(\d+)-gones convexes\}/))) {
      if (!intro.includes(`à ${m[1]} sommets`)) throw new Error("intro d");
      return 2 * +m[1] + 1;
    }
    if (p.includes("x \\ge t")) return 1;
    if (p.includes("a \\le x \\le b")) return 2;
    if (p.includes("rectangles")) return 4;
    throw new Error("class");
  }
  if (id === "vc-sauer") {
    const d = int(p, "d"), m = int(p, "m");
    let t = 0; for (let i = 0; i <= d; i++) t += C(m, i);
    return t;
  }
  if (id === "vc-borne") {
    const d = int(p, "d");
    if (p.includes("\\sqrt")) { const m = int(p, "m"); return Math.sqrt((2 * d * Math.log((Math.E * m) / d)) / m); }
    const eps = +p.match(/\\varepsilon = (0\{,\}\d+)/)[1].replace("{,}", ".");
    return d / (320 * eps * eps);
  }
}

const issues = [];
const stats = {};
for (const g of gens) {
  const st = (stats[g.id] = { n: 0, mismatch: 0, selfFail: 0, mutAccepted: 0, answers: new Set() });
  for (let i = 0; i < N_RUNS; i++) {
    const e = g.make();
    st.n++;
    st.answers.add(e.answerTex);
    render(e.promptTex, g.id); render(e.answerTex, g.id, false);
    for (const t of e.solution) render(t, g.id);
    inline(e.intro, g.id); inline(e.hint, g.id);
    let exp;
    try { exp = expected(g.id, e); } catch (err) { st.mismatch++; if (issues.length < 10) issues.push({ id: g.id, err: err.message, prompt: e.promptTex }); continue; }
    const got = num(e.answerTex);
    if (!Number.isFinite(got) || Math.abs(got - exp) > 1e-9 * Math.max(1, Math.abs(exp))) {
      st.mismatch++;
      if (issues.length < 10) issues.push({ id: g.id, prompt: e.promptTex, answer: e.answerTex, got, exp });
    }
    if (!isEquivalent(e.answerTex, e.answerTex)) st.selfFail++;
    if (isEquivalent(`${e.answerTex}+\\frac{1}{1000}`, e.answerTex) || isEquivalent(`2\\left(${e.answerTex}\\right)`, e.answerTex)) st.mutAccepted++;
  }
}
for (const [id, st] of Object.entries(stats)) console.log(id, "n", st.n, "mismatch", st.mismatch, "selfFail", st.selfFail, "mutationAccepted", st.mutAccepted, "distinct", st.answers.size);
console.log("issues", JSON.stringify(issues, null, 1));
for (const c of cards) { inline(c.front, c.id); inline(c.back, c.id); }
console.log("rendered", rendered, "katex errors", katexErr);
// Alternative forms a learner may type.
const alt = [
  ["\\sqrt{\\frac{2\\ln(10e)}{10}}", "\\sqrt{\\frac{2(1+\\ln 10)}{10}}"],
  ["\\sqrt{\\frac{2\\ln(100e)}{100}}", "\\sqrt{0.02(1+\\ln(100))}"],
  ["\\frac{5}{4}", "1,25"],
];
for (const [a, b] of alt) console.log("alt", b, isEquivalent(b, a));
for (const g of gens) for (let i = 0; i < 2; i++) { const e = g.make(); console.log(g.id, "|", e.promptTex, "|", e.answerTex); }
