/**
 * SwipeQuestionnaire
 * Tinder-like swipe interface for answering items one by one.
 * Gestures:
 * - Right: like
 * - Up: try
 * - Left: dislike
 * Also offers tap-based fallback buttons for accessibility and precision.
 */
import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  Animated,
  PanResponder,
  Text,
  TouchableOpacity,
  View,
  useWindowDimensions,
  Image,
} from "react-native";
import { COLORS, styles } from "../styles";
import Option from "./Option";
import type { Answers, Category, Choice } from "../types";

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
  const { width, height } = useWindowDimensions();

  const firstUnanswered = useMemo(
    () => items.findIndex((i) => !answers[i.id]),
    [items, answers]
  );
  const [index, setIndex] = useState(
    firstUnanswered === -1 ? items.length : firstUnanswered
  );
  useEffect(() => {
    setIndex(firstUnanswered === -1 ? items.length : firstUnanswered);
  }, [firstUnanswered]);

  const allAnswered = index >= items.length;
  const current = items[index];

  const position = useRef(new Animated.ValueXY({ x: 0, y: 0 })).current;
  const rotate = position.x.interpolate({
    inputRange: [-200, 0, 200],
    outputRange: ["-12deg", "0deg", "12deg"],
    extrapolate: "clamp",
  });
  // Sichtbarkeits-Schwellen für die Labels (optisches Feedback)
  // Tipp: Kleinere Zahlen lassen die Labels früher einblenden.
  const likeOpacity = position.x.interpolate({
    inputRange: [30, 100],
    outputRange: [0, 1],
    extrapolate: "clamp",
  });
  const noOpacity = position.x.interpolate({
    inputRange: [-100, -30],
    outputRange: [1, 0],
    extrapolate: "clamp",
  });
  const tryOpacity = position.y.interpolate({
    inputRange: [-100, -30],
    outputRange: [1, 0],
    extrapolate: "clamp",
  });

  const threshold = 120;
  const cardSize = Math.max(200, Math.min(640, width - 48, height - 220));

  const complete = (choice: Choice) => {
    const toValue =
      choice === "like"
        ? { x: 500, y: 0 }
        : choice === "dislike"
        ? { x: -500, y: 0 }
        : { x: 0, y: -500 };
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
      onMoveShouldSetPanResponder: (_e, g) => {
        const absDx = Math.abs(g.dx);
        const absDy = Math.abs(g.dy);
        // Deadzone: > 5 px verhindert versehentliche Auslösungen beim Tippen.
        // Nach Bedarf anpassen (kleiner = empfindlicher).
        return absDx > 5 || absDy > 5;
      },
      onPanResponderMove: (_e, g) => {
        position.setValue({ x: g.dx, y: g.dy });
      },
      onPanResponderRelease: (_e, g) => {
        const absDx = Math.abs(g.dx);
        const absDy = Math.abs(g.dy);
        const horizontalDominant = absDx >= absDy;

        if (horizontalDominant) {
          if (g.dx > swipeDist || g.vx > swipeVel) return complete("like");
          if (g.dx < -swipeDist || g.vx < -swipeVel) return complete("dislike");
        } else {
          if (g.dy < -swipeDist || -g.vy > swipeVel) return complete("try");
        }

        Animated.spring(position, {
          toValue: { x: 0, y: 0 },
          useNativeDriver: true,
          friction: 6,
        }).start();
      },
      onPanResponderTerminate: () => {
        Animated.spring(position, {
          toValue: { x: 0, y: 0 },
          useNativeDriver: true,
          friction: 6,
        }).start();
      },
      onPanResponderTerminationRequest: () => false,
    })
  ).current;

  return (
    <View style={styles.screenPad}>
      <View style={styles.headerSmall}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.subtitle}>
          Rechts = Mag ich • Oben = Ausprobieren • Links = Mag ich nicht
        </Text>
      </View>

      <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
        {!allAnswered && current ? (
          <Animated.View
            {...panResponder.panHandlers}
            style={[
              {
                width: cardSize,
                height: cardSize,
                backgroundColor: COLORS.card,
                borderRadius: 16,
                padding: 20,
                justifyContent: "center",
                elevation: 3,
              },
              {
                transform: [
                  { translateX: position.x },
                  { translateY: position.y },
                  { rotate },
                ],
              },
            ]}
          >
            {/* Foto (Platzhalter bis echte Fotos gesetzt sind) */}
            <Image
              source={
                current && current.photo
                  ? { uri: current.photo }
                  : require("../assets/icon.png")
              }
              style={{
                width: "100%",
                height: 160,
                borderRadius: 12,
                marginBottom: 16,
              }}
              resizeMode="cover"
            />
            <Animated.Text
              style={{
                position: "absolute",
                top: 12,
                left: 12,
                color: COLORS.yes,
                fontWeight: "800",
                opacity: likeOpacity,
              }}
            >
              MAG ICH
            </Animated.Text>
            <Animated.Text
              style={{
                position: "absolute",
                top: 12,
                right: 12,
                color: COLORS.no,
                fontWeight: "800",
                opacity: noOpacity,
              }}
            >
              MAG ICH NICHT
            </Animated.Text>
            <Animated.Text
              style={{
                position: "absolute",
                top: 12,
                alignSelf: "center",
                color: COLORS.maybe,
                fontWeight: "800",
                opacity: tryOpacity,
              }}
            >
              AUSPROBIEREN
            </Animated.Text>

            <Text
              style={[styles.qLabel, { fontSize: 20, textAlign: "center" }]}
            >
              {current.label}
            </Text>

            <View style={[styles.qOptionsRow, { marginTop: 16 }]}>
              <Option
                label="Mag ich"
                active={false}
                color={COLORS.yes}
                onPress={() => complete("like")}
              />
              <Option
                label="Ausprobieren"
                active={false}
                color={COLORS.maybe}
                onPress={() => complete("try")}
              />
              <Option
                label="Mag ich nicht"
                active={false}
                color={COLORS.no}
                onPress={() => complete("dislike")}
              />
            </View>
          </Animated.View>
        ) : (
          <View style={{ alignItems: "center" }}>
            <Text
              style={[
                styles.subtitle,
                { textAlign: "center", marginBottom: 12 },
              ]}
            >
              Alles beantwortet
            </Text>
            <TouchableOpacity
              style={[styles.button, styles.buttonPrimary]}
              onPress={onNext}
            >
              <Text style={styles.buttonPrimaryText}>Weiter</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>

      <Text style={[styles.subtitle, { textAlign: "center", marginTop: 8 }]}>
        {Math.min(index + 1, items.length)} / {items.length}
      </Text>
    </View>
  );
}
