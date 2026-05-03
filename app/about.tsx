import React from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

export default function AboutScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={24} color="black" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>About Us</Text>
        <View style={{ width: 24 }} />
      </View>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.logoContainer}>
          <Ionicons name="car-sport" size={80} color="#F2B705" />
          <Text style={styles.appName}>Caryuk</Text>
          <Text style={styles.version}>Version 1.0.0</Text>
        </View>
        <Text style={styles.paragraph}>
          Caryuk is your premier destination for luxury and high-performance vehicles. 
          We connect passionate drivers with the world's most extraordinary machines, 
          offering a seamless, premium purchasing experience right from your mobile device.
        </Text>
        <Text style={styles.paragraph}>
          Our mission is to redefine automotive commerce through innovative technology, 
          transparent processes, and unparalleled customer service.
        </Text>
        <View style={styles.contactContainer}>
          <Text style={styles.contactTitle}>Get In Touch</Text>
          <Text style={styles.contactInfo}>Email: support@caryuk.app</Text>
          <Text style={styles.contactInfo}>Phone: +1 (800) 555-0199</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFF' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, marginTop: 10, marginBottom: 20 },
  headerTitle: { fontSize: 20, fontFamily: 'OpenSans_700Bold' },
  content: { paddingHorizontal: 20, paddingBottom: 40 },
  logoContainer: { alignItems: 'center', marginVertical: 30 },
  appName: { fontSize: 28, fontFamily: 'OpenSans_800ExtraBold', color: '#333', marginTop: 10 },
  version: { fontSize: 14, fontFamily: 'OpenSans_600SemiBold', color: '#999', marginTop: 5 },
  paragraph: { fontSize: 15, fontFamily: 'OpenSans_400Regular', color: '#666', lineHeight: 24, textAlign: 'center', marginBottom: 20 },
  contactContainer: { marginTop: 30, backgroundColor: '#F5F5F5', padding: 20, borderRadius: 15, alignItems: 'center' },
  contactTitle: { fontSize: 18, fontFamily: 'OpenSans_700Bold', color: '#333', marginBottom: 10 },
  contactInfo: { fontSize: 14, fontFamily: 'OpenSans_600SemiBold', color: '#666', marginBottom: 5 }
});
