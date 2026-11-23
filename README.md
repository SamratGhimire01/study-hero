# Study Hero

Give it a **syllabus** and **question papers**. Get, for every topic in syllabus order:
a short story with sound, a "how the code runs" trace, the exam answer, memory tricks, a quick check and a one-page summary.
Plus a PDF per unit, a whole-book PDF and **EXAM-RESCUE** (the most-marks questions answered first).

Each subject has its own folder. Adding a new one never changes the others.

```
subjects/
  advanced-java/          one folder per subject, side by side
    subject.json          title, code, exam format, code language
    syllabus.json         units -> topics, in syllabus order
    src/unitN.mjs         short source the cards are written from (the only part AI writes)
    topics/unitN/*.json   generated cards
    papers/               question papers as text
    analysis/             questions.json (tagged) -> priority.md
    stories/unitN.md      chapter story + AI video prompt
    output/               lessons/, book/, u1.pdf ... WHOLE-BOOK.pdf, EXAM-RESCUE.pdf
tools/                    build, validate, papers, pdf, guard (free, no AI)
templates/                lesson look (step.css, step.js) and PDF look
.claude/                  add-subject skill + unit-writer agent
```

## Add a new subject
Paste the prompt in [`PROMPT.md`](PROMPT.md) into a Claude session that has this repo, then attach the syllabus and papers. Claude follows `.claude/skills/add-subject/SKILL.md`.

By hand:
```bash
npm i && npx playwright install chromium        # once
npm run new -- distributed-systems "Distributed Systems" CACS352 "TU BCA, Semester VI" none
export SUBJECT=distributed-systems
# fill syllabus.json, write src/unit1.mjs ... (docs/AUTHORING.md)
npm run subject                                   # cards, code check, build, papers, PDFs, guard
```

## Read it
Open `index.html` (all subjects) and pick a subject. It is also published as a private Claude page for the owner.
Answers are drafts until checked against the textbook. Predicted papers are practice guesses.
