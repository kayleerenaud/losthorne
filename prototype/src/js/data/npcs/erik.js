// DATA: Erik with a K (DESIGN.md §5) — trader; nothing is free.
export default {
  id:'npc_erik', name:'Erik the Trader',
  building:{ x:980, y:1120, sign:'🪙' },
  interior:{ w:520, h:340, props:[['🍞',120,120],['🧺',400,120],['🫙',260,95]] },
  pos:{x:260,y:120},   // position INSIDE his shop
  look:{ outfit:'#2f5d7d', hat:false },
  lines:["Welcome to Erik\u2019s! Bread, fresh-ish — 10 coins. Nothing in Losthorne is free, friend."],
  buys:[
    { item:'item_wild_turkey', label:'💰 Sell wild turkey — +{price} coins', banner:'💰 Erik counts feathers happily. +15 coins' },
    { item:'item_fish_small', label:'💰 Sell pond fish — +{price} coins', banner:'💰 “Fresh-ish fish!” +8 coins' },
    { item:'item_fish_big',   label:'💰 Sell BIG fish — +{price} coins', banner:'💰 Erik whistles. +20 coins' },
  ],
  shop:[
    { item:'item_bread',  label:'🍞 Buy bread — {price} coins (goes to satchel)', banner:'🍞 Bread tucked into your satchel' },
    { item:'item_turkey', label:'🍗 Turkey meat — {price} coins (+1½ ❤️)', banner:'🍗 Roast turkey wrapped and tucked away', requiresFlag:'flag_erik_turkey_stock' },
    { item:'item_rod',        label:'🎣 Fishing rod — {price} coins', banner:'🎣 A fine rod. Bog’s shack is by the pond!' },
    { item:'item_hook_basic', label:'🪝 Basic hook — {price} coins', banner:'🪝 Good for pond fish.' },
    { item:'item_hook_fine',  label:'✨ Fine hook — {price} coins', banner:'✨ The big ones love this one.' },
  ],
};
