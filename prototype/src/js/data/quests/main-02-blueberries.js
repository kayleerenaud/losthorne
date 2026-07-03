// DATA: Quest 2 — blueberries for Dorgan (DESIGN.md §10). Offered by the Chief,
// TURNED IN to Dorgan — completing it opens Dorgan's potion shop.
export default {
  id:'quest_main_02_blueberries',
  giver:'npc_chief_bonbottom',
  turnIn:'npc_dorgan',
  objective:{ type:'collect', target:'item_blueberry', count:4 },
  dialogue:{
    offer:["There you are! Dorgan is brewing a potion of courage, and he's short on ingredients.",
           "Gather 4 blueberries from the wild bushes and bring them straight to DORGAN.",
           "The BLUE ones, mind you. Blue. I cannot stress this enough."],
    active:["Blueberries! Four! And take them to Dorgan, not to me — my hands are full of chiefly business."],
    complete:["Ohh — plump and perfectly BLUE! With these I can brew again. You have my thanks, warrior.",
              "Here, 40 coins from my own purse. And now that I'm restocked… my potions are for sale. 100 coins for a mystery — courage chooses its own shape."],
    afterReward:[],
  },
  tracker:{
    offer:'💬 Talk to Chief Bonbottom (tap near him)',
    active:'🫐 Blueberries: {n}/4',
    complete:'🏆 Bring the berries to Dorgan!',
    afterReward:'✅ All quests done — explore Losthorne!',
  },
  banners:{
    start:'📜 Quest: gather 4 blueberries for Dorgan!',
    objectiveDone:'🫐 4/4! Bring them to Dorgan!',
    reward:'🎉 Dorgan pays you 40 coins — his potion shop is OPEN!',
    progress:'🫐 Blueberries: {n}/4  (+½ ❤️)',
  },
  reward:{ coins:40 },
  setFlagOnReward:'flag_dorgan_shop_open',
  next:null,
};
