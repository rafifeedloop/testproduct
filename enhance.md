You are a senior Next.js + shadcn/ui engineer. Build an EXECUTIVE Test Dashboard page with a premium layout (NOT crowded) using the design tokens/utilities from style.md (imported as `styles`). Do not invent ad-hoc styles.

## Tech
- Next.js App Router (TypeScript)
- shadcn/ui: Card, Tabs, Table, Badge, Button, Select, Popover, Separator, Drawer, Accordion, ScrollArea
- lucide-react icons
- Tailwind; use classNames from `styles` (style.md)

## Page Goal (Layout Summary)
1) **Header row** — title left, filters + “Re-run filters” button right.
2) **Hero KPI band** — 3 cards in a 2/1/1 rhythm:
   - Left (2/4): **Hero KPI (Pass Rate)** with gradient card and tiny sparkline placeholder (no chart lib, simple SVG).
   - Right (1/4): **Runs Today** (white card).
   - Right (1/4): **Avg Duration** (white card).
3) **Trends row** — full-width card above the table:
   - Mini line-visual placeholder showing pass/fail/flaky over time (no chart lib; simple SVG lines + legend dots).
4) **Main content: Two-column grid**
   - **Left (2/3)**: “Test Runs” section with compact Table inside a Card.
   - **Right (1/3)**: sidebar stack of two cards:
     - **Devices Registry** (list with status badges: Idle/Busy).
     - **Flaky Breakdown** mini pie/donut placeholder + top failing devices list.
5) **Run detail** opens in a **right Drawer** with Accordion: Overview / Steps / Artifacts.

## Interaction & Behavior
- Filters (Status Select, Date Range Popover, Device Select) filter in-memory mock arrays (no network).
- Clicking a row’s **Open** action opens the Drawer; page layout must not shift.
- Minimal animations; keep UI calm.
- Tabs are NOT used for devices/trends; this layout shows both “Runs” and “Devices” simultaneously as per two-column design.

## Visual & Spacing (must match style.md)
- Use `styles.page.wrap` for background.
- Header uses `styles.header.wrap`, title `styles.header.title`, right controls `styles.header.right`.
- Inputs use `styles.input.base` + `styles.focus.ring`.
- Buttons: primary gradient = `styles.button.primary`; secondary = `styles.button.secondary`.
- Cards: `styles.card.gradient` for hero KPI; `styles.card.kpi` and `styles.card.base` elsewhere.
- Badges: `styles.badge.pass|fail|flaky|neutral`.
- Table wrapper: `styles.table.wrapper`, rows with `styles.table.divide`, action link = `styles.table.actionLink`.
- Drawer panel: `styles.drawer.panel`.

## File Scaffold (generate all)
app/(dashboard)/test-dashboard/page.tsx
components/dashboard/HeaderBar.tsx
components/dashboard/HeroKPIs.tsx
components/dashboard/TrendsStrip.tsx
components/dashboard/RunsTable.tsx
components/dashboard/RunDetailDrawer.tsx
components/dashboard/DevicesSidebar.tsx
components/dashboard/FlakyBreakdown.tsx
lib/mock-data.ts

## Mock Data (small, typed)
type Run = { id: string; status: "PASS"|"FAIL"|"FLAKY"|"RUNNING"; device: string; startISO: string; durationSec: number; };
type Step = { id: string; title: string; status: "PASS"|"FAIL"; json: Record<string, any>; screenshotUrl?: string; };
type Device = { id: string; name: string; os: "iOS"|"Android"; version: string; state: "Idle"|"Busy"; };

export const kpis = { runsToday: 14, passRate: 0.23, avgDurationSec: 345, flakyRate: 0.18 };
export const runs: Run[] = [/* 10–15 items across mixed statuses */];
export const stepsByRun: Record<string, Step[]> = {/* few per run id */};
export const devices: Device[] = [/* 5–8 items */];
export const trendPoints = {
  labels: ["Mon","Tue","Wed","Thu","Fri","Sat","Sun"],
  pass:   [6,7,5,8,9,7,6],
  fail:   [2,1,3,1,1,2,1],
  flaky:  [1,1,2,1,1,1,1]
};
export const flakyByDevice = [
  { device: "iPhone 14", percent: 34 },
  { device: "Samsung S24", percent: 28 },
  { device: "Pixel 8 Pro", percent: 22 },
];

## Component Responsibilities

### HeaderBar.tsx
- Left: <h1 className={styles.header.title}>Test Dashboard</h1>
- Right: Status <Select>, Date Range <Popover>, Device <Select>, Button (styles.button.secondary, icon: RotateCw)

### HeroKPIs.tsx (2/1/1 grid)
- Card A: className={styles.card.gradient}
  - Label muted, big metric `%` using `styles.type.kpi`
  - Subtext “Success rate”
  - Small inline SVG sparkline to the right (3–4 points, white stroke at 60% opacity)
- Card B & C: className={styles.card.kpi} with icon chip (styles.icon.chip)
  - Runs Today (number) + sublabel “Test runs”
  - Avg Duration (formatted mm:ss) + sublabel “Average time”

### TrendsStrip.tsx
- className={styles.card.base}
- Title “Trends (7d)” in `styles.type.section`
- Inline SVG with three polylines (pass green, fail brand-danger, flaky brand-warn) + tiny legend dots.

### RunsTable.tsx (left column)
- Wrapper `styles.card.base` + table wrappers from `styles.table.*`
- Columns: Run ID, Status (Badge), Device, Start (humanized), Duration, Action (link “Open”, styles.table.actionLink)
- Triggers RunDetailDrawer on click

### DevicesSidebar.tsx (right column top)
- Card with summary chips (Total/Available/In Use) and list of devices with state badge (Idle/Busy -> styles.badge.neutral)

### FlakyBreakdown.tsx (right column bottom)
- Card with title “Flaky breakdown”
- Donut/pie placeholder (SVG arcs using brand-warn) + list from `flakyByDevice`

### RunDetailDrawer.tsx
- Right-side Drawer `styles.drawer.panel`
- Accordion with sections:
  - Overview: Run id, device, start, duration, status
  - Steps: list each Step (title + tiny JSON preview code block, screenshot thumbnail placeholder)
  - Artifacts: thumbnails placeholders

## Layout in page.tsx
- <main className={styles.page.wrap}>
  - <HeaderBar />
  - <section className="grid grid-cols-12 gap-6">
      <HeroKPIs className="col-span-12" />
      <TrendsStrip className="col-span-12" />
      <div className="col-span-12 grid grid-cols-12 gap-6">
        <RunsTable className="col-span-12 lg:col-span-8" />
        <div className="col-span-12 lg:col-span-4 flex flex-col gap-6">
          <DevicesSidebar />
          <FlakyBreakdown />
        </div>
      </div>
    </section>
- Ensure responsive breakpoints collapse to one column on small screens.

## Accessibility
- Visible focus rings via `styles.focus.ring`.
- aria-labels on icon-only buttons.
- Table headers use `scope="col"`.
- Drawer focuses close button on open.

## Acceptance Checklist (must pass)
- [ ] Two-column layout with right sidebar cards; no tabs for devices/trends.
- [ ] Hero KPI (gradient) + two small KPIs; looks premium and not crowded.
- [ ] Trends card above table with simple inline SVG lines.
- [ ] Runs table left; Device + Flaky cards right; responsive on mobile.
- [ ] Run details open in Drawer; page layout does not shift.
- [ ] All classNames pulled from `styles` (style.md).
- [ ] Colors match brand tokens; spacing feels airy.

Return ALL files for the scaffold with runnable code and mock data.
