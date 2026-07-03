// DATA: Strax the Mountain Man (DESIGN.md §5,§10) — lives rough in the mountain woods.
// Appears after the first wolf pack falls. Teaches FIRE-MAKING. Warns about nightfall.
export default {
  id:'npc_strax', name:'Strax the Mountain Man',
  scene:'mountains', outdoor:true,
  pos:{x:400,y:330},
  look:{ outfit:'#5c4a33', hat:true },
  lines:["Hrm. Wolves didn't eat you. Impressive or lucky — Strax hasn't decided.",
         "You'll want FIRE up here, small one. Cold kills slower than wolves but it's more patient.",
         "Strax will teach you. Watch the spark, strike when it glows HOT. Three good strikes and the fire lives."],
  linesAfter:["Climb rests on the ledges, small one — grip, rest, grip. The mountain doesn't care how strong you are, only how patient.",
              "And when your business up top is done: go back the way you came BEFORE night falls again. The wolves remember."],
};
