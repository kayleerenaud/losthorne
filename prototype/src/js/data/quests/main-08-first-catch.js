// DATA: Challenge — Bog's thank-you fishing trip (DESIGN.md §10). Fishing unlocks HERE,
// after the rescue. His terms: half the catch — the LARGER half if it's odd.
export default {
  id:'quest_main_08_first_catch',
  giver:'npc_bog',
  turnIn:'npc_bog',
  objective:{ type:'flag', flag:'flag_fished_once' },
  dialogue:{
    offer:["Bog owes you a debt no boat can carry. But a boat is what Bog has.",
           "Get a rod and a hook from Erik, and Bog will teach you the pond — casting, reeling, the whole song.",
           "Bog's terms stand, though, savior or no: half the catch is Bog's. If it's an odd number… the LARGER half is Bog's. The pond gives, Bog keeps."],
    active:["Rod from Erik, hook from Erik, then back to Bog. The fish are insulting us both as we speak."],
    complete:["HA! You reel like a natural. Bog declares you a fisherman of Losthorne!",
              "Come back whenever. The pond is patient and Bog is greedy — a fine partnership.",
              "And warrior — next trip, YOU take the oars. Ask Bog for the boat-driving lesson. A warrior who can't drive a boat is only half dangerous."],
    afterReward:[],
  },
  tracker:{
    offer:'🛶 Talk to Bog',
    active:'🎣 Catch your first fish with Bog',
    complete:'🏆 Talk to Bog',
    afterReward:'🛶 Bog will teach you to drive next',
  },
  banners:{
    start:'📜 Quest: gear up at Erik’s and land your first fish with Bog!',
    objectiveDone:'🎣 First catch! Bog looks almost proud!',
    reward:'🎉 Fisherman of Losthorne!',
  },
  reward:{},
  autoAdvance:true,   // landing your first fish completes + advances instantly — no turn-in to miss
  next:{ quest:'quest_main_09_boat_lesson', delayMs:2500, banner:'🛶 Now Bog wants to teach you to DRIVE the boat — ask him for the oars!' },
};
