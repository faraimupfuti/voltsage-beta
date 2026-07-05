# VoltSage Solutions — Solar Sizing & Energy Intelligence Platform

Free, engineering-grade solar sizing tools for residential, small commercial and agricultural installations across Zimbabwe and Africa.

## What's inside

| Tool | Description |
|------|-------------|
| Residential & Small Commercial Sizing | 24-hour load profile engine — sizes inverter, battery and PV array from an appliance schedule |
| Agricultural Sizing | Farm-activity-based tool with motor surge multipliers and a full 7-activity equipment catalog |
| Battery Runtime Calculator | Usable energy and runtime from capacity, DoD, efficiency and connected load |

## Tech stack

- **Next.js 14** (App Router, TypeScript)
- **Tailwind CSS** — brand-matched color palette (orange/amber + teal/green on dark)
- **Three.js** canvas — animated hero scene (particles, rotating solar ring, live histogram)
- **Framer-ready** — all component animations use CSS transitions, no SSR conflicts

## Local development

```bash
npm install
npm run dev
# → http://localhost:3000
```

## Deploying to GitHub

```bash
git init
git add .
git commit -m "feat: initial VoltSage Solutions build"
git remote add origin https://github.com/YOUR_USERNAME/voltsage-solutions.git
git push -u origin main
```

---

## Deploying on Render (recommended — free tier available)

1. Push to GitHub (above).
2. Go to [render.com](https://render.com) → **New → Web Service**.
3. Connect your GitHub repo.
4. Set:
   - **Runtime**: Node
   - **Build command**: `npm install && npm run build`
   - **Start command**: `npm start`
   - **Environment variable**: `NODE_ENV=production`
5. Click **Create Web Service**.

Or use Docker (Render auto-detects the Dockerfile):
- Set **Runtime** to Docker. Done.

---

## Deploying on Fly.io

```bash
# Install flyctl: https://fly.io/docs/hands-on/install-flyctl/
fly auth login
fly launch          # detects Dockerfile automatically
fly deploy
```

`fly.toml` is auto-generated. The Dockerfile produces a minimal Alpine image (~120 MB).

---

## Deploying on Heroku

```bash
heroku login
heroku create voltsage-solutions
heroku stack:set container     # use Dockerfile
git push heroku main
heroku open
```

Or without Docker (buildpack):
```bash
heroku create voltsage-solutions
# Remove Dockerfile or add a .dockerignore that excludes it
heroku config:set NODE_ENV=production
git push heroku main
```

---

## Deploying on Vercel (zero-config)

```bash
npm i -g vercel
vercel          # follow prompts
```

Or connect GitHub repo at [vercel.com/new](https://vercel.com/new) — Next.js is auto-detected.

---

## Environment variables

None required for the base site. If you add a backend API (email service, database):

```bash
# .env.local
RESEND_API_KEY=re_xxxx          # for server-side email (optional)
DATABASE_URL=postgresql://...   # for saved sessions (optional)
```

---

## Calculation methodology

Based on **VoltSage Solar Design Calculation Methodology, Revision 1**.

Key formulas:
- `Ed_daily = Σ(qty × watt × hours)` — daily energy from load profile
- `E_night = Σ(Pi × ti)` — energy during 18:00–06:00 window only
- `C_battery = (E_night × autonomy) / (DoD × efficiency)` — battery from night energy
- `P_inverter = 1.3 × P_max` → rounded up to standard size [1, 1.5, 2, 2.5, 3, 3.5, 4, 5, 6, 8, 10, 12, 15, 20, 25, 30, 40, 50 kW]
- `P_surge = P_running + Σ(P_start − P_run)` for motor loads
- `E_PV = E_day + C_battery / 0.85` — PV covers daytime load AND battery recharge
- `P_array = E_PV / (PSH × 0.75)` — using location-specific peak sun hours

PSH values cover all 10 Zimbabwe provinces and 30+ African countries in 5 categories.

---

## Project structure

```
voltsage-solutions/
├── app/
│   ├── layout.tsx          Root layout + metadata
│   ├── page.tsx            Main page (assembles all sections)
│   └── globals.css         Brand CSS, utilities, animations
├── components/
│   ├── Header.tsx          Fixed nav with mobile menu
│   ├── Hero.tsx            Animated canvas hero (Three.js-style)
│   ├── ProblemsSection.tsx 6 solar-industry problem cards
│   ├── WhyTools.tsx        6 benefit cards
│   ├── ArticlesSection.tsx Expandable learn articles
│   ├── ContactAndFooter.tsx Contact form + footer
│   └── tools/
│       ├── ResidentialTool.tsx    Full residential sizing + histogram
│       ├── AgriculturalTool.tsx   Agricultural sizing with activity selector
│       └── BatteryRuntimeTool.tsx Battery runtime with ring gauges
├── lib/
│   └── calculations.ts     Full TypeScript calculation engine
├── public/
│   └── logo.png
├── Dockerfile
├── next.config.ts
├── tailwind.config.ts
└── tsconfig.json
```

---

## License

Proprietary — VoltSage Solutions Ltd. All rights reserved.
