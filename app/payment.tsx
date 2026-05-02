import React from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, Image, SafeAreaView, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

export default function PaymentScreen() {
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
          <Text style={styles.headerTitle}>Payment</Text>
          <TouchableOpacity>
            <Ionicons name="chatbubble-ellipses" size={24} color="black" />
          </TouchableOpacity>
        </View>

        {/* Delivery Address */}
        <View style={styles.addressSection}>
          <View style={styles.addressIconContainer}>
            <Ionicons name="location" size={24} color="white" />
          </View>
          <View style={styles.addressTextContainer}>
            <Text style={styles.addressLabel}>Delivery Address</Text>
            <Text style={styles.addressValue}>
              Apartemen Kayla Indah Tower A Lt. 1, Unit 1008,{"\n"}
              Jl. Nirwana Raya, Bandungan, Semarang Utara 14240
            </Text>
          </View>
        </View>

        {/* Car Summary Card */}
        <View style={styles.carSummaryCard}>
          <Image 
            source={{ uri: 'https://images.unsplash.com/photo-1580273916550-e323be2ae537?q=80&w=1000&auto=format&fit=crop' }} 
            style={styles.summaryImage} 
          />
          <TouchableOpacity style={styles.smallHeartBtn}>
            <Ionicons name="heart" size={16} color="#FF4B4B" />
          </TouchableOpacity>
          <View style={styles.summaryOverlay}>
            <View style={styles.ratingRow}>
              <Ionicons name="star" size={12} color="#F2B705" />
              <Text style={styles.ratingText}>5.0</Text>
            </View>
            <View style={styles.summaryInfoRow}>
              <Text style={styles.summaryName}>Nissan Skyline 90s</Text>
              <Text style={styles.summaryPrice}>$90K</Text>
            </View>
          </View>
        </View>

        {/* Credit Card */}
        <View style={styles.creditCard}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardMaskedNumber}>1234****12</Text>
            <Text style={styles.cardExpiry}>08/2037</Text>
          </View>
          <View style={styles.cardNumberGrid}>
            <Text style={styles.cardNumberBlock}>1234</Text>
            <Text style={styles.cardNumberBlock}>5555</Text>
            <Text style={styles.cardNumberBlock}>6464</Text>
            <Text style={styles.cardNumberBlock}>4444</Text>
          </View>
          <View style={styles.cardFooter}>
            <Text style={styles.cardOwner}>Paul Walker</Text>
            <Text style={styles.cardBrand}>AUSE</Text>
          </View>
        </View>

        {/* Voucher Section */}
        <TouchableOpacity style={styles.voucherRow}>
          <View style={styles.voucherLeft}>
            <Ionicons name="ticket-outline" size={22} color="black" />
            <Text style={styles.voucherText}>Apply your voucher</Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color="black" />
        </TouchableOpacity>

        {/* Total Price */}
        <View style={styles.totalPriceRow}>
          <View style={styles.totalPriceLeft}>
            <Ionicons name="pricetag-outline" size={22} color="black" />
            <Text style={styles.totalPriceLabel}>Total Price</Text>
          </View>
          <Text style={styles.totalPriceValue}>90K</Text>
        </View>

        {/* Confirm Payment Button */}
        <TouchableOpacity style={styles.confirmBtn} onPress={() => router.replace('/(tabs)')}>
          <Text style={styles.confirmBtnText}>Confirm Payment</Text>
        </TouchableOpacity>
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
    paddingHorizontal: 25,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 30,
  },
  headerTitle: {
    fontSize: 20,
    fontFamily: 'OpenSans_700Bold',
  },
  addressSection: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 15,
    marginBottom: 25,
  },
  addressIconContainer: {
    width: 45,
    height: 45,
    backgroundColor: '#F2B705',
    borderRadius: 22.5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addressTextContainer: {
    flex: 1,
  },
  addressLabel: {
    fontSize: 18,
    fontFamily: 'OpenSans_700Bold',
    marginBottom: 5,
  },
  addressValue: {
    fontSize: 12,
    color: '#666',
    lineHeight: 18,
  },
  carSummaryCard: {
    width: '100%',
    height: 180,
    borderRadius: 25,
    backgroundColor: '#F5F5F5',
    overflow: 'hidden',
    marginBottom: 25,
  },
  summaryImage: {
    width: '100%',
    height: '100%',
  },
  smallHeartBtn: {
    position: 'absolute',
    top: 15,
    right: 15,
    backgroundColor: 'white',
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  summaryOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 15,
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
    fontSize: 12,
  },
  summaryInfoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  summaryName: {
    color: 'white',
    fontSize: 16,
    fontFamily: 'OpenSans_700Bold',
  },
  summaryPrice: {
    color: 'white',
    fontSize: 16,
    fontFamily: 'OpenSans_700Bold',
  },
  creditCard: {
    backgroundColor: '#0A0A3A',
    height: 180,
    borderRadius: 25,
    padding: 25,
    marginBottom: 25,
    justifyContent: 'space-between',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  cardMaskedNumber: {
    color: 'white',
    fontSize: 14,
    opacity: 0.8,
  },
  cardExpiry: {
    color: 'white',
    fontSize: 14,
    fontFamily: 'OpenSans_700Bold',
  },
  cardNumberGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  cardNumberBlock: {
    color: 'white',
    fontSize: 22,
    fontFamily: 'OpenSans_700Bold',
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  cardOwner: {
    color: 'white',
    fontSize: 14,
    fontFamily: 'OpenSans_600SemiBold',
  },
  cardBrand: {
    color: 'white',
    fontSize: 14,
    fontFamily: 'OpenSans_800ExtraBold',
    fontStyle: 'italic',
  },
  voucherRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#F5F5F5',
    height: 56,
    borderRadius: 28,
    paddingHorizontal: 20,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  voucherLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  voucherText: {
    fontSize: 14,
    fontFamily: 'OpenSans_600SemiBold',
  },
  totalPriceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#F5F5F5',
    height: 56,
    borderRadius: 28,
    paddingHorizontal: 20,
    marginBottom: 30,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  totalPriceLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  totalPriceLabel: {
    fontSize: 14,
    fontFamily: 'OpenSans_600SemiBold',
  },
  totalPriceValue: {
    fontSize: 18,
    fontFamily: 'OpenSans_700Bold',
  },
  confirmBtn: {
    backgroundColor: '#F2B705',
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 40,
  },
  confirmBtnText: {
    color: 'white',
    fontSize: 18,
    fontFamily: 'OpenSans_800ExtraBold',
    textTransform: 'uppercase',
  },
});
