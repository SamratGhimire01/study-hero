# 📚 Study Hero

Exam-study pipeline. **One section per subject.** Give it a syllabus + question papers, get:
- Short lessons with a story animation (with sound) and a "how the code really runs" trace
- Mnemonics for the topic AND for the answer points
- A PDF per unit, a whole-book PDF, and an **EXAM-RESCUE** PDF (most marks first)
- A short mnemonic story per chapter (with a video prompt)

```
subjects/
  advanced-java/          ← one folder per subject (add distributed-systems/, javascript/ … the same way)
    subject.json          title, code, exam format
    syllabus.json         units → topics (in syllabus order)
    topics/unit1/*.json   one small "card" per topic (the only thing AI writes)
    papers/               drop question papers here (pdf / photo / text)
    analysis/             questions.json (tagged) → priority.md
    stories/unit1.md      chapter mnemonic story + video prompt
    output/               index.html, lessons/*.html, u1.pdf, WHOLE-BOOK.pdf, EXAM-RESCUE.pdf
tools/                    build, validate, papers, pdf  (free, no AI, no network)
templates/                animation/lesson look, PDF look, card example
```

## Use
```bash
npm i && npx playwright install chromium   # once (only PDFs need this)
npm run cards       # (re)write cards from subjects/*/src/*.mjs
npm run check:java  # compile every Java code trace
npm run validate    # checks every card
npm run build       # lessons + indexes
npm run papers      # priority from question papers
npm run pdf         # unit PDFs, WHOLE-BOOK, EXAM-RESCUE
```
Open `index.html` (all subjects) → pick a subject → pick a topic. Works offline on laptop or phone (copy the folder, or turn on GitHub Pages).

## Add a new subject (in any Claude chat)
Open Claude with this repo and say: *"Add subject <name>. Here is the syllabus and question papers."* Claude follows `CLAUDE.md`. Cost saving: AI only writes the small topic cards; everything else is built by the tools.

## Status
- **advanced-java (CACS354): all 5 units, 57/57 topics written** (58 lesson pages incl. the Mouse Min/Max program), a mnemonic story per unit, unit PDFs u1–u5, WHOLE-BOOK.pdf, EXAM-RESCUE.pdf (from 1 sample paper).
- All Java/servlet code traces compile (`npm run check:java`; servlet check needs `tools/lib/servlet-api.jar`, JSP pages skipped).
- Not yet: MCQ bank, Predicted Paper 1 & 2 (waiting for more question papers).

## Read on your phone
Easiest: turn on **GitHub Pages** (Settings → Pages → Deploy from branch → `main` / root). Then open `https://<you>.github.io/study-hero/`. Or download the repo and open `index.html`.
- Answers are **drafts**; check them against your textbook. Predicted papers are practice guesses, not promises.
