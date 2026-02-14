# Real-time Typing Arena

Professional typing test web app built with **Next.js + TypeScript + Tailwind + Framer Motion + Recharts**.

## Implemented MVP

- Hidden textarea input capture (IME-safe on `onChange` value diff pattern)
- Character-by-character renderer (`correct`, `wrong`, `pending`, caret)
- Modes: `time`, `words`, `code`, `custom`, `precision`, `meditation`, `focus`
- Language switch: English, O'zbek, Russian, Arabic
- Live metrics: Raw WPM, Net WPM, CPM, Accuracy, Consistency, Error count
- Results dashboard with speed timeline + error heatmap
- Session history stored in localStorage
- Settings page (theme placeholder, font size, sound toggle)

## Run locally

```bash
npm install
npm run dev
```

Open http://localhost:3000

## Roadmap

- Real-time typing duel via WebSocket
- Daily streak system
- OpenGraph share-card image generation
- Analytics lab (growth / trends / best time of day)
- Ghost replay
- Developer API: `GET /stats/:username`
- Hardware experiment mode (keyboard-type analytics)
