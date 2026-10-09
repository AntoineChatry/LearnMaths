// Independent bench for mcmc: answers recomputed from the prompt, with detailed-balance and stationarity checks.
import katex from "file:///F:/WebWorkspace/LearnMaths/node_modules/katex/dist/katex.mjs";
import { mcmcGenerators as gens, mcmcCards as cards, isEquivalent, ce } from "./bundle_mc.mjs";

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
  if (/^\d+$/.test(s)) return +s;
  throw new Error("bad value " + s);
};
const field = (p, re) => { const m = p.match(re); if (!m) throw new Error("no " + re); return val(m[1]); };
const close = (a, b) => Math.abs(a - b) < 1e-12;

function expected(id, e) {
  const p = e.promptTex;
  if (id === "mc-acceptation") {
    const px = field(p, /\\tilde p\(x\) = (\S+)/), py = field(p, /\\tilde p\(y\) = (\S+)/);
    let qyx = 1, qxy = 1;
    if (p.includes("q(y \\mid x)")) { qyx = field(p, /q\(y \\mid x\) = (\S+)/); qxy = field(p, /q\(x \\mid y\) = (\S+)/); }
    const A = (a, b, qab, qba) => Math.min(1, (b * qba) / (a * qab)); // accept a -> b
    const Axy = A(px, py, qyx, qxy), Ayx = A(py, px, qxy, qyx);
    if (!close(px * qyx * Axy, py * qxy * Ayx)) throw new Error("detailed balance");
    return Axy;
  }
  if (id === "mc-equilibre") {
    const pix = field(p, /\\pi\(x\) = (\S+)/), piy = field(p, /\\pi\(y\) = (\S+)/), pxy = field(p, /P\(x, y\) = (\S+)/);
    const r = (pix * pxy) / piy;
    if (r > 1 + 1e-12) throw new Error("not a probability");
    return r;
  }
  if (id === "mc-chaine") {
    const h = p.match(/\\tilde p = \(([^)]*)\)/)[1].split(",\\ ").map(Number);
    const [, x, y] = p.match(/P\((\d), (\d)\) = \\ \?/).map(Number);
    const P = h.map((hx, i) => h.map((hy, j) => (i === j ? 0 : 0.5 * Math.min(1, hy / hx))));
    P.forEach((r, i) => (r[i] = 1 - r.reduce((s, v) => s + v, 0)));
    const Z = h.reduce((s, v) => s + v, 0);
    const pi = h.map((v) => v / Z);
    for (let j = 0; j < 3; j++) if (!close(pi.reduce((s, v, i) => s + v * P[i][j], 0), pi[j])) throw new Error("not stationary");
    return P[x - 1][y - 1];
  }
  if (id === "mc-graphe") {
    const dx = field(p, /\\deg\(x\) = (\d+)/), dy = field(p, /\\deg\(y\) = (\d+)/);
    const A = (a, b) => Math.min(1, (1 / b) / (1 / a)); // uniform target, q(b|a) = 1/deg(a)
    const Pxy = (1 / dx) * A(dx, dy), Pyx = (1 / dy) * A(dy, dx);
    if (!close(Pxy, Pyx)) throw new Error("uniform not reversible");
    if (p.includes("A(x, y)")) return A(dx, dy);
    return Pxy;
  }
}

const issues = [];
const stats = {};
for (const g of gens) {
  const st = (stats[g.id] = { n: 0, mismatch: 0, selfFail: 0, mutAccepted: 0, zero: 0, one: 0, answers: new Set() });
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
    if (close(exp, 0)) st.zero++;
    if (close(exp, 1)) st.one++;
    const got = num(e.answerTex);
    if (!Number.isFinite(got) || Math.abs(got - exp) > 1e-9 * Math.max(1, Math.abs(exp))) {
      st.mismatch++;
      if (issues.length < 10) issues.push({ id: g.id, prompt: e.promptTex, answer: e.answerTex, got, exp });
    }
    if (!isEquivalent(e.answerTex, e.answerTex)) st.selfFail++;
    if (isEquivalent(`${e.answerTex}+\\frac{1}{1000}`, e.answerTex) || isEquivalent(`2\\left(${e.answerTex}\\right)+\\frac{1}{7}`, e.answerTex)) st.mutAccepted++;
  }
}
for (const [id, st] of Object.entries(stats)) console.log(id, "n", st.n, "mismatch", st.mismatch, "selfFail", st.selfFail, "mutationAccepted", st.mutAccepted, "zero%", (100 * st.zero / st.n).toFixed(1), "one%", (100 * st.one / st.n).toFixed(1), "distinct", st.answers.size);
console.log("issues", JSON.stringify(issues, null, 1));
for (const c of cards) { inline(c.front, c.id); inline(c.back, c.id); }
console.log("rendered", rendered, "katex errors", katexErr);
const alt = [["\\frac{3}{4}", "0,75"], ["\\frac{1}{3}", "\\frac{2}{6}"]];
for (const [a, b] of alt) console.log("alt", b, isEquivalent(b, a));
for (const g of gens) for (let i = 0; i < 3; i++) { const e = g.make(); console.log(g.id, "|", e.promptTex, "|", e.answerTex); }
console.log("seconds", (Date.now() - T0) / 1000);
