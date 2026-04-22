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

## Local preview

```bash
python3 -m http.server 8000
```

Then visit `http://localhost:8000/` — note the clean-slug routes (`/bonus` etc.) only work on the Vercel deploy, not local.

## Deploy

Canonical deploy: **https://xzibit-dashboards.vercel.app** under `jnebauers-projects` on Vercel. Auto-deploys on push to `main`.
