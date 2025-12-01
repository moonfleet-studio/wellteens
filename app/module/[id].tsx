import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useMemo } from 'react';
import { Image, SafeAreaView, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Card } from '@/components/ui/card';
import { Chip } from '@/components/ui/chip';
import { ARTICLE_LIBRARY } from '@/constants/articles';
import { getModuleById } from '@/constants/modules';
import { Fonts } from '@/constants/theme';
import { VIDEO_LIBRARY } from '@/constants/videos';

export default function ModuleDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id?: string }>();

  const module = useMemo(
    () => getModuleById(typeof id === 'string' ? id : Array.isArray(id) ? id[0] : undefined),
    [id]
  );

  const moduleVideos = useMemo(() => {
    if (!module) return [];
    return VIDEO_LIBRARY.filter((video) => module.videoIds.includes(video.id));
  }, [module]);

  const moduleArticles = useMemo(() => {
    if (!module) return [];
    return ARTICLE_LIBRARY.filter((article) => module.articleIds.includes(article.id));
  }, [module]);

  if (!module) {
    return (
      <SafeAreaView style={[styles.safeArea, styles.centered]}>
        <ThemedText style={styles.emptyTitle}>Module not found.</ThemedText>
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
          <Image source={{ uri: module.image }} style={styles.heroImage} resizeMode="cover" />
          <View style={styles.heroContent}>
            <Chip variant="module" label="MODULE" />
            <ThemedText type="title" style={styles.title}>
              {module.title}
            </ThemedText>
            <ThemedText style={styles.subtitle}>{module.description}</ThemedText>
          </View>
        </View>

        {moduleVideos.length > 0 && (
          <View style={styles.section}>
            <ThemedText style={styles.sectionTitle}>Videos</ThemedText>
            <View style={styles.cardList}>
              {moduleVideos.map((video) => (
                <Card
                  key={video.id}
                  image={video.image}
                  label="VIDEO"
                  chipVariant="videoCompact"
                  title={video.title}
                  description={video.description}
                  meta={video.duration}
                  onPress={() => router.push({ pathname: '/video/[id]', params: { id: video.id } })}
                />
              ))}
            </View>
          </View>
        )}

        {moduleArticles.length > 0 && (
          <View style={styles.section}>
            <ThemedText style={styles.sectionTitle}>Articles</ThemedText>
            <View style={styles.cardList}>
              {moduleArticles.map((article) => (
                <Card
                  key={article.id}
                  image={article.image}
                  label={article.categoryLabel}
                  chipVariant="article"
                  title={article.title}
                  description={article.description}
                  layout="article"
                  onPress={() => router.push({ pathname: '/article/[id]', params: { id: article.id } })}
                />
              ))}
            </View>
          </View>
        )}
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
  section: {
    paddingHorizontal: 20,
    paddingTop: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    fontFamily: Fonts.rounded,
    color: '#1C1C1C',
    marginBottom: 16,
  },
  cardList: {
    gap: 16,
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
