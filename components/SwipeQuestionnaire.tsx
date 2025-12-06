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
  Text,
  TouchableOpacity,
  View,
  useWindowDimensions,
  Image,
} from "react-native";
import { COLORS, styles } from "../styles";
import Option from "./Option";
import { useSwipeHandlers } from "../utils/useSwipeHandlers";
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
  const pulse = useRef(new Animated.Value(1)).current;
  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, {
          toValue: 1.03,
          duration: 2000,
          useNativeDriver: true,
        }),
        Animated.timing(pulse, {
          toValue: 1,
          duration: 1600,
          useNativeDriver: true,
        }),
      ])
    );
    loop.start();
    return () => loop.stop();
  }, [pulse]);
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
  const swipeDist = threshold;
  const swipeVel = 0.5;
  const cardSize = Math.max(200, Math.min(640, width - 48, height - 220));

  const renderHeart = (size: number, color: string, style: object) => (
    <Animated.View
      style={[
        {
          position: "absolute",
          width: size,
          height: size,
          transform: [{ scale: pulse }],
        },
        style,
      ]}
    >
      <View
        style={{
          position: "absolute",
          width: size,
          height: size,
          backgroundColor: color,
          borderRadius: size * 0.2,
          transform: [{ rotate: "45deg" }],
        }}
      />
      <View
        style={{
          position: "absolute",
          width: size,
          height: size,
          backgroundColor: color,
          borderRadius: size / 2,
          top: -size * 0.35,
        }}
      />
      <View
        style={{
          position: "absolute",
          width: size,
          height: size,
          backgroundColor: color,
          borderRadius: size / 2,
          left: -size * 0.35,
        }}
      />
    </Animated.View>
  );

  const { complete, panResponder } = useSwipeHandlers({
    position,
    current,
    index,
    itemsLength: items.length,
    swipeDist,
    swipeVel,
    onChange,
    onNext,
    allAnswered,
    setIndex,
  });

  return (
    <View style={styles.screenPad}>
      {/* Romantischer Herz-Hintergrund */}
      <View pointerEvents="none" style={{ position: "absolute", inset: 0 }}>
        {renderHeart(260, "rgba(255,143,177,0.22)", { top: 20, left: -10 })}
        {renderHeart(220, "rgba(247,100,128,0.2)", { bottom: 10, right: -30 })}
      </View>
      <View style={styles.headerSmall}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.subtitle}>
          Rechts = Mag ich {"\n"}
          Oben = Ausprobieren {"\n"}
          Links = Mag ich nicht
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
                  { scale: pulse },
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
                height: "70%",
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
