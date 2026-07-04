// DATA: Reba the Stablekeeper (DESIGN.md §5) — dark ponytail, keeps the village horses.
// The horses are NOT rideable yet — she always has a good excuse. Riding comes later (ANCHORS.horse).
export default {
  id:'npc_reba', name:'Reba the Stablekeeper',
  building:{ x:790, y:1370, sign:'🐴' },
  interior:{ w:520, h:340, props:[['🐴',120,120],['🐴',400,120],['🌾',260,95],['🪣',430,95]] },
  pos:{x:260,y:120},
  look:{ outfit:'#6e4632', hair:'#241d15', hat:false },   // dark ponytail (placeholder: dark hair)
  lines:["Welcome to the stables! That's Maple, and the bitey one is Biscuit. Admire from THIS side of the rail, please.",
         "A ride? Ha! Maple threw a shoe on the mountain road, and the farrier won't travel while goblins prowl the woods. And Biscuit… Biscuit bites everyone she hasn't known a year.",
         "Come back when the roads are safer, warrior. A horse will carry you further than any boat one day — Reba promises you that."],
};
