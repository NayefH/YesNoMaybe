import { useMemo } from 'react';
import type { Answers, Choice, Item } from '../types';
import { ACCEPT_CHOICES } from '../utils/choice';

/**
 * useMatches
 * Derives the list of items where both partners selected a positive choice.
 * Positive choices are defined in `ACCEPT_CHOICES` (currently: like/try).
 *
 * @param allItems Full list of items to match against.
 * @param answersA Answers of partner A.
 * @param answersB Answers of partner B.
 * @returns Items that both partners want (intersection of ACCEPT_CHOICES).
 */

//
export function useMatches(allItems: Item[], answersA: Answers, answersB: Answers) {
  return useMemo(() => {
    return allItems.filter(
      (k) => ACCEPT_CHOICES.has(answersA[k.id] as Choice) && ACCEPT_CHOICES.has(answersB[k.id] as Choice)
    );
  }, [allItems, answersA, answersB]);
}
