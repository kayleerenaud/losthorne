# Losthorne: Last Light — The Complete Design Bible

*Every decision from the design session of Kaylee, Josiah & Malachi — July 2, 2026.*
*Nothing here is forgotten. Items marked ✅ are already in the prototype; everything else is designed-but-not-built-yet.*

---

## 1. The Big Picture

- **Title:** Losthorne: Last Light. The game is named after the world itself. [Kaylee + boys]
- **What it is:** A two-player co-op adventure game, playable in a web browser on iPhone. ✅
- **Eventually:** works on phones, iPads, computers — any device with a web browser. Prototype is phone-first. [Kaylee]
- **Inspiration:** *Asterix & Obelix* comics — a lone village where all the surrounding land has already been conquered; they're the last one standing, and actually doing pretty well. The chief keeps protecting the village. [Josiah]
- **Tone:** Not too violent — creative. Minecraft-style: has some fighting but it's about *protecting yourself and your village*, not attacking people. [Josiah]
- **Setting:** Middle Ages / medieval village, with mythology woven in.
- **Story frame:** You are NOT the chief and NOT a general (both considered and rejected — "you should be a smaller side character"). You're ordinary young villager-warriors. The chief guides you and gives tasks. [both boys]

## 2. Multiplayer

- Two players at once, decided over solo-only. [both]
- **Room codes, like Jackbox:** one player starts a game, sends their friend the code, friend joins the same "room." [Josiah]
- **Unlike Jackbox:** there is NO central computer/screen. Each player plays through their own phone with a full view. [Josiah]
- Split-screen was considered and REJECTED — phone screens are too small. [both]
- Solo play is also possible ("maybe you can play with one player but especially if it's two player").
- Friends help each other: you don't attack each other; you can supply each other with weapons/goods.
- You are not controlling big armies — it stays individual-scale. (Catapults considered, rejected: "you can't really use a catapult by yourself.")
- Status: room-code screen exists but multiplayer is mocked ✅. Real multiplayer comes AFTER the story/quests are built out. [Kaylee]

## 3. Controls & Interface

- **Two fingers** (not one). [Josiah & Malachi, the very first decision]
- **Top-down camera, like Zelda.** [Kaylee]
- **Landscape/horizontal always** — even the login screen. The app renders horizontally no matter how the device is held; the user will naturally rotate. ✅ [Kaylee]
- **Visible on-screen controls** — the joystick/toggle must be SEEN on screen, not invisible. ✅ [Kaylee]
- Combat gestures (see §7): slice swipe, smash, pull-back archery.
- **Reference games:** Genshin Impact plays well on a phone (though Kaylee doesn't love its interface); Zelda is more intuitive. Goal = Genshin's phone-smoothness + Zelda's intuitiveness. [Kaylee]
- **Inventory:** a satchel button on screen opens your bag — slots holding armor, artifacts, supplies, food. Always accessible. [Josiah]
- **Two weapons carried at once**, quick-switch between them. ✅ (sword/bow switch button) [Josiah]
- **Dialogue:** tap next-next-next through each line an NPC says. ✅
- **Breakaway cutscenes:** the game pauses to tell story bits, then returns to gameplay — like other adventure games.
- **Map screen:** shows where you are. Territories you haven't visited are just outlines; once visited they get colored in. You can BUY bigger maps from villagers to reveal other islands — some islands don't even appear until you buy the next map (quest hook: "you don't realize there's another island"). [Josiah + Kaylee]

## 4. The Four Playable Avatars

Each avatar ALSO gets their own unique personal side quest that the others don't have — so replaying with a different character is a different experience. [Kaylee]

1. **Flute Boy** [Malachi's design]: starts as a normal villager (no armor). Short, curly, dirty-blonde hair. Brown vest as his core piece over regular Middle Ages clothing. Carries a little **wooden flute** he can play.
2. **Leather Lad**: black, roughly ruffled hair. Leather **jacket** (the "jacket and shorts, what a weirdo" joke → final: tunic and pants). Leather **belt with a cool silver buckle**.
3. **Bone Pin** (female): darker skin. Hair tied in a **big bun** held by a really cool **pin made out of bone**. Wears a dress, a **fur shawl/cape**, and a belt. [Kaylee]
4. **Lute Girl** (female): blonde with **two Dutch braids**. Pants and a shirt. Her unique item: she ALWAYS carries a **mini guitar/lute across her back**. [Kaylee]

- **Instruments are leisure:** when you're not doing anything, instrument-carrying avatars can sit and play music — a chill, *rejuvenating* activity. [Kaylee]
- **Musical taming:** avatars with an instrument can tame animals by playing music; avatars without one tame animals a different way. [both]
- **Armor progression:** every avatar starts plain and builds up — buy armor as you go. ✅ (start plain; armor shops not yet built)

## 5. NPCs (the Cast)

| Name | Role | Details |
|---|---|---|
| **Chief Bonbottom** | Village chief, quest-giver | Peaceful chief (name journey: "war chief" rejected, "Chief Barlet" rejected → **BONBOTTOM, all one word**). Gives you tasks, congratulates you when done. ✅ |
| **Dorgan** | Potion-maker (druid/wizard type) | Inspired by the druid in Asterix. His potions grant a **RANDOM temporary power** — you don't choose it, it's given. You must bring him supplies; **better materials = potion lasts longer**. Makes an **underwater-breathing potion** (needed for the lake). (Name was transcribed both "Dorgan" and "Dogon" — we standardized on **Dorgan**.) ✅ (mystery potion, 30 coins, random power) |
| **Erik** | Trader | **Erik with a K.** TRADER, not traitor (important distinction, much discussed 😄). Helps supply you — but you must PAY. He gives nothing for free. ✅ (sells bread) |
| **Moto Moto** | Blacksmith | Weapons & armor. ~100 coins for a small hammer, ~300 for the best sword. Big siege items rejected. 🔜 |
| **Jesse** | Traveling storyteller/merchant | Girl name Malachi likes. Travels across the whole map, so she brings NEWS — new islands, new information, rumors. Like the mailman in Zelda: she approaches YOU and it's a breakaway moment. She *sings* her stories — music plays while the words appear on screen. Wears something more colorful than everyone else: a **colorful dress with beads**, and **tons of jewelry from different places on the map** (because she travels so much). 🔜 |
| Villagers | Ambience | Small characters you can greet — "people just being pleasant," not quest-givers. They might occasionally give you something. 🔜 |
| **Little Tommy** | Quest hook | A village kid who gets lost/kidnapped (see Barbarian, §9). 🔜 |

## 6. Economy & Money

- Start with **500 coins**, automatically. ✅
- **Price anchors** (so everything can be priced consistently): loaf of bread ≈ **8**, horse ≈ **500**, small hammer ≈ **100**, best sword ≈ **300**. Premium/precious materials cost more. [Josiah, "so Claude can easily price things out"]
- Money is needed for: weapons/armor (Moto Moto), supplies for Dorgan's potions, food, animal feed, **bridge tolls** (fancier villages charge a toll to cross into their land, like a toll road), bigger maps, and small taxes.
- **Village specialty armor:** like every country's soccer uniform is different, every village's armory is different and suited to different things — e.g., the lake village sells **underwater armor** you'll want before fighting the Kraken. [Kaylee]
- Rewards: goblins drop coins ✅; the Troll guards a treasure hoard (big payout).

## 7. Combat

- **Zelda-style fighting.** [Josiah]
- **Slice** — swipe gesture (any hand weapon). ✅
- **Smash** — heavier strike. ✅ (implemented as press-and-HOLD, then release: shockwave all around you, heavy damage, big knockback)
- **Archery** — pull back for power, like a slingshot: longer pull = more powerful shot. ✅ (dashed aim line, power-scaled speed & damage)
- **Enemy health bars appear only once you start attacking** that enemy, then tick down. ✅
- Weapons carried: two at a time with quick switch. ✅ (sword ↔ bow)
- **Dorgan's potion powers** (random, 30s): 💪 Ogre Strength (extra damage), ⚡ Wind Speed (move faster), 🛡️ Stoneskin (blows bounce off). ✅ *(the "random gift" rule is the boys' design; these three specific powers are Claude's first pass — change freely)*
- Training dummies in the village square for practice. ✅ *(Claude addition for playtesting)*

## 8. Health, Food & Death

- Start with **5 hearts**; damage taken in **half-hearts**. ✅
- **Hunger:** if you haven't eaten in a while you slowly start LOSING half-hearts. ✅ (currently ~75 seconds per half-heart — tune as needed; original 24s was too fast [Kaylee])
- **Food in the wild:** berries, wild turkey, fish. In any village: buy food (e.g., Erik's bread ✅).
- **THE BERRY RULE:** only eat **blueberries** (heal +½ ❤️ ✅). **Red berries = you automatically DIE** and restart at the edge of that territory. ✅ [Josiah — arguably the most important rule in the game]
- **Special meal:** a multi-ingredient cooked food (blueberries among the ingredients) that restores **up to 4 hearts at once** — but NEVER beyond your current heart cap. 🔜
- **Heart cap upgrade:** you stay capped at 5 hearts until you defeat the **Evilcorn** (see §9), who grants **+5 more → 10 hearts total** going into the final boss. 🔜
- **Death = respawn at the edge of that territory** (not back at the village). ✅ (simplified for now)

## 9. The World: Territories, Enemies & Bosses

**Territories:** the village (home), forest/woods, mountains (rocky), desert, lake. Each territory has its own creatures and its own boss. Respawn point = that territory's edge.

**The village (home base):** resupply, sleep, your own house — you start with a **hut** and can expand/upgrade it over time. 🔜

### Regular enemies (the wilds)
- **Goblins** ✅ — small roamers; you shouldn't run into monsters constantly, but deeper into the forest there are more.
- **Wisps** 🔜 — little magical things.
- **Bears** 🔜 — abnormally big wild animals.
- **Giant wolves** 🔜 — abnormally-sized scary wolves that hunt in PACKS. Tougher than goblins (take way more hits — still reasonable). **Pack rule:** you must kill the whole pack within a certain time window; if even one is left standing (~5s after the others die), it **summons more wolves**. Not infinite — but punishing.
- **Piranhas** 🔜 — mini bad guys in the water.

### Boss ladder (each in a different territory)
1. **The Witch** 🔜 — a mini-boss, somewhere in the wilds.
2. **The Mountain Troll** 🔜 — a GIANT troll in the mountains. Quest hook: the chief says something's been eating all the mountain goats — go check it out. The fight happens **mostly in the dark** — everything is hard to see. You DON'T beat him with pure violence: you **bring him into the light** / survive until daytime, because he **goes to sleep when it's day** — then he forgets about you and you slip away. Prep quest teaches **fire-making** (see §10). **Reward: his treasure hoard — a ton of money.**
3. **The Barbarian** 🔜 — a rogue barbarian/knight (human enemy — humans are scary too). He **kidnaps little Tommy** and the fight is hard because **the kid is on his horse**. The horse has **TWO HEADS**. Decision: you do NOT kill the horse — defeat the barbarian and **you win the two-headed horse**: extra powerful, and it just looks cool.
4. **The Lake Kraken** 🔜 — a giant octopus lake monster (evolved from "sea serpent"). Piranha minions. To fight it you need: (a) Dorgan's **underwater-breathing potion**, (b) the lake village's **underwater armor**, and (c) the **Trident** (below). **Defeat: cut off each arm, one by one.** Afterward you can **harvest its beak** and craft it into a special shield.
   - **The Trident:** the chief of the neighboring lake village owns it. To borrow it you must win **three trials**: 1) an **archery** trial, 2) a **swimming** trial, 3) a **kindness** trial — help someone in his village with something, so he sees you're a good person. (Sword and horse-riding trials were considered and cut.) He lends it **temporarily** — you MUST return it. **If you don't give it back, that village goes to WAR with yours.**
5. **The Evilcorn** 🔜 — second-to-last boss. A **unicorn gone bad** — cursed by something that happened to it. You don't kill it: you **reverse the curse** and heal it back into a true unicorn. It thanks you with **+5 hearts** (your cap becomes 10). [the name "evil corn → Evilcorn" was too good to lose]
6. **THE FINAL BOSS: The Shapeshifting Wizard** 🔜 — a human wizard ("a human is the scariest"), on land. He **summons creatures** and **shapeshifts** through harder versions of the mini-bosses you've faced — you must defeat a set number of forms. His final form: a **giant dragon**. Once every form is beaten, he's spent all his energy and becomes a **weak but fast human** — it takes **one final blow** to end him. Beating him beats the game (this storyline).

## 10. Quest Structure & Story Rhythm

- **The rhythm:** quest → chief congratulates you + reward → **free exploration** → the chief calls with the next task. ✅ [Kaylee]
- **The chief's mini-tasks between bosses** each teach you a SKILL you'll need for the next boss: [Kaylee — key design rule]
  - Village where you **learn to make fire** → used to hold the Troll off until morning.
  - Traders from your village **shipwrecked on their boat** → rescue them → that's where you **learn to swim** → needed for the Kraken.
  - A farmer's **crazy animal ran away** → catch it → **learn to tame animals** → needed before you can get your horse. [Malachi]
  - **Negotiation quests:** when your village runs low on a supply, go to another village and negotiate for it.
- **Tutorial (first quest):** very basic, teaches the fighting controls, happens INSIDE the village so you don't have to leave. Final version: someone from another village comes to challenge the toughest person in the village — an entertainment fight — **and the chief volunteers YOU** ("wait, what?"). Story breakaway introduces the plot. 🔜 (current tutorial is a simpler goblin quest ✅)
- **Taming an animal** is more than calming it: calm it (music if you have an instrument), **learn to ride it**, and **feed it** — which means buying animal food. 🔜
- Each of the 4 avatars has **one unique personal side quest**. 🔜

## 11. Art & Sound

- **Style:** like *Puss in Boots: The Last Wish* — but slightly less detailed so it renders fast in a browser. [Josiah + Kaylee]
- **NOT pixelated.** Really clean. [Josiah]
- **Palette:** medieval and a little **darker** — it's mythology, so not bright-cheerful-colorful. [Josiah]
- Jesse's storytelling has its own music (she sings; words appear on screen).
- Current prototype uses placeholder programmer-shapes ✅; the real art pass comes after gameplay feels right. The boys' drawings can become the actual game art (photograph paper drawings → sprites).

## 12. Accounts & Tech Plan

- **Logins:** Google login + Supabase login eventually; **mocked in the prototype** ✅. [Kaylee]
- **Order of building:** 1) full story + quests built out → 2) real multiplayer (room codes via Supabase Realtime) → 3) real logins/saves. [Kaylee]
- **Repo:** `github.com/kayleerenaud/losthorne` (public — enables free GitHub Pages hosting later). ✅
- Prototype is a single self-contained file: `prototype/index.html` — no build step, no server. ✅

## 13. Open Questions (not yet decided)

- Exact number of mini-bosses ("how many mini-bosses are there usually?" — the ladder above is what's designed so far).
- Max players per room: exactly 2, or more?
- Day/night cycle mechanics (the Troll fight implies one — how does it work elsewhere?).
- The desert territory: which boss/creatures live there?
- The Witch mini-boss: her mechanics and territory.
- Wisp behavior.
- The "villager went crazy" side-quest fragment — keep or drop?
- Whether you start with a pet/cat in your hut (mentioned once, unconfirmed).
- House expansion mechanics.

---

*Changelog of built versions:*
- *v0.1 — title/login → room code → character select → village, goblin quest, two-thumb combat, hearts/hunger/berries*
- *v0.2 — landscape, visible joystick + attack button, hunger 3× slower*
- *v0.3 — quest state machine (congrats + explore), blueberry quest, regrowing bushes*
- *v0.4 — forced-landscape rendering everywhere, works in any window shape*
- *v0.5 — slice/hold-to-SMASH, pull-back archery, weapon switch, Dorgan's random potions, training dummies, goblin respawns*
