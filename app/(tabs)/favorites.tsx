import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, Image, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { collection, onSnapshot, query, where, documentId } from 'firebase/firestore';
import { db } from '../../config/firebase';
import { useAuth } from '../../context/AuthContext';

export default function FavoritesScreen() {
  const router = useRouter();
  const { profile, toggleFavorite } = useAuth();
  const [cars, setCars] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // If no favorites, stop loading and show empty state
    if (!profile?.favorites || profile.favorites.length === 0) {
      setCars([]);
      setLoading(false);
      return;
    }

    // Fetch only the cars that are in the user's favorites array
    // Firestore 'in' query is limited to 10 items, but for a demo this is perfect
    const favoriteIds = profile.favorites.slice(0, 10);
    const q = query(collection(db, 'cars'), where(documentId(), 'in', favoriteIds));
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const carData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setCars(carData);
      setLoading(false);
    }, (error) => {
      console.error("Error fetching favorites:", error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [profile?.favorites]);

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
          <Text style={styles.headerTitle}>My Favorites</Text>
          <TouchableOpacity>
            <Ionicons name="ellipsis-vertical" size={24} color="black" />
          </TouchableOpacity>
        </View>

        {/* Favorites List */}
        <View style={styles.list}>
          {cars.length === 0 ? (
            <View style={styles.emptyState}>
              <Ionicons name="heart-dislike-outline" size={80} color="#E0E0E0" />
              <Text style={styles.emptyText}>No favorites yet.</Text>
              <TouchableOpacity 
                style={styles.browseBtn}
                onPress={() => router.push('/(tabs)')}
              >
                <Text style={styles.browseBtnText}>Browse Cars</Text>
              </TouchableOpacity>
            </View>
          ) : (
            cars.map((item) => (
              <TouchableOpacity 
                key={item.id} 
                style={styles.card}
                onPress={() => router.push(`/car-detail?id=${item.id}`)}
              >
                <Image source={{ uri: item.image }} style={styles.cardImage} />
                <TouchableOpacity 
                  style={styles.heartBtn}
                  onPress={(e) => {
                    e.stopPropagation();
                    toggleFavorite(item.id);
                  }}
                >
                  <Ionicons name="heart" size={24} color="#FF4B4B" />
                </TouchableOpacity>
                
                <View style={styles.cardOverlay}>
                  <View style={styles.ratingRow}>
                    <Ionicons name="star" size={16} color="#F2B705" />
                    <Text style={styles.ratingText}>5.0</Text>
                  </View>
                  <View style={styles.infoRow}>
                    <Text style={styles.carName}>{item.name}</Text>
                    <Text style={styles.carPrice}>{formatPrice(item.price)}</Text>
                  </View>
                </View>
              </TouchableOpacity>
            ))
          )}
        </View>

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
    paddingHorizontal: 20,
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
    gap: 20,
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
  card: {
    width: '100%',
    height: 180,
    borderRadius: 25,
    backgroundColor: '#F5F5F5',
    overflow: 'hidden',
  },
  cardImage: {
    width: '100%',
    height: '100%',
  },
  heartBtn: {
    position: 'absolute',
    top: 15,
    right: 15,
    backgroundColor: 'white',
    width: 45,
    height: 45,
    borderRadius: 22.5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 20,
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    marginBottom: 5,
  },
  ratingText: {
    color: 'white',
    fontSize: 14,
    fontFamily: 'OpenSans_600SemiBold',
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  carName: {
    color: 'white',
    fontSize: 18,
    fontFamily: 'OpenSans_700Bold',
  },
  carPrice: {
    color: 'white',
    fontSize: 18,
    fontFamily: 'OpenSans_700Bold',
  },
});
