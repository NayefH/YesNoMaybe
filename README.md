YesNoMaybe — App Overview

Overview
- A small Expo/React Native app to explore and compare preferences between two partners.
- Flow: welcome → names → partner A → partner B → compare.
- Data-driven: categories and items are loaded from `data/kinks.json`.

Architecture
- Types (`types.ts`): App-wide domain types (`Choice`, `Item`, `Category`, `Answers`). UI-agnostic.
- Components (`components/`): Presentational pieces.
  - `Option.tsx`: Small pill-button for a single choice.
  - `Questionnaire.tsx`: Static list with explicit buttons per item.
  - `SwipeQuestionnaire.tsx`: Tinder-like swipe interface per item.
- Hooks (`hooks/`): Reusable state/derivations.
  - `useMatches.ts`: Computes items both partners want (accept = like/try).
- Utils (`utils/`): Pure helpers.
  - `choice.ts`: `labelFor`, `colorFor`, `ACCEPT_CHOICES`.
- Styles (`styles.ts`): Centralized colors and styles.

Separation of Concerns
- `App.tsx` orchestrates flow and state (names, answers, step) and composes components.
- Components focus on rendering and small local UI behaviors (e.g., gestures).
- Hooks and utils encapsulate logic so it can be reused and tested.

Key Concepts
- Choices: `like`, `try`, `dislike`. Only `like` and `try` count as a match.
- Answers: Map of `item.id -> Choice` per partner.
- Matches: Intersection of accepted choices across both partners.

How-To
- Run: `npm start` (Expo) or `npx expo start`.
- Add items: extend `data/kinks.json` with more categories/items.
- Change matching rule: update `ACCEPT_CHOICES` in `utils/choice.ts`.
- Localize labels: adapt `labelFor` in `utils/choice.ts`.

Files of Interest
- `App.tsx`: Orchestrates screens, uses `useMatches`, renders results.
- `components/SwipeQuestionnaire.tsx`: Gestures for item-by-item answering.
- `components/Questionnaire.tsx`: Full list answering with taps.
- `utils/choice.ts`: Labels/colors and accepted choices.
- `hooks/useMatches.ts`: Derives the list of common matches.

Notes
- Animated card styles are inline where it simplifies readability; non-animated styles live in `styles.ts`.
- The project avoids business logic in presentational components when possible.

