// npm run publish:list – prints the file list for publishing the whole site (root index.html + every subject's output).
import fs from 'fs';import path from 'path';import {allSubjects,subjectsDir} from './lib.mjs';
const walk=d=>fs.readdirSync(d,{withFileTypes:true}).flatMap(e=>e.isDirectory()?walk(path.join(d,e.name)):[path.join(d,e.name)]);
const files=allSubjects().flatMap(s=>{const o=path.join(subjectsDir,s,'output');return fs.existsSync(o)?walk(o):[]}).map(f=>({path:path.relative(path.join(subjectsDir,'..'),f)}));
console.log(JSON.stringify(files));console.error(`${files.length} files. Page = index.html (repo root).`);
