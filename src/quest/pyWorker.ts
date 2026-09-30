/// <reference lib="webworker" />
// Runs the player's Python with Pyodide. A level prelude defines the world API and records every call in `_trace`.

const PYODIDE_URL = "https://cdn.jsdelivr.net/pyodide/v314.0.7/full/pyodide.mjs";

type Pyodide = {
  runPythonAsync: (code: string, opts?: { globals?: unknown; filename?: string }) => Promise<unknown>;
  runPython: (code: string, opts?: { globals?: unknown }) => unknown;
  setStdout: (opts: { batched: (s: string) => void }) => void;
  setStderr: (opts: { batched: (s: string) => void }) => void;
  globals: { get: (name: string) => (...args: unknown[]) => { set: (k: string, v: unknown) => void; destroy: () => void } };
  loadPackage: (names: string[]) => Promise<unknown>;
};

const ready: Promise<Pyodide> = import(/* @vite-ignore */ PYODIDE_URL).then((m) => m.loadPyodide());

// postlude: harness code run after the player's code (only if it ran without error), e.g. to test their functions.
export type RunRequest = { id: number; prelude: string; code: string; postlude?: string; context: unknown };
export type RunResponse =
  | { id: number; kind: "ready" }
  | { id: number; kind: "done"; trace: unknown[]; stdout: string; error: string | null };

// Keeps only the frames from the player's code ("<joueur>") and the final message.
function cleanError(message: string): string {
  const lines = message.trim().split("\n");
  const last = lines[lines.length - 1];
  const kept: string[] = [];
  for (let i = 0; i < lines.length; i++) {
    if (lines[i].includes('File "<joueur>"')) {
      kept.push(lines[i].trim().replace('File "<joueur>", line', "Ligne").replace(/, in <module>$/, ""));
      // Pyodide shows the source line when it has it; without source, the next line is the error itself.
      const next = lines[i + 1]?.trim();
      if (next && !next.startsWith("File") && next !== last.trim()) kept.push("    " + next);
    }
  }
  kept.push(last);
  return kept.join("\n");
}

self.onmessage = async (event: MessageEvent<RunRequest | { id: number; ping: true; packages: string[] }>) => {
  const py = await ready;
  const msg = event.data;
  if ("ping" in msg) {
    // Pyodide packages (e.g. numpy) are loaded here, so their download never counts against the run timeout.
    if (msg.packages.length > 0) await py.loadPackage(msg.packages);
    self.postMessage({ id: msg.id, kind: "ready" } satisfies RunResponse);
    return;
  }
  let stdout = "";
  py.setStdout({ batched: (s) => (stdout += s + "\n") });
  py.setStderr({ batched: (s) => (stdout += s + "\n") });
  const ns = py.globals.get("dict")();
  ns.set("CTX_JSON", JSON.stringify(msg.context));
  let error: string | null = null;
  try {
    await py.runPythonAsync(msg.prelude, { globals: ns, filename: "<monde>" });
  } catch (e) {
    // A prelude error is a bug in the level, not in the player's code: report it as is.
    self.postMessage({ id: msg.id, kind: "done", trace: [], stdout, error: `Erreur du niveau : ${String(e)}` } satisfies RunResponse);
    ns.destroy();
    return;
  }
  try {
    await py.runPythonAsync(msg.code, { globals: ns, filename: "<joueur>" });
    // Errors raised inside the player's functions keep their "<joueur>" frames, so cleanError still points at their line.
    if (msg.postlude) await py.runPythonAsync(msg.postlude, { globals: ns, filename: "<monde>" });
  } catch (e) {
    error = cleanError(e instanceof Error ? e.message : String(e));
  }
  const trace = JSON.parse(String(py.runPython("json.dumps(_trace)", { globals: ns })));
  ns.destroy();
  self.postMessage({ id: msg.id, kind: "done", trace, stdout, error } satisfies RunResponse);
};
