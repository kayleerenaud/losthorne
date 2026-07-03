// DATA: Challenge 3 — Erik's turkey business (DESIGN.md §10). Teaches GRAB.
// Turkeys caught while exploring BEFORE the quest count retroactively.
export default {
  id:'quest_main_03_turkeys',
  giver:'npc_erik',
  turnIn:'npc_erik',
  objective:{ type:'deliver', item:'item_wild_turkey', count:3 },
  dialogue:{
    offer:["Psst — warrior! Business idea. The wild turkeys in the meadow? Their feathers sell like fresh bread.",
           "Catch me 3. Sneak close and GRAB one — the 🤲 button appears when you're near enough.",
           "That stoneskin of Dorgan's? Drink it first and the goblins can't interrupt your turkey chase. 90 coins for you!"],
    active:["Three turkeys! Chase them in the meadow and GRAB when close. My feather empire awaits."],
    complete:["HA! Feathers for WEEKS! Here's your 90 coins — and look at that, that's JUST enough for a basic sword.",
              "Modo's forge — the 🔨 sign. Tell him Erik wants a discount he won't give.",
              "And with turkey to spare, I'll sell you the roast meat too. Erik provides!"],
    afterReward:[],
  },
  tracker:{
    offer:'🪙 Talk to Erik',
    active:'🦃 Turkeys in satchel: {n}/3',
    complete:'🏆 Bring the turkeys to Erik',
    afterReward:'🔨 A sword awaits at Modo’s…',
  },
  banners:{
    start:'📜 Quest: catch 3 turkeys for Erik! (get close and GRAB)',
    objectiveDone:'🦃 3/3! Bring them to Erik!',
    reward:'🎉 Erik pays 90 coins — turkey meat now for sale!',
    progress:'🦃 Turkey caught! {n}/3',
  },
  reward:{ coins:90 },
  setFlagOnReward:'flag_erik_turkey_stock',
  next:{ quest:'quest_main_04_champion', delayMs:15000, banner:'📯 A stranger marches into the village square…' },
};
