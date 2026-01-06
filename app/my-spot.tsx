import React, { useState } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  StatusBar,
  Platform,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { router } from 'expo-router';

interface Spot {
  id: number;
  name: string;
  address: string;
  rating: number;
  reviews: number;
  bookings: number;
  status: 'open' | 'closed';
  icon: string;
  gradient: string[];
}

export default function MySpots() {
  const spots: Spot[] = [
    {
      id: 1,
      name: 'Telaga Berkah',
      address: 'Jl. Raya Mancing No. 12, Bogor',
      rating: 4.8,
      reviews: 120,
      bookings: 45,
      status: 'open',
      icon: 'phishing',
      gradient: ['#3b82f6', '#0f4c81'],
    },
    {
      id: 2,
      name: 'Kolam Harian "Sejuk"',
      address: 'Jl. Alternatif Lembang No. 88',
      rating: 4.2,
      reviews: 85,
      bookings: 0,
      status: 'closed',
      icon: 'water-drop',
      gradient: ['#9ca3af', '#4b5563'],
    },
    {
      id: 3,
      name: 'Pemancingan Alam Asri',
      address: 'Desa Wisata Ciwidey, Bandung',
      rating: 4.9,
      reviews: 310,
      bookings: 88,
      status: 'open',
      icon: 'kayaking',
      gradient: ['#2dd4bf', '#2ecc71'],
    },
  ];

  const handleBack = () => {
    router.back();
  };

  const handleSearch = () => {
    console.log('Search spots');
    // Implement search functionality
  };

  const handleAddSpot = () => {
    console.log('Add new spot');
    router.push('/add-wild-spot'); // Navigate to add spot page
  };

  const handleEditSpot = (spot: Spot) => {
    console.log('Edit spot:', spot.name);
    // Navigate to edit spot page
    router.push('/edit-wild-spot');
  };

  const handleViewAnalytics = (spot: Spot) => {
    console.log('View analytics for:', spot.name);
    // Navigate to analytics page
    router.push('/admindashboard');
  };

  const getStatusColor = (status: 'open' | 'closed') => {
    return status === 'open' ? '#2ecc71' : '#94a3b8';
  };

  const getStatusBgColor = (status: 'open' | 'closed') => {
    return status === 'open' ? '#2ecc7110' : '#f1f5f9';
  };

  const getStatusBorderColor = (status: 'open' | 'closed') => {
    return status === 'open' ? '#2ecc7120' : '#e2e8f0';
  };

  const getStatusText = (status: 'open' | 'closed') => {
    return status === 'open' ? 'BUKA' : 'TUTUP';
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={handleBack}>
          <MaterialIcons name="arrow-back" size={24} color="#111518" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Spot Saya</Text>
        <TouchableOpacity style={styles.searchButton} onPress={handleSearch}>
          <MaterialIcons name="search" size={24} color="#94a3b8" />
        </TouchableOpacity>
      </View>

      <ScrollView 
        style={styles.content}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.contentContainer}
      >
        <View style={styles.spotsList}>
          {spots.map((spot) => (
            <View key={spot.id} style={styles.spotCard}>
              <View style={styles.spotHeader}>
                {/* Icon with gradient background */}
                <View style={[styles.spotIconContainer, { 
                  backgroundColor: spot.gradient[0],
                }]}>
                  <MaterialIcons 
                    name={spot.icon as any} 
                    size={32} 
                    color="#fff" 
                    style={styles.spotIcon} 
                  />
                </View>
                
                <View style={styles.spotInfo}>
                  <View style={styles.spotTitleRow}>
                    <Text style={styles.spotName} numberOfLines={1}>
                      {spot.name}
                    </Text>
                    <View style={[
                      styles.statusBadge,
                      { 
                        backgroundColor: getStatusBgColor(spot.status),
                        borderColor: getStatusBorderColor(spot.status),
                      }
                    ]}>
                      <Text style={[
                        styles.statusText,
                        { color: getStatusColor(spot.status) }
                      ]}>
                        {getStatusText(spot.status)}
                      </Text>
                    </View>
                  </View>
                  
                  <View style={styles.addressContainer}>
                    <MaterialIcons name="location-on" size={12} color="#64748b" />
                    <Text style={styles.addressText} numberOfLines={1}>
                      {spot.address}
                    </Text>
                  </View>
                  
                  <View style={styles.statsRow}>
                    {/* Rating */}
                    <View style={styles.statItem}>
                      <MaterialIcons name="star" size={14} color="#ff9f43" />
                      <Text style={styles.statValue}>{spot.rating}</Text>
                      <Text style={styles.statLabel}>({spot.reviews})</Text>
                    </View>
                    
                    <View style={styles.statDivider} />
                    
                    {/* Bookings */}
                    <View style={styles.statItem}>
                      <MaterialIcons name="confirmation-number" size={14} color="#0f4c81" />
                      <Text style={styles.statLabel}>{spot.bookings} Bookings</Text>
                    </View>
                  </View>
                </View>
              </View>
              
              {/* Divider */}
              <View style={styles.divider} />
              
              {/* Action Buttons */}
              <View style={styles.actionButtons}>
                <TouchableOpacity 
  style={styles.editButton}
  onPress={() => router.push('/edit-owner-spot')}
>
  <MaterialIcons name="edit-square" size={16} color="#64748b" />
  <Text style={styles.editButtonText}>Edit Detail</Text>
</TouchableOpacity>
                
                <TouchableOpacity 
                  style={styles.analyticsButton}
                  onPress={() => handleViewAnalytics(spot)}
                >
                  <MaterialIcons name="analytics" size={16} color="#0f4c81" />
                  <Text style={styles.analyticsButtonText}>Lihat Data</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </View>
        
        <View style={styles.bottomSpacer} />
      </ScrollView>

      {/* Add Spot Floating Button */}
      <TouchableOpacity 
  style={styles.addButton}
  onPress={() => router.push('/add-owner-spot')}
>
  <View style={styles.addButtonIcon}>
    <MaterialIcons name="add-location-alt" size={20} color="#fff" />
  </View>
  <Text style={styles.addButtonText}>Tambah Spot</Text>
</TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f6f7f8',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  backButton: {
    padding: 8,
    marginLeft: -8,
    borderRadius: 20,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#111518',
  },
  searchButton: {
    padding: 8,
    marginRight: -8,
    borderRadius: 20,
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    padding: 16,
    paddingBottom: 100,
  },
  spotsList: {
    gap: 16,
  },
  spotCard: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: '#f1f5f9',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  spotHeader: {
    flexDirection: 'row',
    gap: 16,
  },
  spotIconContainer: {
    width: 80,
    height: 80,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  spotIcon: {
    opacity: 0.6,
  },
  spotInfo: {
    flex: 1,
    minWidth: 0,
    justifyContent: 'space-between',
  },
  spotTitleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: 8,
    marginBottom: 4,
  },
  spotName: {
    flex: 1,
    fontSize: 16,
    fontWeight: 'bold',
    color: '#111518',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    borderWidth: 1,
  },
  statusText: {
    fontSize: 10,
    fontWeight: 'bold',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  addressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 12,
  },
  addressText: {
    flex: 1,
    fontSize: 12,
    color: '#64748b',
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  statValue: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#111518',
  },
  statLabel: {
    fontSize: 10,
    color: '#94a3b8',
  },
  statDivider: {
    width: 1,
    height: 12,
    backgroundColor: '#e2e8f0',
  },
  divider: {
    height: 1,
    backgroundColor: '#f1f5f9',
    marginVertical: 12,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  editButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 8,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  editButtonText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#64748b',
  },
  analyticsButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 8,
    borderRadius: 12,
    backgroundColor: '#0f4c810d',
  },
  analyticsButtonText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#0f4c81',
  },
  bottomSpacer: {
    height: 20,
  },
  addButton: {
    position: 'absolute',
    bottom: 32,
    right: 16,
    backgroundColor: '#ff9f43',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingLeft: 16,
    paddingRight: 20,
    paddingVertical: 14,
    borderRadius: 999,
    shadowColor: '#ff9f43',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  addButtonIcon: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    padding: 4,
    borderRadius: 6,
  },
  addButtonText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#fff',
    letterSpacing: 0.5,
  },
});