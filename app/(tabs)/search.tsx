import React from 'react';
import { StyleSheet, Text, View, ScrollView, TextInput, TouchableOpacity, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

const HISTORY = [
  'Nissan GTR', 'Toyota Scar', 'Toyota Supra', 'Mazda RX-7', 'Supra MK4', 'Lancer Tokyo'
];

const POPULAR_PRODUCTS = [
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
    name: 'Mazda RX7',
    style: 'Yellow Style',
    price: '$85k',
    image: 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?q=80&w=1000&auto=format&fit=crop',
    liked: true,
  },
  {
    id: '3',
    name: 'Lancer Evo',
    style: 'Red Style',
    price: '$75k',
    image: 'https://images.unsplash.com/photo-1603386329225-868f9b1ee6c9?q=80&w=1000&auto=format&fit=crop',
    liked: false,
  }
];

export default function SearchScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity>
            <Ionicons name="chevron-back" size={24} color="black" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Search</Text>
          <TouchableOpacity>
            <Ionicons name="ellipsis-vertical" size={24} color="black" />
          </TouchableOpacity>
        </View>

        {/* Promo Banner Top */}
        <View style={styles.promoBanner}>
          <Text style={styles.promoText}>Flash sale in <Text style={styles.promoHighlight}>today 50%.</Text></Text>
          <View style={styles.dots}>
            <View style={styles.dot} />
            <View style={[styles.dot, styles.activeDot]} />
            <View style={styles.dot} />
            <View style={styles.dot} />
          </View>
        </View>

        {/* Search Bar */}
        <View style={styles.searchSection}>
          <View style={styles.searchContainer}>
            <Ionicons name="search" size={20} color="#999" />
            <TextInput style={styles.searchInput} placeholder="Search your favorites car" placeholderTextColor="#999" />
            <TouchableOpacity>
              <Ionicons name="options-outline" size={20} color="#999" />
            </TouchableOpacity>
          </View>
        </View>

        {/* History */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>History</Text>
          <TouchableOpacity><Ionicons name="trash-outline" size={20} color="black" /></TouchableOpacity>
        </View>
        <View style={styles.historyGrid}>
          {HISTORY.map((item, index) => (
            <View key={index} style={styles.historyChip}>
              <Text style={styles.historyText}>{item}</Text>
            </View>
          ))}
        </View>

        {/* Popular Product */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Popular Product</Text>
          <TouchableOpacity><Text style={styles.seeAll}>View all</Text></TouchableOpacity>
        </View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.popularScroll}>
          {POPULAR_PRODUCTS.map((item) => (
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
  promoBanner: {
    backgroundColor: '#E0E0E0',
    height: 140,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 25,
  },
  promoText: {
    fontSize: 20,
    color: 'white',
    fontFamily: 'OpenSans_700Bold',
    textAlign: 'center',
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
  popularScroll: {
    marginBottom: 25,
  },
  carCard: {
    width: 180,
    marginRight: 15,
    borderRadius: 20,
  },
  carImage: {
    width: '100%',
    height: 160,
    borderRadius: 20,
    backgroundColor: '#F5F5F5',
  },
  likeBtn: {
    position: 'absolute',
    top: 15,
    right: 15,
  },
  arrowBtn: {
    position: 'absolute',
    bottom: 85,
    right: 15,
    width: 24,
    height: 24,
    backgroundColor: 'rgba(255,255,255,0.3)',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  carInfo: {
    marginTop: 10,
  },
  carName: {
    fontSize: 14,
    fontFamily: 'OpenSans_700Bold',
  },
  carStyle: {
    fontSize: 12,
    color: '#999',
  },
  carPrice: {
    fontSize: 14,
    fontFamily: 'OpenSans_700Bold',
  },
  seeAll: {
    fontSize: 14,
    color: '#999',
  },
});
