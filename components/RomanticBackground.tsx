import React, { useEffect, useMemo, useRef } from "react";
import { Animated, StyleSheet, View } from "react-native";
import { COLORS } from "../styles";

type Shape = {
  size: number;
  color: string;
  top: number | string;
  left: number | string;
  duration: number;
  delay: number;
  driftX: number;
  driftY: number;
  rotate: string;
  kind?: "petal" | "heart";
};

// Subtle floating petals/hearts to create a romantic, non-distracting vibe.
export default function RomanticBackground() {
  const shapes = useMemo<Shape[]>(
    () => [
      {
        size: 220,
        color: "rgba(255,143,177,0.16)",
        top: -40,
        left: -30,
        duration: 5200,
        delay: 0,
        driftX: 12,
        driftY: 18,
        rotate: "-12deg",
      },
      {
        size: 180,
        color: "rgba(255,192,148,0.14)",
        top: 120,
        left: "68%",
        duration: 4600,
        delay: 800,
        driftX: -10,
        driftY: 14,
        rotate: "18deg",
      },
      {
        size: 260,
        color: "rgba(232,117,155,0.12)",
        top: "52%",
        left: -60,
        duration: 5400,
        delay: 1200,
        driftX: 16,
        driftY: 16,
        rotate: "9deg",
      },
      {
        size: 210,
        color: "rgba(255,143,177,0.12)",
        top: "68%",
        left: "58%",
        duration: 5000,
        delay: 1800,
        driftX: -14,
        driftY: 12,
        rotate: "-16deg",
      },
      {
        size: 140,
        color: "rgba(255,158,199,0.24)",
        top: "42%",
        left: "52%",
        duration: 6400,
        delay: 600,
        driftX: 10,
        driftY: 12,
        rotate: "4deg",
        kind: "heart",
      },
      {
        size: 160,
        color: "rgba(255,192,148,0.2)",
        top: "60%",
        left: "44%",
        duration: 6200,
        delay: 1600,
        driftX: -8,
        driftY: 10,
        rotate: "-6deg",
        kind: "heart",
      },
    ],
    []
  );

  const anims = useRef(shapes.map(() => new Animated.Value(0))).current;

  useEffect(() => {
    const loops = anims.map((val, idx) => {
      const shape = shapes[idx];
      return Animated.loop(
        Animated.sequence([
          Animated.delay(shape.delay),
          Animated.timing(val, {
            toValue: 1,
            duration: shape.duration,
            useNativeDriver: true,
          }),
          Animated.timing(val, {
            toValue: 0,
            duration: shape.duration,
            useNativeDriver: true,
          }),
        ])
      );
    });
    loops.forEach((l) => l.start());
    return () => loops.forEach((l) => l.stop());
  }, [anims, shapes]);

  return (
    <View pointerEvents="none" style={styles.container}>
      <View style={styles.vignette} />
      {shapes.map((shape, idx) => {
        const progress = anims[idx];
        const translateY = progress.interpolate({
          inputRange: [0, 1],
          outputRange: [0, -shape.driftY],
        });
        const translateX = progress.interpolate({
          inputRange: [0, 1],
          outputRange: [0, shape.driftX],
        });
        const scale = progress.interpolate({
          inputRange: [0, 1],
          outputRange: [1, 1.08],
        });
        const opacity = progress.interpolate({
          inputRange: [0, 1],
          outputRange: [0.1, 0.22],
        });

        const sharedTransform = [
          { translateX },
          { translateY },
          { scale },
        ];

        if (shape.kind === "heart") {
          return (
            <Animated.View
              key={`shape-${idx}`}
              style={[
                styles.heart,
                {
                  width: shape.size,
                  height: shape.size,
                  backgroundColor: shape.color,
                  top: shape.top,
                  left: shape.left,
                  transform: [
                    ...sharedTransform,
                    { rotate: shape.rotate },
                    { rotate: "45deg" },
                  ],
                  opacity,
                },
              ]}
            >
              <View
                style={[
                  styles.heartLobe,
                  {
                    backgroundColor: shape.color,
                    top: -shape.size * 0.5,
                  },
                ]}
              />
              <View
                style={[
                  styles.heartLobe,
                  {
                    backgroundColor: shape.color,
                    left: -shape.size * 0.5,
                  },
                ]}
              />
            </Animated.View>
          );
        }

        return (
          <Animated.View
            key={`shape-${idx}`}
            style={[
              styles.petal,
              {
                width: shape.size,
                height: shape.size * 0.72,
                backgroundColor: shape.color,
                top: shape.top,
                left: shape.left,
                transform: [...sharedTransform, { rotate: shape.rotate }],
                opacity,
              },
            ]}
          />
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 0,
  },
  vignette: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(27,11,24,0.55)",
  },
  petal: {
    position: "absolute",
    borderRadius: 999,
    shadowColor: COLORS.primary,
    shadowOpacity: 0.14,
    shadowRadius: 22,
    shadowOffset: { width: 0, height: 8 },
  },
  heart: {
    position: "absolute",
    borderRadius: 18,
    shadowColor: COLORS.primary,
    shadowOpacity: 0.16,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 8 },
  },
  heartLobe: {
    position: "absolute",
    width: "100%",
    height: "100%",
    borderRadius: 999,
  },
});
