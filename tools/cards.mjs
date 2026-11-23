// npm run cards – runs subjects/<s>/src/*.mjs to (re)write topic cards. SUBJECT=<slug> limits it to one subject.
import fs from 'fs';import path from 'path';import {execFileSync} from 'child_process';
import {listSubjects,subjectsDir} from './lib.mjs';
for(const s of listSubjects()){const d=path.join(subjectsDir,s,'src');if(!fs.existsSync(d))continue;
  for(const f of fs.readdirSync(d).filter(f=>f.endsWith('.mjs')).sort()){execFileSync(process.execPath,[path.join(d,f)],{stdio:'inherit'});console.log(`cards: ${s}/src/${f}`)}}
