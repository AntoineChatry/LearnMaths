// Generic bench for every exercise generator (step 1): no per-generator parsing, so it does not
// recompute answers. It checks what can be checked mechanically, each generator in its own worker
// so that an infinite loop is reported as a timeout instead of freezing the run.
//   F:/Node/node gen_entry_all.mjs
//   F:/Node/node ../../node_modules/rolldown/bin/cli.mjs entry_all.ts --format esm --platform node -o bundle_all.mjs
//   F:/Node/node t_all.mjs [exercises per generator, default 1000]
import { Worker, isMainThread, parentPort, workerData } from "node:worker_threads";
import { writeFileSync } from "node:fs";

const N = Number(process.argv[2] ?? 1000);
const TIMEOUT_MS = 180_000;
const POOL = 4;

if (isMainThread) {
  const { chapters } = await import("./bundle_all.mjs");
  const tasks = chapters.flatMap((c, ci) => c.generators.map((g, gi) => ({ ci, gi, chapter: c.id, module: c.module, id: g.id })));
  const results = [];
  const runOne = (t) =>
    new Promise((resolve) => {
      const w = new Worker(new URL(import.meta.url), { workerData: { ...t, N } });
      const timer = setTimeout(() => {
        w.terminate();
        resolve({ ...t, timeout: true });
      }, TIMEOUT_MS);
      w.once("message", (r) => {
        clearTimeout(timer);
        w.terminate();
        resolve({ ...t, ...r });
      });
      w.once("error", (e) => {
        clearTimeout(timer);
        resolve({ ...t, crash: String(e).slice(0, 300) });
      });
    });
  let next = 0;
  const t0 = Date.now();
  await Promise.all(
    Array.from({ length: POOL }, async () => {
      while (next < tasks.length) {
        const t = tasks[next++];
        const r = await runOne(t);
        results.push(r);
        process.stderr.write(`\r${results.length}/${tasks.length} ${Math.round((Date.now() - t0) / 1000)}s   `);
      }
    }),
  );
  process.stderr.write("\n");

  // Cards: inline math only, as RichText renders it.
  const katex = (await import("file:///F:/WebWorkspace/LearnMaths/node_modules/katex/dist/katex.mjs")).default;
  const cardIssues = [];
  for (const c of chapters) {
    for (const card of c.cards) {
      for (const side of ["front", "back"]) {
        const s = card[side] ?? "";
        if ((s.match(/\$/g) ?? []).length % 2) cardIssues.push(`${c.id}/${card.id}.${side}: nombre impair de $`);
        for (const m of s.matchAll(/\$([^$]+)\$/g)) {
          try {
            katex.renderToString(m[1], { throwOnError: true });
          } catch (e) {
            cardIssues.push(`${c.id}/${card.id}.${side}: ${e.message.slice(0, 90)}`);
          }
        }
      }
    }
  }

  results.sort((a, b) => a.ci - b.ci || a.gi - b.gi);
  writeFileSync("rapport_all.json", JSON.stringify({ N, results, cardIssues }, null, 1));
  // Readable summary: one line per generator with a problem, then totals per module.
  const problems = (r) => {
    if (r.timeout) return ["TIMEOUT (boucle infinie ?)"];
    if (r.crash) return ["CRASH " + r.crash];
    const p = [];
    if (r.throws) p.push(`make() lève ${r.throws}× (${r.throwSample})`);
    if (r.katex) p.push(`KaTeX ${r.katex}× (${r.katexSample})`);
    if (r.oddDollar) p.push(`$ impair ${r.oddDollar}×`);
    if (r.empty) p.push(`champ vide ${r.empty}×`);
    if (r.invalid) p.push(`réponse illisible ${r.invalid}× (${r.invalidSample})`);
    if (r.selfFail) p.push(`réponse refusée par le vérificateur ${r.selfFail}× (${r.selfSample})`);
    if (r.mutAccepted) p.push(`mutation acceptée ${r.mutAccepted}× (${r.mutSample})`);
    if (r.slow) p.push(`make() > 50 ms ${r.slow}×`);
    if (r.distinctAnswers < 5) p.push(`(info) ${r.distinctAnswers} réponses distinctes`);
    if (r.zero / r.n > 0.3) p.push(`(à examiner) réponse nulle ${Math.round((100 * r.zero) / r.n)} %`);
    return p;
  };
  const byModule = {};
  for (const r of results) {
    const m = (byModule[r.module] ??= { gens: 0, bad: 0 });
    m.gens++;
    const p = problems(r);
    if (p.length) {
      m.bad++;
      console.log(`${r.module} / ${r.chapter} / ${r.id} : ${p.join(" ; ")}`);
    }
  }
  console.log("---");
  for (const [m, s] of Object.entries(byModule)) console.log(`${m}: ${s.gens} générateurs, ${s.bad} avec au moins un signalement`);
  console.log(`cartes : ${chapters.reduce((s, c) => s + c.cards.length, 0)}, problèmes : ${cardIssues.length}`);
  for (const c of cardIssues) console.log("  " + c);
  console.log(`${N} exercices par générateur, ${Math.round((Date.now() - t0) / 1000)} s`);
} else {
  const { chapters, isEquivalent, ce } = await import("./bundle_all.mjs");
  const katex = (await import("file:///F:/WebWorkspace/LearnMaths/node_modules/katex/dist/katex.mjs")).default;
  const { ci, gi, N: n } = workerData;
  const gen = chapters[ci].generators[gi];
  const norm = (t) => t.replace(/(\d)\s*(?:\{,\}|,)\s*(?=\d)/g, "$1.");
  const r = { n: 0, throws: 0, katex: 0, oddDollar: 0, empty: 0, invalid: 0, selfFail: 0, mutAccepted: 0, slow: 0, zero: 0, nonNumeric: 0, maxMs: 0 };
  const answers = new Set();
  const prompts = new Set();
  const tex = (t, display) => {
    try {
      katex.renderToString(t, { throwOnError: true, displayMode: display });
    } catch (e) {
      r.katex++;
      r.katexSample ??= `${t.slice(0, 80)} → ${e.message.slice(0, 60)}`;
    }
  };
  const rich = (s) => {
    if (!s) return;
    if ((s.match(/\$/g) ?? []).length % 2) r.oddDollar++;
    for (const m of s.matchAll(/\$([^$]+)\$/g)) tex(m[1], false);
  };
  for (let i = 0; i < n; i++) {
    let e;
    const t = performance.now();
    try {
      e = gen.make();
    } catch (err) {
      r.throws++;
      r.throwSample ??= String(err).slice(0, 120);
      continue;
    }
    const ms = performance.now() - t;
    r.maxMs = Math.max(r.maxMs, ms);
    if (ms > 50) r.slow++;
    r.n++;
    if (!e || typeof e.promptTex !== "string" || !e.promptTex.trim() || typeof e.answerTex !== "string" || !e.answerTex.trim() || !Array.isArray(e.solution) || typeof e.hint !== "string") {
      r.empty++;
      continue;
    }
    answers.add(e.answerTex);
    prompts.add(e.promptTex);
    tex(e.promptTex, true);
    tex(e.answerTex, false); // shown inline in the verdict
    for (const s of e.solution) tex(s, true);
    rich(e.intro);
    rich(e.hint);
    const a = e.answerTex;
    const parsed = ce.parse(norm(a));
    if (!parsed.isValid) {
      r.invalid++;
      r.invalidSample ??= a.slice(0, 80);
    }
    if (!isEquivalent(a, a)) {
      r.selfFail++;
      r.selfSample ??= a.slice(0, 80);
    }
    const v = parsed.N().re;
    if (typeof v === "number" && Number.isFinite(v)) {
      if (Math.abs(v) < 1e-12) r.zero++;
    } else r.nonNumeric++;
    // Wrong answers that must be rejected. Infinite answers: the opposite infinity (∞ + 1 = ∞).
    // Doubling only for non-zero answers (2 × 0 = 0); additive shifts have no fixed point.
    const infinite = typeof v === "number" && !Number.isFinite(v) && !Number.isNaN(v);
    const zero = typeof v === "number" && Math.abs(v) < 1e-12;
    const mutations = infinite
      ? [`-\\left(${a}\\right)`]
      : [`\\left(${a}\\right)+1`, `\\left(${a}\\right)+\\frac{1}{7}`, ...(zero ? [] : [`2\\left(${a}\\right)`])];
    if (mutations.some((m) => isEquivalent(m, a))) {
      r.mutAccepted++;
      r.mutSample ??= a.slice(0, 80);
    }
  }
  r.distinctAnswers = answers.size;
  r.distinctPrompts = prompts.size;
  parentPort.postMessage(r);
}
