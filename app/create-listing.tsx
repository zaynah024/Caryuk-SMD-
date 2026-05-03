import React, { useState } from 'react';
import { StyleSheet, Text, View, ScrollView, TextInput, TouchableOpacity, Alert, ActivityIndicator, Image, Modal } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { collection, addDoc } from 'firebase/firestore';
import * as ImagePicker from 'expo-image-picker';
import { db } from '../config/firebase';
import { useAuth } from '../context/AuthContext';

export default function CreateListingScreen() {
  const router = useRouter();
  const { profile } = useAuth();
  
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [style, setStyle] = useState('');
  const [imageUri, setImageUri] = useState('');
  const [description, setDescription] = useState('');
  const [features, setFeatures] = useState('');
  const [vehicleInfo, setVehicleInfo] = useState('');
  const [loading, setLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission Required', 'Please allow access to your photo library to add car images.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [16, 9],
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      setImageUri(result.assets[0].uri);
    }
  };

  const takePhoto = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission Required', 'Please allow access to your camera to take car photos.');
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [16, 9],
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      setImageUri(result.assets[0].uri);
    }
  };

  const handleCreateListing = async () => {
    if (!name || !price || !imageUri || !description) {
      Alert.alert("Missing Details", "Please fill in all the required fields (Name, Price, Image, Description).");
      return;
    }

    setLoading(true);
    try {
      const parsedPrice = parseFloat(price.replace(/,/g, ''));
      const featuresArray = features.split(',').map(f => f.trim()).filter(f => f);

      await addDoc(collection(db, 'cars'), {
        name,
        price: isNaN(parsedPrice) ? 0 : parsedPrice,
        style,
        image: imageUri,
        description,
        features: featuresArray,
        vehicleInfo,
        sellerName: profile?.fullName || 'Private Seller',
        sellerPhone: 'Contact via app',
        liked: false,
        createdAt: new Date().toISOString()
      });

      setLoading(false);
      setShowSuccess(true);
      setTimeout(() => {
        setShowSuccess(false);
        router.push('/');
      }, 2500);
    } catch (e) {
      console.error(e);
      setLoading(false);
      Alert.alert("Error", "Could not create listing. Please try again.");
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={24} color="black" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Create Listing</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        <Text style={styles.subtitle}>Sell Your Vehicle on Caryuk</Text>

        {/* Image Picker Section */}
        <View style={styles.formGroup}>
          <Text style={styles.label}>Car Photo *</Text>
          {imageUri ? (
            <View style={styles.imagePreviewContainer}>
              <Image source={{ uri: imageUri }} style={styles.imagePreview} />
              <TouchableOpacity style={styles.removeImageBtn} onPress={() => setImageUri('')}>
                <Ionicons name="close-circle" size={28} color="#FF4B4B" />
              </TouchableOpacity>
            </View>
          ) : (
            <View style={styles.imagePlaceholder}>
              <Ionicons name="image-outline" size={50} color="#CCC" />
              <Text style={styles.imagePlaceholderText}>Add a photo of your car</Text>
              <View style={styles.imageButtons}>
                <TouchableOpacity style={styles.imagePickerBtn} onPress={pickImage}>
                  <Ionicons name="images" size={20} color="black" />
                  <Text style={styles.imagePickerBtnText}>Gallery</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.imagePickerBtn} onPress={takePhoto}>
                  <Ionicons name="camera" size={20} color="black" />
                  <Text style={styles.imagePickerBtnText}>Camera</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        </View>
        
        <View style={styles.formGroup}>
          <Text style={styles.label}>Car Name/Model *</Text>
          <TextInput style={styles.input} placeholder="e.g. Porsche 911 GT3" value={name} onChangeText={setName} />
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Price (USD) *</Text>
          <TextInput style={styles.input} placeholder="e.g. 185000" keyboardType="numeric" value={price} onChangeText={setPrice} />
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Color/Style</Text>
          <TextInput style={styles.input} placeholder="e.g. Shark Blue" value={style} onChangeText={setStyle} />
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Description *</Text>
          <TextInput 
            style={[styles.input, styles.textArea]} 
            placeholder="Tell buyers about your car..." 
            multiline 
            numberOfLines={4}
            value={description} 
            onChangeText={setDescription} 
          />
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Features (Comma separated)</Text>
          <TextInput style={styles.input} placeholder="e.g. AWD, Leather Seats, V8" value={features} onChangeText={setFeatures} />
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Vehicle Info (Quick Specs)</Text>
          <TextInput style={styles.input} placeholder="e.g. Year: 2021 | Mileage: 5000 km | Manual" value={vehicleInfo} onChangeText={setVehicleInfo} />
        </View>

        <TouchableOpacity style={styles.submitBtn} onPress={handleCreateListing} disabled={loading}>
          {loading ? (
            <ActivityIndicator color="black" />
          ) : (
            <Text style={styles.submitBtnText}>Publish Listing</Text>
          )}
        </TouchableOpacity>
      </ScrollView>

      {/* Success Modal */}
      <Modal visible={showSuccess} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.successCircle}>
              <Ionicons name="checkmark" size={50} color="white" />
            </View>
            <Text style={styles.successTitle}>Listing Published!</Text>
            <Text style={styles.successSubtitle}>Your car is now live on Caryuk marketplace</Text>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F9F9F9' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, marginTop: 10, marginBottom: 15 },
  headerTitle: { fontSize: 20, fontFamily: 'OpenSans_700Bold' },
  scrollContent: { paddingHorizontal: 20, paddingBottom: 50 },
  subtitle: { fontSize: 16, fontFamily: 'OpenSans_600SemiBold', color: '#666', marginBottom: 25 },
  formGroup: { marginBottom: 20 },
  label: { fontSize: 14, fontFamily: 'OpenSans_700Bold', color: '#333', marginBottom: 8 },
  input: { backgroundColor: 'white', height: 50, borderRadius: 10, paddingHorizontal: 15, fontFamily: 'OpenSans_400Regular', fontSize: 14, borderWidth: 1, borderColor: '#EEE' },
  textArea: { height: 100, paddingTop: 15, textAlignVertical: 'top' },
  imagePreviewContainer: { position: 'relative', borderRadius: 15, overflow: 'hidden' },
  imagePreview: { width: '100%', height: 200, borderRadius: 15, resizeMode: 'cover' },
  removeImageBtn: { position: 'absolute', top: 10, right: 10, backgroundColor: 'white', borderRadius: 14, overflow: 'hidden' },
  imagePlaceholder: { backgroundColor: 'white', borderRadius: 15, height: 200, alignItems: 'center', justifyContent: 'center', borderWidth: 2, borderColor: '#EEE', borderStyle: 'dashed' },
  imagePlaceholderText: { fontSize: 14, fontFamily: 'OpenSans_400Regular', color: '#999', marginTop: 10, marginBottom: 15 },
  imageButtons: { flexDirection: 'row', gap: 15 },
  imagePickerBtn: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: '#F2B705', paddingHorizontal: 18, paddingVertical: 10, borderRadius: 10 },
  imagePickerBtnText: { fontFamily: 'OpenSans_700Bold', fontSize: 14, color: 'black' },
  submitBtn: { backgroundColor: '#F2B705', height: 60, borderRadius: 15, justifyContent: 'center', alignItems: 'center', marginTop: 20, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.2, shadowRadius: 5, elevation: 5 },
  submitBtnText: { color: 'black', fontSize: 16, fontFamily: 'OpenSans_800ExtraBold', textTransform: 'uppercase' },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.6)', justifyContent: 'center', alignItems: 'center' },
  modalContent: { backgroundColor: 'white', borderRadius: 25, padding: 40, alignItems: 'center', width: '80%', shadowColor: '#000', shadowOffset: { width: 0, height: 10 }, shadowOpacity: 0.3, shadowRadius: 20, elevation: 10 },
  successCircle: { width: 90, height: 90, borderRadius: 45, backgroundColor: '#4CAF50', justifyContent: 'center', alignItems: 'center', marginBottom: 20 },
  successTitle: { fontSize: 22, fontFamily: 'OpenSans_800ExtraBold', color: '#333', marginBottom: 8 },
  successSubtitle: { fontSize: 14, fontFamily: 'OpenSans_400Regular', color: '#999', textAlign: 'center' }
});
