// npm run papers – priority = how often asked x marks x unit hours. Free, local.
import fs from 'fs';import path from 'path';
import {listSubjects,loadSubject,readJSON} from './lib.mjs';
export function priority(S){
  const qf=path.join(S.dir,'analysis/questions.json');if(!fs.existsSync(qf))return null;
  const Q=readJSON(qf);const hours={};S.syllabus.units.forEach(u=>hours[u.id]=u.hours);
  const total=Object.values(hours).reduce((a,b)=>a+b,0);const nPapers=Math.max(1,Q.papers.length);
  const topic={};
  for(const q of Q.questions){const share=q.marks/q.topics.length;for(const t of q.topics){const o=topic[t]=topic[t]||{topic:t,asked:0,marks:0,qs:[]};o.asked++;o.marks+=share;o.qs.push(q.q)}}
  const rows=Object.values(topic).map(o=>{const u=o.topic.split('.')[0];const w=hours[u]/total;return {...o,score:+(o.marks*(1+w)).toFixed(2)}}).sort((a,b)=>b.score-a.score);
  const title={};S.syllabus.units.forEach(u=>u.topics.forEach(t=>title[t.id]=t.title));
  return {papers:Q.papers,nPapers,rows:rows.map(r=>({...r,title:title[r.topic]})),questions:[...Q.questions].sort((a,b)=>b.marks-a.marks)};
}
if(process.argv[1].endsWith('papers.mjs')){
  for(const s of listSubjects()){const S=loadSubject(s);const P=priority(S);if(!P)continue;
    fs.writeFileSync(path.join(S.dir,'analysis/priority.json'),JSON.stringify(P,null,1));
    const md=`# Priority – ${S.subject.title}\nBasis: ${P.nPapers} paper(s). ${P.nPapers<3?'⚠ Few papers: treat as a weak guess. Add more papers.':''}\nScore = marks asked × (1 + unit hours share). Higher = learn first.\n\n| # | Topic | Times asked | Marks | Score |\n|---|---|---|---|---|\n${P.rows.map((r,i)=>`| ${i+1} | ${r.title} (${r.topic}) | ${r.asked} | ${r.marks} | ${r.score} |`).join('\n')}\n`;
    fs.writeFileSync(path.join(S.dir,'analysis/priority.md'),md);console.log(`priority written for ${s} (${P.rows.length} topics)`)}
}
