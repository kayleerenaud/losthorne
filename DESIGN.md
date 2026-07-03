# Losthorne: Last Light — The Design Bible

*Everything about the game, in one place. ✅ = already in the prototype; 🔜 = designed, not built yet.*

---

## 1. The Big Picture

- **Title:** Losthorne: Last Light. The game is named after the world itself.
- **What it is:** A two-player co-op adventure game, playable in a web browser on iPhone. ✅
- **Eventually:** works on phones, iPads, computers — any device with a web browser. Prototype is phone-first.
- **Story seed:** a lone village in a conquered world — all the surrounding land has fallen; this village is the last one standing, and actually doing pretty well. (In the spirit of *Asterix & Obelix*.)
- **Tone:** creative and adventurous, not too violent. Fighting exists, but it's about protecting yourself and your village, not attacking people.
- **Setting:** Middle Ages / medieval village, with mythology woven in.
- **Story frame:** You are ordinary young villager-warriors — small side characters, not the chief and not a general. The chief guides you and gives tasks.

## 2. Multiplayer

- Two players at once, co-op.
- **Room codes:** one player starts a game, sends their friend the code, friend joins the same room.
- There is NO central computer/screen — each player plays through their own phone with a full view.
- Solo play is also possible; the game shines with two.
- Friends help each other: players don't attack each other; they can supply each other with weapons/goods.
- The scale stays individual — you're warriors, not army commanders.
- Status: room-code screen exists but multiplayer is mocked ✅. Real multiplayer comes AFTER the story/quests are built out.

## 3. Controls & Interface

- **Playable with ONE finger or two.** Press & drag anywhere on open screen = an invisible joystick that appears under your finger and moves the player. Combat comes from the button cluster, so a second finger is optional — two-finger play (move + fight simultaneously) still works. ✅
- **Top-down camera, like Zelda.**
- **Landscape/horizontal always** — even the login screen. The app renders horizontally no matter how the device is held. ✅
- **Visible on-screen controls** — the combat/inventory buttons are always shown ✅; the movement joystick is the exception: invisible until pressed (superseded the original always-visible joystick). ✅
- Combat gestures (see §7): slice swipe, smash, pull-back archery.
- **Feel target:** Genshin Impact's phone-smoothness + Zelda's intuitiveness.
- **Layout reference — Genshin Impact mobile** (game8.co controls guide):
  - Movement joystick: invisible until pressed; appears wherever the finger lands on open ground ✅
  - Attack cluster lower-RIGHT: big attack button in the corner, smaller buttons arced around it ✅ (context button, 🏹/🗡️/👊 weapon switch, 🎒 satchel)
  - **THE CONTEXT BUTTON** ✅: ONE slot that morphs to what you need right now — 💬 talk (near people), 🚪 enter/leave (at shop doors), 🤲 GRAB (near turkeys), 💥 smash (near enemies/dummies, hold to charge), and when nothing's happening: 🎵 play your instrument (Cippy/Dusty) or 💤 rest (Oak/Willow) — the leisure activity from §4.
  - **Dash** ✅: double-tap anywhere on open ground = a quick burst forward (gesture, not a button — controls stay uncrowded). Short cooldown.
  - Skill buttons support tap AND hold-for-stronger ✅ (tap 💥, or press-and-hold the attack button = smash). The 💥 button dims only during a smash cooldown, never during a slice ✅
  - Attack gestures start FROM the attack button: tap = quick attack, drag from it = aimed slice / bow pull-back ✅
  - Bow aiming: pull-back slingshot (touch-native take on Genshin's aim mode) ✅
  - Future, from the same reference: sprint/evade button with stamina 🔜, camera sensitivity settings (N/A for fixed top-down), pinch-zoom 🔜?
- **Inventory:** a satchel button (🎒 bag icon) opens your bag — slots holding armor, artifacts, supplies, food. Always accessible. Tap an item to enlarge it and see its stats, then decide whether to use it. Purchases (bread, potions) go INTO the satchel rather than taking effect instantly. ✅
- **Two weapons carried at once**, quick-switch between them. ✅ (sword ↔ bow)
- **Dialogue:** tap next-next-next through each line an NPC says. ✅
- **UI zones are fixed so text never overlaps** ✅: dialogue bottom-center; notifications top-center only; potion status right side under the coins. The quest tracker is now SLIM — small, quiet, translucent, top-left. ✅
- **Breakaway cutscenes:** the game pauses to tell story bits, then returns to gameplay. 🔜
- **Map screen:** shows where you are. Unvisited territories are just outlines; they color in once explored. Bigger maps can be BOUGHT from villagers to reveal other islands — some islands don't appear at all until you buy the next map. 🔜

## 4. The Four Playable Avatars

Each avatar has their own unique personal side quest that the others don't — replaying with a different character is a different experience.

1. **Cippy**: starts as a normal villager (no armor). Short, curly, dirty-blonde hair. Brown vest as his core piece over regular Middle Ages clothing. Carries a little **wooden flute** he can play.
2. **Oak**: black, roughly ruffled hair. Leather **jacket**, tunic and pants, leather **belt with a cool silver buckle**.
3. **Willow** (female): darker skin. Hair tied in a **big bun** held by a **pin made out of bone**. Wears a dress, a **fur shawl/cape**, and a belt.
4. **Dusty** (female): blonde with **two Dutch braids**. Pants and a shirt. She ALWAYS carries a **mini guitar/lute across her back**.

- **Instruments are leisure:** when idle, instrument-carrying avatars can sit and play music — a chill, rejuvenating activity.
- **Musical taming:** avatars with an instrument can tame animals by playing music; avatars without one tame animals a different way.
- **Armor progression:** every avatar starts plain and builds up — buy armor as you go. 🔜 (avatars DO start plain ✅, but there are no armor items, shops, or visual upgrades in the code yet)

## 5. NPCs (the Cast)

| Name | Role | Details |
|---|---|---|
| **Chief Bonbottom** | Village chief, quest-giver | A peaceful chief (BONBOTTOM, all one word). Stands in the village square (he's the chief — no shop). Gives quests and congratulates you. ✅ |
| **Dorgan** | Potion-maker (druid/wizard type) | His potions grant a **RANDOM temporary power** — rolled the moment you BUY one (100 coins), so each bottle in your satchel already knows what it is. His shop is CLOSED ("out of supplies") until you finish the blueberry quest for him. Bring supplies; **better materials = potion lasts longer** 🔜. **Underwater-breathing potion** 🔜. ✅ |
| **Erik** | Trader | **Erik with a K** — a TRADER (not a traitor). Helps supply you, but you must PAY. He gives nothing for free. Gives the turkey challenge (catch 3 → 90 coins, teaches GRAB); afterward he also sells **roast turkey meat** (15 coins, +1½ ❤️). ✅ |
| **Modo** | Blacksmith | IN THE GAME ✅ — sells the forged sword (200), hunting bow (100), and arrow packs (80). Personal-scale gear only — no siege weapons. Armor 🔜 |
| **Jesse** | Traveling storyteller/merchant | Travels across the whole map, so she brings NEWS — new islands, new information, rumors. Like the mailman in Zelda, she approaches YOU, and it's a breakaway moment. She *sings* her stories — music plays while the words appear on screen. Dresses more colorfully than everyone else: a **colorful dress with beads** and **tons of jewelry from different places on the map**. 🔜 |
| Villagers | Ambience | Small characters you can greet — people just being pleasant, not quest-givers. They might occasionally give you something. 🔜 |
| **Little Tommy** | Quest hook | A village kid who gets kidnapped (see the Barbarian, §9). 🔜 |

## 5b. Shops are BUILDINGS you enter ✅

- Erik, Dorgan, and Modo each live INSIDE a shop building marked by a hanging **icon sign**: 🪙 (trade), 🧪 (potions), 🔨 (forge).
- Walk to the door → the context button becomes 🚪 ENTER → inside is a themed workshop (props match the trade) where you approach and talk/buy. Walk onto the door mat to leave.
- To talk to a shopkeeper you must ENTER their shop; only the Chief is met outdoors.

## 6. Economy & Money

- Start with **10 coins** — exactly one loaf of bread. Free forest berries handle hunger; money must be EARNED. ✅
- **You start with your FISTS** — no weapons. A goblin takes ~8 punches, or 3 hits with a bought sword. Earn coins → buy gear from Modo. ✅
- **Coins are never automatic.** Coins come ONLY from people (quest rewards) and special boss hoards. Regular creatures like goblins drop NOTHING — treasure is what makes beating the Troll special. ✅
- **Price anchors:** bread **10** · turkey meat **15** (price is a placeholder guess) · mystery potion **100** · forged (basic) sword **200** · hunting bow **100** · arrow pack **80** (10 arrows — pack size is a placeholder guess) · horse ≈ **500** · best sword ≈ **300** · small hammer ≈ **100**. Premium materials cost more. ✅ (bow is cheaper up front but arrows are a recurring cost, so it totals more than the sword — intentional)
- **Challenge rewards:** goblins **110 coins** · berries **a free Stoneskin potion** (no coins — the potion is the pay) · turkeys **90 coins**. Total: 10+110+90 = **210 → the 200-coin sword with 10 left over for bread**. Erik even points it out: "just enough for a basic sword." ✅
- Money is spent on: weapons/armor, supplies for Dorgan's potions, food, animal feed, **bridge tolls** (fancier villages charge to cross into their land), bigger maps, small taxes.
- **Village specialty armor:** every village's armory is different and suited to different things — like every country having its own soccer uniform. The lake village sells **underwater armor** (wanted before the Kraken). 🔜
- Rewards: goblins drop coins ✅; the Troll guards a treasure hoard (big payout) 🔜.

## 7. Combat

- **Zelda-style fighting.**
- **Slice** — swipe gesture (any hand weapon). ✅
- **Smash** — a CHARGED strike: hold ~⅓s–3s then release = **mini smash**; hold the full **3 seconds** = **FULL smash** (double damage, big radius). While charging you are ROOTED in place — that's the risk. A ring fills around you and flashes gold when the full smash is ready. ✅
- **Archery** — pull back for power, slingshot-style: longer pull = more powerful shot (dashed aim line, power-scaled speed & damage). **Arrows are limited** — each shot spends one; buy packs from Modo. ✅
- **Enemy health bars appear only once you start attacking** that enemy. ✅
- **Move strengths are OBVIOUS:** every hit shows a floating damage number — slice = small white "-1", smash = big orange "-2", power arrows in between; bigger hit, bigger number. ✅
- **Potion effects are VISIBLE:** an active potion wraps the player in a colored pulsing aura (orange = strength, cyan = speed, silver = stoneskin) plus a named countdown under the coin counter. ✅
- Potion powers (random, 30s): 💪 Ogre Strength (+2 damage on every hit), ⚡ Wind Speed (much faster), 🛡️ Stoneskin (blows bounce off). Status shows as a **depleting purple bar**. **Dying removes your active potion.** ✅ *(first-pass powers — subject to change)*
- Training dummies in the village square for safe practice (5 hits each); they rebuild after being destroyed. ✅
- **The GRAB function** ✅: get close to a catchable creature (turkeys for now) and a 🤲 GRAB button appears — same contextual slot as the 💬 talk button. Grabbing is the seed of the future taming mechanic (§10).

## 8. Health, Food & Death

- Start with **5 hearts**; damage comes in **half-hearts**. ✅
- **Hunger:** go too long without eating and you slowly lose half-hearts (currently ~75s per half-heart — tunable). ✅
- **Food in the wild:** berries ✅, wild turkey ✅ (catch them — they flee!), fish 🔜. In villages: buy food (Erik's bread ✅, Erik's roast turkey +1½ ❤️ ✅).
- **THE BERRY RULE:** only **blueberries** are safe. Picking one puts it **in your satchel** — eat it from there by choice (+½ ❤️) or save it for delivery; no auto-eating. **Red berries = instant death** on touch. ✅
- **Special meal:** a multi-ingredient cooked dish (blueberries among the ingredients) restoring **up to 4 hearts** — never beyond your heart cap. 🔜
- **Heart cap:** 5 hearts until the Evilcorn is defeated (see §9) → then **10 hearts** going into the final boss. 🔜
- **Death = respawn at the edge of that territory.** 🔜 (currently the code respawns you at the village square — only one territory exists so far)
- Bread restores 1 ❤️ and quiets hunger. ✅

## 9. The World: Territories, Enemies & Bosses

**Territories:** the village (home), forest/woods, mountains (rocky), desert, lake. Each has its own creatures and boss. Respawn point = that territory's edge.

**The village (home base):** resupply, sleep, your own house — you start with a **hut** and can expand/upgrade it over time. 🔜

### Regular enemies
- **Goblins** ✅ — small roamers; encounters get thicker deeper into the forest. 6 punches (or 2 sword hits) to defeat.
- **The Visiting Champion** ✅ (quest 4) — a larger human who FIGHTS BACK: raises his shield (unhittable), telegraphs a wind-up (get clear or block!), then strikes hard (2 half-hearts). Learn the window between shield-down and wind-up. Defeat him WITHOUT killing him — it's an entertainment fight — and his shield becomes yours.
- **Wisps** 🔜 — little magical things.
- **Bears** 🔜 — big wild animals.
- **Giant wolves** 🔜 — abnormally-sized scary wolves hunting in PACKS. Tougher than goblins (take notably more hits). **Pack rule:** kill the whole pack within a time window; if one is left standing shortly after the others fall, it **summons more wolves**.
- **Piranhas** 🔜 — mini enemies in the water.

### Boss ladder (each in a different territory)
1. **The Witch** 🔜 — a mini-boss in the wilds.
2. **The Mountain Troll** 🔜 — a GIANT troll in the mountains. Quest hook: something's been eating all the mountain goats. The fight happens **mostly in the dark**. You don't win with pure violence: **bring him into the light** / survive until daytime — he **sleeps when it's day**, forgets about you, and you slip away. Prep quest teaches **fire-making** (§10). **Reward: his treasure hoard.**
3. **The Barbarian** 🔜 — a rogue barbarian knight who **kidnaps little Tommy**; the fight is hard because the kid is on his horse. The horse has **TWO HEADS**. Defeat the barbarian WITHOUT killing the horse — **you win the two-headed horse**: extra powerful, and it looks cool.
4. **The Lake Kraken** 🔜 — a giant octopus lake monster with piranha minions. Needed to face it: Dorgan's **underwater-breathing potion**, the lake village's **underwater armor**, and the **Trident**. **Defeat: cut off each arm, one by one.** Afterward, **harvest its beak** and craft a special shield.
   - **The Trident:** owned by the chief of the neighboring lake village. To borrow it, win **three trials**: 1) **archery**, 2) **swimming**, 3) **kindness** — help someone in his village so he sees you're a good person. The trident is **borrowed** — return it, or that village goes to WAR with yours.
5. **The Evilcorn** 🔜 — second-to-last boss. A **unicorn gone bad** — cursed. You don't kill it: **reverse the curse** and heal it back into a true unicorn. It grants **+5 hearts** (cap becomes 10).
6. **THE FINAL BOSS: The Shapeshifting Wizard** 🔜 — a human wizard, fought on land. He **summons creatures** and **shapeshifts** through harder versions of the mini-bosses; his final form is a **giant dragon**. Once every form is beaten, his energy is spent — he becomes a **weak but fast human**, and **one final blow** ends him. Beating him beats this storyline.

## 10. Quest Structure & Story Rhythm

- **The rhythm:** challenge → congratulations + reward → **free exploration** → the next hook. ✅
- **Terminology:** the small onboarding tasks are "challenges"; QUESTS are the big story beats. The challenges guide you through town and teach every control.
- **The onboarding chain flows person-to-person** ✅: shopkeepers hint "come back later" until their moment → the Chief gives the goblin challenge (110 coins) and, at the payout, points you to Dorgan ("you could use strength… or a shield") → DORGAN himself asks for 4 blueberries and brews you a **free Stoneskin potion** (his shop opens; he points at Erik when you're broke) → ERIK teaches the GRAB with his turkey scheme (turkeys caught early count retroactively) and pays 90 — "just enough for a basic sword" → Modo's forge → **THE FIRST REAL QUEST: the visiting champion** (the §10 tutorial-fight, now drafted): beat him in the square, win his shield.
- **Your shield (DRAFT mechanic, awaiting approval):** holding to charge a smash RAISES the won shield — blocks blows while you stand your ground. One button, no crowding; the champion literally teaches you his own move. 🚩
- **Quests can be turned in to someone other than the giver:** the blueberry quest is GIVEN by the chief but DELIVERED to Dorgan — he congratulates you, pays 40 coins, and only then opens his potion shop. ✅
- **Quest 3 — Erik's turkeys** ✅: catch 3 wild turkeys in the meadow (they flee — chase and GRAB). Reward 50 coins + Erik starts selling turkey meat. Teaches the grab function. (Turkey count 3, 30s delay before offer, and meadow location are placeholder guesses.)
- Big quests come from chiefs; villagers giving mini-quests is an idea under discussion (see §13).
- **Between-boss tasks teach the skill the next boss requires:**
  - A village teaches **fire-making** → hold the Troll off until morning.
  - Traders from your village get shipwrecked → rescue them → **learn to swim** → needed for the Kraken.
  - A farmer's animal runs away → catch it → **learn to tame animals** → needed before you can get your horse.
  - **Negotiation quests:** when your village runs low on a supply, travel to another village and negotiate for it.
- **Tutorial (first quest):** very basic, teaches the fighting controls, happens INSIDE the village. A challenger from another village arrives for an entertainment fight with the village's toughest — and the chief volunteers YOU. A story breakaway introduces the plot. 🔜 (current tutorial is a simpler goblin quest ✅)
- **Taming an animal** takes three parts: calm it (music, if you carry an instrument), **learn to ride it**, and **feed it** — which means buying animal food. 🔜
- Each of the 4 avatars has **one unique personal side quest**. 🔜

## 11. Art & Sound

- **Style:** like *Puss in Boots: The Last Wish* — slightly less detailed so it renders fast in a browser.
- **NOT pixelated.** Really clean.
- **Palette:** medieval and a little darker — mythology, not bright-cheerful.
- Jesse's storytelling has its own music (she sings; the words appear on screen).
- Current prototype uses placeholder shapes ✅; the real art pass comes after gameplay feels right. Hand drawings can become the actual game art (photograph paper drawings → sprites).

## 12. Accounts & Tech

- **Logins:** Google login + Supabase login eventually; mocked in the prototype ✅.
- **Build order:** 1) full story + quests → 2) real multiplayer (room codes via Supabase Realtime) → 3) real logins/saves.
- **Repo:** `github.com/kayleerenaud/losthorne` (public).
- Prototype is a single self-contained file: `prototype/index.html` — no build step, no server. ✅

## 13. Open Questions

- Exact number of mini-bosses.
- Arrow pack size (currently 10 — placeholder guess).
- Do villagers give mini-quests, or only chiefs give quests?
- Max players per room: exactly 2, or more?
- Day/night cycle mechanics (the Troll fight implies one — how does it work elsewhere?).
- The desert territory: which boss/creatures live there?
- The Witch mini-boss: her mechanics and territory.
- Wisp behavior.
- Whether you start with a pet in your hut.
- House expansion mechanics.
- The special meal: recipe ingredients and how cooking works.

---

*Version history:*
- *v0.1 — title/login → room code → character select → village, goblin quest, two-thumb combat, hearts/hunger/berries*
- *v0.2 — landscape, visible joystick + attack button, slower hunger*
- *v0.3 — quest state machine (congrats + explore), blueberry quest, regrowing bushes*
- *v0.4 — forced-landscape rendering everywhere, works in any window shape*
- *v0.5 — slice/hold-to-SMASH, pull-back archery, weapon switch, random potions, training dummies, goblin respawns*
- *v0.6 — floating damage numbers, potion auras, satchel inventory (tap item → stats → use), 50-coin start, creatures drop coin piles, fixed UI text zones*
- *v0.12 — avatar names (Cippy/Oak/Willow/Dusty), morphing context button, double-tap dash, shop interiors with icon signs, satchel blueberries, story rework (110/potion/90), the Visiting Champion + won shield, dev testing menu (#dev)*
- *v0.7 — Genshin-referenced control cluster, 💥 smash skill button, contextual 💬 talk button near NPCs*
- *v0.8 — one-finger play: invisible anywhere-joystick, attack gestures anchored to the attack button, smash-dim fix*
