# Study Hero: rules for Claude (read first)

Study Hero turns a syllabus + question papers into simple-English, exam-ready study material: step-by-step lessons (story with sound, code trace, exam answer, tricks, quick check, one-page summary), a PDF per unit, a whole-book PDF and EXAM-RESCUE (most marks first). The owner is a TU BCA student who reads on a phone and wants marks.

## Hard rules
1. **Subjects sit side by side.** Each subject lives only in `subjects/<slug>/`. Never edit, rebuild-over or delete another subject. Work with `export SUBJECT=<slug>` so every tool touches only that subject. `npm run guard` must pass before commit.
2. **Shared code is shared.** Don't change `tools/` or `templates/` for one subject. If something is truly missing, ask the owner first.
3. **Be honest.** Cards keep `confidence` + `source`. Never invent paper years or marks (`marks_assumed:true` when guessing). Predicted papers are "practice guesses". Say how many papers a priority is based on.

## How to do things
- **Add a subject, or add papers to one:** follow `.claude/skills/add-subject/SKILL.md` (step by step). Unit cards can be written in parallel by the `unit-writer` agent (`.claude/agents/unit-writer.md`).
- **Card format and helpers:** `docs/AUTHORING.md` (read this, not the old unit files).
- **Commands:** `npm run new`, `npm run cards`, `npm run validate`, `npm run check:code`, `npm run all`, `npm run guard`, `npm run subject` (all of them in order), `npm run publish:list`.

## Style the owner asked for
- Simple English, short sentences, technical terms in **bold**. Answer order: Definition → Points → Figure (text diagram) → Code → List/table.
- Every topic: a topic trick AND a points trick (real, vivid words). Story: real-life picture first, ≤ 8 scenes, one idea each, a sound each.
- Topics chained in syllabus order (`last` / `next`). After each unit: a ≤ 5-scene story with ONE hero + a paste-ready AI video prompt.
- One thing per screen in the app. Never a wall of options.

## Save tokens
Read only `subject.json`, `syllabus.json`, `docs/AUTHORING.md` and the cards you are changing. Don't regenerate unchanged cards. Let `npm run validate` and `npm run guard` do the checking.
