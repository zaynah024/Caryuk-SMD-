import { StyleSheet, Text, View, Dimensions } from 'react-native';
import { useRouter } from 'expo-router';
import { useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

// Reduced scale to prevent "K" from cutting on smaller devices
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
    transform: [{ rotate: '-11.88deg' }],
  },
  text: {
    fontFamily: 'OpenSans_800ExtraBold_Italic',
    fontSize: FONT_SIZE,
    lineHeight: LINE_HEIGHT,
    textAlign: 'center',
    textTransform: 'uppercase',
  },
  mainText: {
    color: '#FFFFFF',
    zIndex: 2,
  },
  shadowText: {
    color: 'rgba(0, 0, 0, 0.1)',
    zIndex: 1,
    position: 'absolute',
    top: 5,
    left: -5,
  },
});
