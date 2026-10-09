// Writes entry_all.ts: every chapter's generators and cards, found by scanning src/content.
import { existsSync, readdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const CONTENT = "F:/WebWorkspace/LearnMaths/src/content";
const lines = ['import { isEquivalent, ce } from "F:/WebWorkspace/LearnMaths/src/lib/checkAnswer";'];

// Chapter -> module, read from the text of curriculum.ts (importing it would pull in every React lesson).
const curriculum = readFileSync(join(CONTENT, "curriculum.ts"), "utf8");
const moduleOf = {};
for (const block of curriculum.split(/export const (?=\w+: SkillNode\[\])/).slice(1)) {
  const name = block.match(/^(\w+)/)[1];
  for (const m of block.matchAll(/^\s{4}id: "([\w-]+)"/gm)) moduleOf[m[1]] = name;
}
const chapters = [];
for (const dir of readdirSync(CONTENT, { withFileTypes: true })) {
  if (!dir.isDirectory()) continue;
  const ex = join(CONTENT, dir.name, "exercises.ts");
  if (!existsSync(ex)) continue;
  const gen = readFileSync(ex, "utf8").match(/export const (\w+Generators)/)?.[1];
  const cardsFile = join(CONTENT, dir.name, "cards.ts");
  const cards = existsSync(cardsFile) ? readFileSync(cardsFile, "utf8").match(/export const (\w+Cards)/)?.[1] : undefined;
  if (!gen) throw new Error("no generators export in " + ex);
  lines.push(`import { ${gen} } from "${CONTENT}/${dir.name}/exercises";`);
  if (cards) lines.push(`import { ${cards} } from "${CONTENT}/${dir.name}/cards";`);
  if (!moduleOf[dir.name]) throw new Error("chapter not in curriculum.ts: " + dir.name);
  chapters.push(`  { id: "${dir.name}", module: "${moduleOf[dir.name]}", generators: ${gen}, cards: ${cards ?? "[]"} },`);
}
lines.push("export { isEquivalent, ce };", "export const chapters = [", ...chapters, "];", "");
writeFileSync("entry_all.ts", lines.join("\n"));
console.log(chapters.length, "chapters");
