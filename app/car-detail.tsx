import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { doc, getDoc } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Dimensions, Image, Linking, Modal, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { db } from '../config/firebase';
import { useAuth } from '../context/AuthContext';

const { width } = Dimensions.get('window');

const TABS = ['Description', 'Features', 'Vehicle Info'];

export default function CarDetailScreen() {
  const [activeTab, setActiveTab] = useState('Description');
  const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);
  const [car, setCar] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const { profile, toggleFavorite, toggleCart } = useAuth();
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    async function fetchCarDetails() {
      if (!id) return;
      try {
        const carDoc = await getDoc(doc(db, 'cars', id as string));
        if (carDoc.exists()) {
          setCar({ id: carDoc.id, ...carDoc.data() });
        }
      } catch (error) {
        console.error("Error fetching car details:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchCarDetails();
  }, [id]);

  const handleCall = () => {
    if (car?.sellerPhone) {
      Linking.openURL(`tel:${car.sellerPhone}`);
    }
  };

  const handleAddToCart = async () => {
    await toggleCart(car.id);
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 2000);
  };

  const formatPrice = (price: number) => {
    return `$${(price / 1000).toFixed(0)}K`;
  };

  const isFavorited = car && profile?.favorites?.includes(car.id);
  const isInCart = car && profile?.cart?.includes(car.id);

  const SPECS = [
    { id: '1', label: '5000km', icon: 'speedometer' },
    { id: '2', label: '2 Seat', icon: 'people' },
    { id: '3', label: 'Gasoline', icon: 'flashlight' },
    { id: '4', label: 'Manual', icon: 'git-branch' },
  ];

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'white' }}>
        <ActivityIndicator size="large" color="#F2B705" />
      </View>
    );
  }

  if (!car) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'white' }}>
        <Text style={{ fontFamily: 'OpenSans_700Bold' }}>Car not found</Text>
        <TouchableOpacity onPress={() => router.back()} style={{ marginTop: 20 }}>
          <Text style={{ color: '#F2B705' }}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()}>
            <Ionicons name="chevron-back" size={24} color="black" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Car Detail</Text>
          <TouchableOpacity>
            <Ionicons name="chatbubble-ellipses" size={24} color="black" />
          </TouchableOpacity>
        </View>

        {/* Main Image Section */}
        <View style={styles.imageSection}>
          <Image source={{ uri: car.image }} style={styles.mainImage} />
          <View style={styles.imageOverlay}>
            <TouchableOpacity style={styles.iconBtn}>
              <Ionicons name="share-social-outline" size={20} color="#666" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.iconBtn} onPress={() => toggleFavorite(car.id)}>
              <Ionicons name={isFavorited ? "heart" : "heart-outline"} size={20} color={isFavorited ? "#FF4B4B" : "#666"} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Car Info Header */}
        <View style={styles.infoSection}>
          <Text style={styles.categoryText}>{car.style || 'Sportscar'}</Text>
          <View style={styles.nameRow}>
            <Text style={styles.carName}>{car.name}</Text>
            <Text style={styles.carPrice}>{formatPrice(car.price)}</Text>
          </View>
          <View style={styles.ratingRow}>
            <Ionicons name="star" size={16} color="#F2B705" />
            <Text style={styles.ratingText}>5.0 (24 Reviews)</Text>
          </View>
        </View>

        {/* Quick Specs Icons */}
        <View style={styles.specsRow}>
          {SPECS.map((spec) => (
            <View key={spec.id} style={styles.specItem}>
              <View style={styles.specIconContainer}>
                <Ionicons name={spec.icon as any} size={20} color="white" />
              </View>
              <Text style={styles.specLabel}>{spec.label}</Text>
            </View>
          ))}
        </View>

        {/* Dynamic Tabs */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.tabsScroll}>
          {TABS.map((tab) => (
            <TouchableOpacity
              key={tab}
              style={[styles.tabChip, activeTab === tab && styles.activeTabChip]}
              onPress={() => setActiveTab(tab)}
            >
              <Text style={[styles.tabText, activeTab === tab && styles.activeTabText]}>{tab}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Dynamic Content Based on Tab */}
        <View style={styles.tabContentSection}>
          {activeTab === 'Description' && (
            <View>
              <Text style={styles.contentText} numberOfLines={isDescriptionExpanded ? undefined : 2}>
                {car.description || 'No description available for this vehicle.'}
              </Text>
              <TouchableOpacity onPress={() => setIsDescriptionExpanded(!isDescriptionExpanded)} style={{ marginTop: 5 }}>
                <Text style={styles.readMore}>
                  {isDescriptionExpanded ? 'Show Less' : 'Read More..'}
                </Text>
              </TouchableOpacity>
            </View>
          )}

          {activeTab === 'Features' && (
            <View style={styles.featuresGrid}>
              {car.features ? car.features.map((feature: string, idx: number) => (
                <View key={idx} style={styles.featureItem}>
                  <Ionicons name="checkmark-circle" size={18} color="#F2B705" />
                  <Text style={styles.featureText}>{feature}</Text>
                </View>
              )) : <Text style={styles.contentText}>No features listed.</Text>}
            </View>
          )}

          {activeTab === 'Vehicle Info' && (
            <View style={styles.infoList}>
              <Text style={styles.contentText}>{car.vehicleInfo || 'No technical info available.'}</Text>
              <View style={styles.infoDivider} />
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Condition</Text>
                <Text style={styles.infoValue}>Excellent</Text>
              </View>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Stock Status</Text>
                <Text style={styles.infoValue}>In Stock</Text>
              </View>
            </View>
          )}
        </View>

        {/* Seller Profile */}
        <View style={styles.ownerCard}>
          <View style={styles.ownerInfo}>
            <View style={styles.ownerAvatar}>
              <Text style={styles.avatarInitials}>{car.sellerName ? car.sellerName[0] : 'C'}</Text>
            </View>
            <View>
              <Text style={styles.ownerName}>{car.sellerName || 'Caryuk Seller'}</Text>
              <Text style={styles.ownerRole}>Verified Dealer</Text>
            </View>
          </View>
          <TouchableOpacity style={styles.callSellerBtn} onPress={handleCall}>
            <Ionicons name="call" size={20} color="white" />
            <Text style={styles.callSellerText}>Call Seller</Text>
          </TouchableOpacity>
        </View>

        {/* Bottom Actions */}
        <View style={styles.footer}>
          <TouchableOpacity style={styles.footerIconBtn} onPress={() => toggleFavorite(car.id)}>
            <Ionicons name="heart" size={24} color={isFavorited ? "#FF4B4B" : "#666"} />
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.footerIconBtn, { marginLeft: 10, backgroundColor: isInCart ? '#F2B705' : '#F5F5F5' }]}
            onPress={handleAddToCart}
          >
            <Ionicons name="cart-outline" size={24} color={isInCart ? "white" : "#666"} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.checkoutBtn} onPress={() => router.push(`/payment?id=${car.id}`)}>
            <Text style={styles.checkoutBtnText}>Checkout Now</Text>
          </TouchableOpacity>
        </View>

        <View style={{ height: 100 }} />
      </ScrollView>

      {/* Success Modal */}
      <Modal transparent visible={showSuccess} animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalIconContainer}>
              <Ionicons name="checkmark" size={50} color="#F2B705" />
            </View>
            <Text style={styles.modalTitle}>Success!</Text>
            <Text style={styles.modalMessage}>Car successfully added to your cart.</Text>
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
    paddingHorizontal: 20,
    paddingBottom: 30,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 20,
  },
  headerTitle: {
    fontSize: 20,
    fontFamily: 'OpenSans_700Bold',
  },
  imageSection: {
    width: '100%',
    height: 250,
    borderRadius: 30,
    backgroundColor: '#F5F5F5',
    marginBottom: 20,
    overflow: 'hidden',
  },
  mainImage: {
    width: '100%',
    height: '100%',
  },
  imageOverlay: {
    position: 'absolute',
    top: 20,
    right: 20,
    flexDirection: 'row',
    gap: 10,
  },
  iconBtn: {
    width: 40,
    height: 40,
    backgroundColor: 'rgba(255,255,255,0.8)',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  infoSection: {
    marginBottom: 20,
  },
  categoryText: {
    color: '#F2B705',
    fontSize: 14,
    fontFamily: 'OpenSans_600SemiBold',
    marginBottom: 5,
  },
  nameRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 5,
  },
  carName: {
    fontSize: 24,
    fontFamily: 'OpenSans_800ExtraBold',
  },
  carPrice: {
    fontSize: 24,
    fontFamily: 'OpenSans_800ExtraBold',
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  ratingText: {
    fontSize: 14,
    color: '#666',
  },
  specsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 25,
  },
  specItem: {
    alignItems: 'center',
    gap: 8,
  },
  specIconContainer: {
    width: 45,
    height: 45,
    backgroundColor: '#F2B705',
    borderRadius: 22.5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  specLabel: {
    fontSize: 12,
    fontFamily: 'OpenSans_700Bold',
  },
  tabsScroll: {
    marginBottom: 20,
  },
  tabChip: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 20,
    backgroundColor: '#F5F5F5',
    marginRight: 10,
  },
  activeTabChip: {
    backgroundColor: '#F2B705',
  },
  tabText: {
    color: '#666',
    fontFamily: 'OpenSans_700Bold',
  },
  activeTabText: {
    color: 'white',
  },
  tabContentSection: {
    marginBottom: 30,
    minHeight: 100,
  },
  contentText: {
    fontSize: 14,
    color: '#666',
    lineHeight: 22,
  },
  readMore: {
    color: '#F2B705',
    fontFamily: 'OpenSans_700Bold',
  },
  featuresGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 15,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    width: '45%',
  },
  featureText: {
    fontSize: 14,
    color: '#444',
    fontFamily: 'OpenSans_600SemiBold',
  },
  infoList: {
    gap: 10,
  },
  infoDivider: {
    height: 1,
    backgroundColor: '#F0F0F0',
    marginVertical: 10,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  infoLabel: {
    color: '#999',
    fontFamily: 'OpenSans_600SemiBold',
  },
  infoValue: {
    color: '#444',
    fontFamily: 'OpenSans_700Bold',
  },
  ownerCard: {
    flexDirection: 'row',
    backgroundColor: '#F5F5F5',
    padding: 15,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 30,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  ownerInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  ownerAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#F2B705',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarInitials: {
    color: 'white',
    fontSize: 20,
    fontFamily: 'OpenSans_800ExtraBold',
  },
  ownerName: {
    fontSize: 16,
    fontFamily: 'OpenSans_700Bold',
  },
  ownerRole: {
    fontSize: 12,
    color: '#999',
  },
  callSellerBtn: {
    flexDirection: 'row',
    backgroundColor: '#000',
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 15,
    alignItems: 'center',
    gap: 8,
  },
  callSellerText: {
    color: 'white',
    fontSize: 14,
    fontFamily: 'OpenSans_700Bold',
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  footerIconBtn: {
    width: 60,
    height: 60,
    backgroundColor: '#F5F5F5',
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  checkoutBtn: {
    flex: 1,
    marginLeft: 15,
    height: 60,
    backgroundColor: '#F2B705',
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
    width: '80%',
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
});
