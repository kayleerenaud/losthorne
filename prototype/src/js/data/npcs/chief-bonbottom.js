// DATA: Chief Bonbottom (DESIGN.md §5) — village chief, quest-giver.
export default {
  id:'npc_chief_bonbottom', name:'Chief Bonbottom',
  pos:{x:800,y:1140},
  look:{ outfit:'#7d2f2f', hat:true },
  // When the WHOLE story is done — truly rest-and-explore.
  idleLines:["The village is safe and the fires are warm, thanks to you. Rest easy, warrior — you've earned the quiet."],
  // When a quest is still afoot elsewhere in the village — don't give false closure; nudge them onward.
  idleLinesBusy:["Don't settle in yet, warrior — the village still has need of you. Someone's been asking after you… follow it up.",
                 "Adventure's already stirring. Ask around — a friend of ours is waiting on you."],
};
