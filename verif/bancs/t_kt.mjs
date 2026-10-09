import katex from "file:///F:/WebWorkspace/LearnMaths/node_modules/katex/dist/katex.mjs";
import { klEntrainementGenerators as gens, klEntrainementCards as cards, isEquivalent, ce } from "./bundle_kt.mjs";

const N = 3000;
let rendered = 0, katexErr = 0;
const render = (t, where, display = true) => {
  rendered++;
  try { katex.renderToString(t, { throwOnError: true, displayMode: display }); }
  catch (e) { if (katexErr++ < 10) console.log("KATEX", where, "|", t.slice(0, 160), "|", e.message.slice(0, 100)); }
};
const inline = (s, where) => { for (const m of (s ?? "").matchAll(/\$([^$]+)\$/g)) render(m[1], where, false); };
const num = (tex) => ce.parse(tex).N().re;

// Plain number cell: integer, (-)\frac{a}{b}, 0{,}5.
const val = (s) => {
  s = s.trim();
  let m;
  if ((m = s.match(/^(-?)\\frac\{(\d+)\}\{(\d+)\}$/))) return (m[1] ? -1 : 1) * (+m[2] / +m[3]);
  if ((m = s.match(/^(\d+)\{,\}(\d+)$/))) return +`${m[1]}.${m[2]}`;
  if (s === "\\tfrac12") return 0.5;
  if (/^-?\d+$/.test(s)) return +s;
  throw new Error("bad cell " + s);
};
// "k\ln a", "\ln a", "0", "2\ln 9" -> number
const lnCell = (s) => {
  s = s.trim();
  if (s === "0") return 0;
  const m = s.match(/^(\d*)\\ln (\d+)$/);
  if (!m) throw new Error("bad ln cell " + s);
  return (m[1] === "" ? 1 : +m[1]) * Math.log(+m[2]);
};
const list = (s) => s.split(",\\ ");
// Contents of the laws written \left( ... \right), in order.
const laws = (p) => [...p.matchAll(/\\left\((.*?)\\right\)/g)].map((m) => list(m[1]).map(val));

function expected(id, e) {
  const p = e.promptTex;
  if (id === "kt-gauss") {
    let mu, s2;
    if (p.startsWith("\\mu = (")) {
      mu = list(p.match(/^\\mu = \((.*?)\) \\qquad/)[1]).map(val);
      s2 = laws(p)[0];
    } else {
      const m = p.match(/^\\mu = (-?\d+) \\qquad \\sigma\^2 = (.+)$/);
      mu = [+m[1]];
      s2 = [val(m[2])];
    }
    if (mu.length !== s2.length) throw new Error("dims");
    return mu.reduce((s, m, j) => s + 0.5 * (m * m + s2[j] - 1 - Math.log(s2[j])), 0);
  }
  if (id === "kt-elbo") {
    const [joint, q] = laws(p);
    if (Math.abs(q.reduce((a, b) => a + b, 0) - 1) > 1e-12) throw new Error("q not normalized");
    const px = joint.reduce((a, b) => a + b, 0);
    if (px >= 1) throw new Error("p(x) >= 1");
    const L = q.reduce((s, qi, i) => s + qi * (Math.log2(joint[i]) - Math.log2(qi)), 0);
    // gap computed independently, as the KL to the posterior
    const gap = q.reduce((s, qi, i) => s + qi * Math.log2(qi / (joint[i] / px)), 0);
    if (Math.abs(Math.log2(px) - L - gap) > 1e-12) throw new Error("identity broken");
    return e.intro.includes("l'écart") ? gap : L;
  }
  if (id === "kt-distillation") {
    const T = +e.intro.match(/T = (\d+)/)[1];
    if (p.startsWith("v = ")) {
      const v = list(p.match(/^v = \((.*?)\) \\qquad/)[1]).map(lnCell);
      const j = +p.match(/p_\{(\d+)\}$/)[1] - 1;
      if (+p.match(/T = (\d+)/)[1] !== T) throw new Error("T mismatch");
      const ex = v.map((x) => Math.exp(x / T));
      return ex[j] / ex.reduce((a, b) => a + b, 0);
    }
    const [pp, q] = laws(p);
    for (const d of [pp, q]) if (Math.abs(d.reduce((a, b) => a + b, 0) - 1) > 1e-12) throw new Error("not normalized");
    const i = +e.intro.match(/z_\{(\d+)\}/)[1] - 1;
    return (q[i] - pp[i]) / T;
  }
  if (id === "kt-rlhf") {
    if (p.startsWith("\\begin{gathered}")) {
      const ref = laws(p)[0];
      if (Math.abs(ref.reduce((a, b) => a + b, 0) - 1) > 1e-12) throw new Error("ref not normalized");
      const r = list(p.match(/r = \((.*?)\) \\qquad/)[1]).map(lnCell);
      const beta = val(p.match(/\\beta = (.*?) \\end/)[1]);
      if (Math.abs(+e.intro.match(/\\beta = ([\d/]+)\$/)[1].split("/").reduce((a, b) => a / b) - beta) > 1e-12) throw new Error("beta mismatch");
      const j = +e.intro.match(/réponse (\d+)/)[1] - 1;
      const w = ref.map((x, i) => x * Math.exp(r[i] / beta));
      return w[j] / w.reduce((a, b) => a + b, 0);
    }
    const ratios = laws(p)[0];
    const r = +p.match(/r = (\d+)/)[1];
    const beta = val(p.match(/\\beta = (.+)$/)[1]);
    if (+e.intro.match(/r = (\d+)/)[1] !== r || +e.intro.match(/de (\d+) tokens/)[1] !== ratios.length) throw new Error("intro mismatch");
    return r - beta * ratios.reduce((s, x) => s + Math.log(x), 0);
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
    try { exp = expected(g.id, e); } catch (err) { s.mismatch++; if (issues.length < 10) issues.push({ id: g.id, err: err.message, prompt: e.promptTex }); continue; }
    if (Math.abs(exp) < 1e-12) s.zero++;
    const got = num(e.answerTex);
    if (!Number.isFinite(got) || Math.abs(got - exp) > 1e-9 * Math.max(1, Math.abs(exp))) {
      s.mismatch++;
      if (issues.length < 10) issues.push({ id: g.id, prompt: e.promptTex, answer: e.answerTex, got, exp });
    }
    if (!isEquivalent(e.answerTex, e.answerTex)) s.selfFail++;
    if (isEquivalent(`${e.answerTex}+\\frac{1}{8}`, e.answerTex) || isEquivalent(`2\\left(${e.answerTex}\\right)+1`, e.answerTex)) s.mutAccepted++;
  }
}
for (const [id, s] of Object.entries(stats)) console.log(id, "n", s.n, "mismatch", s.mismatch, "selfFail", s.selfFail, "mutationAccepted", s.mutAccepted, "zeroAnswers", s.zero, "distinct", s.answers.size);
console.log("issues", JSON.stringify(issues, null, 1));
for (const c of cards) { inline(c.front, c.id); inline(c.back, c.id); }
console.log("rendered", rendered, "katex errors", katexErr);
// A few samples per generator, to read
for (const g of gens) for (let i = 0; i < 2; i++) { const e = g.make(); console.log(g.id, "|", e.promptTex, "|", e.answerTex); }
