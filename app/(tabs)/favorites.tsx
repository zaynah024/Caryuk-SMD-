import React from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

const FAVORITES = [
  {
    id: '1',
    name: 'Nissan Skyline 90s',
    price: '$90k',
    rating: '5.0',
    image: 'https://images.unsplash.com/photo-1580273916550-e323be2ae537?q=80&w=1000&auto=format&fit=crop',
  },
  {
    id: '2',
    name: 'Mazda RX-7',
    price: '$90k',
    rating: '5.0',
    image: 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?q=80&w=1000&auto=format&fit=crop',
  },
  {
    id: '3',
    name: 'Mustang Valentine',
    price: '$90k',
    rating: '5.0',
    image: 'https://images.unsplash.com/photo-1584345604482-81317384c450?q=80&w=1000&auto=format&fit=crop',
  },
];

export default function FavoritesScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()}>
            <Ionicons name="chevron-back" size={24} color="black" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Favorites</Text>
          <TouchableOpacity>
            <Ionicons name="ellipsis-vertical" size={24} color="black" />
          </TouchableOpacity>
        </View>

        {/* Favorites List */}
        <View style={styles.list}>
          {FAVORITES.map((item) => (
            <TouchableOpacity 
              key={item.id} 
              style={styles.card}
              onPress={() => router.push('/car-detail')}
            >
              <Image source={{ uri: item.image }} style={styles.cardImage} />
              <TouchableOpacity style={styles.heartBtn}>
                <Ionicons name="heart" size={24} color="#FF4B4B" />
              </TouchableOpacity>
              
              <View style={styles.cardOverlay}>
                <View style={styles.ratingRow}>
                  <Ionicons name="star" size={16} color="#F2B705" />
                  <Text style={styles.ratingText}>{item.rating}</Text>
                </View>
                <View style={styles.infoRow}>
                  <Text style={styles.carName}>{item.name}</Text>
                  <Text style={styles.carPrice}>{item.price}</Text>
                </View>
              </View>
            </TouchableOpacity>
          ))}
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
  headerTitle: {
    fontSize: 20,
    fontFamily: 'OpenSans_700Bold',
  },
  list: {
    gap: 20,
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
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  cardOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 20,
    backgroundColor: 'rgba(0,0,0,0.1)',
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
