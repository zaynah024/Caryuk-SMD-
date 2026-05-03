import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, ScrollView, TextInput, Image, TouchableOpacity, Alert, ActivityIndicator, Modal, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { collection, query, where, onSnapshot, doc, getDoc } from 'firebase/firestore';
import { db, auth } from '../../config/firebase';
import { useAuth } from '../../context/AuthContext';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const BUDGET_CATEGORIES = [
  { id: 'all', label: 'All Cars' },
  { id: 'low', label: 'Under $30k' },
  { id: 'mid', label: 'From $40k-90k' },
  { id: 'high', label: 'Luxury' },
];

export default function HomeScreen() {
  const router = useRouter();
  const { user, profile, toggleFavorite } = useAuth();
  const [cars, setCars] = useState<any[]>([]);
  const [filteredCars, setFilteredCars] = useState<any[]>([]);
  const [activeCategoryId, setActiveCategoryId] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [menuVisible, setMenuVisible] = useState(false);

  // Fetch Cars from Firestore
  useEffect(() => {
    const carsRef = collection(db, 'cars');
    const unsubscribe = onSnapshot(carsRef, (snapshot) => {
      const carsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setCars(carsData);
      setLoading(false);
    }, (error) => {
      console.error("Error fetching cars:", error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Filter Cars based on Budget Category
  useEffect(() => {
    let filtered = [...cars];
    if (activeCategoryId === 'low') {
      filtered = cars.filter(car => car.price <= 30000);
    } else if (activeCategoryId === 'mid') {
      filtered = cars.filter(car => car.price >= 40000 && car.price <= 90000);
    } else if (activeCategoryId === 'high') {
      filtered = cars.filter(car => car.price > 90000);
    }
    setFilteredCars(filtered);
  }, [activeCategoryId, cars]);

  const handleSearchSubmit = () => {
    router.navigate({
      pathname: '/(tabs)/search',
      params: { q: searchQuery }
    });
  };

  const formatPrice = (price: number) => {
    return `$${(price / 1000).toFixed(0)}k`;
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
          <View style={styles.headerLeft}>
            <TouchableOpacity style={styles.iconBtn} onPress={() => setMenuVisible(true)}>
              <Ionicons name="menu" size={24} color="black" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.iconBtn} onPress={() => router.push('/cart')}>
              <Ionicons name="cart-outline" size={24} color="black" />
              {profile?.cart && profile.cart.length > 0 && (
                <View style={styles.cartBadge}>
                  <Text style={styles.cartBadgeText}>{profile.cart.length}</Text>
                </View>
              )}
            </TouchableOpacity>
          </View>
          <View style={styles.headerRight}>
            <View style={styles.userTextContainer}>
              <Text style={styles.userName}>{profile?.fullName || 'User'}</Text>
              <View style={styles.locationContainer}>
                <Ionicons name="location" size={12} color="#F2B705" />
                <Text style={styles.locationText}>Semarang, Indonesia</Text>
              </View>
            </View>
            {profile?.profileImage ? (
              <Image source={{ uri: profile.profileImage }} style={styles.avatarImage} />
            ) : (
              <View style={styles.avatarPlaceholder} />
            )}
          </View>
        </View>

        {/* Search Bar */}
        <View style={styles.searchSection}>
          <View style={styles.searchContainer}>
            <Ionicons name="search" size={20} color="#999" />
            <TextInput 
              style={styles.searchInput} 
              placeholder="Search your favorite car" 
              placeholderTextColor="#999"
              value={searchQuery}
              onChangeText={setSearchQuery}
              onSubmitEditing={handleSearchSubmit}
              onFocus={() => {
                // If the user clicks the search bar, we switch to the search tab
                router.push('/(tabs)/search');
              }}
            />
            <TouchableOpacity onPress={() => router.push('/(tabs)/search')}>
              <Ionicons name="options-outline" size={20} color="#999" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Budget Category */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Budget Category</Text>
          <TouchableOpacity><Text style={styles.seeAll}>See all</Text></TouchableOpacity>
        </View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoryScroll}>
          {BUDGET_CATEGORIES.map((item) => (
            <TouchableOpacity 
              key={item.id} 
              style={[
                styles.categoryChip, 
                activeCategoryId === item.id && styles.activeCategoryChip
              ]}
              onPress={() => setActiveCategoryId(item.id)}
            >
              <Text style={[
                styles.categoryText, 
                activeCategoryId === item.id && styles.activeCategoryText
              ]}>
                {item.label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Recommendations */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>
            {activeCategoryId === 'all' ? 'Recommendation For You' : `${BUDGET_CATEGORIES.find(c => c.id === activeCategoryId)?.label} Cars`}
          </Text>
          <TouchableOpacity onPress={() => router.push('/all-cars')}>
            <Text style={styles.seeAll}>View all</Text>
          </TouchableOpacity>
        </View>

        {filteredCars.length === 0 ? (
          <View style={styles.emptyState}>
            <Ionicons name="car-outline" size={60} color="#E0E0E0" />
            <Text style={styles.emptyText}>No cars found in this budget.</Text>
          </View>
        ) : (
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.recommendationScroll}>
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
                  <View style={styles.arrowBtn}>
                    <Ionicons name="arrow-forward" size={16} color="white" />
                  </View>
                  <View style={styles.carInfo}>
                    <Text style={styles.carName}>{item.name}</Text>
                    <Text style={styles.carStyle}>{item.style || 'Default Style'}</Text>
                    <Text style={styles.carPrice}>{formatPrice(item.price)}</Text>
                  </View>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        )}

        {/* Discount Banner */}
        <TouchableOpacity style={styles.promoBannerMain}>
          <Image 
            source={{ uri: 'https://images.unsplash.com/photo-1614200187524-dc4b892acf16?q=80&w=1000' }} 
            style={styles.promoImage} 
          />
          <View style={styles.promoOverlayBlue}>
            <View style={styles.promoBadge}>
              <Text style={styles.promoBadgeText}>LIMITED TIME</Text>
            </View>
            <Text style={styles.promoTitle}>Get <Text style={styles.promoHighlightText}>Discount</Text>{"\n"}up to 50%</Text>
            <TouchableOpacity style={styles.promoBtn}>
              <Text style={styles.promoBtnText}>Claim Now</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>

        {/* Flash Sale Banner */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Flash Sale</Text>
          <TouchableOpacity><Text style={styles.seeAll}>See all</Text></TouchableOpacity>
        </View>
        
        <TouchableOpacity style={styles.promoBannerSecondary}>
          <Image 
            source={{ uri: 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?q=80&w=1000' }} 
            style={styles.promoImage} 
          />
          <View style={styles.promoOverlayDark}>
            <View style={[styles.promoBadge, { backgroundColor: '#F2B705' }]}>
              <Text style={[styles.promoBadgeText, { color: 'black' }]}>HOT DEAL</Text>
            </View>
            <Text style={styles.promoTitleSecondary}>Flash Sale Today!</Text>
            <Text style={styles.promoSubtitle}>Exclusive deals on classic muscle</Text>
            <View style={styles.timerRow}>
              <Ionicons name="time-outline" size={16} color="#F2B705" />
              <Text style={styles.timerText}>Ends in 02:45:12</Text>
            </View>
          </View>
        </TouchableOpacity>

        <View style={{ height: 100 }} />
      </ScrollView>

      {/* Hamburger Menu Modal */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={menuVisible}
        onRequestClose={() => setMenuVisible(false)}
      >
        <TouchableOpacity 
          style={styles.modalOverlay} 
          activeOpacity={1} 
          onPress={() => setMenuVisible(false)}
        >
          <View style={styles.menuContent}>
            <View style={styles.menuHeader}>
              {profile?.profileImage ? (
                <Image source={{ uri: profile.profileImage }} style={styles.menuAvatarImage} />
              ) : (
                <View style={styles.menuAvatar} />
              )}
              <Text style={styles.menuUserName}>{profile?.fullName || 'User'}</Text>
              {profile?.phone ? <Text style={styles.menuUserPhone}>{profile.phone}</Text> : null}
            </View>
            
            <TouchableOpacity style={styles.menuItem} onPress={() => { setMenuVisible(false); router.push('/(tabs)/profile'); }}>
              <Ionicons name="person-outline" size={22} color="black" />
              <Text style={styles.menuItemText}>My Profile</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.menuItem} onPress={() => { setMenuVisible(false); router.push('/favorites'); }}>
              <Ionicons name="heart-outline" size={22} color="black" />
              <Text style={styles.menuItemText}>Favorites</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.menuItem} onPress={() => { setMenuVisible(false); router.push('/settings'); }}>
              <Ionicons name="settings-outline" size={22} color="black" />
              <Text style={styles.menuItemText}>Settings</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.menuItem} onPress={() => { setMenuVisible(false); auth.signOut(); }}>
              <Ionicons name="log-out-outline" size={22} color="#FF4B4B" />
              <Text style={[styles.menuItemText, { color: '#FF4B4B' }]}>Logout</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
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
    paddingHorizontal: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 25,
  },
  headerLeft: {
    flexDirection: 'row',
    gap: 15,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  userTextContainer: {
    alignItems: 'flex-end',
  },
  userName: {
    fontSize: 18,
    fontFamily: 'OpenSans_700Bold',
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  locationText: {
    fontSize: 12,
    color: '#F2B705',
    fontFamily: 'OpenSans_400Regular',
  },
  avatarPlaceholder: {
    width: 45,
    height: 45,
    borderRadius: 22.5,
    backgroundColor: '#E0E0E0',
  },
  avatarImage: {
    width: 45,
    height: 45,
    borderRadius: 22.5,
  },
  menuAvatarImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginBottom: 15,
  },
  menuUserPhone: {
    fontSize: 14,
    color: '#999',
    marginTop: 2,
    fontFamily: 'OpenSans_400Regular',
  },
  iconBtn: {
    width: 40,
    height: 40,
    justifyContent: 'center',
  },
  searchSection: {
    marginBottom: 25,
  },
  searchContainer: {
    flexDirection: 'row',
    backgroundColor: '#F5F5F5',
    height: 55,
    borderRadius: 15,
    alignItems: 'center',
    paddingHorizontal: 15,
  },
  searchInput: {
    flex: 1,
    marginLeft: 10,
    fontSize: 16,
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
  seeAll: {
    fontSize: 14,
    color: '#999',
    fontFamily: 'OpenSans_600SemiBold',
  },
  categoryScroll: {
    marginBottom: 25,
  },
  categoryChip: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    backgroundColor: '#F5F5F5',
    borderRadius: 15,
    marginRight: 10,
  },
  activeCategoryChip: {
    backgroundColor: '#F2B705',
  },
  categoryText: {
    fontSize: 14,
    color: '#999',
    fontFamily: 'OpenSans_600SemiBold',
  },
  activeCategoryText: {
    color: 'white',
  },
  recommendationScroll: {
    marginBottom: 25,
  },
  carCard: {
    width: 200,
    marginRight: 15,
    borderRadius: 20,
    backgroundColor: 'transparent',
    overflow: 'hidden',
  },
  carImage: {
    width: '100%',
    height: 180,
    borderRadius: 20,
    backgroundColor: '#F5F5F5',
  },
  likeBtn: {
    position: 'absolute',
    top: 15,
    right: 15,
    zIndex: 3,
  },
  arrowBtn: {
    position: 'absolute',
    bottom: 95,
    right: 15,
    width: 24,
    height: 24,
    backgroundColor: 'rgba(255,255,255,0.3)',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 3,
  },
  carInfo: {
    marginTop: 10,
  },
  carName: {
    fontSize: 16,
    fontFamily: 'OpenSans_700Bold',
  },
  carStyle: {
    fontSize: 12,
    color: '#999',
    marginVertical: 2,
    fontFamily: 'OpenSans_400Regular',
  },
  carPrice: {
    fontSize: 16,
    fontFamily: 'OpenSans_700Bold',
  },
  promoBannerMain: {
    height: 160,
    borderRadius: 25,
    overflow: 'hidden',
    marginBottom: 30,
  },
  promoBannerSecondary: {
    height: 180,
    borderRadius: 25,
    overflow: 'hidden',
    marginBottom: 20,
  },
  promoImage: {
    width: '100%',
    height: '100%',
    position: 'absolute',
  },
  promoOverlayBlue: {
    flex: 1,
    backgroundColor: 'rgba(10, 10, 58, 0.6)',
    padding: 20,
    justifyContent: 'center',
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
    fontSize: 22,
    color: 'white',
    fontFamily: 'OpenSans_800ExtraBold',
    lineHeight: 28,
  },
  promoTitleSecondary: {
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
  promoHighlightText: {
    color: '#F2B705',
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
  timerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    marginTop: 15,
  },
  timerText: {
    color: '#F2B705',
    fontSize: 14,
    fontFamily: 'OpenSans_700Bold',
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
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  menuContent: {
    width: SCREEN_WIDTH * 0.7,
    height: '100%',
    backgroundColor: 'white',
    padding: 30,
    paddingTop: 60,
  },
  menuHeader: {
    alignItems: 'center',
    marginBottom: 40,
    borderBottomWidth: 1,
    borderBottomColor: '#F5F5F5',
    paddingBottom: 20,
  },
  menuAvatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#F2B705',
    marginBottom: 15,
  },
  menuUserName: {
    fontSize: 20,
    fontFamily: 'OpenSans_700Bold',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 15,
    paddingVertical: 15,
  },
  menuItemText: {
    fontSize: 16,
    fontFamily: 'OpenSans_600SemiBold',
  },
  cartBadge: {
    position: 'absolute',
    top: -5,
    right: -5,
    backgroundColor: '#FF4B4B',
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 5,
    borderWidth: 2,
    borderColor: 'white',
  },
  cartBadgeText: {
    color: 'white',
    fontSize: 10,
    fontFamily: 'OpenSans_800ExtraBold',
  },
});
