import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Card } from '@/components/ui/card';
import TabScreen from '@/components/ui/tab-screen';
import { fetchJournalEntries } from '@/lib/api/journal';
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
      
      // Fetch modules and journal entries in parallel
      const [modulesResponse, journalResponse] = await Promise.all([
        fetchModules(1, 100),
        fetchJournalEntries(1, 1), // Get only the most recent entry
      ]);
      
      let sortedModules = modulesResponse.docs;
      
      // If user has journal entries, sort by mood match
      if (journalResponse.docs.length > 0) {
        const currentMoodValue = journalResponse.docs[0].mood.value;
        
        // Sort modules: put the closest mood match first, keep rest unchanged
        sortedModules = [...modulesResponse.docs].sort((a, b) => {
          const diffA = Math.abs(a.mood.value - currentMoodValue);
          const diffB = Math.abs(b.mood.value - currentMoodValue);
          
          // If one is closer to current mood, prioritize it
          if (diffA !== diffB) {
            return diffA - diffB;
          }
          
          // If equal distance, maintain original order
          return 0;
        });
      }
      
      setModules(sortedModules);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load modules');
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
