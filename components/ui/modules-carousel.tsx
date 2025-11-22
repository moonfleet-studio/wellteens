import React from 'react';
import { StyleSheet } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Card } from '@/components/ui/card';
import { CardCarousel } from '@/components/ui/card-carousel';
import type { ChipVariant } from '@/components/ui/chip';
import { Fonts } from '@/constants/theme';

type ModuleCard = {
  id: string;
  image: string;
  title: string;
  description: string;
  chipVariant: ChipVariant;
};

const moduleDeck: ModuleCard[] = [
  {
    id: 'sleep-reset',
    image:
      'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=900&q=80',
    title: 'Sleep reset',
    description: 'Gentle wind-down prompts that help you switch off before bedtime.',
    chipVariant: 'module',
  },
  {
    id: 'confidence-lifts',
    image: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=900&q=80',
    title: 'Confidence lifts',
    description: 'Tiny wins to celebrate when you speak up or try something new.',
    chipVariant: 'module',
  },
  {
    id: 'body-scan',
    image: 'https://images.unsplash.com/photo-1500534623283-312aade485b7?auto=format&fit=crop&w=900&q=80',
    title: 'Body scan reset',
    description: 'Short guided body awareness practice for when energy dips.',
    chipVariant: 'module',
  },
  {
    id: 'friendship-check',
    image: 'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=900&q=80',
    title: 'Friendship check-in',
    description: 'Map whose energy lifts you and plan one small reach out.',
    chipVariant: 'module',
  },
  {
    id: 'focus-breath',
    image: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=900&q=80',
    title: 'Focus breath',
    description: 'Breath cues to reset attention before a tough conversation.',
    chipVariant: 'module',
  },
];

export function ModulesCarousel() {
  return (
    <ThemedView style={styles.container}>
      <ThemedText type="title" style={styles.title}>
        Modules
      </ThemedText>
      <CardCarousel
        data={moduleDeck}
        keyExtractor={(item) => item.id}
        height={240}
        peek={36}
        parallaxOffset={32}
        gap={18}
        renderItem={(item) => (
          <Card
            image={item.image}
            title={item.title}
            description={item.description}
            label="MODULE"
            chipVariant={item.chipVariant}
            layout='module'
          />
        )}
        style={styles.carousel}
      />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 16,
  },
  title: {
    marginTop: 16,
    marginBottom: 8,
    textAlign: 'center',
    fontSize: 20,
    fontWeight: '600',
    fontFamily: Fonts.rounded,
  },
  carousel: {
    width: '100%',
  },
});
