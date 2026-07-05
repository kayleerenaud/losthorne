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
           "One more thing before you go. You've seen the old stone shapes by the west fence? TROLLS, from the dark years. They feared the sun so terribly that the dawn itself froze them where they stood.",
           "Old history, of course. But in the mountains, warrior… old history has a way of still breathing. Remember the ruins. Remember what the DAYLIGHT did.",
           "I don't know what's up there. Take the road SOUTH, through the woods, and find our boatman."],
    active:["South, warrior! Through the woods at the bottom of the valley — the trail climbs into the mountains. Bring Bog home."],
    complete:["BOG'S BACK?! And a TROLL turned to STONE?! Sit down, warrior — you're telling this twice.",
              "And that HAMMER on your back is troll-make… but that's a tale for the forge later. First: BOG. That man owes you the whole pond, and he means to pay it. Go see him down at the water."],
    afterReward:["A troll. An actual troll. And our warrior walked up its BACK. Gregor would have loved this. …Go on — Bog's waving you down to the pond."],
  },
  tracker:{
    offer:'📯 The Chief needs you!',
    active:'⛰️ Find Bog — take the trail SOUTH',
    complete:'🏆 Tell the Chief',
    afterReward:'🛶 Bog wants to thank you — go to the pond',
  },
  banners:{
    start:'📜 QUEST: Bog is missing — follow the southern trail into the mountains!',
    objectiveDone:'🏆 Bog is safe! Report to Chief Bonbottom!',
    reward:'🎉 The whole village cheers your name!',
  },
  reward:{},
  next:{ quest:'quest_main_08_first_catch', delayMs:2000, banner:'🛶 Bog is home — and waving you down to the pond!' },
};
