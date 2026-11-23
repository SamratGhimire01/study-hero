// npm run new -- <slug> "<Title>" <CODE> "<Program>" [codeLang]
// Makes subjects/<slug>/ with empty starter files. Never touches another subject. Refuses if the folder exists.
import fs from 'fs';import path from 'path';import {subjectsDir,allSubjects} from './lib.mjs';
const [slug,title,code='',program='',codeLang='']=process.argv.slice(2);
if(!slug||!title||!/^[a-z0-9]+(-[a-z0-9]+)*$/.test(slug)){console.log('Usage: npm run new -- <slug-like-this> "<Title>" <CODE> "<Program>" [java|c|python|js|none]');process.exit(1)}
const dir=path.join(subjectsDir,slug);
if(fs.existsSync(dir)){console.log(`subjects/${slug} already exists. Not touching it. Existing: ${allSubjects().join(', ')}`);process.exit(1)}
const w=(f,v)=>{fs.mkdirSync(path.dirname(path.join(dir,f)),{recursive:true});fs.writeFileSync(path.join(dir,f),typeof v==='string'?v:JSON.stringify(v,null,1)+'\n')};
w('subject.json',{slug,title,code,program,language:'en-simple',codeLang:codeLang||'none',defaultSource:'FILL: main textbook(s) for this subject',
  exam:{total:60,hours:3,groups:[{name:'A',type:'MCQ',count:10,marksEach:1,attempt:'all'},{name:'B',type:'short',count:7,marksEach:5,attempt:6},{name:'C',type:'long',count:3,marksEach:10,attempt:2}],note:'Default TU BCA format. Change it to match the real papers.'}});
w('syllabus.json',{subject:slug,source:'FILL: where the syllabus came from',units:[{id:'u1',title:'FILL unit title',hours:0,topics:[{id:'u1.t01',title:'FILL first topic'}]}]});
w('analysis/questions.json',{papers:[],questions:[]});
w('src/.keep','');w('topics/.keep','');w('papers/.keep','');w('stories/.keep','');
console.log(`Created subjects/${slug}/. Next: fill syllabus.json, then write src/unit1.mjs (see docs/AUTHORING.md).`);
