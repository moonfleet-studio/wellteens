import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Image, SafeAreaView, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Card } from '@/components/ui/card';
import { Chip } from '@/components/ui/chip';
import { Fonts } from '@/constants/theme';
import { getArticlePhotoUrl } from '@/lib/api/articles';
import { fetchModuleById, getModuleImage, type Module } from '@/lib/api/modules';
import { getMediaUrl } from '@/lib/api/videos';

export default function ModuleDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id?: string }>();
  const [module, setModule] = useState<Module | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadModule = async () => {
      try {
        setLoading(true);
        setError(null);
        const moduleId = typeof id === 'string' ? parseInt(id) : Array.isArray(id) ? parseInt(id[0]) : 0;
        const data = await fetchModuleById(moduleId);
        setModule(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load module');
        console.error('Error loading module:', err);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      loadModule();
    }
  }, [id]);

  if (loading) {
    return (
      <SafeAreaView style={[styles.safeArea, styles.centered]}>
        <ActivityIndicator size="large" color="#FFD07D" />
      </SafeAreaView>
    );
  }

  if (error || !module) {
    return (
      <SafeAreaView style={[styles.safeArea, styles.centered]}>
        <ThemedText style={styles.emptyTitle}>
          {error || 'Module not found.'}
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
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.heroWrapper}>
          <Image source={{ uri: getMediaUrl(getModuleImage(module)) }} style={styles.heroImage} resizeMode="cover" />
          <View style={styles.heroContent}>
            <Chip variant="module" label="MODULE" />
            <ThemedText type="title" style={styles.title}>
              {module.name}
            </ThemedText>
            <ThemedText style={styles.subtitle}>{module.description}</ThemedText>
          </View>
        </View>

        {module.videos.length > 0 && (
          <View style={styles.section}>
            <ThemedText style={styles.sectionTitle}>Videos</ThemedText>
            <View style={styles.cardList}>
              {module.videos.map((video) => (
                <Card
                  key={video.id}
                  image={getMediaUrl(video.thumbnail.url)}
                  label="VIDEO"
                  chipVariant="videoCompact"
                  title={video.title}
                  description={video.description}
                  meta=""  // Duration not provided by API
                  onPress={() => router.push({ pathname: '/video/[id]', params: { id: video.id.toString() } })}
                />
              ))}
            </View>
          </View>
        )}

        {module.articles.length > 0 && (
          <View style={styles.section}>
            <ThemedText style={styles.sectionTitle}>Articles</ThemedText>
            <View style={styles.cardList}>
              {module.articles.map((article) => (
                <Card
                  key={article.id}
                  image={getArticlePhotoUrl(article)}
                  label="ARTICLE"
                  chipVariant="article"
                  title={article.title}
                  description={article.lead}
                  layout="article"
                  onPress={() => router.push({ pathname: '/article/[id]', params: { id: article.id.toString() } })}
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
