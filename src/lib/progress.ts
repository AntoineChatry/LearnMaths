export type NodeProgress = { best: number; total: number; mastered: boolean };

const KEY = "learnmaths.progress.v1";

function readAll(): Record<string, NodeProgress> {
  try {
    return JSON.parse(localStorage.getItem(KEY) ?? "{}");
  } catch {
    return {};
  }
}

export function getProgress(nodeId: string): NodeProgress | undefined {
  return readAll()[nodeId];
}

export function recordSession(nodeId: string, score: number, total: number): NodeProgress {
  const all = readAll();
  const prev = all[nodeId];
  const next: NodeProgress = {
    best: Math.max(prev?.best ?? 0, score),
    total,
    mastered: (prev?.mastered ?? false) || score / total >= 0.8,
  };
  all[nodeId] = next;
  try {
    localStorage.setItem(KEY, JSON.stringify(all));
  } catch {
    // Storage unavailable (private browsing): the session remains valid, it just isn't saved.
  }
  return next;
}
