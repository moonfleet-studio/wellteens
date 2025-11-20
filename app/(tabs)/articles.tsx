import Card from '@/components/ui/card';
import TabScreen from '@/components/ui/tab-screen';
import { ARTICLE_LIBRARY } from '@/constants/articles';
import React from 'react';
import { StyleSheet, View } from 'react-native';

export default function Articles() {
  return (
    <TabScreen title="Articles">
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
