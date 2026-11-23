// npm run check:java – compiles every Java code trace with javac (skips servlet/JSP code unless servlet-api.jar is in tools/lib/).
import fs from 'fs';import path from 'path';import os from 'os';import {execSync} from 'child_process';
import {listSubjects,loadSubject,ROOT} from './lib.mjs';
const SETS={gui:'java.awt.* java.awt.event.* java.awt.geom.* javax.swing.* java.io.* javax.imageio.*',sql:'java.sql.* javax.sql.* javax.sql.rowset.*',beans:'java.beans.* java.io.*',rmi:'java.rmi.* java.rmi.server.* java.rmi.registry.*'};
const pick=src=>{const k=/ResultSet|Connection|DriverManager|RowSet/.test(src)?'sql':/Remote|Naming|Registry/.test(src)?'rmi':/Property|Bean|Introspector|XMLEncoder|Serializable/.test(src)&&!/JFrame|JPanel/.test(src)?'beans':'gui';return SETS[k].split(' ').map(i=>`import ${i};`).join('')+'\n'};
const jar=path.join(ROOT,'tools/lib/servlet-api.jar');let ok=0,bad=0,skip=0;
for(const s of listSubjects()){const S=loadSubject(s);if((S.subject.codeLang||'')!=='java')continue;
 for(const c of S.cards){if(!c.code)continue;let src=c.code.lines.join('\n');const own=/^import /m.test(src);const IMPORTS=own?'':pick(src);
  if(/<%|<html|<!DOCTYPE/i.test(src)||(/javax\.servlet|HttpServlet/.test(src)&&!fs.existsSync(jar))){skip++;continue}
  let name='Snip';const m=src.match(/public\s+(?:class|interface)\s+(\w+)/);
  if(m)name=m[1];else if(/^\s*(protected|public) void paintComponent/m.test(src)&&!/class /.test(src))src=`class Snip extends JPanel {\n${src}\n}`;
  else if(!/^\s*(class|interface|public)/m.test(src))src=`public class Snip { public static void main(String[] args) throws Exception {\n${/\bcon\./.test(src)&&!/Connection con/.test(src)?'Connection con = null;\n':''}${src}\n}}`;
  const d=fs.mkdtempSync(path.join(os.tmpdir(),'jc'));fs.writeFileSync(path.join(d,name+'.java'),IMPORTS+src);
  try{execSync(`javac -nowarn -d ${d} ${fs.existsSync(jar)?'-cp '+jar:''} ${d}/*.java`,{stdio:'pipe'});ok++}
  catch(e){bad++;console.log('✗',c.id,'\n',String(e.stderr).split('\n').filter(l=>!l.startsWith('Picked up')).slice(0,6).join('\n'))}}}
console.log(`java: ${ok} compiled, ${bad} failed, ${skip} skipped (servlet)`);if(bad)process.exit(1);
