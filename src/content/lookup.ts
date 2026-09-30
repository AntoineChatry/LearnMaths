import { parseItemId } from "../lib/srs";
import { allNodes } from "./curriculum";
import type { ConceptCard, ExerciseGenerator, SkillNode } from "./types";

export type ResolvedItem =
  | { srsId: string; node: SkillNode; kind: "ex"; generator: ExerciseGenerator }
  | { srsId: string; node: SkillNode; kind: "card"; card: ConceptCard };

// Finds the content behind a review identifier. Returns null if the content no longer exists
// (exercise type or card removed): the item is then simply ignored.
export function resolveItem(srsId: string): ResolvedItem | null {
  const { nodeId, kind, id } = parseItemId(srsId);
  const node = allNodes.find((n) => n.id === nodeId);
  if (!node) return null;
  if (kind === "ex") {
    const generator = node.generators?.find((g) => g.id === id);
    return generator ? { srsId, node, kind, generator } : null;
  }
  const card = node.cards?.find((c) => c.id === id);
  return card ? { srsId, node, kind: "card", card } : null;
}
