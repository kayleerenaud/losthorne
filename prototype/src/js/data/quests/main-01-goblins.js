// DATA: Challenge 1 — drive the goblins from the north forest (DESIGN.md §10).
export default {
  id:'quest_main_01_goblins',
  giver:'npc_chief_bonbottom',
  objective:{ type:'kill', target:'enemy_goblin', count:5 },
  dialogue:{
    offer:["Ah! Our newest warrior. Losthorne is the LAST free village — everything beyond the woods has fallen.",
           "Goblins have crept into the north forest. They scare the children and steal our bread!",
           "Drive off 5 goblins, and there'll be 110 coins in it for you.",
           "Oh — and NEVER eat the red berries. The blue ones are safe. The red ones… we lost old Gregor that way."],
    active:["The goblins won't leave on their own, warrior! North, up the path, through the woods."],
    complete:["HA! You did it! Five goblins gone — the children can play again. Here: 110 coins, well earned.",
              "But tell me… wasn't that BRUTAL with bare hands? You could use some strength. Or a shield.",
              "Talk to DORGAN, our potion-maker — the shop with the 🧪 sign. Tell him I sent you."],
    afterReward:["Dorgan, warrior! The 🧪 sign! He brews things that would curl Gregor's beard. Rest his soul."],
  },
  tracker:{
    offer:'💬 Find Chief Bonbottom',
    active:'⚔️ Drive the goblins from the north woods',
    complete:'🏆 Return to the Chief',
    afterReward:'🧪 Find Dorgan’s shop',
  },
  banners:{
    start:'📜 Quest: drive off 5 goblins in the north forest!',
    objectiveDone:'⚔️ Quest complete! Return to Chief Bonbottom!',
    reward:'🎉 The Chief pays you 110 coins!',
  },
  reward:{ coins:110 },
  next:{ quest:'quest_main_02_blueberries', delayMs:1500, banner:'🧪 Dorgan might be able to help you…' },
};
