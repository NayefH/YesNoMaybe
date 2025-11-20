/**
 * Domain types used across the app.
 * These are UI-agnostic and can be shared between components, hooks and utils.
 */
/** A single selection a partner can make for an item. */
export type Choice = "like" | "try" | "dislike";
/** A single question/entry shown to the user. */
export type Level = "Anfänger" | "Fortgeschritten" | "Experte";
export type Item = {
  id: string;
  label: string;
  level?: Level; // Optional Schwierigkeitsgrad
  photo?: string; // Optional: URL oder lokale Datei (require-Pfad)
};
/** A group of items (section) for easier navigation and display. */
export type Category = { id: string; label: string; items: Item[] };
/** Mapping from item id to a user's chosen `Choice` (or undefined if unanswered). */
export type Answers = Record<string, Choice | undefined>;
