import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, StyleSheet } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { CardCarousel } from '@/components/ui/card-carousel';
import { Fonts } from '@/constants/theme';
import { fetchModules, getModuleImage, type Module } from '@/lib/api/modules';
import { getMediaUrl } from '@/lib/api/videos';

export function ModulesCarousel() {
  const router = useRouter();
  const [modules, setModules] = useState<Module[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadModules = async () => {
      try {
        setLoading(true);
        const response = await fetchModules(1, 100);
        setModules(response.docs);
      } catch (err) {
        console.error('Error loading modules:', err);
      } finally {
        setLoading(false);
      }
    };

    loadModules();
  }, []);

  if (loading) {
    return (
      <ThemedView style={styles.container}>
        <ThemedText type="title" style={styles.title}>
          Modules
        </ThemedText>
        <ActivityIndicator size="large" color="#FFD07D" style={styles.loader} />
      </ThemedView>
    );
  }

  return (
    <ThemedView style={styles.container}>
      <ThemedText type="title" style={styles.title}>
        Modules
      </ThemedText>
      <CardCarousel
        data={modules}
        keyExtractor={(item) => item.id.toString()}
        height={240}
        peek={36}
        parallaxOffset={32}
        gap={18}
        renderItem={(item) => (
          <Card
            image={getMediaUrl(getModuleImage(item))}
            title={item.name || 'Untitled Module'}
            description={item.description || ''}
            label="MODULE"
            chipVariant="module"
            layout='module'
            onPress={() => router.push({ pathname: '/module/[id]', params: { id: item.id.toString() } })}
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
  loader: {
    marginVertical: 40,
  },
});
