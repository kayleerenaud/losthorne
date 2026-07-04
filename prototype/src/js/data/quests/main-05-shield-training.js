// DATA: Challenge 5 — MODO's shield training (DESIGN.md §10). The smith who gates the bow
// also teaches the shield. Friendly sparring with a wooden sword: BLOCK 3 of his swings.
export default {
  id:'quest_main_05_shield_training',
  giver:'npc_modo',
  turnIn:'npc_modo',
  objective:{ type:'block', target:'training_modo', count:3 },
  dialogue:{
    offer:["HOLD, warrior! Modo saw the whole fight from the forge — and Modo saw you WIN that shield.",
           "Do you know how to USE it, or is it a very large dinner plate?",
           "Modo teaches. Listen once, listen well: PRESS AND HOLD your attack button — the big one, bottom right — and DO NOT let go.",
           "While you hold, you are planted and the shield is UP — you will see a ring around you. Blows bounce off. Release, and it drops — release does NOTHING else. A shield is a shield, not a wind-up.",
           "And hear Modo well: a shield arm TIRES. Three breaths of holding, no more — then it MUST rest before it can rise again. Time your blocks; don't lean on them.",
           "Meet me outside the forge. Wooden sword. When I swing, you HOLD. Block 3 and Modo calls you shield-trained."],
    active:["PRESS AND HOLD the attack button BEFORE my swing lands. Hold = shield up. Release = shield down. Don't LEAN on it — held too long, the arm tires and the shield must rest. Watch my wind-up!"],
    complete:["THREE! HA! Steel remembers who respects it — and that shield respects you now.",
              "You are shield-trained, warrior. Now buy some arrows so my bow stops gathering dust."],
    afterReward:[],
  },
  tracker:{
    offer:'🔨 Modo wants to spar!',
    active:'🛡️ Blocks: {n}/3',
    complete:'🏆 Talk to Modo',
    afterReward:'⛰️ The Chief has news…',
  },
  banners:{
    start:'📜 Training: when Modo swings, PRESS & HOLD the attack button — holding = shield UP! Block 3 swings.',
    objectiveDone:'🛡️ 3/3 blocks! Modo is impressed — talk to him!',
    reward:'🎉 Shield training complete!',
    progress:'🛡️ Block! {n}/3',
  },
  choice:{ go:"Let's do it!", later:"I'll come back later",
    laterBanner:'🔨 Modo: “Fine. But you\u2019ll NEED this skill… don\u2019t forget about Modo.” (Find him when ready)' },
  reward:{},
  next:{ quest:'quest_main_06_find_bog', delayMs:4000, banner:'📯 Chief Bonbottom is asking for you — something about the mountains…' },
};
