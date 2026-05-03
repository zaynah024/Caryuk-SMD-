import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { Dimensions, StyleSheet, Text, View } from 'react-native';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const scale = SCREEN_WIDTH / 390;
const FONT_SIZE = 70 * scale;
const LINE_HEIGHT = 80 * scale;

export default function SplashScreen() {
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      router.replace('/onboarding');
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />

      <View style={styles.logoContainer}>
        {/* Shadow */}
        <Text style={[styles.text, styles.shadowText]}>CARYUK</Text>
        {/* Main Text */}
        <Text style={[styles.text, styles.mainText]}>CARYUK</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F2B705',
    alignItems: 'center',
    justifyContent: 'center',

  },
  logoContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    transform: [{ rotate: '-11.8deg' }],
    right: 8,
    padding: 20, // Prevents bounding box from clipping rotated children
  },
  text: {
    fontFamily: 'OpenSans_800ExtraBold_Italic',
    fontSize: FONT_SIZE,
    textAlign: 'center',
    textTransform: 'uppercase',
    paddingHorizontal: 20, // Extra space for italic overflow
    paddingVertical: 15, // Extra space for tall letters like K
    right: 8,
  },
  mainText: {
    color: '#FFFFFF',
    zIndex: 2,
  },
  shadowText: {
    color: 'rgba(255, 255, 255, 0.1)',
    zIndex: 1,
    position: 'absolute',
    top: 40,
    left: -8,
  },
});
