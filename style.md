# Style Guide — BankDash-inspired (Tokens & Utility Stacks)

A crisp, card-centric system with brand blue gradient accents and generous whitespace.  
All UI generated from `claude.md` must use these tokens/utilities. No ad-hoc styles.

---

## 🎨 Brand Palette

| Token | Hex | Usage |
|---|---|---|
| `--brand-primary-500` | **#2D60FF** | Primary accents, links, active tabs |
| `--brand-primary-600` | **#295EEC** | Primary hover / gradient end |
| `--brand-ink` | **#343C6A** | Headings / strong text |
| `--brand-warn` | **#FEAA09** | Warnings / flaky |
| `--brand-danger` | **#FE5C73** | Errors / destructive |

**Gradient**: `from #2D60FF → to #295EEC` (to-tr / 30–45°)

**Neutrals**
- Page: `#F7F8FC` (≈ `zinc-50`)
- Surface: `#FFFFFF`
- Muted text: `zinc-500`
- Border: `zinc-200`

---

## 🧪 CSS Variables (add to `globals.css`)
```css
:root {
  --brand-primary-500:#2D60FF;
  --brand-primary-600:#295EEC;
  --brand-ink:#343C6A;
  --brand-warn:#FEAA09;
  --brand-danger:#FE5C73;

  --bg-page:#F7F8FC;
  --surface:#FFFFFF;
  --text-muted:#71717A;     /* zinc-500 */
  --border-subtle:#E4E4E7;  /* zinc-200 */

  /* Shape */
  --r-card: 1rem;     /* ~16px, rounded-2xl */
  --r-ctl: 0.75rem;   /* ~12px, rounded-xl */
  --r-chip: 9999px;   /* pill/full */

  /* Elevation */
  --e-0:   0 0 0 rgba(0,0,0,0);
  --e-1:   0 1px 2px rgba(0,0,0,0.04);
  --e-2:   0 4px 12px rgba(0,0,0,0.06);
  --e-3:   0 10px 24px rgba(0,0,0,0.10);
}

Typography

Font family
Use Tailwind font-sans (prefer Inter, Plus Jakarta Sans, or system UI).

Scale & Usage

Page Title: text-2xl font-semibold leading-8 text-[color:var(--brand-ink)]

Section Title: text-base font-semibold leading-6 text-[color:var(--brand-ink)]

Body: text-sm leading-6 text-zinc-800

Muted/Caption: text-xs leading-5 text-[color:var(--text-muted)]

KPI/Number: text-2xl font-semibold tracking-tight tabular-nums

Rules

Titles left-aligned; actions right-aligned.

Sentence case, concise.

Numbers always tabular-nums.

Shape, Spacing & Elevation
Shape

Cards: rounded-[var(--r-card)] (≈ rounded-2xl)

Controls: rounded-[var(--r-ctl)] (≈ rounded-xl)

Pills/Badges: rounded-[var(--r-chip)]

Spacing

Section gaps: gap-6

Card padding: p-5

Control height: h-10

Grid gutters: gap-4 (tight), gap-6 (default)

Elevation

Default surface: shadow-[var(--e-1)]

Popovers/Drawers: shadow-[var(--e-2)]

Hero/gradient cards: shadow-[0_8px_24px_rgba(41,94,236,0.25)]