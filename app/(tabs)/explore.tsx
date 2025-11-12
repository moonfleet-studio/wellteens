import { StyleSheet } from 'react-native';

import { HelloWave } from '@/components/hello-wave';
import ParallaxScrollView from '@/components/parallax-scroll-view';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Chip } from '@/components/ui/chip';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Input } from '@/components/ui/input';
import { Fonts } from '@/constants/theme';

export default function TabTwoScreen() {

  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#D0D0D0', dark: '#353636' }}
      headerImage={
        <IconSymbol
          size={310}
          color="#808080"
          name="chevron.left.forwardslash.chevron.right"
          style={styles.headerImage}
        />
      }>
      <ThemedView style={styles.titleContainer}>
        <ThemedText
          type="title"
          style={{
            fontFamily: Fonts.rounded,
          }}>
          Components
        </ThemedText>
      </ThemedView>
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
          <ThemedText type="defaultSemiBold">Card</ThemedText>
          <ThemedText style={styles.cardDescription}>Image card with overlaid alert badge and excerpt.</ThemedText>
          <ThemedView style={{ gap: 12 }}>
            <Card
              image={require('@/assets/images/partial-react-logo.png')}
              title="Your mood"
              description="Lorem qui cupidatat est. Proident anim esse laborum aute officia mollit."
              alertVariant="video"
              alertLabel="VIDEO"
            />
            <Card
              image={require('@/assets/images/partial-react-logo.png')}
              title="Your mood"
              description="Lorem qui cupidatat est. Proident anim esse laborum aute officia mollit."
              alertVariant="article"
              alertLabel="ARTICLE"
            />
            <Card
              image={require('@/assets/images/partial-react-logo.png')}
              title="Your mood"
              description="Lorem qui cupidatat est. Proident anim esse laborum aute officia mollit."
              alertVariant="module"
              alertLabel="MODULE"
            />
          </ThemedView>
        </ThemedView>
      </ThemedView>

    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  headerImage: {
    color: '#808080',
    bottom: -90,
    left: -35,
    position: 'absolute',
  },
  titleContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  introText: {
    marginVertical: 12,
    color: '#333333',
  },
  componentList: {
    marginBottom: 12,
  },
  card: {
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#ECECEC',
    marginBottom: 12,
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
