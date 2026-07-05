# Losthorne — Working Rhythm (standing process)

*This applies to every work session on this project. DESIGN.md is the source of truth for WHAT the game is; this file is the source of truth for HOW we work on it.*

## Context that shapes everything
- **Prototype phase.** All current art/assets are placeholders (shapes, colors, generated stand-ins); real official designs get swapped in later.
- **Rendering is currently birdseye/top-down** (Link's Awakening-style) but NOT guaranteed final — a 3D-style presentation may come later. Don't build as if birdseye is permanent; don't over-engineer for 3D either. Just never make a choice that forces a full rewrite if that shift happens.

## Session structure

**1. SYNC (start of session)**
- Pull latest repo state. Give a 2–3 line status: what changed since last session, what's mid-flight, known bugs.
- If DESIGN.md's Project Structure or version history looks stale vs. actual code, flag it before starting new work.

**2. SCOPE (before writing code)**
- State what this session builds in one sentence + which DESIGN.md section(s) it maps to.
- Size it to one sitting. If the ask is bigger, break it into ordered steps with proposed stopping points — never silently scale down the ask.

**3. BUILD**
- **Data before logic:** new content (NPCs, enemies, items, dialogue, zones) goes into data/config files, never hardcoded into rendering or engine files.
- **Stable IDs now:** every placeholder gets a real, stable key (e.g. `npc_modo`, `tile_forest_floor`) — no positional or file-order references. Real designs later = renaming file contents behind an existing key.
- **Rendering separate from state:** how something is drawn stays separate from what exists / what it's doing. Position/state logic must not know or care that it's drawn top-down.
- **Test on the actual target** (phone-sized, touch, landscape) before calling something done — not just desktop view.

**4. CHECKPOINT (end of feature, not end of chat)**
- Commit with a message tied to the DESIGN.md section.
- Report explicitly: what's done, what's untested, what's placeholder vs. real, and anything built as a guess rather than a spec'd decision.
- Update the Project State block below before closing out.

## Flagging rules — STOP AND ASK before proceeding when:
- A choice would be expensive to undo later (birdseye-only assumptions in physics/camera/hit-detection; asset formats that don't translate to 3D-style models).
- DESIGN.md is silent or ambiguous and you're about to invent canon.
- A "placeholder" is about to accumulate enough special-case code that swapping it later means touching logic, not swapping an asset.
- You're about to restructure something already marked ✅ in DESIGN.md.

## Asset-swap readiness (ongoing)
- Maintain a manifest (assets/README.md) mapping every placeholder → its ID/key, what it currently is, what it's meant to represent. Real-design handoff must be lookup-and-replace, not archaeology.
- Never let placeholder art quality become load-bearing (e.g. a hitbox depending on a placeholder's exact pixel shape).

## Dimension-change readiness (ongoing)
- World/entity positions and logic stay dimension-agnostic where reasonable (coordinate-based state as source of truth, never relative-drawing relationships).
- When choosing between a quick birdseye-specific hack and slightly-more-work rendering-agnostic code, default to rendering-agnostic AND say so out loud — the tradeoff gets surfaced, not silently picked.

---

## Session rhythm addendum (2026-07-03, Kaylee)
- **Auto-deploy intent:** when the room clearly lands on a decision in voice, Claude should start building as soon as possible (short settle delay). CONSTRAINT: the platform's voice-capture turns are listen-only (no tools allowed), so Claude queues a one-tap GO chip and deploys the moment anyone taps it or types anything. A platform request to allow act-on-voice has been drafted for Kaylee to send to the admins.

## Project State

*Updated at every checkpoint.*

- **Version:** v0.25 — THE WITCH ARC (fully built, story order) (reorg steps 6–8,10 still queued)
- **v0.25 checkpoint (2026-07-05, Kaylee "deploy it all in story order"):** the whole Witch arc, 6 stages, each committed + smoke-tested (~150 assertions green).
  - **S1 — chain reorder:** troll rescue → FISHING → BOATING (new quest_09) → hammer (07, "heard from Bog", jokingly buys it, teaches SWING+SMASH) → witch. Rewired next-pointers.
  - **S2 — the alarm:** Dorgan sprints the square shouting about the north woods (the WITCH); the Chief asks "I'll do it / need more time" + stock FOOD. quest_10. New item_antidote (drinking = nothing, not consumed).
  - **S3 — potion minigame** (scene='brew'): STRIKE→ light fire, STOKE→ cook in the green, ADD 3 ingredients, STIR → the antidote. Taps fire on press.
  - **S4 — deep woods** (scene='woods'): new map north of the village, goblins + one wolf pack with an AGGRO-GATE (wolves stand down while goblins fight you), a black lake with the island hut + a dock. quest_11 (auto-activates).
  - **S5 — piranha crossing** (scene='cross'): auto-drift while piranhas leap aboard (2 slashes each); a SMASH cracks the hull; 3 cracks → sink → swim the rest.
  - **S6 — the hut** (scene='hut'): a CAT that SHIFTS (steel only makes her change form); gather 3 hidden ingredients while she harries you (damage never lands); THROW the antidote → she becomes JESSIE, who promises future aid. New npc_jessie; flag_witch_cured completes quest_11; turn in at the Chief.
  - **Files:** 3 new quests (09/10/11), items.js (antidote), 5 new scenes + systems in main.js (brew/woods/cross/hut), npcs/jessie.js, DESIGN §5/§9/§10. Dev hashes #witchalarm #brew #woods #cross #hut.
  - **Guesses (tuning, confirm w/ Kaylee):** brew timings, piranha hp=5 (2 sword hits) + hull=3, woods layout/aggro-range, the 3 antidote ingredients (🍄 wolfsbane 🦴), hut ingredient count=3.
- **Version:** v0.24 — STORY-FIRST DIALOGUE + WITCH ARC SPEC'D (reorg steps 6–8,10 still queued)
- **v0.24 checkpoint (2026-07-04, Kaylee):** one bug fix + captured a big new arc as canon.
  - **BUG FIX — NPC menu upstaged story dialogue:** an NPC's merchant menu (buy/sell) rendered under EVERY dialogue, even story moments (Modo selling weapons mid shield-training pitch). Now `openDialog` tracks `dStoryTalk` (true when the lines come from `Quests.dialogueFor`), and `renderShop` hides the `d.shop`/`d.buys` menus while story is being told. KEPT visible: Bog's `d.actions` (fishing/boat), the quest CHOICE buttons (appendQuestChoice), and a shopkeeper's wares during a deliver-SCOLD (so you can still buy). Verified by screenshot (Modo shows clean story, then full shop when idle) + smoke test green.
  - **Hammer already swings:** confirmed hammer = SWING on tap (slash uses the equipped weapon's dmg 5 / range 82) + SMASH on the 💥 charge — no combat change needed; the "teach both" is a lesson-copy job in the arc build.
  - **WITCH ARC captured into the Bible (DESIGN §9 boss #1, §5 Jessie, §10 chain, §13 open-Q resolved):** Kaylee's full spec is now canon — Dorgan's frantic hook → Chief's "I'll do it / need more time" + food reminder → Dorgan's 3-ingredient antidote MINIGAME (fire → cook → mix → stir) → the potion is NOT for the player ("never meant for YOU…") → deep-woods approach (goblins + one wolf pack, never both aggroing) → **piranha BOAT crossing** (2 hits each; smash cracks the hull; broken hull → swim) → **shapeshifting CAT-Witch** (gather ingredients around her house under harmless harassment, then THROW the potion) → she's revealed as **JESSIE** (the Bible's traveling bard — "Jesse"/"Jessie" unified to Jessie 2026-07-04; the Witch is her cursed origin!), who promises future aid. This is realistically a 5+ step build.
  - **Files:** main.js (dStoryTalk in openDialog + renderShop guards), DESIGN.md (§5 Jessie origin, §9 witch arc + piranha, §10 chain, §13 open-Q).
  - **NOT built yet (staged — see roadmap I gave Kaylee):** the Bog/Modo re-flow ordering, Dorgan's potion minigame, the deep-woods territory, piranha-boat combat, the shapeshift boss + Jessie reveal. Awaiting her go/priority before building the big new subsystems.
- **Version:** v0.23 — PLAYTEST FIXES: climb/wolves/boat/quest-counters (reorg steps 6–8,10 still queued)
- **v0.23 checkpoint (2026-07-04, Kaylee playtest):** four fixes.
  - **Climb prompt was buried behind the cliff:** the in-world 🧗 marker sat low inside the cliff band. Now there's a bright climb CHUTE (rungs) with a glowing base PAD in the approach strip (above the wall), and a floating "🧗 CLIMB" label drawn ABOVE the player AFTER the cliff/player, so it can never be hidden. (Verified by screenshot.)
  - **Wolves swarming the cliff base:** the woods pack (moved to y=460) now can't cross below y=600, and the plateau pack stays ≥975 — so reaching the cliff base is a safe beat to climb. Fight the wolves in the woods, then climb.
  - **Boating harder + a real rock consequence:** added a steady downstream CURRENT (0.95/frame — you can't rest), a tighter 13-rock staggered slalom, and a HULL of 3 planks. Each rock hit CRACKS a plank (💥 + Bog coaching); the 3rd crack WRECKS you — swamped back to the start dock, hull reset, and Bog charges an ≤8-coin repair fee (scolds if you're broke). Hull pips shown top-left.
  - **Removed live quest counters ("3/5", "4/4", etc):** all `tracker.active` strings are now goal text (no fractions); the goblin kill banner dropped its "(n/5)". Goblins simply keep attacking until you've cleared enough (the one-time "quest complete!" cue still fires). Deliver quests (berries→Dorgan, turkeys→Erik) now SCOLD with the exact shortfall when you return short — new engine `deliverShortfall()` + per-quest `scold` templates, injected in `openDialog`.
  - **Files:** main.js (cliff chute + CLIMB prompt, wolf turf clamps + pack move, boat current/rocks/hull/wreck + hull HUD, goblin banner, scold injection in openDialog), engine/quests.js (deliverShortfall + scoldTemplate), 5 quest data files (tracker text + scold lines), quest-03 banners.
  - **Verified:** builds clean; smoke test green (~90 assertions) incl. NEW guards — tracker has no x/y, Dorgan scolds "2 more red", boat 3-crack wreck resets + charges a fee. Climb prompt & boat hull confirmed by screenshot at phone-landscape.
  - **Guesses (confirm w/ Kaylee):** boat current 0.95 + 13 rocks + 3-plank hull + 8-coin repair fee · wolf turf line y=600 · that tutorial quests (shield/hammer) also lose their HUD counter (kept their transient per-action banners).
- **Version:** v0.22 — COMBAT INPUT FIXES (shield + smash reliability) (reorg steps 6–8,10 still queued)
- **v0.22 checkpoint (2026-07-04, Kaylee bug reports):** "shield doesn't always work vs wolves" + "smash isn't always letting me hold for a bigger smash."
  - **Root cause (both):** the hold-gesture (`swp`) had NO `touchcancel` handler. A browser-cancelled touch (palm rejection, a notification, a scroll/tab switch) left `swp.active=true` stuck, and `pointerDown` only starts a hold `if(!swp.active)` — so every later shield-hold and smash-charge was silently ignored. FIX: added `pointerCancel()` + a `touchcancel` listener (and a `window blur` safety) that ABORT the gesture without firing an attack.
  - **Shield reliability:** `shieldHoldRaw()` used to drop the shield the instant your thumb drifted >18px (read as an aim-slice). Now the drift check only gates the INITIAL raise (and at a roomier 34px); once the shield is UP a small wiggle can't drop it.
  - **Smash reachability:** full smash eased 3000ms → **2400ms** (`SMASH_FULL_MS`), and the charge meter's "full" flag now uses the same constant, so the gold "SMASH READY!" ring matches exactly when a release gives the big one. Applies to both the pre-shield attack-hold and the post-shield 💥 button.
  - **Files:** all main.js (pointerCancel + touchcancel/blur listeners, shieldHoldRaw drift-latch, SMASH_FULL_MS + chargeInfo + attackRelease ×2, comment). DESIGN §7 smash timing updated (3s→2.4s).
  - **Verified:** builds clean; smoke test green (~86 assertions) with NEW regression guards — cancelled-touch releases the hold, shield survives a small drift, a 2.4s hold reads FULL and fires radius-130. Screenshot ❌-scan: none.
  - **Guess (confirm w/ Kaylee):** full-smash at 2.4s · shield raise-drift tolerance 34px. Left the shield's ~3s arm-tire + ~2.5s rest AS-IS (intentional per DESIGN §5/§7) — if the shield still feels unreliable in a pack after this, that tire window is the next lever.
- **Version:** v0.21 — GENERAL SELL FLOW + PEARL ITEM (reorg steps 6–8,10 still queued)
- **v0.21 checkpoint (2026-07-04, Kaylee):** reworked selling + made the pearl a real item.
  - **Selling:** Erik's per-item sell buttons → ONE general **"Sell items…"** button that opens the satchel in a new **sell mode**. Tap an item → its detail shows Erik's offer ("Erik offers N 🪙… Sell — or ← Back to keep it") with a green **Sell** button (Use is hidden); ← Back / Close = reject. Non-sellable items show a disabled "Erik won't buy this." What's sellable + the price is the single source of truth in `economy.js SELL_PRICES` (turkey 15, fish 8/20, pearl 18) — Erik's data is now just `buys:true`.
  - **Pearl:** grabbing the underwater pearl now adds `item_pearl` to the satchel (was: straight +12 coins). New item def + SELL_PRICES entry (18). Sells through the same general flow.
  - **Robustness:** `advanceDialog()` ignores taps while the satchel is open over a shop (a stray tap can't close Erik mid-sale); `closeInv()` re-renders the shop so the Sell button's state refreshes.
  - **Files:** main.js (renderShop sell button, openInv/closeInv sellMode, renderInv sell UI, invSell handler, advanceDialog guard, pearl→inv, inv seed), index.html (#invSell button), data/items.js (item_pearl), data/economy.js (SELL_PRICES.item_pearl), data/npcs/erik.js (buys:true). Smoke test updated for the new flow (+pearl-sell +non-sellable coverage; sword-buy total 25→43).
  - **Verified:** builds clean; smoke test green (screenshot ❌-scan: none); sell grid + offer view + reject path confirmed by screenshot.
  - **Also fixed in passing:** DESIGN §6 still said goblins take "8 punches / 3 hits" → corrected to 6/2 (matches engine + §9).
  - **Guess (confirm w/ Kaylee):** pearl sells for **18** coins.
- **Version:** v0.20 — SWIMMING & THE DEEP (reorg steps 6–8,10 still queued)
- **v0.20 checkpoint (2026-07-04, Kaylee's idea):** you can SWIM in the pond.
  - **Surface swim:** cross the pond edge → `P.swimming` on; move at ~58% speed, rendered as head-above-water + ripple; reach shore → climb out. Dash still works on the surface but the swim-stroke uses a long recharge (~3.3s vs land's ~1s) — "head above water, they can dash but then slow down longer before dashing again."
  - **New underwater scene** (`scene='dive'`, side-view): 🤿 DIVE from the surface. Fish that shy away, seaweed, rocks, sunbeams, bubbles, a grabbable pearl (+12🪙). Radial **air ring** drains ~12s/breath. **Breathing is positional** — swim up so the head breaches the waterline to refill (~2s); you can't descend while catching breath and you DON'T leave the water on a breath. **⬆️ Resurface** button is the only exit back to the surface pond. Out of air = gulp damage until you reach the top.
  - **Files touched:** all in main.js — `P.swimming`, `dash()` swim branch, swim speed factor, pond block now swim-enter/exit (replaces the old push-out), `contextAction` (DIVE + Resurface), `pressButton` (dive/resurface), `DIVE` state + `startDive`/`diveBuild`/`diveUpdate`/`resurface`/`drawDive`/`drawSwimmer`, surface-swimmer render in the village. New `#dive` dev hash.
  - **Verified:** builds clean, 70-assertion smoke test still green; surface-swim head+ripple, the full underwater scene (air ring, Resurface, fish/weeds/rocks/beams), and the side-view swimmer all confirmed by screenshot at phone-landscape. Air/refill/speed/dash timings sanity-checked numerically.
  - **Guesses (INVENTED CANON — confirm w/ Kaylee):** swim speed 58% · swim-dash recharge 3.3s · ~12s air / ~2s refill · out-of-air 1♥ per 1.1s · pearl = 12 coins · underwater is SIDE-view (chose it for immersion; could be top-down instead).
- **Version:** v0.19 — CLEANUP + AMBIENT WORLD (reorg steps 6–8,10 still queued; step 9 dead-code partly done here)
- **Phase:** playtest-driven feature work, auto-deploy rhythm
- **v0.19 checkpoint (2026-07-04, Kaylee):** a code-health audit + a creative environment pass.
  - **Bugs fixed:** keyboard diagonal move was √2 too fast (now normalized) · corrupted color literal `'#8a8populate'` on the stone-troll statue removed · defeated Champion could never re-spawn (`!champion` guard → `!champion||!champion.alive`) · fishing no longer skips the hook-choice on a second trip (`hookChosen` now resets in `fishingEnd`).
  - **Dead code removed:** `tapAction()` (superseded, uncalled) · empty `strollGoblins()` stub · the redundant `caughtTurkeys` counter + `retroCount` hook (deliver quests already recount live from inventory, so retro-counting still works) · two no-op ternaries (`window.visualViewport?0:0`, `r.h+18<r.h?…`).
  - **Data fixes:** sword tooltip said "3 hits / 8 punches" → corrected to **2 hits / 6 punches** (matches engine + DESIGN); a stale code comment fixed the same way · Quest-1 completion line said "Three goblins gone" in a 5-goblin quest → "Five".
  - **Kept on purpose (not rot):** `item_turkey` (Roast Turkey, bought from Erik — distinct from caught `item_wild_turkey`) · `ANCHORS` future-price table (documented design intent in the prices file).
  - **NEW ambient interactivity (finishes the earlier WIP; INVENTED CANON — see below):** pond **ducks** that paddle + leave wakes, flee a crowder, and drift closer when you **play music** (seed of a taming system) · a **wishing well** (🪙 toss, ~1/8 pays 5) · **signposts** at the N/S village exits · **horse petting** at Reba's (Maple friendly, Biscuit snaps). All three landmarks now actually RENDER (they were interactive-but-invisible in the uncommitted WIP).
  - **Verified:** 70-assertion smoke test still green (screenshot-read); ducks/well/signpost/petting all render + behave, verified by screenshot at phone-landscape via throwaway debug hashes (since removed).
- **Superseded checkpoint (v0.18):** the 16-item voice round: shield DECOUPLED (hold attack = shield only, 3s arm-tire + rest cooldown, release = no damage; smash on 💥 only once shield owned) · Bog's boat lesson = a real YOU-drive crossing (rocks, bump coaching, far jetty) · EVERY quest-giver now WALKS to the player to offer quests (generalized giver-walk system; "X is coming to you…") · boss-quest no-spoil audit (Chief hints via ruins, never names the troll) · wolves 18hp + pack tactics (two rotating attackers, rest flank in a circle) · THE CLIMB is a full-screen scene (visible avatar, ledge resting, animated falls) · stone-troll RUINS in the village + Chief's daylight lore in the Find-Bog offer · cave scaled to always fit the viewport · hoard CHEST you walk to and open · fine-hook reel harder (46–54, 3.6s) · fire minigame fires on PRESS with pulsing NOW! zone · fishing/fire/climb bars VERTICAL on the left edge (banners never overlap) · hunger scales with effort (idle 140s/half-heart) · Reba the Stablekeeper (🐴 stable, horses "not yet") · #climb/#boat dev hashes. 70-assertion smoke test green; climb/boat/cave/village verified by screenshot at phone-landscape size.
- **Guesses flagged:** shield 3s hold / 2.5s tire cooldown / 1.2s short-rest · wolf 18hp + 2-attacker rotation every 2.6s · climb rates (~5.5s of holding for the full wall, ~3.3s of grip, ledges at 25/50/75) · boat speed/rock layout · hunger multipliers (×1.3 walk, ×2.2 combat, ×3 climb) · fine-hook 46–54 & 3.6s · Reba's excuse lines · ruins placement (west of the square) · **NEW v0.19 (INVENTED CANON — confirm w/ Kaylee):** well payout 1-in-8 pays 5 · well/signpost/pond-duck placements · duck charm radius (300px) + paddle/flee speeds · that "play music charms creatures" is the intended taming seed at all · signpost wording
- **Known issues:** some dead code + a couple dev hashes still pending full reorg step 9 (this pass cleared the worst offenders); Reba's ponytail is a hair-color placeholder (no ponytail sprite yet)
- **Placeholders:** all art, mock logins, mock room codes
- **Untested:** phone FEEL of the climb hold-rhythm, boat steering, and the tighter fine-hook reel (tuned by math, not thumbs)
