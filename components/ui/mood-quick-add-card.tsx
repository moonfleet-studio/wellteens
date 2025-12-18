import { BlurView } from 'expo-blur';
import { LinearGradient as ExpoLinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { Pressable, StyleProp, StyleSheet, Text, View, ViewStyle } from 'react-native';

import { useMoodDrawer } from '@/components/mood-drawer-context';
import PlusIcon from '@/components/ui/icons/Plus';

import { MoodHistoryCard, MoodHistoryPoint } from './mood-history-card';

type MoodQuickAddCardProps = {
  data: MoodHistoryPoint[];
  style?: StyleProp<ViewStyle>;
};

export function MoodQuickAddCard({ data, style }: MoodQuickAddCardProps) {
  const { openJournalEntry } = useMoodDrawer();

  const handleAddEntry = React.useCallback(() => {
    openJournalEntry();
  }, [openJournalEntry]);

  const accessory = (
    <View style={styles.accessoryWrapper} pointerEvents="box-none">
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Add new mood entry"
        onPress={handleAddEntry}
        style={styles.actionTouchable}
      >
        <BlurView intensity={20} tint="light" style={styles.blurOverlay}>
          <ExpoLinearGradient
            colors={['#FFFFFF', 'rgba(255,255,255,0.5)']}
            start={{ x: 0.5, y: 0 }}
            end={{ x: 0.5, y: 1 }}
            style={styles.actionGradient}
          >
            <View style={styles.actionInner}>
              <PlusIcon size={30} color="#1E1E1E" />
              <Text style={styles.actionLabel}>Add Entry</Text>
            </View>
          </ExpoLinearGradient>
        </BlurView>
      </Pressable>
    </View>
  );

  return (
    <MoodHistoryCard
      data={data}
      title="You are on a good track"
      style={style}
      accessory={accessory}
    />
  );
}

const styles = StyleSheet.create({
  accessoryWrapper: {
    flex: 1,
    justifyContent: 'center',
  },
  actionTouchable: {
    height: '100%',
    minWidth: 130,
    borderRadius: 24,
    shadowColor: '#E0B47F',
    shadowOpacity: 0.35,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 10 },
    elevation: 10,
    overflow: 'hidden',
  },
  blurOverlay: {
    flex: 1,
    borderRadius: 24,
  },
  actionGradient: {
    flex: 1,
    borderRadius: 24,
  },
  actionInner: {
    flex: 1,
    borderRadius: 21,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    paddingHorizontal: 20,
    backgroundColor: 'rgba(255,253,247,0.25)',
  },
  actionLabel: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1F1F1F',
  },
});
