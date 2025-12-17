import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Card } from '@/components/ui/card';
import TabScreen from '@/components/ui/tab-screen';
import { fetchModules, getModuleImage, type Module } from '@/lib/api/modules';
import { getMediaUrl } from '@/lib/api/videos';

export default function Modules() {
  const router = useRouter();
  const [modules, setModules] = useState<Module[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadModules();
  }, []);

  const loadModules = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetchModules(1, 100);
      setModules(response.docs);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load modules');
      console.error('Error loading modules:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <TabScreen title="Modules">
      {loading ? (
        <View style={styles.centered}>
          <ActivityIndicator size="large" color="#FFD07D" />
        </View>
      ) : error ? (
        <View style={styles.centered}>
          <ThemedText style={styles.errorText}>{error}</ThemedText>
        </View>
      ) : (
        <View style={styles.list}>
          {modules.map((module) => (
            <Card
              key={module.id}
              image={getMediaUrl(getModuleImage(module))}
              label="MODULE"
              chipVariant="module"
              title={module.name}
              description={module.description}
              layout="module"
              onPress={() => router.push({ pathname: '/module/[id]', params: { id: module.id.toString() } })}
            />
          ))}
        </View>
      )}
    </TabScreen>
  );
}

const styles = StyleSheet.create({
  list: {
    width: '100%',
    gap: 16,
  },
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
  },
  errorText: {
    color: '#EF4444',
    fontSize: 16,
    textAlign: 'center',
  },
});
