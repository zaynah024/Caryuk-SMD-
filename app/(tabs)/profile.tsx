import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, Image, SafeAreaView, Platform, ActivityIndicator, TextInput, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { signOut } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import * as ImagePicker from 'expo-image-picker';
import { auth, db } from '../../config/firebase';
import { useAuth } from '../../context/AuthContext';

export default function ProfileScreen() {
  const router = useRouter();
  const { user, profile, loading } = useAuth();
  
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [avatar, setAvatar] = useState('');
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    if (profile) {
      setFullName(profile.fullName || '');
      setPhone(profile.phone || '');
      setAvatar(profile.profileImage || '');
    }
  }, [profile]);

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  const pickImage = async () => {
    // Request permission
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    
    if (status !== 'granted') {
      Alert.alert('Permission Denied', 'Sorry, we need camera roll permissions to make this work!');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.3, // Compressing for Firestore storage
      base64: true,
    });

    if (!result.canceled) {
      // For web, base64 is often best for small demo profiles without a storage bucket
      const base64Image = `data:image/jpeg;base64,${result.assets[0].base64}`;
      setAvatar(base64Image);
    }
  };

  const handleUpdate = async () => {
    if (!user) return;
    setUpdating(true);
    try {
      const userRef = doc(db, 'users', user.uid);
      await setDoc(userRef, {
        fullName,
        phone,
        profileImage: avatar
      }, { merge: true });
      Alert.alert('Success', 'Profile updated successfully!');
    } catch (error) {
      console.error("Update profile error:", error);
      Alert.alert('Error', 'Failed to update profile.');
    } finally {
      setUpdating(false);
    }
  };

  if (loading || !profile) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'white' }}>
        <ActivityIndicator size="large" color="#F2B705" />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()}>
            <Ionicons name="chevron-back" size={24} color="black" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Edit Profile</Text>
          <TouchableOpacity onPress={handleUpdate} disabled={updating}>
            {updating ? <ActivityIndicator size="small" color="#F2B705" /> : <Text style={styles.saveBtnText}>Save</Text>}
          </TouchableOpacity>
        </View>

        {/* Profile Section */}
        <View style={styles.profileSection}>
          <TouchableOpacity style={styles.avatarContainer} onPress={pickImage}>
            {avatar ? (
              <Image source={{ uri: avatar }} style={styles.avatar} />
            ) : (
              <View style={styles.avatarPlaceholder}>
                <Ionicons name="person" size={50} color="#999" />
              </View>
            )}
            <View style={styles.editBadge}>
              <Ionicons name="camera" size={16} color="white" />
            </View>
          </TouchableOpacity>
          <Text style={styles.userName}>{fullName || 'User'}</Text>
          <Text style={styles.userHandle}>@{fullName?.toLowerCase().replace(/\s/g, '') || 'user'}</Text>
        </View>

        {/* Inputs List */}
        <View style={styles.inputsList}>
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Full Name</Text>
            <View style={styles.inputWrapper}>
              <Ionicons name="person-outline" size={20} color="#999" />
              <TextInput 
                style={styles.textInput}
                value={fullName}
                onChangeText={setFullName}
                placeholder="Enter full name"
              />
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Email Address</Text>
            <View style={[styles.inputWrapper, styles.disabledInput]}>
              <Ionicons name="mail-outline" size={20} color="#999" />
              <Text style={styles.disabledText}>{user?.email}</Text>
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Phone Number</Text>
            <View style={styles.inputWrapper}>
              <Ionicons name="call-outline" size={20} color="#999" />
              <TextInput 
                style={styles.textInput}
                value={phone}
                onChangeText={setPhone}
                placeholder="Enter phone number"
                keyboardType="phone-pad"
              />
            </View>
          </View>
          
          <TouchableOpacity style={styles.changePhotoBtn} onPress={pickImage}>
            <Ionicons name="images-outline" size={20} color="#F2B705" />
            <Text style={styles.changePhotoText}>Change Profile Photo</Text>
          </TouchableOpacity>
        </View>

        {/* Previous Orders */}
        <View style={styles.ordersSection}>
          <Text style={styles.sectionTitle}>Previous Orders</Text>
          {!profile?.orders || profile.orders.length === 0 ? (
            <Text style={styles.noOrdersText}>You haven't placed any orders yet.</Text>
          ) : (
            [...profile.orders].reverse().map((order: any, idx: number) => (
              <View key={order.id || idx} style={styles.orderCard}>
                <View style={styles.orderHeader}>
                  <Text style={styles.orderId}>Order #{order.id}</Text>
                  <View style={styles.statusBadge}>
                    <Text style={styles.orderStatus}>{order.status}</Text>
                  </View>
                </View>
                <Text style={styles.orderDate}>{new Date(order.date).toLocaleDateString()}</Text>
                <View style={styles.orderItems}>
                  {order.items?.map((item: any, i: number) => (
                    <Text key={i} style={styles.orderItemText}>• {item.quantity}x {item.name}</Text>
                  ))}
                </View>
                <Text style={styles.orderTotal}>Total: ${(order.total / 1000).toFixed(0)}k</Text>
              </View>
            ))
          )}
        </View>

        {/* Create Listing Button */}
        <TouchableOpacity style={styles.sellerBtn} onPress={() => router.push('/create-listing')}>
          <Ionicons name="car-sport" size={20} color="black" />
          <Text style={styles.sellerBtnText}>Create Car Listing</Text>
        </TouchableOpacity>

        {/* Logout Button */}
        <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>

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
  saveBtnText: {
    color: '#F2B705',
    fontFamily: 'OpenSans_700Bold',
    fontSize: 16,
  },
  profileSection: {
    alignItems: 'center',
    marginBottom: 30,
  },
  avatarContainer: {
    marginBottom: 20,
  },
  avatarPlaceholder: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#F5F5F5',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
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
  inputsList: {
    gap: 20,
    marginBottom: 40,
  },
  inputGroup: {
    gap: 8,
  },
  inputLabel: {
    fontSize: 14,
    color: '#333',
    fontFamily: 'OpenSans_700Bold',
    marginLeft: 5,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    height: 60,
    borderRadius: 15,
    paddingHorizontal: 20,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  textInput: {
    flex: 1,
    marginLeft: 12,
    fontSize: 16,
    fontFamily: 'OpenSans_600SemiBold',
    color: 'black',
  },
  disabledInput: {
    backgroundColor: '#FAFAFA',
    borderColor: '#F0F0F0',
  },
  disabledText: {
    marginLeft: 12,
    fontSize: 16,
    color: '#999',
    fontFamily: 'OpenSans_400Regular',
  },
  changePhotoBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    marginTop: 10,
  },
  changePhotoText: {
    color: '#F2B705',
    fontFamily: 'OpenSans_700Bold',
    fontSize: 14,
  },
  ordersSection: { marginTop: 25 },
  sectionTitle: { fontSize: 18, fontFamily: 'OpenSans_700Bold', color: '#333', marginBottom: 15 },
  noOrdersText: { fontSize: 14, fontFamily: 'OpenSans_400Regular', color: '#999', fontStyle: 'italic' },
  orderCard: { backgroundColor: '#F9F9F9', borderRadius: 15, padding: 15, marginBottom: 15, borderWidth: 1, borderColor: '#F0F0F0' },
  orderHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 5 },
  orderId: { fontSize: 16, fontFamily: 'OpenSans_700Bold', color: '#333' },
  statusBadge: { backgroundColor: '#E8F5E9', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8 },
  orderStatus: { fontSize: 12, fontFamily: 'OpenSans_700Bold', color: '#4CAF50' },
  orderDate: { fontSize: 12, fontFamily: 'OpenSans_400Regular', color: '#999', marginBottom: 10 },
  orderItems: { marginBottom: 10 },
  orderItemText: { fontSize: 14, fontFamily: 'OpenSans_600SemiBold', color: '#666', marginBottom: 2 },
  orderTotal: { fontSize: 16, fontFamily: 'OpenSans_800ExtraBold', color: '#333', marginTop: 5, borderTopWidth: 1, borderTopColor: '#E0E0E0', paddingTop: 10 },
  sellerBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10, backgroundColor: '#F2B705', height: 60, borderRadius: 15, marginTop: 10, marginBottom: 15 },
  sellerBtnText: { color: 'black', fontSize: 16, fontFamily: 'OpenSans_700Bold' },
  settingsBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    backgroundColor: '#F5F5F5',
    borderWidth: 1,
    borderColor: '#E0E0E0',
    height: 55,
    borderRadius: 15,
    marginTop: 20,
  },
  settingsText: {
    color: '#333',
    fontSize: 16,
    fontFamily: 'OpenSans_700Bold',
  },
  logoutBtn: {
    backgroundColor: '#FF4B4B',
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
