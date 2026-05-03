import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

export default function SettingsScreen() {
  const router = useRouter();

  const settingsItems = [
    { title: 'FAQ', icon: 'help-circle-outline', route: '/faq' },
    { title: 'Privacy Policy', icon: 'shield-checkmark-outline', route: '/privacy' },
    { title: 'About Us', icon: 'information-circle-outline', route: '/about' },
  ];

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={24} color="black" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Settings</Text>
        <View style={{ width: 24 }} /> {/* Spacer */}
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.sectionTitle}>General Information</Text>
        <View style={styles.menuContainer}>
          {settingsItems.map((item, index) => (
            <TouchableOpacity 
              key={index} 
              style={[
                styles.menuItem,
                index === settingsItems.length - 1 ? styles.noBorder : null
              ]}
              onPress={() => router.push(item.route as any)}
            >
              <View style={styles.menuItemLeft}>
                <Ionicons name={item.icon as any} size={22} color="#666" />
                <Text style={styles.menuItemText}>{item.title}</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#CCC" />
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F9F9F9' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, marginTop: 10, marginBottom: 20 },
  headerTitle: { fontSize: 20, fontFamily: 'OpenSans_700Bold' },
  content: { paddingHorizontal: 20 },
  sectionTitle: { fontSize: 14, color: '#999', fontFamily: 'OpenSans_700Bold', textTransform: 'uppercase', marginBottom: 10, marginLeft: 5 },
  menuContainer: { backgroundColor: 'white', borderRadius: 20, overflow: 'hidden', borderWidth: 1, borderColor: '#F0F0F0' },
  menuItem: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 20, borderBottomWidth: 1, borderBottomColor: '#F0F0F0' },
  noBorder: { borderBottomWidth: 0 },
  menuItemLeft: { flexDirection: 'row', alignItems: 'center', gap: 15 },
  menuItemText: { fontSize: 16, fontFamily: 'OpenSans_600SemiBold', color: '#333' }
});
