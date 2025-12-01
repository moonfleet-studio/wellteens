import { useRouter } from 'expo-router';
import React from 'react';
import { StyleSheet } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { CardCarousel } from '@/components/ui/card-carousel';
import { MODULE_LIBRARY } from '@/constants/modules';
import { Fonts } from '@/constants/theme';

export function ModulesCarousel() {
  const router = useRouter();

  return (
    <ThemedView style={styles.container}>
      <ThemedText type="title" style={styles.title}>
        Modules
      </ThemedText>
      <CardCarousel
        data={MODULE_LIBRARY}
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
            onPress={() => router.push({ pathname: '/module/[id]', params: { id: item.id } })}
          />
        )}
        style={styles.carousel}
      />
      <Button variant="secondary" onPress={() => router.push('/modules')} style={styles.sectionButton}>
        <ThemedText style={styles.buttonLabel}>See all Modules</ThemedText>
      </Button>
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
  sectionButton: {
    alignSelf: 'center',
    marginTop: 16,
  },
  buttonLabel: {
    color: '#1C1C1C',
  },
});
