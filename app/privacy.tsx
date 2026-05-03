import React from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

export default function PrivacyScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={24} color="black" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Privacy Policy</Text>
        <View style={{ width: 24 }} />
      </View>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.heading}>1. Information Collection</Text>
        <Text style={styles.paragraph}>
          We collect information from you when you register on our app, place an order, or subscribe to our newsletter. This includes your name, email address, phone number, and delivery details.
        </Text>

        <Text style={styles.heading}>2. Use of Information</Text>
        <Text style={styles.paragraph}>
          Any of the information we collect from you may be used to personalize your experience, improve our platform, improve customer service, and process transactions efficiently. We do not sell your data.
        </Text>

        <Text style={styles.heading}>3. Information Protection</Text>
        <Text style={styles.paragraph}>
          We implement a variety of security measures to maintain the safety of your personal information when you place an order or access your personal information. All transactions are securely encrypted.
        </Text>

        <Text style={styles.heading}>4. Cookies and Tracking</Text>
        <Text style={styles.paragraph}>
          We use cookies to understand and save your preferences for future visits and compile aggregate data about site traffic and interaction so that we can offer better experiences.
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFF' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, marginTop: 10, marginBottom: 20 },
  headerTitle: { fontSize: 20, fontFamily: 'OpenSans_700Bold' },
  content: { paddingHorizontal: 20, paddingBottom: 40 },
  heading: { fontSize: 18, fontFamily: 'OpenSans_700Bold', color: '#333', marginTop: 20, marginBottom: 10 },
  paragraph: { fontSize: 14, fontFamily: 'OpenSans_400Regular', color: '#666', lineHeight: 24 }
});
