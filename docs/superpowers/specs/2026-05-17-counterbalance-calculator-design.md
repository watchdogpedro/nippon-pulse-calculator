# Magnetic Counterbalance Calculator — Design Spec
**Date:** 2026-05-17  
**Project:** nippon-pulse-calculator  
**Status:** Approved

---

## Purpose

A standalone Vercel web app that lets customers enter a required counterbalance force and immediately see which Nippon Pulse GLS/GLR unit (or combination) matches. Will eventually be embedded on nipponpulse.com.

---

## Tech Stack

- **Framework:** Next.js 14 (App Router)
- **Styling:** Tailwind CSS
- **Chart:** Recharts (horizontal bar chart)
- **Deployment:** Vercel
- **Language:** TypeScript

---

## Product Data (Hard-coded)

13 models across 3 series. All internal math in Newtons; display in lbf by default.

| Model | Force (N) | Stator Ø | Rod Ø | Rod Mass | Stroke | Stator Length |
|-------|-----------|----------|-------|----------|--------|---------------|
| GLS-130/GLR-035 | 2.0 | 13mm | 3.5mm | 13g | 40mm | 65.5mm |
| GLS-130/GLR-040 | 2.66 | 13mm | 4.0mm | 15g | 40mm | 65.5mm |
| GLS-130/GLR-045 | 3.7 | 13mm | 4.5mm | 17g | 40mm | 65.5mm |
| GLS-180/GLR-075 | 4.9 | 18mm | 7.5mm | 53g | 40mm | 65.5mm |
| GLS-180/GLR-080 | 6.1 | 18mm | 8.0mm | 56g | 40mm | 65.5mm |
| GLS-180/GLR-085 | 7.3 | 18mm | 8.5mm | — | 40mm | 65.5mm |
| GLS-180/GLR-090 | 9.0 | 18mm | 9.0mm | — | 40mm | 65.5mm |
| GLS-180/GLR-095 | 10.5 | 18mm | 9.5mm | — | 40mm | 65.5mm |
| GLS-260/GLR-090 | 13.5 | 26mm | 9.0mm | — | 40mm | 75.5mm |
| GLS-260/GLR-095 | 16.8 | 26mm | 9.5mm | — | 40mm | 75.5mm |
| GLS-260/GLR-100 | 19.6 | 26mm | 10.0mm | 92g | 40mm | 75.5mm |
| GLS-260/GLR-105 | 22.2 | 26mm | 10.5mm | — | 40mm | 75.5mm |
| GLS-260/GLR-110 | 25.7 | 26mm | 11.0mm | — | 40mm | 75.5mm |

---

## UI Layout (Single Page, Option A)

### Zone 1 — Header
- NPA red (#CC0000) banner
- Logo + "Magnetic Counterbalance Calculator"

### Zone 2 — Force Input
- Large number input, centered
- Default unit: lbf
- Toggle switch: lbf ↔ N
- Live update on input change

### Zone 3 — Single Unit Range Chart
- Horizontal bar chart, one row per model (13 rows)
- Sorted low to high by force rating
- Bold red vertical line = customer's target force
- Color coding:
  - **Bright red** = within ±20% of target (match zone)
  - **Muted gray** = underpowered (below target)
  - **Light gray** = overpowered (above target)
- Click any bar → inline spec card expands below that row

### Zone 4 — Combinations Section
- Only shown when target > 5.8 lbf (25.7N, max single unit)
- Same chart style showing 2× and 3× combinations
- Same red-line marker, same click-to-expand behavior

---

## Calculator Logic

- **Conversion:** 1 lbf = 4.44822 N
- **Match zone:** ±20% of target force = highlighted red
- **Best match:** Closest force ≥ target (without going under by more than 10%)
- **Combinations:** 2× and 3× multiples of each model force rating
- **Spec card fields:** Part number, force (N + lbf), stator Ø, rod Ø, rod mass, stroke, stator length, operating temp, humidity, radial load, + "Request Quote" button

---

## Brand

- Primary: NPA Red `#CC0000`
- Secondary: White `#FFFFFF`
- Accent: Dark gray `#1A1A1A` for text
- Font: Clean sans-serif (Inter or similar)

---

## Deployment

- Standalone Vercel project
- Will later be embeddable as an iframe or React component on nipponpulse.com
