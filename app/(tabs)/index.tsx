import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Divider } from '@/components/ui/divider';
import { ModulesCarousel } from '@/components/ui/modules-carousel';
import { MoodQuickAddCard } from '@/components/ui/mood-quick-add-card';
import TabScreen from '@/components/ui/tab-screen';
import { Fonts } from '@/constants/theme';
import { fetchArticles, getArticlePhotoUrl, type Article } from '@/lib/api/articles';
import {
  fetchVideos,
  getMediaUrl,
  type Video,
} from '@/lib/api/videos';
import { useMoodHistory } from '@/lib/mood-history';

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <ThemedText type="title" style={styles.sectionTitle} accessibilityRole="header">
      {children}
    </ThemedText>
  );
}

export default function TabTwoScreen() {
  const router = useRouter();
  const { moodHistory } = useMoodHistory();
  const [videos, setVideos] = useState<Video[]>([]);
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const [videosResponse, articlesResponse] = await Promise.all([
          fetchVideos(1, 3),
          fetchArticles(1, 3),
        ]);
        setVideos(videosResponse.docs);
        setArticles(articlesResponse.docs);
      } catch (err) {
        // Error loading data - silently fail
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  return (
    <TabScreen>
      <ThemedView style={styles.section}>
        <MoodQuickAddCard data={moodHistory} />
      </ThemedView>
      <Divider />

      <ThemedView style={styles.section}>
        <ModulesCarousel />
      </ThemedView>
      <Divider />

      {loading ? (
        <View style={styles.centered}>
          <ActivityIndicator size="large" color="#FFD07D" />
        </View>
      ) : (
        <>
          <SectionTitle>Videos</SectionTitle>
          <ThemedView style={styles.section}>
            <View style={styles.cardList}>
              {videos.map((video) => (
                <View style={styles.cardWrapper} key={video.id}>
                  <Card
                    image={video.thumbnail?.url ? getMediaUrl(video.thumbnail.url) : ''}
                    label="VIDEO"
                    chipVariant="videoCompact"
                    title={video.title || 'Untitled'}
                    description={video.description || ''}
                    meta=""  // Duration not provided by API
                    onPress={() => router.push({ pathname: '/video/[id]', params: { id: video.id.toString() } })}
                  />
                </View>
              ))}
            </View>
            <Button variant="secondary" onPress={() => router.push('/videos')} style={styles.sectionButton}>
              <ThemedText style={styles.buttonLabel}>See all Videos</ThemedText>
            </Button>
          </ThemedView>

          <ThemedView style={styles.section}>
            <View style={styles.cardList}>
              {articles.map((article) => (
                <View style={styles.cardWrapper} key={article.id}>
                  <Card
                    image={getArticlePhotoUrl(article)}
                    label="ARTICLE"
                    chipVariant="article"
                    title={article.title || 'Untitled'}
                    description={article.lead || ''}
                    layout="article"
                    onPress={() => router.push({ pathname: '/article/[id]', params: { id: article.id.toString() } })}
                  />
                </View>
              ))}
            </View>
            <Button variant="secondary" onPress={() => router.push('/articles')} style={styles.sectionButton}>
              <ThemedText style={styles.buttonLabel}>Read all Articles</ThemedText>
            </Button>
          </ThemedView>
        </>
      )}
    </TabScreen>
  );
}

const styles = StyleSheet.create({
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    marginBottom: 8,
    textAlign: 'center',
    fontWeight: '600',
    fontFamily: Fonts.rounded,
    fontSize: 20,
  },
  sectionButton: {
    alignSelf: 'center',
    marginTop: 6,
  },
  buttonLabel: {
    color: '#1C1C1C',
  },
  cardList: {
    width: '100%',
  },
  cardWrapper: {
    marginBottom: 16,
  },
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
  },
});
