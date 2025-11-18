import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React, { useMemo, useState } from 'react';
import { ImageBackground, Pressable, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Chip } from '@/components/ui/chip';
import { Input } from '@/components/ui/input';
import TabScreen from '@/components/ui/tab-screen';
import { VIDEO_LIBRARY, type VideoContent } from '@/constants/videos';

function VideoCard({ video, onPress }: { video: VideoContent; onPress: () => void }) {
  return (
    <Pressable onPress={onPress} accessibilityRole="button" style={styles.cardShadow}>
      <ImageBackground source={{ uri: video.image }} style={styles.cardImage} imageStyle={styles.cardImageRadius}>
        <LinearGradient colors={['rgba(0,0,0,0.05)', 'rgba(0,0,0,0.75)']} style={styles.cardOverlay}>
          <View style={styles.captionContainer}>
            <BlurView tint="light" intensity={25} style={styles.captionBlur} />
            <LinearGradient
              colors={['#FFFFFF', 'rgba(255,255,255,0.5)']}
              start={{ x: 0, y: 0.5 }}
              end={{ x: 1, y: 0.5 }}
              style={styles.captionGradient}
            />
            <View style={styles.captionContent}>
              <View style={styles.captionMetaRow}>
                <Chip variant="videoCompact" label="VIDEO" />
                <ThemedText style={styles.captionDuration}>{video.duration}</ThemedText>
              </View>
              <ThemedText style={styles.cardTitle}>{video.title}</ThemedText>
              <ThemedText style={styles.cardDescription} numberOfLines={2}>
                {video.description}
              </ThemedText>
            </View>
          </View>
        </LinearGradient>
      </ImageBackground>
    </Pressable>
  );
}

export default function TabTwoScreen() {
  const [query, setQuery] = useState('');
  const router = useRouter();

  const filteredVideos = useMemo(() => {
    const trimmed = query.trim().toLowerCase();
    if (!trimmed) return VIDEO_LIBRARY;
    return VIDEO_LIBRARY.filter((video) =>
      [video.title, video.description].some((field) => field.toLowerCase().includes(trimmed))
    );
  }, [query]);

  return (
    <TabScreen
      title="Videos"
      collapsibleHeader
      collapsibleHeaderHeight={0}
      headerBackgroundColor={{ light: 'transparent', dark: 'transparent' }}
    >
      <Input
        placeholder="Search"
        value={query}
        onChangeText={setQuery}
        variant="search"
        accessibilityLabel="Search videos"
      />
      <View style={styles.cardsContainer}>
        {filteredVideos.map((video) => (
          <VideoCard
            key={video.id}
            video={video}
            onPress={() => router.push({ pathname: '/video/[id]', params: { id: video.id } })}
          />
        ))}
      </View>
    </TabScreen>
  );
}

const styles = StyleSheet.create({
  cardsContainer: {
    gap: 20,
    width: '100%',
  },
  cardShadow: {
    borderRadius: 20,
    overflow: 'hidden',
    shadowColor: '#000000',
    shadowOpacity: 0.1,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
  },
  cardImage: {
    height: 240,
    width: '100%',
  },
  cardImageRadius: {
    borderRadius: 20,
  },
  cardOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
    padding: 4,
    borderRadius: 20,
  },
  captionContainer: {
    borderRadius: 20,
    overflow: 'hidden',
    height: 96,
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
    justifyContent: 'center',
  },
  captionMetaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  captionDuration: {
    fontSize: 10,
    fontWeight: '600',
    color: '#1C1C1C',
  },
  cardTitle: {
    fontSize: 16,
    color: '#1C1C1C',
  },
  cardDescription: {
    fontSize: 12,
    fontWeight: '400',
    color: '#4C4C4C',
  },
});
