// ENGINE: quest runtime (DESIGN.md §10). Interprets declarative quest definitions
// from data/quests/**. Knows objective TYPES (kill/collect/talk/reach…), never
// specific quests. All story state lives in the single `questState` object below —
// it is the future save file.
//
// Events in:  Quests.emit('kill'|'collect', {target}) — engine systems report facts.
// Dialogue:   Quests.dialogueFor(npcId) / Quests.onDialogueEnd(npcId).
// UI:         Quests.trackerText(), return value of emit() carries progress banners.

export const questState = {
  currentId: null,          // quest being offered/run (linear chain for now)
  stage: null,              // 'offer' | 'active' | 'complete' | 'afterReward'
  progress: 0,
  completed: [],            // ids, in completion order
  pendingNext: null,        // {questId, msLeft}
  flags: {},                // future: arbitrary story flags
};

const defs = {};
let hooks = { banner:()=>{}, addCoins:()=>{} };

export const Quests = {
  init(questDefs, startId, h){
    for(const d of questDefs) defs[d.id]=d;
    hooks = h;
    questState.currentId = startId;
    questState.stage = 'offer';
    questState.progress = 0;
  },

  update(dt){
    const p = questState.pendingNext;
    if(p){ p.msLeft -= dt;
      if(p.msLeft <= 0){
        questState.pendingNext = null;
        questState.currentId = p.questId;
        questState.stage = 'offer';
        questState.progress = 0;
        if(p.banner) hooks.banner(p.banner);
      } }
    // 'deliver' objectives track live inventory: eat a quest berry and progress drops back.
    // Supports one item ({item,count}) or several ({items:[{item,count},...]}).
    const q = defs[questState.currentId];
    if(q && q.objective.type==='deliver' && (questState.stage==='active' || questState.stage==='complete')){
      const parts = q.objective.items || [q.objective];
      let prog=0, done=true;
      for(const pt of parts){
        const n = hooks.itemCount ? hooks.itemCount(pt.item) : 0;
        prog += Math.min(n, pt.count);
        if(n < pt.count) done=false;
      }
      questState.progress = prog;
      if(done && questState.stage==='active'){ questState.stage='complete'; hooks.banner(q.banners.objectiveDone); }
      if(!done && questState.stage==='complete'){ questState.stage='active'; }
    }
  },

  // An engine system reports a fact. Returns {counted, progress, count, banner}
  // so the reporting system can compose its own message without knowing quests.
  emit(type, payload){
    const q = defs[questState.currentId];
    if(!q || questState.stage!=='active') return {counted:false, banner:null};
    const o = q.objective;
    if(o.type!==type || o.target!==payload.target) return {counted:false, banner:null};
    questState.progress++;
    let bannerText = q.banners.progress ? q.banners.progress.replace('{n}',questState.progress) : null;
    if(questState.progress >= o.count){
      questState.stage = 'complete';
      bannerText = q.banners.objectiveDone;
    }
    return {counted:true, progress:Math.min(questState.progress,o.count), count:o.count, banner:bannerText};
  },

  // Which NPC owns the current stage: giver runs offer/active, turnIn runs complete/afterReward.
  _stageNpc(q){
    const turnIn = q.turnIn || q.giver;
    return (questState.stage==='complete' || questState.stage==='afterReward') ? turnIn : q.giver;
  },

  // What should this NPC say right now? null = not quest business (NPC uses own lines).
  dialogueFor(npcId){
    const q = defs[questState.currentId];
    if(!q || this._stageNpc(q)!==npcId) return null;
    const lines = q.dialogue[questState.stage];
    return (lines && lines.length) ? lines : null;
  },

  // Called when a dialogue with this NPC finishes — drives stage transitions.
  onDialogueEnd(npcId){
    const q = defs[questState.currentId];
    if(!q || this._stageNpc(q)!==npcId) return;
    if(questState.stage==='offer'){
      questState.stage='active';
      // retroactive quests credit things you already did while exploring
      questState.progress = (q.retroactive && hooks.retroCount) ? Math.min(hooks.retroCount(q.objective), q.objective.count) : 0;
      hooks.banner(q.banners.start);
      if(questState.progress >= q.objective.count && q.objective.type!=='deliver'){
        questState.stage='complete'; hooks.banner(q.banners.objectiveDone);
      }
    } else if(questState.stage==='complete'){
      if(q.objective.type==='deliver' && hooks.takeItems){
        for(const pt of (q.objective.items || [q.objective])) hooks.takeItems(pt.item, pt.count);
      }
      if(q.reward?.coins) hooks.addCoins(q.reward.coins);
      if(q.reward?.potion && hooks.givePotion) hooks.givePotion(q.reward.potion);
      if(q.reward?.item && hooks.giveItem) hooks.giveItem(q.reward.item);
      hooks.banner(q.banners.reward);
      questState.completed.push(q.id);
      if(q.setFlagOnReward) questState.flags[q.setFlagOnReward]=true;
      questState.stage='afterReward';
      if(q.next) questState.pendingNext={questId:q.next.quest, msLeft:q.next.delayMs, banner:q.next.banner};
    }
  },

  // dev-only: jump the chain to any quest/stage (used by the #dev testing menu)
  debugJump(questId, stage){
    if(!defs[questId]) return false;
    questState.currentId=questId; questState.stage=stage||'offer'; questState.progress=0; questState.pendingNext=null;
    return true;
  },

  trackerText(){
    const q = defs[questState.currentId];
    if(!q) return '';
    let t = q.tracker[questState.stage] || '';
    if(t.includes('{multi}') && q.objective.items && hooks.itemIcon){
      const parts=q.objective.items.map(pt=>{
        const n=Math.min(hooks.itemCount? hooks.itemCount(pt.item):0, pt.count);
        return hooks.itemIcon(pt.item)+' '+n+'/'+pt.count;
      }).join(' · ');
      t=t.replace('{multi}', parts);
    }
    return t.replace('{n}', String(questState.progress));
  },
};
