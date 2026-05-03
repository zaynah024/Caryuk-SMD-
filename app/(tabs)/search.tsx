import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, ScrollView, TextInput, TouchableOpacity, Image, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { collection, onSnapshot, query, where, doc, setDoc, updateDoc } from 'firebase/firestore';
import { db } from '../../config/firebase';
import { useAuth } from '../../context/AuthContext';

export default function SearchScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const { user, profile, toggleFavorite } = useAuth();
  const [searchQuery, setSearchQuery] = useState((params.q as string) || '');
  
  const history = profile?.searchHistory || [];

  const handleSearchSubmit = async (term: string) => {
    const termClean = term.trim();
    if (!termClean || !user) return;
    
    // Remove duplicates and keep top 5
    let newHistory = history.filter((item: string) => item.toLowerCase() !== termClean.toLowerCase());
    newHistory.unshift(termClean);
    newHistory = newHistory.slice(0, 5);

    try {
      await setDoc(doc(db, 'users', user.uid), { searchHistory: newHistory }, { merge: true });
    } catch (e) {
      console.error("Error saving history:", e);
    }
  };
  const [cars, setCars] = useState<any[]>([]);
  const [filteredCars, setFilteredCars] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Sync searchQuery with params if they change (e.g. navigating from Home)
  useEffect(() => {
    if (params.q) {
      setSearchQuery(params.q as string);
    }
  }, [params.q]);

  // Fetch all cars to search through
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

  // Filter cars whenever searchQuery or the car list changes
  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredCars(cars.slice(0, 5)); // Show a few popular ones by default
    } else {
      const filtered = cars.filter(car => 
        car.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        car.style?.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredCars(filtered);
    }
  }, [searchQuery, cars]);

  const formatPrice = (price: number) => {
    return `$${(price / 1000).toFixed(0)}k`;
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.push('/')}>
            <Ionicons name="chevron-back" size={24} color="black" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Search</Text>
          <TouchableOpacity>
            <Ionicons name="ellipsis-vertical" size={24} color="black" />
          </TouchableOpacity>
        </View>

        {/* Search Exclusive Banner */}
        <TouchableOpacity style={styles.promoBannerMain}>
          <Image 
            source={{ uri: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?q=80&w=1000' }} 
            style={styles.promoImage} 
          />
          <View style={styles.promoOverlayDark}>
            <View style={[styles.promoBadge, { backgroundColor: '#F2B705' }]}>
              <Text style={[styles.promoBadgeText, { color: 'black' }]}>SEARCH EXCLUSIVE</Text>
            </View>
            <Text style={styles.promoTitle}>New Arrival Sale!</Text>
            <Text style={styles.promoSubtitle}>Discover limited edition models today</Text>
            <TouchableOpacity style={styles.promoBtn}>
              <Text style={styles.promoBtnText}>View Catalog</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>

        {/* Search Bar */}
        <View style={styles.searchSection}>
          <View style={styles.searchContainer}>
            <Ionicons name="search" size={20} color="#999" />
            <TextInput 
              style={styles.searchInput} 
              placeholder="Search your favorites car" 
              placeholderTextColor="#999"
              value={searchQuery}
              onChangeText={setSearchQuery}
              onSubmitEditing={() => handleSearchSubmit(searchQuery)}
              returnKeyType="search"
              autoFocus={params.q ? false : true}
            />
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <Ionicons name={searchQuery ? "close-circle" : "options-outline"} size={20} color="#999" />
            </TouchableOpacity>
          </View>
        </View>

        {/* History */}
        {!searchQuery && (
          <>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>History</Text>
              <TouchableOpacity onPress={async () => {
                if (user) {
                  await setDoc(doc(db, 'users', user.uid), { searchHistory: [] }, { merge: true });
                }
              }}>
                <Ionicons name="trash-outline" size={20} color="black" />
              </TouchableOpacity>
            </View>
            <View style={styles.historyGrid}>
              {history.map((item: string, index: number) => (
                <TouchableOpacity key={index} style={styles.historyChip} onPress={() => {
                  setSearchQuery(item);
                  handleSearchSubmit(item);
                }}>
                  <Text style={styles.historyText}>{item}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </>
        )}

        {/* Search Results / Popular Products */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>{searchQuery ? 'Search Results' : 'Popular Product'}</Text>
          <TouchableOpacity><Text style={styles.seeAll}>View all</Text></TouchableOpacity>
        </View>

        {loading ? (
          <ActivityIndicator color="#F2B705" size="large" style={{ marginTop: 20 }} />
        ) : filteredCars.length === 0 ? (
          <View style={styles.emptyState}>
            <Ionicons name="search-outline" size={50} color="#E0E0E0" />
            <Text style={styles.emptyText}>No cars found matching "{searchQuery}"</Text>
          </View>
        ) : (
          <View style={styles.resultsGrid}>
            {filteredCars.map((item) => {
              const isFavorited = profile?.favorites?.includes(item.id);
              return (
                <TouchableOpacity 
                  key={item.id} 
                  style={styles.carCard}
                  onPress={() => router.push(`/car-detail?id=${item.id}`)}
                >
                  <Image source={{ uri: item.image }} style={styles.carImage} />
                  <TouchableOpacity 
                    style={styles.likeBtn}
                    onPress={(e) => {
                      e.stopPropagation();
                      toggleFavorite(item.id);
                    }}
                  >
                    <Ionicons name={isFavorited ? "heart" : "heart-outline"} size={20} color={isFavorited ? "#FF4B4B" : "white"} />
                  </TouchableOpacity>
                  <View style={styles.carInfo}>
                    <Text style={styles.carName}>{item.name}</Text>
                    <Text style={styles.carStyle}>{item.style || 'Standard'}</Text>
                    <Text style={styles.carPrice}>{formatPrice(item.price)}</Text>
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>
        )}

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
  promoBannerMain: {
    height: 160,
    borderRadius: 25,
    overflow: 'hidden',
    marginBottom: 25,
  },
  promoImage: {
    width: '100%',
    height: '100%',
    position: 'absolute',
  },
  promoOverlayDark: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    padding: 20,
    justifyContent: 'center',
  },
  promoBadge: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 5,
    alignSelf: 'flex-start',
    marginBottom: 10,
  },
  promoBadgeText: {
    color: 'white',
    fontSize: 10,
    fontFamily: 'OpenSans_800ExtraBold',
  },
  promoTitle: {
    fontSize: 24,
    color: 'white',
    fontFamily: 'OpenSans_800ExtraBold',
  },
  promoSubtitle: {
    fontSize: 12,
    color: '#DDD',
    fontFamily: 'OpenSans_400Regular',
    marginTop: 2,
  },
  promoBtn: {
    backgroundColor: '#F2B705',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 10,
    alignSelf: 'flex-start',
    marginTop: 15,
  },
  promoBtnText: {
    color: 'white',
    fontSize: 12,
    fontFamily: 'OpenSans_700Bold',
  },
  searchSection: {
    marginBottom: 25,
  },
  searchContainer: {
    flexDirection: 'row',
    backgroundColor: '#F5F5F5',
    height: 55,
    borderRadius: 25,
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  searchInput: {
    flex: 1,
    marginLeft: 10,
    fontSize: 14,
    fontFamily: 'OpenSans_400Regular',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: 'OpenSans_700Bold',
  },
  historyGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 25,
  },
  historyChip: {
    paddingHorizontal: 15,
    paddingVertical: 10,
    backgroundColor: '#F5F5F5',
    borderRadius: 20,
  },
  historyText: {
    fontSize: 12,
    color: '#999',
    fontFamily: 'OpenSans_600SemiBold',
  },
  resultsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 15,
  },
  carCard: {
    width: '47%',
    marginBottom: 15,
    borderRadius: 20,
  },
  carImage: {
    width: '100%',
    height: 150,
    borderRadius: 20,
    backgroundColor: '#F5F5F5',
  },
  likeBtn: {
    position: 'absolute',
    top: 10,
    right: 10,
  },
  carInfo: {
    marginTop: 10,
  },
  carName: {
    fontSize: 14,
    fontFamily: 'OpenSans_700Bold',
  },
  carStyle: {
    fontSize: 11,
    color: '#999',
    marginVertical: 2,
    fontFamily: 'OpenSans_400Regular',
  },
  carPrice: {
    fontSize: 14,
    fontFamily: 'OpenSans_700Bold',
  },
  seeAll: {
    fontSize: 14,
    color: '#999',
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyText: {
    marginTop: 10,
    color: '#999',
    fontFamily: 'OpenSans_400Regular',
  },
});
