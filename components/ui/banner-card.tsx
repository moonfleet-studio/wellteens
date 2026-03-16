import { BlurView } from "expo-blur";
import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import {
  ImageBackground,
  StyleProp,
  StyleSheet,
  View,
  ViewStyle,
} from "react-native";

import { Fonts } from "@/constants/theme";

import { ThemedText } from "@/components/themed-text";

interface BannerCardProps {
  description: string;
  style?: StyleProp<ViewStyle>;
}

const bannerImage = require("@/assets/banner-img.jpg");

export function BannerCard({ description, style }: BannerCardProps) {
  return (
    <View style={[styles.container, style]}>
      <ImageBackground
        source={bannerImage}
        style={styles.image}
        imageStyle={styles.imageRadius}
        resizeMode="cover"
      >
        {/* Progressive blur layer */}
        <BlurView intensity={5} tint="dark" style={styles.blurLayer} />
        {/* Gradient overlay on top of blur */}
        <LinearGradient
          colors={["rgba(0, 0, 0, 0.2)", "rgba(102, 102, 102, 0.2)"]}
          start={{ x: 1, y: 0.5 }}
          end={{ x: 0, y: 0.5 }}
          style={styles.overlay}
        >
          <ThemedText style={styles.description}>{description}</ThemedText>
        </LinearGradient>
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    borderRadius: 20,
    overflow: "hidden",
  },
  image: {
    width: "100%",
    minHeight: 180,
    justifyContent: "center",
    alignItems: "center",
  },
  imageRadius: {
    borderRadius: 20,
  },
  blurLayer: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 20,
  },
  overlay: {
    flex: 1,
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 32,
    paddingVertical: 28,
    backgroundColor: "rgba(0,0,0,0.35)",
    borderRadius: 20,
  },
  description: {
    color: "#FFFFFF",
    fontSize: 24,
    fontWeight: "600",
    lineHeight: 24,
    textAlign: "center",
    fontFamily: Fonts.rounded,
  },
});
