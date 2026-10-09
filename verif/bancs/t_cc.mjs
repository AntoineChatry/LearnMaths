import katex from "file:///F:/WebWorkspace/LearnMaths/node_modules/katex/dist/katex.mjs";
import { hoeffdingGenerators as gens, hoeffdingCards as cards, isEquivalent, ce } from "./bundle_cc.mjs";

const N_RUNS = 3000;
let rendered = 0, katexErr = 0;
const render = (t, where, display = true) => {
  rendered++;
  try { katex.renderToString(t, { throwOnError: true, displayMode: display }); }
  catch (e) { if (katexErr++ < 10) console.log("KATEX", where, "|", t.slice(0, 160), "|", e.message.slice(0, 100)); }
};
const inline = (s, where) => { for (const m of (s ?? "").matchAll(/\$([^$]+)\$/g)) render(m[1], where, false); };
const num = (tex) => ce.parse(tex).N().re;

const val = (s) => {
  s = s.trim();
  let m;
  if ((m = s.match(/^\\t?frac\{?(\d+)\}?\{?(\d+)\}?$/))) return +m[1] / +m[2];
  if ((m = s.match(/^(\d+)\{,\}(\d+)$/))) return +`${m[1]}.${m[2]}`;
  if (/^-?\d+$/.test(s)) return +s;
  throw new Error("bad value " + s);
};

function expected(id, e) {
  const p = e.promptTex, intro = e.intro;
  if (id === "cc-markov") {
    let m;
    if ((m = p.match(/^X \\ge 0 \\qquad \\mathbb E\[X\] = (\d+) \\qquad P\(X \\ge (\d+)\)/))) {
      if (!intro.includes(`vaut ${m[1]} en moyenne`) || !intro.includes(`au moins ${m[2]} secondes`)) throw new Error("intro");
      return +m[1] / +m[2];
    }
    if ((m = p.match(/^\\mathbb E\[X\] = (\d+) \\qquad \\operatorname\{Var\}\(X\) = (\d+) \\qquad P\(\|X - (\d+)\| \\ge (\d+)\)/))) {
      if (m[1] !== m[3]) throw new Error("mean mismatch");
      const b = +m[2] / (+m[4]) ** 2;
      if (b >= 1) throw new Error("trivial bound");
      return b;
    }
    if ((m = p.match(/^S \\sim \\mathcal B\((\d+), \\tfrac12\) \\qquad P\(S \\ge (\d+)\)/))) {
      const N = +m[1], k = +m[2], t = k - N / 2;
      if (t <= 0 || k > N) throw new Error("k");
      const b = (N / 4) / (t * t);
      if (b >= 1) throw new Error("trivial");
      return b;
    }
    throw new Error("unparsed " + p);
  }
  if (id === "cc-hoeffding") {
    const N = +intro.match(/moyenne \$\\bar X\$ de (\d+) variables/)[1];
    const [a, b] = intro.match(/valeurs dans \$\[(-?\d+), (-?\d+)\]\$/).slice(1).map(Number);
    const two = p.includes("|\\bar X");
    const eps = val(p.match(/\\ge (.+?)\\big\)/)[1]);
    return (two ? 2 : 1) * Math.exp((-2 * N * eps * eps) / ((b - a) ** 2));
  }
  if (id === "cc-taille") {
    const eps = val(p.match(/\\varepsilon = (\S+)/)[1]);
    const delta = val(p.match(/\\delta = (\S+)/)[1]);
    const mK = p.match(/K = (\d+)/);
    const K = mK ? +mK[1] : 1;
    if (mK && !intro.includes(`On évalue ${K} modèles`)) throw new Error("K intro");
    return Math.log((2 * K) / delta) / (2 * eps * eps);
  }
  if (id === "cc-chernoff") {
    const N = +intro.match(/On tire (\d+) variables/)[1];
    const pp = val(p.match(/^p = (\S+)/)[1]);
    const q = val(p.match(/\\hat p \\ge (.+?)\\big\)/)[1]);
    if (!(q > pp)) throw new Error("q <= p");
    if (Math.abs(N * q - Math.round(N * q)) > 1e-9) throw new Error("Nq not integer");
    const D = (q === 1 ? 0 : (1 - q) * Math.log((1 - q) / (1 - pp))) + q * Math.log(q / pp);
    return Math.exp(-N * D);
  }
}

const issues = [];
const stats = {};
for (const g of gens) {
  stats[g.id] = { n: 0, mismatch: 0, selfFail: 0, mutAccepted: 0, answers: new Set(), trivial: 0 };
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
    if (g.id !== "cc-taille" && exp >= 1) s.trivial++;
    const got = num(e.answerTex);
    if (!Number.isFinite(got) || Math.abs(got - exp) > 1e-9 * Math.max(1, Math.abs(exp))) {
      s.mismatch++;
      if (issues.length < 10) issues.push({ id: g.id, prompt: e.promptTex, answer: e.answerTex, got, exp });
    }
    if (!isEquivalent(e.answerTex, e.answerTex)) s.selfFail++;
    if (isEquivalent(`${e.answerTex}+\\frac{1}{1000}`, e.answerTex) || isEquivalent(`2\\left(${e.answerTex}\\right)`, e.answerTex)) s.mutAccepted++;
  }
}
for (const [id, s] of Object.entries(stats)) console.log(id, "n", s.n, "mismatch", s.mismatch, "selfFail", s.selfFail, "mutationAccepted", s.mutAccepted, "trivialBound", s.trivial, "distinct", s.answers.size);
console.log("issues", JSON.stringify(issues, null, 1));
for (const c of cards) { inline(c.front, c.id); inline(c.back, c.id); }
console.log("rendered", rendered, "katex errors", katexErr);
for (const g of gens) for (let i = 0; i < 3; i++) { const e = g.make(); console.log(g.id, "|", e.promptTex, "|", e.answerTex); }
