import { ThemedText } from '@/components/themed-text';
import { Image } from 'expo-image';
import React from 'react';
import { ImageSourcePropType, Pressable, StyleProp, StyleSheet, View, ViewStyle } from 'react-native';
import { Alert } from './alert';

interface CardProps {
  image: ImageSourcePropType;
  title: string;
  description?: string;
  alertVariant?: 'video' | 'article' | 'module';
  alertLabel?: string;
  onPress?: () => void;
  style?: StyleProp<ViewStyle>;
}

export function Card({ image, title, description, alertVariant = 'video', alertLabel, onPress, style }: CardProps) {
  // variant-aware styles for alert placement and text alignment
  const variantAlertStyle = alertVariant === 'video'
    ? styles.alertVideo
    : alertVariant === 'article'
      ? styles.alertArticle
      : styles.alertModule;

  const isLeftAligned = alertVariant === 'video' || alertVariant === 'article';
  const titleTextStyle = [styles.cardTitle, isLeftAligned ? styles.textLeft : styles.textCenter];
  const descTextStyle = [styles.cardDesc, isLeftAligned ? styles.textLeft : styles.textCenter];

  const Content = (
    <View style={[styles.container, style as any]}>
      <Image source={image} style={styles.image} contentFit="cover" />
      <View style={styles.overlayBox}>
        <Alert variant={alertVariant} label={alertLabel} style={variantAlertStyle} />
        <ThemedText type="title" style={titleTextStyle}>{title}</ThemedText>
        {description ? <ThemedText style={descTextStyle}>{description}</ThemedText> : null}
      </View>
    </View>
  );

  if (onPress) {
    return <Pressable onPress={onPress}>{Content}</Pressable>;
  }

  return Content;
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: '#fff',
  },
  image: {
    width: '100%',
    height: 220,
  },
  overlayBox: {
    position: 'absolute',
    left: 16,
    right: 16,
    bottom: 18,
    // allow the background to be slightly translucent so the image peeks through
    backgroundColor: 'rgba(255,255,255,0.94)',
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 12,
    minHeight: 86,
    // shadow
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 3,
  },
  alertVideo: {
    marginBottom: 8,
    alignSelf: 'flex-start',
    opacity: 0.95,
  },
  alertArticle: {
    marginBottom: 8,
    // align same as video by default
    alignSelf: 'flex-start',
    marginLeft: 0,
    opacity: 0.95,
  },
  alertModule: {
    marginBottom: 8,
    alignSelf: 'center',
    opacity: 0.95,
  },
  cardTitle: {
    marginTop: 2,
    fontSize: 18,
  },
  cardDesc: {
    marginTop: 6,
    color: '#6B6B6B',
  },
  textLeft: {
    textAlign: 'left',
  },
  textCenter: {
    textAlign: 'center',
  },
});

export default Card;
