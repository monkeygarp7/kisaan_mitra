# Frontend changes — what was added and why

No backend files were touched. No existing CSS rule, color, font, layout,
route, or page structure was removed or changed — everything below is
either a new file, or a small additive change to an existing page
(new fields/buttons wired to real data, using the same visual classes
that already existed).

## 1. Zero-dependency feature additions
Everything below uses **native browser APIs only** — no new npm
packages were added, so the bundle stays just as light for low-network
areas:
- **Voice typing** — `src/utils/speech.js` (`useVoiceInput`) using the
  Web Speech API. Dropped into text fields via
  `src/components/VoiceInputButton.jsx` (Register: name/mobile/village,
  Login: mobile, Detect: location, Expert Validation: description).
- **Listen to result (TTS)** — `speak()` in `src/utils/speech.js`, used
  by `src/components/SpeakButton.jsx` on the Result and Advisory pages.
  Auto-plays once when the Result page opens.
- **Camera + language on first load** —
  `src/components/OnboardingGate.jsx`, shown once per device
  (`localStorage['cropcare-onboarded']`), wraps the app in `App.jsx`.
  Language can still be changed anytime from the existing navbar.
- **Location permission on scan start** — requested the moment
  `DetectDisease` mounts, used only to feed the hotspot-mapping data
  (see below). If denied, scanning still works, just without hotspot
  mapping for that scan.
- **Multi-angle photo capture** — `DetectDisease.jsx` now guides the
  farmer through up to 3 angles (first one required, the rest optional
  with a Skip option so it stays light on slow connections). Extra
  angle photos are also run through the model and stored via the
  existing `/upload-image` endpoint.
- **Weekly scan reminder + nearby hotspot alerts** —
  `src/utils/notifications.js`, using the Notification API. Both are
  **opt-in toggles on the Profile page**, and only apply to people who
  registered (not guests). Important limitation: without a push server
  on the backend, these can only fire while the app/browser is open
  (checked on Dashboard load) — true background push would need a
  backend change, which was intentionally not made.

## 2. Wiring pages to the backend that already existed but wasn't used
These pages had **zero backend calls before** (fully hardcoded demo
data) and now use the real endpoints:
- `Register.jsx` → `POST /farmers` (added Village + Crop fields, since
  the backend requires them)
- `Login.jsx` → resolves the farmer created on that device and
  refreshes via `GET /farmers/{id}` (see limitation below)
- `DetectDisease.jsx` / `Result.jsx` → `POST /predict`, `POST /reports`,
  `POST /upload-image`, `GET /weather`, `POST /weather/save`,
  crop lookup/creation via `GET|POST /crops`
- `Reports.jsx` → `GET /farmers/{id}/reports`
- `RiskForecast.jsx` → `GET /weather` + `GET /risk-assessment`
- `HotspotMap.jsx` → hotspot list now built from `GET /reports`
  (the illustrative map graphic itself was kept as-is — a real
  tile-based map would add real network weight for rural users)
- `ExpertValidation.jsx` → `GET /experts`, `POST /referrals`
- `Profile.jsx` → real farmer + crop data via `GET /farmers/{id}` and
  `GET /farmers/{id}/crops`

## 3. Known limitations (backend-side, not fixed — backend was off-limits)
- **No CORS middleware** in `main.py`, and **no auth/login table** at
  all (farmers have no password column). To keep this to a frontend-only
  change, `vite.config.js` now proxies `/api/*` to the backend during
  `npm run dev` (see `.env.example`), which sidesteps CORS without
  touching the backend. Login is therefore a "remember this device"
  flow, not real cross-device authentication — worth flagging to
  whoever owns the backend if real accounts are needed later.
- `/predict` currently returns a fixed demo result regardless of the
  photo — multi-angle capture and image uploads are fully wired and
  ready, they just won't change the output until the real model is
  connected on the backend.
- `disease_reports` has no crop or location column, so report history
  can't show which crop/village a past scan was for — only the disease
  name/confidence/date.

## How to run
```
cd CropCare-SIH26131-Updated
npm install
npm run dev
```
Run the FastAPI backend separately (default assumed at
`http://127.0.0.1:8000`, see `.env.example` to change it).

## Kisaan Mitra UI / Scan Update (2026-09-05)
- Renamed the visible website branding from CropCare to **Kisaan Mitra** and updated the browser title.
- Added **JAI JAWAN JAI KISAN** to the home page.
- Changed the home-page farmer copy to **Built for Farmers**.
- Removed crop selection and manual location entry from the scan screen.
- Kept automatic browser location permission for hotspot mapping; location is no longer typed by the farmer.
- Scan AI now runs without requiring a manually selected crop and uses the AI response (or saved farmer crop as a fallback) for crop/weather enrichment.
- Added camera controls for supported devices: **zoom**, **flashlight/torch**, and **camera/lens switching** between front and rear cameras.
- Added **Scan Again** on the result page.
- Added a global lightweight 3D farming motion layer with floating leaves, sprout, wheat, sun/cloud and particles; existing colors/theme remain unchanged.
- Added subtle 3D hover depth to existing cards and a motion-safe fallback for reduced-motion preferences.
