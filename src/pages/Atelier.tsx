import { locateNode } from "../content/curriculum";
import { projectSteps } from "../project/steps";
import { questLevels } from "../quest/levels";
import { LevelPlayer } from "../quest/LevelPlayer";
import { getStars } from "../quest/progress";
import type { Level } from "../quest/types";

const chapterOf = (nodeId?: string) => {
  const found = locateNode(nodeId);
  return found ? `${found.module.title}, chapitre ${found.number}` : "didacticiel";
};
const starText = (n: number) => "★".repeat(n) + "☆".repeat(3 - n);

// The quest and the project are two separate tracks; in each, a level unlocks once the previous one is passed.
const tracks = [
  { levels: questLevels, name: "Quête", unit: "niveau", next: "Niveau suivant" },
  { levels: projectSteps, name: "Projet", unit: "étape", next: "Étape suivante" },
];

function LevelList({ levels }: { levels: Level<unknown>[] }) {
  return (
    <ol className="game-list">
      {levels.map((l, i) => {
        const stars = getStars(l.id);
        const open = i === 0 || getStars(levels[i - 1].id) > 0;
        return (
          <li key={l.id} className={open ? "" : "is-draft"}>
            {open ? (
              <a href={`#/atelier/${l.id}`} className="game-link">
                {l.title}
              </a>
            ) : (
              <span className="game-link">{l.title}</span>
            )}
            <span className="game-chapters">
              {chapterOf(l.nodeId)}
              {stars > 0 ? `, ${starText(stars)}` : open ? "" : ", réussis le précédent"}
            </span>
          </li>
        );
      })}
    </ol>
  );
}

export function Atelier({ levelId }: { levelId?: string }) {
  for (const track of tracks) {
    const index = track.levels.findIndex((l) => l.id === levelId);
    if (index === -1) continue;
    const level = track.levels[index];
    const next = track.levels[index + 1];
    return (
      <main className="sheet">
        <nav className="back">
          <a href="#/atelier">Atelier</a>
        </nav>
        <header className="sheet-head">
          <p className="subject">
            {track.name}, {track.unit} {index + 1}, {chapterOf(level.nodeId)}
          </p>
          <h1>{level.title}</h1>
        </header>
        {/* The key resets the player's state when moving to another level. */}
        <LevelPlayer key={level.id} level={level} nextHref={next ? `#/atelier/${next.id}` : undefined} nextLabel={track.next} />
      </main>
    );
  }

  return (
    <main className="sheet">
      <nav className="back">
        <a href="#/">Sommaire</a>
      </nav>
      <header className="sheet-head">
        <p className="subject">Atelier</p>
        <h1>La quête</h1>
        <p className="bridge">Tu écris du Python, le monde exécute. Pour gagner, il faut faire le calcul.</p>
      </header>
      <LevelList levels={questLevels} />
      <h2>Le projet : un robot qui apprend</h2>
      <p className="bridge">
        Une fonction par étape, et chaque fonction validée sert aux suivantes : à la fin, le cerveau du robot, c'est ton code.
      </p>
      <LevelList levels={projectSteps} />
    </main>
  );
}
