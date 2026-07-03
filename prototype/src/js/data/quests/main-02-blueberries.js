// DATA: Challenge 2 — berries for Dorgan (DESIGN.md §10). GIVEN by Dorgan himself.
// Berries go to your satchel; eat them or deliver them — delivery needs 4 in the bag.
export default {
  id:'quest_main_02_blueberries',
  giver:'npc_dorgan',
  turnIn:'npc_dorgan',
  objective:{ type:'deliver', item:'item_blueberry', count:4 },
  dialogue:{
    offer:["The Chief sent you? Ha! Then you'll want what everyone wants — a potion.",
           "I could brew you a SHIELD of stone for your very skin… but my cupboard is bare.",
           "Bring me 4 blueberries from the wild bushes — the BLUE ones, mind — and the potion is yours, free."],
    active:["Four blueberries, warrior — in your satchel, not in your belly! The meadow bushes regrow quickly."],
    complete:["Ohh, plump and perfectly BLUE! Watch the cauldron… there. Drink this when danger comes: STONESKIN.",
              "And now that I'm restocked, my shop is open to you — 100 coins a mystery, when you have it.",
              "Low on coin? Erik always has a scheme for earning some. The shop with the 🪙 sign."],
    afterReward:["Erik, the 🪙 sign! Tell him the turkeys owe me nothing."],
  },
  tracker:{
    offer:'🧪 Talk to Dorgan',
    active:'🫐 Berries in satchel: {n}/4',
    complete:'🏆 Deliver the berries to Dorgan',
    afterReward:'🪙 Erik has work for you…',
  },
  banners:{
    start:'📜 Quest: gather 4 blueberries for Dorgan (keep them in your satchel!)',
    objectiveDone:'🫐 4/4 in the satchel! Take them to Dorgan!',
    reward:'🎉 Dorgan brews you a FREE Stoneskin potion — his shop is OPEN!',
    progress:'🫐 Satchel: {n}/4',
  },
  reward:{ potion:'potion_stoneskin' },
  setFlagOnReward:'flag_dorgan_shop_open',
  next:{ quest:'quest_main_03_turkeys', delayMs:1500, banner:null },
};
