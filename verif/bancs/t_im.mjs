import katex from "file:///F:/WebWorkspace/LearnMaths/node_modules/katex/dist/katex.mjs";
import { informationMutuelleGenerators as gens, informationMutuelleCards as cards, isEquivalent, ce } from "./bundle_im.mjs";

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
const fracVal = (s) => {
  s = s.trim();
  const m = s.match(/^\\frac\{(\d+)\}\{(\d+)\}$/);
  if (m) return +m[1] / +m[2];
  if (!/^\d+$/.test(s)) throw new Error("bad cell " + s);
  return +s;
};
const H = (ps) => ps.filter((p) => p > 0).reduce((s, p) => s - p * log2(p), 0);

// Joint table rows x, columns y from the KaTeX array.
function parseTable(p) {
  const body = p.match(/\\hline (.*) \\end\{array\}/)[1];
  return body.split(" \\\\ ").map((row) => row.split(" & ").slice(1).map(fracVal));
}
function tableStats(T) {
  const tot = T.flat().reduce((a, b) => a + b, 0);
  if (Math.abs(tot - 1) > 1e-12) throw new Error("table sums to " + tot);
  const px = T.map((r) => r.reduce((a, b) => a + b, 0));
  const py = T[0].map((_, j) => T.reduce((s, r) => s + r[j], 0));
  if (px.some((v) => v === 0) || py.some((v) => v === 0)) throw new Error("empty row or column");
  const Hxy = H(T.flat());
  // H(Y | X) from its definition: sum_x p(x) H(p(y | x))
  const HYsX = T.reduce((s, r, i) => s + px[i] * H(r.map((v) => v / px[i])), 0);
  // I from the KL definition
  let I = 0;
  T.forEach((r, i) => r.forEach((v, j) => { if (v > 0) I += v * log2(v / (px[i] * py[j])); }));
  return { Hx: H(px), Hy: H(py), Hxy, HYsX, I };
}

function expected(id, e) {
  const p = e.promptTex;
  if (id === "im-conditionnelle") {
    const s = tableStats(parseTable(p));
    if (Math.abs(s.Hx + s.HYsX - s.Hxy) > 1e-12) throw new Error("chain rule broken?");
    return e.intro.includes("jointe $H(X, Y)$") ? s.Hxy : s.HYsX;
  }
  if (id === "im-mutuelle") {
    if (p.startsWith("\\begin{array}")) return tableStats(parseTable(p)).I;
    const v = [...p.matchAll(/= (\\frac\{\d+\}\{\d+\}|\d+)/g)].map((m) => fracVal(m[1]));
    const [hx, hy, hxy] = v;
    if (hxy > hx + hy + 1e-12 || hxy < Math.max(hx, hy) - 1e-12) throw new Error("impossible entropies " + p);
    if (p.endsWith("I(X ; Y)")) return hx + hy - hxy;
    if (p.endsWith("H(X \\mid Y)")) return hxy - hy;
    if (p.endsWith("H(Y \\mid X)")) return hxy - hx;
    throw new Error("target " + p);
  }
  if (id === "im-gain") {
    const ch = [...p.matchAll(/\((\d+), (\d+)\)/g)].map((m) => [+m[1], +m[2]]);
    const P = ch.reduce((s, c) => s + c[0], 0), Nn = ch.reduce((s, c) => s + c[1], 0), T = P + Nn;
    if (+e.intro.match(/contient (\d+) exemples/)[1] !== T) throw new Error("N " + e.intro);
    if (P !== Nn) throw new Error("unbalanced " + p);
    return H([P / T, Nn / T]) - ch.reduce((s, c) => s + ((c[0] + c[1]) / T) * H([c[0] / (c[0] + c[1]), c[1] / (c[0] + c[1])]), 0);
  }
  if (id === "im-traitement") {
    const top = +e.intro.match(/à \$(\d+)\$/)[1];
    const xs = Array.from({ length: top + 1 }, (_, i) => i);
    let m;
    const g = (m = p.match(/\\lfloor X \/ (\d+) \\right/)) ? ((x) => Math.floor(x / +m[1])) : (m = p.match(/X \\bmod (\d+)/)) ? ((x) => x % +m[1]) : null;
    if (!g) throw new Error("g " + p);
    const a = p.startsWith("I\\big(C") ? (() => { const b = +e.intro.match(/poids \$2\^\{(\d+)\}\$/)[1]; return (x) => (x >> b) & 1; })() : (x) => x;
    // Mutual information of (a(X), g(X)) by enumeration over the uniform X.
    const joint = new Map(), pa = new Map(), pg = new Map();
    for (const x of xs) {
      const k = `${a(x)}|${g(x)}`;
      joint.set(k, (joint.get(k) ?? 0) + 1 / xs.length);
      pa.set(a(x), (pa.get(a(x)) ?? 0) + 1 / xs.length);
      pg.set(g(x), (pg.get(g(x)) ?? 0) + 1 / xs.length);
    }
    return H([...pa.values()]) + H([...pg.values()]) - H([...joint.values()]);
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
