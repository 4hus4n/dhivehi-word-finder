import { WORDS, LEVELS } from "./words.js";
import { firebaseConfig } from "./firebase-config.js";

const $ = id => document.getElementById(id);
const FB = "https://www.gstatic.com/firebasejs/10.12.2/";

/* ---------- helpers ---------- */
const CONS = "ހށނރބޅކއވމފދތލގސޑޒޓޔޕޖޗ".split("");
const FILI = ["ަ","ާ","ި","ީ","ު","ޫ","ެ","ޭ","ޮ","ޯ","ަ","ި","ު","ް"];
const COLORS = ["#FF7A7A","#5FE0F0","#9BE86A","#E6F06A","#B98CFF","#FF8AD8","#6FE8A6","#FFC46B","#6FA8FF","#FF9F6B"];
// [dRow,dCol]; dCol +1 moves left on screen (RTL reading)
const DIRS = {1:[[0,1],[1,0]], 2:[[0,1],[1,0],[1,1],[1,-1]], 3:[[0,1],[1,0],[1,1],[1,-1],[0,-1],[-1,0],[-1,-1],[-1,1]]};

function units(w){ const out=[]; for(const ch of w.replace(/\s+/g,"")){ const c=ch.codePointAt(0);
  if(c>=0x07A6&&c<=0x07B0&&out.length) out[out.length-1]+=ch; else out.push(ch);} return out; }
const rnd = n => Math.floor(Math.random()*n);
const shuffle = a => { for(let i=a.length-1;i>0;i--){const j=rnd(i+1);[a[i],a[j]]=[a[j],a[i]];} return a; };
const fmt = s => Math.floor(s/60)+":"+String(Math.floor(s)%60).padStart(2,"0");
const esc = s => String(s??"").replace(/[&<>"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));

/* ---------- progress (local + cloud) ---------- */
const KEY = "dwf-progress";
let progress = load();
function load(){ try{ return JSON.parse(localStorage.getItem(KEY)) || {levels:{}}; }catch(e){ return {levels:{}}; } }
function saveLocal(){ try{ localStorage.setItem(KEY, JSON.stringify(progress)); }catch(e){} }
const better = (a,b) => !b || a.score>b.score || (a.score===b.score && a.time<b.time);
function totals(p){ let total=0,time=0,maxLevel=0;
  for(const [n,r] of Object.entries(p.levels)){ total+=r.score; time+=r.time; maxLevel=Math.max(maxLevel,+n); }
  return {total,time,maxLevel}; }

/* ---------- Firebase ---------- */
let fb=null, user=null;
const fbReady = !!firebaseConfig.apiKey;
async function initFirebase(){
  if(!fbReady){ $("lbBody").innerHTML=`<tr><td colspan="5" class="muted center">Firebase setup pending — see README</td></tr>`; return; }
  const [{initializeApp},auth,fs] = await Promise.all([
    import(FB+"firebase-app.js"), import(FB+"firebase-auth.js"), import(FB+"firebase-firestore.js")]);
  const app = initializeApp(firebaseConfig);
  fb = { auth: auth.getAuth(app), A: auth, db: fs.getFirestore(app), F: fs };
  $("loginBtn").hidden = false;
  auth.getRedirectResult(fb.auth).catch(()=>{});
  auth.onAuthStateChanged(fb.auth, async u => {
    user = u; renderUser();
    if(u){ await syncCloud(); }
    renderLevels(); loadBoard();
  });
}
async function login(){
  const { A, auth } = fb; const p = new A.GoogleAuthProvider();
  try{ await A.signInWithPopup(auth,p); }
  catch(e){ if(/popup/.test(e.code||"")) await A.signInWithRedirect(auth,p); else alertLine("ލޮގިން ނުވި: "+(e.code||e.message)); }
}
function alertLine(t){ $("saveHint").textContent=t; }
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
async function loadBoard(){
  if(!fb) return;
  const { F, db } = fb;
  try{
    const snap = await F.getDocs(F.query(F.collection(db,"players"), F.orderBy("total","desc"), F.limit(50)));
    const rows = snap.docs.map(d=>({id:d.id,...d.data()})).filter(r=>r.total>0)
      .sort((a,b)=>b.total-a.total || a.time-b.time);
    $("lbBody").innerHTML = rows.length ? rows.map((r,i)=>`
      <tr class="${user&&r.id===user.uid?"mine":""}">
        <td>${i<3?`<span class="rank r${i+1}">${i+1}</span>`:`<span class="rank">${i+1}</span>`}</td>
        <td><div class="who">${r.photo?`<img src="${esc(r.photo)}" alt="" referrerpolicy="no-referrer">`:""}<span>${esc(r.name)}</span></div></td>
        <td class="num">${r.maxLevel||0}/10</td>
        <td class="num pts">${r.total}</td>
        <td class="num">${fmt(r.time||0)}</td>
      </tr>`).join("")
      : `<tr><td colspan="5" class="muted center">އަދި އެއްވެސް ކުޅުންތެރިއެއް ނެތް. ފުރަތަމަ ވާށެވެ!</td></tr>`;
  }catch(e){ $("lbBody").innerHTML=`<tr><td colspan="5" class="muted center">ލީޑަބޯޑު ލޯޑް ނުވި</td></tr>`; console.warn(e); }
}
function renderUser(){
  $("me").hidden = !user; $("loginBtn").hidden = !!user || !fbReady;
  if(user){ $("meName").textContent=user.displayName||""; $("meImg").src=user.photoURL||""; }
  $("saveHint").textContent = user ? "ތިޔަ ޕޮއިންޓްތައް ލީޑަބޯޑަށް ރައްކާވަނީ" : "ލީޑަބޯޑަށް ޕޮއިންޓް ރައްކާކުރަން ލޮގިން ކުރޭ";
}

/* ---------- home ---------- */
function renderLevels(){
  const t = totals(progress);
  $("myTotal").textContent = t.total ? `${t.total} ޕޮއިންޓް · ${fmt(t.time)}` : "";
  const next = LEVELS.findIndex((_,i)=>!progress.levels[i+1]) + 1 || 0;
  $("levels").innerHTML = LEVELS.map((L,i)=>{
    const n=i+1, r=progress.levels[n], open = n===1 || progress.levels[n-1];
    const cls = r ? "done" : (n===next ? "next" : "");
    return `<button class="lvl ${cls}" data-n="${n}" ${open?"":"disabled"} aria-label="Level ${n}">
      <span class="n">${open?n:"🔒"}</span><span class="s">${r?r.score+" pts":(open?L.min+(L.max>L.min?"–"+L.max:"")+" އަކުރު":"")}</span></button>`;
  }).join("");
}
$("levels").addEventListener("click", e => { const b=e.target.closest(".lvl"); if(b&&!b.disabled) startLevel(+b.dataset.n); });
$("loginBtn").onclick = () => login();
$("logoutBtn").onclick = async () => { await fb.A.signOut(fb.auth); };
$("refreshBtn").onclick = () => loadBoard();

function show(view){ $("home").hidden = view!=="home"; $("game").hidden = view!=="game"; window.scrollTo(0,0);
  if(view==="home"){ clearInterval(tick); renderLevels(); loadBoard(); } }

/* ---------- game ---------- */
let level=1, cfg=null, size=10, grid=[], placed=[], found=new Set(), t0=0, elapsed=0, tick=null, sel=null, done=false;

function pickWords(c){
  let pool = WORDS.filter(w=>{const n=units(w).length; return n>=c.min && n<=c.max && n<=c.size;});
  if(pool.length < c.count) pool = WORDS.filter(w=>{const n=units(w).length; return n>=c.min-1 && n<=c.max && n<=c.size;});
  return shuffle([...new Set(pool)]);
}
function build(){
  cfg = LEVELS[level-1]; size = cfg.size;
  const pool = pickWords(cfg);
  let bestGrid=null, bestPlaced=[];
  for(let attempt=0; attempt<40; attempt++){
    const g = Array.from({length:size},()=>Array(size).fill(null)), pl=[];
    for(const w of shuffle(pool.slice())){
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
  placed.forEach((p,i)=>{p.color=COLORS[i%COLORS.length]; p.hit=null;});
  found=new Set(); done=false; sel=null;
}
function startLevel(n){
  level=n; build(); show("game");
  $("lvlTitle").textContent = `ލެވެލް ${n}`;
  $("result").hidden = true;
  renderBoard();
  clearInterval(tick); t0=Date.now(); elapsed=0; tick=setInterval(updTimer,250); updTimer();
}
function renderBoard(){
  const g=$("grid"); g.style.gridTemplateColumns=`repeat(${size},1fr)`; g.innerHTML="";
  for(let r=0;r<size;r++) for(let c=0;c<size;c++){ const d=document.createElement("div");
    d.className="cell"; d.dataset.r=r; d.dataset.c=c; d.textContent=grid[r][c]; g.appendChild(d); }
  $("words").innerHTML = placed.map((p,i)=>`<span class="chip" id="chip-${i}"><span class="dot"></span>${p.w}</span>`).join("");
  $("totalN").textContent=placed.length; updCount();
  requestAnimationFrame(()=>{ sizeFont(); drawPills(); });
}
function sizeFont(){ const cell=$("grid").firstChild; if(!cell) return;
  $("grid").style.setProperty("--fs", Math.round(cell.getBoundingClientRect().width*0.55)+"px"); }
const cellEl = (r,c) => $("grid").children[r*size+c];
function center(r,c){ const b=$("board").getBoundingClientRect(), e=cellEl(r,c).getBoundingClientRect();
  return [e.left+e.width/2-b.left, e.top+e.height/2-b.top, e.width]; }
function line(h,color,op){ const [x1,y1,w]=center(h[0],h[1]), [x2,y2]=center(h[2],h[3]);
  return `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${color}" stroke-opacity="${op}" stroke-width="${w*0.8}" stroke-linecap="round"/>`; }
function drawPills(){ if($("game").hidden) return; let s="";
  placed.forEach((p,i)=>{ if(found.has(i)) s+=line(p.hit,p.color,.6); });
  if(sel) s+=line([sel.r,sel.c,sel.end[0],sel.end[1]],"#8FA6AA",.45);
  $("pills").innerHTML=s; }

const cellAt = (x,y) => { const e=document.elementFromPoint(x,y); return e&&e.classList.contains("cell")?e:null; };
$("board").addEventListener("pointerdown", e => { if(done) return; const el=cellAt(e.clientX,e.clientY); if(!el) return;
  sel={r:+el.dataset.r,c:+el.dataset.c,end:[+el.dataset.r,+el.dataset.c]};
  $("board").setPointerCapture(e.pointerId); drawPills(); });
$("board").addEventListener("pointermove", e => { if(!sel) return;
  const b=$("board").getBoundingClientRect(), [sx,sy,w]=center(sel.r,sel.c);
  const dx=e.clientX-b.left-sx, dy=e.clientY-b.top-sy, dist=Math.hypot(dx,dy);
  if(dist<w*0.4){ sel.end=[sel.r,sel.c]; drawPills(); return; }
  const ang=Math.round(Math.atan2(dy,dx)/(Math.PI/4))*(Math.PI/4);
  const sdx=Math.round(Math.cos(ang)), sdy=Math.round(Math.sin(ang));
  let n=Math.round(dist/(w*(sdx&&sdy?Math.SQRT2:1)));
  const dr=sdy, dc=-sdx; // RTL grid: screen-right = lower column
  while(n>0){ const er=sel.r+dr*n, ec=sel.c+dc*n; if(er>=0&&er<size&&ec>=0&&ec<size) break; n--; }
  sel.end=[sel.r+dr*n, sel.c+dc*n]; drawPills(); });
function endSel(){ if(!sel) return; const [er,ec]=sel.end;
  const n=Math.max(Math.abs(er-sel.r),Math.abs(ec-sel.c)), dr=Math.sign(er-sel.r), dc=Math.sign(ec-sel.c);
  const seq=[]; for(let i=0;i<=n;i++) seq.push(grid[sel.r+dr*i][sel.c+dc*i]);
  const fwd=seq.join("|"), rev=seq.slice().reverse().join("|");
  for(let i=0;i<placed.length;i++){ const p=placed[i]; if(found.has(i)) continue;
    const key=p.u.join("|");
    if(n>0 && (key===fwd||key===rev)){ p.hit=[sel.r,sel.c,er,ec]; found.add(i);
      const ch=$("chip-"+i); ch.classList.add("found"); ch.querySelector(".dot").style.background=p.color; break; } }
  sel=null; drawPills(); updCount(); }
$("board").addEventListener("pointerup", endSel);
$("board").addEventListener("pointercancel", endSel);

function updTimer(){ elapsed=(Date.now()-t0)/1000; $("timer").textContent=fmt(elapsed);
  const left=Math.max(0,1-elapsed/cfg.par); $("parFill").style.transform=`scaleX(${left})`;
  $("parFill").parentElement.classList.toggle("over", left===0); }
function updCount(){ $("foundN").textContent=found.size;
  if(!done && placed.length && found.size===placed.length) finish(); }

async function finish(){
  done=true; clearInterval(tick); updTimer();
  const time=Math.round(elapsed*10)/10;
  const wordPts = placed.reduce((s,p)=>s+p.u.length*10,0);
  const bonus = Math.max(0, Math.round((cfg.par-time)*3));
  const score = wordPts+bonus;
  $("rWords").textContent=wordPts; $("rBonus").textContent=bonus; $("rTime").textContent=fmt(time); $("rTotal").textContent=score;
  const rec={score,time}, prev=progress.levels[level];
  if(better(rec,prev)){ progress.levels[level]=rec; saveLocal();
    $("rNote").textContent = prev ? `އާ ރެކޯޑެއް! ކުރީގެ އެންމެ ރަނގަޅު: ${prev.score}` : "";
    if(user){ try{ await pushCloud(); $("rNote").textContent+=" ✓ ލީޑަބޯޑަށް ރައްކާވެއްޖެ"; }catch(e){ $("rNote").textContent+=" (ރައްކާ ނުވި)"; } }
    else if(fbReady) $("rNote").textContent += " ލީޑަބޯޑަށް ލާން ލޮގިން ކުރޭ.";
  } else $("rNote").textContent = `މި ލެވެލްގެ އެންމެ ރަނގަޅު: ${prev.score} (${fmt(prev.time)})`;
  $("nextBtn").hidden = level>=LEVELS.length;
  $("result").hidden=false; $("result").scrollIntoView({behavior:"smooth",block:"nearest"});
}
$("nextBtn").onclick = () => startLevel(level+1);
$("retryBtn").onclick = () => startLevel(level);
$("homeBtn").onclick = () => show("home");
$("backBtn").onclick = () => show("home");

addEventListener("resize", () => { sizeFont(); drawPills(); });
document.fonts && document.fonts.ready.then(()=>{ sizeFont(); drawPills(); });

renderUser(); renderLevels(); initFirebase();
