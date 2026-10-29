# mahmya-website

The public Mahmya Island website (what guests see), built with React 19, TypeScript and Vite. The staff side is `../mahmya-dashboard`; both talk to `../mahmya-back`.

The design, pages, styles, photos and fonts come from the demo at `/home/muhanad/Kinetics/mahmya` (its `src/site`, with the `shared/` types it uses). The demo's own server isn't used. Data comes from mahmya-back instead.

## Run

Requires Node.js 22.12+, and mahmya-back running on port 3001.

```bash
npm install
npm run dev        # http://127.0.0.1:5173 (or the port Vite prints)
npm run typecheck
npm run build      # dist/
```

In development Vite proxies `/api` to `API_PROXY_TARGET` (default `http://localhost:3001`), so the backend's CORS settings don't matter. In production, serve the site and proxy `/api` on the same origin, or set `VITE_API_URL` to the backend's origin and add the site to the backend's `CORS_ORIGINS`. A static host must rewrite routes such as `/book` to `index.html`.

## What's live and what's a preview

| Part | Source |
| --- | --- |
| Packages (name, tagline, photo, adult and child price, included add-ons, Day/Sunset trip times) | **Live**: `GET /api/public/catalog` |
| Add-ons on the booking form (name, time, price, how it's charged) | **Live**: same endpoint |
| Booking form: package, date, boat, party, add-ons, details, price | Works in the browser on live packages and prices |
| Confirming a booking | Preview: no public booking endpoint yet, so the button is disabled |
| Date availability (places left) | Preview: static sample, every future day open with 120 places |
| Trip extras (snorkelling trip, lunch) | Preview: these are backend add-ons now |
| Weather (hero card) | Preview: static sample week |
| Find / cancel my booking, My Profile lookup | Preview: form disabled |
| Event and contact enquiries, newsletter | **Live**: validated submissions to mahmya-back; staff see enquiries and subscribers in the dashboard |
| Visit and booking-started counts | Off: nothing is sent |
| Island, activities, dining, gallery, reviews, FAQ, terms | Static content from the design, the same as the demo |

Previews are wrapped in `Planned` (`src/site/components/Planned.tsx`): dimmed, outlined, and tagged "Preview · … not live". To connect one, add its path to `LIVE_PATHS` in `src/site/api.ts`, replace the sample data in `src/site/hooks.ts` where it has some, and remove the `Planned` wrapper.

Until the catalog loads, or if the backend can't be reached, the pages show the demo's original five packages and nine add-ons.

## How backend records map to the design

`src/site/backend.ts` converts the catalog:

- **Package photo:** the backend's `photoUrl`, otherwise the closest picture from the site's library by name (private boat, groups, full program, lunch, otherwise day use).
- **What's included:** the package's included add-ons, otherwise its description.
- **Trip times:** the `DAY` and `SUNSET` slots become the site's Day (`001`) and Sunset (`002`) schedules. A slot the package doesn't have is shown as not sold.
- **Child price:** the backend's exact `childPrice`.
- **Add-ons:** a package offers every active add-on it doesn't already include. Water add-ons are matched to the activity cards by name (kayak, SUP/paddle, Sea-Spi, banana, ringo).
- **Not on the backend yet:** "Most popular" (`featured`), add-on daily limits and an EGP price are left empty or off.

## Contact, event and newsletter submissions

Contact and event forms submit to `POST /api/public/enquiries`; the footer uses `POST /api/public/subscribe`. Successful forms show confirmation, validation/network errors remain visible, and duplicate newsletter signups show an already-subscribed message. The backend normalizes emails, rejects the hidden spam field, and rate-limits submissions. Guest accounts are not required. Staff manage enquiries at the dashboard’s `/website/enquiries` and newsletter subscribers at `/website/subscribers`. Submission does not send an email automatically.
