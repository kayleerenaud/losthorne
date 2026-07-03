// DATA: Quest 1 — drive the goblins from the north forest (DESIGN.md §10).
export default {
  id:'quest_main_01_goblins',
  giver:'npc_chief_bonbottom',
  objective:{ type:'kill', target:'enemy_goblin', count:3 },
  dialogue:{
    offer:["Ah! Our newest warrior. Losthorne is the LAST free village — everything beyond the woods has fallen.",
           "Goblins have crept into the north forest. They scare the children and steal our bread!",
           "Drive off 3 goblins, and there'll be 60 coins in it for you.",
           "Oh — and NEVER eat the red berries. The blue ones heal. The red ones… we lost old Gregor that way."],
    active:["The goblins won't leave on their own, warrior! North, up the path, through the woods."],
    complete:["HA! You did it! Three goblins gone — the children can play again.",
              "You have my thanks, and 60 coins, well earned. Now rest and explore — I'll send for you when Losthorne needs you."],
    afterReward:["Enjoy the calm, warrior. Stretch your legs, taste the blueberries. I'll call when there's work."],
  },
  tracker:{
    offer:'💬 Talk to Chief Bonbottom (tap near him)',
    active:'⚔️ Goblins driven off: {n}/3',
    complete:'🏆 Return to Chief Bonbottom!',
    afterReward:'🌿 Explore! The Chief will call on you again…',
  },
  banners:{
    start:'📜 Quest: drive off 3 goblins in the north forest!',
    objectiveDone:'⚔️ Quest complete! Return to Chief Bonbottom!',
    reward:'🎉 The Chief congratulates you! +60 coins',
  },
  reward:{ coins:60 },
  next:{ quest:'quest_main_02_blueberries', delayMs:40000, banner:'📜 Chief Bonbottom has a new task for you!' },
};
