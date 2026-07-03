// DATA: Erik with a K (DESIGN.md §5) — trader; nothing is free.
export default {
  id:'npc_erik', name:'Erik the Trader',
  pos:{x:930,y:1195},
  look:{ outfit:'#2f5d7d', hat:false },
  lines:["Psst — bread, fresh-ish! Only 10 coins. Nothing in Losthorne is free, friend."],
  shop:[
    { item:'item_bread',  label:'🍞 Buy bread — {price} coins (goes to satchel)', banner:'🍞 Bread tucked into your satchel' },
    { item:'item_turkey', label:'🍗 Turkey meat — {price} coins (+1½ ❤️)', banner:'🍗 Roast turkey wrapped and tucked away', requiresFlag:'flag_erik_turkey_stock' },
  ],
};
