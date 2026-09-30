import { ConceptCardView } from "../components/ConceptCardView";
import { LessonContext } from "../components/LessonFlow";
import { Practice } from "../components/Practice";
import { WarmUp } from "../components/WarmUp";
import type { SkillNode } from "../content/types";
import { RichText } from "../components/RichText";
import { questLevels } from "../quest/levels";
import { itemId } from "../lib/srs";

export function Chapter({ node, number, moduleTitle }: { node: SkillNode; number: number; moduleTitle: string }) {
  const Lesson = node.lesson!;
  const cards = node.cards ?? [];
  // Cards tied to a section are asked in its checkpoint; the others are gathered at the end.
  const loose = cards.filter((c) => c.section === undefined);
  const related = questLevels.filter((l) => l.nodeId === node.id);

  const tail = (
    <>
      {loose.length > 0 && (
        <section className="section">
          <h2>À retenir</h2>
          <p>
            Réponds de tête avant de révéler : c'est l'effort pour retrouver la réponse qui la grave, pas la relecture.
            Sois honnête en te notant, ces cartes reviendront dans tes révisions au bon moment.
          </p>
          <ul className="concept-list">
            {loose.map((card) => (
              <li key={card.id}>
                <ConceptCardView card={card} srsId={itemId(node.id, "card", card.id)} />
              </li>
            ))}
          </ul>
        </section>
      )}
      {node.generators && (
        <section className="section">
          <h2>Entraînement</h2>
          <p>
            Cinq questions générées au hasard : une nouvelle série n'a jamais les mêmes nombres. Quatre bonnes
            réponses valident le chapitre.
          </p>
          <Practice key={node.id} nodeId={node.id} generators={node.generators} cardIds={cards.map((c) => c.id)} />
        </section>
      )}
      {related.length > 0 && (
        <section className="section">
          <h2>À l'atelier</h2>
          <ul className="game-list">
            {related.map((l) => (
              <li key={l.id}>
                <a href={`#/atelier/${l.id}`} className="game-link">
                  {l.title}
                </a>
                <p>
                  <RichText>{l.story[0]}</RichText>
                </p>
              </li>
            ))}
          </ul>
        </section>
      )}
    </>
  );

  return (
    <main className="sheet">
      <nav className="back">
        <a href="#/">Sommaire</a>
      </nav>
      <header className="sheet-head">
        <p className="subject">
          {moduleTitle}, chapitre {number}
        </p>
        <h1>{node.title}</h1>
        <p className="bridge">{node.bridge}</p>
      </header>
      <WarmUp nodeId={node.id} />
      <LessonContext.Provider value={{ nodeId: node.id, cards, tail }}>
        <Lesson />
      </LessonContext.Provider>
    </main>
  );
}
