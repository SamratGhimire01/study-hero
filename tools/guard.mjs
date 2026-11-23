// npm run guard – safety check before commit. With SUBJECT=<slug>: fails if any OTHER subject was changed or deleted.
// Also warns when shared tools/templates changed (those need the owner's OK).
import {execSync} from 'child_process';import {only,allSubjects,ROOT} from './lib.mjs';
const sub=only();const lines=execSync('git status --porcelain',{cwd:ROOT,encoding:'utf8'}).split('\n').filter(Boolean);
let bad=0,warn=0;
for(const l of lines){const st=l.slice(0,2),f=l.slice(3).replace(/^.* -> /,'');
  const m=f.match(/^subjects\/([^/]+)\//);
  if(m&&sub.length&&!sub.includes(m[1])){console.log(`✗ ${f}: belongs to subject "${m[1]}", which you were not asked to change`);bad++}
  else if(m&&/D/.test(st)&&!/output\//.test(f)){console.log(`✗ ${f}: deleted. Subjects are never deleted; restore it with git checkout -- ${f}`);bad++}
  else if(/^(tools|templates)\//.test(f)){console.log(`! ${f}: shared tool/template changed. Only OK if the owner asked for it.`);warn++}}
let before=[];try{before=execSync('git ls-tree -d --name-only HEAD subjects/',{cwd:ROOT,encoding:'utf8'}).split('\n').filter(Boolean).map(x=>x.replace('subjects/',''))}catch(e){}
const missing=before.filter(s=>!allSubjects().includes(s));
if(missing.length){console.log('✗ subject folder missing: '+missing.join(', '));bad++}
console.log(`subjects present: ${allSubjects().join(', ')}`);
if(bad){console.log(`\n${bad} problem(s). Fix before committing.`);process.exit(1)}
console.log(warn?`OK with ${warn} warning(s).`:'Guard OK ✔ (only the chosen subject changed)');
