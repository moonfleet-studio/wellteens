import { useRouter } from 'expo-router';
import React from 'react';
import { StyleSheet, View } from 'react-native';

import { Card } from '@/components/ui/card';
import TabScreen from '@/components/ui/tab-screen';
import { ARTICLE_LIBRARY } from '@/constants/articles';

export default function Articles() {
  const router = useRouter();

  return (
    <TabScreen animatedTopBar title="Articles">
      <View style={styles.list}>
        {ARTICLE_LIBRARY.map((article) => (
          <Card
            key={article.id}
            image={article.image}
            label={article.categoryLabel}
            chipVariant="article"
            title={article.title}
            description={article.description}
            layout="article"
            onPress={() => router.push({ pathname: '/article/[id]', params: { id: article.id } })}
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
