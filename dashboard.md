# Claude Brief — Minimal Test Dashboard (Features Spec)
**Stack:** Next.js (App Router) + TypeScript + shadcn/ui + Tailwind  
**Style source:** Use the tokens & utility stacks defined in `style.md`. Do NOT invent new styling.

## 🎯 Objective
Deliver an executive-friendly **Test Dashboard** that matches the reference look (see `style.md`) but is **uncluttered** and uses **progressive disclosure**.

---

## 🚫 Hard Anti-Requirements
- ❌ No device sidebar on first render.
- ❌ No runs table visible on first load.
- ❌ Max **3 KPI tiles** above-the-fold; expose extras via “More metrics”.
- ❌ No inline run details (open in a **right Drawer**).
- ❌ No heavy borders or zebra striping.

---

## ✅ Must Render (Above-the-fold)
1) **HeaderBar**
   - Left: Title `Test Dashboard`
   - Right: Filters → `Status Select`, `Date Range Popover`, `Device Select`
   - Secondary action: **Re-run filters** (button)
   - Use `styles.header.wrap`, `styles.input.base`, `styles.button.secondary` from `style.md`.

2) **KpiStrip (exactly 3 tiles)**
   - KPIs: **Runs Today**, **Pass Rate**, **Avg Duration**
   - Each tile uses `styles.card.kpi` and an icon chip `styles.icon.chip`.
   - “**More metrics**” (quiet text button) opens a Popover showing **Flaky Rate**.

3) **PrimaryCTA**
   - One concise sentence + **“View runs”** primary button
   - When clicked, reveal Runs content below (within **Runs tab**)

---

## 📑 Below-the-fold (Tabs)
- **Tabs:** `Runs` (default), `Devices`, `Trends` — use `styles.tabs.nav`.

### Runs (default)
- Initially only CTA visible; after **View runs**, show a compact **Runs Table** inside a Card:
  - Columns: Run ID • Status (Badge) • Device • Start • Duration • Action(“Open”)
  - Row action opens **Run Detail Drawer** (right) with **Accordion**:
    - *Overview* (summary fields)
    - *Steps* (list; each step shows tiny JSON preview & optional screenshot placeholder)
    - *Artifacts* (thumbnail placeholders)
- Use: `styles.card.base`, `styles.table.wrapper`, `styles.badge.status.*`, `styles.drawer.panel`.

### Devices
- Summary chips (Total / Available / In Use), then a simple device list (no thumbnails).
- Use: `styles.card.base`, `styles.badge.neutral`.

### Trends
- Placeholder Card with text “Pass rate over time” (no chart lib).
- Use: `styles.card.base`.

---

## 🗂️ Files to Generate
