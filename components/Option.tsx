/**
 * Option
 * Small, reusable pill-button used to represent a selectable choice.
 * Pure presentation: styles + press handler are provided by the parent.
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
  label: string;
  active: boolean;
  color: string;
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
