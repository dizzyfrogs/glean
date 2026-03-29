# Glean

Campus food waste tracker and redistribution platform. Kitchen staff log daily waste, managers get analytics and AI-powered recommendations, and local food banks can browse and claim surplus food before it gets thrown away.

Built for the 2026 ODU Hackathon.

---

## What it does

**Kitchen Staff** log waste entries in under 60 seconds. They pick a category, enter an item and quantity, optionally attach a photo, and submit.

**Kitchen Managers** see a dashboard with waste trends, cost estimates, CO2 equivalent, and three AI-generated recommendations powered by GPT-4o. They can broadcast surplus food to nearby food banks and track who claims it.

**Food Banks** browse a feed of available nearby surplus, filter by food type or urgency, read the kitchen's pickup instructions, and confirm a claim with their contact details.

---

## Tech stack

- Next.js 14 (App Router) + TypeScript
- Tailwind CSS
- Zustand for state management
- Recharts for data visualization
- Lucide React for icons
- OpenAI SDK v4 (GPT-4o) for AI recommendations

---

## Running it

**Requirements:** Node.js 18+

```bash
# Install dependencies
npm install

# Add your OpenAI key (optional — mock recommendations work without it)
cp .env.example .env.local
# then add: OPENAI_API_KEY=your_key_here

# Start the dev server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

The login screen lets you switch between the three roles. No real authentication is required.

---

## Project structure

```
app/
  (app)/
    staff/          # Waste logging page
    manager/        # Analytics dashboard
    foodbank/       # Surplus feed
  api/
    recommendations/ # GPT-4o route
lib/
  mock-data.ts      # Seeded waste logs and surplus offers
  store.ts          # Zustand store
  types.ts          # Shared TypeScript types
  constants.ts      # Categories, units, cost per lb
components/
  staff/            # Waste log form components
  manager/          # Dashboard, charts, broadcast modal
  foodbank/         # Offer cards, claim modal
  ui/               # Shared primitives (Button, Input, Toast, etc.)
```

---

## Notes

All data is in-memory via Zustand. Nothing persists between page refreshes, which is intentional for the demo. The mock data in `lib/mock-data.ts` is seeded with 30 days of realistic waste logs designed to surface clear patterns for the AI recommendations.


If `OPENAI_API_KEY` is not set, the recommendations panel falls back to mock recommendations so the demo works without an API key.