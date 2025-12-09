import { useRouter } from 'expo-router';
import React from 'react';
import { StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Divider } from '@/components/ui/divider';
import { ModulesCarousel } from '@/components/ui/modules-carousel';
import { MoodQuickAddCard } from '@/components/ui/mood-quick-add-card';
import TabScreen from '@/components/ui/tab-screen';
import { ARTICLE_LIBRARY } from '@/constants/articles';
import { Fonts } from '@/constants/theme';
import { VIDEO_LIBRARY } from '@/constants/videos';
import { useMoodHistory } from '@/lib/mood-history';

const featuredVideos = VIDEO_LIBRARY.slice(0, 3);
const featuredArticles = ARTICLE_LIBRARY.slice(0, 3);

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

      <SectionTitle>Videos</SectionTitle>
      <ThemedView style={styles.section}>
        <View style={styles.cardList}>
          {featuredVideos.map((video) => (
            <View style={styles.cardWrapper} key={video.id}>
              <Card
                image={video.image}
                label="VIDEO"
                chipVariant="videoCompact"
                title={video.title}
                description={video.description}
                meta={video.duration}
                onPress={() => router.push({ pathname: '/video/[id]', params: { id: video.id } })}
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
          {featuredArticles.map((article) => (
            <View style={styles.cardWrapper} key={article.id}>
              <Card
                image={article.image}
                label={article.categoryLabel}
                chipVariant="article"
                title={article.title}
                description={article.description}
                layout="article"
                onPress={() => router.push({ pathname: '/article/[id]', params: { id: article.id } })}
              />
            </View>
          ))}
        </View>
        <Button variant="secondary" onPress={() => router.push('/articles')} style={styles.sectionButton}>
          <ThemedText style={styles.buttonLabel}>Read all Articles</ThemedText>
        </Button>
      </ThemedView>
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
  }
});
