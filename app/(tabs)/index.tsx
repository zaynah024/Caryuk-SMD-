import React, { useState } from 'react';
import { StyleSheet, Text, View, ScrollView, TextInput, Image, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

const BUDGET_CATEGORIES = [
  { id: '1', label: 'Under $30k' },
  { id: '2', label: 'From $40k-90k' },
  { id: '3', label: 'Luxury' },
];

const RECOMMENDATIONS = [
  {
    id: '1',
    name: 'Nissan Skyline 90s',
    style: 'Maroon Style',
    price: '$90k',
    image: 'https://images.unsplash.com/photo-1580273916550-e323be2ae537?q=80&w=1000&auto=format&fit=crop',
    liked: true,
  },
  {
    id: '2',
    name: 'Mustang Valentine',
    style: 'Red Style',
    price: '$80k',
    image: 'https://images.unsplash.com/photo-1584345604482-81317384c450?q=80&w=1000&auto=format&fit=crop',
    liked: false,
  },
  {
    id: '3',
    name: 'Mazda RX7',
    style: 'Yellow Style',
    price: '$85k',
    image: 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?q=80&w=1000&auto=format&fit=crop',
    liked: false,
  }
];

export default function HomeScreen() {
  const router = useRouter();
  const [activeCategoryId, setActiveCategoryId] = useState('2');
  const [searchQuery, setSearchQuery] = useState('');

  const handleMenuPress = () => {
    Alert.alert('Menu', 'Side menu coming soon!');
  };

  const handleSearchSubmit = () => {
    if (searchQuery.trim()) {
      router.push({ pathname: '/(tabs)/search', params: { q: searchQuery } });
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <TouchableOpacity style={styles.iconBtn} onPress={handleMenuPress}>
              <Ionicons name="menu" size={24} color="black" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.iconBtn} onPress={() => Alert.alert('Notifications', 'No new notifications')}>
              <Ionicons name="notifications-outline" size={24} color="black" />
            </TouchableOpacity>
          </View>
          <View style={styles.headerRight}>
            <View style={styles.userTextContainer}>
              <Text style={styles.userName}>Justin Kayla</Text>
              <View style={styles.locationContainer}>
                <Ionicons name="location" size={12} color="#F2B705" />
                <Text style={styles.locationText}>Semarang, Indonesia</Text>
              </View>
            </View>
            <View style={styles.avatarPlaceholder} />
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
              returnKeyType="search"
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
          <Text style={styles.sectionTitle}>Recommendation For You</Text>
          <TouchableOpacity><Text style={styles.seeAll}>View all</Text></TouchableOpacity>
        </View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.recommendationScroll}>
          {RECOMMENDATIONS.map((item) => (
            <TouchableOpacity 
              key={item.id} 
              style={styles.carCard}
              onPress={() => router.push('/car-detail')}
            >
              <Image source={{ uri: item.image }} style={styles.carImage} />
              <TouchableOpacity style={styles.likeBtn}>
                <Ionicons name={item.liked ? "heart" : "heart-outline"} size={20} color={item.liked ? "#FF4B4B" : "white"} />
              </TouchableOpacity>
              <TouchableOpacity style={styles.arrowBtn}>
                <Ionicons name="arrow-forward" size={16} color="white" />
              </TouchableOpacity>
              <View style={styles.carInfo}>
                <Text style={styles.carName}>{item.name}</Text>
                <Text style={styles.carStyle}>{item.style}</Text>
                <Text style={styles.carPrice}>{item.price}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Promo Banner */}
        <View style={styles.promoBanner}>
          <Text style={styles.promoText}>Get <Text style={styles.promoHighlight}>discount</Text> in 50%</Text>
          <View style={styles.dots}>
            <View style={styles.dot} />
            <View style={[styles.dot, styles.activeDot]} />
            <View style={styles.dot} />
          </View>
        </View>

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
  promoBanner: {
    backgroundColor: '#E0E0E0',
    height: 140,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  promoText: {
    fontSize: 22,
    color: 'white',
    fontFamily: 'OpenSans_700Bold',
  },
  promoHighlight: {
    textDecorationLine: 'underline',
  },
  dots: {
    flexDirection: 'row',
    marginTop: 15,
    gap: 5,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: 'white',
    opacity: 0.5,
  },
  activeDot: {
    width: 20,
    opacity: 1,
    backgroundColor: '#F2B705',
  },
});
