import { StyleSheet } from 'react-native';

import { HelloWave } from '@/components/hello-wave';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Chip } from '@/components/ui/chip';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Input } from '@/components/ui/input';
import { MoodHistoryPoint } from '@/components/ui/mood-history-card';
import { MoodQuickAddCard } from '@/components/ui/mood-quick-add-card';
import TabScreen from '@/components/ui/tab-screen';

const moodHomeHistory: MoodHistoryPoint[] = [ // mock data for the mood quick add card 
  { date: '2025-01-02', value: 2.2 },
  { date: '2025-01-04', value: 4.8 },
  { date: '2025-01-06', value: 3.6 },
  { date: '2025-01-09', value: 3.4 },
  { date: '2025-01-12', value: 4.2 },
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
          <ThemedText type="defaultSemiBold">HelloWave</ThemedText>
          <ThemedText style={styles.cardDescription}>Small animated waving component used in onboarding and headers.</ThemedText>
          <ThemedView style={styles.cardPreviewRow}>
            <HelloWave />
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

        <ThemedView >
          <ThemedText type="defaultSemiBold">Card</ThemedText>
          <ThemedText style={styles.cardDescription}>Image card with overlaid alert badge and excerpt.</ThemedText>
          <ThemedView style={{ gap: 12 }}>
            <Card
              image={{ uri: "https://images.unsplash.com/photo-1504829857797-ddff29c27927?auto=format&fit=crop&w=900&q=80" }}
              title="Your mood"
              description="Lorem qui cupidatat est. Proident anim esse laborum aute officia mollit."
              alertVariant="video"
              alertLabel="VIDEO"
            />
            <Card
              image={{ uri: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=900&q=80" }}
              title="Your mood"
              description="Lorem qui cupidatat est. Proident anim esse laborum aute officia mollit."
              alertVariant="article"
              alertLabel="ARTICLE"
            />
            <Card
              image={{ uri: "https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=900&q=80" }}
              title="Your mood"
              description="Lorem qui cupidatat est. Proident anim esse laborum aute officia mollit."
              alertVariant="module"
              alertLabel="MODULE"
            />
          </ThemedView>
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
    // allow a smaller visual size for secondary preview
  },
  previewLabel: {
    color: '#1C1C1C',
  },
  actionButton: {
    marginBottom: 16,
    alignSelf: 'flex-start',
  },
  actionButtonLabel: {
    textAlign: 'center',
    color: '#1C1C1C',
  },
  secondaryButton: {
    marginTop: 8,
    marginBottom: 16,
    alignSelf: 'flex-start',
  },
  secondaryButtonLabel: {
    textAlign: 'center',
    color: '#1C1C1C',
  },
});
