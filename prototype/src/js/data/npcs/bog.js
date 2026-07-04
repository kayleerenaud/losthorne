// DATA: Bog the Boater (DESIGN.md §5) — lives by the pond, rows you out fishing.
// He keeps HALF the catch (the odd fish is his). Teaches boat-driving after your first trip.
export default {
  id:'npc_bog', name:'Bog the Boater',
  pos:{x:1195,y:1062},
  look:{ outfit:'#3a6b62', hat:false },
  outdoor:true,
  linesNoGear:["Mmh. Pond's full of fish, warrior. But I don't row for free-loaders.",
               "Get yourself a ROD and a HOOK — Erik sells both, the 🪙 shop — then come see Bog."],
  lines:["Ah — rod AND hook! Now you look like company worth rowing.",
         "My terms: half the catch is mine. Odd number? The LARGER half is mine. The pond gives, Bog keeps.",
         "Well? Shall we?"],
  actions:[
    { id:'fish_trip',   label:'🛶 Row out fishing with Bog (he keeps half)', needsGear:true },
    { id:'boat_lesson', label:'⛵ Take the oars — Bog teaches boat-driving (YOU drive)', requiresFlag:'flag_fished_once' },
  ],
};
