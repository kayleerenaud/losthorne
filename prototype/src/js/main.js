'use strict';
import { AVATARS } from './data/avatars.js';
import { PRICES, SELL_PRICES, STARTING_COINS } from './data/economy.js';
import { ITEM_DEFS } from './data/items.js';
import { POTION_POWERS, POTION_DURATION_MS } from './data/potions.js';
import npcChief from './data/npcs/chief-bonbottom.js';
import npcErik from './data/npcs/erik.js';
import npcDorgan from './data/npcs/dorgan.js';
import npcModo from './data/npcs/modo.js';
import { Quests, questState } from './engine/quests.js';
import questGoblins from './data/quests/main-01-goblins.js';
import questBlueberries from './data/quests/main-02-blueberries.js';
import questTurkeys from './data/quests/main-03-turkeys.js';
import questChampion from './data/quests/main-04-champion.js';
import questShieldTraining from './data/quests/main-05-shield-training.js';
// ============================================================
// LOSTHORNE: LAST LIGHT — playable prototype slice
// Top-down Zelda-style • two-thumb controls • mocked login/rooms
// ============================================================
const $ = id => document.getElementById(id);

// (avatars now live in data/avatars.js)
let chosen = -1;

// ---------- Screen flow ----------
function show(id){ ['title','lobby','select','gameWrap','deathScr'].forEach(s=>$(s).classList.add('hidden')); $(id).classList.remove('hidden');
  document.body.classList.toggle('ingame', id==='gameWrap'); }
$('btnGuest').onclick = ()=> show('lobby');
$('btnGoogle').onclick = $('btnSupa').onclick = function(){ this.textContent='🔧 Pretend-login successful!'; setTimeout(()=>show('lobby'),450); };
$('btnHost').onclick = ()=>{
  const L='BCDFGHKLMNPRSTVWZ', c=()=>L[Math.floor(Math.random()*L.length)];
  $('codeText').textContent = 'LOST-'+c()+c()+c()+c();
  $('hostCode').classList.remove('hidden'); $('joinBox').classList.add('hidden'); $('btnHost').classList.add('hidden');
};
$('btnJoin').onclick = ()=>{
  const v=$('joinInput').value.trim();
  banner(v? 'Fire "'+v.toUpperCase()+'" found! (multiplayer is pretend for now)' : 'Type a code first!');
  if(v) setTimeout(()=>show('select'),900);
};
$('btnGo').onclick = ()=> show('select');
$('btnStart').onclick = ()=>{ if(chosen>=0) startGame(); };

// avatar cards
AVATARS.forEach((a,i)=>{
  const d=document.createElement('div'); d.className='card'; d.dataset.ref='avatar-card-'+a.id.replace('avatar_','').replace(/_/g,'-');
  const cv=document.createElement('canvas'); cv.width=cv.height=72;
  d.appendChild(cv);
  d.insertAdjacentHTML('beforeend','<div class="nm">'+a.nm+'</div><div class="ds">'+a.ds+'</div>');
  drawAvatarIcon(cv.getContext('2d'), a);
  d.onclick=()=>{ document.querySelectorAll('.card').forEach(c=>c.classList.remove('sel')); d.classList.add('sel'); chosen=i; $('btnStart').disabled=false; $('btnStart').style.opacity=1; };
  $('avatarGrid').appendChild(d);
});
function drawAvatarIcon(c,a){
  c.clearRect(0,0,72,72);
  c.fillStyle=a.outfit; rr(c,22,34,28,30,8);                    // body
  c.fillStyle=a.skin; c.beginPath(); c.arc(36,24,13,0,7); c.fill(); // head
  c.fillStyle=a.hair; c.beginPath(); c.arc(36,19,13,Math.PI,0); c.fill(); c.fillRect(23,17,26,6);
  c.fillStyle='#1c150e'; c.fillRect(31,25,3,3); c.fillRect(40,25,3,3); // eyes
  if(a.item==='flute'){ c.strokeStyle='#a87c3f'; c.lineWidth=3.5; c.beginPath(); c.moveTo(48,42); c.lineTo(64,34); c.stroke(); }
  if(a.item==='lute'){ c.fillStyle='#8a5a28'; c.beginPath(); c.ellipse(56,48,8,11,-.5,0,7); c.fill(); c.strokeStyle='#caa'; c.lineWidth=1.5; c.beginPath(); c.moveTo(50,58); c.lineTo(63,36); c.stroke(); }
  if(a.item==='buckle'){ c.fillStyle='#cfd4da'; c.fillRect(32,46,8,7); }
  if(a.item==='pin'){ c.fillStyle='#efe6d0'; c.save(); c.translate(46,14); c.rotate(.6); c.fillRect(-1.5,-8,3,16); c.restore(); }
}
function rr(c,x,y,w,h,r){ c.beginPath(); c.moveTo(x+r,y); c.arcTo(x+w,y,x+w,y+h,r); c.arcTo(x+w,y+h,x,y+h,r); c.arcTo(x,y+h,x,y,r); c.arcTo(x,y,x+w,y,r); c.closePath(); c.fill(); }

// ============================================================
// WORLD
// ============================================================
const W=1600, H=1600;                       // world size
const cvs=$('game'), ctx=cvs.getContext('2d');
let vw=0, vh=0, dpr=1, rotated=false;
function resize(){
  rotated = innerHeight > innerWidth;                 // portrait viewport → rotate the app
  document.body.classList.toggle('forceLand', rotated);
  dpr=Math.min(devicePixelRatio||1,2);
  vw = rotated? innerHeight : innerWidth;             // logical (landscape) size
  vh = rotated? innerWidth  : innerHeight;
  cvs.width=vw*dpr; cvs.height=vh*dpr; ctx.setTransform(dpr,0,0,dpr,0,0);
}
addEventListener('resize',resize); addEventListener('orientationchange',()=>setTimeout(resize,60)); resize();
// map a physical touch/mouse point to logical (landscape) coordinates
function pt(t){ return rotated? {x:t.clientY, y:innerWidth-t.clientX} : {x:t.clientX, y:t.clientY}; }

const P = { x:800, y:1210, dir:0, hp:10, maxhp:10, coins:STARTING_COINS, speed:2.5, slashT:0, smashT:0, smashT0:16, smashR:95, hurtT:0,
  weapon:'fists', weapons:{fists:true, sword:false, bow:false}, arrows:0, potionRolls:[],
  inv:{item_bread:0,item_potion:0,item_turkey:0,item_blueberry:0,item_shield:0,item_wild_turkey:0}, hasShield:false, dashT:0, dashCd:0 };
// combat scale: 1 = one punch. Goblin=8 punches or 3 sword hits (DESIGN.md §7)
const WEAPONS = { fists:{icon:'👊',dmg:1,range:50}, sword:{icon:'⚔️',dmg:3,range:74}, bow:{icon:'🏹'} };
function ownedWeapons(){ return ['fists','sword','bow'].filter(w=>P.weapons[w]); }
const floats=[];   // floating damage/pickup numbers
const drops=[];    // coins dropped by creatures — walk over to collect
function addFloat(x,y,txt,col,size){ floats.push({x,y,txt,col,size:size||16,t:44}); }
function dropCoins(x,y){
  const piles=2+Math.floor(Math.random()*2);
  for(let i=0;i<piles;i++) drops.push({x:x+(Math.random()*36-18), y:y+(Math.random()*36-18), amt:2+Math.floor(Math.random()*3)});
}
const pot = { type:null, t:0 };  // Dorgan's random-power potion (powers in data/potions.js)
const arrows = [];
const dummies = [ {x:660,y:1265,hp:5,maxhp:5,hurtT:0,respawnT:0,showBar:false}, {x:945,y:1265,hp:5,maxhp:5,hurtT:0,respawnT:0,showBar:false} ];
let hungerT = 0;
const HUNGER_EVERY = 75000; // ms until you lose half a heart (Kaylee: "give me longer!")

const trees=[], houses=[], bushes=[];
// forest (north)
for(let i=0;i<46;i++) trees.push({x:80+Math.random()*(W-160), y:70+Math.random()*560, r:22+Math.random()*14});
// scattered mid trees
for(let i=0;i<14;i++) trees.push({x:80+Math.random()*(W-160), y:700+Math.random()*260, r:20+Math.random()*10});
// village houses
[[620,1120],[980,1120],[560,1300],[1030,1300],[790,1370]].forEach(h=>houses.push({x:h[0],y:h[1]}));
// berry bushes: type 'blue' safe, 'red' DEADLY
[[420,880],[1180,840],[760,760],[300,1020],[1320,1000]].forEach(b=>bushes.push({x:b[0],y:b[1],type:'blue',taken:false,respawn:0}));
[[560,940],[1050,760]].forEach(b=>bushes.push({x:b[0],y:b[1],type:'red',taken:false,respawn:0}));

// NPCs are built from data files; dialogue & shops resolved at talk-time from raw data.
const NPCS = [npcChief, npcErik, npcDorgan, npcModo].map(d=>({
  id:d.id, nm:d.name, x:d.pos.x, y:d.pos.y, col:d.look.outfit, hat:!!d.look.hat, raw:d,
}));
function npcLines(n){ const d=n.raw;
  if(d.shopRequiresFlag && !questState.flags[d.shopRequiresFlag] && d.linesLocked) return d.linesLocked;
  return d.lines || d.idleLines;
}
// generic buy flow — behavior comes from the item's effect kind (data-driven)
function buyItem(entry){
  const price=PRICES[entry.item], def=ITEM_DEFS[entry.item], e=def.effect;
  if(P.coins<price){ banner('Not enough coins!'); return; }
  if(e.kind==='unlock_weapon'){
    if(P.weapons[e.weapon]){ banner('You already own that!'); return; }
    P.coins-=price; P.weapons[e.weapon]=true; banner(entry.banner);
  } else if(e.kind==='ammo'){
    P.coins-=price; P.arrows+=e.amount; banner(entry.banner);
  } else if(e.kind==='mystery_potion'){
    P.coins-=price; const k=rollPotion(); P.potionRolls.push(k); P.inv.item_potion++;
    banner('🧪 Dorgan hands you a potion… '+POTION_POWERS[k].ic+' '+POTION_POWERS[k].nm+'!');
  } else {
    P.coins-=price; P.inv[entry.item]=(P.inv[entry.item]||0)+1; banner(entry.banner);
  }
  renderShop();
}
function renderShop(){
  const box=$('shopBox'); box.innerHTML='';
  const d=dNpc && dNpc.raw;
  if(!d) return;
  if(d.shop && !(d.shopRequiresFlag && !questState.flags[d.shopRequiresFlag])){
    for(const entry of d.shop){
      if(entry.requiresFlag && !questState.flags[entry.requiresFlag]) continue;
      const def=ITEM_DEFS[entry.item], price=PRICES[entry.item];
      const b=document.createElement('button'); b.className='btn shopBtn';
      const owned = def.effect.kind==='unlock_weapon' && P.weapons[def.effect.weapon];
      b.textContent = owned? '✔ '+def.nm+' — owned' : entry.label.replace('{price}',price);
      if(owned){ b.disabled=true; b.style.opacity=.55; }
      b.onclick=(ev)=>{ ev.stopPropagation(); buyItem(entry); };
      box.appendChild(b);
    }
  }
  if(d.buys){ // NPCs that BUY from you (Erik + turkeys)
    for(const entry of d.buys){
      const def=ITEM_DEFS[entry.item], price=SELL_PRICES[entry.item];
      const have=P.inv[entry.item]||0;
      const b=document.createElement('button'); b.className='btn shopBtn';
      b.textContent=entry.label.replace('{price}',price)+(have?'  (have '+have+')':'');
      if(!have){ b.disabled=true; b.style.opacity=.5; }
      b.onclick=(ev)=>{ ev.stopPropagation();
        if((P.inv[entry.item]||0)<1) return;
        P.inv[entry.item]--; P.coins+=price; banner(entry.banner); renderShop(); };
      box.appendChild(b);
    }
  }
}

const goblins=[];
function spawnGoblins(){
  goblins.length=0;
  [[600,420],[840,300],[1120,460],[920,560]].forEach(g=>goblins.push({x:g[0],y:g[1],hp:6,maxhp:6,dir:Math.random()*7,t:0,hurtT:0,atkT:0,alive:true,showBar:false}));
}
spawnGoblins();

// wild turkeys — you don't fight them, you GRAB them (quest 3 teaches the grab function)
const turkeys=[];
function spawnTurkeys(){
  turkeys.length=0;
  [[500,860],[900,930],[1250,880],[700,1010]].forEach(t=>turkeys.push({x:t[0],y:t[1],dir:Math.random()*7,t:0}));
}
spawnTurkeys();

// ---------- SCENES: the village + shop interiors ----------
let scene='village';               // 'village' or an npc id (inside their shop)
const SHOP_NPCS = [npcErik, npcDorgan, npcModo];
function shopDoorNearby(){          // in the village, near a shop's door?
  if(scene!=='village') return null;
  for(const d of SHOP_NPCS){ const b=d.building;
    if(Math.hypot(P.x-b.x, P.y-(b.y+40))<46) return d; }
  return null;
}
function enterShop(d){
  scene=d.id; P.x=d.interior.w/2; P.y=d.interior.h-78;
  banner('🚪 '+d.name+"'s "+(d.building.sign)+' shop');
}
function leaveShop(){
  const d=SHOP_NPCS.find(n=>n.id===scene);
  scene='village';
  if(d){ P.x=d.building.x; P.y=d.building.y+52; }
}
function interiorDoorNear(){
  if(scene==='village') return false;
  const d=SHOP_NPCS.find(n=>n.id===scene);
  return d && Math.hypot(P.x-d.interior.w/2, P.y-(d.interior.h-20))<28;
}

// ---------- THE CHAMPION (quest 4) — a human who fights back ----------
let champion=null;
function spawnChampion(){
  // THE PATTERN (learn it!): chase → SHIELD (immune) → swing → swing → OPEN (his weak moment) → repeat
  champion={ x:800, y:1240, hp:28, maxhp:28, dir:0, state:'chase', t:0, hurtT:0, showBar:false, alive:true };
}
const CHAMP_PATTERN={ chase:1400, shield:1100, windup1:480, strike1:220, windup2:420, strike2:220, open:850 };
function champStrike(c){ const d=Math.hypot(P.x-c.x,P.y-c.y); if(d<80) hurtPlayer(2,'The champion’s blow lands like a falling tree.'); }
function turkeyNearby(){
  let best=null,bd=60;
  for(const tk of turkeys){ const d=Math.hypot(tk.x-P.x,tk.y-P.y); if(d<bd){bd=d;best=tk;} }
  return best;
}
let caughtTurkeys=0, turkeyRespawnT=0;
function catchTurkey(){
  const tk=turkeyNearby(); if(!tk) return;
  turkeys.splice(turkeys.indexOf(tk),1);
  caughtTurkeys++;
  P.inv.item_wild_turkey=(P.inv.item_wild_turkey||0)+1;
  addFloat(P.x,P.y-36,'🦃 grabbed!','#f0d8a0',18);
  banner('🦃 Wild turkey into the satchel! ('+P.inv.item_wild_turkey+') — Erik pays 15 apiece');
}

// Quest state lives in engine/quests.js (single questState object).
Quests.init([questGoblins, questBlueberries, questTurkeys, questChampion, questShieldTraining], 'quest_main_01_goblins', {
  banner: (t)=>{ if(t) banner(t); },
  addCoins: (n)=>{ P.coins+=n; },
  itemCount: (id)=>P.inv[id]||0,
  takeItems: (id,n)=>{ P.inv[id]=Math.max(0,(P.inv[id]||0)-n); },
  givePotion: (k)=>{ P.potionRolls.push(k); P.inv.item_potion=(P.inv.item_potion||0)+1; },
  giveItem: (id)=>{ if(id==='item_shield'){ P.hasShield=true; } P.inv[id]=(P.inv[id]||0)+1; },
  retroCount: (o)=> o.target==='entity_turkey' ? caughtTurkeys : 0,
});
let gobRespawnT=0;

// ============================================================
// INPUT — left thumb = move (joystick), right thumb = swipe to slash
// ============================================================
const joy={active:false,id:-1,sx:0,sy:0,dx:0,dy:0};
const swp={active:false,id:-1,sx:0,sy:0,cx:0,cy:0,t0:0};
// Genshin-style lower-right button cluster: big attack in the corner,
// smaller ability buttons arced around it, contextual talk button when near NPCs
function joyHome(){ return {x:Math.max(80,vw*0.14), y:vh-95}; }
function atkBtn(){ return {x:vw-Math.max(80,vw*0.11), y:vh-95, r:40}; }
function smashBtn(){ const a=atkBtn(); return {x:a.x-92, y:a.y+14, r:29}; }   // skill button, left of attack
function wpnBtn(){ const a=atkBtn(); return {x:a.x, y:a.y-98, r:27}; }        // above attack
function bagBtn(){ const a=atkBtn(); return {x:a.x-84, y:a.y-76, r:25}; }     // diagonal
function talkBtn(){ const a=atkBtn(); return {x:a.x, y:a.y-182, r:28}; }      // contextual — only when near someone
function npcNearby(){
  if(scene!=='village'){
    const d=SHOP_NPCS.find(n=>n.id===scene);
    const n=NPCS.find(x=>x.id===scene);
    if(d && n && Math.hypot(d.pos.x-P.x, d.pos.y-P.y)<86) return n;
    return null;
  }
  const chief=NPCS.find(x=>x.id==='npc_chief_bonbottom');
  return (chief && Math.hypot(chief.x-P.x,chief.y-P.y)<70) ? chief : null;
}
function enemyNearby(){
  if(scene!=='village') return false;
  if(champion && champion.alive && Math.hypot(champion.x-P.x,champion.y-P.y)<200) return true;
  for(const g of goblins){ if(g.alive && Math.hypot(g.x-P.x,g.y-P.y)<200) return true; }
  for(const d of dummies){ if(d.hp>0 && Math.hypot(d.x-P.x,d.y-P.y)<120) return true; }
  return false;
}
// THE CONTEXT BUTTON: one slot that morphs to what you need right now
function contextAction(){
  if(dialogOpen||invOpen) return null;
  if(scene!=='village'){
    if(npcNearby()) return {icon:'💬', label:NPCS.find(x=>x.id===scene).nm.split(' ')[0], kind:'talk'};
    if(interiorDoorNear()) return {icon:'🚪', label:'leave', kind:'leave'};
    return {icon:'🚪', label:'to the door', kind:'none'};
  }
  const n=npcNearby(); if(n) return {icon:'💬', label:n.nm.split(' ')[0], kind:'talk'};
  const d=shopDoorNearby(); if(d) return {icon:'🚪', label:'enter '+d.building.sign, kind:'enter', npc:d};
  if(turkeyNearby()) return {icon:'🤲', label:'GRAB!', kind:'grab'};
  if(enemyNearby()) return {icon:'💥', label:'smash', kind:'smash'};
  const av=AVATARS[chosen<0?0:chosen];
  const musical = av.item==='flute'||av.item==='lute';
  return musical? {icon:'🎵', label:'play '+av.item, kind:'music'} : {icon:'💤', label:'rest', kind:'rest'};
}
const blocked = ()=> dialogOpen || invOpen;
const keys={};
addEventListener('keydown',e=>keys[e.key]=1); addEventListener('keyup',e=>keys[e.key]=0);

// ---- ONE-FINGER-FRIENDLY INPUT ----
// Press & drag ANYWHERE (that isn't a button) = invisible joystick, appears under your finger.
// Combat gestures start FROM the attack button: tap = attack, drag = aim slice / pull bow, hold = smash.
// Other buttons are simple taps. Two-finger play (move + fight at once) still works.
const btnTouch={active:false,id:-1,kind:null,sx:0,sy:0};
function buttonAt(x,y){
  const near=(b,pad)=>Math.hypot(x-b.x,y-b.y)<b.r+(pad||10);
  if(near(atkBtn(),14)) return 'atk';
  if(near(smashBtn(),12)) return 'ctx';   // the morphing context button
  if(near(wpnBtn(),12)) return 'wpn';
  if(near(bagBtn(),12)) return 'bag';
  return null;
}
function pointerDown(p,id){
  if(invOpen) return;
  const b=buttonAt(p.x,p.y);
  const ctxIsSmash = b==='ctx' && contextAction()?.kind==='smash';
  if((b==='atk'||ctxIsSmash) && !swp.active){ swp.active=true; swp.smashOnly=ctxIsSmash; swp.id=id; swp.sx=p.x; swp.sy=p.y; swp.cx=p.x; swp.cy=p.y; swp.t0=performance.now(); }
  else if(b && !btnTouch.active){ btnTouch.active=true; btnTouch.id=id; btnTouch.kind=b; btnTouch.sx=p.x; btnTouch.sy=p.y; }
  else if(!b && !joy.active){ joy.active=true; joy.id=id; joy.sx=p.x; joy.sy=p.y; joy.dx=joy.dy=0; joy.t0=performance.now(); }
  else if(!b && joy.active){ // second finger while steering: double-tap = DASH in your movement direction
    const now=performance.now();
    if(now-lastTapT<320){ lastTapT=0; dash(); } else lastTapT=now;
  }
}
function pointerMove(p,id){
  if(joy.active && id===joy.id){ joy.dx=p.x-joy.sx; joy.dy=p.y-joy.sy; }
  if(swp.active && id===swp.id){ swp.cx=p.x; swp.cy=p.y; }
}
function pointerUp(p,id){
  if(joy.active && id===joy.id){
    const dist=Math.hypot(p.x-joy.sx,p.y-joy.sy), dur=performance.now()-(joy.t0||0);
    joy.active=false; joy.dx=joy.dy=0;
    if(dist<8 && dur<260) groundTap();          // a plain tap: talk/advance, never attacks
  }
  if(btnTouch.active && id===btnTouch.id){
    if(Math.hypot(p.x-btnTouch.sx,p.y-btnTouch.sy)<=20) pressButton(btnTouch.kind);
    btnTouch.active=false;
  }
  if(swp.active && id===swp.id){ attackRelease(p.x,p.y); swp.active=false; }
}
let lastTapT=0;
function groundTap(){
  if(dialogOpen){ advanceDialog(); return; }
  const now=performance.now();
  if(now-lastTapT<320){ lastTapT=0; dash(); return; }   // double-tap anywhere = DASH
  lastTapT=now;
  const n=npcNearby(); if(n){ openDialog(n); return; }
  if(turkeyNearby()) catchTurkey();
}
function dash(){
  if(P.dashCd>0 || blocked()) return;
  P.dashT=9; P.dashCd=60;
  addFloat(P.x,P.y-30,'💨','#cfc7b2',18);
}
function pressButton(kind){
  if(kind==='bag'){ openInv(); }
  else if(kind==='ctx'){
    const a=contextAction(); if(!a) return;
    if(a.kind==='talk'){ const n=npcNearby(); if(n) openDialog(n); }
    else if(a.kind==='enter'){ enterShop(a.npc); }
    else if(a.kind==='leave'){ leaveShop(); }
    else if(a.kind==='grab'){ catchTurkey(); }
    else if(a.kind==='music'){ banner('🎵 You play a gentle tune… the village hums along.'); for(let i=0;i<3;i++) addFloat(P.x+(i-1)*16, P.y-30-i*8, '♪', '#ffd977', 15+i*2); }
    else if(a.kind==='rest'){ banner('💤 You rest a moment, watching the clouds.'); addFloat(P.x,P.y-34,'💤','#cfc7b2',18); }
  }
  else if(kind==='wpn'){
    const ows=ownedWeapons();
    if(ows.length<2){ banner('👊 Only your fists for now — visit Modo the blacksmith!'); return; }
    P.weapon = ows[(ows.indexOf(P.weapon)+1)%ows.length];
    banner(P.weapon==='fists'? '👊 Fists up!' : P.weapon==='sword'? '🗡️ Sword drawn' : '🏹 Bow ready — pull back and release! Arrows: '+P.arrows);
  }
}
// release of a gesture that STARTED on the attack button
function attackRelease(x,y){
  if(invOpen) return;
  const dx=x-swp.sx, dy=y-swp.sy, dist=Math.hypot(dx,dy);
  const dur=performance.now()-swp.t0;
  if(swp.smashOnly){                       // the 💥 button: hold to charge
    if(dur>=3000) fullSmash();
    else if(dur>=350) miniSmash();
    else banner('💥 HOLD to charge a smash — 3 full seconds for the big one!');
    return;
  }
  if(P.weapon==='bow'){
    if(dist>25){ const ang=Math.atan2(-dy,-dx); fireArrow(ang,Math.min(dist,130)); } // slingshot
    else fireArrow(P.dir,75);
    return;
  }
  if(dist>18) slash(Math.atan2(dy,dx));    // aimed slice
  else if(dur>=3000) fullSmash();          // charged 3s+ = FULL smash
  else if(dur>=350) miniSmash();           // partial charge = mini smash
  else slash(P.dir);                       // tap = quick attack
}
cvs.addEventListener('touchstart',e=>{ for(const t of e.changedTouches) pointerDown(pt(t),t.identifier); e.preventDefault(); },{passive:false});
cvs.addEventListener('touchmove',e=>{ for(const t of e.changedTouches) pointerMove(pt(t),t.identifier); e.preventDefault(); },{passive:false});
cvs.addEventListener('touchend',e=>{ for(const t of e.changedTouches) pointerUp(pt(t),t.identifier); e.preventDefault(); },{passive:false});
// mouse fallback (desktop testing)
cvs.addEventListener('mousedown',e=>pointerDown(pt(e),'m'));
cvs.addEventListener('mousemove',e=>pointerMove(pt(e),'m'));
cvs.addEventListener('mouseup',e=>pointerUp(pt(e),'m'));

function tapAction(){ // talk to nearby NPC, or attack forward
  if(dialogOpen){ advanceDialog(); return; }
  for(const n of NPCS){ if(Math.hypot(n.x-P.x,n.y-P.y)<70){ openDialog(n); return; } }
  if(P.weapon==='bow') fireArrow(P.dir,75); else slash(P.dir);
}

// ============================================================
// COMBAT
// ============================================================
function eachTarget(cb){
  if(scene!=='village') return;
  for(const g of goblins){ if(g.alive) cb(g,'gob'); }
  for(const d of dummies){ if(d.hp>0) cb(d,'dum'); }
  if(champion && champion.alive) cb(champion,'champ');
}
function hitTarget(t,kind,dmg,ang){
  t.hp-=dmg; t.hurtT=10; t.showBar=true;
  // damage number: bigger hits look bigger (smash/strong arrows pop)
  addFloat(t.x, t.y-30, '-'+dmg, dmg>=8?'#ff7b47':dmg>=3?'#ffb347':'#f0e6d0', dmg>=8?26:dmg>=3?21:15);
  if(kind==='gob'){
    const kb=dmg>=8? 46 : dmg>=3? 34 : 22; t.x+=Math.cos(ang)*kb; t.y+=Math.sin(ang)*kb;
    if(t.hp<=0){ t.alive=false;
      // no coin drops from goblins — coins come from people & boss hoards (DESIGN.md §6)
      const r=Quests.emit('kill',{target:'enemy_goblin'});
      banner('Goblin driven off!'+(r.counted?'  ('+r.progress+'/'+r.count+')':''));
      if(r.banner && r.progress===r.count) banner(r.banner); }
  } else if(kind==='champ'){
    if(t.state==='shield'){ t.hp+=dmg; addFloat(t.x,t.y-40,'🛡️ BLOCKED','#cfd4da',15); return; } // no damage through his shield
    const kb=14; t.x+=Math.cos(ang)*kb; t.y+=Math.sin(ang)*kb;
    if(t.hp<=0){ t.alive=false;
      const r=Quests.emit('kill',{target:'enemy_champion'});
      banner(r.banner ?? '🏆 The champion yields!');
    }
  } else {
    if(t.hp<=0){ t.respawnT=8000; banner('🎯 Training dummy destroyed! It will be rebuilt.'); }
  }
}
const dmgBonus = ()=> pot.t>0 ? (POTION_POWERS[pot.type]?.dmgBonus||0) : 0;
function slash(ang){
  if(P.slashT>0 || blocked()) return;
  const w=WEAPONS[P.weapon]||WEAPONS.fists;
  P.dir=ang; P.slashT=14;
  eachTarget((t,kind)=>{
    const d=Math.hypot(t.x-P.x,t.y-P.y), a=Math.atan2(t.y-P.y,t.x-P.x);
    let diff=Math.abs(a-ang); if(diff>Math.PI) diff=2*Math.PI-diff;
    if(d<w.range && diff<1.15) hitTarget(t,kind,w.dmg+dmgBonus(),a);
  });
}
// SMASH is charged now: hold 0.35–3s = mini smash, hold 3s+ = FULL smash.
// While charging you are rooted — that's the risk. (DESIGN.md §7)
function miniSmash(){ doSmash(4,80,16); }
function fullSmash(){ doSmash(8,130,22); }
function doSmash(dmg,radius,fx){
  if(P.slashT>0 || blocked()) return;
  P.slashT=22; P.smashT=fx; P.smashT0=fx; P.smashR=radius;
  eachTarget((t,kind)=>{
    const d=Math.hypot(t.x-P.x,t.y-P.y);
    if(d<radius) hitTarget(t,kind,dmg+dmgBonus(),Math.atan2(t.y-P.y,t.x-P.x));
  });
}
// derived: is the current right-side hold a smash charge?
function chargeInfo(){
  if(!swp.active) return null;
  if(P.weapon==='bow' && !swp.smashOnly) return null;
  const dist=Math.hypot(swp.cx-swp.sx,swp.cy-swp.sy);
  if(dist>18 && !swp.smashOnly) return null;   // it's a slice-aim drag
  const dur=performance.now()-swp.t0;
  if(dur<350) return null;
  return { p:Math.min(1,(dur-350)/2650), full:dur>=3000 };
}
function fireArrow(ang,power){
  if(blocked()) return;
  if(P.arrows<=0){ banner('🎯 Out of arrows! Modo sells packs.'); return; }
  P.arrows--;
  P.dir=ang;
  const sp=5+(power/130)*8;
  arrows.push({x:P.x,y:P.y-6,vx:Math.cos(ang)*sp,vy:Math.sin(ang)*sp,life:70,dmg:(power>85?4:3)+dmgBonus(),ang});
}
function rollPotion(){ const keys=Object.keys(POTION_POWERS); return keys[Math.floor(Math.random()*keys.length)]; }
function drinkPotion(k){
  if(!k) k=rollPotion();
  pot.type=k; pot.t=POTION_DURATION_MS;
  banner(POTION_POWERS[k].ic+' The potion takes hold: '+POTION_POWERS[k].nm+'! (30s)');
  addFloat(P.x,P.y-40,POTION_POWERS[k].ic+' '+POTION_POWERS[k].nm+'!','#d9b8ff',20);
}

// ---------- INVENTORY ----------
const EFFECTS = {
  heal(e){ P.hp=Math.min(P.maxhp,P.hp+e.halfHearts); if(e.resetHunger) hungerT=0; banner(e.banner); addFloat(P.x,P.y-36,e.float,'#7ed67e',18); },
  mystery_potion(){ drinkPotion(P.potionRolls.shift()); },
};
function useItem(id){ const e=ITEM_DEFS[id].effect; EFFECTS[e.kind](e); }
let invOpen=false, invSel=null;
function openInv(){ if(dialogOpen) closeDialog(); invOpen=true; invSel=null; renderInv(); $('inv').classList.remove('hidden'); }
function closeInv(){ invOpen=false; $('inv').classList.add('hidden'); }
function renderInv(){
  const g=$('invGrid'), det=$('invDetail');
  if(invSel){
    g.classList.add('hidden'); det.classList.remove('hidden');
    const it=ITEM_DEFS[invSel];
    det.querySelector('.bigIc').textContent=it.ic;
    det.querySelector('.inm').textContent=it.nm+'  ×'+P.inv[invSel];
    let stHtml=it.st;
    if(invSel==='item_potion' && P.potionRolls[0]){ const pp=POTION_POWERS[P.potionRolls[0]];
      stHtml += '<br><b style="color:#d9b8ff">This one is: '+pp.ic+' '+pp.nm+'</b>'; }
    det.querySelector('.ist').innerHTML=stHtml;
    return;
  }
  g.classList.remove('hidden'); det.classList.add('hidden');
  g.innerHTML='';
  let any=false;
  for(const k in ITEM_DEFS){ if(P.inv[k]>0){ any=true;
    const d=document.createElement('div'); d.className='invItem';
    d.innerHTML='<div class="ic">'+ITEM_DEFS[k].ic+'</div><div class="ct">'+ITEM_DEFS[k].nm+' ×'+P.inv[k]+'</div>';
    d.onclick=()=>{ invSel=k; renderInv(); };
    g.appendChild(d);
  } }
  if(!any) g.innerHTML='<div class="invEmpty">Your satchel is empty.<br>Buy bread from Erik or a potion from Dorgan in the village.</div>';
}
$('invClose').onclick=closeInv;
$('invBack').onclick=()=>{ invSel=null; renderInv(); };
$('invUse').onclick=()=>{ if(!invSel || P.inv[invSel]<1) return;
  const e=ITEM_DEFS[invSel].effect;
  if(e.kind==='passive'){ banner('🛡️ It’s equipped — always with you.'); return; }   // permanent gear never vanishes
  if(e.kind==='sellable'){ banner('🦃 Erik buys these — visit the 🪙 shop!'); return; }
  P.inv[invSel]--; useItem(invSel); closeInv(); };
function hurtPlayer(n,why){
  if(P.hurtT>0) return;
  if(P.hasShield && chargeInfo()){ banner('🛡️ Blocked with the Champion’s Shield!'); addFloat(P.x,P.y-36,'🛡️','#cfd4da',20); P.hurtT=25; return; }
  if(pot.t>0 && POTION_POWERS[pot.type]?.blocksDamage){ banner('🛡️ Stoneskin absorbs the blow!'); P.hurtT=30; return; }
  P.hp-=n; P.hurtT=45;
  if(P.hp<=0) die(why||'A goblin got the better of you.');
}
function die(msg,title){
  pot.type=null; pot.t=0;   // you don't keep a potion through death
  $('deathTitle').textContent = title||'You have fallen';
  $('deathMsg').textContent = msg+' You wake at the edge of the territory.';
  show('deathScr');
  running=false;
}
$('btnRespawn').onclick=()=>{ P.x=800; P.y=1210; P.hp=5; hungerT=0; P.hurtT=60; scene='village'; show('gameWrap'); running=true; loop(); };  // 2½ hearts — food still matters

// ============================================================
// DIALOGUE
// ============================================================
let dialogOpen=false, dNpc=null, dIdx=0, dLines=[];
function openDialog(n){ dialogOpen=true; dNpc=n; dIdx=0;
  dLines = Quests.dialogueFor(n.id) || npcLines(n);
  renderDialog(); $('dialog').classList.remove('hidden'); }
function renderDialog(){
  $('dialog').querySelector('.who').textContent=dNpc.nm;
  $('dialog').querySelector('.txt').textContent=dLines[dIdx];
  renderShop();
}
function advanceDialog(){
  dIdx++;
  if(dIdx>=dLines.length){
    Quests.onDialogueEnd(dNpc.id);   // quest transitions (offer→active, complete→reward)
    closeDialog();
  } else renderDialog();
}
function closeDialog(){ dialogOpen=false; $('dialog').classList.add('hidden'); }
$('dialog').onclick=advanceDialog;

// ============================================================
// BANNER
// ============================================================
let bannerT=null;
function banner(t){ const b=$('banner'); b.textContent=t; b.style.opacity=1; clearTimeout(bannerT); bannerT=setTimeout(()=>b.style.opacity=0,2600); }

// ============================================================
// UPDATE
// ============================================================
let last=0, running=false;
function update(dt){
  // movement
  let mx=0,my=0;
  if(joy.active){ const m=Math.hypot(joy.dx,joy.dy); if(m>6){ const cl=Math.min(m,52)/52; mx=joy.dx/m*cl; my=joy.dy/m*cl; } }
  if(keys.w||keys.ArrowUp)my=-1; if(keys.s||keys.ArrowDown)my=1; if(keys.a||keys.ArrowLeft)mx=-1; if(keys.d||keys.ArrowRight)mx=1;
  if(keys[' ']){ slash(P.dir); }
  if(P.dashT>0){ P.dashT--; P.x+=Math.cos(P.dir)*7.5; P.y+=Math.sin(P.dir)*7.5; }
  if(P.dashCd>0) P.dashCd--;
  const spd = P.speed * (pot.t>0 ? (POTION_POWERS[pot.type]?.speedMult||1) : 1);
  const charging = chargeInfo();
  if((mx||my) && !blocked() && !charging){
    P.x+=mx*spd; P.y+=my*spd; P.dir=Math.atan2(my,mx);
    P.x=Math.max(30,Math.min(W-30,P.x)); P.y=Math.max(30,Math.min(H-30,P.y));
    for(const t of trees){ const d=Math.hypot(t.x-P.x,t.y-P.y); if(d<t.r+12){ const a=Math.atan2(P.y-t.y,P.x-t.x); P.x=t.x+Math.cos(a)*(t.r+12); P.y=t.y+Math.sin(a)*(t.r+12);} }
    for(const h of houses){ if(Math.abs(P.x-h.x)<62 && Math.abs(P.y-h.y)<56){ if(Math.abs(P.x-h.x)/62>Math.abs(P.y-h.y)/56) P.x=h.x+Math.sign(P.x-h.x)*62; else P.y=h.y+Math.sign(P.y-h.y)*56; } }
  }
  if(P.slashT>0)P.slashT--; if(P.smashT>0)P.smashT--; if(P.hurtT>0)P.hurtT--;
  if(pot.t>0){ pot.t-=dt; if(pot.t<=0){ pot.type=null; banner('The potion wears off…'); } }

  // arrows
  for(let i=arrows.length-1;i>=0;i--){ const a=arrows[i];
    a.x+=a.vx; a.y+=a.vy; a.life--;
    let dead = a.life<=0 || a.x<0||a.x>W||a.y<0||a.y>H;
    if(!dead) for(const t of trees){ if(Math.hypot(t.x-a.x,t.y-a.y)<t.r*.8){ dead=true; break; } }
    if(!dead) eachTarget((t,kind)=>{ if(!dead && Math.hypot(t.x-a.x,t.y-a.y)<17){ hitTarget(t,kind,a.dmg,a.ang); dead=true; } });
    if(dead) arrows.splice(i,1);
  }

  // shop interiors: no wildlife inside
  if(scene!=='village'){
    // walls
    const d=SHOP_NPCS.find(n=>n.id===scene);
    if(d){ P.x=Math.max(26,Math.min(d.interior.w-26,P.x)); P.y=Math.max(70,Math.min(d.interior.h-18,P.y)); }
  }

  // turkeys respawn over time so the meadow never runs dry
  if(scene==='village' && turkeys.length<4){ turkeyRespawnT+=dt;
    if(turkeyRespawnT>20000){ turkeyRespawnT=0; turkeys.push({x:200+Math.random()*1200, y:760+Math.random()*280, dir:Math.random()*7, t:0}); } }

  // the champion: approach → shield up (immune) → wind-up (get clear!) → strike
  if(questState.currentId==='quest_main_04_champion' && questState.stage==='active' && !champion) spawnChampion();
  if(champion && champion.alive && scene==='village' && !blocked()){
    const c=champion; c.t+=dt;
    const d=Math.hypot(P.x-c.x,P.y-c.y);
    if(c.hurtT>0) c.hurtT--;
    const a=Math.atan2(P.y-c.y,P.x-c.x); c.dir=a;
    // he presses you constantly — fast chase, slower mid-combo, frozen only when 'open'
    const spdBy={chase:1.9, shield:0.8, windup1:1.0, strike1:0, windup2:1.0, strike2:0, open:0};
    const cs=spdBy[c.state]||0;
    if(cs>0 && d>52){ c.x+=Math.cos(a)*cs; c.y+=Math.sin(a)*cs; }
    if(c.t>CHAMP_PATTERN[c.state]){
      c.t=0;
      const NEXT={chase:'shield', shield:'windup1', windup1:'strike1', strike1:'windup2', windup2:'strike2', strike2:'open', open:'chase'};
      const nx=NEXT[c.state];
      if(nx==='strike1'||nx==='strike2') champStrike(c);
      c.state=nx;
    }
  }

  sparUpdate(dt);

  // turkeys: flee when you get close — chase them down!
  if(scene==='village') for(const tk of turkeys){
    const d=Math.hypot(P.x-tk.x,P.y-tk.y);
    if(d<120 && !blocked()){ const a=Math.atan2(tk.y-P.y,tk.x-P.x); tk.x+=Math.cos(a)*2.1; tk.y+=Math.sin(a)*2.1; tk.dir=a; }
    else { tk.t+=dt; if(tk.t>1800){ tk.t=0; tk.dir=Math.random()*7; } tk.x+=Math.cos(tk.dir)*.5; tk.y+=Math.sin(tk.dir)*.5; }
    tk.x=Math.max(160,Math.min(W-160,tk.x)); tk.y=Math.max(720,Math.min(1080,tk.y));
  }

  // training dummies rebuild
  if(scene==='village') for(const d of dummies){ if(d.hp<=0){ d.respawnT-=dt; if(d.respawnT<=0){ d.hp=d.maxhp; d.showBar=false; } } if(d.hurtT>0)d.hurtT--; }

  // floating numbers
  for(let i=floats.length-1;i>=0;i--){ const f=floats[i]; f.t--; f.y-=.8; if(f.t<=0) floats.splice(i,1); }

  // dropped coins — walk over to collect
  if(scene==='village') for(let i=drops.length-1;i>=0;i--){ const c=drops[i];
    if(Math.hypot(c.x-P.x,c.y-P.y)<30){ P.coins+=c.amt; addFloat(P.x,P.y-36,'+'+c.amt+' 🪙','#ffd977',17); drops.splice(i,1); } }

  // goblins prowl back after a while (combat practice never runs dry)
  if(goblins.every(g=>!g.alive)){ gobRespawnT+=dt;
    if(gobRespawnT>30000){ gobRespawnT=0; spawnGoblins(); banner('🌲 More goblins prowl the north forest…'); } }
  else gobRespawnT=0;

  // hunger
  hungerT+=dt;
  if(hungerT>HUNGER_EVERY){ hungerT=0; P.hp--; banner('Your stomach growls… find food! -½ ❤️'); if(P.hp<=0) die('You starved in the wilds.','Hunger wins'); }

  // berries (blue bushes regrow after ~25s). Blueberries go INTO THE SATCHEL —
  // eat them from there by choice, or deliver them. Red berries are still death.
  if(scene==='village') for(const b of bushes){
    if(b.taken){ b.respawn-=dt; if(b.respawn<=0 && b.type==='blue') b.taken=false; continue; }
    if(Math.hypot(b.x-P.x,b.y-P.y)<30){
      b.taken=true; b.respawn=25000;
      if(b.type==='blue'){
        P.inv.item_blueberry=(P.inv.item_blueberry||0)+1;
        addFloat(P.x,P.y-34,'+🫐','#7ea8d6',17);
        const q=questState.currentId==='quest_main_02_blueberries' && questState.stage!=='afterReward';
        banner(q? '🫐 Satchel: '+Math.min(P.inv.item_blueberry,4)+'/4' : '🫐 Blueberry into the satchel');
      }
      else { die('You ate the RED berries. The Chief warned you…','The red berries'); }
    } }

  // quest runtime (pending next-quest timers etc.)
  Quests.update(dt);

  // goblins
  if(scene==='village') for(const g of goblins){ if(!g.alive) continue;
    if(g.hurtT>0){g.hurtT--; continue;}
    const d=Math.hypot(P.x-g.x,P.y-g.y);
    if(d<170 && !blocked()){ const a=Math.atan2(P.y-g.y,P.x-g.x); g.x+=Math.cos(a)*1.35; g.y+=Math.sin(a)*1.35; g.dir=a;
      if(d<30 && g.atkT<=0){ hurtPlayer(1); g.atkT=70; banner('A goblin bites you! -½ ❤️'); } }
    else { g.t+=dt; if(g.t>2200){ g.t=0; g.dir=Math.random()*7; } g.x+=Math.cos(g.dir)*.4; g.y+=Math.sin(g.dir)*.4; }
    g.x=Math.max(40,Math.min(W-40,g.x)); g.y=Math.max(40,Math.min(H-40,g.y));
    if(g.atkT>0)g.atkT--;
  }
}

// ============================================================
// RENDER
// ============================================================
function draw(){
  if(scene!=='village'){ drawInterior(); }
  else {
  const camX=Math.max(0,Math.min(W-vw,P.x-vw/2)), camY=Math.max(0,Math.min(H-vh,P.y-vh/2));
  // ground
  const grd=ctx.createLinearGradient(0,-camY,0,H-camY);
  grd.addColorStop(0,'#26331f'); grd.addColorStop(.45,'#33402a'); grd.addColorStop(1,'#4a4a33');
  ctx.fillStyle=grd; ctx.fillRect(0,0,vw,vh);
  ctx.save(); ctx.translate(-camX,-camY);

  // dirt path from village to forest
  ctx.strokeStyle='#5c4d33'; ctx.lineWidth=46; ctx.lineCap='round';
  ctx.beginPath(); ctx.moveTo(800,1340); ctx.quadraticCurveTo(780,900,830,420); ctx.stroke();
  ctx.strokeStyle='#6b5a3d'; ctx.lineWidth=34; ctx.beginPath(); ctx.moveTo(800,1340); ctx.quadraticCurveTo(780,900,830,420); ctx.stroke();

  // village ground patch
  ctx.fillStyle='rgba(120,100,60,.25)'; ctx.beginPath(); ctx.ellipse(800,1230,330,210,0,0,7); ctx.fill();

  // bushes
  for(const b of bushes){ if(b.taken) continue;
    ctx.fillStyle='#2c4a22'; ctx.beginPath(); ctx.arc(b.x,b.y,16,0,7); ctx.arc(b.x-12,b.y+6,12,0,7); ctx.arc(b.x+12,b.y+6,12,0,7); ctx.fill();
    ctx.fillStyle = b.type==='blue' ? '#5b8fd4' : '#d43a3a';
    for(let i=0;i<5;i++){ ctx.beginPath(); ctx.arc(b.x-10+i*5,b.y-4+((i%2)*8),3.2,0,7); ctx.fill(); }
  }

  // houses
  for(const h of houses){
    ctx.fillStyle='#57452c'; ctx.fillRect(h.x-52,h.y-30,104,66);
    ctx.fillStyle='#3f331f'; ctx.fillRect(h.x-52,h.y-30,104,8);
    ctx.fillStyle='#7d2f22'; ctx.beginPath(); ctx.moveTo(h.x-62,h.y-28); ctx.lineTo(h.x,h.y-72); ctx.lineTo(h.x+62,h.y-28); ctx.closePath(); ctx.fill();
    ctx.fillStyle='#2c2214'; ctx.fillRect(h.x-11,h.y+8,22,28);
    ctx.fillStyle='#ffd977'; ctx.fillRect(h.x-34,h.y-12,14,14); ctx.fillRect(h.x+20,h.y-12,14,14);
  }
  // shop signs hang on the trade buildings (🪙 Erik, 🧪 Dorgan, 🔨 Modo)
  for(const d of SHOP_NPCS){ const b=d.building;
    ctx.fillStyle='#3d2c14'; ctx.fillRect(b.x-17,b.y+34,34,24);
    ctx.strokeStyle='#8a6d38'; ctx.lineWidth=2; ctx.strokeRect(b.x-17,b.y+34,34,24);
    ctx.font='16px Georgia'; ctx.textAlign='center'; ctx.fillText(d.building.sign, b.x, b.y+52);
    if(shopDoorNearby()===d){ ctx.strokeStyle='rgba(255,217,119,.8)'; ctx.strokeRect(b.x-13,b.y+30,26,34); }
  }

  // training dummies
  for(const d of dummies){
    if(d.hp>0){
      ctx.save(); if(d.hurtT>0 && d.hurtT%4<2) ctx.globalAlpha=.5;
      ctx.fillStyle='#6b4a26'; ctx.fillRect(d.x-3,d.y-14,6,30);           // post
      ctx.fillRect(d.x-16,d.y-8,32,5);                                     // arms
      ctx.fillStyle='#c9b06a'; ctx.beginPath(); ctx.arc(d.x,d.y-20,8,0,7); ctx.fill(); // straw head
      ctx.strokeStyle='#8a6d38'; ctx.lineWidth=1.5; ctx.strokeRect(d.x-8,d.y-2,16,12); // body sack
      ctx.restore();
      if(d.showBar){ ctx.fillStyle='#1c150e'; ctx.fillRect(d.x-16,d.y-36,32,5); ctx.fillStyle='#d4a23a'; ctx.fillRect(d.x-15,d.y-35,30*(d.hp/d.maxhp),3); }
    } else { ctx.fillStyle='#4a3a22'; ctx.beginPath(); ctx.ellipse(d.x,d.y,14,6,0,0,7); ctx.fill(); }
  }

  // arrows in flight
  for(const a of arrows){
    ctx.strokeStyle='#d8c090'; ctx.lineWidth=2.5;
    ctx.beginPath(); ctx.moveTo(a.x-Math.cos(a.ang)*10,a.y-Math.sin(a.ang)*10); ctx.lineTo(a.x,a.y); ctx.stroke();
    ctx.fillStyle='#efe6d0'; ctx.beginPath(); ctx.arc(a.x,a.y,2.2,0,7); ctx.fill();
  }

  // turkeys
  for(const tk of turkeys){
    ctx.fillStyle='rgba(0,0,0,.25)'; ctx.beginPath(); ctx.ellipse(tk.x,tk.y+9,10,4,0,0,7); ctx.fill();
    ctx.fillStyle='#5d4028'; ctx.beginPath(); ctx.ellipse(tk.x,tk.y,11,9,0,0,7); ctx.fill();      // body
    ctx.fillStyle='#7a5a38'; ctx.beginPath(); ctx.arc(tk.x-8,tk.y-2,6,Math.PI*.6,Math.PI*1.6); ctx.fill(); // tail fan
    const hx=tk.x+Math.cos(tk.dir)*9, hy=tk.y+Math.sin(tk.dir)*9-6;
    ctx.fillStyle='#6d4a2e'; ctx.beginPath(); ctx.arc(hx,hy,4.2,0,7); ctx.fill();                 // head
    ctx.fillStyle='#c23c3c'; ctx.fillRect(hx-1,hy+2,2,4);                                          // wattle
    ctx.fillStyle='#ffd42a'; ctx.beginPath(); ctx.moveTo(hx+3,hy); ctx.lineTo(hx+8,hy+1); ctx.lineTo(hx+3,hy+3); ctx.fill(); // beak
  }

  // NPCs outdoors: just the Chief — shopkeepers are inside their shops
  { const n=NPCS.find(x=>x.id==='npc_chief_bonbottom');
    drawPerson(n.x,n.y,0,{hair:'#555',outfit:n.col,skin:'#e0b088'},n.hat, Math.hypot(n.x-P.x,n.y-P.y)<70); }

  // sparring Erik (quest 5) — wooden sword, zero malice
  if(spar && questState.currentId==='quest_main_05_shield_training' && questState.stage==='active'){
    const c=spar;
    drawPerson(c.x,c.y,0,{hair:'#555',outfit:'#2f5d7d',skin:'#e0b088'},false,false);
    ctx.strokeStyle='#a87c3f'; ctx.lineWidth=4;
    const sw=c.state==='windup'? 0.9 : c.state==='swing'? -0.4 : 0.4;
    ctx.beginPath(); ctx.moveTo(c.x+10,c.y-4); ctx.lineTo(c.x+10+Math.cos(c.dir+sw)*20, c.y-4+Math.sin(c.dir+sw)*20); ctx.stroke();
    if(c.state==='windup'){ ctx.fillStyle='#ffd977'; ctx.font='12px Georgia'; ctx.textAlign='center'; ctx.fillText('block!', c.x, c.y-34); }
  }

  // the visiting champion (quest 4)
  if(champion && champion.alive){ const c=champion;
    ctx.save(); if(c.hurtT>0 && c.hurtT%4<2) ctx.globalAlpha=.5;
    ctx.fillStyle='rgba(0,0,0,.3)'; ctx.beginPath(); ctx.ellipse(c.x,c.y+20,15,6,0,0,7); ctx.fill();
    ctx.fillStyle='#7a2d2d'; ctx.beginPath(); ctx.ellipse(c.x,c.y+4,15,19,0,0,7); ctx.fill();
    ctx.fillStyle='#e0b088'; ctx.beginPath(); ctx.arc(c.x,c.y-18,11,0,7); ctx.fill();
    ctx.fillStyle='#3a3a3f'; ctx.beginPath(); ctx.arc(c.x,c.y-21,11,Math.PI,0); ctx.fill();
    if(c.state==='shield'){ ctx.fillStyle='#cfd4da'; ctx.strokeStyle='#8a8f96'; ctx.lineWidth=2;
      ctx.beginPath(); ctx.ellipse(c.x+Math.cos(c.dir)*16, c.y-2+Math.sin(c.dir)*8, 9,15,0,0,7); ctx.fill(); ctx.stroke(); }
    if(c.state==='windup1'||c.state==='windup2'){ ctx.strokeStyle='rgba(255,80,60,'+(0.5+0.4*Math.sin(performance.now()/60))+')'; ctx.lineWidth=4;
      ctx.beginPath(); ctx.arc(c.x,c.y,32,0,7); ctx.stroke(); }
    if(c.state==='open'){ ctx.strokeStyle='rgba(120,230,140,.85)'; ctx.lineWidth=3;
      ctx.beginPath(); ctx.arc(c.x,c.y,30,0,7); ctx.stroke(); }   // green ring = STRIKE NOW
    ctx.restore();
    if(c.hp<c.maxhp){ ctx.fillStyle='#1c150e'; ctx.fillRect(c.x-20,c.y-42,40,6); ctx.fillStyle='#d43a3a'; ctx.fillRect(c.x-19,c.y-41,38*(c.hp/c.maxhp),4); }
  }

  // goblins
  for(const g of goblins){ if(!g.alive) continue;
    ctx.save(); if(g.hurtT>0 && g.hurtT%4<2) ctx.globalAlpha=.4;
    ctx.fillStyle='#4a6d2c'; ctx.beginPath(); ctx.ellipse(g.x,g.y+6,11,13,0,0,7); ctx.fill();
    ctx.fillStyle='#5d8438'; ctx.beginPath(); ctx.arc(g.x,g.y-8,9,0,7); ctx.fill();
    ctx.fillStyle='#5d8438'; ctx.beginPath(); ctx.moveTo(g.x-8,g.y-12); ctx.lineTo(g.x-15,g.y-19); ctx.lineTo(g.x-5,g.y-15); ctx.fill();
    ctx.beginPath(); ctx.moveTo(g.x+8,g.y-12); ctx.lineTo(g.x+15,g.y-19); ctx.lineTo(g.x+5,g.y-15); ctx.fill();
    ctx.fillStyle='#ffd42a'; ctx.fillRect(g.x-4,g.y-11,2.6,2.6); ctx.fillRect(g.x+2,g.y-11,2.6,2.6);
    ctx.restore();
    if(g.showBar){ ctx.fillStyle='#1c150e'; ctx.fillRect(g.x-16,g.y-28,32,5); ctx.fillStyle='#d43a3a'; ctx.fillRect(g.x-15,g.y-27,30*(g.hp/g.maxhp),3); }
  }

  // dropped coins
  for(const c of drops){
    ctx.fillStyle='#8a6d1e'; ctx.beginPath(); ctx.arc(c.x,c.y+1.5,6,0,7); ctx.fill();
    ctx.fillStyle='#ffd53e'; ctx.beginPath(); ctx.arc(c.x,c.y,6,0,7); ctx.fill();
    ctx.strokeStyle='#8a6d1e'; ctx.lineWidth=1.3; ctx.beginPath(); ctx.arc(c.x,c.y,3.4,0,7); ctx.stroke();
  }

  // player
  const av=AVATARS[chosen<0?0:chosen];
  // potion aura — you can SEE the power on you
  if(pot.t>0 && pot.type){
    const col = pot.type==='potion_strength'? '255,140,60' : pot.type==='potion_speed'? '90,220,255' : '200,200,215';
    const pulse=.28+.16*Math.sin(performance.now()/160);
    ctx.fillStyle='rgba('+col+','+(pulse*.5)+')'; ctx.beginPath(); ctx.arc(P.x,P.y,30,0,7); ctx.fill();
    ctx.strokeStyle='rgba('+col+','+(.5+pulse)+')'; ctx.lineWidth=3.5; ctx.beginPath(); ctx.arc(P.x,P.y,26+3*Math.sin(performance.now()/200),0,7); ctx.stroke();
  }
  ctx.save(); if(P.hurtT>0 && P.hurtT%6<3) ctx.globalAlpha=.45;
  drawPerson(P.x,P.y,P.dir,av,false,false);
  ctx.restore();
  // slash arc
  if(P.slashT>0 && !P.smashT){ ctx.strokeStyle='rgba(240,230,200,'+(P.slashT/14*.9)+')'; ctx.lineWidth=5;
    ctx.beginPath(); ctx.arc(P.x,P.y,44,P.dir-.8,P.dir+.8); ctx.stroke();
    ctx.strokeStyle='rgba(255,215,120,'+(P.slashT/14*.6)+')'; ctx.lineWidth=2.5;
    ctx.beginPath(); ctx.arc(P.x,P.y,52,P.dir-.65,P.dir+.65); ctx.stroke(); }
  // smash shockwave (radius from the smash that fired)
  if(P.smashT>0){ const pr=(P.smashT0-P.smashT)/P.smashT0;
    ctx.strokeStyle='rgba(255,190,90,'+(1-pr)*.9+')'; ctx.lineWidth=7-pr*5;
    ctx.beginPath(); ctx.arc(P.x,P.y,25+pr*(P.smashR-20),0,7); ctx.stroke(); }
  // smash charge ring — grows while you hold; gold = FULL smash ready
  { const ch=chargeInfo();
    if(ch){
      ctx.strokeStyle = ch.full? 'rgba(255,215,90,.95)' : 'rgba(255,190,110,'+(0.4+ch.p*0.5)+')';
      ctx.lineWidth = 4+ch.p*3;
      ctx.beginPath(); ctx.arc(P.x,P.y,22+ch.p*22, -Math.PI/2, -Math.PI/2 + Math.PI*2*ch.p); ctx.stroke();
      if(ch.full){ ctx.fillStyle='#ffd75a'; ctx.font='bold 13px Georgia'; ctx.textAlign='center'; ctx.fillText('SMASH READY!', P.x, P.y-46); }
    } }
  // bow aim (pull back and release)
  if(P.weapon==='bow' && swp.active && !dialogOpen){
    const ddx=swp.cx-swp.sx, ddy=swp.cy-swp.sy, dd=Math.hypot(ddx,ddy);
    if(dd>25){ const ang=Math.atan2(-ddy,-ddx), pw=Math.min(dd,130)/130;
      ctx.setLineDash([6,7]); ctx.strokeStyle='rgba(255,230,160,.75)'; ctx.lineWidth=2.5;
      ctx.beginPath(); ctx.moveTo(P.x,P.y); ctx.lineTo(P.x+Math.cos(ang)*(60+pw*110), P.y+Math.sin(ang)*(60+pw*110)); ctx.stroke(); ctx.setLineDash([]);
      ctx.fillStyle='rgba(255,190,90,'+(.4+pw*.5)+')'; ctx.beginPath(); ctx.arc(P.x,P.y,10+pw*10,0,7); ctx.fill();
    }
  }

  // floating damage / pickup numbers
  for(const f of floats){
    ctx.globalAlpha=Math.min(1,f.t/22);
    ctx.font='bold '+f.size+'px Georgia'; ctx.textAlign='center';
    ctx.strokeStyle='rgba(0,0,0,.7)'; ctx.lineWidth=3; ctx.strokeText(f.txt,f.x,f.y);
    ctx.fillStyle=f.col; ctx.fillText(f.txt,f.x,f.y);
    ctx.globalAlpha=1;
  }

  // trees (drawn after entities so canopies overlap)
  for(const t of trees){
    ctx.fillStyle='rgba(0,0,0,.25)'; ctx.beginPath(); ctx.ellipse(t.x+4,t.y+6,t.r*.9,t.r*.5,0,0,7); ctx.fill();
    ctx.fillStyle='#1d2e18'; ctx.beginPath(); ctx.arc(t.x,t.y,t.r,0,7); ctx.fill();
    ctx.fillStyle='#2a4020'; ctx.beginPath(); ctx.arc(t.x-t.r*.25,t.y-t.r*.25,t.r*.72,0,7); ctx.fill();
  }
  ctx.restore();
  }

  // ---------- HUD ----------
  const top = 12 + (window.visualViewport? 0:0);
  // hearts
  for(let i=0;i<P.maxhp/2;i++){ drawHeart(20+i*26, top+18, (P.hp>=(i+1)*2)?1:(P.hp===i*2+1?.5:0)); }
  // coins
  ctx.font='bold 17px Georgia'; ctx.textAlign='right';
  ctx.fillStyle='rgba(20,16,10,.75)'; rr(ctx, vw-124, top+2, 112, 30, 9);
  ctx.fillStyle='#ffd977'; ctx.fillText('🪙 '+P.coins, vw-22, top+24);
  // quest tracker — slim & quiet so it never fights other text
  const qt = Quests.trackerText();
  if(qt){ ctx.textAlign='left'; ctx.font='11.5px Georgia';
    ctx.fillStyle='rgba(20,16,10,.5)'; rr(ctx, 14, top+38, ctx.measureText(qt).width+14, 19, 6);
    ctx.fillStyle='#cbbc90'; ctx.fillText(qt, 21, top+52); }

  // joystick — invisible until you press & drag; appears under your finger, anywhere
  if(joy.active){
    const jx=joy.sx, jy=joy.sy;
    ctx.strokeStyle='rgba(240,230,200,.4)'; ctx.lineWidth=2.5; ctx.beginPath(); ctx.arc(jx,jy,50,0,7); ctx.stroke();
    ctx.fillStyle='rgba(240,230,200,.08)'; ctx.beginPath(); ctx.arc(jx,jy,50,0,7); ctx.fill();
    const m=Math.hypot(joy.dx,joy.dy)||1, cl=Math.min(m,50);
    ctx.fillStyle='rgba(240,230,200,.5)'; ctx.beginPath(); ctx.arc(jx+(joy.dx/m)*cl, jy+(joy.dy/m)*cl, 22,0,7); ctx.fill();
  }
  // attack button — always visible
  const ab=atkBtn();
  ctx.fillStyle='rgba(90,69,38,.55)'; ctx.beginPath(); ctx.arc(ab.x,ab.y,ab.r,0,7); ctx.fill();
  ctx.strokeStyle='rgba(240,220,170,.55)'; ctx.lineWidth=2.5; ctx.beginPath(); ctx.arc(ab.x,ab.y,ab.r,0,7); ctx.stroke();
  ctx.font=(ab.r*0.9)+'px Georgia'; ctx.textAlign='center'; ctx.textBaseline='middle';
  ctx.fillText(WEAPONS[P.weapon].icon, ab.x, ab.y+2);
  // weapon switch button
  const wb=wpnBtn();
  ctx.fillStyle='rgba(51,48,42,.6)'; ctx.beginPath(); ctx.arc(wb.x,wb.y,wb.r,0,7); ctx.fill();
  ctx.strokeStyle='rgba(200,180,130,.45)'; ctx.lineWidth=2; ctx.beginPath(); ctx.arc(wb.x,wb.y,wb.r,0,7); ctx.stroke();
  ctx.font=(wb.r*0.85)+'px Georgia'; (()=>{ const ows=ownedWeapons(); const nxt = ows.length>1 ? ows[(ows.indexOf(P.weapon)+1)%ows.length] : null;
    if(!nxt) ctx.globalAlpha=.4;
    ctx.fillText(nxt? WEAPONS[nxt].icon : '🔒', wb.x, wb.y+2);
    ctx.globalAlpha=1; })();
  ctx.textBaseline='alphabetic';
  ctx.fillStyle='rgba(240,230,200,.35)'; ctx.font='10.5px Georgia'; ctx.fillText('switch', wb.x, wb.y+wb.r+13);
  // THE CONTEXT BUTTON — morphs to whatever you need: 💥 smash / 🤲 grab / 💬 talk / 🚪 doors / 🎵 music
  const sb=smashBtn(), ca=contextAction();
  if(ca){
    ctx.globalAlpha = (ca.kind==='smash' && P.smashT>0)? .35 : (ca.kind==='none'? .35 : 1);
    const glow = (ca.kind==='talk'||ca.kind==='grab'||ca.kind==='enter') ? .5+.25*Math.sin(performance.now()/240) : .55;
    ctx.fillStyle = ca.kind==='smash'? 'rgba(122,63,26,.6)' : 'rgba(58,48,26,.85)';
    ctx.beginPath(); ctx.arc(sb.x,sb.y,sb.r,0,7); ctx.fill();
    ctx.strokeStyle='rgba(255,217,119,'+glow+')'; ctx.lineWidth=2.5; ctx.beginPath(); ctx.arc(sb.x,sb.y,sb.r,0,7); ctx.stroke();
    ctx.font=(sb.r*0.9)+'px Georgia'; ctx.textBaseline='middle'; ctx.fillText(ca.icon, sb.x, sb.y+2); ctx.textBaseline='alphabetic';
    ctx.globalAlpha=1;
    ctx.fillStyle='#ffd977'; ctx.font='10.5px Georgia'; ctx.fillText(ca.label, sb.x, sb.y-sb.r-7);
  }
  // satchel button
  const bb=bagBtn();
  ctx.fillStyle='rgba(51,48,42,.6)'; ctx.beginPath(); ctx.arc(bb.x,bb.y,bb.r,0,7); ctx.fill();
  ctx.strokeStyle='rgba(200,180,130,.45)'; ctx.lineWidth=2; ctx.beginPath(); ctx.arc(bb.x,bb.y,bb.r,0,7); ctx.stroke();
  ctx.font=(bb.r*0.85)+'px Georgia'; ctx.textBaseline='middle'; ctx.fillText('🎒', bb.x, bb.y+2); ctx.textBaseline='alphabetic';
  const nItems=Object.values(P.inv).reduce((a,b)=>a+b,0);
  if(nItems>0){ ctx.fillStyle='#ffd977'; ctx.beginPath(); ctx.arc(bb.x+17,bb.y-17,9,0,7); ctx.fill();
    ctx.fillStyle='#241d10'; ctx.font='bold 12px Georgia'; ctx.textBaseline='middle'; ctx.fillText(nItems, bb.x+17, bb.y-16); ctx.textBaseline='alphabetic'; }
  ctx.fillStyle='rgba(240,230,200,.3)'; ctx.font='11.5px Georgia'; ctx.textAlign='left';
  if(!joy.active) ctx.fillText('press & drag anywhere to move', 18, vh-20);
  ctx.textAlign='center';
  ctx.fillText(P.weapon==='fists'? 'tap: punch • hold: charge SMASH' : P.weapon==='sword'? 'drag from the button: aimed slice • hold: charge SMASH' : 'pull back & release • arrows: '+P.arrows, ab.x-24, ab.y+ab.r+18);
  // active potion — a DEPLETING BAR under the coin counter so you can see time draining
  if(pot.t>0 && pot.type){
    const pp=POTION_POWERS[pot.type], frac=Math.max(0,Math.min(1,pot.t/POTION_DURATION_MS));
    const bw=180, bx=vw-bw-24, by=top+40;
    ctx.fillStyle='rgba(30,20,44,.85)'; rr(ctx, bx-6, by-5, bw+12, 28, 8);
    ctx.fillStyle='rgba(120,80,190,.3)'; rr(ctx, bx, by, bw, 18, 6);
    if(frac>0){ ctx.fillStyle='#8e5bd6'; rr(ctx, bx, by, Math.max(8,bw*frac), 18, 6); }
    ctx.fillStyle='#f0e6ff'; ctx.font='bold 12.5px Georgia'; ctx.textAlign='left';
    ctx.fillText(pp.ic+' '+pp.nm, bx+7, by+14);
    ctx.textAlign='center';
  }
}
function drawPerson(x,y,dir,av,hat,highlight){
  if(highlight){ ctx.strokeStyle='rgba(255,217,119,.8)'; ctx.lineWidth=2; ctx.beginPath(); ctx.arc(x,y,26,0,7); ctx.stroke();
    ctx.fillStyle='#ffd977'; ctx.font='16px Georgia'; ctx.textAlign='center'; ctx.fillText('💬', x, y-34); }
  ctx.fillStyle='rgba(0,0,0,.3)'; ctx.beginPath(); ctx.ellipse(x,y+16,12,5,0,0,7); ctx.fill();
  ctx.fillStyle=av.outfit; ctx.beginPath(); ctx.ellipse(x,y+4,11,14,0,0,7); ctx.fill();
  ctx.fillStyle=av.skin; ctx.beginPath(); ctx.arc(x,y-12,9,0,7); ctx.fill();
  ctx.fillStyle=av.hair; ctx.beginPath(); ctx.arc(x,y-14.5,9,Math.PI,0); ctx.fill();
  if(hat){ ctx.fillStyle='#3d2c14'; ctx.beginPath(); ctx.ellipse(x,y-18,11,4,0,0,7); ctx.fill(); ctx.fillRect(x-5,y-27,10,9); }
  if(av.item==='lute'){ ctx.fillStyle='#8a5a28'; ctx.beginPath(); ctx.ellipse(x+12,y+2,5,7,-.4,0,7); ctx.fill(); }
}
function drawHeart(x,y,fill){
  ctx.save(); ctx.translate(x,y); ctx.scale(1.05,1.05);
  const path=()=>{ ctx.beginPath(); ctx.moveTo(0,4); ctx.bezierCurveTo(-11,-6,-5,-15,0,-8); ctx.bezierCurveTo(5,-15,11,-6,0,4); ctx.closePath(); };
  path(); ctx.fillStyle='rgba(15,10,8,.75)'; ctx.fill();
  if(fill>0){ path(); ctx.save(); ctx.clip(); ctx.fillStyle='#e04545'; ctx.fillRect(-12,-16,(fill===1?24:12),24); ctx.restore(); }
  path(); ctx.strokeStyle='#f0d8b0'; ctx.lineWidth=1.4; ctx.stroke();
  ctx.restore();
}

// ============================================================
// LOOP
// ============================================================
function loop(ts){
  if(!running) return;
  const dt=Math.min(50,(ts-last)||16); last=ts;
  update(dt); draw();
  requestAnimationFrame(loop);
}
function startGame(){ show('gameWrap'); running=true; last=performance.now(); banner('Welcome to Losthorne. Find Chief Bonbottom in the square!'); requestAnimationFrame(loop); }

// ---------- ERIK'S SHIELD TRAINING (quest 5) ----------
let spar=null;
function spawnSpar(){ spar={ x:940, y:1200, dir:0, state:'circle', t:0 }; }
const SPAR_TIPS=["Erik: Shield UP means HOLD, warrior — plant your feet!","Erik: You blinked! Raise it BEFORE the swing lands.","Erik: Almost! Watch my shoulder — it tells you when."];
function sparUpdate(dt){
  if(questState.currentId!=='quest_main_05_shield_training' || questState.stage!=='active' || scene!=='village'){ return; }
  if(!spar) spawnSpar();
  const c=spar; c.t+=dt;
  const d=Math.hypot(P.x-c.x,P.y-c.y);
  const a=Math.atan2(P.y-c.y,P.x-c.x); c.dir=a;
  if(c.state==='circle'){
    if(d>58){ c.x+=Math.cos(a)*1.6; c.y+=Math.sin(a)*1.6; }
    if(c.t>1400 && d<90){ c.t=0; c.state='windup'; }
  } else if(c.state==='windup'){
    if(c.t>600){ c.t=0; c.state='swing';
      if(d<85){
        if(P.hasShield && chargeInfo()){
          const r=Quests.emit('block',{target:'training_erik'});
          banner(r.banner ?? '🛡️ Block!'); addFloat(P.x,P.y-36,'🛡️ BLOCK!','#7ed67e',20);
        } else {
          hurtPlayer(1,'Erik’s wooden sword stings your pride.');
          banner(SPAR_TIPS[Math.floor(Math.random()*SPAR_TIPS.length)]);
        }
      }
    }
  } else if(c.state==='swing'){ if(c.t>700){ c.t=0; c.state='circle'; } }
}

// ---------- INTERIOR RENDERER ----------
function drawInterior(){
  const d=SHOP_NPCS.find(n=>n.id===scene); if(!d) return;
  const r=d.interior, ox=(vw-r.w)/2, oy=Math.max(30,(vh-r.h)/2);
  ctx.fillStyle='#12100e'; ctx.fillRect(0,0,vw,vh);
  ctx.save(); ctx.translate(ox,oy);
  ctx.fillStyle='#4a3b28'; ctx.fillRect(0,0,r.w,r.h);
  ctx.fillStyle='rgba(92,74,51,.6)'; for(let i=0;i<r.w;i+=44) ctx.fillRect(i,0,22,r.h);
  ctx.strokeStyle='#2c2214'; ctx.lineWidth=14; ctx.strokeRect(7,7,r.w-14,r.h-14);
  ctx.fillStyle='#6b4a26'; ctx.fillRect(r.w/2-95, 152, 190, 20);                      // counter
  ctx.fillStyle='#8a6d38'; ctx.fillRect(r.w/2-34, r.h-18, 68, 12);                     // door mat
  ctx.font='24px Georgia'; ctx.textAlign='center';
  for(const pr of d.interior.props) ctx.fillText(pr[0], pr[1], pr[2]);
  ctx.font='bold 15px Georgia'; ctx.fillStyle='#ffd977'; ctx.fillText(d.building.sign+'  '+d.name, r.w/2, 42);
  ctx.font='12px Georgia'; ctx.fillStyle='rgba(240,230,200,.5)'; ctx.fillText('🚪 walk here to leave', r.w/2, r.h+18<r.h?r.h-26:r.h-26);
  const n=NPCS.find(x=>x.id===scene);
  drawPerson(d.pos.x, d.pos.y, 0, {hair:'#555',outfit:n.col,skin:'#e0b088'}, n.hat, Math.hypot(d.pos.x-P.x,d.pos.y-P.y)<86);
  if(pot.t>0 && pot.type){ const col = pot.type==='potion_strength'? '255,140,60' : pot.type==='potion_speed'? '90,220,255' : '200,200,215';
    ctx.strokeStyle='rgba('+col+',.6)'; ctx.lineWidth=3; ctx.beginPath(); ctx.arc(P.x,P.y,26,0,7); ctx.stroke(); }
  ctx.save(); if(P.hurtT>0 && P.hurtT%6<3) ctx.globalAlpha=.45;
  drawPerson(P.x,P.y,P.dir,AVATARS[chosen<0?0:chosen],false,false);
  ctx.restore();
  for(const f of floats){ ctx.globalAlpha=Math.min(1,f.t/22); ctx.font='bold '+f.size+'px Georgia'; ctx.textAlign='center';
    ctx.strokeStyle='rgba(0,0,0,.7)'; ctx.lineWidth=3; ctx.strokeText(f.txt,f.x,f.y);
    ctx.fillStyle=f.col; ctx.fillText(f.txt,f.x,f.y); ctx.globalAlpha=1; }
  ctx.restore();
}
// walking onto the door mat leaves the shop
setInterval(()=>{ if(running && scene!=='village' && interiorDoorNear() && !dialogOpen && !invOpen) leaveShop(); }, 250);

// dev shortcuts for self-testing: #game jumps straight in
if(location.hash==='#game'){ chosen=0; startGame(); }
if(location.hash==='#select'){ show('select'); }
if(location.hash==='#lobby'){ show('lobby'); }
if(location.hash==='#inv'){ chosen=0; P.inv.item_bread=2; P.inv.item_potion=1; startGame(); openInv(); }
// ---------- DEV TESTING MENU (#dev) — preview-only, never part of normal play ----------
if(location.hash==='#dev'){
  chosen=0; startGame();
  const dv=document.createElement('div');
  dv.style.cssText='position:fixed;left:8px;top:64px;z-index:98;display:flex;flex-direction:column;gap:4px;';
  const mk=(label,fn)=>{ const b=document.createElement('button'); b.className='btn ghost';
    b.style.cssText='padding:5px 8px;font-size:11px;width:170px;margin:0;'; b.textContent=label;
    b.onclick=(e)=>{e.stopPropagation();fn();banner('🛠 '+label);}; dv.appendChild(b); };
  mk('▶ Q1: goblins', ()=>Quests.debugJump('quest_main_01_goblins'));
  mk('▶ Q2: berries', ()=>Quests.debugJump('quest_main_02_blueberries'));
  mk('▶ Q3: turkeys', ()=>Quests.debugJump('quest_main_03_turkeys'));
  mk('▶ Q4: CHAMPION', ()=>Quests.debugJump('quest_main_04_champion'));
  mk('+200 coins', ()=>{ P.coins+=200; });
  mk('give sword/bow/shield', ()=>{ P.weapons.sword=true; P.weapons.bow=true; P.arrows+=10; P.hasShield=true; });
  mk('open both shops', ()=>{ questState.flags.flag_dorgan_shop_open=true; questState.flags.flag_erik_turkey_stock=true; });
  mk('give 4 blueberries', ()=>{ P.inv.item_blueberry=(P.inv.item_blueberry||0)+4; });
  mk('heal full', ()=>{ P.hp=P.maxhp; hungerT=0; });
  document.getElementById('app').appendChild(dv);
}

// automated smoke test (temporary home; moves to dev.js in reorg step 9)
if(location.hash==='#test-quests'){
  chosen=0; startGame();
  const R=[], ok=(c,m)=>R.push((c?'✅ PASS':'❌ FAIL')+' — '+m);
  const chief=NPCS.find(n=>n.id==='npc_chief_bonbottom');
  const dorgan=NPCS.find(n=>n.id==='npc_dorgan');
  const erik=NPCS.find(n=>n.id==='npc_erik');
  const modo=NPCS.find(n=>n.id==='npc_modo');
  ok(AVATARS[0].nm==='Zippy', 'Zippy leads the avatar roster');
  ok(P.coins===10 && P.weapon==='fists' && goblins[0].hp===6, 'start: 10 coins, fists, 6-punch goblins');
  // Q1
  openDialog(chief); while(dialogOpen) advanceDialog();
  goblins.slice(0,3).forEach(g=>hitTarget(g,'gob',99,0));
  openDialog(chief); while(dialogOpen) advanceDialog();
  ok(P.coins===120, 'chief pays 110');
  // Q2 — Dorgan, satchel berries
  Quests.update(2000);
  openDialog(dorgan); while(dialogOpen) advanceDialog();
  P.inv.item_blueberry=4; Quests.update(16);
  openDialog(dorgan); while(dialogOpen) advanceDialog();
  ok(P.inv.item_blueberry===0 && P.potionRolls.includes('potion_stoneskin'), 'berries delivered → free Stoneskin');
  // Q3 — turkeys are satchel items now; pre-caught count via live inventory
  Quests.update(2000);
  P.inv.item_wild_turkey=2;   // caught while exploring BEFORE talking to Erik
  openDialog(erik); while(dialogOpen) advanceDialog();
  Quests.update(16);
  ok(questState.progress===2, 'pre-caught turkeys count (2/3)');
  P.inv.item_wild_turkey=3; Quests.update(16);
  ok(questState.stage==='complete', '3 in the satchel → deliver');
  openDialog(erik); while(dialogOpen) advanceDialog();
  ok(P.inv.item_wild_turkey===0 && P.coins===210, 'Erik takes the 3 turkeys and pays 90 → 210');
  // Erik BUYS turkeys forever
  P.inv.item_wild_turkey=1;
  openDialog(erik);
  const sellBtn=[...$('shopBox').children].find(b=>b.textContent.includes('Sell wild turkey'));
  ok(!!sellBtn, 'Erik has a SELL turkey button');
  sellBtn.click();
  ok(P.inv.item_wild_turkey===0 && P.coins===225, 'sold a turkey for 15 (225)');
  while(dialogOpen) advanceDialog();
  // Modo gating: only the sword until the champion falls
  openDialog(modo);
  ok($('shopBox').children.length===1, 'Modo sells ONLY the sword pre-champion');
  $('shopBox').children[0].click();
  ok(P.weapons.sword===true && P.coins===25, 'sword bought with earned coins');
  while(dialogOpen) advanceDialog();
  // Q4 — the tougher champion
  Quests.update(16000);
  openDialog(chief); while(dialogOpen) advanceDialog();
  update(16);
  ok(champion && champion.hp===28 && champion.state==='chase', 'champion spawns: 28hp, pattern starts in chase');
  champion.state='shield'; const hp0=champion.hp; hitTarget(champion,'champ',9,0);
  ok(champion.hp===hp0, 'shield state blocks damage');
  champion.state='open'; hitTarget(champion,'champ',99,0);
  ok(!champion.alive, 'strike the OPEN window → he falls');
  openDialog(chief); while(dialogOpen) advanceDialog();
  ok(P.hasShield && questState.flags.flag_champion_defeated===true, 'shield won + champion flag set');
  // Modo now sells everything
  openDialog(modo); ok($('shopBox').children.length===3, 'bow & arrows unlocked after the champion'); while(dialogOpen) advanceDialog();
  // permanent gear never vanishes
  invSel='item_shield'; const sh0=P.inv.item_shield; $('invUse').onclick();
  ok(P.inv.item_shield===sh0, 'Champion’s Shield cannot be consumed — permanent gear');
  invSel=null;
  // Q5 — Erik's shield training
  Quests.update(9000);
  ok(questState.currentId==='quest_main_05_shield_training', 'Erik calls you to train');
  openDialog(erik); while(dialogOpen) advanceDialog();
  ok(questState.stage==='active', 'sparring begins');
  for(let i=0;i<3;i++) Quests.emit('block',{target:'training_erik'});
  ok(questState.stage==='complete', '3 blocks → trained');
  openDialog(erik); while(dialogOpen) advanceDialog();
  ok(Quests.trackerText()==='✅ All quests done — explore Losthorne!', 'chain complete');
  // death → 2.5 hearts, quest state intact
  const cq=questState.currentId;
  die('test'); $('btnRespawn').click();
  ok(P.hp===5, 'respawn with 2½ hearts — food still matters');
  ok(questState.currentId===cq, 'death never resets quest progress');
  const div=document.createElement('div');
  div.style.cssText='position:fixed;inset:8px;z-index:99;background:rgba(10,8,5,.97);color:#e8d9a8;font:12px/1.6 monospace;padding:14px;border-radius:10px;overflow:auto;white-space:pre-wrap;';
  const fails=R.filter(r=>r.startsWith('❌')).length;
  div.textContent='PLAYTEST ROUND 4 SMOKE TEST — '+(fails? fails+' FAILURE(S)':'ALL '+R.length+' PASS')+'\n\n'+R.join('\n');
  document.getElementById('app').appendChild(div);
}
