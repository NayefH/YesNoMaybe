import { COLORS } from '../styles';
import type { Choice } from '../types';

/**
 * Choices utilities
 * - ACCEPT_CHOICES: set of choices considered a positive match for both partners
 * - labelFor: localized label for a given choice
 * - colorFor: semantic color for a given choice
 */
export const ACCEPT_CHOICES: ReadonlySet<Choice> = new Set<Choice>(['like', 'try']);

/** Returns the display label for a given choice. */
export function labelFor(choice: Choice | undefined): string {
  return choice === 'like' ? 'Mag ich' : choice === 'try' ? 'Ausprobieren' : 'Mag ich nicht';
}

/** Returns the semantic color for a given choice. */
export function colorFor(choice: Choice | undefined): string {
  return choice === 'like' ? COLORS.yes : choice === 'try' ? COLORS.maybe : COLORS.no;
}
