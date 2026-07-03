// DATA: Quest 3 — Erik's turkey business (DESIGN.md §10). Teaches the GRAB function.
// Reward tuned so total quest income (60+40+50=150 +50 start) = exactly one sword (200).
export default {
  id:'quest_main_03_turkeys',
  giver:'npc_erik',
  turnIn:'npc_erik',
  objective:{ type:'catch', target:'entity_turkey', count:3 },
  dialogue:{
    offer:["Psst — warrior! Business idea. The wild turkeys in the meadow? Their feathers sell like fresh bread.",
           "Catch me 3 of them. Sneak up close and GRAB one with your hands — a 🤲 button appears when you're close enough.",
           "50 coins in it for you. Nothing in Losthorne is free… except my excellent advice."],
    active:["Three turkeys, warrior! Chase them down in the meadow south of the woods and GRAB them when you're close."],
    complete:["HA! Look at these beauties — feathers for WEEKS! Here's your 50 coins, well earned.",
              "And with turkey to spare… I'll sell you the roast meat. 15 coins, restores a heart and a half. Erik provides!"],
    afterReward:[],
  },
  tracker:{
    offer:'💬 Erik is waving you over…',
    active:'🦃 Turkeys caught: {n}/3',
    complete:'🏆 Bring the turkeys to Erik!',
    afterReward:'✅ All quests done — explore Losthorne!',
  },
  banners:{
    start:'📜 Quest: catch 3 turkeys for Erik! (get close and GRAB)',
    objectiveDone:'🦃 3/3! Bring them to Erik!',
    reward:'🎉 Erik pays you 50 coins — turkey meat now for sale!',
    progress:'🦃 Turkey caught! {n}/3',
  },
  reward:{ coins:50 },
  setFlagOnReward:'flag_erik_turkey_stock',
  next:null,
};
