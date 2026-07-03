// DATA: QUEST 2 (real quest) — Find Bog / the Mountain Troll arc (DESIGN.md §9,§10).
// The Chief only knows: a disturbance in the mountains, Bog missing, a fishing hook
// found on the southern trail. He does NOT know about the troll.
export default {
  id:'quest_main_06_find_bog',
  giver:'npc_chief_bonbottom',
  turnIn:'npc_chief_bonbottom',
  objective:{ type:'flag', flag:'flag_bog_rescued' },
  choice:{ go:"I'll find him.", later:"I need to prepare first",
    laterBanner:'📯 The Chief: “Prepare well… but hurry. The mountains are no inn.”' },
  dialogue:{
    offer:["Warrior — something is wrong. There's been a… disturbance, up in the mountains. Rumbling. Lights. The goats won't graze.",
           "And Bog is MISSING. His shack's been shut for days. No boat, no Bog, no grumbling about freeloaders. It's unnatural.",
           "A shepherd found this on the southern trail: a fishing hook. Bog's, I'd stake my hat on it. He went toward the mountains.",
           "I don't know what's up there, warrior. Take the road SOUTH, through the woods, and find our boatman."],
    active:["South, warrior! Through the woods at the bottom of the valley — the trail climbs into the mountains. Bring Bog home."],
    complete:["BOG'S BACK?! And a TROLL?! Turned to STONE?! Sit down, warrior, you're telling this twice.",
              "…And what in Losthorne is that HAMMER on your back? That's troll-make. Show it to MODO — the forge, go, GO!"],
    afterReward:["A troll. An actual troll. And our warrior walked up its BACK. Gregor would have loved this."],
  },
  tracker:{
    offer:'📯 The Chief needs you!',
    active:'⛰️ Find Bog — take the trail SOUTH',
    complete:'🏆 Tell the Chief',
    afterReward:'🔨 Show the hammer to Modo',
  },
  banners:{
    start:'📜 QUEST: Bog is missing — follow the southern trail into the mountains!',
    objectiveDone:'🏆 Bog is safe! Report to Chief Bonbottom!',
    reward:'🎉 The whole village cheers your name!',
  },
  reward:{},
  next:{ quest:'quest_main_07_hammer', delayMs:2000, banner:null },
};
