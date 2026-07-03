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
- **Stable IDs now:** every placeholder gets a real, stable key (e.g. `npc_moto_moto`, `tile_forest_floor`) — no positional or file-order references. Real designs later = renaming file contents behind an existing key.
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

## Project State

*Updated at every checkpoint.*

- **Version:** v0.8 (+ audit corrections)
- **Phase:** reorg approved-pending — Step 2 structure proposal delivered, awaiting approval of ⚑ bets before Step 3 migration
- **Mid-flight:** project restructure (content/engine split, quest runtime, territories)
- **Known issues:** SPEC.md stale (deletion planned in migration step 1); dead code (`tapAction`, `joyHome`, dev hash-shortcuts) scheduled for removal in migration step 9
- **Placeholders:** all art (shapes/emoji), mock logins, mock room codes
- **Untested:** nothing known — v0.8 verified on phone-sized landscape + portrait-rotated preview
