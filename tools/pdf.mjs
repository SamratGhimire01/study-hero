// npm run pdf – unit PDFs, WHOLE-BOOK.pdf, EXAM-RESCUE.pdf from the cards. Needs playwright (npx playwright install chromium).
import fs from 'fs';import path from 'path';
import {ROOT,listSubjects,loadSubject,esc,lessonFile} from './lib.mjs';
import {priority} from './papers.mjs';
const css=fs.readFileSync(path.join(ROOT,'templates/pdf.css'),'utf8');
import {createRequire} from 'module';
let chromium;
try{({chromium}=await import('playwright'))}
catch{try{chromium=createRequire('/opt/node-tools/')('playwright').chromium}catch{console.log('Install first: npm i && npx playwright install chromium');process.exit(1)}}
const doc=b=>`<!doctype html><html><head><meta charset="utf-8"><link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&family=Source+Serif+4:opsz,wght@8..60,600&display=swap"><style>${css}</style></head><body>${b}</body></html>`;
const strip=h=>h.replace(/<[^>]+>/g,'');
function cardPage(S,c,unit,topicTitle){
  const film=c.scenes.slice(0,4).map(s=>{const g=s.glow&&c.actors[s.glow]||c.actors[s.show[0]];return `<div class="fr"><span>${g.e}</span>${esc(s.cap.replace(/[^\x00-\x7F]+/g,'').trim()||s.cap)}</div>`}).join('');
  const lines=!c.code?'':c.code.lines.map((l,i)=>`${String(i+1).padStart(2)}  ${l}`).join('\n');
  const steps=!c.code?'':c.code.steps.map((s,i)=>`<tr><td>${i+1}</td><td>${s.user?`<b>${esc(s.user)}</b> → `:''}${esc(s.say)}</td></tr>`).join('');
  return `<div class="pg"><div class="hd"><span>${esc(unit.title)}</span><span>${esc(topicTitle)}</span></div><div class="link">⬅️ <b>Last:</b> ${esc(c.last)}<br>➡️ <b>Next:</b> ${esc(c.next)}</div>
  <h2>${esc(c.title)} <span class="tag">${esc(c.marks)}</span></h2><p>🎬 Animation: <code>lessons/${lessonFile(c)}</code></p>
  ${c.answer_html}<div class="film">${film}</div>
  ${c.mnemonics.map(m=>`<div class="mn"><span style="font-size:10pt">${esc(m.label)}</span><big>${m.html}</big></div>`).join('')}
  ${c.code?`<h3>Code (${esc(c.code.title)})</h3><pre>${esc(lines)}</pre><table><tr><th>Step</th><th>What happens</th></tr>${steps}</table>`:''}
  <div class="ck">✅ <b>Quick check:</b> ${esc(c.quiz.q)} <i>(${esc(c.quiz.options[c.quiz.answer])})</i></div></div>`}
const unitHTML=(S,u)=>{
  const cards=S.cards.filter(c=>c.topic.startsWith(u.id+'.'));const tt={};u.topics.forEach(t=>tt[t.id]=t.title);
  const road=`<div class="pg"><div class="hd"><span>${esc(S.subject.title)}</span><span>Unit ${u.id.slice(1)}</span></div><h2>Unit ${u.id.slice(1)} · ${esc(u.title)} (${u.hours} hrs)</h2><table><tr><th>#</th><th>Topic (syllabus order)</th><th>Status</th></tr>${u.topics.map((t,i)=>`<tr><td>${i+1}</td><td>${esc(t.title)}</td><td>${cards.some(c=>c.topic===t.id)?'✔ ready':'— not written yet'}</td></tr>`).join('')}</table></div>`;
  const sf=path.join(S.dir,`stories/${u.id.replace('u','unit')}.md`);
  const story=fs.existsSync(sf)?`<div class="pg"><div class="hd"><span>Unit ${u.id.slice(1)}</span><span>Mnemonic story</span></div><pre style="white-space:pre-wrap;font:11pt/1.5 sans-serif;background:#fff;border:0">${esc(fs.readFileSync(sf,'utf8'))}</pre></div>`:'';
  const sheet=cards.length?`<div class="pg"><div class="hd"><span>Unit ${u.id.slice(1)}</span><span>Memory sheet</span></div><h2>Memorize in 5 minutes</h2><table><tr><th>Topic</th><th>Trick</th></tr>${cards.flatMap(c=>c.mnemonics.map(m=>`<tr><td>${esc(c.title)}: ${esc(m.label)}</td><td>${strip(m.html)}</td></tr>`)).join('')}</table></div>`:'';
  return road+cards.map(c=>cardPage(S,c,u,tt[c.topic])).join('')+sheet+story};
for(const slug of listSubjects()){
  const S=loadSubject(slug);fs.mkdirSync(S.out,{recursive:true});const b=await chromium.launch();const p=await b.newPage();
  const make=async(name,html)=>{await p.setContent(doc(html));await p.pdf({path:path.join(S.out,name),format:'A4',printBackground:true,margin:{top:'14mm',bottom:'14mm',left:'14mm',right:'14mm'}});console.log('wrote',name);
    // phone-friendly HTML copy of the same book (PDFs do not show inside some phone viewers)
    fs.mkdirSync(path.join(S.out,'book'),{recursive:true});
    fs.writeFileSync(path.join(S.out,'book',name.replace('.pdf','.html')),`<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${esc(name.replace('.pdf',''))} – ${esc(S.subject.title)}</title><link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&family=Source+Serif+4:opsz,wght@8..60,600&display=swap"><style>${css}
html{background:#fff}body{max-width:760px;margin:0 auto;padding:16px max(16px,env(safe-area-inset-left,0px)) 60px;font-size:16px;overflow-wrap:anywhere}.pg{padding:24px 0;border-bottom:1px solid #e4e4e0}pre{overflow-x:auto;white-space:pre}.cover{min-height:0;padding:28px 18px}.film{grid-template-columns:repeat(2,1fr)}table{display:block;overflow-x:auto}
.back{display:inline-block;padding:10px 0;color:#141414}</style></head><body><a class="back" href="../index.html">← All topics</a>${html}<a class="back" href="../index.html">← All topics</a></body></html>`)};
  for(const u of S.syllabus.units)if(S.cards.some(c=>c.topic.startsWith(u.id+'.')))await make(`${u.id}.pdf`,unitHTML(S,u));
  const cover=`<div class="pg"><div class="cover"><p>Study Hero · draft</p><h1>${esc(S.subject.title)}</h1><p>${esc(S.subject.code)} · ${esc(S.subject.program)}</p><p style="margin-top:30mm">Memorize Book · every topic in simple English</p></div></div>`;
  await make('WHOLE-BOOK.pdf',cover+S.syllabus.units.map(u=>unitHTML(S,u)).join(''));
  const P=priority(S);
  if(P){const byId={};S.cards.forEach(c=>byId[c.id]=c);
   const pick=q=>q.cards?q.cards.map(id=>byId[id]).filter(Boolean):[...new Set(q.topics.map(t=>S.cards.find(c=>c.topic===t&&c.kind==='lesson')).filter(Boolean))];
   const codeOf=c=>c.code?`<h3>${esc(c.code.title)}</h3><pre>${esc(c.code.lines.join('\n'))}</pre>`:'';
   const qs=P.questions.map((q,i)=>{const cs=pick(q);return `<div class="pg"><div class="hd"><span>EXAM RESCUE</span><span>Priority #${i+1}</span></div><h2>${esc(q.text)} <span class="tag">${q.marks} marks${q.marks_assumed?' (assumed)':''}</span></h2><p class="note">Asked in: ${esc(q.paper)} ${esc(q.q)} · Topics: ${q.topics.join(', ')}</p>${cs.length?cs.map(c=>`<div class="link">📖 ${esc(c.title)}</div>${c.answer_html}${(q.type==='long'||/program/i.test(c.marks))?codeOf(c):''}${c.mnemonics.slice(0,2).map(m=>`<div class="mn"><span style="font-size:10pt">${esc(m.label)}</span><big>${m.html}</big></div>`).join('')}`).join(''):'<p><b>Answer not written yet.</b></p>'}</div>`}).join('');
   const front=`<div class="pg"><div class="hd"><span>EXAM RESCUE</span><span>Read this first</span></div><h2>${esc(S.subject.title)} – most marks first</h2><p class="note">Basis: ${P.nPapers} paper(s). ${P.nPapers<3?'⚠ Few papers, so this is a weak guess. Predicted papers are practice guesses, not promises.':''}</p><table><tr><th>#</th><th>Topic</th><th>Asked</th><th>Marks</th></tr>${P.rows.map((r,i)=>`<tr><td>${i+1}</td><td>${esc(r.title)}</td><td>${r.asked}</td><td>${r.marks}</td></tr>`).join('')}</table><p><b>Coming later:</b> MCQ bank · Predicted Paper 1 · Predicted Paper 2</p></div>`;
   await make('EXAM-RESCUE.pdf',front+qs)}
  await b.close();
}
