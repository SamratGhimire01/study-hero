// Study Hero lesson player: ONE step on screen, a big Next button, nothing else to hunt for.
// Needs: const C (card) and const NAV ({home, next:{href,title}|null, prev:{href,title}|null}) defined before this file.
let SOUND=true,AC=null;
try{SOUND=localStorage.getItem('sh:sound')!=='0'}catch(e){}
function tone(f,d,type,g,at,f2){const t=AC.currentTime+(at||0),o=AC.createOscillator(),n=AC.createGain();o.type=type||'sine';o.frequency.setValueAtTime(f,t);if(f2)o.frequency.exponentialRampToValueAtTime(f2,t+d);n.gain.setValueAtTime(g||.12,t);n.gain.exponentialRampToValueAtTime(.001,t+d);o.connect(n);n.connect(AC.destination);o.start(t);o.stop(t+d)}
function snd(k){if(!SOUND||!k)return;try{AC=AC||new(window.AudioContext||window.webkitAudioContext)();AC.resume();
 ({tick:()=>tone(660,.07,'triangle',.07),click:()=>{tone(200,.06,'square',.1);tone(90,.08,'sine',.12,.02)},whoosh:()=>tone(250,.4,'sawtooth',.04,0,1400),ding:()=>{tone(880,.25,'sine',.14);tone(1320,.4,'sine',.1,.12)},pop:()=>tone(450,.12,'sine',.14,0,900),key:()=>tone(420,.05,'square',.07),err:()=>tone(150,.3,'sawtooth',.08)})[k]()}catch(e){}}
const $=id=>document.getElementById(id);
const esc=s=>String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
function setSnd(){$('snd').textContent=SOUND?'🔊':'🔇';$('snd').setAttribute('aria-label',SOUND?'Sound on':'Sound off')}
$('snd').onclick=()=>{SOUND=!SOUND;try{localStorage.setItem('sh:sound',SOUND?'1':'0')}catch(e){}setSnd();snd('ding')};setSnd();

// ---- tricks: topic trick first, the "points" trick goes with the points, a "list/table" trick with the table
const tricks=C.mn.map(([label,html])=>({label,html,used:false}));
const takeTrick=re=>{const t=tricks.find(x=>!x.used&&re.test(x.label));if(t)t.used=true;return t};
const trickHTML=t=>t?`<div class="trick"><div class="eyebrow">${t.label}</div><big>${t.html}</big></div>`:'';

// ---- build the step list
const steps=[];const add=(sec,html,enter)=>steps.push({sec,html,enter});
const topicTrick=takeTrick(/topic/i)||tricks.find(x=>!x.used&&(x.used=true));
add('Start',`<div class="eyebrow">${esc(C.unit)} · ${esc(C.marks)}</div><h1>${C.tab}</h1>${C.sub&&C.sub.trim().toLowerCase()!==C.tab.trim().toLowerCase()?`<p class="lead mut">${C.sub}</p>`:''}
 <div class="chain"><div><span class="mut">You just learned</span><br>${C.last}</div><div class="now">Now: ${C.tab}</div><div><span class="mut">Coming next</span><br>${C.next}</div></div>
 ${trickHTML(topicTrick)}<p class="mut">Tap <b>Next</b> to go one small step at a time. About ${Math.max(2,Math.round(stepsEstimate()/4))} minutes.</p>`);
function stepsEstimate(){return C.scenes.length+(C.code?C.code.steps.length:0)+6}

// story: one scene per step
const actors={};
C.scenes.forEach((s,k)=>add('Story',null,el=>story(el,k)));
function story(el,k){const s=C.scenes[k];
 el.innerHTML=`<div class="eyebrow">Story · ${k+1} of ${C.scenes.length}</div><div class="stage" id="stage"></div><h2>${s.cap}</h2><p class="say">${s.sub}</p>`;
 const st=$('stage');const prev=k>0?C.scenes[k-1]:null;
 for(const[id,a]of Object.entries(C.actors)){const d=document.createElement('div');d.className='a';d.innerHTML=a.e+(a.l?`<small>${a.l}</small>`:'');
  const from=prev?((prev.mv&&prev.mv[id])||[a.x,a.y]):[a.x,a.y];d.style.left=from[0]+'%';d.style.top=from[1]+'%';d.style.opacity=prev&&prev.show.includes(id)?1:0;st.appendChild(d);
  const b=document.createElement('div');b.className='b';st.appendChild(b);
  requestAnimationFrame(()=>requestAnimationFrame(()=>{const on=s.show.includes(id),pos=(s.mv&&s.mv[id])||[a.x,a.y];d.style.opacity=on?1:0;d.style.left=pos[0]+'%';d.style.top=pos[1]+'%';d.classList.toggle('glow',s.glow===id);
   const sy=s.say&&s.say[id];if(sy&&on){b.textContent=sy;b.style.left=pos[0]+'%';b.style.top=(pos[1]-14)+'%';b.style.transform=`translate(${pos[0]>75?-92:pos[0]<25?-8:-50}%,-100%)`;setTimeout(()=>b.classList.add('on'),500)}}))}
 snd(s.snd)}

// code trace: one line-step per step
if(C.code){const c=C.code;
 const idx=(s,occ)=>{let seen=0;for(let j=0;j<c.lines.length;j++)if(c.lines[j].includes(s)){if(seen==(occ||0))return j;seen++}return -1};
 c.steps.forEach(s=>s.idx=s.l.map(x=>idx(x,s.occ)));
 c.steps.forEach((s,n)=>add('Code',null,el=>codeStep(el,n)));
 function codeStep(el,n){const s=c.steps[n];let win=null,mem=[],con='';
  for(let j=0;j<=n;j++){const q=c.steps[j];if(q.win)win=q.win;if(q.mem)mem=q.mem;if(q.con!==undefined)con=q.con}
  el.innerHTML=`<div class="eyebrow">How the code runs · ${n+1} of ${c.steps.length}</div>${n==0?`<p class="mut">${esc(c.title)}. The yellow line is the line running now.</p>`:''}
  <div class="code" id="code">${c.lines.map((x,k)=>`<div class="${s.idx.includes(k)?'on':''}"><i>${k+1}</i>${esc(x)}</div>`).join('')}</div>
  ${s.user?`<div class="user">👆 ${esc(s.user)}</div>`:''}<p class="say">${s.say}</p>
  ${win&&win.vis?`<div class="win"><div class="tb"><span>${win.title}</span><span>– □ ✕</span></div><div class="bd">${win.items.map(x=>x.t=='in'?`<input value="${x.v}" readonly tabindex="-1">`:x.t=='btn'?`<span class="bt">${x.v}</span>`:`<span>${x.v}</span>`).join('')}</div></div>`:''}
  ${mem.length?`<div class="box mem"><b>In memory</b><br>${mem.map(esc).join('<br>')}</div>`:''}${con?`<div class="con">&gt; ${esc(con)}</div>`:''}
  ${n==c.steps.length-1&&c.note?`<p class="mut">${c.note}</p>`:''}`;
  const box=$('code'),on=box.querySelector('.on');if(on)box.scrollTop=on.offsetTop-box.clientHeight/3;snd(s.snd)}}

// exam answer: split by heading, one part per step; big tables get their own step
(function(){const tmp=document.createElement('div');tmp.innerHTML=C.ans;const parts=[];let cur=null;
 for(const n of [...tmp.childNodes]){
  if(n.nodeName==='H3'){cur={title:n.textContent,html:''};parts.push(cur);continue}
  if(n.nodeName==='TABLE'&&cur&&cur.html.trim()){cur={title:'Table',html:''};parts.push(cur)}
  if(!cur){cur={title:'Answer',html:''};parts.push(cur)}
  cur.html+=n.nodeName==='TABLE'?`<div class="scroll">${n.outerHTML}</div>`:(n.outerHTML||esc(n.textContent))}
 parts.forEach((p,k)=>{let t='';
  if(/point|role|feature|advantage|step|type/i.test(p.title))t=trickHTML(takeTrick(/point|answer/i));
  if(/table|list|type/i.test(p.title))t+=trickHTML(takeTrick(/list|table|type/i));
  add('Exam answer',`<div class="eyebrow">Write this in the exam · ${k+1} of ${parts.length}</div><h2>${p.title}</h2><div class="ans">${p.html}</div>${t}`)})})();

// leftover tricks + quick check + finish
const left=tricks.filter(x=>!x.used);
if(left.length)add('Remember',`<div class="eyebrow">Remember</div><h2>Say these out loud once</h2>${left.map(trickHTML).join('')}`);
add('Check',`<div class="eyebrow">Quick check</div><h2>${C.q[0]}</h2><div class="step" style="gap:10px">${C.q[1].map((o,k)=>`<button class="opt" data-k="${k}">${o}</button>`).join('')}</div><p class="fb" id="fb" aria-live="polite"></p>`,el=>{
 el.querySelectorAll('.opt').forEach(b=>b.onclick=()=>{const ok=+b.dataset.k===C.q[2];b.classList.add(ok?'ok':'no');snd(ok?'ding':'err');
  $('fb').innerHTML=ok?'Correct. '+C.q[3]:'Not this one. Try another.'})});
add('Done',`<div class="eyebrow">Topic done</div><h1>Nice. ${C.tab} is finished.</h1><p class="lead">${NAV.next?`Next topic: <b>${esc(NAV.next.title)}</b>`:'This was the last topic. Open EXAM-RESCUE from the home page.'}</p><p class="mut">Want it again later? It is in the PDF for this unit too.</p><p class="mut" style="font-size:13px">${esc(C.src||'')}</p>`,()=>{snd('ding');try{localStorage.setItem('sh:done:'+location.pathname.split('/').pop(),'1')}catch(e){}});

// ---- section chips
const secs=[...new Set(steps.map(s=>s.sec))];
$('secs').innerHTML=secs.map(s=>`<span data-s="${s}">${s}</span>`).join('');

// ---- player
let i=0;
function show(n){i=Math.max(0,Math.min(steps.length-1,n));const s=steps[i],el=$('step');
 if(s.html!==null)el.innerHTML=s.html;if(s.enter)s.enter(el);
 $('count').textContent=`${i+1} / ${steps.length}`;$('bar').style.width=((i+1)/steps.length*100)+'%';
 const si=secs.indexOf(s.sec);$('secs').querySelectorAll('span').forEach((x,k)=>{x.className=k==si?'on':k<si?'done':'';if(k==si)x.scrollIntoView({block:'nearest',inline:'center'})});
 $('back').disabled=i==0;
 const nx=$('next');
 if(i==steps.length-1){nx.textContent=NAV.next?'Next topic →':'Back to all topics';nx.onclick=()=>location.href=NAV.next?NAV.next.href:NAV.home}
 else{nx.textContent=i==0?'Start →':'Next →';nx.onclick=()=>{if(s.sec!=='Story'&&s.sec!=='Code')snd('tick');show(i+1)}}
 try{history.replaceState(null,'','#s'+(i+1))}catch(e){}window.scrollTo(0,0);
 try{localStorage.setItem('sh:last',JSON.stringify({href:location.pathname.split('/').pop(),title:C.tab,step:i}))}catch(e){}}
$('back').onclick=()=>show(i-1);
document.addEventListener('keydown',e=>{if(e.key==='ArrowRight')$('next').click();if(e.key==='ArrowLeft'&&i>0)show(i-1)});
window.addEventListener('hashchange',()=>{const m=+(location.hash.match(/^#s(\d+)$/)||[])[1];if(m&&m-1!==i)show(m-1)});
const h=+(location.hash.match(/^#s(\d+)$/)||[])[1];show(h?h-1:0);
