// DATA: THE WITCH ARC begins (Kaylee 2026-07-04). Dorgan bursts through the village raving about a
// disturbance past the north woods — he suspects the WITCH — and promises a special recipe to whoever
// will stop her. The CHIEF asks if you'll take it on (a real choice) and reminds you to stock FOOD.
// Then you go to Dorgan, who brews the ANTIDOTE with you (the minigame — stage 3). giver=Chief so the
// offer/food-reminder are his; turnIn=Dorgan so the "now go into the woods" send-off is Dorgan's.
export default {
  id:'quest_main_10_witch_alarm',
  giver:'npc_chief_bonbottom',
  turnIn:'npc_dorgan',
  objective:{ type:'flag', flag:'flag_antidote_made' },
  choice:{ go:"I'll do it.", later:"I need more time to prepare.",
    laterBanner:'📯 The Chief: “Prepare well — food, potions, a clear head. But don’t wait long. That thing is stirring.”' },
  dialogue:{
    offer:["You saw Dorgan tear through the square just now? He's not one to panic. Something past the NORTH WOODS has him white as chalk.",
           "He says it's the WITCH. An old curse in the deep woods — goblins at her feet, wolves at her door, and worse things wearing borrowed faces.",
           "Dorgan swears he can brew something to end it, and he'll teach the recipe to whoever's brave enough to carry it in. …So. Will you go?"],
    active:["You're going — good. First: STOCK UP ON FOOD, warrior. Bread, turkey, anything Erik will sell. The woods are long and the Witch is patient.",
            "Then see DORGAN in his shop — the 🧪 sign. He has a recipe, and there's no facing her without it."],
    complete:["…It's done, then. You made it — real witch's-bane, cooked and mixed and stirred by your own hand.",
              "Take the trail NORTH, past where the goblins thicken, to the black water in the deep woods. And warrior — GUARD this potion. Everything depends on it."],
    afterReward:["North, into the deep woods. Mind the goblins, mind the wolves — and DON'T lose the potion."],
  },
  tracker:{
    offer:'📯 The Chief needs an answer',
    active:'🍞 Stock food, then see Dorgan for the recipe',
    complete:'🧪 Talk to Dorgan',
    afterReward:'🌲 North — into the deep woods',
  },
  banners:{
    start:'📜 QUEST: the WITCH stirs past the north woods. Stock up on FOOD, then see Dorgan!',
    objectiveDone:'🧪 The Antidote is brewed! Talk to Dorgan.',
    reward:'🎉 Dorgan sends you north — the Witch awaits.',
  },
  reward:{},
  // NEXT: the deep-woods crossing + the Witch fight (wired in Stage 6 — quest_main_11_witch).
  next:{ quest:'quest_main_11_witch', delayMs:1500, banner:null },
};
