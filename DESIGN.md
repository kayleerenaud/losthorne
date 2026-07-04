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
  - **THE CONTEXT BUTTON** ✅: ONE slot that morphs to what you need right now — 💬 talk (near people), 🚪 enter/leave (at shop doors), 🤲 GRAB (near turkeys), 💥 smash (near enemies/dummies, hold to charge), and when nothing's happening: 🎵 play your instrument (Zippy/Dusty) or 💤 rest (Oak/Willow) — the leisure activity from §4.
  - **Dash** ✅: double-tap on open ground = a quick burst forward — and it works MID-RUN: while steering with the joystick, double-tap with a second finger to dash in your movement direction. (Gesture, not a button.) Short cooldown.
  - Skill buttons support tap AND hold-for-stronger ✅ (tap 💥, or press-and-hold the attack button = smash). The 💥 button dims only during a smash cooldown, never during a slice ✅
  - Attack gestures start FROM the attack button: tap = quick attack, drag from it = aimed slice / bow pull-back ✅
  - Bow aiming: pull-back slingshot (touch-native take on Genshin's aim mode) ✅
  - Future, from the same reference: sprint/evade button with stamina 🔜, camera sensitivity settings (N/A for fixed top-down), pinch-zoom 🔜?
- **Inventory:** a satchel button (🎒 bag icon) opens your bag. Tap an item to enlarge it and see its stats, then decide whether to use it. Purchases go INTO the satchel. **Permanent things (weapons, shield, rod, hooks, armor) show NO ×count** — once you have them, they're simply there; only consumables (bread, berries, potions, fish…) are counted, and only they count toward the bag badge. ✅
- **Shop lists SCROLL** — big inventories (Erik's) never push buttons off-screen. ✅
- **Two weapons carried at once**, quick-switch between them. ✅ (sword ↔ bow)
- **Dialogue:** tap next-next-next through each line an NPC says. ✅
- **UI zones are fixed so text never overlaps** ✅: dialogue bottom-center; notifications top-center only; potion status right side under the coins. The quest tracker is now SLIM — small, quiet, translucent, top-left. ✅
- **Breakaway cutscenes:** the game pauses to tell story bits, then returns to gameplay. 🔜
- **Map screen:** shows where you are. Unvisited territories are just outlines; they color in once explored. Bigger maps can be BOUGHT from villagers to reveal other islands — some islands don't appear at all until you buy the next map. 🔜

## 4. The Four Playable Avatars

Each avatar has their own unique personal side quest that the others don't — replaying with a different character is a different experience.

1. **Zippy**: starts as a normal villager (no armor). Short, curly, dirty-blonde hair. Brown vest as his core piece over regular Middle Ages clothing. Carries a little **wooden flute** he can play.
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
| **Erik** | Trader | **Erik with a K** — a TRADER (not a traitor). Helps supply you, but you must PAY. He gives nothing for free. Gives the turkey challenge (deliver 3 → 90 coins, teaches GRAB); afterward sells **roast turkey meat** (15, +1½ ❤️) plus the 🎣 **fishing rod and hooks**, and **BUYS turkeys (15) and fish (8/20)** — the repeatable income hub. ✅ |
| **Modo** | Blacksmith | IN THE GAME ✅ — sells the forged sword (200) from the start; bow (100) + arrow packs (80) unlock after the champion falls. **Modo also teaches SHIELD TRAINING** (challenge 5): wooden-sword sparring outside the forge with step-by-step HOLD instructions. Armor 🔜 |
| **Jesse** | Traveling storyteller/merchant | Travels across the whole map, so she brings NEWS — new islands, new information, rumors. Like the mailman in Zelda, she approaches YOU, and it's a breakaway moment. She *sings* her stories — music plays while the words appear on screen. Dresses more colorfully than everyone else: a **colorful dress with beads** and **tons of jewelry from different places on the map**. 🔜 |
| **Bog** | The Boater | IN THE GAME ✅ — and central to the first real quest: **the troll took him.** His shack sits CLOSED until you rescue him from the mountain cave. Once home, he owes you everything: teaches fishing (rod+hook required; his terms: half the catch, **the LARGER half if odd**), coaches your fumbles, and teaches **boat-driving** after your first trip. Won't row freeloaders or joyriders. |
| **Strax** | Mountain Man | IN THE GAME ✅ — appears in the mountain woods after the first wolf pack falls. Gruff, patient, calls you "small one". Teaches **FIRE-MAKING** (spark-timing mini-game) — the skill that later lights the troll's cave. Warns you to head home before night falls again. |
| **Reba** | Stablekeeper | IN THE GAME ✅ — dark ponytail, keeps the village stables (🐴 building, south side) with two horses: Maple and Biscuit. **No rides yet** — she always has a good excuse (thrown shoe, no farrier while goblins prowl, Biscuit bites). Horses/riding are a LATER feature (ANCHORS.horse=500); Reba plants the seed now. |
| Villagers | Ambience | Small characters you can greet — people just being pleasant, not quest-givers. They might occasionally give you something. 🔜 |
| **Little Tommy** | Quest hook | A village kid who gets kidnapped (see the Barbarian, §9). 🔜 |

## 5b. Shops are BUILDINGS you enter ✅

- Erik, Dorgan, and Modo each live INSIDE a shop building marked by a hanging **icon sign**: 🪙 (trade), 🧪 (potions), 🔨 (forge).
- Walk to the door → the context button becomes 🚪 ENTER → inside is a themed workshop (props match the trade) where you approach and talk/buy. Walk onto the door mat to leave.
- To talk to a shopkeeper you must ENTER their shop; only the Chief is met outdoors.

## 6. Economy & Money

- Start with **10 coins** — exactly one loaf of bread. Free forest berries handle hunger; money must be EARNED. ✅
- **You start with your FISTS** — no weapons. A goblin takes ~6 punches, or 2 hits with a bought sword. Earn coins → buy gear from Modo. ✅
- **Coins are never automatic.** Coins come ONLY from people (quest rewards) and special boss hoards. Regular creatures like goblins drop NOTHING — treasure is what makes beating the Troll special. ✅
- **Price anchors:** bread **10** · turkey meat **15** (price is a placeholder guess) · mystery potion **100** · forged (basic) sword **200** · hunting bow **100** · arrow pack **80** (10 arrows — pack size is a placeholder guess) · horse ≈ **500** · best sword ≈ **300** · small hammer ≈ **100**. Premium materials cost more. ✅ (bow is cheaper up front but arrows are a recurring cost, so it totals more than the sword — intentional)
- **Challenge rewards:** goblins **110 coins** · berries **a free Stoneskin potion** (no coins — the potion is the pay) · turkeys **90 coins**. Total: 10+110+90 = **210 → the 200-coin sword with 10 left over for bread**. Erik even points it out: "just enough for a basic sword." ✅
- Money is spent on: weapons/armor, supplies for Dorgan's potions, food, animal feed, **bridge tolls** (fancier villages charge to cross into their land), bigger maps, small taxes.
- **Village specialty armor:** every village's armory is different and suited to different things — like every country having its own soccer uniform. The lake village sells **underwater armor** (wanted before the Kraken). 🔜
- Rewards: quest payouts + **selling to Erik** ✅ — one general **"Sell items…"** button opens the satchel in *sell mode*; tap an item to see Erik's offer and accept or reject it (turkeys 15, fish 8/20, pearls 18). The Troll guards a treasure hoard 🔜.

## 7. Combat

- **Zelda-style fighting.**
- **Slice** — swipe gesture (any hand weapon). ✅
- **Smash** — a CHARGED strike: hold ~⅓s–3s then release = **mini smash**; hold the full **3 seconds** = **FULL smash** (double damage, big radius). While charging you are ROOTED in place — that's the risk. A ring fills around you and flashes gold when the full smash is ready. **Before you own the shield**, holding the attack button charges the smash; **once you own the shield, smash charging lives ONLY on the 💥 context button.** ✅
- **THE SHIELD (fully decoupled from attacking)** ✅: once won, HOLD the attack button = shield UP, nothing else. **Releasing deals NO damage.** A shield arm TIRES: **~3 seconds max**, shown as a draining gold ring around the bubble — then the shield forces down and must REST (~2.5s cooldown; ~1.2s after any shorter hold). No more hold-forever or spam-blocking. While the shield is up you are rooted.
- **Archery** — pull back for power, slingshot-style: longer pull = more powerful shot (dashed aim line, power-scaled speed & damage). **Arrows are limited** — each shot spends one; buy packs from Modo. ✅
- **Enemy health bars appear only once you start attacking** that enemy. ✅
- **Move strengths are OBVIOUS:** every hit shows a floating damage number — slice = small white "-1", smash = big orange "-2", power arrows in between; bigger hit, bigger number. ✅
- **Potion effects are VISIBLE:** an active potion wraps the player in a colored pulsing aura (orange = strength, cyan = speed, silver = stoneskin) plus a named countdown under the coin counter. ✅
- Potion powers (random, 30s): 💪 Ogre Strength (+2 damage on every hit), ⚡ Wind Speed (much faster), 🛡️ Stoneskin (blows bounce off). Status shows as a **depleting purple bar**. **Dying removes your active potion.** ✅ *(first-pass powers — subject to change)*
- Training dummies in the village square for safe practice (5 hits each); they rebuild after being destroyed. ✅
- **The GRAB function** ✅: get close to a catchable creature (turkeys for now) and a 🤲 GRAB button appears — same contextual slot as the 💬 talk button. Grabbing is the seed of the future taming mechanic (§10).

## 8. Health, Food & Death

- Start with **5 hearts**; damage comes in **half-hearts**. ✅
- **Hunger scales with EFFORT** ✅: idle/strolling ≈ 140s per half-heart, walking ×1.3, fighting/dashing ×2.2, climbing ×3. A quiet day in the village barely costs food; a mountain climb makes you ravenous. *(Rates = tunable guesses.)*
- **Food in the wild:** berries ✅, wild turkey ✅ (catch them — they flee!), fish 🔜. In villages: buy food (Erik's bread ✅, Erik's roast turkey +1½ ❤️ ✅).
- **THE BERRY RULE:** BOTH berry types now go into your satchel when picked. Blueberries: eat by choice (+½ ❤️) or deliver. **RED berries: deadly only if you EAT them** (they sit in the satchel with a warning). ✅
- **The CURSED STONE** ✅: a dark crystal deep in the north forest — TOUCH it and you die. (The instant-death-on-touch role moved here from the red berries.)
- **FISHING** ✅ (unlocks after Bog's rescue): rod (25) + hooks from Erik. **You CHOOSE your hook per cast** — 🪝 basic: small fish, forgiving reel; ✨ fine: BIG fish, but a **much smaller green window** (46–54 vs 34–66) AND a **longer fight** (3.6s in the green vs 2.6s) — small fish stay worth catching. Cast → ❗ bite → HOLD to reel/release to ease, stay in the green. **The tension bar is VERTICAL on the LEFT edge** so top banners never cover it (same for the fire meter and climb grip bar). No satchel while the line is out. Bog keeps half — **the LARGER half when odd**. Fish sell to Erik: 🐟 8 / 🐠 20. *(Prices/tuning = placeholder guesses.)*
- **Special meal:** a multi-ingredient cooked dish (blueberries among the ingredients) restoring **up to 4 hearts** — never beyond your heart cap. 🔜
- **Heart cap:** 5 hearts until the Evilcorn is defeated (see §9) → then **10 hearts** going into the final boss. 🔜
- **Death = respawn at the edge of that territory.** 🔜 (currently: village square)
- **Death costs, but never resets** ✅: you respawn with **2½ hearts** (food still matters!) and your quest progress is untouched — the champion is still waiting where you left him. No game restarts.
- Bread restores 1 ❤️ and quiets hunger. ✅

## 9. The World: Territories, Enemies & Bosses

**Territories:** the village (home) ✅, the MOUNTAINS ✅ (the second map — reached by the southern trail once the Chief sends you), forest/woods, desert, lake 🔜. Respawn point = that territory's entry ✅ (mountain deaths wake you at the mountain trailhead; village deaths at home — always 2½ hearts).
**The mountain map** ✅: pine woods with blue AND red berry bushes → wolf-pack territory → **THE CLIFF — a full-screen CLIMBING SCENE** (like entering the cave): you SEE your avatar on the rock face hauling ledge to ledge. HOLD 🧗 to climb (grip drains), release to settle back onto the nearest LEDGE and rest (grip refills there — nowhere else). Empty grip mid-wall = a visible FALL to the base and 2 hearts → summit plateau with a second wolf pack guarding the **cave mouth** → the troll's cave. Snack-birds (grab & eat, +1 ❤️ instantly) appear after the guard pack falls.

**The village (home base):** resupply, sleep, your own house — you start with a **hut** and can expand/upgrade it over time. 🔜
**The STONE-TROLL RUINS** ✅: mossy troll-shaped statues by the village's west fence (🔍 to inspect). The daylight lore lives HERE, in the world: trolls of the dark years wandered into the sunrise and froze forever. Chief Bonbottom points to the ruins when he sends you toward the mountains — the hint that daylight is the weapon, without ever naming what waits up there.

**Village landmarks & ambient life** ✅ (v0.19 — *numbers/flavor are prototype guesses, flag for review*): the world rewards poking at it, not just fighting in it.
- **Wishing well** 🪙 (center of the square): 🪙 to toss a coin (costs 1). ~1-in-8 the well "hums" and returns 5 — a tiny gamble/flavor loop, not an economy pillar. *(payout odds = guess)*
- **Signposts** 🪧 at the north (woods) and south (mountain-trail) exits: 🪧 to read in-world wayfinding + soft danger hints, reinforcing where quests point.
- **Pond ducks** 🦆 (Bog's pond): they paddle a lazy loop and leave wakes. Crowd them and they STARTLE to deeper water; **play your instrument (🎵) and they drift CLOSER** — the first seed of a future TAMING/creature system. *(charm radius/speeds = guesses)*
- **Petting** 🤲 at Reba's stable: Maple leans in warmly; Biscuit still snaps (she "counts the year") — reinforces Reba's not-yet-earned-horse beat through touch, not just dialogue.

**SWIMMING & THE DEEP** ✅ (v0.20 — *idea by Kaylee; tuning is prototype guess, flag for review*): the pond isn't just scenery — you can get in it.
- **Surface swim** (top-down, in the pond): wade past the water's edge and you start swimming — **slower** (~58% of walk speed), rendered as just your head above the water with a ripple ring. Reach the shore and you climb out automatically. You can still **DASH** while your head's up, but a swim-stroke burst **tires your arms** — a much longer recharge (~3.3s) than a land dash (~1s).
- **DIVE** 🤿 → a full **underwater scene** (side-view): sunbeams, darting fish that shy from you, seaweed, rocks, rising bubbles, and a **pearl** 🦪 you grab **into your satchel** (a real sellable item — Erik pays 18). A little **air ring** (status circle) drains as you stay under (~12s per breath).
- **Breathing** is positional: swim UP so your head breaks the waterline and the ring refills (~2s) — **just the head surfaces, you stay under**, and you **can't descend while catching your breath**. You do **not** leave the water on a breath.
- **Resurface** ⬆️ is the ONLY way out of the deep — an explicit button that pops you back up into the surface-swim pond. Run fully out of air and you take gulps of damage until you reach the top.
- *Future hooks:* deeper zones, things worth diving FOR (treasure, a quest item, a creature), and this reads as the seed of the lake territory (DESIGN §9 "lake 🔜").

### Regular enemies
- **Goblins** ✅ — small roamers; encounters get thicker deeper into the forest. 6 punches (or 2 sword hits) to defeat. **They can NEVER cross into the village** — the village boundary is protected ground; they stop at its edge.
- **The Visiting Champion** ✅ (quest 4) — a larger human who FIGHTS BACK, hard. He runs a fixed, LEARNABLE pattern: chase → shield up (unhittable) → swing → swing → a brief OPEN moment (green ring — strike now!) → repeat. He presses constantly and lands real hits (2 half-hearts each). 28 HP. Defeat him — it's an entertainment fight — and his shield becomes yours (permanent gear; it can never be consumed or lost).
- **Wisps** 🔜 — little magical things.
- **Bears** 🔜 — big wild animals.
- **Giant wolves** ✅ (mountains) — hunt in PACKS OF FIVE, much tougher than goblins (**18 HP**, hit for a full heart). **PACK TACTICS** ✅: only a COUPLE lunge at once — the rest FLANK, circling just outside smash range, and the attackers rotate every ~2.6s. No clumping: one held smash can no longer wipe a pack. **THE HOWL RULE:** if the last wolf survives more than 5 seconds after its packmates fall, it HOWLS — and the whole pack rises again. Kill them ALL, fast.
- **Piranhas** 🔜 — mini enemies in the water.

### Boss ladder (each in a different territory)
1. **The Witch** 🔜 — a mini-boss in the wilds.
2. **The Mountain Troll** ✅ BUILT — the first territory boss. Hook: a disturbance in the mountains and **Bog missing** (a fishing hook found on the southern trail). The cave fight is **pitch dark — you see only outlines** and it's night. His blows can't be answered: **his hide shrugs off every weapon**. You OUTLAST him until dawn (survival timer), then LURE him out the cave mouth into the rising sun — he staggers, blinded — **you climb his back** and deliver ONE final smash to the head → he turns to **stone forever** (his statue stays on the plateau). Then: find materials in the dark cave, light a fire with Strax's skill — and the flames reveal **the HOARD CHEST… and BOG, tied up beside it**. Nothing collects itself: you walk to the chest and OPEN it (💰) for the 400 coins + the TROLL'S HAMMER. Cut him free and he FOLLOWS you: the escort home is the quest's final leg (it walks the player back to the village on purpose — arriving completes the rescue, the Chief celebrates, and Modo's hammer lesson begins). Expect deaths; each mountain respawn sends fresh snack-birds, and cleared wolf packs stay cleared. |
3. **The Barbarian** 🔜 — a rogue barbarian knight who **kidnaps little Tommy**; the fight is hard because the kid is on his horse. The horse has **TWO HEADS**. Defeat the barbarian WITHOUT killing the horse — **you win the two-headed horse**: extra powerful, and it looks cool.
4. **The Lake Kraken** 🔜 — a giant octopus lake monster with piranha minions. Needed to face it: Dorgan's **underwater-breathing potion**, the lake village's **underwater armor**, and the **Trident**. **Defeat: cut off each arm, one by one.** Afterward, **harvest its beak** and craft a special shield.
   - **The Trident:** owned by the chief of the neighboring lake village. To borrow it, win **three trials**: 1) **archery**, 2) **swimming**, 3) **kindness** — help someone in his village so he sees you're a good person. The trident is **borrowed** — return it, or that village goes to WAR with yours.
5. **The Evilcorn** 🔜 — second-to-last boss. A **unicorn gone bad** — cursed. You don't kill it: **reverse the curse** and heal it back into a true unicorn. It grants **+5 hearts** (cap becomes 10).
6. **THE FINAL BOSS: The Shapeshifting Wizard** 🔜 — a human wizard, fought on land. He **summons creatures** and **shapeshifts** through harder versions of the mini-bosses; his final form is a **giant dragon**. Once every form is beaten, his energy is spent — he becomes a **weak but fast human**, and **one final blow** ends him. Beating him beats this storyline.

## 10. Quest Structure & Story Rhythm

- **The rhythm:** challenge → congratulations + reward → **free exploration** → the next hook. ✅
- **QUESTS COME FROM PEOPLE, NOT BANNERS** ✅: every quest offer is delivered face to face. When a quest opens, its giver **leaves their post and walks across the village to wherever you are** ("Erik is coming to you…"), speaks, then walks home. Applies to EVERY giver (Chief, Dorgan, Erik, Modo, Bog — generalized from the old Modo-only walk-out). If you're away (mountains, shop, pond) they find you when you return to the village.
- **Boss quests never spoil the monster** ✅: the Chief doesn't know what's in the mountains — he gives you Bog, a found fishing hook, and the ruins lore. Fetch/errand quests may be fully explicit; mystery is reserved for bosses.
- **THE CHAIN as built** ✅: 5 goblins (110) → Dorgan's berries (free Stoneskin) → Erik's turkeys (90, GRAB) → **the Visiting Champion** (his shield) → **Modo walks out of his forge** to offer shield school — a real choice: "Let's do it!" or "I'll come back later" ("…you'll NEED this skill. Don't forget about Modo.") → **QUEST: Find Bog** (Chief; disturbance in the mountains, a hook found on the southern trail; accept/prepare-first choice) → the mountains: wolves, Strax's fire lesson, the climb, the cave, THE TROLL → hoard + hammer → Chief celebrates → **Modo teaches the hammer** (3 dummy smashes) → **Bog's thank-you trip**: fishing finally unlocks, first catch with Bog. Fishing is TRAINING, not a side game — gated behind the rescue.
- **Skills banked so far:** combat, gathering, GRAB, blocking, pattern-reading, fire-making, climbing, fishing, boat-driving.
- **Terminology:** the small onboarding tasks are "challenges"; QUESTS are the big story beats. The challenges guide you through town and teach every control.
- **The onboarding chain flows person-to-person** ✅: shopkeepers hint "come back later" until their moment → the Chief gives the goblin challenge (110 coins) and, at the payout, points you to Dorgan ("you could use strength… or a shield") → DORGAN himself asks for 4 blueberries and brews you a **free Stoneskin potion** (his shop opens; he points at Erik when you're broke) → ERIK teaches the GRAB with his turkey scheme (turkeys caught early count retroactively) and pays 90 — "just enough for a basic sword" → Modo's forge → **THE FIRST REAL QUEST: the visiting champion** (the §10 tutorial-fight, now drafted): beat him in the square, win his shield.
- **Your shield:** HOLD the attack button = shield raised (silver BUBBLE + "🛡️ SHIELD UP"); a **gold ring drains as the arm tires (~3s)**, then the shield rests ("🛡️ arm resting…"). Release does nothing — **the smash lives on the 💥 button**. Modo teaches all of this out loud in shield school. ✅
- **Quests can be turned in to someone other than the giver:** the blueberry quest is GIVEN by the chief but DELIVERED to Dorgan — he congratulates you, pays 40 coins, and only then opens his potion shop. ✅
- **Challenge 1 is FIVE goblins now** (three was too easy). ✅
- **Fishing & boat-driving** ✅: learn to fish with Bog (adaptive coaching), and after your first catch he'll teach boat-driving **by putting YOU at the oars** ✅: a real full-screen crossing — steer with the joystick, dodge foam-ringed ROCKS (Bog heckles every bump), reach the FAR JETTY. Bumps are counted; arriving = boat-driving learned, a skill banked for later villages. **Later quests logged:** buying your OWN boat; the shipwreck rescue ("take my boat — save them!") that foreshadows the Kraken.
- **Challenge 2 asks for BOTH berries** ✅: 4 blueberries AND 2 red berries — Dorgan doesn't eat red berries, he BREWS with them. The longer forest trip means more goblin run-ins on purpose.
- **Challenge 3 — Erik's turkeys** ✅: caught turkeys go INTO YOUR SATCHEL as items; deliver 3 to Erik (pre-caught ones count automatically). Reward 90 coins + turkey meat for sale + Erik buys extra turkeys at 15 forever. Teaches GRAB.
- **Challenge 5 — MODO's shield training** ✅: after you win the champion's shield, MODO calls you to the forge and spars you with a wooden sword. His instructions are explicit: *press and HOLD the attack button — holding = shield UP (silver bubble), release = shield down and NOTHING else; a shield arm tires in three breaths and must rest.* BLOCK 3 swings; he coaches every miss.
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
- A goblin with a crossbow (ranged enemy you learn to dodge/block) — idea raised mid-playtest, not fleshed out.
- On-screen quick-equip hotbar — proposed and REJECTED (satchel + context button are enough).
- **Pacing note for later:** once everything is more complex, all of it should take LONGER so the game pace feels right — fine for now, revisit when content grows.
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
- *v0.12 — avatar names (Zippy/Oak/Willow/Dusty), morphing context button, double-tap dash, shop interiors with icon signs, satchel blueberries, story rework (110/potion/90), the Visiting Champion + won shield, dev testing menu (#dev)*
- *v0.13 — permanent gear fix, Modo bow-gating, sellable wild turkeys, champion pattern buff (28hp, relentless), dash-while-steering, 2½-heart respawn w/ quest persistence, Erik's shield-training challenge*
- *v0.14 — FIVE goblins, red berries to satchel (deadly to eat), the cursed stone, Fishing v1 with Bog (pond, boat, cast/reel tension minigame, half-catch split, hooks, fish selling, boat-driving skill), #fish dev hash*
- *v0.15 — shield training moved to MODO with explicit HOLD instructions, 🛡️ SHIELD UP bubble visual, permanent gear uncounted in satchel, scrollable shop lists*
- *v0.16 — goblin village boundary; challenge 2 = 4 blueberries + 2 red berries (multi-item deliveries in the quest engine, live 🫐/🔴 tracker)*
- *v0.18 — THE PLAYTEST ROUND: shield fully decoupled (hold = shield ONLY, 3s arm-tire + rest, release = no damage; smash moved to 💥), Bog's boat lesson = YOU drive (rocks, coaching, far jetty), EVERY quest-giver walks to you (people not banners), wolves 18hp with rotating two-attacker flanking, THE CLIMB as a full-screen scene (visible avatar, ledge resting, falls), stone-troll RUINS + Chief's daylight lore, cave scaled to always fit the screen, hoard CHEST you open, fine-hook fight harder (46–54 window, 3.6s), fire minigame press-to-strike w/ pulsing NOW! zone, all minigame bars VERTICAL on the left, hunger scales with effort (idle 140s), Reba the Stablekeeper (horses "not yet"), #climb/#boat dev hashes*
- *v0.17.1 — Bog is found TIED UP beside the hoard, revealed only by firelight; freeing him starts an escort that completes at the village gates*
- *v0.17 — THE TROLL ARC: mountains territory (map 2), wolf packs w/ the howl-resurrect, Strax + fire-making, the cliff climb, the dark cave & dawn-survival troll fight (lure→climb→smash→stone), the hoard + Troll's Hammer + Modo's hammer school, Bog captured/rescued (fishing gated behind rescue, hook choice, larger-half terms), quest choice buttons, Modo walk-out offer, shop-exit fix, per-territory respawn*
- *v0.7 — Genshin-referenced control cluster, 💥 smash skill button, contextual 💬 talk button near NPCs*
- *v0.8 — one-finger play: invisible anywhere-joystick, attack gestures anchored to the attack button, smash-dim fix*
