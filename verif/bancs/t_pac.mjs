import katex from "file:///F:/WebWorkspace/LearnMaths/node_modules/katex/dist/katex.mjs";
import { pacGenerators as gens, pacCards as cards, isEquivalent, ce } from "./bundle_pac.mjs";

const N_RUNS = 3000;
let rendered = 0, katexErr = 0;
const render = (t, where, display = true) => {
  rendered++;
  try { katex.renderToString(t, { throwOnError: true, displayMode: display }); }
  catch (e) { if (katexErr++ < 10) console.log("KATEX", where, "|", t.slice(0, 160), "|", e.message.slice(0, 100)); }
};
const inline = (s, where) => { for (const m of (s ?? "").matchAll(/\$([^$]+)\$/g)) render(m[1], where, false); };
// Same decimal-comma normalization as the app (checkAnswer.normalizeDecimalComma).
const num = (tex) => ce.parse(tex.replace(/(\d)\s*(?:\{,\}|,)\s*(?=\d)/g, "$1.")).N().re;

const val = (s) => {
  s = s.trim();
  let m;
  if ((m = s.match(/^\\frac\{(\d+)\}\{(\d+)\}$/))) return +m[1] / +m[2];
  if ((m = s.match(/^(\d+)\{,\}(\d+)$/))) return +`${m[1]}.${m[2]}`;
  if (/^\d+$/.test(s)) return +s;
  throw new Error("bad value " + s);
};
const field = (p, name) => {
  const m = p.match(new RegExp(name + " = (\\S+)"));
  if (!m) throw new Error("no " + name + " in " + p);
  return val(m[1]);
};

function expected(id, e) {
  const p = e.promptTex, intro = e.intro;
  if (id === "pac-ecart") {
    const H = field(p, "\\|H\\|"), m = field(p, "m"), d = field(p, "\\\\delta");
    if (!intro.includes(`parmi ${H} `) || !intro.includes(`${m} exemples`)) throw new Error("intro");
    return Math.sqrt((Math.log(H) + Math.log(2 / d)) / (2 * m));
  }
  if (id === "pac-realisable") {
    const H = field(p, "\\|H\\|"), d = field(p, "\\\\delta");
    if (!intro.includes(`des ${H} modèles`)) throw new Error("intro H");
    if (p.includes("R(\\hat h)")) {
      const m = field(p, "m");
      if (!intro.includes(`sur ${m} exemples`)) throw new Error("intro m");
      return (Math.log(H) + Math.log(1 / d)) / m;
    }
    const eps = field(p, "\\\\varepsilon");
    return (Math.log(H) + Math.log(1 / d)) / eps;
  }
  if (id === "pac-erm") {
    const eps = field(p, "\\\\varepsilon");
    if (p.includes("R(h^*)")) return val(p.match(/R\(h\^\*\) = (\S+)/)[1]) + 2 * eps;
    return val(p.match(/\\hat R_S\(\\hat h\) = (\S+)/)[1]) + eps;
  }
  if (id === "pac-bits") {
    const W = field(p, "W"), b = +p.match(/(\d+) \\text\{ bits/)[1];
    if (!intro.includes(`(${b} bits)`) || intro.replace(/\u202f|\u00a0/g, "").indexOf(String(W)) < 0) throw new Error("intro");
    return b * W * Math.log(2);
  }
}

const issues = [];
const stats = {};
for (const g of gens) {
  stats[g.id] = { n: 0, mismatch: 0, selfFail: 0, mutAccepted: 0, answers: new Set() };
  for (let i = 0; i < N_RUNS; i++) {
    const e = g.make();
    const s = stats[g.id];
    s.n++;
    s.answers.add(e.answerTex);
    render(e.promptTex, g.id); render(e.answerTex, g.id);
    for (const t of e.solution) render(t, g.id);
    inline(e.intro, g.id); inline(e.hint, g.id);
    let exp;
    try { exp = expected(g.id, e); } catch (err) { s.mismatch++; if (issues.length < 10) issues.push({ id: g.id, err: err.message, prompt: e.promptTex }); continue; }
    const got = num(e.answerTex);
    if (!Number.isFinite(got) || Math.abs(got - exp) > 1e-9 * Math.max(1, Math.abs(exp))) {
      s.mismatch++;
      if (issues.length < 10) issues.push({ id: g.id, prompt: e.promptTex, answer: e.answerTex, got, exp });
    }
    if (!isEquivalent(e.answerTex, e.answerTex)) s.selfFail++;
    // A decimal typed by a learner, with a comma or a point, must be accepted.
    if (g.id === "pac-erm") {
      const typed = String(Math.round(exp * 100) / 100);
      if (!isEquivalent(typed.replace(".", ","), e.answerTex) || !isEquivalent(typed, e.answerTex)) s.selfFail++;
    }
    if (isEquivalent(`${e.answerTex}+\\frac{1}{1000}`, e.answerTex) || isEquivalent(`2\\left(${e.answerTex}\\right)`, e.answerTex)) s.mutAccepted++;
  }
}
for (const [id, s] of Object.entries(stats)) console.log(id, "n", s.n, "mismatch", s.mismatch, "selfFail", s.selfFail, "mutationAccepted", s.mutAccepted, "distinct", s.answers.size);
console.log("issues", JSON.stringify(issues, null, 1));
for (const c of cards) { inline(c.front, c.id); inline(c.back, c.id); }
console.log("rendered", rendered, "katex errors", katexErr);
for (const g of gens) for (let i = 0; i < 2; i++) { const e = g.make(); console.log(g.id, "|", e.promptTex, "|", e.answerTex); }
