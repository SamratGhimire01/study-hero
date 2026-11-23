// Short-hand for writing topic cards (saves tokens). A unit source file calls card(...) and emits JSON.
// Usage in subjects/<s>/src/unitN.mjs:  import {...} from '../../../tools/author.mjs'
import fs from 'fs';import path from 'path';import {loadSubject} from './lib.mjs';
// mnemonic: bold first letter of each word of the phrase
export const mn=(label,phrase,meaning)=>({label,html:phrase.split(' ').map(w=>/^[A-Za-z]/.test(w)?`<b>${w[0]}</b>${w.slice(1)}`:w).join(' ')+(meaning?` = ${meaning}`:'')});
// actors: "id|emoji|label|x|y|h" per line
export const actors=s=>Object.fromEntries(s.trim().split('\n').map(l=>{const [id,e,lab,x,y,h]=l.trim().split('|');return [id,{e,l:lab,x:+x,y:+y,...(h?{h:1}:{})}]}));
// scene: S(cap, sub, 'ids', snd, glow, say{}, mv{})
export const S=(cap,sub,show,snd='tick',glow,say,mv)=>({cap,sub,show:show.split(' '),snd,...(glow?{glow}:{}),...(say?{say}:{}),...(mv?{mv}:{})});
// flow: items [emoji,label,cap,sub,snd,say] → actors in a row + one scene per item (+ optional final recap scene)
export function flow(items,recap){const n=items.length,A={},sc=[];
  items.forEach(([e,l],i)=>{A['a'+i]={e,l,x:Math.round(10+80*(n==1?0.5:i/(n-1))),y:i%2?62:52}});
  items.forEach(([e,l,cap,sub,snd,say],i)=>sc.push(S(cap,sub,items.slice(0,i+1).map((_,j)=>'a'+j).join(' '),snd||'tick','a'+i,say?{['a'+i]:say}:undefined)));
  if(recap)sc.push(S(recap[0],recap[1],items.map((_,j)=>'a'+j).join(' '),'ding'));
  return {actors:A,scenes:sc}}
// window mock: W('Title',1,'b:Click','i:text','l:Label')
export const W=(title,vis,...it)=>({title,vis,items:it.map(x=>({t:{b:'btn',i:'in',l:'lb'}[x[0]],v:x.slice(2)}))});
// code trace: T(title, linesString, steps[[needle(s)'a||b', say, snd, extra]], note)
export const T=(title,code,steps,note='(imports skipped)')=>({title,lines:code.replace(/^\n/,'').replace(/\s+$/,'').split('\n'),note,steps:steps.map(([l,say,snd='tick',x={}])=>({l:l.split('||'),say,snd,...x}))});
// exam answer: A({d, p:[], pt, fig, tbl:{h:[],r:[[]]}, x:[[h3,html]], code})
const e=s=>s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
export function A({d,p,pt='Key points',fig,tbl,x=[],code,figT='Figure'}){let h=`<h3>Definition</h3><p>${d}</p>`;
  if(p)h+=`<h3>${pt}</h3><ul>${p.map(i=>`<li>${i}</li>`).join('')}</ul>`;
  if(fig)h+=`<h3>${figT}</h3><pre>${e(fig)}</pre>`;
  if(tbl)h+=`<table><tr>${tbl.h.map(c=>`<th>${c}</th>`).join('')}</tr>${tbl.r.map(r=>`<tr>${r.map(c=>`<td>${c}</td>`).join('')}</tr>`).join('')}</table>`;
  x.forEach(([t,b])=>h+=`<h3>${t}</h3>${b}`);
  if(code)h+=`<h3>Example</h3><pre>${e(code)}</pre>`;return h}
// card writer: fills last/next from syllabus order
export function writer(subject){const S=loadSubject(subject);const t={};S.syllabus.units.forEach(u=>u.topics.forEach(x=>t[x.id]=x.title));
  return function card(c){const i=S.order.indexOf(c.topic);if(i<0)throw Error('bad topic '+c.topic);
    const prev=t[S.order[i-1]],next=t[S.order[i+1]];
    const out={id:`${c.topic}.${c.slug}`,topic:c.topic,kind:c.kind||'lesson',title:c.title,subtitle:c.sub||t[c.topic],marks:c.marks||'[5]',
      confidence:c.conf||'draft – check against textbook',source:c.src||'Core Java Vol I/II (Horstmann), Java Complete Reference (Schildt), Java SE docs',
      last:c.last||(prev?`${prev}. ${c.link||''}`.trim():'Start of the subject.'),next:c.next||(next?`${next}. ${c.nextWhy||''}`.trim():'End of the syllabus. Go to EXAM-RESCUE.'),
      actors:c.actors,scenes:c.scenes,mnemonics:c.mn,code:c.code||null,answer_html:c.ans,quiz:{q:c.q[0],options:c.q[1],answer:c.q[2],why:c.q[3]}};
    const dir=path.join(S.dir,'topics','unit'+c.topic.split('.')[0].slice(1));fs.mkdirSync(dir,{recursive:true});
    fs.writeFileSync(path.join(dir,c.slug+'.json'),JSON.stringify(out,null,1));return out}}
