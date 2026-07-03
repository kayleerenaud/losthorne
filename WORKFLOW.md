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

- **Version:** v0.17 — THE TROLL ARC (reorg steps 6–10 still queued; the mountains were built pre-reorg by necessity — territory extraction now has two real maps to generalize from)
- **Phase:** playtest-driven feature work, auto-deploy rhythm
- **This checkpoint:** full mountain territory + troll boss arc per Kaylee's voice spec: shop-exit fix · per-cast hook choice (fine = tiny green window) · Modo walk-out shield offer w/ Let's-do-it/later choice buttons · Bog captured (shack CLOSED, fishing gated until rescue) · Chief's Find-Bog quest (hook-on-the-trail story, accept/prepare choice) · southern trail → mountains map: 5-wolf packs with 5s howl-resurrect, mountain berries, Strax + spark-timing fire lesson, grip-bar cliff climb (fall = 2 hearts), summit guard pack, snack-birds, pitch-dark outline cave, dawn-survival troll (invulnerable hide) → sunlight lure → climb-his-back → one smash → STONE statue · dark-search materials → fire → 400-coin hoard + Troll's Hammer (weapon, dmg 5) · Modo hammer school · Bog's thank-you first-catch quest · territory respawns (mountain deaths → trailhead) + respawn birds during troll attempts. 58-assertion smoke test green end-to-end.
- **Guesses flagged:** wolf stats (12hp/1-heart bite) · climb drain/refill rates · dawn timer 75s · hoard 400 · hammer dmg 5 · bird heal +1❤️ · southern-trail goblin ambush NOT built (goblins currently roam only the north forest — flag if wanted on the trail itself)
- **Known issues:** dead code + dev hashes pending reorg step 9
- **Placeholders:** all art, mock logins, mock room codes
- **Untested:** phone feel of the reel minigame
