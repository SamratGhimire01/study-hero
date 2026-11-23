// npm run pdf – unit PDFs, WHOLE-BOOK.pdf, EXAM-RESCUE.pdf from the cards. Needs playwright (npx playwright install chromium).
import fs from 'fs';import path from 'path';
import {ROOT,listSubjects,loadSubject,esc,lessonFile} from './lib.mjs';
import {priority} from './papers.mjs';
const css=fs.readFileSync(path.join(ROOT,'templates/pdf.css'),'utf8');
import {createRequire} from 'module';
let chromium;
try{({chromium}=await import('playwright'))}
catch{try{chromium=createRequire('/opt/node-tools/')('playwright').chromium}catch{console.log('Install first: npm i && npx playwright install chromium');process.exit(1)}}
const doc=b=>`<!doctype html><html><head><meta charset="utf-8"><style>${css}</style></head><body>${b}</body></html>`;
const strip=h=>h.replace(/<[^>]+>/g,'');
function cardPage(S,c,unit,topicTitle){
  const film=c.scenes.slice(0,4).map(s=>{const g=s.glow&&c.actors[s.glow]||c.actors[s.show[0]];return `<div class="fr"><span>${g.e}</span>${esc(s.cap.replace(/[^\x00-\x7F]+/g,'').trim()||s.cap)}</div>`}).join('');
  const lines=c.code.lines.map((l,i)=>`${String(i+1).padStart(2)}  ${l}`).join('\n');
  const steps=c.code.steps.map((s,i)=>`<tr><td>${i+1}</td><td>${s.user?`<b>${esc(s.user)}</b> → `:''}${esc(s.say)}</td></tr>`).join('');
  return `<div class="pg"><div class="hd"><span>${esc(unit.title)}</span><span>${esc(topicTitle)}</span></div><div class="link">⬅️ <b>Last:</b> ${esc(c.last)}<br>➡️ <b>Next:</b> ${esc(c.next)}</div>
  <h2>${esc(c.title)} <span class="tag">${esc(c.marks)}</span></h2><p>🎬 Animation: <code>lessons/${lessonFile(c)}</code></p>
  ${c.answer_html}<div class="film">${film}</div>
  ${c.mnemonics.map(m=>`<div class="mn"><span style="font-size:10pt">${esc(m.label)}</span><big>${m.html}</big></div>`).join('')}
  <h3>Code (${esc(c.code.title)})</h3><pre>${esc(lines)}</pre><table><tr><th>Step</th><th>What happens</th></tr>${steps}</table>
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
  const make=async(name,html)=>{await p.setContent(doc(html));await p.pdf({path:path.join(S.out,name),format:'A4',printBackground:true,margin:{top:'14mm',bottom:'14mm',left:'14mm',right:'14mm'}});console.log('wrote',name)};
  for(const u of S.syllabus.units)if(S.cards.some(c=>c.topic.startsWith(u.id+'.')))await make(`${u.id}.pdf`,unitHTML(S,u));
  const cover=`<div class="pg"><div class="cover"><p>DRAFT</p><h1>${esc(S.subject.title)}</h1><p>${esc(S.subject.code)} · ${esc(S.subject.program)}</p><p style="margin-top:30mm">Memorize Book · every topic in simple English</p></div></div>`;
  await make('WHOLE-BOOK.pdf',cover+S.syllabus.units.map(u=>unitHTML(S,u)).join(''));
  const P=priority(S);
  if(P){const byTopic={};S.cards.filter(c=>c.kind==='lesson').forEach(c=>byTopic[c.topic]=byTopic[c.topic]||c);
   const qs=P.questions.map((q,i)=>{const c=q.topics.map(t=>byTopic[t]).find(Boolean);return `<div class="pg"><div class="hd"><span>EXAM RESCUE</span><span>Priority #${i+1}</span></div><h2>${esc(q.text)} <span class="tag">${q.marks} marks${q.marks_assumed?' (assumed)':''}</span></h2><p class="note">Asked in: ${esc(q.paper)} ${esc(q.q)} · Topics: ${q.topics.join(', ')}</p>${c?c.answer_html:'<p><b>Answer not written yet.</b></p>'}</div>`}).join('');
   const front=`<div class="pg"><div class="hd"><span>EXAM RESCUE</span><span>Read this first</span></div><h2>${esc(S.subject.title)} – most marks first</h2><p class="note">Basis: ${P.nPapers} paper(s). ${P.nPapers<3?'⚠ Few papers, so this is a weak guess. Predicted papers are practice guesses, not promises.':''}</p><table><tr><th>#</th><th>Topic</th><th>Asked</th><th>Marks</th></tr>${P.rows.map((r,i)=>`<tr><td>${i+1}</td><td>${esc(r.title)}</td><td>${r.asked}</td><td>${r.marks}</td></tr>`).join('')}</table><p><b>Coming later:</b> MCQ bank · Predicted Paper 1 · Predicted Paper 2</p></div>`;
   await make('EXAM-RESCUE.pdf',front+qs)}
  await b.close();
}
