// Shared helpers: load subjects, syllabus, cards. No AI, no network.
import fs from 'fs';import path from 'path';
export const ROOT=path.resolve(path.dirname(new URL(import.meta.url).pathname),'..');
export const subjectsDir=path.join(ROOT,'subjects');
export const readJSON=p=>JSON.parse(fs.readFileSync(p,'utf8'));
// allSubjects = every subject folder. listSubjects = the ones to work on now:
// set SUBJECT=<slug> (comma list ok) to touch only that subject; others are left exactly as they are.
export const allSubjects=()=>fs.readdirSync(subjectsDir).filter(d=>fs.existsSync(path.join(subjectsDir,d,'subject.json'))).sort();
export const only=()=>(process.env.SUBJECT||'').split(',').map(s=>s.trim()).filter(Boolean);
export const listSubjects=()=>{const o=only();const all=allSubjects();if(!o.length)return all;
  const miss=o.filter(s=>!all.includes(s));if(miss.length){console.error('Unknown SUBJECT: '+miss.join(', ')+'. Have: '+all.join(', '));process.exit(1)}return all.filter(s=>o.includes(s))};
export function loadSubject(slug){
  const dir=path.join(subjectsDir,slug);
  const subject=readJSON(path.join(dir,'subject.json'));
  const syllabus=readJSON(path.join(dir,'syllabus.json'));
  const cards=[];const tdir=path.join(dir,'topics');
  if(fs.existsSync(tdir))for(const u of fs.readdirSync(tdir).filter(u=>fs.statSync(path.join(tdir,u)).isDirectory()))for(const f of fs.readdirSync(path.join(tdir,u)).filter(f=>f.endsWith('.json')))cards.push({...readJSON(path.join(tdir,u,f)),_file:`${u}/${f}`});
  const order=[];syllabus.units.forEach(u=>u.topics.forEach(t=>order.push(t.id)));
  cards.sort((a,b)=>order.indexOf(a.topic)-order.indexOf(b.topic)||(a.kind==='lesson'?-1:1));
  return {slug,dir,subject,syllabus,cards,order,out:path.join(dir,'output')};
}
export const esc=s=>String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
export const slugOf=c=>c._file.split('/')[1].replace('.json','');
export const lessonFile=c=>`${c.topic.split('.')[0]}-${slugOf(c)}.html`;
