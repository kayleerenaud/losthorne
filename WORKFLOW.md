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

- **Version:** v0.18 — THE PLAYTEST ROUND (reorg steps 6–10 still queued)
- **Phase:** playtest-driven feature work, auto-deploy rhythm
- **This checkpoint:** the 16-item voice round: shield DECOUPLED (hold attack = shield only, 3s arm-tire + rest cooldown, release = no damage; smash on 💥 only once shield owned) · Bog's boat lesson = a real YOU-drive crossing (rocks, bump coaching, far jetty) · EVERY quest-giver now WALKS to the player to offer quests (generalized giver-walk system; "X is coming to you…") · boss-quest no-spoil audit (Chief hints via ruins, never names the troll) · wolves 18hp + pack tactics (two rotating attackers, rest flank in a circle) · THE CLIMB is a full-screen scene (visible avatar, ledge resting, animated falls) · stone-troll RUINS in the village + Chief's daylight lore in the Find-Bog offer · cave scaled to always fit the viewport · hoard CHEST you walk to and open · fine-hook reel harder (46–54, 3.6s) · fire minigame fires on PRESS with pulsing NOW! zone · fishing/fire/climb bars VERTICAL on the left edge (banners never overlap) · hunger scales with effort (idle 140s/half-heart) · Reba the Stablekeeper (🐴 stable, horses "not yet") · #climb/#boat dev hashes. 70-assertion smoke test green; climb/boat/cave/village verified by screenshot at phone-landscape size.
- **Guesses flagged:** shield 3s hold / 2.5s tire cooldown / 1.2s short-rest · wolf 18hp + 2-attacker rotation every 2.6s · climb rates (~5.5s of holding for the full wall, ~3.3s of grip, ledges at 25/50/75) · boat speed/rock layout · hunger multipliers (×1.3 walk, ×2.2 combat, ×3 climb) · fine-hook 46–54 & 3.6s · Reba's excuse lines · ruins placement (west of the square)
- **Known issues:** dead code + dev hashes pending reorg step 9; Reba's ponytail is a hair-color placeholder (no ponytail sprite yet)
- **Placeholders:** all art, mock logins, mock room codes
- **Untested:** phone FEEL of the climb hold-rhythm, boat steering, and the tighter fine-hook reel (tuned by math, not thumbs)
