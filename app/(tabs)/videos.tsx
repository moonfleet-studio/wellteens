import { useRouter } from 'expo-router';
import React, { useMemo, useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import TabScreen from '@/components/ui/tab-screen';
import { VIDEO_LIBRARY } from '@/constants/videos';

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
    </TabScreen>
  );
}

const styles = StyleSheet.create({
  cardsContainer: {
    gap: 20,
    width: '100%',
  },
});
