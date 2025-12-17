import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Image, SafeAreaView, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Chip } from '@/components/ui/chip';
import { extractTextFromContent, fetchArticleById, type Article } from '@/lib/api/articles';

export default function ArticleDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id?: string }>();
  const [article, setArticle] = useState<Article | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadArticle = async () => {
      try {
        setLoading(true);
        setError(null);
        const articleId = typeof id === 'string' ? parseInt(id) : Array.isArray(id) ? parseInt(id[0]) : 0;
        const data = await fetchArticleById(articleId);
        setArticle(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load article');
        console.error('Error loading article:', err);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      loadArticle();
    }
  }, [id]);

  if (loading) {
    return (
      <SafeAreaView style={[styles.safeArea, styles.centered]}>
        <ActivityIndicator size="large" color="#FFD07D" />
      </SafeAreaView>
    );
  }

  if (error || !article) {
    return (
      <SafeAreaView style={[styles.safeArea, styles.centered]}>
        <ThemedText style={styles.emptyTitle}>
          {error || 'Article not found.'}
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

  const contentParagraphs = extractTextFromContent(article.content);

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.heroWrapper}>
          <Image 
            source={{ uri: article.photo || 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=800&q=80' }} 
            style={styles.heroImage} 
            resizeMode="cover" 
          />
          <View style={styles.heroContent}>
            <Chip variant="article" label="ARTICLE" />
            <ThemedText type="title" style={styles.title}>
              {article.title}
            </ThemedText>
            <ThemedText style={styles.subtitle}>{article.lead}</ThemedText>
          </View>
        </View>

        <View style={styles.body}>
          {contentParagraphs.map((paragraph, index) => (
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
