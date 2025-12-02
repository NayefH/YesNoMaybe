import { useCallback, useEffect, useRef } from "react";
import { Animated, PanResponder, Platform } from "react-native";
import type { Choice, Item } from "../types";

type SwipeHandlerParams = {
  position: Animated.ValueXY;
  current: Item | undefined;
  index: number;
  itemsLength: number;
  swipeDist: number;
  swipeVel: number;
  onChange: (id: string, c: Choice) => void;
  onNext: () => void;
  allAnswered: boolean;
  setIndex: (value: number) => void;
};

// Kapselt Swipe-, Tap- und Keyboard-Handling fuer die SwipeQuestionnaire-Karte.
// Quelle: React Hook-Konzept, https://react.dev/learn/reusing-logic-with-custom-hooks
export function useSwipeHandlers({
  position,
  current,
  index,
  itemsLength,
  swipeDist,
  swipeVel,
  onChange,
  onNext,
  allAnswered,
  setIndex,
}: SwipeHandlerParams) {
  // Spielt den Swipe hinaus, setzt Antwort und schaltet zur naechsten Karte.
  // Quelle: Animated.timing fuer Gesten-Feedback, https://reactnative.dev/docs/animated#timing
  const complete = useCallback(
    (choice: Choice) => {
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
        if (next >= itemsLength) {
          onNext();
        } else {
          setIndex(next);
        }
      });
    },
    [current, index, itemsLength, onChange, onNext, position, setIndex]
  );

  // Touch-/Mouse-Gesten per PanResponder: Swipe erkennen, sonst zurueckschnappen.
  // Quelle: PanResponder zur Gesten-Erkennung, https://reactnative.dev/docs/panresponder
  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: (_e, g) => {
        const absDx = Math.abs(g.dx);
        const absDy = Math.abs(g.dy);
        // Deadzone: > 5 px verhindert versehentliche Ausloesungen beim Tippen.
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

  // Keyboard-Fallback (nur Web): Pfeiltasten mapped auf die drei Choices.
  // Quelle: Web Keyboard Events, https://developer.mozilla.org/docs/Web/API/Element/keydown_event
  useEffect(() => {
    if (Platform.OS !== "web") return;

    const handleKeyDown = (e: any) => {
      if (allAnswered) return;
      if (e.key === "ArrowRight") {
        e.preventDefault();
        complete("like");
      } else if (e.key === "ArrowLeft") {
        e.preventDefault();
        complete("dislike");
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        complete("try");
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [allAnswered, complete]);

  return { complete, panResponder };
}
