// DATA: Modo (DESIGN.md §5) — blacksmith. Personal-scale gear only.
export default {
  id:'npc_modo', name:'Modo the Blacksmith',
  building:{ x:1030, y:1300, sign:'🔨' },
  interior:{ w:520, h:340, props:[['🔥',120,120],['⚒️',400,120],['🛡️',330,95]] },
  pos:{x:260,y:120},
  look:{ outfit:'#4f4a45', hat:false },
  lines:["Modo likes warriors who hit hard. Fists are free — steel is not.",
         "A forged sword, a hunting bow, arrows by the pack. Coins first, friend."],
  shop:[
    { item:'item_sword',  label:'🗡️ Forged sword — {price} coins',      banner:'🗡️ The sword is yours. Switch weapons to draw it!' },
    { item:'item_bow',    label:'🏹 Hunting bow — {price} coins',        banner:'🏹 The bow is yours — you\'ll need arrows!' },
    { item:'item_arrows', label:'🎯 Arrow pack (10) — {price} coins',    banner:'🎯 +10 arrows in your quiver' },
  ],
};
