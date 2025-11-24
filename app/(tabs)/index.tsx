import { ScrollView, StyleSheet } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Alert, type AlertVariant } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { CardCarousel } from '@/components/ui/card-carousel';
import { Checkbox } from '@/components/ui/checkbox';
import { Chip, type ChipVariant } from '@/components/ui/chip';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Input } from '@/components/ui/input';
import { ModulesCarousel } from '@/components/ui/modules-carousel';
import { MoodHistoryPoint } from '@/components/ui/mood-history-card';
import { MoodQuickAddCard } from '@/components/ui/mood-quick-add-card';
import TabScreen from '@/components/ui/tab-screen';

const moodHomeHistory: MoodHistoryPoint[] = [
  { date: '2025-01-02', value: 2.2 },
  { date: '2025-01-04', value: 4.8 },
  { date: '2025-01-06', value: 3.6 },
  { date: '2025-01-09', value: 3.4 },
  { date: '2025-01-12', value: 4.2 },
];

type FeaturedCard = {
  id: string;
  image: string;
  title: string;
  description: string;
  label: string;
  chipVariant: ChipVariant;
  layout?: 'default' | 'article' | 'module';
  meta?: string;
};

const featuredCards: FeaturedCard[] = [
  {
    id: 'video-habits',
    image: 'https://images.unsplash.com/photo-1504829857797-ddff29c27927?auto=format&fit=crop&w=900&q=80',
    title: 'Guided breathing reset',
    description: 'Five-minute practice to slow spiraling thoughts before class.',
    label: 'VIDEO',
    chipVariant: 'video',
    layout: 'default',
    meta: '4:35',
  },
  {
    id: 'article-boundaries',
    image: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=900&q=80',
    title: 'How to set small boundaries',
    description: 'Quick prompts for talking with friends when you need space.',
    label: 'ARTICLE',
    chipVariant: 'article',
    layout: 'article',
    meta: '6 min read',
  },
  {
    id: 'module-confidence',
    image: 'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=900&q=80',
    title: 'Confidence mini-module',
    description: 'Daily reflections to help you notice wins and speak up.',
    label: 'MODULE',
    chipVariant: 'module',
    layout: 'module',
  },
];

const alertExamples: {
  id: string;
  variant: AlertVariant;
  chipLabel: string;
  chipVariant: ChipVariant;
  title: string;
  date: string;
  body: string;
}[] = [
  {
    id: 'mood-check',
    variant: 'module',
    chipLabel: 'MOOD',
    chipVariant: 'module',
    title: 'Your mood',
    date: '12.08.2025',
    body: 'Lorem qui cupidatat est. Proident anim esse laborum aute officia mollit.',
  },
  {
    id: 'breath-reset',
    variant: 'article',
    chipLabel: 'BREATH',
    chipVariant: 'article',
    title: 'Breathing reset',
    date: '11.08.2025',
    body: 'Breathe in for 4, hold for 4, breathe out slowly for 6 seconds.',
  },
  {
    id: 'pep-talk',
    variant: 'video',
    chipLabel: 'HYPE',
    chipVariant: 'video',
    title: 'Pep talk',
    date: '10.08.2025',
    body: 'Quick encouragement from the Wellteens mentor team.',
  },
];

export default function TabTwoScreen() {
  return (
    <TabScreen
      title="Components"
      headerContent={<MoodQuickAddCard data={moodHomeHistory} style={styles.quickAddCard} />}
      headerBackgroundColor={{ light: '#D0D0D0', dark: '#353636' }}
      headerImage={
        <IconSymbol
          size={310}
          color="#808080"
          name={'Play' as any}
          style={styles.headerImage}
        />
      }>
      <ThemedText style={styles.introText}>
        A quick preview of shared UI components. Use these as building blocks across the app.
      </ThemedText>
      <ModulesCarousel />
      <ThemedView style={styles.alertsWrapper}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.alertsRow}>
          {alertExamples.map((alert) => (
            <Alert
              key={alert.id}
              variant={alert.variant}
              chipLabel={alert.chipLabel}
              chipVariant={alert.chipVariant}
              title={alert.title}
              date={alert.date}
              body={alert.body}
              style={styles.alertCard}
            />
          ))}
        </ScrollView>
      </ThemedView>

      <ThemedView style={styles.componentList}>
        <ThemedView style={styles.card}>
          <ThemedText type="defaultSemiBold">Button</ThemedText>
          <ThemedText style={styles.cardDescription}>Reusable gradient button with primary and secondary variants.</ThemedText>
          <ThemedView style={styles.cardPreviewRow}>
            <Button onPress={() => {}} style={styles.previewButton}>
              <ThemedText type="defaultSemiBold" style={styles.previewLabel}>Primary</ThemedText>
            </Button>
            <Button variant="secondary" onPress={() => {}} style={[styles.previewButton, styles.previewSecondary]}>
              <ThemedText type="defaultSemiBold" style={styles.previewLabel}>Secondary</ThemedText>
            </Button>
          </ThemedView>
        </ThemedView>

        <ThemedView style={styles.card}>
          <ThemedText type="defaultSemiBold">Input</ThemedText>
          <ThemedText style={styles.cardDescription}>Text field with label and underline — controlled or uncontrolled.</ThemedText>
          <ThemedView style={styles.cardPreviewRow}>
            <Input label="Title" placeholder="Enter title" style={{ width: 300 }} />
          </ThemedView>
          <ThemedView style={{ marginTop: 10 }}>
            <Input label="Notes" placeholder="Write a short note..." variant="multiline" numberOfLines={4} style={{ width: 300 }} />
          </ThemedView>
        </ThemedView>
        <ThemedView style={styles.card}>
          <ThemedText type="defaultSemiBold">Tag / Chip</ThemedText>
          <ThemedText style={styles.cardDescription}>Small labeled chips for content categories and quick actions.</ThemedText>
          <ThemedView style={styles.chipColumn}>
            <Chip variant="video" label="VIDEO" style={styles.chipItem} />
            <Chip variant="article" label="ARTICLE" style={styles.chipItem} />
            <Chip variant="module" label="MODULE" style={styles.chipItem} />
            <Chip variant="mood" label="MOOD" style={styles.chipItem} />
          </ThemedView>
        </ThemedView>

        <ThemedView style={styles.card}>
          <ThemedText type="defaultSemiBold">Checkbox</ThemedText>
          <ThemedText style={styles.cardDescription}>A checkbox with a clickable label — tapping the label toggles the box.</ThemedText>
          <Checkbox
            label={
              'Akceptuję warunki korzystania z aplikacji Wellteens oraz zgadzam się z polityką prywatności'
            }
            style={{ marginTop: 8, alignSelf: 'flex-start', maxWidth: '100%' }}
          />
        </ThemedView>

        <ThemedView>
          <ThemedText type="defaultSemiBold">Card</ThemedText>
          <ThemedText style={styles.cardDescription}>Image card with overlaid alert badge and excerpt.</ThemedText>
          <CardCarousel
            data={featuredCards}
            keyExtractor={(item) => item.id}
            height={300}
            peek={36}
            parallaxOffset={60}
            style={styles.carousel}
            renderItem={(item) => (
              <Card
                image={item.image}
                title={item.title}
                description={item.description}
                label={item.label}
                chipVariant={item.chipVariant}
                layout={item.layout}
                meta={item.meta}
              />
            )}
          />
        </ThemedView>
      </ThemedView>

    </TabScreen>
  );
}

const styles = StyleSheet.create({
  headerImage: {
    color: '#808080',
    bottom: -90,
    left: -35,
    position: 'absolute',
  },
  introText: {
    marginVertical: 12,
    color: '#333333',
  },
  componentList: {
    marginBottom: 12,
  },
  quickAddCard: {
    marginBottom: 24,
  },
  card: {
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#ECECEC',
    marginBottom: 48,
  },
  cardDescription: {
    marginTop: 6,
    marginBottom: 10,
    color: '#6B6B6B',
  },
  cardPreviewRow: {
    flexDirection: 'row',
    gap: 8,
    alignItems: 'center',
  },
  chipColumn: {
    flexDirection: 'column',
    alignItems: 'flex-start',
  },
  chipItem: {
    marginBottom: 12,
  },
  previewButton: {
    marginRight: 8,
  },
  previewSecondary: {
    
  },
  previewLabel: {
    color: '#1C1C1C',
  },
  alertsWrapper: {
    marginBottom: 16,
  },
  alertsRow: {
    flexDirection: 'row',
    gap: 12,
    alignItems: 'stretch',
    paddingHorizontal: 4,
  },
  alertCard: {
    marginRight: 12,
  },
  carousel: {
    marginTop: 16,
  },
});
