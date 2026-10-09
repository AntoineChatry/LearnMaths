// Independent bench for grande-dimension: answers recomputed from the prompt.
import katex from "file:///F:/WebWorkspace/LearnMaths/node_modules/katex/dist/katex.mjs";
import { grandeDimensionGenerators as gens, grandeDimensionCards as cards, isEquivalent, ce } from "./bundle_gd.mjs";

const N_RUNS = 3000;
let rendered = 0, katexErr = 0;
const render = (t, where, display = true) => {
  rendered++;
  try { katex.renderToString(t, { throwOnError: true, displayMode: display }); }
  catch (e) { if (katexErr++ < 10) console.log("KATEX", where, "|", t.slice(0, 160), "|", e.message.slice(0, 100)); }
};
const inline = (s, where) => { for (const m of (s ?? "").matchAll(/\$([^$]+)\$/g)) render(m[1], where, false); };
const num = (tex) => ce.parse(tex.replace(/(\d)\s*(?:\{,\}|,)\s*(?=\d)/g, "$1.")).N().re;
const val = (s) => {
  let m;
  if ((m = s.match(/^\\frac(\d)(\d)$/))) return +m[1] / +m[2];
  if ((m = s.match(/^(\d+)\{,\}(\d+)$/))) return +`${m[1]}.${m[2]}`;
  if (/^\d+$/.test(s)) return +s;
  throw new Error("bad value " + s);
};
const field = (p, name) => {
  const m = p.match(new RegExp("(?:^|\\s)" + name + " = (\\S+)"));
  if (!m) throw new Error("no " + name + " in " + p);
  return val(m[1]);
};

function expected(id, e) {
  const p = e.promptTex;
  if (id === "gd-norme") {
    const d = field(p, "d"), s2 = field(p, "\\\\sigma\\^2");
    if (p.includes("\\|X - Y\\|^2")) return 2 * d * s2;
    if (p.includes("\\mathbb E\\,\\|X\\|^2")) return d * s2;
    if (p.includes("\\|X\\| \\approx")) return Math.sqrt(d * s2);
    throw new Error("kind");
  }
  if (id === "gd-attention") {
    const dk = field(p, "d_k"), vq = field(p, "\\\\mathrm\\{Var\\}\\(q_i\\)"), vk = field(p, "\\\\mathrm\\{Var\\}\\(k_i\\)");
    if (p.includes("\\mathrm{Var}(q \\cdot k) =")) return dk * vq * vk;
    if (p.includes("\\sigma(q \\cdot k)")) return Math.sqrt(dk * vq * vk);
    if (p.includes("\\sqrt{d_k}}\\Big)")) return Math.sqrt(vq * vk);
    throw new Error("kind");
  }
  if (id === "gd-cosinus") {
    const d = field(p, "d");
    if (p.includes("\\cos^2")) return 1 / Math.sqrt(d);
    // The prompt itself must tell the two cases apart, and agree with the intro.
    if (p.includes("X_i, Y_i \\sim N(0, 1)")) { if (!e.intro.includes("sans normalisation")) throw new Error("intro"); return d; }
    if (p.includes("\\|X\\| = \\|Y\\| = 1")) { if (!e.intro.includes("unitaires")) throw new Error("intro"); return 1 / d; }
    throw new Error("kind");
  }
  if (id === "gd-jl") {
    if (p.includes("k = \\ ?")) {
      const N = field(p, "N"), eps = field(p, "\\\\varepsilon");
      return (20 * Math.log(N)) / (eps * eps);
    }
    return (field(p, "m") / field(p, "n")) * field(p, "\\\\\\|z\\\\\\|\\^2");
  }
}

const issues = [];
const stats = {};
for (const g of gens) {
  const st = (stats[g.id] = { n: 0, mismatch: 0, selfFail: 0, mutAccepted: 0, zero: 0, answers: new Set() });
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
  ["2000\\ln 1000", "\\frac{20\\ln(1000)}{0.01}"],
  ["2000\\ln 1000", "6000\\ln 10"],
  ["\\frac{1}{20}", "0,05"],
  ["\\frac{15}{2}", "7.5"],
];
for (const [a, b] of alt) console.log("alt", b, isEquivalent(b, a));
for (const g of gens) for (let i = 0; i < 3; i++) { const e = g.make(); console.log(g.id, "|", e.promptTex, "|", e.answerTex); }
