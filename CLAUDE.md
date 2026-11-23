# Instructions for Claude (read before changing anything)

Goal: turn a syllabus + question papers into short, simple-English, exam-ready study material. Keep every subject in its own folder under `subjects/<slug>/`. Never mix subjects. Never edit `tools/` or `templates/` for one subject; ask first.

## Add a subject
1. Create `subjects/<slug>/subject.json` (copy from advanced-java; set exam format), `syllabus.json` (units → topics, keep the syllabus order, ids `u1.t01`).
2. Write ONE card per topic, in syllabus order, batch per unit. Cheapest way: a short source file `subjects/<slug>/src/unitN.mjs` using the helpers in `tools/author.mjs` (`flow`, `S`, `T`, `A`, `mn`, `W`; see `subjects/advanced-java/src/unit1.mjs`). Running it writes `topics/unitN/*.json` (schema: `docs/CARD_SCHEMA.md`). `last`/`next` are filled from the syllabus automatically.
3. Put papers in `papers/`; tag every question in `analysis/questions.json` (topic ids, marks, type). Mark assumed marks with `marks_assumed:true`.
4. Write `stories/unitN.md` (max 5 scenes, ~60 words, ONE hero in every scene, mnemonics inside).
5. Run `npm run cards && npm run check:java && npm run all`. Fix every validate/compile error. Commit.
   For EXAM-RESCUE, a question can list exact card ids in `cards:[...]` (e.g. theory card + program card).

## Style rules (the owner is a BCA student; wants marks)
- Simple English, short sentences, technical terms in **bold**. Exam answer order: Definition → Points → Figure (text diagram) → Code → List/table.
- Every topic: a topic mnemonic AND a small mnemonic for the answer points. Fun but short.
- Story animation: ≤ 8 scenes, one idea per scene, a sound per step (`tick|click|whoosh|ding|pop|key|err`). Real-life analogy first, then real code trace.
- Chain topics in syllabus order: each card has `last` and `next`.
- Be honest: `confidence` and `source` on every card. Compile Java code before saving. Predicted papers are "practice guesses". Say how many papers the priority is based on.

## Save tokens
Don't regenerate unchanged cards. Don't re-read the whole repo: read `subject.json`, `syllabus.json`, and only the cards you need. Use `npm run validate` instead of re-checking by eye.
