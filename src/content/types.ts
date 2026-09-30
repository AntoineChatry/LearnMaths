import type { ComponentType } from "react";

export type Exercise = {
  // Prompt in LaTeX, displayed in block mode.
  promptTex: string;
  // Optional intro text (math between $...$), and optional code block ("code mode" exercises).
  intro?: string;
  code?: string;
  answerTex: string;
  // Hint (math between $...$).
  hint: string;
  // Written solution: a sequence of LaTeX steps.
  solution: string[];
};

export type ExerciseGenerator = {
  // Stable identifier: it is the spaced-repetition key, never rename it once published.
  id: string;
  make: () => Exercise;
};

// Concept card for spaced repetition: question on the front, answer on the back (math between $...$).
export type ConceptCard = {
  id: string;
  // Lesson section this card checks (1-based): it is asked right after that section.
  section?: number;
  front: string;
  back: string;
};

export type SkillNode = {
  id: string;
  title: string;
  // Where you have already met the concept (CS221, STI2D…).
  bridge: string;
  lesson?: ComponentType;
  generators?: ExerciseGenerator[];
  cards?: ConceptCard[];
};
