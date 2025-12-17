import { useRouter } from 'expo-router';
import React, { useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import TabScreen from '@/components/ui/tab-screen';
import {
  fetchVideos,
  getMediaUrl,
  getVideoDescription,
  getVideoDuration,
  getVideoTitle,
  type Video,
} from '@/lib/api/videos';

export default function TabTwoScreen() {
  const [query, setQuery] = useState('');
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    loadVideos();
  }, []);

  const loadVideos = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetchVideos(1, 100);
      setVideos(response.docs);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load videos');
      console.error('Error loading videos:', err);
    } finally {
      setLoading(false);
    }
  };

  const filteredVideos = useMemo(() => {
    const trimmed = query.trim().toLowerCase();
    if (!trimmed) return videos;
    return videos.filter((video) => {
      const title = getVideoTitle(video).toLowerCase();
      const description = getVideoDescription(video).toLowerCase();
      return title.includes(trimmed) || description.includes(trimmed);
    });
  }, [query, videos]);

  return (
    <TabScreen
      title="Videos"
      headerBackgroundColor={{ light: 'transparent', dark: 'transparent' }}
    >
      <Input
        placeholder="Search"
        value={query}
        onChangeText={setQuery}
        variant="search"
        accessibilityLabel="Search videos"
      />
      {loading ? (
        <View style={styles.centered}>
          <ActivityIndicator size="large" color="#FFD07D" />
        </View>
      ) : error ? (
        <View style={styles.centered}>
          <ThemedText style={styles.errorText}>{error}</ThemedText>
        </View>
      ) : (
        <View style={styles.cardsContainer}>
          {filteredVideos.map((video) => (
            <Card
              key={video.id}
              image={getMediaUrl(video.thumbnail.url)}
              label="VIDEO"
              chipVariant="videoCompact"
              title={getVideoTitle(video)}
              description={getVideoDescription(video)}
              meta={getVideoDuration(video)}
              onPress={() => router.push({ pathname: '/video/[id]', params: { id: video.id.toString() } })}
            />
          ))}
        </View>
      )}
    </TabScreen>
  );
}

const styles = StyleSheet.create({
  cardsContainer: {
    gap: 20,
    width: '100%',
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
