// DATA: THE WITCH — the deed itself (Kaylee 2026-07-04). Dorgan already sent you north with the
// antidote, so this quest AUTO-ACTIVATES (no NPC offer). It tracks the whole run: cross the deep
// woods (goblins + one wolf pack, never both), take the boat to the island hut past the piranhas,
// and cure the shapeshifting Witch — who is really JESSIE. Turn-in: the Chief, back home.
export default {
  id:'quest_main_11_witch',
  giver:'npc_chief_bonbottom',
  turnIn:'npc_chief_bonbottom',
  objective:{ type:'flag', flag:'flag_witch_cured' },
  dialogue:{
    // offer is skipped (auto-activated); these are the turn-in beats after Jessie is freed
    active:["North, warrior. The deep woods, the black water, the hut on the island. And the potion — guard it."],
    complete:["JESSIE? The travelling singer, the one who vanished a season back? SHE was the Witch?! …A curse. Of course it was a curse.",
              "You didn't kill a soul up there — you HEALED one. That's a rarer kind of hero, warrior. Losthorne won't forget it."],
    afterReward:["A curse broken, a friend returned to the road. Rest now — you've more than earned it."],
  },
  tracker:{
    offer:'🌲 North — into the deep woods',
    active:'🌲 Reach the Witch — cross the deep woods & the lake',
    complete:'🏆 Tell the Chief what you found',
    afterReward:'✅ The Witch is free — explore Losthorne!',
  },
  banners:{
    start:'📜 QUEST: into the deep woods — reach the Witch’s island and use the Antidote.',
    objectiveDone:'✨ The curse breaks! Return to Chief Bonbottom.',
    reward:'🎉 Jessie is free — and owes you her song.',
  },
  reward:{},
  next:null,
};
