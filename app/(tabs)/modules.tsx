import { useRouter } from 'expo-router';
import React from 'react';
import { StyleSheet, View } from 'react-native';

import { Card } from '@/components/ui/card';
import TabScreen from '@/components/ui/tab-screen';
import { MODULE_LIBRARY } from '@/constants/modules';

export default function Modules() {
  const router = useRouter();

  return (
    <TabScreen title="Modules">
      <View style={styles.list}>
        {MODULE_LIBRARY.map((module) => (
          <Card
            key={module.id}
            image={module.image}
            label="MODULE"
            chipVariant={module.chipVariant}
            title={module.title}
            description={module.description}
            layout="module"
            onPress={() => router.push({ pathname: '/module/[id]', params: { id: module.id } })}
          />
        ))}
      </View>
    </TabScreen>
  );
}

const styles = StyleSheet.create({
  list: {
    width: '100%',
    gap: 16,
  },
});
