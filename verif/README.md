# Vérification du contenu

Ces scripts vérifient les chapitres hors de l'app. Les sources qu'ils confrontent sont dans `../sources/`.

- `outils/run_blocks.py <Lesson.tsx>` : exécute chaque bloc Python d'une leçon et compare sa sortie aux lignes `# …` qui le terminent.
- `outils/pdf2txt.py <pdf> <txt>`, `pdfpages.py`, `html2txt.py` : extraient le texte d'une source pour y chercher une équation.
- `bancs/` : bancs de test indépendants des générateurs d'exercices, un par chapitre (`t_<chapitre>.mjs` et son point d'entrée `entry_<chapitre>.ts`). Pour chaque générateur, 3 000 exercices :
  - la réponse attendue est recalculée depuis l'énoncé, sans passer par le code du générateur ;
  - chaque réponse est comparée à elle-même par le vérificateur de l'app (`isEquivalent`) ;
  - des réponses fausses (mutations) doivent être refusées ;
  - tout le TeX passe dans KaTeX avec `throwOnError`.
- `blocs/` : scripts de mise au point des leçons et des visualisations (calculs de référence, comparaison avec scipy).

Les bancs des modules Analyse, Algèbre linéaire, Probabilités et Multivariable ont été perdus avec un dossier temporaire ; seuls ceux des modules Information et Concentration sont ici.

## Lancer un banc

Python : `micromamba run -n AI python`. Node : `F:/Node/node`. Exemple pour le chapitre `pac`, depuis `verif/bancs` :

```bash
F:/Node/node ../../node_modules/rolldown/bin/cli.mjs entry_pac.ts --format esm --platform node -o bundle_pac.mjs
F:/Node/node t_pac.mjs
micromamba run -n AI python ../outils/run_blocks.py ../../src/content/pac/Lesson.tsx
```

Les `bundle_*.mjs` sont régénérés à chaque fois et ne sont pas versionnés.
