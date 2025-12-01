import {
  ResizeMode,
  Video,
  VideoFullscreenUpdate,
  type AVPlaybackStatus,
} from "expo-av";
import { LinearGradient } from "expo-linear-gradient";
import { useLocalSearchParams, useRouter } from "expo-router";
import * as ScreenOrientation from "expo-screen-orientation";
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  Animated,
  SafeAreaView,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";

import { ThemedText } from "@/components/themed-text";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { getVideoById } from "@/constants/videos";

export default function VideoPlayerScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id?: string }>();
  const video = useMemo(
    () =>
      getVideoById(
        typeof id === "string" ? id : Array.isArray(id) ? id[0] : undefined
      ),
    [id]
  );
  const videoRef = useRef<Video>(null);
  const [status, setStatus] = useState<AVPlaybackStatus | null>(null);
  const [trackLayout, setTrackLayout] = useState({ width: 1, x: 0 });
  const trackRef = useRef<View>(null);
  const controlsOpacity = useRef(new Animated.Value(1)).current;
  const [controlsInteractive, setControlsInteractive] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const hideControlsTimeout = useRef<ReturnType<typeof setTimeout> | null>(
    null
  );

  const clearHideControlsTimeout = useCallback(() => {
    if (hideControlsTimeout.current) {
      clearTimeout(hideControlsTimeout.current);
      hideControlsTimeout.current = null;
    }
  }, []);

  const animateControls = useCallback(
    (toValue: 0 | 1) => {
      Animated.timing(controlsOpacity, {
        toValue,
        duration: 220,
        useNativeDriver: true,
      }).start(() => {
        setControlsInteractive(toValue === 1);
      });
    },
    [controlsOpacity]
  );

  const scheduleHideControls = useCallback(() => {
    clearHideControlsTimeout();
    hideControlsTimeout.current = setTimeout(() => animateControls(0), 3000);
  }, [animateControls, clearHideControlsTimeout]);

  const handleScreenInteraction = useCallback(() => {
    setControlsInteractive(true);
    animateControls(1);
    scheduleHideControls();
  }, [animateControls, scheduleHideControls]);

  const measureTrack = useCallback(() => {
    trackRef.current?.measureInWindow((x, _y, width) => {
      if (!Number.isFinite(width) || width <= 0) return;
      setTrackLayout({ width, x });
    });
  }, []);

  useEffect(() => {
    handleScreenInteraction();
    return () => clearHideControlsTimeout();
  }, [clearHideControlsTimeout, handleScreenInteraction]);

  // Unlock orientation for video screen, lock back to portrait on unmount
  useEffect(() => {
    ScreenOrientation.unlockAsync();
    return () => {
      ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT_UP);
    };
  }, []);

  const handleFullscreenToggle = useCallback(() => {
    handleScreenInteraction();
    if (isFullscreen) {
      videoRef.current?.dismissFullscreenPlayer();
    } else {
      videoRef.current?.presentFullscreenPlayer();
    }
  }, [handleScreenInteraction, isFullscreen]);

  const isLoaded = status && "isLoaded" in status && status.isLoaded;
  const duration = isLoaded ? status.durationMillis ?? 0 : 0;
  const position = isLoaded ? status.positionMillis ?? 0 : 0;
  const progress = duration > 0 ? position / duration : 0;

  const clampValue = (value: number) => Math.min(Math.max(value, 0), 1);

  const seekToLocation = useCallback(
    (pageX: number) => {
      if (!Number.isFinite(duration) || duration <= 0) return;
      const safeWidth =
        Number.isFinite(trackLayout.width) && trackLayout.width > 0
          ? trackLayout.width
          : 1;
      const safeX = Number.isFinite(trackLayout.x) ? trackLayout.x : 0;
      const locationX = pageX - safeX;
      const ratio = clampValue(locationX / safeWidth);
      const seekPosition = Math.round(ratio * duration);
      if (!Number.isFinite(seekPosition)) return;
      videoRef.current?.setPositionAsync(seekPosition);
    },
    [duration, trackLayout]
  );

  function togglePlayback() {
    if (!isLoaded) return;
    handleScreenInteraction();
    if (status?.isPlaying) {
      videoRef.current?.pauseAsync();
    } else {
      videoRef.current?.playAsync();
    }
  }

  const playerAspectRatio = 16 / 9;

  const knobSize = 14;
  const fillWidth = Math.max(
    0,
    Math.min(trackLayout.width, progress * trackLayout.width)
  );
  const thumbLeft = Math.max(
    0,
    Math.min(trackLayout.width - knobSize, fillWidth - knobSize / 2)
  );

  if (!video) {
    return (
      <SafeAreaView style={[styles.safeArea, styles.centered]}>
        <ThemedText>Could not find a video to play.</ThemedText>
        <TouchableOpacity
          accessibilityRole="button"
          onPress={() => router.back()}
          style={styles.retryButton}
        >
          <ThemedText style={styles.retryLabel}>Go back</ThemedText>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView
      style={styles.safeArea}
      onTouchStart={handleScreenInteraction}
    >
      <LinearGradient
        colors={["#0D111B", "#05060A"]}
        style={StyleSheet.absoluteFill}
      />
      <View style={styles.content}>
        <TouchableOpacity
          accessibilityRole="button"
          onPress={() => router.back()}
          style={styles.backButton}
        >
          <IconSymbol name="arrow-back" color="#FFFFFF" size={22} />
        </TouchableOpacity>

        <View style={styles.playerWrapper}>
          <View
            style={[styles.playerShell, { aspectRatio: playerAspectRatio }]}
          >
            <Video
              ref={videoRef}
              style={styles.playerSurface}
              videoStyle={styles.playerVideo}
              source={{ uri: video.source }}
              resizeMode={ResizeMode.CONTAIN}
              shouldPlay
              isLooping
              onPlaybackStatusUpdate={(next) => setStatus(next)}
              onFullscreenUpdate={({ fullscreenUpdate }) => {
                if (
                  fullscreenUpdate === VideoFullscreenUpdate.PLAYER_DID_PRESENT
                ) {
                  setIsFullscreen(true);
                }
                if (
                  fullscreenUpdate === VideoFullscreenUpdate.PLAYER_DID_DISMISS
                ) {
                  setIsFullscreen(false);
                }
              }}
            />
            <Animated.View
              style={[
                styles.overlayLayer,
                {
                  opacity: controlsOpacity,
                  transform: [
                    {
                      translateY: controlsOpacity.interpolate({
                        inputRange: [0, 1],
                        outputRange: [24, 0],
                      }),
                    },
                  ],
                },
              ]}
              pointerEvents={controlsInteractive ? "auto" : "none"}
            >
              <View style={styles.playButtonWrapper} pointerEvents="box-none">
                <TouchableOpacity
                  accessibilityRole="button"
                  onPress={togglePlayback}
                  style={styles.playButton}
                >
                  <IconSymbol
                    name={
                      status?.isLoaded && status.isPlaying
                        ? "pause"
                        : "play-arrow"
                    }
                    color="#FFFFFF"
                    size={32}
                  />
                </TouchableOpacity>
              </View>

              <View style={styles.controlsRow}>
                <View
                  ref={trackRef}
                  style={styles.progressWrapper}
                  onLayout={measureTrack}
                  onStartShouldSetResponder={() => true}
                  onMoveShouldSetResponder={() => true}
                  onResponderGrant={(event) => {
                    handleScreenInteraction();
                    seekToLocation(event.nativeEvent.pageX);
                  }}
                  onResponderMove={(event) => {
                    handleScreenInteraction();
                    seekToLocation(event.nativeEvent.pageX);
                  }}
                  onResponderRelease={(event) => {
                    handleScreenInteraction();
                    seekToLocation(event.nativeEvent.pageX);
                  }}
                >
                  <View style={styles.progressTrack} />
                  <LinearGradient
                    colors={["#66C7FF", "#B1F4FF"]}
                    start={{ x: 0, y: 0.5 }}
                    end={{ x: 1, y: 0.5 }}
                    style={[styles.progressFill, { width: fillWidth }]}
                  />
                  <View style={[styles.progressThumb, { left: thumbLeft }]} />
                </View>

                <TouchableOpacity
                  accessibilityRole="button"
                  onPress={handleFullscreenToggle}
                  style={styles.fullscreenButton}
                  accessibilityLabel={
                    isFullscreen ? "Exit full screen" : "Enter full screen"
                  }
                >
                  <IconSymbol
                    name={isFullscreen ? "fullscreen-exit" : "fullscreen"}
                    color="#FFFFFF"
                    size={24}
                  />
                </TouchableOpacity>
              </View>
            </Animated.View>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#05060A",
  },
  centered: {
    alignItems: "center",
    justifyContent: "center",
  },
  retryButton: {
    marginTop: 16,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 999,
    backgroundColor: "#FFFFFF",
  },
  retryLabel: {
    color: "#1C1C1C",
    fontWeight: "600",
  },
  content: {
    flex: 1,
    paddingHorizontal: 0,
    paddingTop: 16,
    paddingBottom: 32,
    justifyContent: "center",
  },
  playerWrapper: {
    flex: 1,
    width: "100%",
    justifyContent: "center",
    alignItems: "stretch",
    paddingTop: 56,
  },
  backButton: {
    position: "absolute",
    top: 20,
    left: 16,
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000000",
    shadowOpacity: 0.12,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 4,
    zIndex: 2,
  },
  playerShell: {
    width: "100%",
    aspectRatio: 16 / 10,
    borderRadius: 0,
    backgroundColor: "transparent",
    justifyContent: "center",
    alignItems: "center",
  },
  playerSurface: {
    ...StyleSheet.absoluteFillObject,
  },
  playerVideo: {
    width: "100%",
    height: "100%",
    objectFit: "contain",
  },
  overlayLayer: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "flex-end",
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  controlsRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  playButtonWrapper: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
  },
  playButton: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: "rgba(0,0,0,0.45)",
    alignItems: "center",
    justifyContent: "center",
  },
  progressWrapper: {
    position: "relative",
    width: "100%",
    height: 28,
    justifyContent: "center",
    flex: 1,
  },
  progressTrack: {
    width: "100%",
    height: 4,
    borderRadius: 4,
    backgroundColor: "rgba(7,12,20,0.55)",
  },
  progressFill: {
    position: "absolute",
    height: 4,
    borderRadius: 4,
  },
  progressThumb: {
    position: "absolute",
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: "#66C7FF",
    top: 7,
    shadowColor: "#2FB6FF",
    shadowOpacity: 0.35,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
  },
  fullscreenButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "rgba(0,0,0,0.35)",
    alignItems: "center",
    justifyContent: "center",
  },
});
