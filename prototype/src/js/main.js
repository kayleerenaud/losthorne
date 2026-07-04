'use strict';
import { AVATARS } from './data/avatars.js';
import { PRICES, SELL_PRICES, STARTING_COINS } from './data/economy.js';
import { ITEM_DEFS } from './data/items.js';
import { POTION_POWERS, POTION_DURATION_MS } from './data/potions.js';
import npcChief from './data/npcs/chief-bonbottom.js';
import npcErik from './data/npcs/erik.js';
import npcDorgan from './data/npcs/dorgan.js';
import npcModo from './data/npcs/modo.js';
import npcBog from './data/npcs/bog.js';
import { Quests, questState } from './engine/quests.js';
import questGoblins from './data/quests/main-01-goblins.js';
import questBlueberries from './data/quests/main-02-blueberries.js';
import questTurkeys from './data/quests/main-03-turkeys.js';
import questChampion from './data/quests/main-04-champion.js';
import questShieldTraining from './data/quests/main-05-shield-training.js';
import questFindBog from './data/quests/main-06-find-bog.js';
import questHammer from './data/quests/main-07-hammer.js';
import questFirstCatch from './data/quests/main-08-first-catch.js';
import npcStrax from './data/npcs/strax.js';
import npcReba from './data/npcs/reba.js';
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
  weapon:'fists', weapons:{fists:true, sword:false, hammer:false, bow:false}, arrows:0, potionRolls:[],
  inv:{item_bread:0,item_potion:0,item_turkey:0,item_blueberry:0,item_shield:0,item_wild_turkey:0,item_red_berry:0,item_hammer:0}, hasShield:false, shieldUp:false, shieldT:0, shieldCd:0, dashT:0, dashCd:0 };
// combat scale: 1 = one punch. Goblin=6 punches or 2 sword hits (DESIGN.md §7)
const WEAPONS = { fists:{icon:'👊',dmg:1,range:50}, sword:{icon:'⚔️',dmg:3,range:74}, hammer:{icon:'🔨',dmg:5,range:82}, bow:{icon:'🏹'} };
function ownedWeapons(){ return ['fists','sword','hammer','bow'].filter(w=>P.weapons[w]); }
const floats=[];   // floating damage/pickup numbers
const drops=[];    // coins dropped by creatures — walk over to collect
function addFloat(x,y,txt,col,size){ floats.push({x,y,txt,col,size:size||16,t:44}); }
function updFloats(){ for(let i=floats.length-1;i>=0;i--){ const f=floats[i]; f.t--; f.y-=.8; if(f.t<=0) floats.splice(i,1); } }
function dropCoins(x,y){
  const piles=2+Math.floor(Math.random()*2);
  for(let i=0;i<piles;i++) drops.push({x:x+(Math.random()*36-18), y:y+(Math.random()*36-18), amt:2+Math.floor(Math.random()*3)});
}
const pot = { type:null, t:0 };  // Dorgan's random-power potion (powers in data/potions.js)
const arrows = [];
const dummies = [ {x:660,y:1265,hp:5,maxhp:5,hurtT:0,respawnT:0,showBar:false}, {x:945,y:1265,hp:5,maxhp:5,hurtT:0,respawnT:0,showBar:false} ];
let hungerT = 0;
const HUNGER_EVERY = 140000; // ms of IDLE time per half-heart — hard WORK multiplies it (Kaylee: strolling the village shouldn't starve you)
function tickHunger(dt,f){ hungerT+=dt*f;
  if(hungerT>HUNGER_EVERY){ hungerT=0; P.hp--; banner('Your stomach growls… find food! -½ ❤️'); if(P.hp<=0) die('You starved in the wilds.','Hunger wins'); } }

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
const NPCS = [npcChief, npcErik, npcDorgan, npcModo, npcBog, npcStrax, npcReba].map(d=>({
  id:d.id, nm:d.name, x:d.pos.x, y:d.pos.y, col:d.look.outfit, hat:!!d.look.hat, raw:d,
}));
function hasFishingGear(){ return (P.inv.item_rod||0)>0 && ((P.inv.item_hook_basic||0)>0 || (P.inv.item_hook_fine||0)>0); }
function npcLines(n){ const d=n.raw;
  if(d.shopRequiresFlag && !questState.flags[d.shopRequiresFlag] && d.linesLocked) return d.linesLocked;
  if(d.linesNoGear && !hasFishingGear()) return d.linesNoGear;
  if(d.id==='npc_strax' && MTN.fire.learned && d.linesAfter) return d.linesAfter;
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
function appendQuestChoice(){
  // quest offers with a real CHOICE (Let's do it! / I'll come back later)
  if(!dNpc) return;
  const ch=Quests.pendingChoice(dNpc.id);
  if(ch && dIdx===dLines.length-1){
    const box=$('shopBox');
    const y=document.createElement('button'); y.className='btn shopBtn'; y.textContent=ch.go;
    y.onclick=(ev)=>{ ev.stopPropagation(); Quests.acceptOffer(dNpc.id); closeDialog(); };
    const l=document.createElement('button'); l.className='btn shopBtn ghost'; l.textContent=ch.later;
    l.onclick=(ev)=>{ ev.stopPropagation(); closeDialog(); if(ch.laterBanner) banner(ch.laterBanner); };
    box.appendChild(y); box.appendChild(l);
  }
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
  if(d.actions){ // NPC-specific actions (Bog: fishing trip / boat lesson)
    for(const a of d.actions){
      if(a.requiresFlag && !questState.flags[a.requiresFlag]) continue;
      if(a.needsGear && !hasFishingGear()) continue;
      const b=document.createElement('button'); b.className='btn shopBtn';
      b.textContent=a.label;
      b.onclick=(ev)=>{ ev.stopPropagation(); NPC_ACTIONS[a.id] && NPC_ACTIONS[a.id](); };
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
  [[600,420],[840,300],[1120,460],[920,560],[420,330],[1250,300]].forEach(g=>goblins.push({x:g[0],y:g[1],hp:6,maxhp:6,dir:Math.random()*7,t:0,hurtT:0,atkT:0,alive:true,showBar:false}));
}
spawnGoblins();

// wild turkeys — you don't fight them, you GRAB them (quest 3 teaches the grab function)
const turkeys=[];
function spawnTurkeys(){
  turkeys.length=0;
  [[500,860],[900,930],[1250,880],[700,1010]].forEach(t=>turkeys.push({x:t[0],y:t[1],dir:Math.random()*7,t:0}));
}
const CURSED_STONE={x:840,y:170};
const RUINS={x:400,y:1210};   // the STONE-TROLL RUINS — village lore: trolls that met the dawn froze forever
const WELL={x:700,y:1245};    // the WISHING WELL — toss a coin; sometimes the old stones hum back
const SIGNPOSTS=[
  {x:880, y:640,  txt:'🪧 “NORTH: the woods. Goblins lately — children keep OUT.”'},
  {x:990, y:1500, txt:'🪧 “SOUTH: the mountain trail. Travelers report rumbling. Go prepared.”'},
];
const ducks=[0.4,2.5,4.6].map((a,i)=>({ang:a, r:0.5+i*0.14, spd:0.00028+i*0.00009, flee:0, quackT:1500+i*900}));
function duckPos(dk){ return {x:POND.x+Math.cos(dk.ang)*POND.rx*dk.r, y:POND.y+Math.sin(dk.ang)*POND.ry*dk.r}; }
let musicT=0;                 // playing your instrument draws small creatures closer (the seed of taming)
function ducksUpdate(dt){
  if(musicT>0) musicT-=dt;
  const charmed = musicT>0;
  for(const dk of ducks){
    dk.ang += dk.spd*dt;                                   // a lazy paddling loop around the pond
    const dp=duckPos(dk), dist=Math.hypot(P.x-dp.x, P.y-dp.y);
    const pa=Math.atan2(P.y-POND.y, P.x-POND.x);
    if(charmed && dist<300){                               // the tune coaxes them toward the near shore
      dk.r=Math.min(0.94, dk.r+0.00045*dt);
      let da=((pa-dk.ang+Math.PI*3)%(Math.PI*2))-Math.PI; dk.ang += Math.max(-0.001*dt,Math.min(0.001*dt,da));
      dk.flee=0;
    } else if(!charmed && dist<90){                        // crowded — startle to deeper water, away from you
      dk.flee=260; dk.r=Math.max(0.26, dk.r-0.0013*dt);
      let da=((dk.ang-pa+Math.PI*3)%(Math.PI*2))-Math.PI; dk.ang += (da>=0?1:-1)*0.0017*dt;
    } else {
      if(dk.flee>0) dk.flee-=dt;
      dk.r += (0.6-dk.r)*0.00035*dt;                       // drift back to a comfortable mid-radius
    }
    dk.r=Math.max(0.22,Math.min(0.95,dk.r));
    dk.quackT-=dt; if(dk.quackT<=0){ dk.quackT=4000+((dk.ang*1000|0)%3500); addFloat(dp.x,dp.y-14, charmed?'♪':'quack','#dfeaf0',12); }
  }
}
const WELL_LINES=['You hear it splash… far, far down.','The water whispers back. Probably the wind. Probably.','Somewhere below, a tiny *plink*. The well is listening.'];
function tossCoinWell(){
  if(P.coins<1){ banner('🪙 Not a coin to spare. The well understands hard times.'); return; }
  P.coins--; addFloat(WELL.x,WELL.y-30,'🪙','#ffd977',16);
  if(Math.random()<0.125){ P.coins+=5; addFloat(P.x,P.y-40,'+5 🪙','#ffd977',20); banner('✨ The well HUMS — five coins ride the bucket up! The old stones like you.'); }
  else banner('🪙 '+WELL_LINES[Math.floor(Math.random()*WELL_LINES.length)]);
}
const VILLAGE={x:800,y:1230,rx:365,ry:245};   // goblins can't cross this line
spawnTurkeys();

// ---------- SCENES: the village + shop interiors ----------
let scene='village';               // 'village' or an npc id (inside their shop)
const SHOP_NPCS = [npcErik, npcDorgan, npcModo, npcReba];
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
  if(d){ P.x=d.building.x; P.y=d.building.y+72; }   // clear of the house collision box — walk straight out
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
let turkeyRespawnT=0;
function catchTurkey(){
  const tk=turkeyNearby(); if(!tk) return;
  turkeys.splice(turkeys.indexOf(tk),1);
  P.inv.item_wild_turkey=(P.inv.item_wild_turkey||0)+1;
  addFloat(P.x,P.y-36,'🦃 grabbed!','#f0d8a0',18);
  banner('🦃 Wild turkey into the satchel! ('+P.inv.item_wild_turkey+') — Erik pays 15 apiece');
}

// Quest state lives in engine/quests.js (single questState object).
Quests.init([questGoblins, questBlueberries, questTurkeys, questChampion, questShieldTraining, questFindBog, questHammer, questFirstCatch], 'quest_main_01_goblins', {
  banner: (t)=>{ if(t) banner(t); },
  addCoins: (n)=>{ P.coins+=n; },
  itemCount: (id)=>P.inv[id]||0,
  takeItems: (id,n)=>{ P.inv[id]=Math.max(0,(P.inv[id]||0)-n); },
  givePotion: (k)=>{ P.potionRolls.push(k); P.inv.item_potion=(P.inv.item_potion||0)+1; },
  giveItem: (id)=>{ if(id==='item_shield'){ P.hasShield=true; } P.inv[id]=(P.inv[id]||0)+1; },
  itemIcon: (id)=> (ITEM_DEFS[id]&&ITEM_DEFS[id].ic)||'•',
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
  for(const n of NPCS){ if(n.raw.building) continue;   // outdoor folk: the Chief, Bog (once rescued)
    if(n.raw.scene==='mountains') continue;
    if(n.id==='npc_bog' && !questState.flags.flag_bog_rescued) continue;
    if(Math.hypot(n.x-P.x,n.y-P.y)<70) return n; }
  if(giverWalk && !giverWalk.returning && Math.hypot(giverWalk.x-P.x,giverWalk.y-P.y)<70) return NPCS.find(n=>n.id===giverWalk.npcId);
  return null;
}
function enemyNearby(){
  if(scene!=='village') return false;
  if(champion && champion.alive && Math.hypot(champion.x-P.x,champion.y-P.y)<200) return true;
  for(const g of goblins){ if(g.alive && Math.hypot(g.x-P.x,g.y-P.y)<200) return true; }
  for(const d of dummies){ if(d.hp>0 && Math.hypot(d.x-P.x,d.y-P.y)<120) return true; }
  return false;
}
// THE CONTEXT BUTTON: one slot that morphs to what you need right now
function straxNear(){ if(scene!=='mountains'||!MTN.packs[0]||!MTN.packs[0].cleared) return null;
  const n=NPCS.find(x=>x.id==='npc_strax'); return (n && Math.hypot(n.x-P.x,n.y-P.y)<70)? n : null; }
function mtnEnemyNear(){ if(scene!=='mountains') return false;
  for(const pk of MTN.packs) for(const w of pk.wolves){ if(w.alive && Math.hypot(w.x-P.x,w.y-P.y)<220) return true; }
  return false; }
const CAVE_MATS=[{x:130,y:130,found:false},{x:770,y:130,found:false},{x:130,y:430,found:false}];
const CHEST={x:470,y:210};   // the hoard chest — you WALK to it and OPEN it; nothing collects itself
function matSpotNear(){ return CAVE_MATS.find(m=>!m.found && Math.hypot(m.x-P.x,m.y-P.y)<56); }
function firePitNear(){ return Math.hypot(450-P.x,300-P.y)<64; }
function caveDoorNear(){ return P.y>440 && Math.abs(P.x-430)<90; }
function contextAction(){
  if(dialogOpen||invOpen) return null;
  if(scene==='climb') return {icon:'🧗', label:'HOLD to climb!', kind:'reel'};
  if(scene==='boat') return {icon:'⛵', label:'drag to steer', kind:'none'};
  if(scene==='mountains'){
    const T=MTN.troll;
    if(MTN.fire.game) return {icon:'🔥', label:'STRIKE!', kind:'firetap'};
    if(T.outside && T.stunned && !T.stone){
      if(!T.mounted && Math.hypot(P.x-T.x,P.y-T.y)<80) return {icon:'🧗', label:'CLIMB HIS BACK!', kind:'trollclimb'};
      if(T.mounted) return {icon:'💥', label:'SMASH THE HEAD!', kind:'trollsmash'};
    }
    const sx=straxNear(); if(sx) return {icon:'💬', label:'Strax', kind:'talk_strax'};
    if(birdNearby()) return {icon:'🤲', label:'grab & eat', kind:'bird'};
    if(cliffBaseNear()) return {icon:'🧗', label:'climb the cliff', kind:'climb'};
    if(MTN.climbed && plateauEdgeNear()) return {icon:'🧗', label:'climb down', kind:'climbdown'};
    if(caveMouthNear()) return {icon:'🚪', label:'the cave…', kind:'cave'};
    if(mtnEnemyNear()) return {icon:'💥', label:'smash', kind:'smash'};
    const av=AVATARS[chosen<0?0:chosen];
    return (av.item==='flute'||av.item==='lute')? {icon:'🎵', label:'play '+av.item, kind:'music'} : {icon:'💤', label:'rest', kind:'rest'};
  }
  if(scene==='cave'){
    const T=MTN.troll;
    if(MTN.fire.game) return {icon:'🔥', label:'STRIKE!', kind:'firetap'};
    if(T.stone && !MTN.cave.fireLit){
      if(MTN.cave.inMats<3 && matSpotNear()) return {icon:'🔍', label:'search the dark', kind:'searchmat'};
      if(MTN.cave.inMats>=3 && firePitNear()) return {icon:'🔥', label:'make a fire', kind:'firestart'};
    }
    if(MTN.cave.fireLit && MTN.bog.found && !MTN.bog.escort && Math.hypot(P.x-MTN.bog.x,P.y-MTN.bog.y)<70) return {icon:'🪢', label:'FREE BOG!', kind:'freebog'};
    if(MTN.cave.fireLit && !MTN.cave.treasure && Math.hypot(P.x-CHEST.x,P.y-CHEST.y)<70) return {icon:'💰', label:'open the chest', kind:'treasure'};
    if(caveDoorNear()) return {icon:'🚪', label: T.dawn&&T.alive? 'OUT — into the light!':'leave', kind:'cavedoor'};
    return {icon:'🕳', label: T.alive? (T.dawn? 'RUN for the exit!' : 'outlast it… dawn comes') : 'dark…', kind:'none'};
  }
  if(scene==='fishing'){
    if(fish.state==='idle') return {icon:'🎣', label:'cast', kind:'cast'};
    if(fish.state==='waiting') return {icon:'👀', label:'watch…', kind:'none'};
    return {icon:'🎣', label:'HOLD to reel!', kind:'reel'};
  }
  if(scene!=='village'){
    if(scene==='npc_reba'){   // the horses are RIGHT THERE and extremely pettable (results vary)
      if(Math.hypot(P.x-120,P.y-120)<62) return {icon:'🤲', label:'pet Maple', kind:'pet', horse:'maple'};
      if(Math.hypot(P.x-400,P.y-120)<62) return {icon:'🤲', label:'pet Biscuit', kind:'pet', horse:'biscuit'};
    }
    if(npcNearby()) return {icon:'💬', label:NPCS.find(x=>x.id===scene).nm.split(' ')[0], kind:'talk'};
    if(interiorDoorNear()) return {icon:'🚪', label:'leave', kind:'leave'};
    return {icon:'🚪', label:'to the door', kind:'none'};
  }
  const n=npcNearby(); if(n) return {icon:'💬', label:n.nm.split(' ')[0], kind:'talk'};
  const d=shopDoorNearby(); if(d) return {icon:'🚪', label:'enter '+d.building.sign, kind:'enter', npc:d};
  if(Math.hypot(RUINS.x-P.x,RUINS.y-P.y)<70) return {icon:'🔍', label:'the old ruins', kind:'ruins'};
  if(Math.hypot(WELL.x-P.x,WELL.y-P.y)<58) return {icon:'🪙', label:'toss a coin', kind:'well'};
  { const sp=SIGNPOSTS.find(s=>Math.hypot(s.x-P.x,s.y-P.y)<60); if(sp) return {icon:'🪧', label:'read the sign', kind:'sign', sign:sp}; }
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
  const ctxKind = b==='ctx' ? contextAction()?.kind : null;
  if(ctxKind==='firetap'){ fireGameTap(); return; }   // fire-striking fires on PRESS — no release lag, taps land when you tap
  const ctxIsSmash = ctxKind==='smash', ctxIsReel = ctxKind==='reel' || (ctxKind==='none'&&scene==='fishing');
  if((b==='atk'||ctxIsSmash||ctxIsReel) && !swp.active){ swp.active=true; swp.smashOnly=ctxIsSmash; swp.reelHold=ctxIsReel; swp.id=id; swp.sx=p.x; swp.sy=p.y; swp.cx=p.x; swp.cy=p.y; swp.t0=performance.now(); }
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
  if(kind==='bag'){
    if(scene==='fishing' && fish.state!=='idle'){ banner('🎣 Hands full! Land the line first.'); return; }
    openInv(); }
  else if(kind==='ctx'){
    const a=contextAction(); if(!a) return;
    if(a.kind==='cast'){ fishingCast(); }
    else if(a.kind==='talk_strax'){ const n=straxNear(); if(n) openDialog(n); }
    else if(a.kind==='bird'){ eatBird(); }
    else if(a.kind==='climb'){ startClimb(); }
    else if(a.kind==='climbdown'){ climbDown(); }
    else if(a.kind==='cave'){ enterCave(); }
    else if(a.kind==='cavedoor'){ leaveCave(); }
    else if(a.kind==='trollclimb'){ MTN.troll.mounted=true; MTN.troll.t=0; banner('🧗 You haul yourself up the stone-hard back — hold on… NOW!'); }
    else if(a.kind==='trollsmash'){ trollSmashFinish(); }
    else if(a.kind==='firetap'){ fireGameTap(); }
    else if(a.kind==='searchmat'){ const m=matSpotNear(); if(m){ m.found=true; MTN.cave.inMats++; banner('🔍 Driftwood… flint… tinder. ('+MTN.cave.inMats+'/3)'); } }
    else if(a.kind==='firestart'){ fireGameStart(MTN.fire.learned? 'cave' : 'cave_untaught'); if(!MTN.fire.learned){ MTN.fire.game=null; banner('🔥 You fumble in the dark… you don’t know HOW. Someone in the mountain woods might teach you.'); } }
    else if(a.kind==='freebog'){ freeBog(); }
    else if(a.kind==='treasure'){ gatherTreasure(); }
    else if(a.kind==='talk'){ const n=npcNearby(); if(n) openDialog(n); }
    else if(a.kind==='enter'){ enterShop(a.npc); }
    else if(a.kind==='leave'){ leaveShop(); }
    else if(a.kind==='grab'){ catchTurkey(); }
    else if(a.kind==='ruins'){ banner('🗿 Stone trolls, frozen mid-stride. The elders say they wandered into the sunrise… and never walked home.'); }
    else if(a.kind==='well'){ tossCoinWell(); }
    else if(a.kind==='sign'){ banner(a.sign.txt); }
    else if(a.kind==='pet'){
      if(a.horse==='maple'){ banner('🐴 Maple leans into your hand and huffs warm air. A friend for life — once that shoe is fixed.'); addFloat(P.x,P.y-34,'🐴❤️','#e8c9a0',18); }
      else { banner('🐴 Biscuit SNAPS at your fingers! Reba: “Told you. A year, warrior. She counts.”'); addFloat(P.x,P.y-34,'😬','#e8c9a0',18); }
    }
    else if(a.kind==='music'){ musicT=4200; banner('🎵 You play a gentle tune… small ears prick up, and creatures wander CLOSER.'); for(let i=0;i<3;i++) addFloat(P.x+(i-1)*16, P.y-30-i*8, '♪', '#ffd977', 15+i*2); }
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
  if(swp.reelHold){ swp.reelHold=false; return; }     // reel hold released — the minigame reads the hold, nothing fires
  if(scene==='boat'||scene==='climb') return;         // those scenes read holds themselves
  if(scene==='fishing'){ if(fish.state==='idle') fishingEnd(); return; }  // ⛵ attack button = row back
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
  if(dist>18){ slash(Math.atan2(dy,dx)); return; }   // aimed slice
  if(P.hasShield){                                    // SHIELD OWNERS: holding = shield ONLY. Release = NOTHING. (smash lives on 💥)
    if(dur<350) slash(P.dir);                         // a quick tap still attacks
    return;
  }
  if(dur>=3000) fullSmash();               // pre-shield: hold = charge smash
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


// ============================================================
// COMBAT
// ============================================================
function eachTarget(cb){
  if(scene==='mountains'){
    for(const pk of MTN.packs) for(const w of pk.wolves){ if(w.alive) cb(w,'wolf'); }
    if(MTN.troll.outside && MTN.troll.alive) cb(MTN.troll,'troll');
    return;
  }
  if(scene==='cave'){ if(MTN.troll.alive) cb(MTN.troll,'troll'); return; }
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
  } else if(kind==='wolf'){
    const kb=dmg>=5? 40 : 24; t.x+=Math.cos(ang)*kb; t.y+=Math.sin(ang)*kb;
    if(t.hp<=0){ t.alive=false; banner('🐺 Wolf down!'+(MTN.packs.some(pk=>pk.wolves.includes(t)&&packAlive(pk)===1)?' ONE LEFT — kill it before it HOWLS!':'')); }
  } else if(kind==='troll'){
    t.hp=999; // his hide shrugs off everything — only dawn ends this
    addFloat(t.x,t.y-70,'🪨 his hide shrugs it off','#cfc7b2',14);
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
  let hitDummy=false;
  eachTarget((t,kind)=>{
    const d=Math.hypot(t.x-P.x,t.y-P.y);
    if(d<radius){ hitTarget(t,kind,dmg+dmgBonus(),Math.atan2(t.y-P.y,t.x-P.x)); if(kind==='dum') hitDummy=true; }
  });
  if(hitDummy && P.weapon==='hammer'){
    const r=Quests.emit('train_hammer',{target:'dummy'});
    if(r.banner) banner(r.banner);
  }
}
// derived: is the current right-side hold a smash charge?
function chargeInfo(){
  if(!swp.active) return null;
  if(P.weapon==='bow' && !swp.smashOnly) return null;
  if(P.hasShield && !swp.smashOnly) return null;   // shield owners charge smashes ONLY on the 💥 button
  const dist=Math.hypot(swp.cx-swp.sx,swp.cy-swp.sy);
  if(dist>18 && !swp.smashOnly) return null;   // it's a slice-aim drag
  const dur=performance.now()-swp.t0;
  if(dur<350) return null;
  return { p:Math.min(1,(dur-350)/2650), full:dur>=3000 };
}
// shield owners: a steady HOLD on the attack button = shield up (engine gives it ~3s, then the arm must rest)
function shieldHoldRaw(){
  if(!P.hasShield || !swp.active || swp.smashOnly || swp.reelHold) return false;
  if(Math.hypot(swp.cx-swp.sx,swp.cy-swp.sy)>18) return false;   // that's a slice-aim drag
  return (performance.now()-swp.t0)>=250;
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
  deadly_food(){ die('You ate the RED berries. The Chief warned you…','The red berries'); },
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
    const perm=(it.effect.kind==='gear'||it.effect.kind==='passive');
    det.querySelector('.inm').textContent=it.nm+(perm?'':'  ×'+P.inv[invSel]);
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
    const kind=ITEM_DEFS[k].effect.kind, permanent=(kind==='gear'||kind==='passive');
    d.innerHTML='<div class="ic">'+ITEM_DEFS[k].ic+'</div><div class="ct">'+ITEM_DEFS[k].nm+(permanent?'':' ×'+P.inv[k])+'</div>';
    d.onclick=()=>{ invSel=k; renderInv(); };
    g.appendChild(d);
  } }
  if(!any) g.innerHTML='<div class="invEmpty">Your satchel is empty.<br>Buy bread from Erik or a potion from Dorgan in the village.</div>';
}
$('invClose').onclick=closeInv;
$('invBack').onclick=()=>{ invSel=null; renderInv(); };
$('invUse').onclick=()=>{ if(!invSel || P.inv[invSel]<1) return;
  const e=ITEM_DEFS[invSel].effect;
  if(e.kind==='passive'||e.kind==='gear'){ banner('🧰 It’s gear — always with you.'); return; }   // permanent gear never vanishes
  if(e.kind==='sellable'){ banner('🦃 Erik buys these — visit the 🪙 shop!'); return; }
  P.inv[invSel]--; useItem(invSel); closeInv(); };
function hurtPlayer(n,why){
  if(P.hurtT>0) return;
  if(P.shieldUp){ banner('🛡️ Blocked with the Champion’s Shield!'); addFloat(P.x,P.y-36,'🛡️','#cfd4da',20); P.hurtT=25; return; }
  if(pot.t>0 && POTION_POWERS[pot.type]?.blocksDamage){ banner('🛡️ Stoneskin absorbs the blow!'); P.hurtT=30; return; }
  P.hp-=n; P.hurtT=45;
  if(P.hp<=0) die(why||'A goblin got the better of you.');
}
let deathScene='village';
function die(msg,title){
  deathScene=scene;
  pot.type=null; pot.t=0;   // you don't keep a potion through death
  $('deathTitle').textContent = title||'You have fallen';
  $('deathMsg').textContent = msg+' You wake at the edge of the territory.';
  show('deathScr');
  running=false;
}
$('btnRespawn').onclick=()=>{
  P.hp=5; hungerT=0; P.hurtT=60;   // 2½ hearts — food still matters
  if(deathScene==='mountains'||deathScene==='cave'||deathScene==='climb'){
    scene='mountains'; P.x=750; P.y=70;
    if(MTN.troll.alive && MTN.packs[1] && MTN.packs[1].cleared){ birdsSpawn(3); banner('🐦 Fresh birds flutter over the plateau — eat before facing the troll again.'); }
  } else { scene='village'; P.x=800; P.y=1210; }
  show('gameWrap'); running=true; loop(); };

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
  appendQuestChoice();
}
function advanceDialog(){
  dIdx++;
  if(dIdx>=dLines.length){
    Quests.onDialogueEnd(dNpc.id);   // quest transitions (offer→active, complete→reward)
    closeDialog();
  } else renderDialog();
}
function closeDialog(){ dialogOpen=false; $('dialog').classList.add('hidden');
  if(dNpc && dNpc.id==='npc_strax' && !MTN.fire.learned && !MTN.fire.game) fireGameStart('strax'); }
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
  { const m=Math.hypot(mx,my); if(m>1){ mx/=m; my/=m; } }   // normalize diagonals (keyboard was √2 too fast)
  if(keys[' ']){ slash(P.dir); }
  // scenes with their own physics: the boat crossing & THE CLIMB
  if(scene==='boat'){ boatUpdate(dt,mx,my); updFloats(); return; }
  if(scene==='climb'){ climbUpdate(dt); updFloats(); if(P.hurtT>0)P.hurtT--; return; }
  // THE SHIELD: hold = up, but a shield arm TIRES (~3s), then it must rest — no more spam-and-hold
  if(P.shieldCd>0) P.shieldCd-=dt;
  { const want=shieldHoldRaw();
    if(want && P.shieldCd<=0){
      P.shieldUp=true; P.shieldT+=dt;
      if(P.shieldT>=3000){ P.shieldUp=false; P.shieldT=0; P.shieldCd=2500; banner('🛡️ Your shield arm tires! It needs a moment…'); }
    } else {
      if(P.shieldUp) P.shieldCd=Math.max(P.shieldCd,1200);   // it rests briefly after every use
      P.shieldUp=false; if(!want) P.shieldT=0;
    } }
  if(P.dashT>0){ P.dashT--; P.x+=Math.cos(P.dir)*7.5; P.y+=Math.sin(P.dir)*7.5; }
  if(P.dashCd>0) P.dashCd--;
  const spd = P.speed * (pot.t>0 ? (POTION_POWERS[pot.type]?.speedMult||1) : 1);
  const charging = chargeInfo();
  if((mx||my) && !blocked() && !charging && !P.shieldUp && scene!=='fishing'){
    P.x+=mx*spd; P.y+=my*spd; P.dir=Math.atan2(my,mx);
    if(scene==='mountains'){
      P.x=Math.max(30,Math.min(MW-30,P.x)); P.y=Math.max(20,Math.min(MH-30,P.y));
      for(const t of MTN.mtrees){ const d=Math.hypot(t.x-P.x,t.y-P.y); if(d<t.r+12){ const a=Math.atan2(P.y-t.y,P.x-t.x); P.x=t.x+Math.cos(a)*(t.r+12); P.y=t.y+Math.sin(a)*(t.r+12);} }
      for(const r0 of MTN.rocks){ const d=Math.hypot(r0.x-P.x,r0.y-P.y); if(d<r0.r+11){ const a=Math.atan2(P.y-r0.y,P.x-r0.x); P.x=r0.x+Math.cos(a)*(r0.r+11); P.y=r0.y+Math.sin(a)*(r0.r+11);} }
      // the cliff wall: only the climb crosses it (either direction)
      if(!MTN.climbed && P.y>700 && P.y<965) P.y=700;
      if(MTN.climbed && P.y>700 && P.y<965) P.y = (P.y<832)? 700 : 965;
    } else if(scene==='cave'){
      P.x=Math.max(60,Math.min(840,P.x)); P.y=Math.max(70,Math.min(500,P.y));
    } else {
    P.x=Math.max(30,Math.min(W-30,P.x)); P.y=Math.max(30,Math.min(H-30,P.y));
    for(const t of trees){ const d=Math.hypot(t.x-P.x,t.y-P.y); if(d<t.r+12){ const a=Math.atan2(P.y-t.y,P.x-t.x); P.x=t.x+Math.cos(a)*(t.r+12); P.y=t.y+Math.sin(a)*(t.r+12);} }
    for(const h of houses){ if(Math.abs(P.x-h.x)<62 && Math.abs(P.y-h.y)<56){ if(Math.abs(P.x-h.x)/62>Math.abs(P.y-h.y)/56) P.x=h.x+Math.sign(P.x-h.x)*62; else P.y=h.y+Math.sign(P.y-h.y)*56; } }
    // the pond is water — you can't walk on it (yet…)
    { const ex=(P.x-POND.x)/(POND.rx+14), ey=(P.y-POND.y)/(POND.ry+14), d2=ex*ex+ey*ey;
      if(d2<1){ const a=Math.atan2(P.y-POND.y,(P.x-POND.x)); P.x=POND.x+Math.cos(a)*(POND.rx+15); P.y=POND.y+Math.sin(a)*(POND.ry+15); } }
    }
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
  if(questState.currentId==='quest_main_04_champion' && questState.stage==='active' && (!champion||!champion.alive)) spawnChampion();
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
  fishingUpdate(dt);
  giverWalkUpdate(dt);
  mountainsUpdate(dt);

  // travel: the southern trail (village ⇄ mountains)
  if(scene==='village' && P.y>H-46 && P.x>640 && P.x<960){
    const unlocked = questState.completed.includes('quest_main_05_shield_training') || questState.currentId==='quest_main_06_find_bog' || questState.completed.includes('quest_main_06_find_bog');
    if(unlocked){ scene='mountains'; mtnInit(); P.x=750; P.y=70; banner('⛰️ The trail climbs. Pines thin. Somewhere ahead: the mountains.'); }
    else { P.y=H-48; banner('🌲 The southern trail winds toward the mountains. No reason to go… yet.'); }
  }
  if(scene==='mountains' && P.y<36){ scene='village'; P.x=800; P.y=H-80;
    if(MTN.bog.escort){ MTN.bog.escort=false; questState.flags.flag_bog_rescued=true;
      banner('🏘 BOG IS HOME! The village ERUPTS — the Chief is already running across the square!'); }
    else banner('🏘 Home again. The village fires never looked so warm.'); }

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
  updFloats();

  // dropped coins — walk over to collect
  if(scene==='village') for(let i=drops.length-1;i>=0;i--){ const c=drops[i];
    if(Math.hypot(c.x-P.x,c.y-P.y)<30){ P.coins+=c.amt; addFloat(P.x,P.y-36,'+'+c.amt+' 🪙','#ffd977',17); drops.splice(i,1); } }

  // goblins prowl back after a while (combat practice never runs dry)
  if(goblins.every(g=>!g.alive)){ gobRespawnT+=dt;
    if(gobRespawnT>30000){ gobRespawnT=0; spawnGoblins(); banner('🌲 More goblins prowl the north forest…'); } }
  else gobRespawnT=0;

  // the pond ducks paddle, flee a crowder, and drift closer when you play a tune
  if(scene==='village') ducksUpdate(dt);

  // hunger — a stroll barely counts; fighting and dashing burn hot (climbing is handled in its scene)
  tickHunger(dt, (P.slashT>0||P.dashT>0)? 2.2 : (mx||my)? 1.3 : 1);

  // berries (blue bushes regrow after ~25s). Blueberries go INTO THE SATCHEL —
  // eat them from there by choice, or deliver them. Red berries are still death.
  if(scene==='village') for(const b of bushes){
    if(b.taken){ b.respawn-=dt; if(b.respawn<=0 && b.type==='blue') b.taken=false; continue; }
    if(Math.hypot(b.x-P.x,b.y-P.y)<30){
      b.taken=true; b.respawn=25000;
      { const isBlue=b.type==='blue';
        const id=isBlue?'item_blueberry':'item_red_berry';
        P.inv[id]=(P.inv[id]||0)+1;
        addFloat(P.x,P.y-34,isBlue?'+🫐':'+🔴',isBlue?'#7ea8d6':'#e05545',17);
        const q=questState.currentId==='quest_main_02_blueberries' && (questState.stage==='active'||questState.stage==='complete');
        if(q){ Quests.update(0); banner('🧺 '+ (Quests.trackerText()||'gathering…')); }
        else banner(isBlue? '🫐 Blueberry into the satchel' : '🔴 Red berries into the satchel. Remember what the Chief said…');
      }
    } }

  // the CURSED STONE: deep in the forest — touch it and you die
  if(scene==='village' && Math.hypot(CURSED_STONE.x-P.x, CURSED_STONE.y-P.y)<26){
    die('You touched the cursed stone. Its cold fire took you in an instant.','The cursed stone');
  }

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
    // goblins never cross into the village — it's protected ground
    { const ex=(g.x-VILLAGE.x)/VILLAGE.rx, ey=(g.y-VILLAGE.y)/VILLAGE.ry;
      if(ex*ex+ey*ey < 1){ const a=Math.atan2(g.y-VILLAGE.y, g.x-VILLAGE.x);
        g.x=VILLAGE.x+Math.cos(a)*VILLAGE.rx; g.y=VILLAGE.y+Math.sin(a)*VILLAGE.ry; } }
    if(g.atkT>0)g.atkT--;
  }
}

// ============================================================
// RENDER
// ============================================================
function draw(){
  if(scene==='fishing'){ drawFishing(); }
  else if(scene==='boat'){ drawBoatScene(); }
  else if(scene==='climb'){ drawClimb(); }
  else if(scene==='mountains'){ drawMountains(); }
  else if(scene==='cave'){ drawCave(); }
  else if(scene!=='village'){ drawInterior(); }
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

  // the POND — Bog's kingdom
  ctx.fillStyle='#274b56'; ctx.beginPath(); ctx.ellipse(POND.x,POND.y,POND.rx,POND.ry,0,0,7); ctx.fill();
  ctx.fillStyle='#31606e'; ctx.beginPath(); ctx.ellipse(POND.x-14,POND.y-10,POND.rx*.8,POND.ry*.78,0,0,7); ctx.fill();
  ctx.strokeStyle='rgba(210,230,240,.25)'; ctx.lineWidth=2;
  for(let i=0;i<3;i++){ ctx.beginPath(); ctx.ellipse(POND.x-20+i*24, POND.y-16+i*20, 26,7,0,0,7); ctx.stroke(); }
  // ducks — a little wake trails behind each
  ctx.textAlign='center';
  for(const dk of ducks){ const dp=duckPos(dk);
    ctx.strokeStyle='rgba(210,230,240,.34)'; ctx.lineWidth=1.4;
    ctx.beginPath(); ctx.ellipse(dp.x, dp.y+4, 11, 4, 0, 0, 7); ctx.stroke();
    ctx.font='17px serif'; ctx.fillText('🦆', dp.x, dp.y+6); }
  // Bog's shack + 🛶 sign
  ctx.fillStyle='#4a3a26'; ctx.fillRect(1160,1035,74,50);
  ctx.fillStyle='#6d4a2e'; ctx.beginPath(); ctx.moveTo(1152,1037); ctx.lineTo(1197,1008); ctx.lineTo(1242,1037); ctx.closePath(); ctx.fill();
  ctx.fillStyle='#3d2c14'; ctx.fillRect(1180,1082,34,22); ctx.strokeStyle='#8a6d38'; ctx.lineWidth=2; ctx.strokeRect(1180,1082,34,22);
  ctx.font='15px Georgia'; ctx.textAlign='center'; ctx.fillText('🛶', 1197, 1098);

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

  // the STONE-TROLL RUINS — mossy shapes frozen mid-stride, village lore about the dawn
  { const R0=RUINS;
    ctx.fillStyle='#57534a'; ctx.beginPath(); ctx.ellipse(R0.x+2,R0.y+22,36,9,0,0,7); ctx.fill();          // rubble base
    ctx.fillStyle='#6f6b62'; ctx.beginPath(); ctx.ellipse(R0.x-24,R0.y+2,16,22,-0.25,0,7); ctx.fill();     // big one
    ctx.beginPath(); ctx.arc(R0.x-27,R0.y-24,10,0,7); ctx.fill();
    ctx.fillStyle='#7a766c'; ctx.beginPath(); ctx.ellipse(R0.x+18,R0.y+6,13,17,0.35,0,7); ctx.fill();      // smaller, mid-stride
    ctx.beginPath(); ctx.arc(R0.x+23,R0.y-13,8,0,7); ctx.fill();
    ctx.fillStyle='#3f4a35'; ctx.beginPath(); ctx.arc(R0.x-34,R0.y-8,6,0,7); ctx.fill(); ctx.beginPath(); ctx.arc(R0.x+10,R0.y+13,5,0,7); ctx.fill();  // moss
    if(Math.hypot(RUINS.x-P.x,RUINS.y-P.y)<70){ ctx.fillStyle='#cbbc90'; ctx.font='11px Georgia'; ctx.textAlign='center'; ctx.fillText('🔍 old ruins', R0.x, R0.y-44); } }

  // the WISHING WELL — stone ring, dark water, a little shingled roof on two posts
  { const W=WELL;
    ctx.fillStyle='rgba(0,0,0,.18)'; ctx.beginPath(); ctx.ellipse(W.x,W.y+16,26,8,0,0,7); ctx.fill();          // shadow
    ctx.fillStyle='#7d756a'; ctx.beginPath(); ctx.ellipse(W.x,W.y+8,24,13,0,0,7); ctx.fill();                  // outer stone ring
    ctx.fillStyle='#5b544c'; ctx.beginPath(); ctx.ellipse(W.x,W.y+5,18,10,0,0,7); ctx.fill();                  // rim
    ctx.fillStyle='#22323b'; ctx.beginPath(); ctx.ellipse(W.x,W.y+5,13,7,0,0,7); ctx.fill();                   // water
    ctx.strokeStyle='rgba(200,225,235,.25)'; ctx.lineWidth=1; ctx.beginPath(); ctx.ellipse(W.x-3,W.y+4,7,3,0,0,7); ctx.stroke();
    ctx.fillStyle='#6d4a2e'; ctx.fillRect(W.x-22,W.y-30,4,34); ctx.fillRect(W.x+18,W.y-30,4,34);               // posts
    ctx.fillStyle='#7a3f2a'; ctx.beginPath(); ctx.moveTo(W.x-28,W.y-30); ctx.lineTo(W.x,W.y-44); ctx.lineTo(W.x+28,W.y-30); ctx.closePath(); ctx.fill(); // roof
    if(Math.hypot(W.x-P.x,W.y-P.y)<58){ ctx.fillStyle='#ffd977'; ctx.font='11px Georgia'; ctx.textAlign='center'; ctx.fillText('🪙 make a wish', W.x, W.y-52); } }

  // SIGNPOSTS — a leaning post and a carved board at each trailhead
  for(const s of SIGNPOSTS){
    ctx.fillStyle='rgba(0,0,0,.15)'; ctx.beginPath(); ctx.ellipse(s.x,s.y+20,15,5,0,0,7); ctx.fill();
    ctx.fillStyle='#6d4a2e'; ctx.fillRect(s.x-3,s.y-8,6,28);                                                   // post
    ctx.fillStyle='#8a5a34'; ctx.fillRect(s.x-20,s.y-24,40,18); ctx.strokeStyle='#4a2f18'; ctx.lineWidth=2; ctx.strokeRect(s.x-20,s.y-24,40,18); // board
    ctx.strokeStyle='#c9a878'; ctx.lineWidth=1.5; ctx.beginPath(); ctx.moveTo(s.x-14,s.y-18); ctx.lineTo(s.x+14,s.y-18); ctx.moveTo(s.x-14,s.y-13); ctx.lineTo(s.x+8,s.y-13); ctx.stroke(); // carved lines
    if(Math.hypot(s.x-P.x,s.y-P.y)<60){ ctx.fillStyle='#e8d9b0'; ctx.font='11px Georgia'; ctx.textAlign='center'; ctx.fillText('🪧 read', s.x, s.y-32); } }

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

  // NPCs outdoors (the Chief in the square, Bog once rescued) — shopkeepers are inside
  for(const n of NPCS){ if(n.raw.building || n.raw.scene==='mountains') continue;
    if(n.id==='npc_bog' && !questState.flags.flag_bog_rescued) continue;
    if(giverWalk && giverWalk.npcId===n.id) continue;    // they're out walking — to YOU
    drawPerson(n.x,n.y,0,{hair:n.raw.look.hair||'#555',outfit:n.col,skin:'#e0b088'},n.hat, Math.hypot(n.x-P.x,n.y-P.y)<70); }
  // a quest-giver crossing the village to find you (quests come from PEOPLE, not banners)
  if(giverWalk){ const gn=NPCS.find(n=>n.id===giverWalk.npcId);
    if(gn){ drawPerson(giverWalk.x,giverWalk.y,0,{hair:gn.raw.look.hair||'#555',outfit:gn.col,skin:'#e0b088'},gn.hat, !giverWalk.returning && Math.hypot(giverWalk.x-P.x,giverWalk.y-P.y)<70);
      if(!giverWalk.returning){ ctx.fillStyle='#ffd977'; ctx.font='11px Georgia'; ctx.textAlign='center'; ctx.fillText(gn.nm.split(' ')[0]+' is coming to you…', giverWalk.x, giverWalk.y-40); } } }
  // Bog's shack sits CLOSED while he's missing
  if(!questState.flags.flag_bog_rescued){
    ctx.fillStyle='#2c2214'; ctx.fillRect(1170,1056,54,16);
    ctx.fillStyle='#c9b06a'; ctx.font='bold 10px Georgia'; ctx.textAlign='center'; ctx.fillText('CLOSED', 1197, 1068);
  }

  // sparring Modo (quest 5) — wooden sword, zero malice
  if(spar && questState.currentId==='quest_main_05_shield_training' && questState.stage==='active'){
    const c=spar;
    drawPerson(c.x,c.y,0,{hair:'#555',outfit:'#4f4a45',skin:'#e0b088'},false,false);
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
  // the SHIELD BUBBLE — up while you HOLD the attack button (max ~3s, then the arm rests)
  if(P.shieldUp){
    ctx.fillStyle='rgba(170,190,215,.16)'; ctx.beginPath(); ctx.arc(P.x,P.y,34,0,7); ctx.fill();
    ctx.strokeStyle='rgba(200,215,235,.9)'; ctx.lineWidth=3; ctx.beginPath(); ctx.arc(P.x,P.y,34,0,7); ctx.stroke();
    const left=Math.max(0,1-P.shieldT/3000);   // the gold ring DRAINS as your shield arm tires
    ctx.strokeStyle='rgba(255,217,119,.9)'; ctx.lineWidth=3.5;
    ctx.beginPath(); ctx.arc(P.x,P.y,40,-Math.PI/2,-Math.PI/2+Math.PI*2*left); ctx.stroke();
    ctx.fillStyle='#cfe0f2'; ctx.font='bold 12px Georgia'; ctx.textAlign='center'; ctx.fillText('🛡️ SHIELD UP', P.x, P.y-58);
  } else if(P.hasShield && P.shieldCd>0){
    ctx.fillStyle='rgba(200,215,235,.55)'; ctx.font='11px Georgia'; ctx.textAlign='center'; ctx.fillText('🛡️ arm resting…', P.x, P.y-50);
  }
  // charging a SMASH — the 💥 button (or the attack button, before you own a shield)
  { const ch=chargeInfo();
    if(ch){
      ctx.strokeStyle = ch.full? 'rgba(255,215,90,.95)' : 'rgba(255,190,110,'+(0.4+ch.p*0.5)+')';
      ctx.lineWidth = 4+ch.p*3;
      ctx.beginPath(); ctx.arc(P.x,P.y,22+ch.p*18, -Math.PI/2, -Math.PI/2 + Math.PI*2*ch.p); ctx.stroke();
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

  // the cursed stone — dark crystal, faint violet glow
  { const cs=CURSED_STONE, gl=.35+.2*Math.sin(performance.now()/300);
    ctx.fillStyle='rgba(120,60,200,'+gl*.4+')'; ctx.beginPath(); ctx.arc(cs.x,cs.y,26,0,7); ctx.fill();
    ctx.fillStyle='#2c1f3d'; ctx.beginPath();
    ctx.moveTo(cs.x,cs.y-20); ctx.lineTo(cs.x+12,cs.y+8); ctx.lineTo(cs.x,cs.y+14); ctx.lineTo(cs.x-12,cs.y+8); ctx.closePath(); ctx.fill();
    ctx.strokeStyle='rgba(190,120,255,'+(gl+.2)+')'; ctx.lineWidth=2; ctx.stroke(); }

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
  const top = 12;
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
  ctx.fillText(scene==='fishing' ? '⛵' : WEAPONS[P.weapon].icon, ab.x, ab.y+2);
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
  const nItems=Object.keys(P.inv).reduce((a,k)=>{ const kd=ITEM_DEFS[k]&&ITEM_DEFS[k].effect.kind; return a+((kd==='gear'||kd==='passive')?0:(P.inv[k]||0)); },0);
  if(nItems>0){ ctx.fillStyle='#ffd977'; ctx.beginPath(); ctx.arc(bb.x+17,bb.y-17,9,0,7); ctx.fill();
    ctx.fillStyle='#241d10'; ctx.font='bold 12px Georgia'; ctx.textBaseline='middle'; ctx.fillText(nItems, bb.x+17, bb.y-16); ctx.textBaseline='alphabetic'; }
  ctx.fillStyle='rgba(240,230,200,.3)'; ctx.font='11.5px Georgia'; ctx.textAlign='left';
  if(!joy.active) ctx.fillText('press & drag anywhere to move', 18, vh-20);
  ctx.textAlign='center';
  ctx.fillText(scene==='fishing' ? '⛵ tap: row back to shore'
    : scene==='boat' ? '⛵ drag anywhere to steer'
    : P.weapon==='bow' ? 'pull back & release • arrows: '+P.arrows
    : P.hasShield ? 'tap: attack • HOLD: 🛡️ shield (3s max) • 💥: smash'
    : P.weapon==='fists'? 'tap: punch • hold: charge SMASH'
    : 'drag from the button: aimed slice • hold: charge SMASH', ab.x-24, ab.y+ab.r+18);
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
function startGame(){ show('gameWrap'); running=true; last=performance.now(); banner('Welcome to Losthorne. Find Chief Bonbottom in the square!'); if(typeof devArmed!=='undefined' && devArmed) buildDevMenu(); requestAnimationFrame(loop); }

// ---------- FISHING WITH BOG ----------
const POND={x:1380,y:930,rx:175,ry:120};
const fish={ state:'idle', t:0, biteT:0, tension:50, inZone:0, catches:[], hook:'basic' };
const HOOKS={ basic:{lo:34,hi:66,big:0,reelMs:2600}, fine:{lo:46,hi:54,big:0.5,reelMs:3600} };  // fine hook: BIG fish, TINY window, longer fight
const NPC_ACTIONS={
  fish_trip(){ closeDialog();
    scene='fishing'; fish.state='idle'; fish.catches.length=0;
    banner('🛶 Bog rows you to the middle of the pond. Tap 🎣 to cast!');
  },
  boat_lesson(){ closeDialog(); startBoatLesson(); },
};

// ---------- BOG'S BOAT-DRIVING LESSON: YOU take the oars ----------
// A real crossing: steer with the joystick, dodge the rocks, reach the far jetty.
const BW=1700, BH=700;
const BOAT={x:90,y:350,bumps:0,coachT:0,done:false};
const BOAT_ROCKS=[[380,190],[520,450],[700,130],[830,340],[1000,540],[1120,240],[1310,420],[940,150],[1210,600]].map(r=>({x:r[0],y:r[1],r:26}));
const BOG_COACH=['Bog: ROCK! Small strokes — go AROUND, not THROUGH!',
                 'Bog: My poor boat! Steer EARLY — the water gives you time!',
                 'Bog: You row like a turkey swims. AROUND the rocks, warrior!'];
function startBoatLesson(){
  scene='boat'; BOAT.x=90; BOAT.y=BH/2; BOAT.bumps=0; BOAT.coachT=0; BOAT.done=false;
  banner('⛵ Bog hands YOU the oars: “Press & drag anywhere to steer — same as your feet. Take us to the FAR JETTY. Mind the ROCKS!”');
}
function boatUpdate(dt,mx,my){
  if(BOAT.done) return;
  tickHunger(dt,1);
  if(BOAT.coachT>0) BOAT.coachT-=dt;
  BOAT.x+=mx*2.7; BOAT.y+=my*2.7;
  BOAT.x=Math.max(50,Math.min(BW-40,BOAT.x)); BOAT.y=Math.max(60,Math.min(BH-60,BOAT.y));
  for(const r0 of BOAT_ROCKS){ const d=Math.hypot(r0.x-BOAT.x,r0.y-BOAT.y);
    if(d<r0.r+30){ const a=Math.atan2(BOAT.y-r0.y,BOAT.x-r0.x);
      BOAT.x=r0.x+Math.cos(a)*(r0.r+31); BOAT.y=r0.y+Math.sin(a)*(r0.r+31);
      if(BOAT.coachT<=0){ BOAT.bumps++; BOAT.coachT=1600; banner('💢 '+BOG_COACH[BOAT.bumps%BOG_COACH.length]); } } }
  if(BOAT.x>BW-90){
    BOAT.done=true; questState.flags.flag_boat_skill=true;
    scene='village'; P.x=1195; P.y=1100;
    addFloat(P.x,P.y-40,'⛵ skill learned!','#9fd6e8',20);
    banner(BOAT.bumps===0 ? '⛵ THE JETTY — not one scratch! Bog: “Born on water! BOAT-DRIVING learned.”'
                          : '⛵ The jetty! '+BOAT.bumps+' bump'+(BOAT.bumps>1?'s':'')+', but YOU drove. Bog: “Boat-driving learned… the rocks will heal.”');
  }
}
function drawBoatScene(){
  const camX=Math.max(0,Math.min(BW-vw,BOAT.x-vw/2)), camY=Math.max(0,Math.min(Math.max(0,BH-vh),BOAT.y-vh/2));
  const grd=ctx.createLinearGradient(0,0,0,vh);
  grd.addColorStop(0,'#2b5561'); grd.addColorStop(1,'#1d3b45');
  ctx.fillStyle=grd; ctx.fillRect(0,0,vw,vh);
  ctx.save(); ctx.translate(-camX,-camY);
  ctx.strokeStyle='rgba(210,230,240,.14)'; ctx.lineWidth=2;
  for(let i=0;i<10;i++){ ctx.beginPath(); ctx.ellipse((i*233+((performance.now()/50)%233))%BW, 60+(i*97)%(BH-80), 30,7,0,0,7); ctx.stroke(); }
  // start dock & the FAR JETTY
  ctx.fillStyle='#5a462c'; ctx.fillRect(0,BH/2-70,70,140);
  ctx.fillStyle='#6b552f'; ctx.fillRect(BW-70,0,70,BH);
  ctx.font='26px Georgia'; ctx.textAlign='center'; ctx.fillText('🚩', BW-34, 90);
  ctx.fillStyle='#ffd977'; ctx.font='bold 13px Georgia'; ctx.fillText('THE JETTY →', BW-150, BH/2);
  // rocks with warning foam
  for(const r0 of BOAT_ROCKS){
    ctx.strokeStyle='rgba(220,235,240,.35)'; ctx.lineWidth=3; ctx.beginPath(); ctx.arc(r0.x,r0.y,r0.r+8+2*Math.sin(performance.now()/300+r0.x),0,7); ctx.stroke();
    ctx.fillStyle='#4e4a44'; ctx.beginPath(); ctx.arc(r0.x,r0.y,r0.r,0,7); ctx.fill();
    ctx.fillStyle='#5e5a52'; ctx.beginPath(); ctx.arc(r0.x-7,r0.y-8,r0.r*.5,0,7); ctx.fill();
  }
  // the boat — YOU at the oars, Bog coaching from the stern
  ctx.fillStyle='#6b4a26'; ctx.beginPath(); ctx.moveTo(BOAT.x-52,BOAT.y); ctx.quadraticCurveTo(BOAT.x,BOAT.y+30,BOAT.x+52,BOAT.y); ctx.lineTo(BOAT.x+38,BOAT.y-12); ctx.lineTo(BOAT.x-38,BOAT.y-12); ctx.closePath(); ctx.fill();
  drawPerson(BOAT.x+16,BOAT.y-22,0,AVATARS[chosen<0?0:chosen],false,false);
  drawPerson(BOAT.x-22,BOAT.y-22,0,{hair:'#555',outfit:'#3a6b62',skin:'#dba777'},false,false);
  ctx.fillStyle='#9fd6e8'; ctx.font='10.5px Georgia'; ctx.textAlign='center'; ctx.fillText('Bog', BOAT.x-22, BOAT.y-46);
  ctx.restore();
  ctx.fillStyle='#e8d9a8'; ctx.font='bold 14px Georgia'; ctx.textAlign='left';
  ctx.fillText('⛵ bumps: '+BOAT.bumps, 18, vh-18);
}
function fishingCast(){
  if(fish.state!=='idle') return;
  // choose your hook first (if you own both)
  const hasB=(P.inv.item_hook_basic||0)>0, hasF=(P.inv.item_hook_fine||0)>0;
  if(hasB && hasF && !fish.hookChosen){ openHookChoice(); return; }
  fish.hook = hasF && !hasB ? 'fine' : (fish.hookChosen? fish.hook : 'basic');
  fish.state='waiting'; fish.t=1500+Math.random()*2500;
  banner('🎣 Cast with the '+(fish.hook==='fine'?'✨ fine':'🪝 basic')+' hook… watch the water.');
}
function openHookChoice(){
  dialogOpen=true; dNpc=null; dLines=['Which hook, warrior?'];
  $('dialog').querySelector('.who').textContent='Bog';
  $('dialog').querySelector('.txt').textContent='Which hook? The fine one hooks the BIG fish… but they fight harder — a much smaller sweet spot on the reel.';
  const box=$('shopBox'); box.innerHTML='';
  const mk=(label,hk)=>{ const b=document.createElement('button'); b.className='btn shopBtn'; b.textContent=label;
    b.onclick=(ev)=>{ ev.stopPropagation(); fish.hook=hk; fish.hookChosen=true; closeDialog(); fishingCast(); };
    box.appendChild(b); };
  mk('🪝 Basic hook — small fish, forgiving reel','basic');
  mk('✨ Fine hook — BIG fish, tiny green window','fine');
  $('dialog').classList.remove('hidden');
}
function fishingHolding(){ return swp.active && swp.reelHold; }
function fishingLose(tip){ fish.state='idle'; banner(tip); }
function fishingCatch(){
  const big = Math.random() < (HOOKS[fish.hook]||HOOKS.basic).big;
  fish.catches.push(big?'item_fish_big':'item_fish_small');
  fish.state='idle';
  banner((big?'🐠 A BIG one!':'🐟 Caught one!')+'  ('+fish.catches.length+' aboard) — cast again or ⛵ row back');
}
function fishingEnd(){
  const yours=[];
  fish.catches.forEach((f,i)=>{ if(i%2===1) yours.push(f); });  // Bog takes the 1st of each pair — odd one is his
  for(const f of yours) P.inv[f]=(P.inv[f]||0)+1;
  const bogN=fish.catches.length-yours.length;
  questState.flags.flag_fished_once=true;
  scene='village'; P.x=1195; P.y=1100;
  banner('⛵ Ashore! Catch: '+fish.catches.length+' — Bog keeps '+bogN+', you keep '+yours.length+'. He can teach boat-driving now!');
  fish.state='idle'; fish.catches.length=0; fish.hookChosen=false;   // re-offer the hook choice next trip
}
function fishingUpdate(dt){
  if(scene!=='fishing') return;
  if(fish.state==='waiting'){ fish.t-=dt;
    if(fish.t<=0){ fish.state='bite'; fish.biteT=1700; banner('❗ A BITE! HOLD 🎣 to reel — steady now!'); } }
  else if(fish.state==='bite'){ fish.biteT-=dt;
    if(fishingHolding()){ fish.state='reeling'; fish.tension=50; fish.inZone=0; }
    else if(fish.biteT<=0) fishingLose('Bog: Slept through the bite, did we? Cast again.'); }
  else if(fish.state==='reeling'){
    fish.tension += fishingHolding()? dt*0.048 : -dt*0.058;
    if(fish.tension>=100) fishingLose('💨 SNAP! Bog: Too HARD — ease off when the line strains!');
    else if(fish.tension<=0) fishingLose('💨 It jumped away! Bog: Too timid — REEL, warrior!');
    else { const z=HOOKS[fish.hook]||HOOKS.basic; if(fish.tension>z.lo && fish.tension<z.hi) fish.inZone+=dt; if(fish.inZone>(z.reelMs||2600)) fishingCatch(); }
  }
}

// ---------- THE MOUNTAINS (second territory) + THE TROLL ARC ----------
const MW=1500, MH=1240;
const MTN={
  entered:false, climbed:false,
  packs:[], birds:[], mbushes:[], rocks:[], mtrees:[],
  fire:{learned:false, game:null},           // fire-making minigame state
  cave:{ inMats:0, fireLit:false, treasure:false },
  bog:{ found:false, escort:false, x:700, y:300 },
  troll:{ alive:true, x:450, y:250, dir:0, state:'lurk', t:0, outside:false, stunned:false, mounted:false, stone:false, dawn:false, dawnT:75000 },
};
function mtnInit(){
  if(MTN.entered) return; MTN.entered=true;
  MTN.packs=[ mkPack(750,520), mkPack(750,1010) ];
  MTN.mbushes=[ {x:250,y:250,type:'blue',taken:false,respawn:0},{x:1180,y:300,type:'blue',taken:false,respawn:0},{x:600,y:180,type:'blue',taken:false,respawn:0},
                {x:950,y:230,type:'red',taken:false,respawn:0},{x:340,y:520,type:'red',taken:false,respawn:0} ];
  for(let i=0;i<26;i++) MTN.mtrees.push({x:80+Math.random()*(MW-160), y:80+Math.random()*300, r:20+Math.random()*12});
  for(let i=0;i<14;i++) MTN.rocks.push({x:100+Math.random()*(MW-200), y:430+Math.random()*230, r:14+Math.random()*16});
}
function mkPack(cx,cy){
  const wolves=[]; for(let i=0;i<5;i++){ const a=i/5*6.283;
    wolves.push({x:cx+Math.cos(a)*95, y:cy+Math.sin(a)*95, hp:18, maxhp:18, dir:Math.random()*7, t:0, hurtT:0, atkT:0, alive:true, showBar:false}); }
  return {wolves, lastOneT:0, cleared:false, rotT:0, shift:0};
}
function packAlive(pk){ return pk.wolves.filter(w=>w.alive).length; }
function birdsSpawn(n){ for(let i=0;i<n;i++) MTN.birds.push({x:600+Math.random()*300, y:980+Math.random()*120, dir:Math.random()*7, t:0}); }
function birdNearby(){ if(scene!=='mountains') return null;
  let b=null,bd=56; for(const bd2 of MTN.birds){ const d=Math.hypot(bd2.x-P.x,bd2.y-P.y); if(d<bd){bd=d;b=bd2;} } return b; }
function eatBird(){ const b=birdNearby(); if(!b) return;
  MTN.birds.splice(MTN.birds.indexOf(b),1);
  P.hp=Math.min(P.maxhp,P.hp+2); hungerT=0;
  addFloat(P.x,P.y-34,'🐦 +1 ❤️','#7ed67e',18); banner('🐦 You grab the plump little bird and eat on the spot. +1 ❤️');
}
function cliffBaseNear(){ return scene==='mountains' && P.y>620 && P.y<700 && Math.abs(P.x-750)<90; }
function plateauEdgeNear(){ return scene==='mountains' && P.y>960 && P.y<1000 && Math.abs(P.x-750)<90; }
function caveMouthNear(){ return scene==='mountains' && Math.hypot(P.x-750,P.y-1130)<62; }
// THE CLIMB — a full-screen scene: you SEE yourself hauling up the cliff face, ledge to ledge
const CLIMB={prog:0, grip:100, fall:false};
const LEDGES=[25,50,75];   // resting shelves up the wall
function startClimb(){ scene='climb'; CLIMB.prog=0; CLIMB.grip=100; CLIMB.fall=false;
  banner('🧗 THE CLIMB: HOLD 🧗 to haul upward. RELEASE to settle onto a LEDGE and rest — grip refills there. Empty grip = FALL!'); }
function climbDown(){ P.y=690; banner('🧗 You pick your way back down the ledges.'); }
function nearestLedgeBelow(p){ let l=0; for(const L of LEDGES){ if(L<=p) l=L; } return l; }
function climbUpdate(dt){
  tickHunger(dt,3);   // climbing is HUNGRY work
  if(CLIMB.prog>=100){ scene='mountains'; MTN.climbed=true; P.x=750; P.y=975; banner('🏔 The summit! Wind, stone… and wolves at a cave mouth.'); return; }
  if(CLIMB.fall){ CLIMB.prog-=dt*0.14;
    if(CLIMB.prog<=0){ scene='mountains'; P.x=750; P.y=690; hurtPlayer(4,'You fell from the cliff!');
      banner('💥 THUD. The mountain is patient — climb ledge to ledge and REST on the shelves.'); }
    return; }
  const holding=swp.active && swp.reelHold;
  if(holding){ CLIMB.prog+=dt*0.018; CLIMB.grip-=dt*0.03;
    if(CLIMB.grip<=0){ CLIMB.fall=true; banner('🫳 Your grip GIVES OUT—'); } }
  else { const ledge=nearestLedgeBelow(CLIMB.prog);
    if(CLIMB.prog>ledge+0.5) CLIMB.prog=Math.max(ledge, CLIMB.prog-dt*0.05);   // ease back down to the shelf
    else CLIMB.grip=Math.min(100, CLIMB.grip+dt*0.05); }                        // resting on a ledge: grip refills
  if(CLIMB.prog>=100){ scene='mountains'; MTN.climbed=true; P.x=750; P.y=975; banner('🏔 The summit! Wind, stone… and wolves at a cave mouth.'); }
}
function mountainsUpdate(dt){
  if(scene!=='mountains' && scene!=='cave') return;
  mtnInit();
  const T=MTN.troll;
  if(scene==='mountains'){
    // wolves
    for(const pk of MTN.packs){
      const alive=packAlive(pk);
      if(alive===0){ if(!pk.cleared){ pk.cleared=true;
          if(pk===MTN.packs[0]){ banner('🐺 The pack is down! Someone is watching from the trees…'); }
          else { banner('🐺 The cave guard-pack falls! Small birds flutter down to the plateau…'); birdsSpawn(3); } }
        continue; }
      if(alive===1 && !pk.cleared){
        pk.lastOneT+=dt;
        if(pk.lastOneT>5000){
          for(const w of pk.wolves){ w.alive=true; w.hp=w.maxhp; w.showBar=true; }
          pk.lastOneT=0;
          banner('🐺 AWOOOO! The last wolf HOWLS — the pack rises again! Kill them ALL, fast!');
        }
      } else pk.lastOneT=0;
      // PACK TACTICS: only a couple lunge at once — the rest FLANK, circling just out of reach,
      // and the attackers rotate. No more standing in one spot and smashing the whole clump.
      const hunters=pk.wolves.filter(w=>w.alive && w.hurtT<=0);
      const engaged=hunters.some(w=>Math.hypot(P.x-w.x,P.y-w.y)<260);
      pk.rotT+=dt; if(pk.rotT>2600){ pk.rotT=0; pk.shift++; }
      const byDist=hunters.slice().sort((a,b)=>Math.hypot(P.x-a.x,P.y-a.y)-Math.hypot(P.x-b.x,P.y-b.y));
      const n=Math.max(1,byDist.length);
      const attackers=new Set([byDist[pk.shift%n], byDist[(pk.shift+1)%n]]);
      let ci=0;
      for(const w of pk.wolves){ if(!w.alive) continue;
        if(w.hurtT>0){ w.hurtT--; continue; }
        const d=Math.hypot(P.x-w.x,P.y-w.y);
        if(d<260 && engaged && !blocked()){
          const a=Math.atan2(P.y-w.y,P.x-w.x);
          if(attackers.has(w)){ w.x+=Math.cos(a)*1.85; w.y+=Math.sin(a)*1.85; w.dir=a;
            if(d<34 && w.atkT<=0){ hurtPlayer(2,'Wolf fangs find you.'); w.atkT=60; } }
          else {   // flankers: slide around a wide circle, waiting for their turn
            const ring=Math.atan2(w.y-P.y,w.x-P.x)+0.02*(ci%2?1:-1)*dt/16;
            const tx=P.x+Math.cos(ring)*135, ty=P.y+Math.sin(ring)*135;
            const da=Math.atan2(ty-w.y,tx-w.x);
            if(Math.hypot(tx-w.x,ty-w.y)>6){ w.x+=Math.cos(da)*1.3; w.y+=Math.sin(da)*1.3; }
            w.dir=a; ci++;
          }
        }
        else { w.t+=dt; if(w.t>1900){ w.t=0; w.dir=Math.random()*7; } w.x+=Math.cos(w.dir)*.5; w.y+=Math.sin(w.dir)*.5; }
        if(w.atkT>0) w.atkT--;
      }
    }
    // birds wander
    for(const b of MTN.birds){ b.t+=dt; if(b.t>1500){ b.t=0; b.dir=Math.random()*7; } b.x+=Math.cos(b.dir)*.4; b.y+=Math.sin(b.dir)*.4; }
    // mountain berries
    for(const b of MTN.mbushes){
      if(b.taken){ b.respawn-=dt; if(b.respawn<=0) b.taken=false; continue; }
      if(Math.hypot(b.x-P.x,b.y-P.y)<30){ b.taken=true; b.respawn=25000;
        const id=b.type==='blue'?'item_blueberry':'item_red_berry';
        P.inv[id]=(P.inv[id]||0)+1;
        addFloat(P.x,P.y-34,b.type==='blue'?'+🫐':'+🔴',b.type==='blue'?'#7ea8d6':'#e05545',17);
        banner(b.type==='blue'?'🫐 Blueberry into the satchel':'🔴 Red berries into the satchel. You know the rule.'); }
    }
    // the troll OUTSIDE (the dawn lure)
    if(T.outside && !T.stone){
      T.t+=dt;
      if(!T.stunned){
        const a=Math.atan2(P.y-T.y,P.x-T.x); T.dir=a;
        const d=Math.hypot(P.x-T.x,P.y-T.y);
        if(d>60){ T.x+=Math.cos(a)*0.8; T.y+=Math.sin(a)*0.8; }
        if(T.t>3000){ T.stunned=true; T.t=0; banner('☀️ The sunlight! The troll staggers, shielding its eyes — CLIMB ITS BACK!'); }
      } else if(T.mounted && T.t>1200){
        // waiting for the SMASH tap (context button)
      }
    }
  }
  // Bog follows once freed — through the cave, down the mountain, all the way home
  if(MTN.bog.escort && (scene==='cave'||scene==='mountains')){
    const d=Math.hypot(P.x-MTN.bog.x,P.y-MTN.bog.y);
    if(d>46){ const a=Math.atan2(P.y-MTN.bog.y,P.x-MTN.bog.x); MTN.bog.x+=Math.cos(a)*Math.min(2.4,d*0.06); MTN.bog.y+=Math.sin(a)*Math.min(2.4,d*0.06); }
    if(d>240){ MTN.bog.x=P.x-30; MTN.bog.y=P.y; }   // scene changes: he catches up
  }
  if(scene==='cave'){
    if(T.alive && !T.dawn){
      T.dawnT-=dt;
      if(T.dawnT<=0){ T.dawn=true; banner('🌅 DAWN spills through the cave mouth! LURE HIM OUT — run for the entrance!'); }
      // troll hunts by sound in the dark
      T.t+=dt;
      const a=Math.atan2(P.y-T.y,P.x-T.x); T.dir=a;
      const d=Math.hypot(P.x-T.x,P.y-T.y);
      if(T.state==='lurk'){ if(d<420){ T.state='chase'; } }
      else if(T.state==='chase'){
        if(d>70){ T.x+=Math.cos(a)*0.95; T.y+=Math.sin(a)*0.95; }
        if(d<95 && T.t>2400){ T.t=0; T.state='windup'; }
      } else if(T.state==='windup'){
        if(T.t>700){ T.t=0; T.state='chase';
          if(Math.hypot(P.x-T.x,P.y-T.y)<95) hurtPlayer(3,'The troll’s fist falls like a cellar door.');
        }
      }
    }
    if(T.dawn && T.alive && !T.outside){
      // follows you out — leaving the cave brings him with you (handled on exit)
      const a=Math.atan2(P.y-T.y,P.x-T.x); T.dir=a;
      const d=Math.hypot(P.x-T.x,P.y-T.y);
      if(d>70){ T.x+=Math.cos(a)*1.05; T.y+=Math.sin(a)*1.05; }
    }
  }
}
function enterCave(){
  scene='cave'; P.x=430; P.y=430;
  if(MTN.troll.alive && !MTN.troll.dawn) banner('🕳 Pitch dark. Something ENORMOUS breathes in here. Outlast it until dawn…');
  else if(MTN.troll.stone && !MTN.cave.fireLit) banner('🕳 Too dark to see much. You feel driftwood, flint… materials. If only you had fire.');
}
function leaveCave(){
  const T=MTN.troll;
  scene='mountains'; P.x=750; P.y=1105;
  if(T.alive && T.dawn && !T.outside){ T.outside=true; T.stunned=false; T.t=0; T.x=750; T.y=1160; banner('🌅 The troll bursts out after you — into the RISING SUN!'); }
}
function trollSmashFinish(){
  const T=MTN.troll;
  T.stone=true; T.alive=false;
  addFloat(T.x,T.y-60,'💥 CRACK!','#ffd75a',26);
  banner('🗿 One thunderous blow — the troll turns to STONE in the morning light!');
  setTimeout(()=>{ banner('…From deep inside the dark cave, something GROANS. A voice? Better get some light in there.'); },2600);
}
function freeBog(){
  if(MTN.bog.escort) return;
  MTN.bog.escort=true; MTN.bog.x=P.x+30; MTN.bog.y=P.y;
  banner('🪢 You cut the ropes! Bog, hoarse: “…get Bog HOME, warrior. Bog follows you anywhere — ESPECIALLY away from here.”');
}
function fireGameStart(where){
  MTN.fire.game={ t:0, hits:0, where };
  banner('🔥 Watch the spark meter — tap 🔥 when it glows in the HOT zone! 3 good strikes.');
}
function fireGameTap(){
  const g=MTN.fire.game; if(!g) return;
  const pos=(Math.sin(performance.now()/420)+1)/2;   // 0..1 ping-pong — same clock the meter draws with
  if(pos>0.38 && pos<0.62){
    g.hits++; addFloat(P.x,P.y-34,'✨ '+g.hits+'/3','#ffb347',18);
    if(g.hits>=3){
      if(g.where==='strax'){ MTN.fire.learned=true; MTN.fire.game=null; banner('🔥 FIRE! Strax nods once. “Now you carry warmth in your hands, small one.” (Fire-making learned!)'); }
      else { MTN.cave.fireLit=true; MTN.fire.game=null; MTN.bog.found=true; banner('🔥 The fire catches — the cave GLITTERS with treasure… and someone is TIED UP beside the hoard. BOG!'); }
    }
  } else banner(MTN.fire.learned||g.where==='strax' ? '🔥 Too cold — strike when the spark glows HOT!' : '🔥 Strax: “Patience. HOT means hot.”');
}
function gatherTreasure(){
  if(MTN.cave.treasure) return;
  MTN.cave.treasure=true;
  P.coins+=400; addFloat(P.x,P.y-36,'+400 🪙','#ffd977',24);
  P.weapons.hammer=true; P.inv.item_hammer=1;
  banner('💰 The chest creaks open: +400 coins… and a HAMMER of troll-forged star-iron! (Show Modo!)');
}

// ---------- QUESTS COME FROM PEOPLE ----------
// EVERY quest offer is delivered face to face: the giver leaves their post, crosses
// the village to wherever you are, and speaks. People, not screen banners.
let giverWalk=null;               // {npcId,x,y,spoke,returning}
const giverWalkDone={};           // questId → already delivered in person
function giverHome(id){
  const n=NPCS.find(x=>x.id===id); if(!n || n.raw.scene==='mountains') return null;
  if(n.raw.building) return {x:n.raw.building.x, y:n.raw.building.y+72};   // steps out of the shop door
  return {x:n.raw.pos.x, y:Math.min(H-60,n.raw.pos.y+40)};
}
function giverWalkUpdate(dt){
  if(scene!=='village') return;
  const qid=questState.currentId, giverId=Quests.giverId();
  if(questState.stage==='offer' && giverId && !giverWalkDone[qid]){
    if(!giverWalk || giverWalk.npcId!==giverId){ const h=giverHome(giverId); if(!h) return; giverWalk={npcId:giverId,x:h.x,y:h.y,spoke:false,returning:false}; }
    if(dialogOpen) return;
    const d=Math.hypot(P.x-giverWalk.x,P.y-giverWalk.y);
    if(d>60){ const a=Math.atan2(P.y-giverWalk.y,P.x-giverWalk.x); giverWalk.x+=Math.cos(a)*1.8*(dt/16); giverWalk.y+=Math.sin(a)*1.8*(dt/16); }
    else if(!giverWalk.spoke){ giverWalk.spoke=true; giverWalkDone[qid]=true; giverWalk.returning=true; openDialog(NPCS.find(n=>n.id===giverId)); }
  } else if(giverWalk && !dialogOpen){
    giverWalk.returning=true;
    const h=giverHome(giverWalk.npcId); if(!h){ giverWalk=null; return; }
    const d=Math.hypot(h.x-giverWalk.x,h.y-giverWalk.y);
    if(d>10){ const a=Math.atan2(h.y-giverWalk.y,h.x-giverWalk.x); giverWalk.x+=Math.cos(a)*1.8*(dt/16); giverWalk.y+=Math.sin(a)*1.8*(dt/16); }
    else giverWalk=null;
  }
}

// ---------- ERIK'S SHIELD TRAINING (quest 5) ----------
let spar=null;
function spawnSpar(){ spar={ x:1000, y:1240, dir:0, state:'circle', t:0 }; }
const SPAR_TIPS=[
  "Modo: HOLD the attack button — don’t tap it, HOLD it! Holding = shield up!",
  "Modo: You let go too soon! Keep holding until my swing bounces off.",
  "Modo: Watch my wind-up — when I rear back, press and HOLD. The ring means your shield is up!"];
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
        if(P.shieldUp){
          const r=Quests.emit('block',{target:'training_modo'});
          banner(r.banner ?? '🛡️ Block!'); addFloat(P.x,P.y-36,'🛡️ BLOCK!','#7ed67e',20);
        } else {
          hurtPlayer(1,'Modo’s wooden sword stings your pride.');
          banner(SPAR_TIPS[Math.floor(Math.random()*SPAR_TIPS.length)]);
        }
      }
    }
  } else if(c.state==='swing'){ if(c.t>700){ c.t=0; c.state='circle'; } }
}

// ---------- FISHING SCENE RENDERER ----------
function drawFishing(){
  // open water
  const grd=ctx.createLinearGradient(0,0,0,vh);
  grd.addColorStop(0,'#2b5561'); grd.addColorStop(1,'#1d3b45');
  ctx.fillStyle=grd; ctx.fillRect(0,0,vw,vh);
  ctx.strokeStyle='rgba(210,230,240,.16)'; ctx.lineWidth=2;
  for(let i=0;i<6;i++){ ctx.beginPath(); ctx.ellipse((i*173+((performance.now()/40)%173))%vw, 60+i*(vh/6), 34,8,0,0,7); ctx.stroke(); }
  const bx=vw/2, by=vh*0.62;
  // the boat
  ctx.fillStyle='#6b4a26'; ctx.beginPath(); ctx.moveTo(bx-95,by); ctx.quadraticCurveTo(bx,by+52,bx+95,by); ctx.lineTo(bx+70,by-16); ctx.lineTo(bx-70,by-16); ctx.closePath(); ctx.fill();
  ctx.fillStyle='#8a6d38'; ctx.fillRect(bx-70,by-16,140,7);
  // Bog & you
  drawPerson(bx-38, by-28, 0, {hair:'#555',outfit:'#3a6b62',skin:'#e0b088'}, false, false);
  drawPerson(bx+30, by-28, 0, AVATARS[chosen<0?0:chosen], false, false);
  // line & bobber
  if(fish.state!=='idle'){
    const fx=bx+95+60, fy=by-70+Math.sin(performance.now()/300)*6;
    ctx.strokeStyle='rgba(240,240,240,.5)'; ctx.lineWidth=1.5;
    ctx.beginPath(); ctx.moveTo(bx+42,by-40); ctx.quadraticCurveTo(bx+90,by-90,fx,fy); ctx.stroke();
    ctx.fillStyle= fish.state==='bite'||fish.state==='reeling' ? '#ff5545' : '#e8e0c8';
    ctx.beginPath(); ctx.arc(fx,fy,fish.state==='waiting'?5:7,0,7); ctx.fill();
    if(fish.state==='bite'){ ctx.font='bold 20px Georgia'; ctx.textAlign='center'; ctx.fillStyle='#ffd75a'; ctx.fillText('❗', fx, fy-16); }
  }
  // tension bar while reeling
  if(fish.state==='reeling'){
    // VERTICAL tension bar on the LEFT — banners at the top never cover it
    const h=Math.min(300,vh-170), x=30, y0=(vh-h)/2, z=HOOKS[fish.hook]||HOOKS.basic;
    ctx.fillStyle='rgba(10,8,5,.8)'; rr(ctx,x-14,y0-34,64,h+64,10);
    ctx.fillStyle='rgba(255,255,255,.14)'; rr(ctx,x,y0,18,h,7);
    ctx.fillStyle='rgba(120,230,140,.4)'; rr(ctx,x,y0+h*(1-z.hi/100),18,h*((z.hi-z.lo)/100),7);   // the green band (tiny with the fine hook!)
    const inZ=fish.tension>z.lo&&fish.tension<z.hi;
    ctx.fillStyle= inZ? '#7ed67e' : '#e0b34a';
    ctx.beginPath(); ctx.arc(x+9, y0+h*(1-fish.tension/100), 10, 0, 7); ctx.fill();
    ctx.font='bold 12px Georgia'; ctx.textAlign='left'; ctx.fillStyle='#e8d9a8'; ctx.fillText('🎣', x-4, y0-14);
    ctx.fillStyle= inZ? '#9fe89f' : 'rgba(240,230,200,.65)'; ctx.font='11.5px Georgia';
    ctx.fillText(inZ? 'in the green — keep it here!' : 'HOLD to reel • release to ease', x+34, y0+h*(1-fish.tension/100)+4);
  }
  // catch tally
  ctx.font='bold 14px Georgia'; ctx.textAlign='left'; ctx.fillStyle='#e8d9a8';
  ctx.fillText('🛶 aboard: '+fish.catches.length, 18, vh-18);
  for(const f of floats){ ctx.globalAlpha=Math.min(1,f.t/22); ctx.font='bold '+f.size+'px Georgia'; ctx.textAlign='center';
    ctx.strokeStyle='rgba(0,0,0,.7)'; ctx.lineWidth=3; ctx.strokeText(f.txt,bx,by-70);
    ctx.fillStyle=f.col; ctx.fillText(f.txt,bx,by-70); ctx.globalAlpha=1; }
}

// ---------- MOUNTAINS RENDERER ----------
function drawMountains(){
  const camX=Math.max(0,Math.min(MW-vw,P.x-vw/2)), camY=Math.max(0,Math.min(MH-vh,P.y-vh/2));
  const grd=ctx.createLinearGradient(0,-camY,0,MH-camY);
  grd.addColorStop(0,'#3a4234'); grd.addColorStop(.55,'#4a4a44'); grd.addColorStop(1,'#565258');
  ctx.fillStyle=grd; ctx.fillRect(0,0,vw,vh);
  ctx.save(); ctx.translate(-camX,-camY);
  // trail from the north entrance
  ctx.strokeStyle='#5c5546'; ctx.lineWidth=40; ctx.lineCap='round';
  ctx.beginPath(); ctx.moveTo(750,20); ctx.quadraticCurveTo(760,380,750,690); ctx.stroke();
  // rocks
  for(const r0 of MTN.rocks){ ctx.fillStyle='#5e5a52'; ctx.beginPath(); ctx.arc(r0.x,r0.y,r0.r,0,7); ctx.fill();
    ctx.fillStyle='#6e6a62'; ctx.beginPath(); ctx.arc(r0.x-r0.r*.25,r0.y-r0.r*.3,r0.r*.55,0,7); ctx.fill(); }
  // berry bushes
  for(const b of MTN.mbushes){ if(b.taken) continue;
    ctx.fillStyle='#2c4a22'; ctx.beginPath(); ctx.arc(b.x,b.y,15,0,7); ctx.arc(b.x-11,b.y+5,11,0,7); ctx.arc(b.x+11,b.y+5,11,0,7); ctx.fill();
    ctx.fillStyle=b.type==='blue'?'#5b8fd4':'#d43a3a';
    for(let i=0;i<5;i++){ ctx.beginPath(); ctx.arc(b.x-9+i*4.5,b.y-3+((i%2)*7),3,0,7); ctx.fill(); } }
  // Strax's camp (after the first pack)
  if(MTN.packs[0] && MTN.packs[0].cleared){
    const n=NPCS.find(x=>x.id==='npc_strax');
    ctx.fillStyle='#6b5537'; ctx.beginPath(); ctx.moveTo(352,346); ctx.lineTo(392,296); ctx.lineTo(432,346); ctx.closePath(); ctx.fill();
    if(MTN.fire.learned){ ctx.fillStyle='#ff9b3b'; ctx.beginPath(); ctx.arc(444,344,7+2*Math.sin(performance.now()/120),0,7); ctx.fill(); }
    drawPerson(n.x,n.y,0,{hair:'#777',outfit:n.col,skin:'#dba777'},true, Math.hypot(n.x-P.x,n.y-P.y)<70);
  }
  // the CLIFF band
  ctx.fillStyle='#3f3b38'; ctx.fillRect(0,700,MW,260);
  ctx.fillStyle='#4c4744'; for(let i=0;i<30;i++){ ctx.fillRect((i*61)%MW, 706+(i*37)%236, 34, 12); }
  ctx.strokeStyle='rgba(255,217,119,.5)'; ctx.lineWidth=2; ctx.strokeRect(690,700,120,260);
  ctx.fillStyle='#e8d9a8'; ctx.font='13px Georgia'; ctx.textAlign='center'; ctx.fillText('🧗', 750, 736);
  // cave mouth on the summit plateau
  ctx.fillStyle='#191512'; ctx.beginPath(); ctx.ellipse(750,1130,84,58,0,Math.PI,0); ctx.fill();
  ctx.fillStyle='#26201a'; ctx.beginPath(); ctx.ellipse(750,1132,60,40,0,Math.PI,0); ctx.fill();
  // wolves
  for(const pk of MTN.packs) for(const w of pk.wolves){ if(!w.alive) continue;
    ctx.save(); if(w.hurtT>0 && w.hurtT%4<2) ctx.globalAlpha=.5;
    ctx.fillStyle='#565d66'; ctx.beginPath(); ctx.ellipse(w.x,w.y,15,9,Math.atan2(Math.sin(w.dir),Math.cos(w.dir)),0,7); ctx.fill();
    const hx=w.x+Math.cos(w.dir)*14, hy=w.y+Math.sin(w.dir)*14;
    ctx.beginPath(); ctx.arc(hx,hy,6.5,0,7); ctx.fill();
    ctx.fillStyle='#3a4048'; ctx.beginPath(); ctx.moveTo(hx-3,hy-5); ctx.lineTo(hx-1,hy-11); ctx.lineTo(hx+2,hy-5); ctx.fill();
    ctx.fillStyle='#ffd42a'; ctx.fillRect(hx+2,hy-2,2.4,2.4);
    ctx.restore();
    if(w.showBar){ ctx.fillStyle='#1c150e'; ctx.fillRect(w.x-16,w.y-24,32,5); ctx.fillStyle='#d43a3a'; ctx.fillRect(w.x-15,w.y-23,30*(w.hp/w.maxhp),3); } }
  // snack birds
  for(const b of MTN.birds){ ctx.fillStyle='#a8743f'; ctx.beginPath(); ctx.ellipse(b.x,b.y,7,5,0,0,7); ctx.fill();
    ctx.fillStyle='#c98f52'; ctx.beginPath(); ctx.arc(b.x+5,b.y-3,3,0,7); ctx.fill(); }
  // the troll, outside — or his statue, forever
  const T=MTN.troll;
  if(T.outside || T.stone){
    ctx.save();
    if(T.stone) ctx.filter='grayscale(1)';
    ctx.fillStyle= T.stone? '#8a877f' : '#5c6b4a';
    ctx.beginPath(); ctx.ellipse(T.x,T.y+8,34,44,0,0,7); ctx.fill();
    ctx.beginPath(); ctx.arc(T.x,T.y-42,22,0,7); ctx.fill();
    ctx.fillStyle= T.stone? '#75726b' : '#4a583c';
    ctx.beginPath(); ctx.arc(T.x-26,T.y-6,13,0,7); ctx.fill(); ctx.beginPath(); ctx.arc(T.x+26,T.y-6,13,0,7); ctx.fill();
    if(!T.stone){ ctx.fillStyle='#ffd42a'; ctx.fillRect(T.x-8,T.y-46,5,5); ctx.fillRect(T.x+4,T.y-46,5,5); }
    if(T.stunned && !T.stone){ ctx.fillStyle='#ffd75a'; ctx.font='bold 13px Georgia'; ctx.textAlign='center'; ctx.fillText(T.mounted?'💥 SMASH!':'🧗 CLIMB!', T.x, T.y-76); }
    ctx.restore();
  }
  // Bog trailing you down the mountain
  if(MTN.bog.escort){ drawPerson(MTN.bog.x,MTN.bog.y,0,{hair:'#555',outfit:'#3a6b62',skin:'#dba777'},false,false);
    ctx.fillStyle='#9fd6e8'; ctx.font='10.5px Georgia'; ctx.textAlign='center'; ctx.fillText('Bog', MTN.bog.x, MTN.bog.y-30); }
  // player + effects
  if(pot.t>0 && pot.type){ const col = pot.type==='potion_strength'? '255,140,60' : pot.type==='potion_speed'? '90,220,255' : '200,200,215';
    ctx.strokeStyle='rgba('+col+',.6)'; ctx.lineWidth=3; ctx.beginPath(); ctx.arc(P.x,P.y,26,0,7); ctx.stroke(); }
  if(P.shieldUp){ ctx.strokeStyle='rgba(200,215,235,.9)'; ctx.lineWidth=3; ctx.beginPath(); ctx.arc(P.x,P.y,34,0,7); ctx.stroke(); }
  ctx.save(); if(P.hurtT>0 && P.hurtT%6<3) ctx.globalAlpha=.45;
  drawPerson(P.x,P.y,P.dir,AVATARS[chosen<0?0:chosen],false,false);
  ctx.restore();
  if(P.slashT>0 && !P.smashT){ ctx.strokeStyle='rgba(240,230,200,'+(P.slashT/14*.9)+')'; ctx.lineWidth=5;
    ctx.beginPath(); ctx.arc(P.x,P.y,44,P.dir-.8,P.dir+.8); ctx.stroke(); }
  if(P.smashT>0){ const pr=(P.smashT0-P.smashT)/P.smashT0;
    ctx.strokeStyle='rgba(255,190,90,'+(1-pr)*.9+')'; ctx.lineWidth=7-pr*5;
    ctx.beginPath(); ctx.arc(P.x,P.y,25+pr*(P.smashR-20),0,7); ctx.stroke(); }
  for(const f of floats){ ctx.globalAlpha=Math.min(1,f.t/22); ctx.font='bold '+f.size+'px Georgia'; ctx.textAlign='center';
    ctx.strokeStyle='rgba(0,0,0,.7)'; ctx.lineWidth=3; ctx.strokeText(f.txt,f.x,f.y);
    ctx.fillStyle=f.col; ctx.fillText(f.txt,f.x,f.y); ctx.globalAlpha=1; }
  ctx.restore();
  // fire minigame overlay (Strax's lesson happens outdoors)
  if(MTN.fire.game){ drawFireGame(); }
}
// ---------- THE CLIMB RENDERER — a real scene: watch yourself climb ----------
function drawClimb(){
  const grd=ctx.createLinearGradient(0,0,0,vh);
  grd.addColorStop(0,'#6f7d8c'); grd.addColorStop(.25,'#4c4744'); grd.addColorStop(1,'#38342f');
  ctx.fillStyle=grd; ctx.fillRect(0,0,vw,vh);
  const cx=vw/2, wallW=Math.min(360,vw*.5);
  ctx.fillStyle='#43403b'; ctx.fillRect(cx-wallW/2,0,wallW,vh);
  ctx.fillStyle='#4c4744'; for(let i=0;i<34;i++){ ctx.fillRect(cx-wallW/2+((i*53)%Math.max(1,wallW-30)), (i*89)%vh, 30, 10); }
  const topY=70, botY=vh-90, yOf=p=>botY-(botY-topY)*(p/100);
  // the LEDGES — resting shelves
  for(const L of LEDGES.concat([100])){
    const y=yOf(L);
    ctx.fillStyle= L===100? '#5d7a4a' : '#2c2822'; ctx.fillRect(cx-wallW/2-14, y, wallW+28, 9);
    ctx.fillStyle='#57534a'; ctx.fillRect(cx-wallW/2-14, y-3, wallW+28, 4);
    if(L!==100){ ctx.fillStyle='rgba(232,217,168,.55)'; ctx.font='10.5px Georgia'; ctx.textAlign='left'; ctx.fillText('ledge — rest here', cx+wallW/2+20, y+4); }
  }
  ctx.fillStyle='#8a97a8'; ctx.font='bold 12px Georgia'; ctx.textAlign='center'; ctx.fillText('☁️ the summit', cx, topY-26);
  // YOU, on the wall
  const py=yOf(Math.max(0,CLIMB.prog));
  const holding=swp.active&&swp.reelHold;
  const sway= holding? Math.sin(performance.now()/130)*3 : 0;
  ctx.save();
  if(CLIMB.fall){ ctx.translate(cx,py); ctx.rotate(Math.sin(performance.now()/70)*0.5); ctx.translate(-cx,-py); }
  drawPerson(cx+sway, py-10, 0, AVATARS[chosen<0?0:chosen], false, false);
  ctx.restore();
  if(CLIMB.fall){ ctx.fillStyle='#ff8f7a'; ctx.font='bold 15px Georgia'; ctx.textAlign='center'; ctx.fillText('FALLING!', cx, py-50); }
  else if(!holding && Math.abs(CLIMB.prog-nearestLedgeBelow(CLIMB.prog))<0.6){
    ctx.fillStyle='#9fe89f'; ctx.font='11.5px Georgia'; ctx.textAlign='center'; ctx.fillText('resting… grip refills', cx, py-44); }
  // VERTICAL GRIP BAR on the left — banners at the top never cover it
  const h=Math.min(300,vh-170), x=26, y0=(vh-h)/2;
  ctx.fillStyle='rgba(10,8,5,.8)'; rr(ctx,x-12,y0-34,58,h+62,10);
  ctx.fillStyle='rgba(255,255,255,.14)'; rr(ctx,x,y0,16,h,7);
  ctx.fillStyle= CLIMB.grip>30? '#7ed67e' : '#e05545';
  const gh=h*(Math.max(0,CLIMB.grip)/100); rr(ctx,x,y0+h-gh,16,Math.max(4,gh),7);
  ctx.fillStyle='#e8d9a8'; ctx.font='bold 12px Georgia'; ctx.textAlign='left'; ctx.fillText('✊', x-2, y0-12);
  ctx.fillStyle='rgba(240,230,200,.6)'; ctx.font='10.5px Georgia'; ctx.fillText('grip', x+2, y0+h+18);
}
function drawFireGame(){
  // VERTICAL spark meter on the LEFT edge — banners above never cover it,
  // and the HOT zone is unmistakable: it PULSES and shouts NOW!
  const h=Math.min(300,vh-170), x=30, y0=(vh-h)/2, g=MTN.fire.game;
  const pos=(Math.sin(performance.now()/420)+1)/2;
  const hot = pos>0.38 && pos<0.62;
  ctx.fillStyle='rgba(10,8,5,.8)'; rr(ctx,x-14,y0-34,64,h+64,10);
  ctx.fillStyle='rgba(255,255,255,.14)'; rr(ctx,x,y0,18,h,7);
  ctx.fillStyle= hot? 'rgba(255,90,30,'+(0.75+0.25*Math.sin(performance.now()/90))+')' : 'rgba(255,120,40,.45)';
  rr(ctx,x,y0+h*0.38,18,h*0.24,7);
  ctx.fillStyle= hot? '#ffe08a' : '#ffb347';
  ctx.beginPath(); ctx.arc(x+9,y0+h*pos,hot?11:8,0,7); ctx.fill();
  if(hot){ ctx.strokeStyle='rgba(255,225,130,.9)'; ctx.lineWidth=3; ctx.beginPath(); ctx.arc(x+9,y0+h*pos,15,0,7); ctx.stroke(); }
  ctx.font='bold 13px Georgia'; ctx.textAlign='left';
  ctx.fillStyle='#e8d9a8'; ctx.fillText('🔥 '+g.hits+'/3', x-6, y0-14);
  ctx.fillStyle= hot? '#ffe08a' : 'rgba(240,230,200,.65)'; ctx.font= hot? 'bold 15px Georgia' : '11.5px Georgia';
  ctx.fillText(hot? '⚡ NOW!' : 'strike on HOT', x+34, y0+h*pos+4);
}
// ---------- CAVE RENDERER ----------
function drawCave(){
  const T=MTN.troll;
  const lit=MTN.cave.fireLit;
  // the cave always FITS the screen — you never lose sight of yourself in the dark
  const cs=Math.min(1,(vw-16)/880,(vh-56)/520);
  const ox=(vw-880*cs)/2, oy=Math.max(20,(vh-520*cs)/2);
  ctx.fillStyle= lit? '#241a10' : '#060505'; ctx.fillRect(0,0,vw,vh);
  ctx.save(); ctx.translate(ox,oy); ctx.scale(cs,cs);
  if(lit){
    ctx.fillStyle='#3a2c1c'; ctx.fillRect(0,0,880,520);
    ctx.fillStyle='#ff9b3b'; ctx.beginPath(); ctx.arc(450,300,10+3*Math.sin(performance.now()/120),0,7); ctx.fill();
    // TREASURE everywhere
    ctx.font='22px Georgia'; ctx.textAlign='center';
    const piles=[[120,340],[220,120],[700,380],[780,220],[560,120],[340,420],[640,470]];
    for(const q of piles){ ctx.fillText('💰', q[0], q[1]); }
    // the HOARD CHEST — walk to it and OPEN it; nothing collects itself
    if(!MTN.cave.treasure){
      ctx.fillStyle='#6b4a26'; rr(ctx,CHEST.x-26,CHEST.y-18,52,34,6);
      ctx.fillStyle='#8a6d38'; ctx.fillRect(CHEST.x-26,CHEST.y-6,52,5);
      ctx.fillStyle='#ffd53e'; ctx.fillRect(CHEST.x-4,CHEST.y-8,8,10);
      ctx.font='22px Georgia'; ctx.fillText('🔨', CHEST.x+42, CHEST.y+4);
      if(Math.hypot(P.x-CHEST.x,P.y-CHEST.y)<70){ ctx.fillStyle='#ffd977'; ctx.font='12px Georgia'; ctx.fillText('💰 open the chest', CHEST.x, CHEST.y-32); }
    }
    if(MTN.bog.found && !MTN.bog.escort){
      drawPerson(700,300,0,{hair:'#555',outfit:'#3a6b62',skin:'#dba777'},false, Math.hypot(700-P.x,300-P.y)<70);
      ctx.strokeStyle='#a87c3f'; ctx.lineWidth=3; ctx.strokeRect(686,282,28,36);   // the ropes
      ctx.fillStyle='#ffd977'; ctx.font='11px Georgia'; ctx.textAlign='center'; ctx.fillText('mmmph!!', 700, 262);
    } else if(MTN.bog.escort && scene==='cave'){
      drawPerson(MTN.bog.x,MTN.bog.y,0,{hair:'#555',outfit:'#3a6b62',skin:'#dba777'},false,false);
    }
    ctx.fillStyle='rgba(255,190,90,.12)'; ctx.beginPath(); ctx.arc(450,300,240,0,7); ctx.fill();
  } else {
    ctx.strokeStyle='rgba(120,130,140,.35)'; ctx.lineWidth=2; ctx.strokeRect(4,4,872,512);   // walls, barely
    if(T.dawn){ ctx.fillStyle='rgba(255,220,140,.25)'; ctx.beginPath(); ctx.ellipse(430,510,120,50,0,Math.PI,0); ctx.fill(); }
    // material spots shimmer faintly once he's stone
    if(T.stone){ ctx.font='15px Georgia'; ctx.textAlign='center'; ctx.fillStyle='rgba(190,190,200,.4)';
      for(const m of CAVE_MATS){ if(!m.found) ctx.fillText('✦', m.x, m.y); } }
  }
  // door glow
  ctx.fillStyle= T.dawn&&!lit? 'rgba(255,220,140,.5)' : 'rgba(150,160,175,.25)';
  ctx.fillRect(350,506,160,10);
  // the TROLL in the dark: an outline with terrible eyes
  if(T.alive){
    ctx.strokeStyle= T.state==='windup'? 'rgba(255,90,70,.9)' : 'rgba(170,180,190,.55)';
    ctx.lineWidth=3;
    ctx.beginPath(); ctx.ellipse(T.x,T.y+8,34,44,0,0,7); ctx.stroke();
    ctx.beginPath(); ctx.arc(T.x,T.y-42,22,0,7); ctx.stroke();
    ctx.fillStyle='#ffd42a'; ctx.fillRect(T.x-8,T.y-46,5,5); ctx.fillRect(T.x+4,T.y-46,5,5);
  }
  // the player: an outline in the dark, real by firelight
  if(lit){ drawPerson(P.x,P.y,P.dir,AVATARS[chosen<0?0:chosen],false,false); }
  else { ctx.strokeStyle='rgba(232,217,168,.8)'; ctx.lineWidth=2;
    ctx.beginPath(); ctx.ellipse(P.x,P.y+4,11,14,0,0,7); ctx.stroke();
    ctx.beginPath(); ctx.arc(P.x,P.y-12,9,0,7); ctx.stroke(); }
  if(P.smashT>0){ const pr=(P.smashT0-P.smashT)/P.smashT0;
    ctx.strokeStyle='rgba(255,190,90,'+(1-pr)*.9+')'; ctx.lineWidth=6-pr*4;
    ctx.beginPath(); ctx.arc(P.x,P.y,25+pr*(P.smashR-20),0,7); ctx.stroke(); }
  for(const f of floats){ ctx.globalAlpha=Math.min(1,f.t/22); ctx.font='bold '+f.size+'px Georgia'; ctx.textAlign='center';
    ctx.strokeStyle='rgba(0,0,0,.7)'; ctx.lineWidth=3; ctx.strokeText(f.txt,f.x,f.y);
    ctx.fillStyle=f.col; ctx.fillText(f.txt,f.x,f.y); ctx.globalAlpha=1; }
  ctx.restore();
  // dawn countdown
  if(T.alive && !T.dawn){
    ctx.fillStyle='#cfd6e8'; ctx.font='bold 13px Georgia'; ctx.textAlign='center';
    ctx.fillText('🌙 until dawn: '+Math.ceil(T.dawnT/1000)+'s — SURVIVE', vw/2, 26);
  }
  if(MTN.fire.game) drawFireGame();
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
  ctx.font='12px Georgia'; ctx.fillStyle='rgba(240,230,200,.5)'; ctx.fillText('🚪 walk here to leave', r.w/2, r.h-26);
  const n=NPCS.find(x=>x.id===scene);
  drawPerson(d.pos.x, d.pos.y, 0, {hair:d.look.hair||'#555',outfit:n.col,skin:'#e0b088'}, n.hat, Math.hypot(d.pos.x-P.x,d.pos.y-P.y)<86);
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
if(location.hash==='#fish'){ chosen=0; P.inv.item_rod=1; P.inv.item_hook_basic=1; P.inv.item_hook_fine=1; questState.flags.flag_bog_rescued=true; startGame(); NPC_ACTIONS.fish_trip(); }
if(location.hash==='#mtn'){ chosen=0; startGame(); questState.completed.push('quest_main_05_shield_training'); Quests.debugJump('quest_main_06_find_bog','active'); scene='mountains'; mtnInit(); P.x=750; P.y=470; }
if(location.hash==='#cave'){ chosen=0; startGame(); scene='cave'; mtnInit(); MTN.troll.dawnT=60000; P.x=430; P.y=430; }
if(location.hash==='#climb'){ chosen=0; startGame(); mtnInit(); startClimb(); }
if(location.hash==='#boat'){ chosen=0; startGame(); startBoatLesson(); }
// ---------- DEV TESTING MENU — preview-only, never part of normal play ----------
// Open via #dev in the URL, or the tiny 🛠 button on the title screen (prototype phase only).
let devBuilt=false;
function buildDevMenu(){
  if(devBuilt) return; devBuilt=true;
  // a small 🛠 chip (bottom-left, always visible) toggles a scrollable panel — works in tiny windows
  const chip=document.createElement('button');
  chip.className='btn ghost'; chip.textContent='🛠';
  chip.style.cssText='position:fixed;left:8px;bottom:46px;z-index:99;width:42px;height:42px;padding:0;border-radius:50%;font-size:17px;margin:0;';
  const dv=document.createElement('div');
  dv.style.cssText='position:fixed;left:8px;bottom:94px;z-index:98;display:flex;flex-direction:column;gap:3px;width:150px;max-height:calc(100% - 140px);overflow-y:auto;background:rgba(10,8,5,.88);padding:6px;border-radius:10px;border:1px solid #57534a;';
  chip.onclick=(e)=>{ e.stopPropagation(); dv.style.display = dv.style.display==='none' ? 'flex' : 'none'; };
  const mk=(label,fn)=>{ const b=document.createElement('button'); b.className='btn ghost';
    b.style.cssText='padding:4px 6px;font-size:10.5px;width:100%;margin:0;'; b.textContent=label;
    b.onclick=(e)=>{e.stopPropagation();fn();banner('🛠 '+label);}; dv.appendChild(b); };
  mk('▶ Q1: goblins', ()=>Quests.debugJump('quest_main_01_goblins'));
  mk('▶ Q2: berries', ()=>Quests.debugJump('quest_main_02_blueberries'));
  mk('▶ Q3: turkeys', ()=>Quests.debugJump('quest_main_03_turkeys'));
  mk('▶ Q4: CHAMPION', ()=>Quests.debugJump('quest_main_04_champion'));
  mk('▶ Q6: TROLL ARC', ()=>{ questState.completed.push('quest_main_05_shield_training'); Quests.debugJump('quest_main_06_find_bog'); });
  mk('jump: mountains', ()=>{ questState.completed.push('quest_main_05_shield_training'); Quests.debugJump('quest_main_06_find_bog','active'); scene='mountains'; mtnInit(); P.x=750; P.y=90; });
  mk('jump: cave (dawn 10s)', ()=>{ scene='cave'; mtnInit(); MTN.troll.alive=true; MTN.troll.stone=false; MTN.troll.dawn=false; MTN.troll.dawnT=10000; P.x=430; P.y=430; });
  mk('jump: THE CLIMB', ()=>{ mtnInit(); startClimb(); });
  mk('jump: boat lesson', ()=>{ startBoatLesson(); });
  mk('+200 coins', ()=>{ P.coins+=200; });
  mk('give sword/bow/shield', ()=>{ P.weapons.sword=true; P.weapons.bow=true; P.arrows+=10; P.hasShield=true; });
  mk('open both shops', ()=>{ questState.flags.flag_dorgan_shop_open=true; questState.flags.flag_erik_turkey_stock=true; });
  mk('give 4 blueberries', ()=>{ P.inv.item_blueberry=(P.inv.item_blueberry||0)+4; });
  mk('heal full', ()=>{ P.hp=P.maxhp; hungerT=0; });
  document.getElementById('app').appendChild(dv);
  document.getElementById('app').appendChild(chip);
}
if(location.hash==='#dev'){ chosen=0; startGame(); buildDevMenu(); }
var devArmed=false;
$('btnDev').onclick=()=>{ devArmed=!devArmed;
  $('btnDev').style.color=devArmed?'#ffd977':'';
  $('btnDev').textContent=devArmed?'🛠 dev tools ON — start the game':'🛠 dev tools'; };

// automated smoke test (temporary home; moves to dev.js in reorg step 9)
if(location.hash==='#test-quests'){
  chosen=0; startGame();
  const R=[], ok=(c,m)=>R.push((c?'✅ PASS':'❌ FAIL')+' — '+m);
  window.onerror=(m,src,l)=>{ const dv=document.createElement('div');
    dv.style.cssText='position:fixed;inset:8px;z-index:99;background:#2a0f0f;color:#ffd9d0;font:11.5px/1.5 monospace;padding:12px;border-radius:8px;overflow:auto;white-space:pre-wrap;';
    dv.textContent='TEST CRASH: '+m+'  @line '+l+'\n\nprogress so far:\n'+R.join('\n');
    document.getElementById('app').appendChild(dv); };
  const chief=NPCS.find(n=>n.id==='npc_chief_bonbottom');
  const dorgan=NPCS.find(n=>n.id==='npc_dorgan');
  const erik=NPCS.find(n=>n.id==='npc_erik');
  const modo=NPCS.find(n=>n.id==='npc_modo');
  ok(AVATARS[0].nm==='Zippy', 'Zippy leads the avatar roster');
  ok(P.coins===10 && P.weapon==='fists' && goblins[0].hp===6 && goblins.length===6, 'start: 10 coins, fists, 6-punch goblins, 6 roaming');
  goblins[0].x=800; goblins[0].y=1230; update(16);
  { const ex=(goblins[0].x-VILLAGE.x)/VILLAGE.rx, ey=(goblins[0].y-VILLAGE.y)/VILLAGE.ry;
    ok(ex*ex+ey*ey>=0.99, 'goblins cannot cross into the village'); }
  goblins[0].x=600; goblins[0].y=420;
  // Q1
  openDialog(chief); while(dialogOpen) advanceDialog();
  goblins.slice(0,5).forEach(g=>hitTarget(g,'gob',99,0));
  ok(questState.stage==='complete', 'quest 1 now needs FIVE goblins');
  openDialog(chief); while(dialogOpen) advanceDialog();
  ok(P.coins===120, 'chief pays 110');
  // Q2 — Dorgan, satchel berries
  Quests.update(2000);
  openDialog(dorgan); while(dialogOpen) advanceDialog();
  P.inv.item_blueberry=4; Quests.update(16);
  ok(questState.stage==='active', '4 blue alone is NOT enough — Dorgan wants 2 red too');
  P.inv.item_red_berry=2; Quests.update(16);
  ok(questState.stage==='complete', '4 blue + 2 red → ready to deliver');
  P.inv.item_blueberry=3; Quests.update(16);
  ok(questState.stage==='active', 'eat a quest berry and progress drops back — they are real items');
  P.inv.item_blueberry=4; Quests.update(16);
  openDialog(dorgan); while(dialogOpen) advanceDialog();
  ok(P.inv.item_blueberry===0 && P.inv.item_red_berry===0 && P.potionRolls.includes('potion_stoneskin'), 'both berry kinds delivered → free Stoneskin');
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
  // SHIELD DECOUPLED: attack-button holds never smash, releases never damage
  swp.active=true; swp.smashOnly=false; swp.reelHold=false; swp.sx=swp.cx=0; swp.sy=swp.cy=0; swp.t0=performance.now()-5000;
  ok(chargeInfo()===null, 'attack-hold no longer charges a smash once you own the shield');
  P.slashT=0; attackRelease(0,0);
  ok(P.slashT===0, 'releasing a long shield-hold deals NO damage — smash lives on 💥 only');
  swp.active=false;
  // Modo now sells everything
  openDialog(modo); ok($('shopBox').children.length===3, 'bow & arrows unlocked after the champion'); while(dialogOpen) advanceDialog();
  // permanent gear never vanishes
  invSel='item_shield'; const sh0=P.inv.item_shield; $('invUse').onclick();
  ok(P.inv.item_shield===sh0, 'Champion’s Shield cannot be consumed — permanent gear');
  invSel=null;
  // Q5 — MODO's shield training
  Quests.update(9000);
  ok(questState.currentId==='quest_main_05_shield_training', 'Modo calls you to train');
  openDialog(modo); ok(dLines[2].includes('PRESS AND HOLD'), 'Modo gives usable HOLD instructions');
  while(dIdx<dLines.length-1) advanceDialog();
  { const go=[...$('shopBox').children].find(x=>x.textContent.includes("Let's do it")); ok(!!go, 'Modo offers Let’s-do-it / come-back-later'); go.click(); }
  ok(questState.stage==='active', 'sparring begins');
  for(let i=0;i<3;i++) Quests.emit('block',{target:'training_modo'});
  ok(questState.stage==='complete', '3 blocks → trained');
  openDialog(modo); while(dialogOpen) advanceDialog();
  // Erik really does stock fishing gear (scrollable shop)
  openDialog(erik);
  { const txts=[...$('shopBox').children].map(b=>b.textContent).join('|');
    ok(txts.includes('Fishing rod') && txts.includes('Basic hook') && txts.includes('Fine hook'), 'Erik stocks rod + both hooks');
    ok(txts.includes('Turkey meat'), 'Erik sells turkey meat too'); }
  while(dialogOpen) advanceDialog();
  ok(Quests.trackerText()==='⛰️ The Chief has news…', 'shield school now leads to the mountains');
  // Q6 — find Bog (a real CHOICE at the chief)
  Quests.update(4100);
  ok(questState.currentId==='quest_main_06_find_bog' && questState.stage==='offer', 'the Chief has a quest: Bog is missing');
  openDialog(chief);
  while(dIdx<dLines.length-1) advanceDialog();
  const later=[...$('shopBox').children].find(b=>b.textContent.includes('prepare'));
  ok(!!later, 'offer ends in a real choice'); later.click();
  ok(questState.stage==='offer', '“come back later” leaves the quest waiting');
  openDialog(chief); while(dIdx<dLines.length-1) advanceDialog();
  [...$('shopBox').children].find(b=>b.textContent.includes('find him')).click();
  ok(questState.stage==='active', 'accepted — south to the mountains');
  // the mountains
  scene='mountains'; mtnInit();
  ok(MTN.packs.length===2 && packAlive(MTN.packs[0])===5, 'two wolf packs of five roam the mountains');
  ok(MTN.packs[0].wolves[0].maxhp===18, 'wolves toughened to 18hp — no one-smash pack wipes');
  // THE CLIMB — a real full-screen scene now
  startClimb(); ok(scene==='climb', 'the climb is a full-screen scene');
  P.hurtT=0; const hpClimb=P.hp; CLIMB.fall=true; CLIMB.prog=0.01; climbUpdate(999);
  ok(scene==='mountains' && P.hp===hpClimb-4, 'grip gone = a FALL to the base, with bruises');
  startClimb(); CLIMB.prog=100; climbUpdate(16);
  ok(scene==='mountains' && MTN.climbed===true && P.y===975, 'topping out lands you on the summit');
  const pk=MTN.packs[0];
  pk.wolves.slice(0,4).forEach(w=>hitTarget(w,'wolf',99,0));
  ok(packAlive(pk)===1, 'four down, one left…');
  mountainsUpdate(5100);
  ok(packAlive(pk)===5, 'the last wolf HOWLS after 5s — the whole pack rises again!');
  pk.wolves.forEach(w=>hitTarget(w,'wolf',99,0));
  mountainsUpdate(16);
  ok(packAlive(pk)===0 && pk.cleared, 'kill them ALL fast and the pack stays down');
  // the troll cannot be hurt by steel
  scene='cave'; MTN.troll.alive=true;
  const th0=999; hitTarget(MTN.troll,'troll',50,0);
  ok(MTN.troll.alive && MTN.troll.hp===th0, 'the troll’s hide shrugs off every blow — only dawn wins');
  // dawn → lure out → climb his back → SMASH
  MTN.troll.dawn=true; leaveCave();
  ok(scene==='mountains' && MTN.troll.outside, 'he follows you out into the rising sun');
  MTN.troll.stunned=true; MTN.troll.mounted=true;
  trollSmashFinish();
  ok(MTN.troll.stone, 'one blow to the head — the troll is STONE');
  ok(!questState.flags.flag_bog_rescued, 'the troll is stone but Bog is still in the dark…');
  // fire reveals Bog, tied by the treasure
  MTN.fire.learned=true; MTN.cave.fireLit=true; MTN.bog.found=true;
  const ct0=P.coins; gatherTreasure();
  ok(P.coins===ct0+400 && P.weapons.hammer===true, 'the hoard: +400 coins and the Troll’s Hammer');
  freeBog();
  ok(MTN.bog.escort===true, 'ropes cut — Bog follows you now');
  scene='mountains'; P.x=750; P.y=20; update(16);
  ok(scene==='village' && questState.flags.flag_bog_rescued===true, 'walking him home completes the rescue — the escort forces the return trip');
  Quests.update(16);
  ok(questState.stage==='complete', 'Bog home → quest complete');
  openDialog(chief); while(dialogOpen) advanceDialog();
  // Q7 — Modo teaches the hammer
  Quests.update(2100);
  ok(questState.currentId==='quest_main_07_hammer', 'Modo wants to see that hammer');
  openDialog(modo); while(dialogOpen) advanceDialog();
  P.weapon='hammer'; P.x=660; P.y=1265;
  for(let i=0;i<3;i++){ P.slashT=0; dummies[0].hp=5; doSmash(4,80,16); }
  ok(questState.stage==='complete', 'three hammer-smashes on the dummies');
  openDialog(modo); while(dialogOpen) advanceDialog();
  // Q8 — Bog's thank-you trip (fishing unlocks only now)
  Quests.update(3500);
  ok(questState.currentId==='quest_main_08_first_catch', 'Bog owes you a boat ride');
  const bog=NPCS.find(n=>n.id==='npc_bog');
  ok(questState.flags.flag_bog_rescued===true, 'Bog is home — shack open');
  openDialog(bog); while(dialogOpen) advanceDialog();
  ok(questState.stage==='active', 'gear up and catch one');
  P.inv.item_rod=1; P.inv.item_hook_basic=1;
  NPC_ACTIONS.fish_trip();
  ok(scene==='fishing', 'out on the pond at last');
  fishingCast(); ok(fish.state==='waiting', 'line cast (basic hook auto-picked)');
  fish.state='reeling'; fish.inZone=2601; fishingUpdate(16);
  fish.catches.push('item_fish_small','item_fish_small');
  fishingEnd();
  ok(questState.flags.flag_fished_once===true, 'first catch logged');
  Quests.update(16);
  ok(questState.stage==='complete', 'Bog’s quest complete');
  openDialog(bog); while(dialogOpen) advanceDialog();
  // Bog's boat-driving lesson — YOU drive, rocks and all
  NPC_ACTIONS.boat_lesson();
  ok(scene==='boat', 'Bog hands you the oars — a real driving scene');
  BOAT.x=BW-80; boatUpdate(16,0,0);
  ok(scene==='village' && questState.flags.flag_boat_skill===true, 'reach the far jetty → boat-driving learned');
  ok(NPCS.some(n=>n.id==='npc_reba'), 'Reba keeps the stables (🐴) — no rides yet, Maple threw a shoe');
  ok(Quests.trackerText()==='✅ All quests done — explore Losthorne!', 'THE WHOLE CHAIN: goblins→berries→turkeys→champion→shield→TROLL→hammer→fishing');
  // red berries + the cursed stone (moved with the arc)
  P.inv.item_red_berry=1; invSel='item_red_berry'; P.inv.item_red_berry--; useItem('item_red_berry'); invSel=null;
  ok($('deathTitle').textContent==='The red berries', 'eating red berries from the satchel = death');
  $('btnRespawn').click();
  scene='village'; P.x=CURSED_STONE.x; P.y=CURSED_STONE.y; update(16);
  ok($('deathTitle').textContent==='The cursed stone', 'the cursed stone kills on touch');
  $('btnRespawn').click(); scene='village'; P.x=800; P.y=1210;
  // hook windows: fine hook is much tighter
  ok(HOOKS.fine.hi-HOOKS.fine.lo < (HOOKS.basic.hi-HOOKS.basic.lo)/2, 'fine hook green window is less than half the basic one');
  // territory respawn: die in the mountains → wake at the mountain entry
  scene='mountains';
  die('test'); $('btnRespawn').click();
  ok(scene==='mountains' && P.y===70 && P.hp===5, 'mountain deaths respawn at the mountain entry with 2½ hearts');
  scene='village'; P.x=800; P.y=1210;
  const cq=questState.currentId;
  die('test'); $('btnRespawn').click();
  ok(scene==='village' && questState.currentId===cq, 'village deaths respawn home; quests never reset');
  const div=document.createElement('div');
  div.style.cssText='position:fixed;inset:8px;z-index:99;background:rgba(10,8,5,.97);color:#e8d9a8;font:12px/1.6 monospace;padding:14px;border-radius:10px;overflow:auto;white-space:pre-wrap;';
  const fails=R.filter(r=>r.startsWith('❌')).length;
  div.textContent='v0.18 SMOKE TEST — '+(fails? fails+' FAILURE(S)':'ALL '+R.length+' PASS')+'\n\n'+R.join('\n');
  document.getElementById('app').appendChild(div);
}
