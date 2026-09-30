import type { RunResponse } from "./pyWorker";

export type RunResult = { trace: unknown[]; stdout: string; error: string | null; timedOut: boolean };

const TIMEOUT_MS = 5000;

let worker: Worker | null = null;
let readyPromise: Promise<void> | null = null;
let nextId = 1;
// Packages every worker must have (a respawned worker loads them again).
const wanted = new Set<string>();
let loaded = new Set<string>();

function spawn(): Worker {
  return new Worker(new URL("./pyWorker.ts", import.meta.url), { type: "module" });
}

function request(w: Worker, msg: object): Promise<RunResponse> {
  const id = nextId++;
  return new Promise((resolve) => {
    const listener = (e: MessageEvent<RunResponse>) => {
      if (e.data.id !== id) return;
      w.removeEventListener("message", listener);
      resolve(e.data);
    };
    w.addEventListener("message", listener);
    w.postMessage({ id, ...msg });
  });
}

// Loads Pyodide (about 10 MB the first time, then cached by the browser) and the requested packages.
export function ensureReady(packages: string[] = []): Promise<void> {
  packages.forEach((p) => wanted.add(p));
  if (!worker) {
    worker = spawn();
    readyPromise = null;
    loaded = new Set();
  }
  const missing = [...wanted].filter((p) => !loaded.has(p));
  if (!readyPromise || missing.length > 0) {
    const w = worker;
    const before = readyPromise ?? Promise.resolve();
    missing.forEach((p) => loaded.add(p));
    readyPromise = before.then(() => request(w, { ping: true, packages: missing })).then(() => undefined);
  }
  return readyPromise;
}

type RunOptions = { postlude?: string; timeoutMs?: number };

// Runs the prelude, the player's code, then the postlude. Past the timeout the worker is killed (infinite loop) and respawned.
export async function runPython(prelude: string, code: string, context: unknown, opts: RunOptions = {}): Promise<RunResult> {
  await ensureReady();
  const w = worker!;
  const timeoutMs = opts.timeoutMs ?? TIMEOUT_MS;
  let timer: number | undefined;
  const timeout = new Promise<RunResult>((resolve) => {
    timer = window.setTimeout(() => {
      w.terminate();
      worker = null;
      readyPromise = null;
      void ensureReady();
      resolve({ trace: [], stdout: "", error: null, timedOut: true });
    }, timeoutMs);
  });
  const run = request(w, { prelude, code, postlude: opts.postlude, context }).then((r): RunResult => {
    window.clearTimeout(timer);
    if (r.kind !== "done") return { trace: [], stdout: "", error: "Réponse inattendue du moteur Python.", timedOut: false };
    return { trace: r.trace, stdout: r.stdout, error: r.error, timedOut: false };
  });
  return Promise.race([run, timeout]);
}
