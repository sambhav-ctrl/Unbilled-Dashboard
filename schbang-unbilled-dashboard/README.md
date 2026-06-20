# Schbang — Unbilled Intelligence Dashboard (React + Vite)

Live dashboard for the Approach 1 pipeline. Reads scoped data from the Apps Script
`doGet` Web App (which serves the CENTRAL sheet), and renders the Director,
VP, and HOD views with role detection done server-side.

## Local development
```bash
npm install
cp .env.example .env        # then edit .env, set VITE_API_URL to your /exec URL
npm run dev                 # http://localhost:5173
```
Test a specific role without logging in by appending `?email=`:
```
http://localhost:5173/?email=someone@schbang.com
```

## Build
```bash
npm run build               # outputs to dist/
npm run preview             # preview the production build
```

## Deploy to Cloudflare Pages
1. Push this folder to a Git repo (GitHub/GitLab).
2. Cloudflare dashboard → Pages → Create project → connect the repo.
3. Build settings:
   - Framework preset: **Vite**
   - Build command: **npm run build**
   - Build output directory: **dist**
4. Settings → Environment variables → add:
   - `VITE_API_URL` = your deployed Apps Script `/exec` URL
5. Deploy. (`public/_redirects` handles SPA routing.)

To update the API URL later, change the env var and redeploy — no code change.

## How role scoping works
The browser never decides what a user may see. It calls the Web App, which reads
the caller's email (or the `?email=` test override), resolves their role from the
MAPPING tab, and returns **only** the rows they're allowed to see. The UI just
renders whatever it receives:
- **DIRECTOR / Finance HOD** → all rows, company-wide summary + department deep-dive.
- **VP** → their SBU(s) only.
- **HOD** → their department only.

## Project structure
```
src/
  main.jsx              entry
  App.jsx               shell: fetch, status, role routing
  styles.css            all styles (Schbang palette)
  lib/api.js            fetch + normalize CENTRAL rows + formatters
  components/
    Kpis.jsx            the four KPI tiles
    BarPanel.jsx        Retainer/VAS bars by group
    EstimateTable.jsx   sortable/searchable estimate table w/ expandable notes
    DirectorView.jsx    company-wide view + drill chips
    ScopedView.jsx      VP (SBU) and HOD (department) view
    States.jsx          loading / error / setup / no-access
```

## Note on CORS
Apps Script Web Apps generally allow cross-origin GETs. If a browser blocks the
call, ensure the deployment access is "Anyone within <org>" or "Anyone", and that
you're loading the dashboard over https (Cloudflare Pages does this) rather than
from a local file.
