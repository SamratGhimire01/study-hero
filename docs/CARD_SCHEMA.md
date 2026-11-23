# Topic card (one JSON file per topic) – see `templates/card.example.json`
| field | meaning |
|---|---|
| id, topic, kind | `u1.t10.event-listener`, syllabus topic id, `lesson` or `program` |
| title, subtitle, marks | shown on page; marks like `[3+2]` |
| last, next | one-line links to the previous/next topic (keep the chain) |
| actors | emoji characters: `{id:{e,l,x,y,h}}` (x,y in %; h=1 hidden at start) |
| scenes | ≤8: `{cap, sub, show[], mv?, say?, glow?, snd}` the 60-second story |
| mnemonics | `[{label, html}]` – topic mnemonic + points mnemonic (use `<b>` on the letters) |
| code | `{title, lines[], note, steps[]}`; step = `{l:[text in line], say, user?, win?, mem?, con?, snd}` (`win:{title,vis,items:[{t:'btn|in|lb',v}]}`) |
| answer_html | the exam answer in the owner's format (Definition, Points, Figure, List) |
| quiz | `{q, options[], answer(index), why}` |
| confidence, source | honesty fields (`draft` until checked) |
`npm run validate` checks all of this.
