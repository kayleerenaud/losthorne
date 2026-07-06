// DATA: Bog teaches BOAT-DRIVING — offered right after your first catch (Kaylee 2026-07-04 reorder:
// troll rescue → fishing → BOATING → Modo's hammer → the Witch arc). The boat lesson itself is the
// full-screen crossing (current, rock slalom, 3-plank hull); winning it sets flag_boat_skill.
export default {
  id:'quest_main_09_boat_lesson',
  giver:'npc_bog',
  turnIn:'npc_bog',
  objective:{ type:'flag', flag:'flag_boat_skill' },
  dialogue:{
    offer:["Now the REAL lesson, savior. A warrior who can't drive a boat is only half dangerous.",
           "This time YOU take the oars — I'll heckle from the stern. Watch the CURRENT, weave the rocks, reach the far jetty. Crack the hull three times and we sink back to the dock.",
           "When you're ready, ask Bog for the oars — the 🛶 in my menu."],
    active:["Take the oars, warrior — the 🛶 in my menu. Steer across the current, AROUND the rocks, to the far jetty."],
    complete:["HA! Drove us home near enough clean. Boat-driving — LEARNED. You're a proper danger now.",
              "Oh — and I told Modo about that HAMMER on your back. He near dropped his tongs. Best go see him before he bursts."],
    afterReward:["Modo's forge — the 🔨 sign. Go on, he'll never forgive Bog if you keep the man waiting."],
  },
  tracker:{
    offer:'🛶 Bog will teach you to drive',
    active:'⛵ Take Bog’s oars — reach the far jetty',
    complete:'🏆 Talk to Bog',
    afterReward:'🔨 Modo heard about your hammer…',
  },
  banners:{
    start:'📜 Bog will teach you BOAT-DRIVING — ask him for the oars (🛶)!',
    objectiveDone:'⛵ Boat-driving learned! Talk to Bog.',
    reward:'🎉 Boat-driving mastered!',
  },
  reward:{},
  autoAdvance:true,   // reaching the jetty completes + advances instantly — no turn-in to miss
  next:{ quest:'quest_main_07_hammer', delayMs:2500, banner:'🔨 Modo heard about your hammer — head to the forge!' },
};
