import React from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, Image, SafeAreaView, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

const PROFILE_OPTIONS = [
  { id: '1', label: 'Email', icon: 'mail-outline', dark: true },
  { id: '2', label: 'Phone Number', icon: 'call-outline' },
  { id: '3', label: 'Privacy Policy', icon: 'lock-closed-outline' },
  { id: '4', label: 'FAQs', icon: 'help-circle-outline' },
  { id: '5', label: 'Settings', icon: 'settings-outline' },
];

export default function ProfileScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()}>
            <Ionicons name="chevron-back" size={24} color="black" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Edit Profile</Text>
          <TouchableOpacity>
            <Ionicons name="ellipsis-vertical" size={24} color="black" />
          </TouchableOpacity>
        </View>

        {/* Profile Section */}
        <View style={styles.profileSection}>
          <View style={styles.avatarContainer}>
            <View style={styles.avatarPlaceholder} />
            <TouchableOpacity style={styles.editBadge}>
              <Ionicons name="pencil" size={16} color="white" />
            </TouchableOpacity>
          </View>
          <Text style={styles.userName}>Paul Walker</Text>
          <Text style={styles.userHandle}>@paulwalkerreals</Text>
        </View>

        {/* Options List */}
        <View style={styles.optionsList}>
          {PROFILE_OPTIONS.map((item) => (
            <TouchableOpacity 
              key={item.id} 
              style={[styles.optionItem, item.dark && styles.darkOptionItem]}
            >
              <View style={styles.optionLeft}>
                <Ionicons name={item.icon as any} size={22} color={item.dark ? "white" : "black"} />
                <Text style={[styles.optionText, item.dark && styles.darkOptionText]}>{item.label}</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color={item.dark ? "white" : "black"} />
            </TouchableOpacity>
          ))}
        </View>

        {/* Logout Button */}
        <TouchableOpacity style={styles.logoutBtn} onPress={() => router.replace('/login')}>
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>

        {/* Padding for bottom navbar */}
        <View style={{ height: 100 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF',
  },
  scrollContent: {
    paddingHorizontal: 25,
    paddingTop: Platform.OS === 'android' ? 40 : 0,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 30,
  },
  headerTitle: {
    fontSize: 20,
    fontFamily: 'OpenSans_700Bold',
  },
  profileSection: {
    alignItems: 'center',
    marginBottom: 40,
  },
  avatarContainer: {
    marginBottom: 20,
  },
  avatarPlaceholder: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#E0E0E0',
  },
  editBadge: {
    position: 'absolute',
    bottom: 5,
    right: 5,
    backgroundColor: '#F2B705',
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'white',
  },
  userName: {
    fontSize: 22,
    fontFamily: 'OpenSans_700Bold',
    marginBottom: 5,
  },
  userHandle: {
    fontSize: 14,
    color: '#F2B705',
    fontFamily: 'OpenSans_600SemiBold',
  },
  optionsList: {
    gap: 12,
    marginBottom: 40,
  },
  optionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    height: 60,
    borderRadius: 15,
    backgroundColor: '#F5F5F5',
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  darkOptionItem: {
    backgroundColor: '#222',
    borderColor: '#222',
  },
  optionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 15,
  },
  optionText: {
    fontSize: 16,
    fontFamily: 'OpenSans_600SemiBold',
  },
  darkOptionText: {
    color: 'white',
  },
  logoutBtn: {
    backgroundColor: '#FF0000',
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  logoutText: {
    color: 'white',
    fontSize: 18,
    fontFamily: 'OpenSans_800ExtraBold',
    textTransform: 'uppercase',
  },
});
