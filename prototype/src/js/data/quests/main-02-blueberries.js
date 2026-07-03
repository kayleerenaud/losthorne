// DATA: Challenge 2 — berries for Dorgan (DESIGN.md §10). GIVEN by Dorgan himself.
// Berries go to your satchel; eat them or deliver them — delivery needs 4 in the bag.
export default {
  id:'quest_main_02_blueberries',
  giver:'npc_dorgan',
  turnIn:'npc_dorgan',
  objective:{ type:'deliver', items:[{item:'item_blueberry',count:4},{item:'item_red_berry',count:2}] },
  dialogue:{
    offer:["The Chief sent you? Ha! Then you'll want what everyone wants — a potion.",
           "I could brew you a SHIELD of stone for your very skin… but my cupboard is bare.",
           "Bring me 4 BLUEBERRIES — and 2 RED berries. Yes, the deadly ones. You don't EAT red berries, warrior. You BREW with them.",
           "In the satchel they're harmless. In your mouth they're a funeral. Off you go — and mind the goblins out there."],
    active:["Four blue, two red — in the satchel, not in your belly! The forest bushes regrow; the goblins, sadly, also regrow."],
    complete:["Ohh, plump and perfectly BLUE! Watch the cauldron… there. Drink this when danger comes: STONESKIN.",
              "And now that I'm restocked, my shop is open to you — 100 coins a mystery, when you have it.",
              "Low on coin? Erik always has a scheme for earning some. The shop with the 🪙 sign."],
    afterReward:["Erik, the 🪙 sign! Tell him the turkeys owe me nothing."],
  },
  tracker:{
    offer:'🧪 Talk to Dorgan',
    active:'{multi}',
    complete:'🏆 Deliver the berries to Dorgan',
    afterReward:'🪙 Erik has work for you…',
  },
  banners:{
    start:'📜 Quest: 4 blueberries + 2 RED berries for Dorgan (satchel only — never eat the red!)',
    objectiveDone:'🧺 All berries gathered! Take them to Dorgan!',
    reward:'🎉 Dorgan brews you a FREE Stoneskin potion — his shop is OPEN!',
    progress:null,
  },
  reward:{ potion:'potion_stoneskin' },
  setFlagOnReward:'flag_dorgan_shop_open',
  next:{ quest:'quest_main_03_turkeys', delayMs:1500, banner:null },
};
