# YesNoMaybe

## App-Überblick (Techdemo)

YesNoMaybe ist eine kleine Expo/React-Native-Techdemo, die Paaren dabei hilft, ihre Vorlieben spielerisch miteinander abzugleichen. Beide Partner tragen ihre Namen ein und beantworten danach Fragen aus verschiedenen Kategorien. Die App stellt die Antworten gegenüber und hebt Übereinstimmungen hervor, damit sofort sichtbar wird, welche Themen beide spannend finden oder ausprobieren möchten.
Derzeit ist dies eine Techdemo.

- Zwei Antwort-Modi: Tinder-ähnliches Swipen pro Frage (`SwipeQuestionnaire`) oder schnelles Durchtippen einer Liste (`Questionnaire`).
- Datengrundlage: Kategorien und Elemente liegen in `data/kinks.json` und können leicht erweitert werden.
- Matching-Logik: `like` und `try` zählen als Zustimmung, `dislike` schließt einen Punkt aus.
- Ergebnis: Eine gemeinsame Trefferliste zeigt, welche Punkte beide akzeptieren.
- Hinweis: Dies ist nur eine Techdemo und nicht für den produktiven Einsatz oder Beratungssituationen gedacht.

## Überblick

- Eine kleine Expo/React-Native-App, um Vorlieben zwischen zwei Partnern zu erkunden und zu vergleichen.
- Ablauf: Welcome → Namen → Partner A → Partner B → Vergleich.
- Datenbasiert: Kategorien und Items werden aus `data/kinks.json` geladen.

## Architektur

- **Types (`types.ts`)**: App-weite Domain-Typen (`Choice`, `Item`, `Category`, `Answers`). UI-unabhängig.
- **Components (`components/`)**: Präsentations-Komponenten.
  - `Option.tsx`: Kleiner Pill-Button für eine Auswahl.
  - `Questionnaire.tsx`: Statische Liste mit Buttons zu jedem Item.
  - `SwipeQuestionnaire.tsx`: Tinder-ähnliches Swipe-Interface für einzelne Items.
- **Hooks (`hooks/`)**: Wiederverwendbare State- und Ableitungslogik.
  - `useMatches.ts`: Berechnet Items, die beide Partner wollen (akzeptiert = like/try).
- **Utils (`utils/`)**: Reine Hilfsfunktionen.
  - `choice.ts`: `labelFor`, `colorFor`, `ACCEPT_CHOICES`.
- **Styles (`styles.ts`)**: Zentrale Farben und Style-Definitionen.

## Trennung der Verantwortlichkeiten

- `App.tsx` steuert Flow und State (Namen, Antworten, Step) und setzt die Komponenten zusammen.
- Komponenten konzentrieren sich aufs Rendern und lokales UI-Verhalten (z. B. Gesten).
- Hooks und Utils kapseln Logik, damit sie wiederverwendbar und testbar bleibt.

## Zentrale Konzepte

- **Choices**: `like`, `try`, `dislike`. Nur `like` und `try` zählen als Treffer.
- **Answers**: Map `item.id -> Choice` pro Partner.
- **Matches**: Schnittmenge der akzeptierten Choices beider Partner.

## Anleitung

- Starten: `npm start` (Expo) oder `npx expo start`.
- Items hinzufügen: Kategorien/Items in `data/kinks.json` erweitern.
- Matching-Regel ändern: `ACCEPT_CHOICES` in `utils/choice.ts` anpassen.
- Labels anpassen: `labelFor` in `utils/choice.ts` bearbeiten.

## Relevante Dateien

- `App.tsx`: Steuert Screens, nutzt `useMatches`, zeigt Ergebnisse.
- `components/SwipeQuestionnaire.tsx`: Gestensteuerung fürs Item-by-Item-Antworten.
- `components/Questionnaire.tsx`: Vollständige Liste mit Tipp-Auswahl.
- `utils/choice.ts`: Labels, Farben und akzeptierte Choices.
- `hooks/useMatches.ts`: Leitet die gemeinsame Trefferliste ab.

## Hinweise

- Animierte Card-Styles stehen inline, wenn es die Lesbarkeit verbessert; nicht-animierte Styles sind in `styles.ts`.
- Das Projekt vermeidet Geschäftslogik in Präsentations-Komponenten, wo immer möglich.
