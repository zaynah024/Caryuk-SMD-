import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, Image, SafeAreaView, Platform, ActivityIndicator, Modal, TextInput, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { doc, getDoc, collection, query, where, documentId, getDocs, updateDoc, arrayUnion } from 'firebase/firestore';
import { db, auth } from '../config/firebase';
import { useAuth } from '../context/AuthContext';

export default function PaymentScreen() {
  const router = useRouter();
  const { id, cartCheckout } = useLocalSearchParams();
  const { profile, clearCart } = useAuth();
  
  const [cars, setCars] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showSuccess, setShowSuccess] = useState(false);

  const [address, setAddress] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCVC, setCardCVC] = useState('');
  const [cardName, setCardName] = useState('');

  const [showAddressModal, setShowAddressModal] = useState(false);
  const [tempAddress, setTempAddress] = useState('');

  useEffect(() => {
    async function fetchDetails() {
      try {
        if (cartCheckout === 'true' && profile?.cart?.length > 0) {
          // Fetch all items in cart
          const cartIds = profile.cart.slice(0, 10);
          const q = query(collection(db, 'cars'), where(documentId(), 'in', cartIds));
          const querySnapshot = await getDocs(q);
          const fetchedCars = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
          setCars(fetchedCars);
        } else if (id) {
          // Fetch single item
          const carDoc = await getDoc(doc(db, 'cars', id as string));
          if (carDoc.exists()) {
            setCars([{ id: carDoc.id, ...carDoc.data() }]);
          }
        }
      } catch (error) {
        console.error("Error fetching payment items:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchDetails();
  }, [id, cartCheckout, profile?.cart]);

  const formatPrice = (price: number) => {
    return `$${(price / 1000).toFixed(0)}K`;
  };

  const calculateTotal = () => {
    return cars.reduce((total, car) => {
      const qty = cartCheckout === 'true' ? (profile?.cartQuantities?.[car.id] || 1) : 1;
      return total + ((car.price || 0) * qty);
    }, 0);
  };

  const handlePayment = async () => {
    if (!address.trim() || !cardNumber.trim() || !cardExpiry.trim() || !cardCVC.trim() || !cardName.trim()) {
      Alert.alert("Missing Details", "Please fill in all delivery and payment details before checking out.");
      return;
    }
    
    // Save order to profile
    try {
      const orderData = {
        id: Math.random().toString(36).substring(7),
        date: new Date().toISOString(),
        items: cars.map(car => ({
          id: car.id,
          name: car.name,
          price: car.price,
          image: car.image,
          quantity: cartCheckout === 'true' ? (profile?.cartQuantities?.[car.id] || 1) : 1
        })),
        total: calculateTotal(),
        status: 'Processing'
      };
      
      if (auth.currentUser) {
        await updateDoc(doc(db, 'users', auth.currentUser.uid), {
          orders: arrayUnion(orderData)
        });
      }
    } catch (e) {
      console.error("Failed to save order", e);
    }

    setShowSuccess(true);
    
    if (cartCheckout === 'true') {
      await clearCart();
    }

    setTimeout(() => {
      setShowSuccess(false);
      router.push('/(tabs)');
    }, 2500);
  };

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'white' }}>
        <ActivityIndicator size="large" color="#F2B705" />
      </View>
    );
  }

  const isCartFlow = cartCheckout === 'true';

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()}>
            <Ionicons name="chevron-back" size={24} color="black" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Checkout</Text>
          <TouchableOpacity>
            <Ionicons name="chatbubble-ellipses" size={24} color="black" />
          </TouchableOpacity>
        </View>

        {/* Delivery Address */}
        <View style={styles.addressSection}>
          <View style={styles.addressIconContainer}>
            <Ionicons name="location" size={24} color="white" />
          </View>
          <View style={styles.addressTextContainer}>
            <Text style={styles.addressLabel}>Delivery Address</Text>
            {address.trim() ? (
              <TouchableOpacity onPress={() => { setTempAddress(address); setShowAddressModal(true); }}>
                <Text style={styles.addressValue}>{address}</Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity onPress={() => { setTempAddress(''); setShowAddressModal(true); }}>
                <Text style={[styles.addressValue, { color: '#F2B705', fontFamily: 'OpenSans_700Bold' }]}>
                  + Add Delivery Details
                </Text>
              </TouchableOpacity>
            )}
          </View>
        </View>

        {/* Order Summary */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Order Summary {isCartFlow ? `(${cars.length} Items)` : ''}</Text>
        </View>

        {/* Render Items */}
        <View style={isCartFlow ? styles.multiCarList : styles.singleCarContainer}>
          {cars.map((carItem, index) => (
            isCartFlow ? (
              // Multi-item Cart Style
              <View key={carItem.id || index} style={styles.cartListItem}>
                <Image source={{ uri: carItem.image }} style={styles.cartListImg} />
                <View style={styles.cartListDetails}>
                  <Text style={styles.cartListName}>
                    {carItem.name} {profile?.cartQuantities?.[carItem.id] > 1 && `(x${profile.cartQuantities[carItem.id]})`}
                  </Text>
                  <Text style={styles.cartListPrice}>{formatPrice(carItem.price)}</Text>
                </View>
              </View>
            ) : (
              // Single-item Premium Style
              <View key={carItem.id || index} style={styles.carSummaryCard}>
                <Image 
                  source={{ uri: carItem.image }} 
                  style={styles.summaryImage} 
                />
                <View style={styles.summaryOverlay}>
                  <View style={styles.summaryInfoRow}>
                    <Text style={styles.summaryName}>{carItem.name}</Text>
                    <Text style={styles.summaryPrice}>{formatPrice(carItem.price)}</Text>
                  </View>
                </View>
              </View>
            )
          ))}
        </View>

        {/* Credit Card Form */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Payment Details</Text>
        </View>
        
        <View style={styles.cardForm}>
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Cardholder Name</Text>
            <TextInput 
              style={styles.cardInput}
              value={cardName}
              onChangeText={setCardName}
              placeholder="PAUL WALKER"
              placeholderTextColor="#999"
              autoCapitalize="characters"
            />
          </View>
          
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Card Number</Text>
            <TextInput 
              style={styles.cardInput}
              value={cardNumber}
              onChangeText={setCardNumber}
              placeholder="1234 5555 6464 4444"
              placeholderTextColor="#999"
              keyboardType="numeric"
              maxLength={16}
            />
          </View>
          
          <View style={styles.cardRow}>
            <View style={[styles.inputGroup, { flex: 1, marginRight: 10 }]}>
              <Text style={styles.inputLabel}>Expiry Date</Text>
              <TextInput 
                style={styles.cardInput}
                value={cardExpiry}
                onChangeText={setCardExpiry}
                placeholder="MM/YY"
                placeholderTextColor="#999"
                maxLength={5}
              />
            </View>
            <View style={[styles.inputGroup, { flex: 1, marginLeft: 10 }]}>
              <Text style={styles.inputLabel}>CVC</Text>
              <TextInput 
                style={styles.cardInput}
                value={cardCVC}
                onChangeText={setCardCVC}
                placeholder="123"
                placeholderTextColor="#999"
                keyboardType="numeric"
                maxLength={4}
                secureTextEntry
              />
            </View>
          </View>
        </View>

        {/* Total Price */}
        <View style={styles.totalPriceRow}>
          <View style={styles.totalPriceLeft}>
            <Ionicons name="pricetag-outline" size={22} color="black" />
            <Text style={styles.totalPriceLabel}>Total Payment</Text>
          </View>
          <Text style={styles.totalPriceValue}>{formatPrice(calculateTotal())}</Text>
        </View>

        {/* Confirm Payment Button */}
        <TouchableOpacity style={styles.confirmBtn} onPress={handlePayment}>
          <Text style={styles.confirmBtnText}>Confirm Payment</Text>
        </TouchableOpacity>

        <View style={{ height: 40 }} />
      </ScrollView>

      {/* Success Modal */}
      <Modal transparent visible={showSuccess} animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalIconContainer}>
              <Ionicons name="checkmark-done" size={50} color="#F2B705" />
            </View>
            <Text style={styles.modalTitle}>Order Placed!</Text>
            <Text style={styles.modalMessage}>Thank you for choosing Caryuk. Your premium vehicles are being prepared.</Text>
          </View>
        </View>
      </Modal>

      {/* Address Edit Modal */}
      <Modal transparent visible={showAddressModal} animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.addressModalContent}>
            <Text style={styles.addressModalTitle}>Delivery Address</Text>
            <TextInput 
              style={styles.addressModalInput}
              value={tempAddress}
              onChangeText={setTempAddress}
              multiline
              placeholder="Enter your complete delivery address"
              placeholderTextColor="#999"
              autoFocus
            />
            <View style={styles.addressModalActions}>
              <TouchableOpacity style={styles.addressModalCancel} onPress={() => setShowAddressModal(false)}>
                <Text style={styles.addressModalCancelText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={styles.addressModalSave} 
                onPress={() => {
                  setAddress(tempAddress);
                  setShowAddressModal(false);
                }}
              >
                <Text style={styles.addressModalSaveText}>Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

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
  addressSection: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 15,
    marginBottom: 25,
  },
  addressIconContainer: {
    width: 45,
    height: 45,
    backgroundColor: '#F2B705',
    borderRadius: 22.5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addressTextContainer: {
    flex: 1,
  },
  addressLabel: {
    fontSize: 18,
    fontFamily: 'OpenSans_700Bold',
    marginBottom: 5,
  },
  addressValue: {
    fontSize: 12,
    color: '#666',
    lineHeight: 18,
  },
  sectionHeader: {
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: 'OpenSans_700Bold',
  },
  multiCarList: {
    gap: 10,
    marginBottom: 25,
  },
  singleCarContainer: {
    marginBottom: 25,
  },
  cartListItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    padding: 10,
    borderRadius: 15,
  },
  cartListImg: {
    width: 60,
    height: 60,
    borderRadius: 10,
  },
  cartListDetails: {
    marginLeft: 15,
  },
  cartListName: {
    fontSize: 14,
    fontFamily: 'OpenSans_700Bold',
  },
  cartListPrice: {
    fontSize: 14,
    color: '#F2B705',
    fontFamily: 'OpenSans_700Bold',
    marginTop: 2,
  },
  carSummaryCard: {
    width: '100%',
    height: 180,
    borderRadius: 25,
    backgroundColor: '#F5F5F5',
    overflow: 'hidden',
  },
  summaryImage: {
    width: '100%',
    height: '100%',
  },
  summaryOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 15,
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  summaryInfoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  summaryName: {
    color: 'white',
    fontSize: 16,
    fontFamily: 'OpenSans_700Bold',
  },
  summaryPrice: {
    color: '#F2B705',
    fontSize: 16,
    fontFamily: 'OpenSans_700Bold',
  },
  addressInput: {
    fontSize: 14,
    color: '#333',
    fontFamily: 'OpenSans_400Regular',
    marginTop: 5,
    backgroundColor: '#F9F9F9',
    padding: 10,
    borderRadius: 10,
    minHeight: 60,
  },
  cardForm: {
    backgroundColor: '#F5F5F5',
    padding: 20,
    borderRadius: 25,
    marginBottom: 30,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  inputGroup: {
    marginBottom: 15,
  },
  inputLabel: {
    fontSize: 12,
    color: '#666',
    fontFamily: 'OpenSans_700Bold',
    marginBottom: 8,
    marginLeft: 5,
    textTransform: 'uppercase',
  },
  cardInput: {
    backgroundColor: 'white',
    height: 50,
    borderRadius: 12,
    paddingHorizontal: 15,
    fontSize: 16,
    fontFamily: 'OpenSans_600SemiBold',
    color: 'black',
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  cardRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  totalPriceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 30,
  },
  totalPriceLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  totalPriceLabel: {
    fontSize: 16,
    fontFamily: 'OpenSans_700Bold',
  },
  totalPriceValue: {
    fontSize: 24,
    fontFamily: 'OpenSans_800ExtraBold',
    color: 'black',
  },
  confirmBtn: {
    backgroundColor: '#F2B705',
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 40,
    shadowColor: '#F2B705',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  confirmBtnText: {
    color: 'white',
    fontSize: 18,
    fontFamily: 'OpenSans_800ExtraBold',
    textTransform: 'uppercase',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#222',
    padding: 30,
    borderRadius: 25,
    alignItems: 'center',
    width: '85%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.5,
    shadowRadius: 20,
    elevation: 10,
    borderWidth: 1,
    borderColor: '#333',
  },
  modalIconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(242, 183, 5, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    borderWidth: 2,
    borderColor: '#F2B705',
  },
  modalTitle: {
    fontSize: 24,
    color: 'white',
    fontFamily: 'OpenSans_800ExtraBold',
    marginBottom: 10,
  },
  modalMessage: {
    fontSize: 14,
    color: '#CCC',
    textAlign: 'center',
    fontFamily: 'OpenSans_400Regular',
    lineHeight: 20,
  },
  addressModalContent: {
    backgroundColor: '#FFF',
    padding: 25,
    borderRadius: 20,
    width: '90%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.2,
    shadowRadius: 15,
    elevation: 10,
  },
  addressModalTitle: {
    fontSize: 20,
    fontFamily: 'OpenSans_800ExtraBold',
    marginBottom: 15,
    color: 'black',
  },
  addressModalInput: {
    backgroundColor: '#F5F5F5',
    borderRadius: 15,
    padding: 15,
    minHeight: 100,
    textAlignVertical: 'top',
    fontSize: 14,
    fontFamily: 'OpenSans_600SemiBold',
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  addressModalActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 15,
  },
  addressModalCancel: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
    backgroundColor: '#F5F5F5',
  },
  addressModalCancelText: {
    color: '#666',
    fontFamily: 'OpenSans_700Bold',
  },
  addressModalSave: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
    backgroundColor: '#F2B705',
  },
  addressModalSaveText: {
    color: 'white',
    fontFamily: 'OpenSans_700Bold',
  },
});
