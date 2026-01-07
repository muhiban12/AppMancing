import React, { useState } from 'react';
import {
  SafeAreaView,
  ScrollView,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  Image,
  Dimensions,
  TextInput,
  FlatList,
} from 'react-native';
import { MaterialIcons } from "@expo/vector-icons";
import { router } from 'expo-router';

const { width } = Dimensions.get('window');

type SpotStatus = 'active' | 'pending' | 'rejected';
type FilterType = 'all' | 'active' | 'pending' | 'province';

interface WildSpot {
  id: string;
  name: string;
  location: string;
  status: SpotStatus;
  potentials: string[];
  isForbidden?: boolean;
}

export default function AllWildSpots() {
  const [activeFilter, setActiveFilter] = useState<FilterType>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const handleBack = () => {
    router.back();
  };

  const handleAddSpot = () => {
    console.log('Tambah spot baru');
    // router.push('/add-wild-spot');
  };

  // Data contoh spot liar
  const wildSpots: WildSpot[] = [
    {
      id: '1',
      name: 'Muara Sungai Cisadane',
      location: 'Tangerang, Banten',
      status: 'active',
      potentials: ['Barramundi', 'Kakap Putih', '+2'],
    },
    {
      id: '2',
      name: 'Rawa Pening Spot 02',
      location: 'Semarang, Jawa Tengah',
      status: 'pending',
      potentials: ['Gabus', 'Nila'],
    },
    {
      id: '3',
      name: 'Danau Sunter Selatan',
      location: 'Jakarta Utara, DKI Jakarta',
      status: 'active',
      potentials: ['Bawal', 'Patin', 'Mas'],
    },
    {
      id: '4',
      name: 'Kali Angke (Terlarang)',
      location: 'Jakarta Barat, DKI Jakarta',
      status: 'rejected',
      potentials: ['Tidak ada data'],
      isForbidden: true,
    },
  ];

  // Filter spot berdasarkan status
  const filteredSpots = wildSpots.filter(spot => {
    if (activeFilter === 'all') return true;
    if (activeFilter === 'active') return spot.status === 'active';
    if (activeFilter === 'pending') return spot.status === 'pending';
    return true;
  });

  // Fungsi untuk mendapatkan warna berdasarkan status
  const getStatusColor = (status: SpotStatus) => {
    switch (status) {
      case 'active': return '#26c485';
      case 'pending': return '#ff9f1c';
      case 'rejected': return '#ef4444';
      default: return '#666';
    }
  };

  const getStatusText = (status: SpotStatus) => {
    switch (status) {
      case 'active': return 'Aktif';
      case 'pending': return 'Tertunda';
      case 'rejected': return 'Ditolak';
    }
  };

  // Komponen untuk item spot
  const renderSpotItem = ({ item }: { item: WildSpot }) => (
    <View style={styles.spotCard}>
      <View style={styles.spotCardContent}>
        <View style={styles.spotHeader}>
          <View style={styles.spotInfo}>
            <Text style={[
              styles.spotName,
              item.isForbidden && styles.forbiddenName
            ]}>
              {item.name}
            </Text>
            <View style={styles.locationContainer}>
              <MaterialIcons 
                name="location-on" 
                size={16} 
                color={item.isForbidden ? '#ef4444' : '#2b9dee'} 
              />
              <Text style={styles.spotLocation}>{item.location}</Text>
            </View>
          </View>
          <View style={[
            styles.statusBadge,
            { backgroundColor: `${getStatusColor(item.status)}20` }
          ]}>
            <View style={[
              styles.statusDot,
              { backgroundColor: getStatusColor(item.status) }
            ]} />
            <Text style={[
              styles.statusText,
              { color: getStatusColor(item.status) }
            ]}>
              {getStatusText(item.status)}
            </Text>
          </View>
        </View>

        <View style={styles.potentialsContainer}>
          <Text style={styles.potentialsLabel}>POTENSI</Text>
          <View style={styles.potentialsList}>
            {item.potentials.map((potential, index) => (
              <View 
                key={index} 
                style={[
                  styles.potentialTag,
                  item.potentials[0] === 'Tidak ada data' && styles.noDataTag
                ]}
              >
                <Text style={[
                  styles.potentialText,
                  item.potentials[0] === 'Tidak ada data' && styles.noDataText
                ]}>
                  {potential}
                </Text>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.actionButtons}>
  <TouchableOpacity style={styles.detailButton}>
    <MaterialIcons name="visibility" size={18} color="#666" />
    <Text style={styles.detailButtonText}>Detail</Text>
  </TouchableOpacity>
  <TouchableOpacity 
    style={styles.editButton}
    onPress={() => router.push({
      pathname: "/edit-wild-spot",
      params: { id: item.id }
    })}
  >
    <MaterialIcons name="edit-square" size={18} color="#fff" />
    <Text style={styles.editButtonText}>Edit Spot</Text>
  </TouchableOpacity>
</View>
      </View>
    </View>
  );

  // Filter buttons
  const filters = [
    { id: 'all', label: 'Semua' },
    { id: 'active', label: 'Aktif' },
    { id: 'pending', label: 'Tertunda' },
    { id: 'province', label: 'By Provinsi' },
  ] as const;

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0B253C" />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={handleBack}>
          <MaterialIcons name="arrow-back" size={26} color="#fff" />
        </TouchableOpacity>
        
        <Text style={styles.headerTitle}>Semua Spot Liar</Text>
        
        <TouchableOpacity style={styles.addButton} onPress={() => router.push('/add-wild-spot')}>
        <MaterialIcons name="add" size={26} color="#fff" />
        </TouchableOpacity>
      </View>

      {/* Search & Filter Section */}
      <View style={styles.searchFilterSection}>
        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <MaterialIcons name="search" size={20} color="#94a3b8" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search spot name..."
            placeholderTextColor="#94a3b8"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          <TouchableOpacity style={styles.filterButton}>
            <MaterialIcons name="tune" size={20} color="#94a3b8" />
          </TouchableOpacity>
        </View>

        {/* Filter Tabs */}
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          style={styles.filterScrollView}
          contentContainerStyle={styles.filterContainer}
        >
          {filters.map((filter) => (
            <TouchableOpacity
              key={filter.id}
              style={[
                styles.filterButtonTab,
                activeFilter === filter.id && styles.activeFilterButton
              ]}
              onPress={() => setActiveFilter(filter.id as FilterType)}
            >
              <Text style={[
                styles.filterButtonText,
                activeFilter === filter.id && styles.activeFilterButtonText
              ]}>
                {filter.label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Spots List */}
      <FlatList
        data={filteredSpots}
        renderItem={renderSpotItem}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.spotsList}
        showsVerticalScrollIndicator={false}
        ListFooterComponent={<View style={styles.bottomSpacing} />}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  header: {
    backgroundColor: '#0B253C',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  backButton: {
    padding: 4,
  },
  headerTitle: {
    color: '#fff',
    fontSize: 17,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  addButton: {
    padding: 4,
  },
  searchFilterSection: {
    backgroundColor: '#f8fafc',
    paddingHorizontal: 16,
    paddingBottom: 12,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 16,
    paddingHorizontal: 12,
    marginBottom: 16,
    shadowColor: '#0B253C',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 20,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#f1f5f9',
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 14,
    fontSize: 14,
    fontWeight: '500',
    color: '#334155',
  },
  filterButton: {
    padding: 4,
  },
  filterScrollView: {
    marginHorizontal: -16,
    paddingHorizontal: 16,
  },
  filterContainer: {
    flexDirection: 'row',
    gap: 10,
    paddingBottom: 8,
  },
  filterButtonTab: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: '#fff',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 1,
  },
  activeFilterButton: {
    backgroundColor: '#0B253C',
    borderColor: '#0B253C',
  },
  filterButtonText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#64748b',
  },
  activeFilterButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  spotsList: {
    paddingHorizontal: 16,
    paddingTop: 8,
  },
  spotCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#f1f5f9',
  },
  spotCardContent: {
    padding: 20,
  },
  spotHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  spotInfo: {
    flex: 1,
    marginRight: 12,
  },
  spotName: {
    fontSize: 17,
    fontWeight: '800',
    color: '#1e293b',
    marginBottom: 4,
  },
  forbiddenName: {
    color: '#ef4444',
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  spotLocation: {
    fontSize: 12,
    color: '#64748b',
    fontWeight: '500',
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'transparent',
    gap: 6,
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  statusText: {
    fontSize: 10,
    fontWeight: 'bold',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  potentialsContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 20,
  },
  potentialsLabel: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#94a3b8',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginRight: 12,
    marginTop: 2,
  },
  potentialsList: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  potentialTag: {
    backgroundColor: '#f8fafc',
    borderWidth: 1,
    borderColor: '#f1f5f9',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
  },
  noDataTag: {
    backgroundColor: '#f8fafc',
  },
  potentialText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#475569',
  },
  noDataText: {
    fontStyle: 'italic',
    color: '#94a3b8',
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  detailButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 12,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 12,
  },
  detailButtonText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#64748b',
  },
  editButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 12,
    backgroundColor: '#0B253C',
    borderRadius: 12,
    shadowColor: '#0B253C',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 3,
  },
  editButtonText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#fff',
  },
  bottomSpacing: {
    height: 80,
  },
});