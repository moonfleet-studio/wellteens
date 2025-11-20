import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useMemo } from 'react';
import { Image, SafeAreaView, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Chip } from '@/components/ui/chip';
import { getArticleById } from '@/constants/articles';

export default function ArticleDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id?: string }>();

  const article = useMemo(
    () => getArticleById(typeof id === 'string' ? id : Array.isArray(id) ? id[0] : undefined),
    [id]
  );

  if (!article) {
    return (
      <SafeAreaView style={[styles.safeArea, styles.centered]}>
        <ThemedText style={styles.emptyTitle}>Article not found.</ThemedText>
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
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.heroWrapper}>
          <Image source={{ uri: article.image }} style={styles.heroImage} resizeMode="cover" />
          <View style={styles.heroContent}>
            <Chip variant="article" label={article.categoryLabel} />
            <ThemedText type="title" style={styles.title}>
              {article.title}
            </ThemedText>
            <ThemedText style={styles.subtitle}>{article.description}</ThemedText>
          </View>
        </View>

        <View style={styles.body}>
          {article.content.map((paragraph, index) => (
            <ThemedText key={index} style={styles.paragraph}>
              {paragraph}
            </ThemedText>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F4F6F8',
  },
  scrollContent: {
    paddingBottom: 48,
  },
  heroWrapper: {
    position: 'relative',
  },
  heroImage: {
    width: '100%',
    height: 280,
  },
  heroContent: {
    paddingHorizontal: 20,
    paddingVertical: 24,
    gap: 12,
  },
  title: {
    color: '#111111',
  },
  subtitle: {
    color: '#3B3B3B',
    fontSize: 16,
    lineHeight: 22,
  },
  body: {
    paddingHorizontal: 20,
    paddingTop: 8,
    gap: 16,
  },
  paragraph: {
    fontSize: 16,
    lineHeight: 24,
    color: '#1C1C1C',
  },
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
    backgroundColor: '#F4F6F8',
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1C1C1C',
    textAlign: 'center',
  },
  retryButton: {
    marginTop: 16,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 999,
    backgroundColor: '#1C1C1C',
  },
  retryLabel: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
});
