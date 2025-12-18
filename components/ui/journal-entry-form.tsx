import { HeaderBackButton } from '@react-navigation/elements';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useEffect, useRef, useState } from 'react';
import {
  Animated,
  Easing,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useMoodDrawer } from '@/components/mood-drawer-context';
import { ThemedText } from '@/components/themed-text';
import { IconSymbol } from '@/components/ui/icon-symbol';

export function JournalEntryForm() {
  const {
    isJournalFormOpen,
    closeJournalEntry,
    selectedMoodIndex,
    openMoodDrawer,
    addJournalEntry,
    editingEntry,
    updateJournalEntry,
    moodStates,
  } = useMoodDrawer();

  const safeArea = useSafeAreaInsets();
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  const translateY = useRef(new Animated.Value(1000)).current;
  const opacity = useRef(new Animated.Value(0)).current;

  const selectedMood = moodStates[selectedMoodIndex];
  // Use first two colors from the mood state for the gradient
  const moodColors: readonly [string, string] = [
    selectedMood.colors[0] || '#FFEECF',
    selectedMood.colors[1] || '#FFD07D',
  ] as const;

  const canSave = title.trim().length > 0 && body.trim().length > 0;
  const isEditing = editingEntry !== null;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(translateY, {
        toValue: isJournalFormOpen ? 0 : 1000,
        duration: 300,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
      }),
      Animated.timing(opacity, {
        toValue: isJournalFormOpen ? 1 : 0,
        duration: 250,
        useNativeDriver: true,
      }),
    ]).start();

    if (isJournalFormOpen && editingEntry) {
      setTitle(editingEntry.title);
      setBody(editingEntry.body);
    } else if (!isJournalFormOpen) {
      setTitle('');
      setBody('');
    }
  }, [isJournalFormOpen, editingEntry, translateY, opacity]);

  const handleClose = () => {
    closeJournalEntry();
  };

  const handleChangeMood = () => {
    openMoodDrawer();
  };

  const handleSave = async () => {
    if (!canSave || isSaving) return;

    setIsSaving(true);
    try {
      if (isEditing && editingEntry) {
        await updateJournalEntry({
          ...editingEntry,
          title: title.trim(),
          body: body.trim(),
          moodValue: selectedMood.value,
          moodLabel: selectedMood.label,
        });
      } else {
        await addJournalEntry({
          title: title.trim(),
          body: body.trim(),
          moodValue: selectedMood.value,
          moodLabel: selectedMood.label,
        });
      }
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Animated.View
      pointerEvents={isJournalFormOpen ? 'auto' : 'none'}
      style={[
        styles.overlay,
        {
          opacity,
          transform: [{ translateY }],
        },
      ]}
    >
      <KeyboardAvoidingView
        style={styles.keyboardView}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <View style={[styles.container, { paddingTop: safeArea.top + 16 }]}>
          <View style={styles.backButtonContainer}>
            <HeaderBackButton onPress={handleClose} style={{ marginLeft: -12 }} />
          </View>

          <ScrollView
            style={styles.scrollView}
            contentContainerStyle={styles.scrollContent}
            keyboardShouldPersistTaps="handled"
          >
            <View style={styles.inputGroup}>
              <TextInput
                style={styles.titleInput}
                placeholder="Title"
                placeholderTextColor="rgba(0,0,0,0.5)"
                value={title}
                onChangeText={setTitle}
                returnKeyType="next"
              />
              <View style={styles.underline} />
            </View>

            <View style={styles.inputGroup}>
              <TextInput
                style={styles.bodyInput}
                placeholder="Type here"
                placeholderTextColor="rgba(0,0,0,0.4)"
                value={body}
                onChangeText={setBody}
                multiline
                textAlignVertical="top"
              />
            </View>
          </ScrollView>

          <View style={[styles.footer, { paddingBottom: safeArea.bottom + 16 }]}>
            <Pressable onPress={handleChangeMood} accessibilityRole="button">
              <LinearGradient
                colors={moodColors}
                start={{ x: 0, y: 0.5 }}
                end={{ x: 1, y: 0.5 }}
                style={styles.changeMoodButton}
              >
                <Text style={styles.changeMoodLabel}>Change mood</Text>
                <IconSymbol name="Plus" size={18} color="#1C1C1C" />
              </LinearGradient>
            </Pressable>

            <Pressable
              onPress={handleSave}
              accessibilityRole="button"
              accessibilityState={{ disabled: !canSave || isSaving }}
              disabled={!canSave || isSaving}
              style={[styles.saveButton, (!canSave || isSaving) && styles.saveButtonDisabled]}
            >
              <LinearGradient
                colors={canSave && !isSaving ? ['#FFEECF', '#FFD07D'] : ['#E8E8E8', '#D4D4D4']}
                start={{ x: 0, y: 0.5 }}
                end={{ x: 1, y: 0.5 }}
                style={styles.saveButtonGradient}
              >
                <ThemedText style={[styles.saveLabel, (!canSave || isSaving) && styles.saveLabelDisabled]}>
                  {isSaving ? 'Saving...' : 'Save'}
                </ThemedText>
              </LinearGradient>
            </Pressable>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#FFFFFF',
    zIndex: 40,
  },
  keyboardView: {
    flex: 1,
  },
  container: {
    flex: 1,
    paddingHorizontal: 24,
  },
  backButtonContainer: {
    marginBottom: 16,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  inputGroup: {
    marginBottom: 16,
  },
  titleInput: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1C1C1C',
    paddingVertical: 8,
  },
  underline: {
    height: 1,
    backgroundColor: '#E0E0E0',
    marginTop: 4,
  },
  bodyInput: {
    fontSize: 16,
    color: '#1C1C1C',
    minHeight: 200,
    paddingVertical: 8,
  },
  footer: {
    paddingTop: 16,
    gap: 12,
  },
  changeMoodButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 32,
  },
  changeMoodLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1C1C1C',
  },
  saveButton: {
    borderRadius: 32,
    overflow: 'hidden',
  },
  saveButtonDisabled: {
    opacity: 0.6,
  },
  saveButtonGradient: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 32,
  },
  saveLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1C1C1C',
  },
  saveLabelDisabled: {
    color: '#7B7B7B',
  },
});
