// DATA: Challenge 5 — Erik's shield training (DESIGN.md §10). Friendly sparring:
// Erik swings a wooden sword; BLOCK 3 of his blows (hold to raise your shield).
// He coaches you: tips when you get hit, praise when you block.
export default {
  id:'quest_main_05_shield_training',
  giver:'npc_erik',
  turnIn:'npc_erik',
  objective:{ type:'block', target:'training_erik', count:3 },
  dialogue:{
    offer:["THERE'S our champion! That shield of yours — do you actually know how to use it, or do you just carry it around looking heroic?",
           "Thought so. Listen close, this is the whole trick: PRESS AND HOLD your attack button — the big one, bottom right — and DON'T let go.",
           "While you're holding, you're planted and your shield is UP. Anything that hits you bounces off. Let go, and the shield drops (and your held swing comes out).",
           "So: I swing, you HOLD. You'll see the ring around you while it's up. Block 3 of my swings and I'll call you trained. Wooden sword, no hard feelings!"],
    active:["Remember: PRESS AND HOLD the attack button BEFORE my swing lands — hold means shield UP, release means shield DOWN. Watch for my wind-up, then hold!"],
    complete:["THREE! Ha! You block better than my old sparring dummy — and it took two arrows to the head.",
              "That shield will save your life out there. Consider yourself TRAINED, champion of Losthorne."],
    afterReward:[],
  },
  tracker:{
    offer:'🪙 Erik wants to spar!',
    active:'🛡️ Blocks: {n}/3',
    complete:'🏆 Talk to Erik',
    afterReward:'✅ All quests done — explore Losthorne!',
  },
  banners:{
    start:'📜 Training: when Erik swings, PRESS & HOLD the attack button — holding = shield UP! Block 3 swings.',
    objectiveDone:'🛡️ 3/3 blocks! Erik is impressed — talk to him!',
    reward:'🎉 Shield training complete!',
    progress:'🛡️ Block! {n}/3',
  },
  reward:{},
  next:null,
};
