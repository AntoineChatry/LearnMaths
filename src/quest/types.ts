import type { ComponentType } from "react";

export type Verdict = { ok: boolean; stars: number; message: string };

// A playable level: a world API written in Python (prelude), random parameters, a judge and a scene.
export type Level<Ctx = unknown> = {
  id: string;
  // Chapter whose content the level uses (none for the tutorial).
  nodeId?: string;
  title: string;
  // Story and goal, math between $...$.
  story: string[];
  // World functions available to the player, e.g. "sonde(x) -> float".
  api: { sig: string; doc: string }[];
  starter: string;
  // Hint shown after a few failed runs (math between $...$).
  hint: string;
  newContext: () => Ctx;
  // Extra random worlds a success must also pass, so the answer can't be hard-coded (0 or absent for a fixed map).
  checks?: number;
  // Python run before the player's code. It reads CTX (the context) and appends to _trace.
  prelude: string;
  // Python run after the player's code (e.g. tests of the functions they wrote), with the same globals.
  postlude?: string;
  // Pyodide packages to load before the first run, e.g. ["numpy"].
  packages?: string[];
  timeoutMs?: number;
  // Replay speed, in ms per trace entry (default 350).
  stepMs?: number;
  judge: (ctx: Ctx, trace: unknown[], error: string | null) => Verdict;
  // Replays the trace up to `step` actions; `done` once the replay is over (the scene may reveal hidden data).
  Scene: ComponentType<{ ctx: Ctx; trace: unknown[]; step: number; done: boolean }>;
};
