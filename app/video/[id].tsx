import { Video, ResizeMode, type AVPlaybackStatus, VideoFullscreenUpdate } from 'expo-av';
import { LinearGradient } from 'expo-linear-gradient';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Animated, GestureResponderEvent, Pressable, SafeAreaView, StyleSheet, TouchableOpacity, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { getVideoById } from '@/constants/videos';

export default function VideoPlayerScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id?: string }>();
  const video = useMemo(() => getVideoById(typeof id === 'string' ? id : Array.isArray(id) ? id[0] : undefined), [id]);
  const videoRef = useRef<Video>(null);
  const [status, setStatus] = useState<AVPlaybackStatus | null>(null);
  const [trackWidth, setTrackWidth] = useState(1);
  const controlsOpacity = useRef(new Animated.Value(1)).current;
  const [controlsInteractive, setControlsInteractive] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const hideControlsTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

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

  useEffect(() => {
    handleScreenInteraction();
    return () => clearHideControlsTimeout();
  }, [clearHideControlsTimeout, handleScreenInteraction]);

  const handleFullscreenToggle = useCallback(() => {
    handleScreenInteraction();
    if (isFullscreen) {
      videoRef.current?.dismissFullscreenPlayer();
    } else {
      videoRef.current?.presentFullscreenPlayer();
    }
  }, [handleScreenInteraction, isFullscreen]);

  if (!video) {
    return (
      <SafeAreaView style={[styles.safeArea, styles.centered]}>
        <ThemedText>Could not find a video to play.</ThemedText>
        <TouchableOpacity accessibilityRole="button" onPress={() => router.back()} style={styles.retryButton}>
          <ThemedText style={styles.retryLabel}>Go back</ThemedText>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  const isLoaded = status && 'isLoaded' in status && status.isLoaded;
  const duration = isLoaded ? status.durationMillis ?? 0 : 0;
  const position = isLoaded ? status.positionMillis ?? 0 : 0;
  const progress = duration > 0 ? position / duration : 0;

  function handleProgressPress(event: GestureResponderEvent) {
    if (!duration) return;
    const ratio = event.nativeEvent.locationX / trackWidth;
    const next = Math.min(Math.max(ratio, 0), 1);
    videoRef.current?.setPositionAsync(next * duration);
  }

  function togglePlayback() {
    if (!isLoaded) return;
    handleScreenInteraction();
    if (status?.isPlaying) {
      videoRef.current?.pauseAsync();
    } else {
      videoRef.current?.playAsync();
    }
  }

  const fillWidth = Math.max(0, Math.min(trackWidth, progress * trackWidth));
  const knobSize = 14;
  const thumbLeft = Math.max(0, Math.min(trackWidth - knobSize, fillWidth - knobSize / 2));

  return (
    <SafeAreaView style={styles.safeArea} onTouchStart={handleScreenInteraction}>
      <LinearGradient colors={["#0D111B", "#05060A"]} style={StyleSheet.absoluteFill} />
      <View style={styles.content}>
        <TouchableOpacity accessibilityRole="button" onPress={() => router.back()} style={styles.backButton}>
          <IconSymbol name="arrow-back" color="#FFFFFF" size={22} />
        </TouchableOpacity>

        <View style={styles.playerWrapper}>
          <View style={styles.playerShell}>
          <Video
            ref={videoRef}
            style={StyleSheet.absoluteFill}
            source={{ uri: video.source }}
            resizeMode={ResizeMode.COVER}
            shouldPlay
            isLooping
            onPlaybackStatusUpdate={(next) => setStatus(next)}
            onFullscreenUpdate={({ fullscreenUpdate }) => {
              if (fullscreenUpdate === VideoFullscreenUpdate.PLAYER_DID_PRESENT) {
                setIsFullscreen(true);
              }
              if (fullscreenUpdate === VideoFullscreenUpdate.PLAYER_DID_DISMISS) {
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
              pointerEvents={controlsInteractive ? 'auto' : 'none'}
            >
              <View style={styles.playButtonWrapper} pointerEvents="box-none">
                <TouchableOpacity
                  accessibilityRole="button"
                  onPress={togglePlayback}
                  style={styles.playButton}
                >
                  <IconSymbol
                    name={status?.isLoaded && status.isPlaying ? 'pause' : 'play-arrow'}
                    color="#FFFFFF"
                    size={32}
                  />
                </TouchableOpacity>
              </View>

              <View style={styles.controlsRow}>
                <View
                  style={styles.progressWrapper}
                  onLayout={(event) => setTrackWidth(event.nativeEvent.layout.width)}
                >
                  <View style={styles.progressTrack} />
                  <LinearGradient
                    colors={['#66C7FF', '#B1F4FF']}
                    start={{ x: 0, y: 0.5 }}
                    end={{ x: 1, y: 0.5 }}
                    style={[styles.progressFill, { width: fillWidth }]}
                  />
                  <View style={[styles.progressThumb, { left: thumbLeft }]} />
                  <Pressable
                    onPress={(event) => {
                      handleScreenInteraction();
                      handleProgressPress(event);
                    }}
                    style={StyleSheet.absoluteFill}
                  />
                </View>

                <TouchableOpacity
                  accessibilityRole="button"
                  onPress={handleFullscreenToggle}
                  style={styles.fullscreenButton}
                  accessibilityLabel={isFullscreen ? 'Exit full screen' : 'Enter full screen'}
                >
                  <IconSymbol
                    name={isFullscreen ? 'fullscreen-exit' : 'fullscreen'}
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
    backgroundColor: '#05060A',
  },
  centered: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  retryButton: {
    marginTop: 16,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 999,
    backgroundColor: '#FFFFFF',
  },
  retryLabel: {
    color: '#1C1C1C',
    fontWeight: '600',
  },
  content: {
    flex: 1,
    paddingHorizontal: 0,
    paddingTop: 16,
    paddingBottom: 32,
    justifyContent: 'center',
  },
  playerWrapper: {
    flex: 1,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'stretch',
    paddingTop: 56,
  },
  backButton: {
    position: 'absolute',
    top: 16,
    left: 16,
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.35)',
    zIndex: 2,
  },
  playerShell: {
    width: '100%',
    aspectRatio: 16 / 10,
    borderRadius: 0,
    overflow: 'hidden',
    backgroundColor: 'transparent',
  },
  overlayLayer: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'flex-end',
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  controlsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  playButtonWrapper: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  playButton: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: 'rgba(0,0,0,0.45)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  progressWrapper: {
    position: 'relative',
    width: '100%',
    height: 28,
    justifyContent: 'center',
    flex: 1,
  },
  progressTrack: {
    width: '100%',
    height: 4,
    borderRadius: 4,
    backgroundColor: 'rgba(7,12,20,0.55)',
  },
  progressFill: {
    position: 'absolute',
    height: 4,
    borderRadius: 4,
  },
  progressThumb: {
    position: 'absolute',
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: '#66C7FF',
    top: 7,
    shadowColor: '#2FB6FF',
    shadowOpacity: 0.35,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
  },
  fullscreenButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(0,0,0,0.35)',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
