// DATA: item definitions (DESIGN.md §3 inventory, §8 food). Effects are NAMED here,
// implemented in engine — adding an item never touches engine files unless it needs a new effect kind.
export const ITEM_DEFS = {
  item_bread:  { id:'item_bread', ic:'🍞', nm:'Warm Bread',
    st:'Restores 1 ❤️ and quiets your hunger.<br><i>"Fresh-ish!" — Erik</i>',
    effect:{ kind:'heal', halfHearts:2, resetHunger:true, banner:'You eat the bread. +1 ❤️', float:'+1 ❤️' } },
  item_potion: { id:'item_potion', ic:'🧪', nm:'Mystery Potion',
    st:'A RANDOM power for 30 seconds:<br>💪 Ogre Strength (+1 damage on every hit)<br>⚡ Wind Speed (run much faster)<br>🛡️ Stoneskin (blows bounce off you)<br><i>"Courage chooses its own shape." — Dorgan</i>',
    effect:{ kind:'mystery_potion' } },
};
