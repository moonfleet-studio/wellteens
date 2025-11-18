import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useMemo, useState } from 'react';
import { ImageBackground, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Chip } from '@/components/ui/chip';
import { Input } from '@/components/ui/input';
import TabScreen from '@/components/ui/tab-screen';

type VideoContent = {
  id: string;
  title: string;
  duration: string;
  description: string;
  image: string;
};

const VIDEOS: VideoContent[] = [
  {
    id: '1',
    title: 'Your mood',
    duration: '05:23',
    description: 'Quick practices to pause, breathe, and notice what your body is trying to tell you.',
    image: 'https://images.unsplash.com/photo-1504829857797-ddff29c27927?auto=format&fit=crop&w=900&q=80',
  },
  {
    id: '2',
    title: 'Grounding with friends',
    duration: '04:11',
    description: 'A walk-and-talk script to help your circle open up about how they are really doing.',
    image: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=900&q=80',
  },
  {
    id: '3',
    title: 'Morning reset',
    duration: '03:45',
    description: 'Gentle stretches plus mantras that set a calmer tone before classes begin.',
    image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=900&q=80',
  },
  {
    id: '4',
    title: 'Grounding with friends',
    duration: '04:11',
    description: 'A walk-and-talk script to help your circle open up about how they are really doing.',
    image: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=900&q=80',
  },
  {
    id: '5',
    title: 'Morning reset',
    duration: '03:45',
    description: 'Gentle stretches plus mantras that set a calmer tone before classes begin.',
    image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=900&q=80',
  },
  {
    id: '6',
    title: 'Grounding with friends',
    duration: '04:11',
    description: 'A walk-and-talk script to help your circle open up about how they are really doing.',
    image: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=900&q=80',
  },
  {
    id: '7',
    title: 'Morning reset',
    duration: '03:45',
    description: 'Gentle stretches plus mantras that set a calmer tone before classes begin.',
    image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=900&q=80',
  },
];

function VideoCard({ video }: { video: VideoContent }) {
  return (
    <View style={styles.cardShadow}>
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
    </View>
  );
}

export default function TabTwoScreen() {
  const [query, setQuery] = useState('');

  const filteredVideos = useMemo(() => {
    const trimmed = query.trim().toLowerCase();
    if (!trimmed) return VIDEOS;
    return VIDEOS.filter((video) =>
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
          <VideoCard key={video.id} video={video} />
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
