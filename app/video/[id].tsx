import { ResizeMode, Video, VideoFullscreenUpdate, type AVPlaybackStatus } from "expo-av";
import { LinearGradient } from "expo-linear-gradient";
import { useLocalSearchParams, useRouter } from "expo-router";
import * as ScreenOrientation from "expo-screen-orientation";
import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Dimensions,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";

import { ThemedText } from "@/components/themed-text";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { fetchVideoById, type Video as VideoType } from "@/lib/api/videos";

export default function VideoPlayerScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id?: string }>();
  const [video, setVideo] = useState<VideoType | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const videoRef = useRef<Video>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isLandscape, setIsLandscape] = useState(false);
  const [status, setStatus] = useState<AVPlaybackStatus | null>(null);
  const [showControls, setShowControls] = useState(true);

  // Fetch video data
  useEffect(() => {
    const loadVideo = async () => {
      try {
        setLoading(true);
        setError(null);
        const videoId =
          typeof id === "string"
            ? parseInt(id)
            : Array.isArray(id)
              ? parseInt(id[0])
              : 0;
        const data = await fetchVideoById(videoId);
        setVideo(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load video");
        console.error("Error loading video:", err);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      loadVideo();
    }
  }, [id]);

  // Handle orientation changes - auto fullscreen in landscape
  useEffect(() => {
    const subscription = ScreenOrientation.addOrientationChangeListener(
      (event) => {
        const orientation = event.orientationInfo.orientation;
        const landscape =
          orientation === ScreenOrientation.Orientation.LANDSCAPE_LEFT ||
          orientation === ScreenOrientation.Orientation.LANDSCAPE_RIGHT;

        setIsLandscape(landscape);

        if (landscape && !isFullscreen) {
          videoRef.current?.presentFullscreenPlayer();
        } else if (!landscape && isFullscreen) {
          videoRef.current?.dismissFullscreenPlayer();
        }
      }
    );

    // Check initial orientation
    ScreenOrientation.getOrientationAsync().then((orientation) => {
      const landscape =
        orientation === ScreenOrientation.Orientation.LANDSCAPE_LEFT ||
        orientation === ScreenOrientation.Orientation.LANDSCAPE_RIGHT;
      setIsLandscape(landscape);
      if (landscape) {
        videoRef.current?.presentFullscreenPlayer();
      }
    });

    return () => {
      ScreenOrientation.removeOrientationChangeListener(subscription);
    };
  }, [isFullscreen]);

  // Unlock orientation for video screen, lock back to portrait on unmount
  useEffect(() => {
    ScreenOrientation.unlockAsync();
    return () => {
      ScreenOrientation.lockAsync(
        ScreenOrientation.OrientationLock.PORTRAIT_UP
      );
    };
  }, []);

  const handleFullscreenUpdate = useCallback(
    ({ fullscreenUpdate }: { fullscreenUpdate: VideoFullscreenUpdate }) => {
      if (fullscreenUpdate === VideoFullscreenUpdate.PLAYER_DID_PRESENT) {
        setIsFullscreen(true);
        setShowControls(true); // Always show controls in fullscreen
        StatusBar.setHidden(true);
      }
      if (fullscreenUpdate === VideoFullscreenUpdate.PLAYER_DID_DISMISS) {
        setIsFullscreen(false);
        setShowControls(true); // Show controls when exiting fullscreen
        StatusBar.setHidden(false);
        // If dismissed but still landscape, lock to portrait
        if (isLandscape) {
          ScreenOrientation.lockAsync(
            ScreenOrientation.OrientationLock.PORTRAIT_UP
          ).then(() => {
            // Re-unlock after a short delay to allow rotation again
            setTimeout(() => ScreenOrientation.unlockAsync(), 300);
          });
        }
      }
    },
    [isLandscape]
  );

  const handleFullscreenToggle = useCallback(() => {
    if (isFullscreen) {
      videoRef.current?.dismissFullscreenPlayer();
    } else {
      videoRef.current?.presentFullscreenPlayer();
    }
  }, [isFullscreen]);

  const handlePlayPause = useCallback(() => {
    if (status?.isLoaded) {
      if (status.isPlaying) {
        videoRef.current?.pauseAsync();
      } else {
        videoRef.current?.playAsync();
      }
    }
  }, [status]);

  const handleSeek = useCallback((event: any) => {
    const { locationX, pageX } = event.nativeEvent;
    const seekWidth = Dimensions.get('window').width - 80; // Account for padding
    const position = Math.max(0, Math.min(locationX || pageX - 40, seekWidth));
    const percentage = position / seekWidth;
    
    if (status?.isLoaded && status.durationMillis) {
      const seekPosition = percentage * status.durationMillis;
      videoRef.current?.setPositionAsync(seekPosition);
    }
  }, [status]);

  const handlePlayerTouch = useCallback(() => {
    setShowControls(prev => !prev);
  }, []);

  const { width: screenWidth } = Dimensions.get("window");
  const playerHeight = (screenWidth * 9) / 16;

  const isLoaded = status?.isLoaded;
  const isPlaying = isLoaded && status.isPlaying;
  const duration = isLoaded ? status.durationMillis || 0 : 0;
  const position = isLoaded ? status.positionMillis || 0 : 0;
  const progress = duration > 0 ? position / duration : 0;

  if (loading) {
    return (
      <SafeAreaView style={[styles.safeArea, styles.centered]}>
        <LinearGradient
          colors={["#0D111B", "#05060A"]}
          style={StyleSheet.absoluteFill}
        />
        <ActivityIndicator size="large" color="#66C7FF" />
      </SafeAreaView>
    );
  }

  if (error || !video) {
    return (
      <SafeAreaView style={[styles.safeArea, styles.centered]}>
        <LinearGradient
          colors={["#0D111B", "#05060A"]}
          style={StyleSheet.absoluteFill}
        />
        <ThemedText style={styles.errorText}>
          {error || "Could not find a video to play."}
        </ThemedText>
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
    <SafeAreaView style={styles.safeArea}>
      <LinearGradient
        colors={["#0D111B", "#05060A"]}
        style={StyleSheet.absoluteFill}
      />

      {/* Header with back button */}
      <View style={styles.header}>
        <TouchableOpacity
          accessibilityRole="button"
          onPress={() => router.back()}
          style={styles.backButton}
        >
          <IconSymbol name="arrow-back" color="#FFFFFF" size={22} />
        </TouchableOpacity>
        <View style={styles.headerSpacer} />
      </View>

      {/* Video Player */}
      <View style={styles.playerContainer}>
        <View style={[styles.playerWrapper, { height: playerHeight }]}>
          <TouchableOpacity 
            activeOpacity={1} 
            onPress={handlePlayerTouch}
            style={styles.videoTouchable}
          >
            <Video
              ref={videoRef}
              style={styles.video}
              source={{ uri: video.link }}
              resizeMode={ResizeMode.CONTAIN}
              shouldPlay
              onPlaybackStatusUpdate={setStatus}
              onFullscreenUpdate={handleFullscreenUpdate}
            />
          </TouchableOpacity>

          {/* Custom Controls Overlay */}
          {(showControls || isFullscreen) && (
            <View style={styles.controlsOverlay}>
              {/* Center Play/Pause Button */}
              <TouchableOpacity
                accessibilityRole="button"
                onPress={handlePlayPause}
                style={styles.centerPlayButton}
              >
                <IconSymbol
                  name={isPlaying ? "pause" : "play-arrow"}
                  color="#FFFFFF"
                  size={48}
                />
              </TouchableOpacity>

              {/* Bottom Controls */}
              <View style={styles.bottomControls}>
                {/* Progress Bar */}
                <View
                  style={styles.progressContainer}
                  onStartShouldSetResponder={() => true}
                  onResponderGrant={handleSeek}
                  onResponderMove={handleSeek}
                >
                  <View style={styles.progressTrack} />
                  <LinearGradient
                    colors={["#66C7FF", "#B1F4FF"]}
                    start={{ x: 0, y: 0.5 }}
                    end={{ x: 1, y: 0.5 }}
                    style={[styles.progressFill, { width: `${progress * 100}%` }]}
                  />
                  <View 
                    style={[
                      styles.progressThumb, 
                      { left: `${Math.max(0, Math.min(100, progress * 100))}%` }
                    ]} 
                  />
                </View>

                {/* Fullscreen Button */}
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
            </View>
          )}
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
  errorText: {
    color: "#FFFFFF",
    marginBottom: 16,
    textAlign: "center",
    paddingHorizontal: 24,
  },
  retryButton: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 999,
    backgroundColor: "#66C7FF",
  },
  retryLabel: {
    color: "#0D111B",
    fontWeight: "600",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  headerSpacer: {
    flex: 1,
  },
  playerContainer: {
    flex: 1,
    width: "100%",
    backgroundColor: "#000",
    justifyContent: "center",
    alignItems: "center",
  },
  playerWrapper: {
    width: "100%",
    position: "relative",
  },
  videoTouchable: {
    width: "100%",
    height: "100%",
  },
  video: {
    width: "100%",
    height: "100%",
  },
  controlsOverlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "center",
    alignItems: "center",
  },
  centerPlayButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "rgba(0,0,0,0.6)",
    alignItems: "center",
    justifyContent: "center",
  },
  bottomControls: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: "rgba(0,0,0,0.3)",
    gap: 12,
  },
  progressContainer: {
    flex: 1,
    height: 32,
    justifyContent: "center",
    position: "relative",
  },
  progressTrack: {
    width: "100%",
    height: 4,
    borderRadius: 2,
    backgroundColor: "rgba(255,255,255,0.3)",
  },
  progressFill: {
    position: "absolute",
    height: 4,
    borderRadius: 2,
  },
  progressThumb: {
    position: "absolute",
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: "#66C7FF",
    top: "50%",
    marginTop: -7,
    marginLeft: -7,
    shadowColor: "#2FB6FF",
    shadowOpacity: 0.5,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 4,
  },
  fullscreenButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center",
  },
});
