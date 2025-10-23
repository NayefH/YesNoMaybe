/**
 * SwipeQuestionnaire
 * Tinder-like swipe interface for answering items one by one.
 * Gestures:
 * - Right: like
 * - Up: try
 * - Left: dislike
 * Also offers tap-based fallback buttons for accessibility and precision.
 */
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Animated, PanResponder, Text, TouchableOpacity, View } from 'react-native';
import { COLORS, styles } from '../styles';
import Option from './Option';
import type { Answers, Category, Choice } from '../types';

export default function SwipeQuestionnaire({
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
  const items = useMemo(() => sections.flatMap((s) => s.items), [sections]);

  const firstUnanswered = useMemo(() => items.findIndex((i) => !answers[i.id]), [items, answers]);
  const [index, setIndex] = useState(firstUnanswered === -1 ? items.length : firstUnanswered);
  useEffect(() => {
    setIndex(firstUnanswered === -1 ? items.length : firstUnanswered);
  }, [firstUnanswered]);

  const allAnswered = index >= items.length;
  const current = items[index];

  const position = useRef(new Animated.ValueXY({ x: 0, y: 0 })).current;
  const rotate = position.x.interpolate({ inputRange: [-200, 0, 200], outputRange: ['-12deg', '0deg', '12deg'], extrapolate: 'clamp' });
  const likeOpacity = position.x.interpolate({ inputRange: [40, 140], outputRange: [0, 1], extrapolate: 'clamp' });
  const noOpacity = position.x.interpolate({ inputRange: [-140, -40], outputRange: [1, 0], extrapolate: 'clamp' });
  const tryOpacity = position.y.interpolate({ inputRange: [-140, -40], outputRange: [1, 0], extrapolate: 'clamp' });

  const threshold = 120;

  const complete = (choice: Choice) => {
    const toValue =
      choice === 'like' ? { x: 500, y: 0 } : choice === 'dislike' ? { x: -500, y: 0 } : { x: 0, y: -500 };
    Animated.timing(position, {
      toValue,
      duration: 200,
      useNativeDriver: true,
    }).start(() => {
      if (current) {
        onChange(current.id, choice);
      }
      position.setValue({ x: 0, y: 0 });
      const next = index + 1;
      if (next >= items.length) {
        onNext();
      } else {
        setIndex(next);
      }
    });
  };

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderMove: (_, g) => {
        position.setValue({ x: g.dx, y: g.dy });
      },
      onPanResponderRelease: (_, g) => {
        if (g.dx > threshold) return complete('like');
        if (g.dx < -threshold) return complete('dislike');
        if (g.dy < -threshold) return complete('try');
        Animated.spring(position, { toValue: { x: 0, y: 0 }, useNativeDriver: true, friction: 6 }).start();
      },
    })
  ).current;

  return (
    <View style={styles.screenPad}>
      <View style={styles.headerSmall}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.subtitle}>Rechts = Mag ich • Oben = Ausprobieren • Links = Mag ich nicht</Text>
      </View>

      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        {!allAnswered && current ? (
          <Animated.View
            {...panResponder.panHandlers}
            style={[
              {
                width: '100%',
                maxWidth: 640,
                backgroundColor: COLORS.card,
                borderRadius: 16,
                padding: 20,
                minHeight: 280,
                justifyContent: 'center',
                elevation: 3,
              },
              { transform: [{ translateX: position.x }, { translateY: position.y }, { rotate }] },
            ]}
          >
            <Animated.Text
              style={{ position: 'absolute', top: 12, left: 12, color: COLORS.yes, fontWeight: '800', opacity: likeOpacity }}
            >
              MAG ICH
            </Animated.Text>
            <Animated.Text
              style={{ position: 'absolute', top: 12, right: 12, color: COLORS.no, fontWeight: '800', opacity: noOpacity }}
            >
              NICHT
            </Animated.Text>
            <Animated.Text
              style={{ position: 'absolute', top: 12, alignSelf: 'center', color: COLORS.maybe, fontWeight: '800', opacity: tryOpacity }}
            >
              AUSPROBIEREN
            </Animated.Text>

            <Text style={[styles.qLabel, { fontSize: 20, textAlign: 'center' }]}>{current.label}</Text>

            <View style={[styles.qOptionsRow, { marginTop: 16 }]}>
              <Option label="Mag ich" active={false} color={COLORS.yes} onPress={() => complete('like')} />
              <Option label="Ausprobieren" active={false} color={COLORS.maybe} onPress={() => complete('try')} />
              <Option label="Mag ich nicht" active={false} color={COLORS.no} onPress={() => complete('dislike')} />
            </View>
          </Animated.View>
        ) : (
          <View style={{ alignItems: 'center' }}>
            <Text style={[styles.subtitle, { textAlign: 'center', marginBottom: 12 }]}>Alles beantwortet</Text>
            <TouchableOpacity style={[styles.button, styles.buttonPrimary]} onPress={onNext}>
              <Text style={styles.buttonPrimaryText}>Weiter</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>

      <Text style={[styles.subtitle, { textAlign: 'center', marginTop: 8 }]}>
        {Math.min(index + 1, items.length)} / {items.length}
      </Text>
    </View>
  );
}
