# Rule Museum

A mobile-first, offline-capable puzzle prototype built for fast solo development.

## MVP included

- Single-player campaign with 12 handcrafted levels
- Core loop: observe → probe → infer → solve
- Three rule families: logic, visual pattern, interaction behavior
- Onboarding in levels 1–3
- Deterministic hint system with an optional AI hook
- Rewarded-hint UX and optional future IAP slots
- Daily challenge, streak tracking, and weekly pack rotation
- Offline-first caching via a service worker

## Run locally

```bash
npm test
npm run lint
npm run start
```

Then open `http://localhost:4173`.

## AI hook

If you want AI-generated hint flavor later, define a global provider before `app.js` loads:

```html
<script>
  window.RuleMuseumAI = {
    async generateHint(context) {
      return context.fallbackHint;
    }
  };
</script>
```

The puzzle truth still stays deterministic in `game.js`.

## Monetization direction

- Main campaign remains fully free
- Hint unlock flow is sponsor/reward based
- Optional future purchases: ad-free pass, theme packs
- No hard paywall on progression
