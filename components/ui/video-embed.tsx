import React, { useMemo } from "react";
import { StyleSheet, View, type ViewStyle } from "react-native";
import { WebView } from "react-native-webview";

import {
  extractYouTubeId,
  getYouTubeEmbedUrl,
  isYouTubeUrl,
} from "@/lib/youtube";

interface VideoEmbedProps {
  link: string;
  style?: ViewStyle;
}

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

export function VideoEmbed({ link, style }: VideoEmbedProps) {
  const source = useMemo(() => {
    if (isYouTubeUrl(link)) {
      const id = extractYouTubeId(link)!;
      return { uri: getYouTubeEmbedUrl(id) };
    }
    // Wrap direct video URL in an HTML5 video player
    const safeUrl = escapeHtml(link);
    return {
      html: `<!DOCTYPE html><html><head><meta name="viewport" content="width=device-width,initial-scale=1"><style>*{margin:0;padding:0}body{background:#000;display:flex;align-items:center;justify-content:center;height:100vh}video{width:100%;height:100%;object-fit:contain}</style></head><body><video src="${safeUrl}" controls autoplay playsinline></video></body></html>`,
    };
  }, [link]);

  return (
    <View style={[styles.container, style]}>
      <WebView
        source={source}
        style={styles.webview}
        allowsFullscreenVideo
        allowsInlineMediaPlayback
        mediaPlaybackRequiresUserAction={false}
        javaScriptEnabled
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    aspectRatio: 16 / 9,
    backgroundColor: "#000",
    overflow: "hidden",
    borderRadius: 12,
  },
  webview: {
    flex: 1,
    backgroundColor: "#000",
  },
});
