/**
 * Questionnaire
 * Renders a categorized list of items with three explicit choices per item.
 * Enables the continue button only when all items have an answer.
 */
import React, { useMemo } from 'react';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { COLORS, styles } from '../styles';
import Option from './Option';
import type { Answers, Category, Choice } from '../types';

export default function Questionnaire({
  title,
  sections,
  answers,
  onChange,
  onNext,
}: {
  title: string;
  sections: Category[];
  answers: Answers;
  onChange: (id: string, c: Choice) => void;
  onNext: () => void;
}) {
  const allItems = useMemo(() => sections.flatMap((s) => s.items), [sections]);
  const allAnswered = allItems.every((i) => !!answers[i.id]);

  return (
    <View style={styles.screenPad}>
      <View style={styles.headerSmall}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.subtitle}>Bitte pro Frage wählen</Text>
      </View>

      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ paddingVertical: 8 }}>
        {sections.map((sec) => (
          <View key={sec.id}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>{sec.label}</Text>
            </View>
            {sec.items.map((item) => (
              <View key={item.id} style={styles.qCard}>
                <Text style={styles.qLabel}>{item.label}</Text>
                <View style={styles.qOptionsRow}>
                  <Option
                    label="Mag ich"
                    active={answers[item.id] === 'like'}
                    color={COLORS.yes}
                    onPress={() => onChange(item.id, 'like')}
                  />
                  <Option
                    label="Ausprobieren"
                    active={answers[item.id] === 'try'}
                    color={COLORS.maybe}
                    onPress={() => onChange(item.id, 'try')}
                  />
                  <Option
                    label="Mag ich nicht"
                    active={answers[item.id] === 'dislike'}
                    color={COLORS.no}
                    onPress={() => onChange(item.id, 'dislike')}
                  />
                </View>
              </View>
            ))}
          </View>
        ))}
      </ScrollView>

      <TouchableOpacity
        style={[styles.button, styles.buttonPrimary, !allAnswered ? styles.buttonDisabled : null]}
        disabled={!allAnswered}
        onPress={onNext}
      >
        <Text style={styles.buttonPrimaryText}>Weiter</Text>
      </TouchableOpacity>
    </View>
  );
}
