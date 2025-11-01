/**
 * Option
 * Kleiner, wiederverwendbarer "Pill"-Button zur Darstellung einer auswählbaren Option.
 * Reines Presentational-Component: Styles, Farbe und onPress kommen vom Parent.
 *
 * Siehe auch:
 * - React Native TouchableOpacity: https://reactnative.dev/docs/touchableopacity
 * - Accessibility-Rollen und -Eigenschaften: https://reactnative.dev/docs/accessibility
 */
import React from 'react';
import { Text, TouchableOpacity } from 'react-native';
import { styles } from '../styles';

export default function Option({
  label,
  active,
  color,
  onPress,
}: {
  /** Sichtbarer Text der Option. */
  label: string;
  /** Ob die Option aktuell aktiv/ausgewählt ist (steuert Styles). */
  active: boolean;
  /** Rahmen- und (wenn aktiv) Hintergrundfarbe der Option. */
  color: string;
  /** Callback bei Klick/Touch. */
  onPress: () => void;
}) {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={[
        styles.optBtn,
        { borderColor: color },
        active ? { backgroundColor: color } : null,
      ]}
      accessibilityRole="button"
    >
      <Text style={[styles.optText, active ? { color: '#0b132b' } : null]}>
        {label}
      </Text>
    </TouchableOpacity>
  );
}
