// DATA: Dorgan (DESIGN.md §5) — potion-maker; random gifts.
export default {
  id:'npc_dorgan', name:'Dorgan the Potion-Maker',
  building:{ x:560, y:1300, sign:'🧪' },
  interior:{ w:520, h:340, props:[['⚗️',120,120],['🕯️',400,120],['📜',330,95]] },
  pos:{x:260,y:120},
  look:{ outfit:'#53406e', hat:false },
  lines:["Hm? Ah — a warrior. I brew what the wilds allow… and the wilds are generous, if unpredictable.",
         "My potions grant a RANDOM gift. Strength, speed, skin of stone — courage chooses its own shape. Care to gamble?"],
  linesLocked:["Hm? Ah — a warrior. I make potions… marvelous ones. But my supplies are gone — not a berry in the cupboard.",
               "Come back after I've restocked. If only someone would bring me something BLUE…"],
  shopRequiresFlag:'flag_dorgan_shop_open',
  shop:[{ item:'item_potion', label:'🧪 Mystery potion — {price} coins (rolled when you buy!)', banner:null }],
};
