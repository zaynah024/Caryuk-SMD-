import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, Image, ActivityIndicator, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { collection, onSnapshot, query, where, documentId } from 'firebase/firestore';
import { db } from '../config/firebase';
import { useAuth } from '../context/AuthContext';

export default function CartScreen() {
  const router = useRouter();
  const { profile, toggleCart, updateQuantity } = useAuth();
  const [cars, setCars] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!profile?.cart || profile.cart.length === 0) {
      setCars([]);
      setLoading(false);
      return;
    }

    const cartIds = profile.cart.slice(0, 10);
    const q = query(collection(db, 'cars'), where(documentId(), 'in', cartIds));
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const carData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setCars(carData);
      setLoading(false);
    }, (error) => {
      console.error("Error fetching cart items:", error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [profile?.cart]);

  const calculateTotal = () => {
    return cars.reduce((total, car) => {
      const qty = profile?.cartQuantities?.[car.id] || 1;
      return total + (car.price * qty);
    }, 0);
  };

  const formatPrice = (price: number) => {
    return `$${(price / 1000).toFixed(0)}k`;
  };

  if (loading) {
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
          <Text style={styles.headerTitle}>Shopping Cart</Text>
          <TouchableOpacity onPress={() => router.push('/(tabs)')}>
            <Ionicons name="add-circle-outline" size={24} color="black" />
          </TouchableOpacity>
        </View>

        {/* Cart List */}
        <View style={styles.list}>
          {cars.length === 0 ? (
            <View style={styles.emptyState}>
              <Ionicons name="cart-outline" size={80} color="#E0E0E0" />
              <Text style={styles.emptyText}>Your cart is empty.</Text>
              <TouchableOpacity 
                style={styles.browseBtn}
                onPress={() => router.push('/(tabs)')}
              >
                <Text style={styles.browseBtnText}>Start Shopping</Text>
              </TouchableOpacity>
            </View>
          ) : (
            cars.map((item) => (
              <View key={item.id} style={styles.cartItem}>
                <Image source={{ uri: item.image }} style={styles.itemImage} />
                <View style={styles.itemDetails}>
                  <Text style={styles.itemName} numberOfLines={1}>{item.name}</Text>
                  <Text style={styles.itemStyle}>{item.style || 'Premium Edition'}</Text>
                  <Text style={styles.itemPrice}>{formatPrice(item.price)}</Text>
                  <View style={styles.qtyContainer}>
                    <TouchableOpacity 
                      style={styles.qtyBtn} 
                      onPress={() => updateQuantity(item.id, -1)}
                    >
                      <Ionicons name="remove" size={16} color="black" />
                    </TouchableOpacity>
                    <Text style={styles.qtyText}>{profile?.cartQuantities?.[item.id] || 1}</Text>
                    <TouchableOpacity 
                      style={styles.qtyBtn} 
                      onPress={() => updateQuantity(item.id, 1)}
                    >
                      <Ionicons name="add" size={16} color="black" />
                    </TouchableOpacity>
                  </View>
                </View>
                <TouchableOpacity 
                  style={styles.removeBtn}
                  onPress={async () => {
                    await toggleCart(item.id);
                    Alert.alert('Removed', 'Car removed from cart');
                  }}
                >
                  <Ionicons name="trash-outline" size={20} color="#FF4B4B" />
                </TouchableOpacity>
              </View>
            ))
          )}
        </View>
      </ScrollView>

      {/* Footer Checkout */}
      {cars.length > 0 && (
        <View style={styles.cartFooter}>
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Total Payment</Text>
            <Text style={styles.totalValue}>{formatPrice(calculateTotal())}</Text>
          </View>
          <TouchableOpacity 
            style={styles.checkoutBtn}
            onPress={() => router.push(`/payment?cartCheckout=true`)}
          >
            <Text style={styles.checkoutBtnText}>Checkout Now</Text>
          </TouchableOpacity>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF',
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 150,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 25,
  },
  headerTitle: {
    fontSize: 20,
    fontFamily: 'OpenSans_700Bold',
  },
  list: {
    gap: 15,
  },
  cartItem: {
    flexDirection: 'row',
    backgroundColor: '#F5F5F5',
    borderRadius: 20,
    padding: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#F0F0F0',
  },
  itemImage: {
    width: 80,
    height: 80,
    borderRadius: 15,
    backgroundColor: '#E0E0E0',
  },
  itemDetails: {
    flex: 1,
    marginLeft: 15,
  },
  itemName: {
    fontSize: 16,
    fontFamily: 'OpenSans_700Bold',
  },
  itemStyle: {
    fontSize: 12,
    color: '#999',
    marginTop: 2,
    marginBottom: 5,
  },
  itemPrice: {
    fontSize: 16,
    fontFamily: 'OpenSans_700Bold',
    color: '#F2B705',
    marginBottom: 8,
  },
  qtyContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EAEAEA',
    borderRadius: 15,
    alignSelf: 'flex-start',
    paddingHorizontal: 5,
    paddingVertical: 2,
  },
  qtyBtn: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  qtyText: {
    marginHorizontal: 12,
    fontSize: 14,
    fontFamily: 'OpenSans_700Bold',
  },
  removeBtn: {
    padding: 10,
  },
  emptyState: {
    alignItems: 'center',
    marginTop: 100,
  },
  emptyText: {
    fontSize: 18,
    color: '#AAA',
    fontFamily: 'OpenSans_600SemiBold',
    marginTop: 10,
    marginBottom: 20,
  },
  browseBtn: {
    backgroundColor: '#F2B705',
    paddingHorizontal: 30,
    paddingVertical: 12,
    borderRadius: 25,
  },
  browseBtnText: {
    color: 'white',
    fontFamily: 'OpenSans_700Bold',
  },
  cartFooter: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'white',
    padding: 25,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -5 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 10,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  totalLabel: {
    fontSize: 14,
    color: '#999',
    fontFamily: 'OpenSans_600SemiBold',
  },
  totalValue: {
    fontSize: 24,
    fontFamily: 'OpenSans_800ExtraBold',
    color: 'black',
  },
  checkoutBtn: {
    backgroundColor: '#F2B705',
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#F2B705',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  checkoutBtnText: {
    fontSize: 18,
    color: 'white',
    fontFamily: 'OpenSans_800ExtraBold',
    textTransform: 'uppercase',
  },
});
