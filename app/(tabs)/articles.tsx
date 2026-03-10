import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Card } from '@/components/ui/card';
import TabScreen from '@/components/ui/tab-screen';
import { fetchArticles, getArticlePhotoUrl, type Article } from '@/lib/api/articles';

export default function Articles() {
  const router = useRouter();
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadArticles();
  }, []);

  const loadArticles = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetchArticles(1, 100); // Fetch all published articles
      setArticles(response.docs);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load articles');
      console.error('Error loading articles:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <TabScreen title="Articles">
      {loading ? (
        <View style={styles.centered}>
          <ActivityIndicator size="large" color="#FFD07D" />
        </View>
      ) : error ? (
        <View style={styles.centered}>
          <ThemedText style={styles.errorText}>{error}</ThemedText>
        </View>
      ) : (
        <View style={styles.list}>
          {articles.map((article) => (
            <Card
              key={article.id}
              image={getArticlePhotoUrl(article)}
              label="ARTICLE"
              chipVariant="article"
              title={article.title || 'Untitled'}
              description={article.lead || ''}
              layout="article"
              onPress={() => router.push({ pathname: '/article/[id]', params: { id: article.id.toString() } })}
            />
          ))}
        </View>
      )}
    </TabScreen>
  );
}

const styles = StyleSheet.create({
  list: {
    width: '100%',
    gap: 16,
  },
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
  },
  errorText: {
    color: '#EF4444',
    fontSize: 16,
    textAlign: 'center',
  },
});
