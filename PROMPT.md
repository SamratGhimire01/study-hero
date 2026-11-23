# Paste this into a new Claude session

Copy everything inside the box. Replace the two lines in CAPITALS. Then attach the syllabus (PDF, photo or text) and the question papers.

```text
Repo: https://github.com/SamratGhimire01/study-hero (add it to this session and work on branch main).
My study site: https://claude.ai/artifact/2f1hs21SPKj6VNF7cJDj31

NEW SUBJECT: <subject name, code, e.g. Distributed Systems CACS352, TU BCA Sem VI>
PAPERS: <how many papers I attached, or "none yet">

Add this subject to Study Hero. Read CLAUDE.md first, then follow .claude/skills/add-subject/SKILL.md step by step.
- Keep every other subject exactly as it is. The new subject goes side by side in its own folder. Run with SUBJECT=<slug> and make sure `npm run guard` passes.
- Copy the syllabus in its exact order. One card per topic, in that order.
- Use the unit-writer agent for each unit (one per unit, in parallel) to save tokens. Read docs/AUTHORING.md, not old subjects.
- Quality: simple English, exam-ready answers (Definition, Points, Figure, Code, Table), a topic trick and a points trick on every topic, short story with sound, correct code, quick check. No invented facts or marks.
- Tag every question in my papers, answer them in EXAM-RESCUE with the most marks first, and tell me how many papers the priority is based on.
- After each unit write the short one-hero mnemonic story with an AI video prompt.
- Build everything (npm run subject), commit and push to main.
- Then update my study site at the same link with all subjects (files from npm run publish:list), and send me the unit PDFs, whole-book PDF and EXAM-RESCUE PDF as files.
- Show me a short progress checklist while you work. Ask me only if something in the syllabus is unclear.
```

## Only new question papers for a subject you already have
```text
Repo: https://github.com/SamratGhimire01/study-hero  ·  Site: https://claude.ai/artifact/2f1hs21SPKj6VNF7cJDj31
Here are new question papers for <subject slug, e.g. advanced-java>. Read CLAUDE.md and follow .claude/skills/add-subject/SKILL.md steps 0, 4, 7 and 8 only, with SUBJECT=<slug>. Tag every question, write any missing card, rebuild EXAM-RESCUE (most marks first), push, update the site, and send me the new EXAM-RESCUE PDF.
```
