// npm run build  – builds lesson pages + indexes for every subject. Free, local, no AI.
import fs from 'fs';import path from 'path';
import {ROOT,listSubjects,loadSubject,esc,lessonFile,readJSON} from './lib.mjs';
const css=fs.readFileSync(path.join(ROOT,'templates/lesson.css'),'utf8');
const engine=fs.readFileSync(path.join(ROOT,'templates/engine.js'),'utf8');
const extra=`.nav{display:flex;gap:8px;flex-wrap:wrap;align-items:center;margin:6px 0}.nav a{background:var(--card);border:1px solid var(--line);border-radius:10px;padding:7px 12px;color:var(--ink);text-decoration:none;font-size:15px}.road{display:none}a{color:var(--acc)}
.list li{margin:3px 0}.todo{color:var(--mut)}.ok{color:#16a34a;font-weight:700}`;
const page=(title,body,script='')=>`<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${esc(title)}</title><style>${css}${extra}</style></head><body><div class="w">${body}</div>${script}</body></html>`;
const subs=listSubjects();const rootRows=[];
for(const slug of subs){
  const S=loadSubject(slug);fs.mkdirSync(path.join(S.out,'lessons'),{recursive:true});
  S.cards.forEach((c,i)=>{
    const prev=S.cards[i-1],next=S.cards[i+1];
    const nav=`<div class="nav"><a href="../index.html">☰ ${esc(S.subject.title)}</a>${prev?`<a href="${lessonFile(prev)}">◀ ${esc(prev.title)}</a>`:''}${next?`<a href="${lessonFile(next)}">${esc(next.title)} ▶</a>`:''}<button class="s" id="snd" onclick="togSnd()">🔊 Sound ON</button></div>`;
    const card={...c};delete card._file;
    // engine expects L[i].tab/sub/mn/ans/q
    const legacy={tab:c.title,sub:c.subtitle,marks:c.marks,last:c.last,next:c.next,actors:c.actors,scenes:c.scenes,mn:c.mnemonics.map(m=>[m.label,m.html]),code:c.code,ans:c.answer_html,q:[c.quiz.q,c.quiz.options,c.quiz.answer,c.quiz.why]};
    const html=page(`${c.title} – ${S.subject.code}`,`${nav}<div id="road" class="road"></div><div id="pages"></div><p class="note">${esc(c.confidence)} · Source: ${esc(c.source)}</p>${nav}`,`<script>const L=[${JSON.stringify(legacy)}];\n${engine.replace('const L=[];','')}</script>`);
    fs.writeFileSync(path.join(S.out,'lessons',lessonFile(c)),html);
  });
  // subject index
  const byTopic={};S.cards.forEach(c=>(byTopic[c.topic]=byTopic[c.topic]||[]).push(c));
  const units=S.syllabus.units.map(u=>{const done=u.topics.filter(t=>byTopic[t.id]).length;
    return `<div class="card"><h2>Unit ${u.id.slice(1)} · ${esc(u.title)} <span class="note">${u.hours} hrs · ${done}/${u.topics.length} topics ready</span></h2><ol class="list">${u.topics.map(t=>byTopic[t.id]?`<li class="ok">${esc(t.title)} — ${byTopic[t.id].map(c=>`<a href="lessons/${lessonFile(c)}">${esc(c.title)}${c.kind==='program'?' (program)':''}</a>`).join(' · ')}</li>`:`<li class="todo">${esc(t.title)} (not written yet)</li>`).join('')}</ol>
    ${['pdf'].map(()=>fs.existsSync(path.join(S.out,`${u.id}.pdf`))?`<a href="${u.id}.pdf">📄 Unit ${u.id.slice(1)} PDF</a>`:'').join('')}</div>`}).join('');
  const extras=['EXAM-RESCUE.pdf','WHOLE-BOOK.pdf'].filter(f=>fs.existsSync(path.join(S.out,f))).map(f=>`<a href="${f}">📘 ${f}</a>`).join(' · ');
  fs.writeFileSync(path.join(S.out,'index.html'),page(`${S.subject.title}`,`<div class="nav"><a href="../../../index.html">☰ All subjects</a></div><h1>${esc(S.subject.title)} <span class="note">${esc(S.subject.code)} · ${esc(S.subject.program)}</span></h1><p>${extras}</p>${units}`));
  rootRows.push(`<div class="card"><h2><a href="subjects/${slug}/output/index.html">${esc(S.subject.title)}</a> <span class="note">${esc(S.subject.code)}</span></h2><p class="note">${S.cards.length} lesson cards · ${new Set(S.cards.map(c=>c.topic)).size}/${S.order.length} topics ready</p></div>`);
  console.log(`built ${slug}: ${S.cards.length} lessons`);
}
fs.writeFileSync(path.join(ROOT,'index.html'),page('Study Hero',`<h1>📚 Study Hero</h1><p class="note">One section per subject. Open a subject to see its lessons, PDFs and papers.</p>${rootRows.join('')}`));
