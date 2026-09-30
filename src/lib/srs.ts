import { createEmptyCard, fsrs, Rating, type Card, type Grade } from "ts-fsrs";

// An item to review: an exercise type (freshly generated each time) or a concept card.
// Identifier: "limites::ex::trou-0-sur-0" or "limites::card::pourquoi-epsilon".
export type ItemKind = "ex" | "card";

export function itemId(nodeId: string, kind: ItemKind, id: string): string {
  return `${nodeId}::${kind}::${id}`;
}

export function parseItemId(id: string): { nodeId: string; kind: ItemKind; id: string } {
  const [nodeId, kind, rest] = id.split("::");
  return { nodeId, kind: kind as ItemKind, id: rest };
}

type StoredCard = Omit<Card, "due" | "last_review"> & { due: string; last_review?: string };

const KEY = "learnmaths.srs.v1";
const scheduler = fsrs();

function load(): Record<string, StoredCard> {
  try {
    return JSON.parse(localStorage.getItem(KEY) ?? "{}");
  } catch {
    return {};
  }
}

function save(all: Record<string, StoredCard>) {
  try {
    localStorage.setItem(KEY, JSON.stringify(all));
  } catch {
    // Storage unavailable: this visit's reviews won't be saved.
  }
}

function toCard(s: StoredCard): Card {
  return { ...s, due: new Date(s.due), last_review: s.last_review ? new Date(s.last_review) : undefined };
}

function toStored(c: Card): StoredCard {
  return { ...c, due: c.due.toISOString(), last_review: c.last_review?.toISOString() };
}

// Adds items not yet tracked to the deck. A new item is due for review right away.
export function enroll(ids: string[]) {
  const all = load();
  const now = new Date();
  let changed = false;
  for (const id of ids) {
    if (!all[id]) {
      all[id] = toStored(createEmptyCard(now));
      changed = true;
    }
  }
  if (changed) save(all);
}

export function review(id: string, grade: Grade) {
  const all = load();
  const now = new Date();
  const card = all[id] ? toCard(all[id]) : createEmptyCard(now);
  all[id] = toStored(scheduler.next(card, now, grade).card);
  save(all);
}

export function dueItems(now = new Date()): string[] {
  const all = load();
  return Object.entries(all)
    .filter(([, c]) => new Date(c.due) <= now)
    .sort(([, a], [, b]) => a.due.localeCompare(b.due))
    .map(([id]) => id);
}

export function nextDue(): Date | null {
  const dues = Object.values(load()).map((c) => new Date(c.due).getTime());
  return dues.length ? new Date(Math.min(...dues)) : null;
}

export function trackedCount(): number {
  return Object.keys(load()).length;
}

export { Rating };
export type { Grade };
