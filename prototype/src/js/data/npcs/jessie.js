// DATA: Jessie the traveling bard (DESIGN.md §5). You first meet her CURSED as the Witch; breaking
// the curse reveals her. She's not a village fixture yet — this entry exists for the reveal dialogue
// and her promise of future aid. (Kaylee 2026-07-04: "Jessie" is the unified name, once "Jesse".)
export default {
  id:'npc_jessie', name:'Jessie',
  pos:{x:-999,y:-999},   // not placed in the world — revealed only inside the hut
  look:{ outfit:'#b0498a', hat:false },
  reveal:[
    "…Oh. OH. I can feel my own name again. Jessie. I'm — I'm JESSIE.",
    "A curse took me a whole season back and wore me like a coat — cat, crow, adder, whatever kept you swinging. Steel only fed it. But that potion… you MADE that. For me. A stranger.",
    "I'm a bard, warrior. I walk every road there is, and I hear everything the roads say. So hear THIS, and hold me to it:",
    "When you're in your darkest corner — the fight you can't win, the night that won't end — call, and Jessie will come. That's my song to you. A promise. Paid in full, someday, when you need it most.",
  ],
};
