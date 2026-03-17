import React, { useMemo } from "react";
import { StyleSheet, View, type ViewStyle } from "react-native";

import {
  extractYouTubeId,
  getYouTubeEmbedUrl,
  isYouTubeUrl,
} from "@/lib/youtube";

interface VideoEmbedProps {
  link: string;
  style?: ViewStyle;
}

export function VideoEmbed({ link, style }: VideoEmbedProps) {
  const src = useMemo(() => {
    if (isYouTubeUrl(link)) {
      const id = extractYouTubeId(link)!;
      return getYouTubeEmbedUrl(id);
    }
    return null;
  }, [link]);

  return (
    <View style={[styles.container, style]}>
      {src ? (
        <iframe
          src={src}
          style={iframeStyle}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
          title="Video player"
        />
      ) : (
        <video src={link} controls autoPlay playsInline style={videoStyle} />
      )}
    </View>
  );
}

const iframeStyle: React.CSSProperties = {
  width: "100%",
  height: "100%",
  border: "none",
};

const videoStyle: React.CSSProperties = {
  width: "100%",
  height: "100%",
  objectFit: "contain",
  backgroundColor: "#000",
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
    aspectRatio: 16 / 9,
    backgroundColor: "#000",
    overflow: "hidden",
    borderRadius: 12,
  },
});
