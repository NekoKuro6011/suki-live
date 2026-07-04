# WebP Background Preference Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make creator pages prefer `webp` for head and body backgrounds while automatically falling back to `png`, then add `webp` versions for the existing background assets in the repo.

**Architecture:** Keep the current creator-page asset naming convention and update only the background loader logic. Add one small Node test that exercises the candidate ordering and first-available resolution logic so future template edits do not regress asset preference behavior.

**Tech Stack:** Static HTML/CSS/JS, Node.js built-in test runner, Pillow for local image conversion

## Global Constraints

- Prefer `webp` over `png` for background assets.
- Preserve backward compatibility for creators who only provide `png`.
- Keep the existing mobile fallback behavior.
- Do not remove existing `png` assets when adding `webp` versions.

---

### Task 1: Lock Asset Preference Behavior With A Small Test

**Files:**
- Create: `D:\suki.live\scripts\backgrounds.test.mjs`
- Modify: `D:\suki.live\assets\js\template\backgrounds.js`

**Interfaces:**
- Consumes: `window.SukiTemplate.backgrounds`
- Produces: Test-only helper exposure for ordered candidate generation and first-hit resolution

- [ ] Write a failing test for mobile header candidate order, desktop body candidate order, and first-available resolution.
- [ ] Run `node --test scripts/backgrounds.test.mjs` and verify it fails for the expected missing helper surface.
- [ ] Add the smallest helper surface necessary to make those tests pass without changing unrelated template behavior.

### Task 2: Update Runtime Background Resolution

**Files:**
- Modify: `D:\suki.live\assets\js\template\backgrounds.js`

**Interfaces:**
- Consumes: `state.base`, `info.show_header_bg`, `info.show_body_bg`
- Produces: Runtime selection that checks `webp` candidates before `png` candidates

- [ ] Reuse the tested helper functions in the live loader paths.
- [ ] Keep the mobile-to-desktop fallback chain for both header and body backgrounds.
- [ ] Preserve the current body and header DOM application behavior once an asset is found.

### Task 3: Add WebP Versions For Existing Background Assets

**Files:**
- Create: `D:\suki.live\u\lubao\body_bg.webp`
- Create: `D:\suki.live\u\mosh\head_bg.webp`
- Create: `D:\suki.live\u\raku\head_bg.webp`
- Create: `D:\suki.live\u\yaoying\body_bg.webp`
- Create: `D:\suki.live\u\yaoying\head_bg.webp`

**Interfaces:**
- Consumes: Existing `.png` background assets
- Produces: Parallel `.webp` assets for the template to prefer

- [ ] Convert each current head/background PNG to a visually safe WebP counterpart.
- [ ] Keep the original PNG files in place for fallback compatibility.
- [ ] Use descriptive file parity so the template can find the new assets without extra config.

### Task 4: Verify End-To-End

**Files:**
- Modify: `D:\suki.live\assets\js\template\backgrounds.js`
- Create: `D:\suki.live\scripts\backgrounds.test.mjs`
- Create: `D:\suki.live\u\*.webp`

**Interfaces:**
- Consumes: Updated runtime logic and new image assets
- Produces: Fresh verification evidence for behavior and repo validity

- [ ] Run `node --test scripts/backgrounds.test.mjs`.
- [ ] Run `node scripts/validate-repo.mjs`.
- [ ] Review the changed asset list and sizes to confirm the intended creators now have WebP counterparts.
