// npm run validate  – checks every card against the rules. Free, local.
import {listSubjects,loadSubject} from './lib.mjs';
let bad=0;const err=(m)=>{console.log('✗',m);bad++};
for(const s of listSubjects()){
  const S=loadSubject(s);const ids=new Set(S.order);
  const sceneKeys=['cap','sub','show','snd'];
  for(const c of S.cards){
    const w=`${s}/${c._file}`;
    for(const k of ['id','topic','kind','title','marks','last','next','actors','scenes','mnemonics','answer_html','quiz','confidence','source'])if(c[k]===undefined)err(`${w}: missing "${k}"`);
    if(!ids.has(c.topic))err(`${w}: topic ${c.topic} not in syllabus`);
    if(c.scenes&&c.scenes.length>8)err(`${w}: more than 8 scenes (keep short)`);
    (c.scenes||[]).forEach((sc,i)=>{for(const k of sceneKeys)if(sc[k]===undefined)err(`${w}: scene ${i+1} missing ${k}`);(sc.show||[]).forEach(a=>{if(!c.actors[a])err(`${w}: scene ${i+1} unknown actor ${a}`)})});
    const lines=(c.code&&c.code.lines)||[];
    ((c.code&&c.code.steps)||[]).forEach((st,i)=>{(st.l||[]).forEach(x=>{if(!lines.some(l=>l.includes(x)))err(`${w}: code step ${i+1} line text not found: ${x}`)})});
    if(c.quiz&&!(c.quiz.options&&c.quiz.options[c.quiz.answer]!==undefined))err(`${w}: quiz answer index wrong`);
  }
  console.log(`${s}: ${S.cards.length} cards, ${new Set(S.cards.map(c=>c.topic)).size}/${S.order.length} topics covered`);
}
if(bad){console.log(`\n${bad} problem(s)`);process.exit(1)}else console.log('All good ✔');
