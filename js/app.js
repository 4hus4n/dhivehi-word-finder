import { LEVELS } from "./words.js";
import { firebaseConfig } from "./firebase-config.js";

const $ = id => document.getElementById(id);
const FB = "https://www.gstatic.com/firebasejs/10.12.2/";
const REDUCED = matchMedia("(prefers-reduced-motion: reduce)").matches;

/* ---------- helpers ---------- */
const CONS = "ހށނރބޅކއވމފދތލގސޑޒޓޔޕޖޗ".split("");
const FILI = ["ަ","ާ","ި","ީ","ު","ޫ","ެ","ޭ","ޮ","ޯ","ަ","ި","ު","ް"];
const COLORS = ["#FF7A6B","#4FD6C9","#9BE86A","#FFC94A","#B98CFF","#FF8AD8","#6FE8A6","#FFA45B","#6FA8FF","#E6F06A"];
const DIRS = {1:[[0,1],[1,0]], 2:[[0,1],[1,0],[1,1],[1,-1]], 3:[[0,1],[1,0],[1,1],[1,-1],[0,-1],[-1,0],[-1,-1],[-1,1]]};

function units(w){ const out=[]; for(const ch of w.replace(/\s+/g,"")){ const c=ch.codePointAt(0);
  if(c>=0x07A6&&c<=0x07B0&&out.length) out[out.length-1]+=ch; else out.push(ch);} return out; }
const rnd = n => Math.floor(Math.random()*n);
const shuffle = a => { for(let i=a.length-1;i>0;i--){const j=rnd(i+1);[a[i],a[j]]=[a[j],a[i]];} return a; };
const fmt = s => Math.floor(s/60)+":"+String(Math.floor(s)%60).padStart(2,"0");
const esc = s => String(s??"").replace(/[&<>"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));
const starsFor = (time,par) => time<=par*0.5 ? 3 : time<=par ? 2 : 1;
function toast(t){ const el=$("toast"); el.hidden=true; void el.offsetWidth; el.textContent=t; el.hidden=false; clearTimeout(toast.t); toast.t=setTimeout(()=>el.hidden=true,2600); }
function countUp(el,to,ms=900){ if(REDUCED){el.textContent=to;return;} const t0=performance.now();
  (function f(t){ const k=Math.min(1,(t-t0)/ms), e=1-Math.pow(1-k,3); el.textContent=Math.round(to*e); if(k<1) requestAnimationFrame(f); })(t0); }

/* ---------- progress ---------- */
const KEY = "dwf-progress";
let progress = load();
function load(){ try{ return JSON.parse(localStorage.getItem(KEY)) || {levels:{}}; }catch(e){ return {levels:{}}; } }
function saveLocal(){ try{ localStorage.setItem(KEY, JSON.stringify(progress)); }catch(e){} }
const better = (a,b) => !b || a.score>b.score || (a.score===b.score && a.time<b.time);
function totals(p){ let total=0,time=0,maxLevel=0;
  for(const [n,r] of Object.entries(p.levels)){ total+=r.score; time+=r.time; maxLevel=Math.max(maxLevel,+n); }
  return {total,time,maxLevel}; }
const nextLevel = () => { const i=LEVELS.findIndex((_,i)=>!progress.levels[i+1]); return i<0 ? LEVELS.length : i+1; };

/* ---------- Firebase ---------- */
let fb=null, user=null;
const fbReady = !!firebaseConfig.apiKey;
async function initFirebase(){
  if(!fbReady) return;
  try{
    const [{initializeApp},auth,fs] = await Promise.all([
      import(FB+"firebase-app.js"), import(FB+"firebase-auth.js"), import(FB+"firebase-firestore.js")]);
    const app = initializeApp(firebaseConfig);
    fb = { auth: auth.getAuth(app), A: auth, db: fs.getFirestore(app), F: fs };
    renderUser();
    auth.getRedirectResult(fb.auth).catch(()=>{});
    auth.onAuthStateChanged(fb.auth, async u => {
      user = u; renderUser();
      if(u){ await syncCloud(); renderStart(); }
      if(!$("s-board").hidden) loadBoard();
    });
  }catch(e){ console.warn(e); }
}
async function login(){
  const { A, auth } = fb; const p = new A.GoogleAuthProvider();
  try{ await A.signInWithPopup(auth,p); }
  catch(e){ if(/popup/.test(e.code||"")) await A.signInWithRedirect(auth,p); else toast("ލޮގިން ނުވި"); }
}
async function syncCloud(){
  if(!fb||!user) return;
  const { F, db } = fb; const ref = F.doc(db,"players",user.uid);
  try{
    const snap = await F.getDoc(ref);
    const remote = snap.exists() ? (snap.data().levels||{}) : {};
    let changed = !snap.exists();
    for(const [n,r] of Object.entries(remote)) if(better(r,progress.levels[n])) progress.levels[n]=r;
    for(const [n,r] of Object.entries(progress.levels)) if(better(r,remote[n])) changed=true;
    saveLocal();
    if(changed) await pushCloud();
  }catch(e){ console.warn(e); }
}
async function pushCloud(){
  if(!fb||!user) return;
  const { F, db } = fb; const t = totals(progress);
  await F.setDoc(F.doc(db,"players",user.uid),{
    name: user.displayName || "Player", photo: user.photoURL || "",
    levels: progress.levels, total: t.total, time: Math.round(t.time), maxLevel: t.maxLevel,
    updatedAt: F.serverTimestamp()
  });
}
function renderUser(){
  $("me").hidden = !user; $("loginBtn").hidden = !!user || !fb;
  if(user){ $("meName").textContent=(user.displayName||"").split(" ")[0]; $("meImg").src=user.photoURL||"";
    $("acctName").textContent=user.displayName||""; $("acctImg").src=user.photoURL||""; }
}
$("loginBtn").onclick = () => login();
$("me").onclick = () => $("acct").hidden=false;
$("acctClose").onclick = () => $("acct").hidden=true;
$("logoutBtn").onclick = async () => { $("acct").hidden=true; await fb.A.signOut(fb.auth); toast("ލޮގްއައުޓް ވެއްޖެ"); };

/* ---------- screens ---------- */
const SCREENS = ["start","levels","board","game"];
function go(name){
  SCREENS.forEach(s=>$("s-"+s).hidden = s!==name);
  window.scrollTo(0,0);
  if(name!=="game") clearInterval(tick);
  if(name==="start") renderStart();
  if(name==="levels") renderLevels();
  if(name==="board") loadBoard();
}
document.addEventListener("click", e => { const b=e.target.closest("[data-go]"); if(b) go(b.dataset.go); });

function renderStart(){
  const t=totals(progress), n=nextLevel();
  $("myTotal").hidden = !t.total;
  $("myTotal").innerHTML = `⭐ <span class="num">${t.total}</span> ޕޮއިންޓް · <span class="num">${fmt(t.time)}</span>`;
  $("playSub").innerHTML = n>LEVELS.length ? "ހުރިހާ ލެވެލެއް ނިމިއްޖެ!" : `ލެވެލް <b class="num">${n}</b>`;
}
$("playBtn").onclick = () => startLevel(Math.min(nextLevel(), LEVELS.length));

function renderLevels(){
  const nx = nextLevel();
  $("levels").innerHTML = LEVELS.map((L,i)=>{
    const n=i+1, r=progress.levels[n], open = n===1 || progress.levels[n-1];
    const st = r ? starsFor(r.time,L.par) : 0;
    const len = `<b class="num">${L.min===L.max ? L.min : L.min+"–"+L.max}</b> އަކުރު`;
    return `<button class="lvl ${!r&&n===nx?"next":""}" data-n="${n}" style="--i:${i}" ${open?"":"disabled"}>
      <div class="top"><span class="n">${n}</span><span class="st">${[1,2,3].map(k=>`<i class="${k<=st?"on":""}">★</i>`).join("")}</span></div>
      <span class="d">${len} · <b class="num">${L.size}×${L.size}</b></span>
      <span class="sc">${r?`<span class="num">${r.score}</span> ޕޮއިންޓް · <span class="num">${fmt(r.time)}</span>`:"&nbsp;"}</span></button>`;
  }).join("");
}
$("levels").addEventListener("click", e => { const b=e.target.closest(".lvl"); if(b&&!b.disabled) startLevel(+b.dataset.n); });

async function loadBoard(){
  const pod=$("podium"), lb=$("lb"), note=$("lbNote");
  if(!fb){ pod.innerHTML=""; lb.innerHTML=""; note.textContent = fbReady ? "..." : "Firebase setup pending — see README"; return; }
  note.textContent="...";
  const { F, db } = fb;
  try{
    const snap = await F.getDocs(F.query(F.collection(db,"players"), F.orderBy("total","desc"), F.limit(50)));
    const rows = snap.docs.map(d=>({id:d.id,...d.data()})).filter(r=>r.total>0).sort((a,b)=>b.total-a.total || a.time-b.time);
    const top=[rows[1],rows[0],rows[2]], meta=[{c:"#C9D3D6",h:"90px",d:".25s",r:2},{c:"#FFC94A",h:"130px",d:".05s",r:1},{c:"#D8955B",h:"64px",d:".4s",r:3}];
    pod.innerHTML = rows.length ? top.map((r,i)=>{ const m=meta[i]; if(!r) return `<div></div>`;
      return `<div class="pod" style="--c:${m.c};--h:${m.h};--d:${m.d}">
        ${r.photo?`<img src="${esc(r.photo)}" alt="" referrerpolicy="no-referrer">`:`<div class="ph"></div>`}
        <span class="nm">${esc((r.name||"").split(" ")[0])}</span><span class="pts">${r.total}</span>
        <div class="col">${m.r}</div></div>`; }).join("") : "";
    lb.innerHTML = rows.slice(3).map((r,i)=>`<li class="${user&&r.id===user.uid?"mine":""}" style="--i:${i}">
        <span class="rk">${i+4}</span>
        <div class="who"><span>${esc(r.name)}</span>${r.photo?`<img src="${esc(r.photo)}" alt="" referrerpolicy="no-referrer">`:""}</div>
        <div class="sc"><b>${r.total}</b><small>L${r.maxLevel||0} · ${fmt(r.time||0)}</small></div></li>`).join("");
    note.textContent = rows.length ? (user ? "" : "ލީޑަބޯޑަށް ވަދެވޭނީ ލޮގިން ކޮށްގެން") : "އަދި އެއްވެސް ކުޅުންތެރިއެއް ނެތް. ފުރަތަމަ ވާށެވެ!";
  }catch(e){ note.textContent="ލީޑަބޯޑު ލޯޑް ނުވި"; console.warn(e); }
}
$("refreshBtn").onclick = () => loadBoard();

/* ---------- game ---------- */
let level=1, cfg=null, size=10, grid=[], placed=[], found=new Set(), t0=0, elapsed=0, tick=null, sel=null, done=false;

// Words not yet played in this level come first; once all are used, the cycle restarts.
const SEEN_KEY="dwf-seen";
function getSeen(){ try{ return JSON.parse(localStorage.getItem(SEEN_KEY))||{}; }catch(e){ return {}; } }
function setSeen(o){ try{ localStorage.setItem(SEEN_KEY,JSON.stringify(o)); }catch(e){} }
const MEAN = new Map(LEVELS.flatMap(L=>L.words));
function pickGroups(c){
  const seen=getSeen(), s=new Set(seen[level]||[]), all=c.words.map(x=>x[0]);
  let fresh=all.filter(w=>!s.has(w));
  if(fresh.length<c.count){ seen[level]=[]; setSeen(seen); return [all,[]]; }
  return [fresh, all.filter(w=>s.has(w))];
}
function markSeen(words){ const seen=getSeen(); seen[level]=[...new Set([...(seen[level]||[]),...words])]; setSeen(seen); }
function build(){
  cfg = LEVELS[level-1]; size = cfg.size;
  const [fresh,old] = pickGroups(cfg);
  let bestGrid=null, bestPlaced=[];
  for(let attempt=0; attempt<40; attempt++){
    const g = Array.from({length:size},()=>Array(size).fill(null)), pl=[];
    for(const w of [...shuffle(fresh.slice()),...shuffle(old.slice())]){
      if(pl.length>=cfg.count) break;
      const u=units(w), dirs=DIRS[cfg.dirs]; let ok=false;
      for(let k=0;k<250&&!ok;k++){
        const [dr,dc]=dirs[rnd(dirs.length)], r=rnd(size), c=rnd(size);
        const er=r+dr*(u.length-1), ec=c+dc*(u.length-1);
        if(er<0||er>=size||ec<0||ec>=size) continue;
        let fit=true; for(let i=0;i<u.length;i++){const x=g[r+dr*i][c+dc*i]; if(x!==null&&x!==u[i]){fit=false;break;}}
        if(!fit) continue;
        for(let i=0;i<u.length;i++) g[r+dr*i][c+dc*i]=u[i];
        pl.push({w,u,r,c,er,ec}); ok=true;
      }
    }
    if(pl.length>bestPlaced.length){ bestGrid=g; bestPlaced=pl; }
    if(pl.length>=cfg.count) break;
  }
  grid=bestGrid; placed=bestPlaced;
  for(let r=0;r<size;r++) for(let c=0;c<size;c++) if(grid[r][c]===null) grid[r][c]=CONS[rnd(CONS.length)]+FILI[rnd(FILI.length)];
  placed.forEach((p,i)=>{p.color=COLORS[i%COLORS.length]; p.hit=null; p.en=MEAN.get(p.w)||"";});
  markSeen(placed.map(p=>p.w));
  found=new Set(); done=false; sel=null;
}
function startLevel(n){
  level=n; build(); $("modal").hidden=true; stopConfetti();
  go("game");
  $("lvlNum").textContent = n;
  renderBoard();
  clearInterval(tick); t0=Date.now(); elapsed=0; tick=setInterval(updTimer,250); updTimer();
}
function renderBoard(){
  const g=$("grid"); g.style.gridTemplateColumns=`repeat(${size},1fr)`; g.innerHTML="";
  const mid=(size-1)/2;
  for(let r=0;r<size;r++) for(let c=0;c<size;c++){ const d=document.createElement("div");
    d.className="cell"; d.dataset.r=r; d.dataset.c=c; d.textContent=grid[r][c];
    d.style.setProperty("--d", (Math.hypot(r-mid,c-mid)*0.05).toFixed(2)+"s"); g.appendChild(d); }
  $("words").innerHTML = placed.map((p,i)=>`<button class="chip" id="chip-${i}" data-w="${p.w}" data-en="${esc(p.en)}" style="--i:${i};--c:${p.color}">${p.w}</button>`).join("");
  $("totalN").textContent=placed.length; $("foundN").textContent=0; $("pills").innerHTML=""; $("floats").innerHTML="";
  requestAnimationFrame(()=>{ sizeFont(); drawPills(); });
}
function sizeFont(){ const cell=$("grid").firstChild; if(!cell) return;
  $("grid").style.setProperty("--fs", Math.round(cell.offsetWidth*0.56)+"px"); }
const cellEl = (r,c) => $("grid").children[r*size+c];
function center(r,c){ const g=$("grid"), e=cellEl(r,c); // layout coords, unaffected by cell animations
  return [g.offsetLeft+e.offsetLeft+e.offsetWidth/2, g.offsetTop+e.offsetTop+e.offsetHeight/2, e.offsetWidth]; }
function line(h,color,op,cls=""){ const [x1,y1,w]=center(h[0],h[1]), [x2,y2]=center(h[2],h[3]);
  const len=Math.ceil(Math.hypot(x2-x1,y2-y1))+1;
  return `<line class="${cls}" style="--len:${len}" x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${color}" stroke-opacity="${op}" stroke-width="${w*0.8}" stroke-linecap="round"/>`; }
let justFound=-1;
function drawPills(){ if($("s-game").hidden) return; let s="";
  placed.forEach((p,i)=>{ if(found.has(i)) s+=line(p.hit,p.color,.65, i===justFound?"draw":""); });
  if(sel) s+=line([sel.r,sel.c,sel.end[0],sel.end[1]],"#FFFFFF",.22);
  $("pills").innerHTML=s; }

const cellAt = (x,y) => { const e=document.elementFromPoint(x,y); return e&&e.classList.contains("cell")?e:null; };
$("board").addEventListener("pointerdown", e => { if(done) return; const el=cellAt(e.clientX,e.clientY); if(!el) return;
  sel={r:+el.dataset.r,c:+el.dataset.c,end:[+el.dataset.r,+el.dataset.c]}; justFound=-1;
  $("board").setPointerCapture(e.pointerId); drawPills(); });
$("board").addEventListener("pointermove", e => { if(!sel) return;
  const b=$("board").getBoundingClientRect(), [sx,sy,w]=center(sel.r,sel.c);
  const dx=e.clientX-b.left-sx, dy=e.clientY-b.top-sy, dist=Math.hypot(dx,dy);
  if(dist<w*0.4){ sel.end=[sel.r,sel.c]; drawPills(); return; }
  const ang=Math.round(Math.atan2(dy,dx)/(Math.PI/4))*(Math.PI/4);
  const sdx=Math.round(Math.cos(ang)), sdy=Math.round(Math.sin(ang));
  let n=Math.round(dist/(w*(sdx&&sdy?Math.SQRT2:1)));
  const dr=sdy, dc=-sdx;
  while(n>0){ const er=sel.r+dr*n, ec=sel.c+dc*n; if(er>=0&&er<size&&ec>=0&&ec<size) break; n--; }
  sel.end=[sel.r+dr*n, sel.c+dc*n]; drawPills(); });
function endSel(){ if(!sel) return; const [er,ec]=sel.end;
  const n=Math.max(Math.abs(er-sel.r),Math.abs(ec-sel.c)), dr=Math.sign(er-sel.r), dc=Math.sign(ec-sel.c);
  const cells=[]; for(let i=0;i<=n;i++) cells.push([sel.r+dr*i, sel.c+dc*i]);
  const seq=cells.map(([r,c])=>grid[r][c]);
  const fwd=seq.join("|"), rev=seq.slice().reverse().join("|");
  let hitIdx=-1;
  for(let i=0;i<placed.length;i++){ const p=placed[i]; if(found.has(i)) continue;
    const key=p.u.join("|"); if(n>0 && (key===fwd||key===rev)){ hitIdx=i; break; } }
  if(hitIdx>=0){
    const p=placed[hitIdx]; p.hit=[sel.r,sel.c,er,ec]; found.add(hitIdx); justFound=hitIdx;
    const ch=$("chip-"+hitIdx); ch.classList.add("found");
    toast(`${p.w} — ${p.en}`);
    cells.forEach(([r,c],k)=>{ const el=cellEl(r,c); el.classList.remove("hit"); void el.offsetWidth;
      el.style.setProperty("--d",(k*0.05)+"s"); el.classList.add("hit"); });
    const [x1,y1]=center(sel.r,sel.c), [x2,y2]=center(er,ec);
    const f=document.createElement("div"); f.className="float"; f.textContent="+"+p.u.length*10;
    f.style.left=((x1+x2)/2)+"px"; f.style.top=((y1+y2)/2)+"px"; $("floats").appendChild(f); setTimeout(()=>f.remove(),1000);
    const fn=$("foundN"); fn.classList.remove("bump"); void fn.offsetWidth; fn.classList.add("bump");
  } else if(n>0){ const b=$("board"); b.classList.remove("shake"); void b.offsetWidth; b.classList.add("shake"); }
  sel=null; drawPills(); updCount(); }
$("board").addEventListener("pointerup", endSel);
$("board").addEventListener("pointercancel", endSel);

function updTimer(){ elapsed=(Date.now()-t0)/1000; $("timer").textContent=fmt(elapsed);
  const left=Math.max(0,1-elapsed/cfg.par); $("parFill").style.transform=`scaleX(${left})`;
  $("parFill").parentElement.classList.toggle("over", left===0); }
function updCount(){ $("foundN").textContent=found.size;
  if(!done && placed.length && found.size===placed.length) setTimeout(finish, 650); }
$("quitBtn").onclick = () => go("levels");

/* ---------- result popup ---------- */
async function finish(){
  if(done) return; done=true; clearInterval(tick); updTimer();
  const time=Math.round(elapsed*10)/10;
  const wordPts = placed.reduce((s,p)=>s+p.u.length*10,0);
  const bonus = Math.max(0, Math.round((cfg.par-time)*3));
  const score = wordPts+bonus, st=starsFor(time,cfg.par);
  const rec={score,time}, prev=progress.levels[level], isBest=better(rec,prev);
  if(isBest){ progress.levels[level]=rec; saveLocal(); }

  $("mTitle").textContent = st===3 ? "ވަރަށް ރަނގަޅު!" : st===2 ? "ރަނގަޅު!" : "ނިންމައިފި!";
  $("mWords").textContent=wordPts; $("mBonus").textContent="+"+bonus; $("mTime").textContent=fmt(time);
  $("mTotal").textContent="0";
  const note=$("mNote"); note.className="mnote";
  note.textContent = isBest ? (prev ? `އާ ރެކޯޑެއް! (ކުރީގައި ${prev.score})` : "") : `އެންމެ ރަނގަޅު: ${prev.score} · ${fmt(prev.time)}`;
  if(isBest&&prev) note.classList.add("rec");
  $("nextBtn").hidden = level>=LEVELS.length;
  $("mWordsList").innerHTML = placed.map(p=>`<button class="mw" data-w="${p.w}" style="--c:${p.color}"><b>${p.w}</b><span>${esc(p.en)}</span></button>`).join("");
  const starsEl=[...$("stars").children]; starsEl.forEach(s=>s.className="");
  $("modal").hidden=false;
  setTimeout(()=>countUp($("mTotal"),score),500);
  starsEl.forEach((s,i)=>setTimeout(()=>{ s.className="show"+(i<st?" on":""); },700+i*280));
  startConfetti(st);

  if(isBest){
    if(user){ try{ await pushCloud(); note.textContent += (note.textContent?" · ":"")+"✓ ލީޑަބޯޑަށް ރައްކާވެއްޖެ"; }catch(e){ note.textContent+=" (ރައްކާ ނުވި)"; } }
    else if(fb) note.textContent += (note.textContent?" · ":"")+"ލީޑަބޯޑަށް ލާން ލޮގިން ކުރޭ";
  }
}
$("nextBtn").onclick = () => startLevel(level+1);

/* ---------- word meanings ---------- */
function showMeaning(w){
  const en=MEAN.get(w)||""; $("wmWord").textContent=w; $("wmEn").textContent=en;
  $("wmCells").textContent=units(w).length; $("wordModal").hidden=false; }
document.addEventListener("click", e => {
  const c=e.target.closest(".chip, .mw"); if(c){ showMeaning(c.dataset.w); return; }
  if(e.target.id==="wordModal"||e.target.closest("#wmClose")) $("wordModal").hidden=true; });
$("retryBtn").onclick = () => startLevel(level);
$("homeBtn").onclick = () => { $("modal").hidden=true; stopConfetti(); go("start"); };

/* ---------- confetti ---------- */
let confRaf=0;
function startConfetti(stars){
  if(REDUCED) return;
  const cv=$("confetti"), ctx=cv.getContext("2d"), dpr=devicePixelRatio||1;
  cv.width=innerWidth*dpr; cv.height=innerHeight*dpr; ctx.scale(dpr,dpr);
  const parts=Array.from({length:60+stars*50},()=>({x:innerWidth/2+(Math.random()-.5)*80,y:innerHeight*0.35,
    vx:(Math.random()-.5)*14,vy:-Math.random()*14-4,r:Math.random()*Math.PI,vr:(Math.random()-.5)*.4,
    w:6+Math.random()*6,h:8+Math.random()*8,c:COLORS[rnd(COLORS.length)]}));
  const t0=performance.now(); cancelAnimationFrame(confRaf);
  (function f(t){ ctx.clearRect(0,0,innerWidth,innerHeight); let alive=false;
    for(const p of parts){ p.vy+=0.35; p.vx*=0.99; p.x+=p.vx; p.y+=p.vy; p.r+=p.vr;
      if(p.y<innerHeight+20) alive=true;
      ctx.save(); ctx.translate(p.x,p.y); ctx.rotate(p.r); ctx.fillStyle=p.c; ctx.fillRect(-p.w/2,-p.h/2,p.w,p.h*Math.abs(Math.cos(p.r*2))+2); ctx.restore(); }
    if(alive && t-t0<5000) confRaf=requestAnimationFrame(f); else ctx.clearRect(0,0,innerWidth,innerHeight); })(t0);
}
function stopConfetti(){ cancelAnimationFrame(confRaf); const cv=$("confetti"); cv.getContext("2d").clearRect(0,0,cv.width,cv.height); }

/* ---------- floating letters background ---------- */
(function bgLetters(){
  const cv=$("bg"), ctx=cv.getContext("2d"); let W=0,H=0, items=[];
  function resize(){ const dpr=devicePixelRatio||1; W=innerWidth; H=innerHeight; cv.width=W*dpr; cv.height=H*dpr; ctx.setTransform(dpr,0,0,dpr,0,0);
    items=Array.from({length:Math.round(W*H/26000)},()=>mk(true)); }
  function mk(any){ return {x:Math.random()*W, y:any?Math.random()*H:H+40, s:18+Math.random()*34, v:.15+Math.random()*.35,
    a:.04+Math.random()*.08, r:(Math.random()-.5)*.6, t:CONS[rnd(CONS.length)]+FILI[rnd(FILI.length)]}; }
  function draw(){ ctx.clearRect(0,0,W,H);
    for(const it of items){ it.y-=it.v; if(it.y<-40) Object.assign(it,mk(false));
      ctx.save(); ctx.translate(it.x,it.y); ctx.rotate(it.r); ctx.globalAlpha=it.a; ctx.fillStyle="#BFD6EE";
      ctx.font=`700 ${it.s}px WordFont, Faruma, sans-serif`; ctx.textAlign="center"; ctx.fillText(it.t,0,0); ctx.restore(); }
    if(!REDUCED) requestAnimationFrame(draw); }
  addEventListener("resize",resize); resize(); draw();
})();

addEventListener("resize", () => { sizeFont(); drawPills(); });
document.fonts && document.fonts.ready.then(()=>{ sizeFont(); drawPills(); });

renderStart(); initFirebase();
