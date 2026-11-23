---
name: add-subject
description: Add a new subject to Study Hero (syllabus + question papers in, step-by-step lessons, unit PDFs, whole book and Exam Rescue out) without touching any other subject. Also use to add question papers to an existing subject.
---

# Add a subject to Study Hero

Follow these steps in order. Do not skip the checks. Never edit or delete another subject's folder.
If the owner only sends new papers for an existing subject, do steps 0, 4, 7, 8 only.

## 0. Set up (1 minute)
- Read only: `CLAUDE.md`, `docs/AUTHORING.md`, `subjects/<slug>/subject.json` and `syllabus.json` if they exist. Do not read other subjects' cards or src files.
- `npm i` once if `node_modules` is missing. PDFs need Playwright Chromium; if it is not installed, run `npx playwright install chromium`.
- Pick a slug: lowercase, hyphens, e.g. `distributed-systems`. Run `export SUBJECT=<slug>` for every command after this, so only this subject is built.

## 1. Make the folder
`npm run new -- <slug> "<Title>" <CODE> "<Program, Semester>" <codeLang>`
(`codeLang`: `java` if the code is Java and should be compiled, else `c`, `python`, `js` or `none`.)
It refuses if the folder exists. That is the protection: never delete a folder to start over.

## 2. Copy the syllabus exactly
Fill `syllabus.json`: units in order, real titles and hours, topic ids `u1.t01, u1.t02, ...`. Split a long syllabus line into one topic per examinable idea, in the same order. Do not add topics that are not in the syllabus.
Fill `subject.json`: exam format from the papers (groups, counts, marks), `defaultSource` (the real textbooks), `program`.

## 3. Write cards, one unit at a time
Each unit becomes `src/unitN.mjs` (format: `docs/AUTHORING.md`). One card per topic, in syllabus order. Add a `kind:'program'` card when papers ask for a program on that topic.
- For more than 2 units, give each unit to the `unit-writer` agent (one agent per unit, run them in parallel). Pass: slug, unit id, and the questions from the papers for that unit. Each agent reads only what it needs, so this is cheap.
- After each unit: `node subjects/<slug>/src/unitN.mjs && npm run validate`. Fix every error before the next unit.

## 4. Papers
- Save each paper as text in `papers/<name>.txt` (first line: source, year, status).
- Tag every question in `analysis/questions.json`: `{paper, q, text, marks, type, topics:[ids], cards?:[card ids]}`. Set `marks_assumed:true` when marks are not printed. Add every paper to `papers:[]`.
- Use `cards:[...]` when one question needs two cards (for example a theory card and a program card).
- Every question must map to a topic that has a card. If not, write the card.

## 5. Chapter stories
`stories/unitN.md` per unit, same shape as `subjects/advanced-java/stories/unit2.md`: one hero in every scene, max 5 scenes, each scene holds the unit's tricks in bold, then a `## Video prompt` paragraph someone can paste into an AI video tool.

## 6. Quality pass (do not skip)
- Read each unit's cards once as the student would: is the definition exam-ready, are the points the ones that get marks, are the tricks memorable real words, is the code correct?
- `npm run check:code` must say 0 failed (only checks Java).
- Facts you are unsure of stay marked `draft`. Never invent paper years or marks.

## 7. Build and check
`npm run subject` (= cards, code check, build, papers, PDFs, guard).
The guard must end with "Guard OK" or warnings you can explain. It fails if any other subject changed. If it fails, undo those files with `git checkout -- <file>`.

## 8. Publish and report
- Commit with a clear message and push to `main`.
- If the Artifact tool is available and the owner gave the site link, update that same link: page `index.html`, files = output of `npm run publish:list` (all subjects, so the others stay on the site). Read the artifact first if this session has not opened it.
- Tell the owner in a few lines: how many topics, which papers were used, what is a guess, and the link.
