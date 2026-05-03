import React from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

export default function FAQScreen() {
  const router = useRouter();
  
  const faqs = [
    { q: 'How do I buy a car?', a: 'Simply browse our collection, add your desired vehicle to the cart, and proceed to checkout. We handle the rest!' },
    { q: 'What payment methods are accepted?', a: 'We accept all major credit cards, bank transfers, and select cryptocurrency payments for premium vehicles.' },
    { q: 'Can I test drive a vehicle?', a: 'Yes! Contact the seller directly using the "Call Seller" button on the car detail page to arrange a test drive.' },
    { q: 'Is delivery included?', a: 'Delivery is calculated based on your location and the vehicle type during checkout. We offer worldwide premium delivery.' },
    { q: 'Can I cancel an order?', a: 'Orders can be cancelled within 24 hours of placement without penalty. Contact support for assistance.' }
  ];

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={24} color="black" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>FAQ</Text>
        <View style={{ width: 24 }} />
      </View>
      <ScrollView contentContainerStyle={styles.content}>
        {faqs.map((faq, index) => (
          <View key={index} style={styles.faqCard}>
            <Text style={styles.question}>{faq.q}</Text>
            <Text style={styles.answer}>{faq.a}</Text>
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFF' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, marginTop: 10, marginBottom: 20 },
  headerTitle: { fontSize: 20, fontFamily: 'OpenSans_700Bold' },
  content: { paddingHorizontal: 20, paddingBottom: 40 },
  faqCard: { backgroundColor: '#F9F9F9', padding: 20, borderRadius: 15, marginBottom: 15, borderWidth: 1, borderColor: '#F0F0F0' },
  question: { fontSize: 16, fontFamily: 'OpenSans_700Bold', color: '#333', marginBottom: 8 },
  answer: { fontSize: 14, fontFamily: 'OpenSans_400Regular', color: '#666', lineHeight: 22 }
});
