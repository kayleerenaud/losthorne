// DATA: Challenge — Modo teaches the Troll's Hammer (DESIGN.md §10), like shield school.
export default {
  id:'quest_main_07_hammer',
  giver:'npc_modo',
  turnIn:'npc_modo',
  objective:{ type:'train_hammer', target:'dummy', count:3 },
  dialogue:{
    offer:["Give it here. …Troll-forged. Star-iron. Modo has dreamed of holding one of these.",
           "It is NOT a sword, warrior. You don't slice with a mountain — you DROP it on things.",
           "Switch to the hammer, then press and HOLD like the shield — but release ON a training dummy. Three clean hammer-smashes. Show me."],
    active:["Hammer OUT (weapon switch), HOLD to wind up, release on the dummy. Three smashes, warrior. The dummies volunteered."],
    complete:["THREE! The ground is still complaining! HA!",
              "You carry troll-iron and you've earned it. Losthorne has never been safer — or louder."],
    afterReward:[],
  },
  tracker:{
    offer:'🔨 Take the hammer to Modo',
    active:'🔨 Hammer-smash dummies: {n}/3',
    complete:'🏆 Talk to Modo',
    afterReward:'🛶 Bog owes you a boat ride…',
  },
  banners:{
    start:'📜 Training: switch to the 🔨, HOLD to charge, release on a dummy — 3 times!',
    objectiveDone:'🔨 3/3! Modo approves — talk to him!',
    reward:'🎉 Hammer training complete!',
    progress:'🔨 CRUNCH! {n}/3',
  },
  reward:{},
  next:{ quest:'quest_main_08_first_catch', delayMs:3000, banner:'🛶 Bog is waving from his shack — he owes you a boat ride!' },
};
