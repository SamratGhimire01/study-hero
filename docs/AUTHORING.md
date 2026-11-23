# Writing topic cards (the only part that needs AI)

Read this file instead of `tools/author.mjs` or old unit files. It is everything you need.

One file per unit: `subjects/<slug>/src/unitN.mjs`. Running it writes `subjects/<slug>/topics/unitN/<slug>.json`.
`last` / `next` links are filled from the syllabus automatically.

## Helpers
```js
import {mn,actors,S,flow,W,T,A,writer} from '../../../tools/author.mjs';
const card=writer('<subject-slug>');
```
| helper | what it makes |
|---|---|
| `mn(label, 'Phrase Of Words', 'meaning')` | a memory trick; first letters get bold. Labels: `'Topic trick'`, `'Points trick (N points)'`, `'List trick'` |
| `flow([[emoji,label,cap,sub,snd,say?], ...], [recapCap, recapSub])` | the easy story: actors in a row, one scene per item (max 7 items + recap) |
| `actors('id|emoji|label|x|y')` + `S(cap, sub, 'ids shown', snd, glowId, {id:'bubble'}, {id:[x,y]})` | a custom story when a row is not enough (max 8 scenes) |
| `T(title, codeString, [[needle, say, snd, {mem:[], con:'', win:W(..), user:''}], ...], note)` | code trace. `needle` = text that appears in the line to highlight (`'a||b'` = two lines) |
| `W('Title', 1, 'b:Button', 'i:input text', 'l:Label')` | a fake window shown during a code trace |
| `A({d, p:[], pt, fig, figT, tbl:{h:[], r:[[]]}, x:[[heading, html]], code})` | the exam answer: Definition → Points → Figure → Table → extras → Example |

Sounds: `tick click whoosh ding pop key err`.

## One complete card (copy this shape)
```js
// t03 Stack
card({topic:'u2.t03', slug:'stack', title:'Stack', marks:'[5]',
 link:'Arrays store items in a row. A stack adds one rule.',   // why this follows the last topic
 nextWhy:'A queue is the opposite rule.',                       // why the next topic follows
 ...flow([
  ['🍽️','Plates','Pile of plates','You put a plate on top.','pop'],
  ['⬆️','Push','PUSH','Add on the top.','click','push!'],
  ['⬇️','Pop','POP','Take from the top only.','whoosh'],
  ['👀','Peek','PEEK','Look at the top, do not remove.','tick']],
  ['LIFO','Last In, First Out.']),
 mn:[mn('Topic trick','Last In First Out','LIFO'),
     mn('Points trick (3 points)','Push Pop Peek','add · remove · look')],
 code:T('Program: push and pop',`
Stack<Integer> s = new Stack<>();
s.push(10);
s.push(20);
System.out.println(s.pop());`,[
  ['new Stack','Make an empty stack.','tick',{mem:['s = []']}],
  ['push(10)','10 goes on top.','pop',{mem:['s = [10]']}],
  ['push(20)','20 goes on top of 10.','pop',{mem:['s = [10, 20]']}],
  ['pop()','Top item 20 comes out first.','ding',{mem:['s = [10]'],con:'20'}]]),
 ans:A({d:'A <b>stack</b> is a linear data structure that follows <b>LIFO</b> (Last In, First Out).',
  p:['<b>push</b>: add an item on top.','<b>pop</b>: remove the top item.','<b>peek</b>: read the top item.'],
  fig:'| 20 |  <- top\n| 10 |\n+----+',
  tbl:{h:['Operation','Time'],r:[['push','O(1)'],['pop','O(1)']]}}),
 q:['Which item comes out first from a stack?',['The first one added','The last one added','The smallest one'],1,'Stack is LIFO.']});
```
For a program question, add a second card on the same topic with `kind:'program'` and its own `slug`.
For a topic with no code, leave out `code`.

## Rules that keep quality high
- Simple English, short sentences, key terms in `<b>`. Write what gets marks, no extra theory.
- Every card: a Topic trick AND a Points trick. Tricks must be real words, funny or vivid, easy to say.
- Story: real-life picture first, one idea per scene, max 8 scenes.
- Code must be correct and short. If `codeLang` is `java`, `npm run check:code` compiles it.
- Answers follow the owner's format: Definition → Points → Figure → Code → List/Table.
- Unsure? Keep `conf:'draft – check against textbook'` (default). Never invent facts, years or marks.
