import { LinearGradient } from "expo-linear-gradient";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";

import { ThemedText } from "@/components/themed-text";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { VideoEmbed } from "@/components/ui/video-embed";
import { fetchVideoById, type Video as VideoType } from "@/lib/api/videos";

export default function VideoPlayerScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id?: string }>();
  const [video, setVideo] = useState<VideoType | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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
      </View>

      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.contentInner}
      >
        {/* Video Player */}
        <VideoEmbed link={video.link} />

        {/* Video info */}
        <View style={styles.infoContainer}>
          <ThemedText style={styles.title}>{video.title}</ThemedText>
          {video.description ? (
            <ThemedText style={styles.description}>
              {video.description}
            </ThemedText>
          ) : null}
        </View>
      </ScrollView>
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
  content: {
    flex: 1,
  },
  contentInner: {
    paddingHorizontal: 16,
    paddingBottom: 32,
  },
  infoContainer: {
    paddingTop: 20,
    gap: 8,
  },
  title: {
    color: "#FFFFFF",
    fontSize: 20,
    fontWeight: "700",
  },
  description: {
    color: "rgba(255,255,255,0.7)",
    fontSize: 14,
    lineHeight: 20,
  },
});
