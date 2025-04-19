import React from "react";
import { PanResponder } from "react-native";

export default function useSwipe({
  onSwipeLeft,
  onSwipeRight,
  onSwipeUp,
  onSwipeDown,
  threshold = 50,
}: {
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
  onSwipeUp?: () => void;
  onSwipeDown?: () => void;
  threshold?: number;
}) {
  const panResponder = React.useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (_, gestureState) => {
        return Math.abs(gestureState.dx) > 20 || Math.abs(gestureState.dy) > 20;
      },
      onPanResponderRelease: (_, gestureState) => {
        const { dx, dy } = gestureState;

        if (Math.abs(dx) > Math.abs(dy)) {
          if (dx > threshold) {
            onSwipeRight?.();
          } else if (dx < -threshold) {
            onSwipeLeft?.();
          }
        } else {
          if (dy > threshold) {
            onSwipeDown?.();
          } else if (dy < -threshold) {
            onSwipeUp?.();
          }
        }
      },
    })
  ).current;

  return panResponder.panHandlers;
}
