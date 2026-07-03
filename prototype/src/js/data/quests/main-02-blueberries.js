// DATA: Quest 2 — blueberries for Dorgan's potion of courage (DESIGN.md §10).
export default {
  id:'quest_main_02_blueberries',
  giver:'npc_chief_bonbottom',
  objective:{ type:'collect', target:'item_blueberry', count:4 },
  dialogue:{
    offer:["There you are! Dorgan is brewing a potion of courage, and he's short on ingredients.",
           "Bring me 4 blueberries from the wild bushes. The BLUE ones, mind you. Blue. I cannot stress this enough."],
    active:["Blueberries! Four! The bushes in the meadows regrow quickly — off you go."],
    complete:["Perfect — plump and blue! Dorgan sends his thanks… and I'll add 40 coins from the village purse.",
              "You've done all I have for now, warrior. Explore Losthorne freely — greater adventures are stirring…"],
    afterReward:[],
  },
  tracker:{
    offer:'💬 Talk to Chief Bonbottom (tap near him)',
    active:'🫐 Blueberries: {n}/4',
    complete:'🏆 Return to Chief Bonbottom!',
    afterReward:'✅ All quests done — explore Losthorne!',
  },
  banners:{
    start:'📜 Quest: gather 4 blueberries!',
    objectiveDone:'🫐 4/4! Bring them to Chief Bonbottom!',
    reward:'🎉 The Chief congratulates you! +40 coins',
    progress:'🫐 Blueberries: {n}/4  (+½ ❤️)',
  },
  reward:{ coins:40 },
  next:null,
};
