import { LinearGradient } from "expo-linear-gradient";
import React, { useEffect, useRef } from "react";
import {
  Animated,
  Easing,
  GestureResponderEvent,
  Pressable,
  StyleSheet,
  Text,
  View,
  type StyleProp,
  type ViewStyle,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useMoodDrawer } from "@/components/mood-drawer-context";

const DRAWER_HEIGHT = 330;
const SLIDER_WIDTH = 260;
const KNOB_SIZE = 44;
const DOT_SIZE = 12;
const TRACK_WIDTH = SLIDER_WIDTH - KNOB_SIZE;

interface MoodDrawerProps {
  style?: StyleProp<ViewStyle>;
}

export function MoodDrawer({ style }: MoodDrawerProps) {
  const {
    isMoodDrawerOpen,
    closeMoodDrawer,
    isJournalMode,
    selectedMoodIndex,
    setSelectedMoodIndex,
    confirmMoodSelection,
    moodStates,
  } = useMoodDrawer();
  const safeArea = useSafeAreaInsets();

  const translateY = useRef(new Animated.Value(DRAWER_HEIGHT + 60)).current;
  const backdropOpacity = useRef(new Animated.Value(0)).current;
  const knobTranslate = useRef(new Animated.Value(0)).current;

  const trackWidth = Math.max(TRACK_WIDTH, 1);
  const knobSpacing = trackWidth / (moodStates.length - 1);
  const knobOffset = KNOB_SIZE / 2;

  const activeMood = moodStates[selectedMoodIndex];

  const handleSliderGesture = (event: GestureResponderEvent) => {
    const rawX = event.nativeEvent.locationX - knobOffset;
    const clampedX = Math.max(0, Math.min(trackWidth, rawX));
    const nextIndex = Math.round(clampedX / knobSpacing);
    setSelectedMoodIndex(nextIndex);
  };

  useEffect(() => {
    Animated.timing(knobTranslate, {
      toValue: selectedMoodIndex * knobSpacing,
      duration: 200,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start();
  }, [selectedMoodIndex, knobSpacing, knobTranslate]);

  useEffect(() => {
    const closedOffset = DRAWER_HEIGHT + safeArea.bottom + 60;
    Animated.parallel([
      Animated.timing(translateY, {
        toValue: isMoodDrawerOpen ? 0 : closedOffset,
        duration: 280,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
      }),
      Animated.timing(backdropOpacity, {
        toValue: isMoodDrawerOpen ? 0.5 : 0,
        duration: 220,
        useNativeDriver: true,
      }),
    ]).start();
  }, [isMoodDrawerOpen, safeArea.bottom, backdropOpacity, translateY]);

  const handleSave = () => {
    if (isJournalMode) {
      confirmMoodSelection();
    } else {
      closeMoodDrawer();
    }
  };

  const handleBackdropPress = () => {
    if (isJournalMode) {
      confirmMoodSelection();
    } else {
      closeMoodDrawer();
    }
  };

  return (
    <Animated.View
      pointerEvents={isMoodDrawerOpen ? "auto" : "none"}
      style={[styles.overlay, style]}
    >
      <Animated.View style={[styles.backdrop, { opacity: backdropOpacity }]} />
      <Pressable
        style={styles.backdropTouchable}
        onPress={handleBackdropPress}
        accessibilityRole="button"
      />
      <Animated.View
        style={[
          styles.drawer,
          {
            height: DRAWER_HEIGHT + safeArea.bottom + 32,

            transform: [{ translateY }],
          },
        ]}
      >
        <LinearGradient
          colors={activeMood.colors}
          start={activeMood.start}
          end={activeMood.end}
          style={styles.gradientContainer}
        >
          <Text style={styles.promptLabel}>
            Choose how you’re feeling today
          </Text>
          <Text style={styles.moodLabel}>{activeMood.label}</Text>
          <View
            style={styles.sliderContainer}
            onStartShouldSetResponder={() => true}
            onResponderGrant={handleSliderGesture}
            onResponderMove={handleSliderGesture}
          >
            <View
              style={[
                styles.sliderTrack,
                { width: trackWidth, marginHorizontal: knobOffset },
              ]}
            />
            {moodStates.map((state, index) => {
              const dotLeft = knobOffset + index * knobSpacing - DOT_SIZE / 2;
              return (
                <Pressable
                  key={state.key}
                  onPress={() => setSelectedMoodIndex(index)}
                  style={[styles.stepDot, { left: dotLeft }]}
                />
              );
            })}
            <Animated.View
              style={[
                styles.sliderKnob,
                {
                  left: knobOffset - KNOB_SIZE / 2,
                  transform: [{ translateX: knobTranslate }],
                },
              ]}
            />
          </View>
          <Pressable onPress={handleSave} accessibilityRole="button">
            <LinearGradient
              colors={["#FFFFFF", "rgba(255, 255, 255, 0.5)"]}
              start={{ x: 0.5, y: 0 }}
              end={{ x: 0.5, y: 1 }}
              style={styles.saveButton}
            >
              <Text style={styles.saveButtonLabel}>Save</Text>
            </LinearGradient>
          </Pressable>
        </LinearGradient>
      </Animated.View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "flex-end",
    zIndex: 50,
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "#000",
  },
  backdropTouchable: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "transparent",
  },
  drawer: {
    width: "100%",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    overflow: "hidden",
  },
  gradientContainer: {
    flex: 1,
    paddingHorizontal: 32,
    paddingTop: 24,
    alignItems: "center",
    justifyContent: "space-between",
  },
  moodLabel: {
    fontSize: 32,
    fontWeight: "700",
    color: "#111",
  },
  promptLabel: {
    fontSize: 16,
    fontWeight: "400",
    color: "#111",
    marginTop: 36,
  },
  sliderContainer: {
    width: SLIDER_WIDTH,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 16,
    marginBottom: 0,
    position: "relative",
  },
  sliderTrack: {
    height: 8,
    borderRadius: 4,
    backgroundColor: "rgba(255,255,255,0.5)",
  },
  sliderKnob: {
    position: "absolute",
    width: KNOB_SIZE,
    height: KNOB_SIZE,
    borderRadius: KNOB_SIZE / 2,
    backgroundColor: "#FFFFFF",
    borderWidth: 6,
    borderColor: "rgba(255,255,255,0.7)",
    top: -((KNOB_SIZE - 8) / 2),
  },
  stepDot: {
    position: "absolute",
    width: DOT_SIZE,
    height: DOT_SIZE,
    borderRadius: DOT_SIZE / 2,
    backgroundColor: "#FFFFFF",
    opacity: 0.7,
    top: -2,
  },
  saveButton: {
    width: 200,
    paddingVertical: 12,
    borderRadius: 32,
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 32,
  },
  saveButtonLabel: {
    fontSize: 18,
    fontWeight: "600",
    color: "#111",
  },
});
