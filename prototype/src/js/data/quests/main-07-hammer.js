// DATA: Challenge — Modo teaches the Troll's Hammer (DESIGN.md §10), like shield school.
export default {
  id:'quest_main_07_hammer',
  giver:'npc_modo',
  turnIn:'npc_modo',
  objective:{ type:'train_hammer', target:'dummy', count:3 },
  dialogue:{
    offer:["So it's TRUE. Bog rowed up here babbling about star-iron and I told him to sober up. …Then you walk in with THAT on your back.",
           "Let me — by the forge-light. Troll-forged. Real. I'd have dreamed of holding one. Tell you what: I'll BUY it. Name your price! …No? Ha — good. I wouldn't sell it either.",
           "Then let Modo teach you to WIELD it. It's not a sword — you don't slice with a mountain, you DROP it. But up close it SWINGS, too.",
           "Switch to the hammer. TAP to swing. HOLD then release to SMASH. Break three dummies for me — they volunteered."],
    active:["Hammer OUT (weapon switch): TAP swings it, HOLD-then-release SMASHES. Three dummies, warrior."],
    complete:["THREE! The ground is STILL complaining! HA!",
              "You carry troll-iron and you've earned it. Losthorne has never been safer — or louder."],
    afterReward:[],
  },
  tracker:{
    offer:'🔨 Take the hammer to Modo',
    active:'🔨 Smash the dummies with the hammer',
    complete:'🏆 Talk to Modo',
    afterReward:'🛶 Bog owes you a boat ride…',
  },
  banners:{
    start:'📜 Training: switch to the 🔨 — TAP to swing, HOLD-release to SMASH a dummy. 3 smashes!',
    objectiveDone:'🔨 Enough! Modo approves — talk to him!',
    reward:'🎉 Hammer training complete!',
    progress:'🔨 CRUNCH! {n}/3',
  },
  reward:{},
  // NEXT: the WITCH arc begins (wired in Stage 2 — quest_main_10_witch_alarm).
  next:{ quest:'quest_main_10_witch_alarm', delayMs:3000, banner:null },
};
