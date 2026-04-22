# Xzibit Dashboards

TV signage dashboards for Fusion Signage playback in the Xzibit office, warehouse, kitchen, and workshop. Dark theme, fixed 1920px viewport, Chart.js visualisations — TV-first design, not aligned to Xzibit App Standard v1.0 (deliberately).

## Files

| File | Route | Description |
|---|---|---|
| `v2-bonus-dashboard.html` | `/bonus` | Revenue, margin, and bonus threshold vs FY targets |
| `v2-goals-summary.html` | `/goals-summary` | Company-wide goal completion rate |
| `v2-goals-departments.html` | `/goals-departments` | Department-level goal breakdown |
| `index.html` | `/` | Landing page listing all three dashboards |
| `vercel.json` | — | Clean-slug rewrites and security headers |

## Data source

Public Google Sheet — spreadsheet ID `1VumQnhFi2siIvaWHPZ1LuMdFiqI6ifjS_sHJIAKRi4c`

| Tab | GID |
|---|---|
| Financial | `864771061` |
| Goals | `368453036` |

The sheet must be shared as **"Anyone with the link → Viewer"** for the dashboards to fetch data. Auto-refresh runs every 15 minutes.

## Updating targets each financial year

Targets are hardcoded in the HTML files. Search each v2 file for these constants and update the values:

| Constant | File(s) | What it controls |
|---|---|---|
| `REV_TARGET` | `v2-bonus-dashboard.html` | Revenue target (e.g. `10342000`) |
| `MGN_TARGET` | `v2-bonus-dashboard.html` | Margin target (e.g. `31.66`) |
| `GOALS_TOTAL` | `v2-goals-summary.html`, `v2-goals-departments.html` | Total number of goals this FY |
| `BONUS_THRESHOLD` | `v2-bonus-dashboard.html` | Goals needed to unlock bonus (e.g. `14`) |

## Data source — parsed labels

The bonus dashboard parses the **Financial tab** by row label (column A), not by row index. This means sheet reordering is safe. The eight labels the code looks for (case-insensitive, whitespace-trimmed):

| Sheet row label | `fd` property | Notes |
|---|---|---|
| `Budget Income` | `fd.monthlyBudgetIncome` | Monthly budget, Jul–Jun |
| `Cumulative Budget Income` | `fd.cumulativeBudgetIncome` | Running total; `[11]` = full-year income target |
| `Budget Cumulative GP Margin` | `fd.cumulativeBudgetMargin` | Margin floor reference |
| `Target Cumulative GP Margin` | `fd.cumulativeTargetMargin` | Margin stretch reference |
| `Cumulative Actual Income` | `fd.cumulativeActualIncome` | Running YTD actual; rightmost non-zero = current month |
| `Total Actual Income (Fathom)` | `fd.monthlyActualIncome` | Monthly actuals for the line chart |
| `Actual GP Margin` | `fd.monthlyActualMargin` | Monthly margin rate for the chart; may be stored as decimal (0.317 → 31.7%) |
| `Cumulative Gross Profit` | `fd.cumulativeGrossProfit` | Dollar amount; used to derive YTD margin |

Derived values available on `window.fd` after parse:
- `fd.ytdActualIncome` — cumulative income to current month (used as the headline revenue figure)
- `fd.ytdActualMargin` — `cumulativeGrossProfit[idx] / cumulativeActualIncome[idx] × 100` (YTD %, used as headline margin; more stable than monthly rate)
- `fd.incomeTarget` — `cumulativeBudgetIncome[11]` (June cumulative = full-year target)
- `fd.currentMonthIdx` — index of rightmost non-zero month in `cumulativeActualIncome`

If any row label is not found, the code falls back to the hardcoded constants and logs a `console.warn`.

### Goals tab expected shape

The goals tab (gid `368453036`) is parsed per row. Expected column layout:

| Index | Content |
|---|---|
| 0 | Department name (must match one of the 9 in `DEPT_NAMES`) |
| 1 | Goal title |
| 2–8 | Review status columns (one per review cycle, e.g. "March 2026", "April 2026") |
| 9 | Notes from last meeting (exposed as `.note` on each goal object; rendered in a later PR) |

The code scans columns 2–8 **right-to-left** and takes the first non-empty cell as `currentStatus`. This means the April 2026 review always wins over March 2026 if both are populated. The header row (row 0) provides the `reviewDate` label for each column.

All three dashboards expose `window.gd.goals` (array of goal objects) and `window.bonus` (computeBonus output) in the browser console for dev inspection.

## Local preview

```bash
python3 -m http.server 8000
```

Then visit `http://localhost:8000/` — note the clean-slug routes (`/bonus` etc.) only work on the Vercel deploy, not local.

## Deploy

Canonical deploy: **https://xzibit-dashboards.vercel.app** under `jnebauers-projects` on Vercel. Auto-deploys on push to `main`.
