import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, Image, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { collection, onSnapshot } from 'firebase/firestore';
import { db } from '../config/firebase';

export default function AllCarsScreen() {
  const router = useRouter();
  const [cars, setCars] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const carsRef = collection(db, 'cars');
    const unsubscribe = onSnapshot(carsRef, (snapshot) => {
      const carsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setCars(carsData);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const formatPrice = (price: number) => {
    return `$${(price / 1000).toFixed(0)}k`;
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={24} color="black" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>All Vehicles</Text>
        <View style={{ width: 24 }} />
      </View>

      {loading ? (
        <ActivityIndicator color="#F2B705" size="large" style={{ marginTop: 50 }} />
      ) : (
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
          <Text style={styles.countText}>{cars.length} Cars Available</Text>
          <View style={styles.grid}>
            {cars.map((car) => (
              <TouchableOpacity 
                key={car.id} 
                style={styles.card}
                onPress={() => router.push(`/car-detail?id=${car.id}`)}
              >
                <Image source={{ uri: car.image }} style={styles.cardImage} />
                <View style={styles.cardInfo}>
                  <Text style={styles.cardTitle} numberOfLines={1}>{car.name}</Text>
                  <Text style={styles.cardPrice}>{formatPrice(car.price)}</Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F9F9F9' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, marginTop: 10, marginBottom: 15 },
  headerTitle: { fontSize: 20, fontFamily: 'OpenSans_700Bold' },
  content: { paddingHorizontal: 20, paddingBottom: 40 },
  countText: { fontSize: 14, fontFamily: 'OpenSans_600SemiBold', color: '#666', marginBottom: 15 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  card: { width: '48%', backgroundColor: 'white', borderRadius: 15, marginBottom: 15, overflow: 'hidden', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 5, elevation: 2 },
  cardImage: { width: '100%', height: 120, resizeMode: 'cover' },
  cardInfo: { padding: 12 },
  cardTitle: { fontSize: 14, fontFamily: 'OpenSans_700Bold', color: '#333', marginBottom: 4 },
  cardPrice: { fontSize: 16, fontFamily: 'OpenSans_800ExtraBold', color: '#F2B705' }
});
