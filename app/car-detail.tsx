import React, { useState } from 'react';
import { StyleSheet, Text, View, ScrollView, Image, TouchableOpacity, Dimensions, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

const { width } = Dimensions.get('window');

const SPECS = [
  { id: '1', label: '5000km', icon: 'speedometer' },
  { id: '2', label: '2 Seat', icon: 'people' },
  { id: '3', label: 'Gasoline', icon: 'flashlight' },
  { id: '4', label: 'Manual', icon: 'git-branch' },
];

const TABS = ['Description', 'Features', 'Vehicle Info'];

export default function CarDetailScreen() {
  const [activeTab, setActiveTab] = useState('Description');
  const router = useRouter();

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

        {/* Main Image Carousel Area */}
        <View style={styles.imageSection}>
          <Image 
            source={{ uri: 'https://images.unsplash.com/photo-1580273916550-e323be2ae537?q=80&w=1000&auto=format&fit=crop' }} 
            style={styles.mainImage} 
          />
          <View style={styles.imageOverlay}>
            <TouchableOpacity style={styles.iconBtn}>
              <Ionicons name="share-social-outline" size={20} color="#666" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.iconBtn}>
              <Ionicons name="heart-outline" size={20} color="#666" />
            </TouchableOpacity>
          </View>
          {/* Pagination Dots */}
          <View style={styles.dots}>
            <View style={styles.dot} />
            <View style={[styles.dot, styles.activeDot]} />
            <View style={styles.dot} />
            <View style={styles.dot} />
          </View>
        </View>

        {/* Car Info */}
        <View style={styles.infoSection}>
          <Text style={styles.categoryText}>Sportscar</Text>
          <View style={styles.nameRow}>
            <Text style={styles.carName}>Nissan Skyline 90s</Text>
            <Text style={styles.carPrice}>$90K</Text>
          </View>
          <View style={styles.ratingRow}>
            <Ionicons name="star" size={16} color="#F2B705" />
            <Text style={styles.ratingText}>5.0 (12 Reviews)</Text>
          </View>
        </View>

        {/* Specs */}
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

        {/* Tabs */}
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

        {/* Description */}
        <View style={styles.descriptionSection}>
          <Text style={styles.descriptionText}>
            Experience iconic performance and timeless design with this Nissan Skyline in a stunning maroon finish. 
            A perfect blend of sporty style and everyday comfort, this car delivers both head-turning looks and a thrilling driving experience.
            <Text style={styles.readMore}> Read More..</Text>
          </Text>
        </View>

        {/* Owner Section */}
        <View style={styles.ownerCard}>
          <View style={styles.ownerInfo}>
            <View style={styles.ownerAvatar}>
              <Text style={styles.avatarInitials}>R</Text>
            </View>
            <View>
              <Text style={styles.ownerName}>Caryuk Store</Text>
              <Text style={styles.ownerRole}>Owner</Text>
            </View>
          </View>
          <View style={styles.ownerActions}>
            <TouchableOpacity style={styles.ownerActionBtn}>
              <Ionicons name="chatbubble" size={20} color="black" />
            </TouchableOpacity>
            <TouchableOpacity style={[styles.ownerActionBtn, { marginLeft: 10 }]}>
              <Ionicons name="call" size={20} color="black" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Bottom Actions */}
        <View style={styles.footer}>
          <TouchableOpacity style={styles.footerIconBtn}>
            <Ionicons name="heart" size={24} color="#FF4B4B" />
          </TouchableOpacity>
          <TouchableOpacity style={[styles.footerIconBtn, { marginLeft: 10 }]}>
            <Ionicons name="cart-outline" size={24} color="#666" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.checkoutBtn} onPress={() => router.push('/payment')}>
            <Text style={styles.checkoutBtnText}>Checkout</Text>
          </TouchableOpacity>
        </View>
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
  dots: {
    position: 'absolute',
    bottom: 20,
    flexDirection: 'row',
    alignSelf: 'center',
    gap: 6,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: 'white',
    opacity: 0.5,
  },
  activeDot: {
    width: 25,
    backgroundColor: '#F2B705',
    opacity: 1,
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
    backgroundColor: '#E0E0E0',
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
  descriptionSection: {
    marginBottom: 25,
  },
  descriptionText: {
    fontSize: 14,
    color: '#666',
    lineHeight: 22,
  },
  readMore: {
    color: '#F2B705',
    fontFamily: 'OpenSans_700Bold',
  },
  ownerCard: {
    flexDirection: 'row',
    backgroundColor: '#F5F5F5',
    padding: 15,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 30,
  },
  ownerInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  ownerAvatar: {
    width: 45,
    height: 45,
    borderRadius: 22.5,
    backgroundColor: '#AAA',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarInitials: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  ownerName: {
    fontSize: 16,
    fontFamily: 'OpenSans_700Bold',
  },
  ownerRole: {
    fontSize: 12,
    color: '#666',
  },
  ownerActions: {
    flexDirection: 'row',
  },
  ownerActionBtn: {
    width: 40,
    height: 40,
    backgroundColor: '#F2B705',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  footerIconBtn: {
    width: 56,
    height: 56,
    backgroundColor: '#E0E0E0',
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkoutBtn: {
    flex: 1,
    marginLeft: 15,
    height: 56,
    backgroundColor: '#F2B705',
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkoutBtnText: {
    fontSize: 18,
    color: 'white',
    fontFamily: 'OpenSans_800ExtraBold',
    textTransform: 'uppercase',
  },
});
