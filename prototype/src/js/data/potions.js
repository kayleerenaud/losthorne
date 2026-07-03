// DATA: Dorgan's random potion powers (DESIGN.md §7). First-pass powers, subject to change.
export const POTION_POWERS = {
  potion_strength: { id:'potion_strength', ic:'💪', nm:'Ogre Strength', dmgBonus:2 },
  potion_speed:    { id:'potion_speed',    ic:'⚡', nm:'Wind Speed',    speedMult:1.75 },
  potion_stoneskin:{ id:'potion_stoneskin',ic:'🛡️', nm:'Stoneskin',    blocksDamage:true },
};
export const POTION_DURATION_MS = 30000;
