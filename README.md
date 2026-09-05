# ROZANA v2

Single-page React app, mobile-first, all state on the device. No backend, no
real checkout.

## Run

```
npm install
npm run dev      # http://localhost:3000
npm run build
```

## Deploy (Vercel)

Plain Next.js 16 App Router — import the repo in Vercel and accept the defaults.
The v1 site ran on vinext + Cloudflare Workers; that toolchain (`vite.config.ts`,
`@openai/sites-vite-plugin`, `wrangler`, the shadcn `components/ui` kit) has been
removed. Nothing is server-rendered beyond the static shell.

## Structure

| Path | What it holds |
| --- | --- |
| `lib/data.ts` | All content: the four products, the 12 Check-In questions, the six box sizes, the rewards tables, the reels, the guides. Prices and the product list are fixed here. |
| `lib/engine.ts` | Scoring: answers → what she told us, where to start, suggested products, reels and box size. She always fills the box herself. |
| `lib/store.ts` | `useRozana()` — the persisted plan, points ledger, streak, routine log, subscription. localStorage key `rozana.plan.v2`. |
| `lib/analytics.ts` | The 21 events. Health-sensitive property keys are stripped before an event is written. |
| `components/` | Check-In, Dashboard, Range, BoxBuilder + checkout, Progress, Guidance, Consult, Roadmap, overlays. |
| `app/page.tsx` | Composition and navigation. |

## Points

1 point = ₹0.05, so 1000 points is ₹50 off. Every limit lives in `lib/store.ts`
and none of them are printed as a rules list: monthly earning stops at 540,
free members stop at 500 before a first box, subscribers earn 1.25×, redemption
is in blocks of 1000 up to 2000 per box, points post on shipping and expire six
months after the last visit. Reaching one produces a short friendly line
(`components/Notice.tsx`), never a rule.

`components/PointsExplainer.tsx` is the customer-facing page: what a point is
worth, five ways to earn, what to spend them on, when they arrive and how long
they last. Reachable from the header balance and the progress section.

Referral is `REFERRAL_POINTS` in `lib/data.ts` — one number to change.

## Daily challenge

41 questions in `lib/data.ts` across three formats that rotate daily —
Remember when (nostalgia), Swap it (which food has more protein, calcium or
fibre) and Kitchen quiz. One question a day, one attempt, 10 points for a
correct answer. Answered question ids are stored locally so a question never
comes back; the answer and explanation always show, right or wrong, followed by
tomorrow's format.

## Progress and streaks

`components/ProgressPanel.tsx` renders on the dashboard and in My progress, from
real stored state only: streak dots, points with a bar to the next redemption
("745 more to unlock ₹50 off"), day of 21, this week's checklist, and servings
left with an estimated reorder date. A visitor with no plan sees none of it.

A single missed day is forgiven — the streak carries on with a quiet "your
streak is safe". Two missed days in a row start it again.

## Build your box

`components/BoxBuilder.tsx`. She picks a box size, then allocates sachets across
the four flavours herself — nothing is assigned, locked or randomised. Any
flavour may be zero, all of one flavour is valid, and price is set by size alone.
Changing size rescales the current mix (largest remainder) so the total lands
exactly on the new size, and says so. Steppers are inert rather than disabled at
the bounds, carry per-product labels, and the running total is an `aria-live`
region.

## Copy

Written for a customer, not for an evaluator. There is one honest signal that
this is not a live storefront — a single line in the footer — and three
disclaimers, each placed once where it is relevant: guidance is never a
diagnosis (hero and Check-In), ongoing or severe symptoms need a doctor
(symptom sections), allergens and dietary suitability (each product panel).

## Known placeholders

- `public/itc-logo-white.png` is the v1 asset. Replace it with the official mark
  if you want.
- Reels have no video files. Each tile opens a panel describing the reel and
  carries its SEO text; nothing loads until tapped.
- No payment is taken. The dashboard has a "mark my box as shipped" control so
  the points-arrive-on-shipping rule is visible.
