import { ThemedText } from '@/components/themed-text';
import WelcomeSplashBg from '@/components/ui/icons/WelcomeSplashBg';
import WelcomeSplashContainer from '@/components/ui/icons/WelcomeSplashContainer';
import { Dimensions, StyleSheet, View } from 'react-native';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export function AuthHeader() {
  return (
    <View style={styles.splashContainer}>
      <View style={styles.splashSvgWrapper}>
        <WelcomeSplashContainer width="100%" height={SCREEN_WIDTH * (556 / 393)} />
      </View>
      <View style={styles.splashBgWrapper}>
        <WelcomeSplashBg width="100%" height={SCREEN_WIDTH * (311 / 393)} />
      </View>
      <View style={styles.splashContent}>
        <ThemedText style={styles.welcomeTitle}>Welcome</ThemedText>
        <ThemedText style={styles.welcomeTitle}>to Wellteens</ThemedText>
        <ThemedText style={styles.welcomeSubtitle}>
          where we are fostering the well being{'\n'}of teenagers fleeing the war.
        </ThemedText>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  splashContainer: {
    width: '100%',
    aspectRatio: 393 / 556,
  },
  splashSvgWrapper: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  splashBgWrapper: {
    position: 'absolute',
    top: 20,
    left: 0,
    right: 0,
  },
  splashContent: {
    flex: 1,
    paddingHorizontal: 24,
    paddingBottom: 80,
    justifyContent: 'flex-end',
  },
  welcomeTitle: {
    fontSize: 36,
    fontWeight: '600',
    color: '#FFFFFF',
    lineHeight: 42,
  },
  welcomeSubtitle: {
    fontSize: 13,
    color: '#FFFFFF',
    fontWeight: '500',
    marginTop: 12,
    lineHeight: 20,
  },
});
