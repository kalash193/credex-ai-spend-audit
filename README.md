# StackTrim AI Spend Audit

StackTrim is a free AI spend audit for startup founders and engineering managers who pay for Cursor, Copilot, Claude, ChatGPT, API usage, Gemini, or Windsurf. Users enter their stack, see plan-fit recommendations and savings immediately, then capture or share a public report URL.

Live URL: TODO after deploy.

## Screenshots

Add three screenshots or a 30-second Loom/YouTube walkthrough before submission:

- TODO: landing/input screen
- TODO: audit results screen
- TODO: shareable public report screen

## Quick Start

```bash
npm install
npm run dev
npm test
npm run build
```

Deploy on Vercel or Netlify as a Vite React app. Add backend provider environment variables before replacing the current local-storage lead adapter.

## Decisions

1. React + TypeScript + Vite: fast local iteration and enough type safety for audit math without the routing overhead of a larger framework on day one.
2. Hardcoded audit rules: the assignment asks for defensible finance logic; deterministic rules are easier to test and explain than LLM-generated math.
3. Email gate after value: the app shows savings first, then asks for an email, matching the product requirement and reducing form abandonment.
4. Public audit data only: share URLs store tools and savings but exclude lead fields, so reports are useful without leaking company identity.
5. Local adapter first: lead capture is isolated behind storage helpers so Supabase/Firebase can replace it without touching the UI.

## Current Status

- Spend form supports the required tools and persists through reloads.
- Audit engine produces per-tool recommendations, monthly savings, annual savings, and honest "spending well" output.
- Shareable URL uses `#audit/:id` locally; production should move this to server-backed public routes for Open Graph rendering.
- Lead capture includes a honeypot and minute-level rate cap in the local adapter.
