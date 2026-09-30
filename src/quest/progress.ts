// Quest progress (best stars per level) and the player's code per level, in localStorage.
const STARS_KEY = "learnmaths.quest.v1";
const CODE_KEY = "learnmaths.quest.code.v1";
const SOLVED_KEY = "learnmaths.quest.solved.v1";

function read(key: string): Record<string, unknown> {
  try {
    return JSON.parse(localStorage.getItem(key) ?? "{}");
  } catch {
    return {};
  }
}

function write(key: string, all: Record<string, unknown>) {
  try {
    localStorage.setItem(key, JSON.stringify(all));
  } catch {
    // Storage unavailable: progress lives only for this visit.
  }
}

export function getStars(levelId: string): number {
  return (read(STARS_KEY)[levelId] as number | undefined) ?? 0;
}

export function saveStars(levelId: string, stars: number) {
  const all = read(STARS_KEY);
  if (stars > ((all[levelId] as number | undefined) ?? 0)) {
    all[levelId] = stars;
    write(STARS_KEY, all);
  }
}

export function getCode(levelId: string): string | undefined {
  return read(CODE_KEY)[levelId] as string | undefined;
}

export function saveCode(levelId: string, code: string) {
  const all = read(CODE_KEY);
  all[levelId] = code;
  write(CODE_KEY, all);
}

// The last code that passed a level: project steps build on the functions validated in earlier steps.
export function getSolved(levelId: string): string | undefined {
  return read(SOLVED_KEY)[levelId] as string | undefined;
}

export function saveSolved(levelId: string, code: string) {
  const all = read(SOLVED_KEY);
  all[levelId] = code;
  write(SOLVED_KEY, all);
}
