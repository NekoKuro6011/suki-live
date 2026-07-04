# Site And Template Theme Unification Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Unify the homepage, registry page, and creator template around one calmer pink-blue theme with shared typography, spacing, and component emphasis.

**Architecture:** Keep the existing three-page structure and shared asset split intact. Apply the visual refresh primarily in `assets/css/site.css` and `assets/css/template.css`, then back it with a lightweight Node validation script that checks whether both stylesheets expose the same core theme tokens.

**Tech Stack:** Static HTML, shared CSS, vanilla JavaScript, Node.js validation script

## Global Constraints

- Preserve the current page structure and data loading behavior.
- Keep the homepage footer links to B 站 and 爱发电 intact.
- Use one shared visual language across homepage, registry page, and creator pages.
- Background-image mode on creator pages must remain semi-transparent rather than glassmorphism.

---

### Task 1: Add A Theme Token Regression Check

**Files:**
- Create: `D:\suki.live\scripts\validate-style-tokens.mjs`

**Interfaces:**
- Consumes: `D:\suki.live\assets\css\site.css`, `D:\suki.live\assets\css\template.css`
- Produces: A non-zero exit code when required shared tokens diverge or are missing

- [ ] Add a validator that reads both CSS files and compares a curated list of shared `:root` variables.
- [ ] Run `node scripts/validate-style-tokens.mjs` before CSS changes and confirm it fails on the old token set.
- [ ] Keep the script lightweight and dependency-free so it can be reused in future style refactors.

### Task 2: Unify Shared Theme Variables And Core UI Rhythm

**Files:**
- Modify: `D:\suki.live\assets\css\site.css`
- Modify: `D:\suki.live\assets\css\template.css`

**Interfaces:**
- Consumes: Existing HTML structure in `index.html`, `registry.html`, and `u/index.html`
- Produces: Matching color tokens, typography scale, border radii, spacing, and calmer button/input/card states

- [ ] Replace the root theme variables in both stylesheets with the approved muted pink-blue palette.
- [ ] Align body text color, secondary text color, border color, panel color, and accent color across both files.
- [ ] Normalize headline sizes, card padding, nav/button/input radii, and shadow weight so the pages read as one system.
- [ ] Tone down overly bright interactive colors in creator pages, especially active nav, random-song button, access tags, and title chips.

### Task 3: Preserve Creator Page Background Mode While Making It Consistent

**Files:**
- Modify: `D:\suki.live\assets\css\template.css`

**Interfaces:**
- Consumes: Existing `body.has-body-bg` class behavior
- Produces: Semi-transparent header, cards, playlist items, and song title chips with hierarchy by opacity only

- [ ] Keep background-image mode semi-transparent rather than blurred.
- [ ] Give header, cards, list items, grid items, and title chips different opacities while staying in the same palette family.
- [ ] Ensure text contrast remains readable on both plain and image-backed pages.

### Task 4: Verify And Review

**Files:**
- Modify: `D:\suki.live\assets\css\site.css`
- Modify: `D:\suki.live\assets\css\template.css`
- Create: `D:\suki.live\scripts\validate-style-tokens.mjs`

**Interfaces:**
- Consumes: Updated CSS and validation scripts
- Produces: Fresh verification evidence for theme consistency and repo health

- [ ] Run `node scripts/validate-style-tokens.mjs` and confirm it passes.
- [ ] Run `node scripts/validate-repo.mjs` and confirm it still passes.
- [ ] Review the git diff for any remaining jarring color mismatches or accidental layout regressions.
