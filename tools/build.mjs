// npm run build  – builds lesson pages + indexes for every subject. Free, local, no AI.
// Lessons are step-by-step players (templates/step.css + step.js): one small step per screen, a big Next button.
import fs from 'fs';import path from 'path';
import {ROOT,listSubjects,loadSubject,esc,lessonFile} from './lib.mjs';
const css=fs.readFileSync(path.join(ROOT,'templates/step.css'),'utf8');
const js=fs.readFileSync(path.join(ROOT,'templates/step.js'),'utf8');
const FONTS='<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Source+Serif+4:opsz,wght@8..60,600&display=swap">';
const page=(title,body,script='')=>`<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover"><title>${esc(title)}</title>${FONTS}<style>${css}</style></head><body>${body}${script}</body></html>`;
const homeScript=`<script>(function(){try{document.querySelectorAll('.topics a').forEach(a=>{if(localStorage.getItem('sh:done:'+a.getAttribute('href').split('/').pop()))a.classList.add('done')});
const l=JSON.parse(localStorage.getItem('sh:last')||'null');if(l&&document.getElementById('cont')){const c=document.getElementById('cont');c.querySelector('.eyebrow').textContent='Continue where you stopped';c.querySelector('h2').textContent=l.title;const b=c.querySelector('.btn');b.href='lessons/'+l.href+'#s'+((l.step||0)+1);b.textContent='Continue →'}}catch(e){}})();</script>`;
const subs=listSubjects();const rootRows=[];
for(const slug of subs){
  const S=loadSubject(slug);fs.mkdirSync(path.join(S.out,'lessons'),{recursive:true});
  const unitOf={};S.syllabus.units.forEach(u=>u.topics.forEach(t=>unitOf[t.id]=u));
  S.cards.forEach((c,i)=>{
    const prev=S.cards[i-1],next=S.cards[i+1],u=unitOf[c.topic];
    const C={tab:c.title,sub:c.subtitle,marks:c.marks,unit:`Unit ${u.id.slice(1)} · ${u.title}`,uid:u.id,last:c.last,next:c.next,actors:c.actors,scenes:c.scenes,mn:c.mnemonics.map(m=>[m.label,m.html]),code:c.code,ans:c.answer_html,q:[c.quiz.q,c.quiz.options,c.quiz.answer,c.quiz.why]};
    C.src=`${c.confidence} · Source: ${c.source}`;
    const NAV={home:'../index.html',next:next?{href:lessonFile(next),title:next.title}:null,prev:prev?{href:lessonFile(prev),title:prev.title}:null};
    const body=`<header class="top"><div class="wrap"><a class="icon" href="../index.html" aria-label="All topics">✕</a><div class="t">${esc(c.title)}</div><span class="count" id="count"></span><button class="icon" id="snd"></button></div><div class="prog"><i id="bar"></i></div><div class="wrap"><nav class="secs" id="secs" aria-label="Parts of this topic"></nav></div></header>
<main class="wrap"><section class="step" id="step" aria-live="polite"></section></main>
<footer class="bot"><div class="wrap"><button class="btn ghost" id="back" aria-label="Back">←</button><button class="btn" id="next">Next →</button></div></footer>`;
    fs.writeFileSync(path.join(S.out,'lessons',lessonFile(c)),page(`${c.title} – ${S.subject.code}`,body,`<script>const C=${JSON.stringify(C)};const NAV=${JSON.stringify(NAV)};\n${js}</script>`));
  });
  // subject home
  const byTopic={};S.cards.forEach(c=>(byTopic[c.topic]=byTopic[c.topic]||[]).push(c));
  let n=0;
  const units=S.syllabus.units.map((u,ui)=>`<details class="unit"${ui==0?' open':''}><summary><h2>${ui+1}. ${esc(u.title)}</h2><span class="mut">${u.topics.length} topics · ${u.hours} hrs</span></summary><ul class="topics">${u.topics.map(t=>{const cs=byTopic[t.id]||[];n++;
      if(!cs.length)return `<li><a aria-disabled="true"><span class="n">${n}</span><span class="tt mut">${esc(t.title)} (not written yet)</span></a></li>`;
      return cs.map((c,k)=>`<li><a class="${k?'sub':''}" href="lessons/${lessonFile(c)}"><span class="n">${k?'':n}</span><span class="tt">${esc(c.kind==='program'?'Program: '+c.title:c.title)}</span><span class="tag">${esc(c.marks)}</span></a></li>`).join('')}).join('')}</ul></details>`).join('');
  const pdfs=[...S.syllabus.units.map(u=>[`${u.id}.pdf`,`Unit ${u.id.slice(1)} PDF`,u.title]),['WHOLE-BOOK.pdf','Whole book PDF','All units'],['EXAM-RESCUE.pdf','Exam Rescue PDF','Most-marks answers first']].filter(([f])=>fs.existsSync(path.join(S.out,f)));
  const first=S.cards[0];
  fs.writeFileSync(path.join(S.out,'index.html'),page(S.subject.title,`<main class="wrap home">
<div class="brand"><a href="../../../index.html" style="text-decoration:none">Study Hero</a></div>
<div><div class="eyebrow">${esc(S.subject.code)} · ${esc(S.subject.program||'')}</div><h1 style="margin-top:6px">${esc(S.subject.title)}</h1><p class="lead mut" style="margin:10px 0 0">Every topic in syllabus order. Open one, then just keep pressing Next.</p></div>
<div class="cont" id="cont"><div class="eyebrow">Start here</div><h2>${esc(first.title)}</h2><a class="btn" href="lessons/${lessonFile(first)}">Start lesson 1 →</a></div>
<div><div class="eyebrow" style="margin-bottom:4px">Units</div>${units}</div>
<div class="files"><div class="eyebrow" style="margin-bottom:8px">Read as a book (same as the PDFs)</div>${pdfs.map(([f,t,d])=>`<a href="book/${f.replace('.pdf','.html')}"><span>${t.replace(' PDF','')}</span><span>${esc(d)}</span></a>`).join('')}</div>
</main>`,homeScript));
  rootRows.push(`<li><a href="subjects/${slug}/output/index.html"><span class="tt">${esc(S.subject.title)}</span><span class="tag">${esc(S.subject.code)} · ${S.cards.length} lessons</span></a></li>`);
  console.log(`built ${slug}: ${S.cards.length} lessons`);
}
fs.writeFileSync(path.join(ROOT,'index.html'),page('Study Hero',`<main class="wrap home"><div><div class="eyebrow">Your subjects</div><h1 style="margin-top:6px">Study Hero</h1><p class="lead mut" style="margin:10px 0 0">Pick a subject. Each one has its own topics and PDFs.</p></div><ul class="topics">${rootRows.join('')}</ul></main>`));
