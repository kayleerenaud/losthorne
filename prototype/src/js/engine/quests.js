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
      questState.stage='active'; questState.progress=0;
      hooks.banner(q.banners.start);
    } else if(questState.stage==='complete'){
      if(q.reward?.coins) hooks.addCoins(q.reward.coins);
      hooks.banner(q.banners.reward);
      questState.completed.push(q.id);
      if(q.setFlagOnReward) questState.flags[q.setFlagOnReward]=true;
      questState.stage='afterReward';
      if(q.next) questState.pendingNext={questId:q.next.quest, msLeft:q.next.delayMs, banner:q.next.banner};
    }
  },

  trackerText(){
    const q = defs[questState.currentId];
    if(!q) return '';
    const t = q.tracker[questState.stage] || '';
    return t.replace('{n}', String(questState.progress));
  },
};
