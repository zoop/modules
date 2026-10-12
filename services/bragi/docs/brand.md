# Brand — Modules (working name)

> Brand guidelines for the product. **Name status:** using **"Modules"** as the
> working market name for now; the final brand is still TBD (lead candidate
> *Adjura* was dropped — domain appears taken). "Modules" is also the internal
> platform/monorepo codename, so the two coincide temporarily; revisit before any
> public launch / SEO / trademark push. See [product-vision.md](./product-vision.md).
>
> Captured 2026-10-03.

## Logo — "Ascend"

Three stacked chevrons rising to an amber peak. Meaning: the **modules** (the
composable capabilities) stack and resolve **upward to a decision** (the amber
peak) — the platform and the verdict in one mark. Reads as an implied "A".

**Assets** (in [`brand/`](./brand/)):

| File | Use |
|---|---|
| `brand/mark.svg` | primary mark, light backgrounds |
| `brand/mark-dark.svg` | mark for dark backgrounds (brighter teal/amber) |
| `brand/favicon.svg` | simplified 2-chevron mark for 16–32px |
| `brand/icon.svg` | app-icon tile (navy gradient + mark) |

**Rules:** keep clear space around the mark ≥ the height of one chevron. Never
re-colour outside the palette, add effects, rotate, or stretch. Below ~24px use
`favicon.svg` (two chevrons), not the three-chevron mark. The amber peak is always
the single accent — don't make all three chevrons amber.

**Wordmark:** "Modules" set in **Space Grotesk** (600), tight tracking (-0.015em),
navy `#0B1B2B` on light / white on dark. Lockup = mark + wordmark with the
wordmark's cap-height ≈ the mark's height.

## Palette

The category is a wall of navy/blue. We **lead with teal**, make **amber** the
signature accent (almost unused by competitors), keep navy as a near-black canvas,
and reserve violet for the AI story.

| Role | Light | Dark | Notes |
|---|---|---|---|
| Primary — Teal | `#0E7C7B` | `#2DD4BF` | brand colour, primary actions |
| Ink / canvas — Navy | `#0B1B2B` | `#0A0F1A` | text on light; surface on dark |
| Signature accent — Amber | `#E08A00` (text `#B45309`) | `#FBBF24` | the focal accent; "needs review" |
| AI accent — Violet | `#6D4AFF` | `#A78BFA` | use sparingly, for the AI/agent story |
| Risk · high | `#B91C1C` | — | always paired with an icon/label |
| Risk · review | `#B45309` | — | never colour-only |
| Surface | `#FFFFFF` / `#F6F8F9` | `#0A0F1A` / `#172033` | |
| Text | `#0F172A` | `#E4E7EC` | avoid pure black/white |

**Accessibility:** body text ≥ 4.5:1, large/UI ≥ 3:1. **Amber fails as small text
on white — use `#B45309`** for text; keep bright amber for fills/icons/borders.
**Never encode risk by colour alone** (pair with icon/label/shape); avoid red/green
pairs (colour-blindness) — use a red→amber→teal scale that also varies in lightness.

## Typography

| Role | Face | Notes |
|---|---|---|
| Display / marketing | **Space Grotesk** | distinctive, ownable headlines |
| Product UI / body | **IBM Plex Sans** | institutional warmth, data-dense screens |
| Data / IDs / amounts / scores | **IBM Plex Mono** | `tabular-nums` + slashed zero so columns align |

All three are free/open (Google Fonts). Avoid defaulting to Inter-only — it's
ubiquitous and builds no identity.

## Do / Don't

**Do:** lead with teal; make amber the signature; demote navy to canvas; ship the
real mark (works at 16px and in mono); use mono + tabular figures for all data;
build light + dark tints and check every pair at WCAG AA.

**Don't:** default to insurtech blue; use a blue gradient + abstract swoosh; go
wordmark-only like the whole category; use shield / neural-mesh / hexagon / robot
clichés; encode fraud risk by red-vs-green alone; set small amber text on white.
