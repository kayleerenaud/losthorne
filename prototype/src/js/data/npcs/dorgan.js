// DATA: Dorgan (DESIGN.md §5) — potion-maker; random gifts.
export default {
  id:'npc_dorgan', name:'Dorgan the Potion-Maker',
  pos:{x:665,y:1190},
  look:{ outfit:'#53406e', hat:false },
  lines:["Hm? Ah — a warrior. I brew what the wilds allow… and the wilds are generous, if unpredictable.",
         "My potions grant a RANDOM gift. Strength, speed, skin of stone — courage chooses its own shape. Care to gamble?"],
  shop:{ item:'item_potion', label:'🧪 Mystery potion — {price} coins (goes to satchel)', banner:'🧪 A mystery potion sloshes in your satchel' },
};
