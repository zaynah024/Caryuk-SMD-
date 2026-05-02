import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, Text, View, ImageBackground, TouchableOpacity, Dimensions, Animated } from 'react-native';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';

const { width, height } = Dimensions.get('window');

const ONBOARDING_DATA = [
  {
    id: '1',
    chapter: 'Chapter 1',
    title: 'Welcome to Caryuk',
    subtitle: 'Your ultimate car marketplace. Explore thousands of listings.',
    image: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?q=80&w=1000&auto=format&fit=crop',
  },
  {
    id: '2',
    chapter: 'Chapter 2',
    title: 'Find Your Perfect Ride',
    subtitle: 'Post Your Car In Minutes. Sell Smart, Sell With Speed.',
    image: 'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?q=80&w=1000&auto=format&fit=crop',
  },
  {
    id: '3',
    chapter: 'Chapter 3',
    title: 'Sell It. Fast & Easy.',
    subtitle: 'Secure Transactions And Real Buyers. Get the best value.',
    image: 'https://images.unsplash.com/photo-1583121274602-3e2820c69888?q=80&w=1000&auto=format&fit=crop',
  },
  {
    id: '4',
    chapter: 'Chapter 4',
    title: "Let's Get Started",
    subtitle: 'Join the community and drive your dreams today.',
    image: 'https://images.unsplash.com/photo-1486496146582-9ffcd0b2b2b7?q=80&w=1000&auto=format&fit=crop',
  },
];

export default function OnboardingScreen() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const router = useRouter();
  const progress = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    startProgress();
  }, [currentIndex]);

  const startProgress = () => {
    progress.setValue(0);
    Animated.timing(progress, {
      toValue: 1,
      duration: 4000,
      useNativeDriver: false,
    }).start(({ finished }) => {
      if (finished && currentIndex < ONBOARDING_DATA.length - 1) {
        setCurrentIndex(currentIndex + 1);
      }
    });
  };

  const handleNext = () => {
    if (currentIndex < ONBOARDING_DATA.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      router.replace('/login');
    }
  };

  const handleSkip = () => {
    router.replace('/login');
  };

  const currentData = ONBOARDING_DATA[currentIndex];

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      <ImageBackground source={{ uri: currentData.image }} style={styles.backgroundImage}>
        <View style={styles.overlay}>
          {/* Progress Bars */}
          <View style={styles.progressContainer}>
            {ONBOARDING_DATA.map((_, index) => (
              <View key={index} style={styles.progressBarBackground}>
                <Animated.View 
                  style={[
                    styles.progressBarFill, 
                    { 
                      width: index === currentIndex ? progress.interpolate({
                        inputRange: [0, 1],
                        outputRange: ['0%', '100%'],
                      }) : index < currentIndex ? '100%' : '0%',
                      backgroundColor: index === currentIndex || index < currentIndex ? '#F2B705' : 'rgba(255,255,255,0.3)'
                    }
                  ]} 
                />
              </View>
            ))}
          </View>

          {/* Content */}
          <View style={styles.content}>
            <View style={styles.chapterBadge}>
              <Text style={styles.chapterText}>{currentData.chapter}</Text>
            </View>
            <Text style={styles.title}>{currentData.title}</Text>
            <Text style={styles.subtitle}>{currentData.subtitle}</Text>
          </View>

          {/* Footer */}
          <View style={styles.footer}>
            {currentIndex < ONBOARDING_DATA.length - 1 ? (
              <>
                <TouchableOpacity onPress={handleSkip}>
                  <Text style={styles.skipText}>Skip</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.nextButton} onPress={handleNext}>
                  <Ionicons name="chevron-forward" size={24} color="black" />
                </TouchableOpacity>
              </>
            ) : (
              <TouchableOpacity style={styles.getStartedButton} onPress={handleNext}>
                <Text style={styles.getStartedButtonText}>Let's Started</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backgroundImage: {
    flex: 1,
    width: width,
    height: height,
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    paddingHorizontal: 25,
    paddingTop: 60,
    paddingBottom: 40,
    justifyContent: 'space-between',
  },
  progressContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  progressBarBackground: {
    flex: 1,
    height: 4,
    backgroundColor: 'rgba(255,255,255,0.3)',
    marginHorizontal: 4,
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 2,
  },
  content: {
    marginBottom: 40,
  },
  chapterBadge: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 15,
    paddingVertical: 6,
    borderRadius: 20,
    alignSelf: 'flex-start',
    marginBottom: 15,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  chapterText: {
    color: 'white',
    fontSize: 14,
    fontFamily: 'OpenSans_800ExtraBold',
  },
  title: {
    color: 'white',
    fontSize: 48,
    fontFamily: 'OpenSans_800ExtraBold',
    lineHeight: 52,
    marginBottom: 10,
  },
  subtitle: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 16,
    lineHeight: 22,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  skipText: {
    color: 'rgba(255,255,255,0.6)',
    fontSize: 16,
  },
  nextButton: {
    width: 56,
    height: 56,
    backgroundColor: '#F2B705',
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
  },
  getStartedButton: {
    width: '100%',
    height: 56,
    backgroundColor: '#F2B705',
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
  },
  getStartedButtonText: {
    fontSize: 18,
    fontFamily: 'OpenSans_700Bold',
    color: 'black',
    textTransform: 'uppercase',
  },
});
