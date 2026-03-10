import { BlurView } from "expo-blur";
import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import {
  ImageBackground,
  Pressable,
  StyleProp,
  StyleSheet,
  View,
  ViewStyle,
} from "react-native";

import { ThemedText } from "@/components/themed-text";

import { Chip, type ChipVariant } from "./chip";

interface CardProps {
  image: string;
  label: string;
  chipVariant?: ChipVariant;
  title: string;
  description: string;
  meta?: string;
  onPress?: () => void;
  style?: StyleProp<ViewStyle>;
  layout?: "default" | "article" | "module";
}

export function Card({
  image,
  label,
  chipVariant = "article",
  title,
  description,
  meta,
  onPress,
  style,
  layout = "default",
}: CardProps) {
  const containerStyle: StyleProp<ViewStyle> = [styles.cardShadow, style];
  const isArticleLayout = layout === "article";
  const isModuleLayout = layout === "module";
  const captionContainerStyle = [
    styles.captionContainer,
    isArticleLayout && styles.captionContainerArticle,
  ];
  const cardBody = (
    <View style={containerStyle}>
      <ImageBackground
        source={{ uri: image }}
        style={styles.cardImage}
        imageStyle={styles.cardImageRadius}
      >
        <LinearGradient
          colors={["rgba(0,0,0,0.05)", "rgba(0,0,0,0.75)"]}
          style={styles.cardOverlay}
        >
          <View style={captionContainerStyle}>
            {/* Background layers - blur and gradient */}
            <View style={styles.captionBackground}>
              <BlurView tint="light" intensity={8} style={styles.captionBlur} />
              <LinearGradient
                colors={["#FFFFFF", "rgba(255,255,255,0.5)"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 0, y: 1 }}
                style={styles.captionGradient}
              />
            </View>
            {/* Content layer - rendered separately from blur */}
            <View
              style={[
                styles.captionContent,
                isArticleLayout && styles.captionContentArticle,
                isModuleLayout && styles.captionContentModule,
              ]}
            >
              <View style={styles.captionMetaRow}>
                <Chip variant={chipVariant} label={label} />
                {meta ? (
                  <ThemedText style={styles.captionMeta}>{meta}</ThemedText>
                ) : (
                  <View />
                )}
              </View>
              <ThemedText style={[styles.cardTitle, isModuleLayout && styles.cardTitleModule]}>{title}</ThemedText>
              <ThemedText
                style={[
                  styles.cardDescription,
                  isArticleLayout && styles.cardDescriptionArticle,
                  isModuleLayout && styles.cardDescriptionModule,
                ]}
                numberOfLines={isArticleLayout ? 5 : 2}
              >
                {description}
              </ThemedText>
            </View>
          </View>
        </LinearGradient>
      </ImageBackground>
    </View>
  );

  if (onPress) {
    return (
      <Pressable onPress={onPress} accessibilityRole="button">
        {cardBody}
      </Pressable>
    );
  }

  return cardBody;
}

const styles = StyleSheet.create({
  cardShadow: {
    borderRadius: 24,
    overflow: "hidden",
    shadowColor: "#000000",
    shadowOpacity: 0.1,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
    width: "100%",
  },
  cardImage: {
    height: 240,
    width: "100%",
  },
  cardImageRadius: {
    borderRadius: 20,
  },
  cardOverlay: {
    flex: 1,
    justifyContent: "flex-end",
    padding: 4,
    borderRadius: 20,
  },
  captionContainer: {
    borderRadius: 20,
    overflow: "hidden",
    height: 96,
    backgroundColor: "transparent",
    position: "relative",
  },
  captionBackground: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 0,
  },
  captionBlur: {
    ...StyleSheet.absoluteFillObject,
  },
  captionGradient: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 20,
  },
  captionContent: {
    flex: 1,
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 1,
    justifyContent: "center",
    zIndex: 1,
    position: "relative",
  },
  captionContentArticle: {
    justifyContent: "flex-start",
    paddingTop: 12,
  },
  captionContentModule: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 8,
    paddingHorizontal: 18,
  },
  captionMetaRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 4,
  },
  captionContainerArticle: {
    height: "100%",
    width: "60%",
    alignSelf: "flex-start",
    display: "flex",
    alignItems: "flex-start",
    justifyContent: "flex-start",
  },
  captionMeta: {
    fontSize: 10,
    fontWeight: "600",
    color: "#1C1C1C",
  },
  cardTitle: {
    fontSize: 16,
    color: "#1C1C1C",
  },
  cardTitleModule: {
    textAlign: 'center',
  },
  cardDescription: {
    fontSize: 12,
    fontWeight: "400",
    color: "#4C4C4C",
  },
  cardDescriptionArticle: {
    fontSize: 16,
    fontWeight: '400',
    color: '#4C4C4C',
  },
  cardDescriptionModule: {
    textAlign: 'center',
  },
});

export default Card;
