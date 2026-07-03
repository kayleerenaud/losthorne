// DATA: THE FIRST REAL QUEST — the visiting champion (DESIGN.md §10 tutorial-fight, drafted for preview).
// A larger human who fights back: raises his shield (unhittable), telegraphs a wind-up, then strikes.
// Learn the window: strike when his shield is down, survive his blow (Stoneskin helps!).
export default {
  id:'quest_main_04_champion',
  giver:'npc_chief_bonbottom',
  objective:{ type:'kill', target:'enemy_champion', count:1 },
  dialogue:{
    offer:["Warrior! A champion from a rival village has marched into OUR square. He demands an 'entertainment fight' with our toughest.",
           "And… well. I volunteered you. Don't look at me like that — you caught TURKEYS, you're clearly ready.",
           "Watch him: when his shield is up you cannot harm him. When he rears back — MOVE or block. Strike in between!"],
    active:["He's waiting in the square, warrior. Shield up: don't bother. Wind-up: get clear. In between: STRIKE!"],
    complete:["INCREDIBLE! The whole village saw it! And by challenge-law his shield is YOURS.",
              "Hold your ground to raise it — steel between you and the world. Losthorne breathes easier tonight."],
    afterReward:["The last free village has a champion of its own now. Rest — greater adventures are stirring…"],
  },
  tracker:{
    offer:'📯 The Chief needs you!',
    active:'⚔️ Defeat the champion!',
    complete:'🏆 Report to the Chief',
    afterReward:'✅ All quests done — explore Losthorne!',
  },
  banners:{
    start:'📯 QUEST: defeat the visiting champion in the square!',
    objectiveDone:'🏆 The champion yields! Report to Chief Bonbottom!',
    reward:'🛡️ You won the Champion’s Shield! (hold to charge = shield raised)',
  },
  reward:{ item:'item_shield' },
  setFlagOnReward:'flag_champion_defeated',
  next:{ quest:'quest_main_05_shield_training', delayMs:2500, banner:null },
};
