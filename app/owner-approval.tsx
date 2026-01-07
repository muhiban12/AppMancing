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
  Alert,
  Modal,
} from 'react-native';
import { MaterialIcons } from "@expo/vector-icons";
import { router } from 'expo-router';

type OwnerStatus = 'pending' | 'approved' | 'rejected';
type Owner = {
  id: string;
  name: string;
  ownerId: string;
  avatar: string;
  status: OwnerStatus;
  spotName: string;
  location: string;
  submittedTime: string;
  region: string;
};

type Region = {
  id: string;
  name: string;
  value: string;
};

export default function OwnerApproval() {
  const [selectedRegion, setSelectedRegion] = useState<string>('all');
  const [showRegionModal, setShowRegionModal] = useState(false);
  const [owners, setOwners] = useState<Owner[]>([
    {
      id: '1',
      name: 'Budi Santoso',
      ownerId: '#OWN-2023-882',
      avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDzqZXWewkiXsf0mpXmev0XMqvYR9-d27WIEjRm9MwU5FgDjJCW0zDRhIETIS0d2LYgCaHjOPGGhq6kUNz-O_cH-OEJtgK3RPW1Q7UUn2YvOjIj8JGlIUT1FY3DqaTM2yyVjy-Akt9MZRm4ulOrBcoopzJzrzxI1Ij5PuO218U8PWi4DU5r_kGSfUedoex2GOzVfKPB6ot3eLid9RHDCBAu3QfY-tJGgOMzvaz1QtVYZ5Dsqb2_i7PVrEMRAbX63BvyTv8-D62YChKD',
      status: 'pending',
      spotName: 'Pemancingan Jatiasih',
      location: 'Bekasi, Jawa Barat',
      submittedTime: '2 jam lalu',
      region: 'west-java',
    },
    {
      id: '2',
      name: 'CV Berkah Alam',
      ownerId: '#OWN-2023-891',
      avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCJ9Wu-7N07WrotpSElj001i0m_8K4plwLz0268jo1LZF3V6J9r3HDZFNOoa4JMUbmZQNL7IX1SbbGu7EMskOrVb9tNWszjNfzFRiakjFsti54A5J2KrI2tTihZaeLQVXZ8Mg_Us_NqTPUAck6HeWIyQggkdyJiRdKjFoEf7pTC4gG83J3SWjkvw7THzRbZKGPmJZhS2kQQMNT_BkNihPZH00KejvRVD_xEtPRdXCMpSRH8z5uhWR7FY6Iy88kv4862g7lNGM1TK2JK',
      status: 'pending',
      spotName: 'Danau Sunter Indah',
      location: 'Tanjung Priok, Jakarta Utara',
      submittedTime: '5 jam lalu',
      region: 'jakarta',
    },
    {
      id: '3',
      name: 'Rahmat Wijaya',
      ownerId: '#OWN-2023-895',
      avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuADQan5ckuXLS2pba2yKDDMBfVMZuB9N62p2GwgKlaOTCxI_eQTidr3ps8ucKsTjL90Nf8-C33K5yvrb1MBa2y9cbBzsEA0W5yGvnkJQqa84rsp1oyGJPF0bnRhRGCXQTlSbJ_JWtqMTvgz28WIHJ7mXtXN9ORnE0wq-KFlG3KGF7k5Tt_jphj5sOI52JKjRyjMngkuRmM4TDKu74so3U5TK8y0DLLkdqshp2HoQaBX6TPKw2r55ieyOqRQfQTToWpwG8j6gb8wGrGd',
      status: 'pending',
      spotName: 'Kolam Pancing Lestari',
      location: 'Semarang, Jawa Tengah',
      submittedTime: '1 hari lalu',
      region: 'central-java',
    },
    {
      id: '4',
      name: 'Siti Aminah',
      ownerId: '#OWN-2023-899',
      avatar: '',
      status: 'pending',
      spotName: 'Fishing Valley Bogor',
      location: 'Bogor, Jawa Barat',
      submittedTime: '1 hari lalu',
      region: 'west-java',
    },
    {
      id: '5',
      name: 'PT Jaya Abadi',
      ownerId: '#OWN-2023-905',
      avatar: '',
      status: 'pending',
      spotName: 'Danau Lestari Bali',
      location: 'Denpasar, Bali',
      submittedTime: '3 jam lalu',
      region: 'bali',
    },
  ]);

  const regions: Region[] = [
    { id: '1', name: 'Semua Wilayah', value: 'all' },
    { id: '2', name: 'Jakarta Metropolitan', value: 'jakarta' },
    { id: '3', name: 'Jawa Barat', value: 'west-java' },
    { id: '4', name: 'Jawa Tengah', value: 'central-java' },
    { id: '5', name: 'Jawa Timur', value: 'east-java' },
    { id: '6', name: 'Bali & Nusa Tenggara', value: 'bali' },
  ];

  const handleBack = () => {
    router.back();
  };

  const handleNotification = () => {
    router.push('/notifications');
  };

  const handleViewDetails = (ownerId: string) => {
  router.push(`/owner-detail?id=${ownerId}`);
};


  const handleQuickApprove = (ownerId: string) => {
    Alert.alert(
      'Setujui Pemilik',
      'Apakah Anda yakin ingin menyetujui pemilik ini?',
      [
        { text: 'Batal', style: 'cancel' },
        { 
          text: 'Setujui', 
          onPress: () => {
            setOwners(prev => prev.map(owner => 
              owner.id === ownerId ? { ...owner, status: 'approved' } : owner
            ));
            Alert.alert('Berhasil!', 'Pemilik telah disetujui.');
          }
        },
      ]
    );
  };

  const handleSort = () => {
    Alert.alert(
      'Urutkan',
      'Pilih cara pengurutan:',
      [
        { text: 'Tanggal (Terbaru)', onPress: () => sortByDate('desc') },
        { text: 'Tanggal (Terlama)', onPress: () => sortByDate('asc') },
        { text: 'Nama (A-Z)', onPress: () => sortByName('asc') },
        { text: 'Batal', style: 'cancel' },
      ]
    );
  };

  const sortByDate = (order: 'asc' | 'desc') => {
    const sorted = [...owners].sort((a, b) => {
      // Simple date sorting based on submittedTime
      const timeA = parseTime(a.submittedTime);
      const timeB = parseTime(b.submittedTime);
      return order === 'desc' ? timeB - timeA : timeA - timeB;
    });
    setOwners(sorted);
  };

  const sortByName = (order: 'asc' | 'desc') => {
    const sorted = [...owners].sort((a, b) => {
      const nameA = a.name.toLowerCase();
      const nameB = b.name.toLowerCase();
      if (order === 'asc') {
        return nameA.localeCompare(nameB);
      } else {
        return nameB.localeCompare(nameA);
      }
    });
    setOwners(sorted);
  };

  const parseTime = (timeStr: string): number => {
    // Convert time string to numeric value for sorting
    if (timeStr.includes('jam')) {
      const hours = parseInt(timeStr);
      return hours;
    } else if (timeStr.includes('hari')) {
      const days = parseInt(timeStr);
      return days * 24;
    } else if (timeStr.includes('menit')) {
      const minutes = parseInt(timeStr);
      return minutes / 60;
    }
    return 0;
  };

  const filteredOwners = selectedRegion === 'all' 
    ? owners 
    : owners.filter(owner => owner.region === selectedRegion);

  const selectedRegionName = regions.find(r => r.value === selectedRegion)?.name || 'Semua Wilayah';

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#003366" />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.menuButton} onPress={handleBack}>
          <MaterialIcons name="arrow-back" size={26} color="#fff" />
        </TouchableOpacity>
        
        <Text style={styles.headerTitle}>Antrian Persetujuan Pemilik</Text>
        
        <TouchableOpacity 
          style={styles.notificationButton}
          onPress={handleNotification}
        >
          <MaterialIcons name="notifications" size={24} color="#fff" />
          <View style={styles.notificationBadge} />
        </TouchableOpacity>
      </View>

      {/* Filter Section */}
      <View style={styles.filterSection}>
        {/* Region Filter */}
        <TouchableOpacity 
          style={styles.regionFilter}
          onPress={() => setShowRegionModal(true)}
        >
          <Text style={styles.filterLabel}>Filter Wilayah</Text>
          <View style={styles.regionSelector}>
            <Text style={styles.selectedRegionText}>{selectedRegionName}</Text>
            <MaterialIcons name="arrow-drop-down" size={20} color="#003366" />
          </View>
        </TouchableOpacity>

        <View style={styles.filterInfo}>
          <Text style={styles.showingText}>
            Menampilkan {filteredOwners.length} permintaan tertunda
          </Text>
          <TouchableOpacity style={styles.sortButton} onPress={handleSort}>
            <MaterialIcons name="sort" size={16} color="#003366" />
            <Text style={styles.sortText}>Urutkan berdasarkan Tanggal</Text>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView 
        style={styles.content}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.contentContainer}
      >
        {filteredOwners.map((owner) => (
          <View key={owner.id} style={styles.ownerCard}>
            {/* Owner Info */}
            <View style={styles.ownerInfoSection}>
              <View style={styles.ownerHeader}>
                <View style={styles.ownerProfile}>
                  {owner.avatar ? (
                    <Image source={{ uri: owner.avatar }} style={styles.ownerAvatar} />
                  ) : (
                    <View style={styles.ownerAvatarPlaceholder}>
                      <Text style={styles.ownerInitials}>
                        {owner.name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2)}
                      </Text>
                    </View>
                  )}
                  <View style={styles.ownerDetails}>
                    <Text style={styles.ownerName}>{owner.name}</Text>
                    <Text style={styles.ownerId}>ID: {owner.ownerId}</Text>
                  </View>
                </View>
                
                <View style={[styles.statusBadge, 
                  owner.status === 'pending' ? styles.pendingBadge :
                  owner.status === 'approved' ? styles.approvedBadge :
                  styles.rejectedBadge
                ]}>
                  <Text style={[
                    styles.statusText,
                    owner.status === 'pending' ? styles.pendingText :
                    owner.status === 'approved' ? styles.approvedText :
                    styles.rejectedText
                  ]}>
                    {owner.status === 'pending' ? 'Tertunda' : 
                     owner.status === 'approved' ? 'Disetujui' : 'Ditolak'}
                  </Text>
                </View>
              </View>

              {/* Spot Info */}
              <View style={styles.spotInfo}>
                <View style={styles.spotHeader}>
                  <MaterialIcons name="waves" size={16} color="#003366" />
                  <Text style={styles.spotName}>{owner.spotName}</Text>
                </View>
                <View style={styles.locationContainer}>
                  <MaterialIcons name="location-on" size={14} color="#6b7280" />
                  <Text style={styles.locationText}>{owner.location}</Text>
                </View>
              </View>

              {/* Submitted Time */}
              <View style={styles.timeContainer}>
                <MaterialIcons name="schedule" size={14} color="#94a3b8" />
                <Text style={styles.timeText}>Diajukan {owner.submittedTime}</Text>
              </View>
            </View>

            {/* Action Buttons */}
            <View style={styles.actionButtons}>
              <TouchableOpacity 
                style={styles.detailButton}
                onPress={() => handleViewDetails(owner.id)}
              >
                <MaterialIcons name="visibility" size={18} color="#fff" />
                <Text style={styles.detailButtonText}>Lihat Detail</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={styles.approveButton}
                onPress={() => handleQuickApprove(owner.id)}
                disabled={owner.status !== 'pending'}
              >
                <MaterialIcons name="check-circle" size={18} color="#fff" />
                <Text style={styles.approveButtonText}>Setujui Cepat</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}

        {/* Empty State */}
        {filteredOwners.length === 0 && (
          <View style={styles.emptyState}>
            <MaterialIcons name="person-off" size={48} color="#d1d5db" />
            <Text style={styles.emptyStateText}>Tidak ada permintaan pemilik</Text>
            <Text style={styles.emptyStateSubtext}>
              Tidak ada permintaan tertunda di wilayah "{selectedRegionName}"
            </Text>
          </View>
        )}
      </ScrollView>

      {/* Region Modal */}
      <Modal
        visible={showRegionModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowRegionModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Pilih Wilayah</Text>
              <TouchableOpacity onPress={() => setShowRegionModal(false)}>
                <MaterialIcons name="close" size={24} color="#6b7280" />
              </TouchableOpacity>
            </View>
            
            <ScrollView style={styles.regionList}>
              {regions.map((region) => (
                <TouchableOpacity
                  key={region.id}
                  style={[
                    styles.regionItem,
                    selectedRegion === region.value && styles.selectedRegionItem
                  ]}
                  onPress={() => {
                    setSelectedRegion(region.value);
                    setShowRegionModal(false);
                  }}
                >
                  <Text style={[
                    styles.regionItemText,
                    selectedRegion === region.value && styles.selectedRegionItemText
                  ]}>
                    {region.name}
                  </Text>
                  {selectedRegion === region.value && (
                    <MaterialIcons name="check" size={20} color="#003366" />
                  )}
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f6f7f8',
  },
  header: {
    backgroundColor: '#003366',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  menuButton: {
    padding: 4,
  },
  headerTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  notificationButton: {
    padding: 4,
    position: 'relative',
  },
  notificationBadge: {
    position: 'absolute',
    top: 2,
    right: 2,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#ff9f1c',
  },
  filterSection: {
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingTop: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  regionFilter: {
    marginBottom: 16,
  },
  filterLabel: {
    position: 'absolute',
    top: -10,
    left: 12,
    backgroundColor: '#fff',
    paddingHorizontal: 8,
    fontSize: 10,
    fontWeight: 'bold',
    color: '#6b7280',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    zIndex: 1,
  },
  regionSelector: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    backgroundColor: '#fff',
  },
  selectedRegionText: {
    fontSize: 14,
    color: '#334155',
    fontWeight: '500',
  },
  filterInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 4,
  },
  showingText: {
    fontSize: 12,
    color: '#6b7280',
    fontWeight: '500',
  },
  sortButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  sortText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#003366',
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    paddingHorizontal: 16,
    paddingVertical: 16,
    paddingBottom: 40,
  },
  ownerCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#f1f5f9',
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  ownerInfoSection: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f8fafc',
  },
  ownerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  ownerProfile: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  ownerAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    borderWidth: 2,
    borderColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  ownerAvatarPlaceholder: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(0, 51, 102, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  ownerInitials: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#003366',
  },
  ownerDetails: {
    flex: 1,
  },
  ownerName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#111518',
  },
  ownerId: {
    fontSize: 12,
    color: '#6b7280',
    fontWeight: '500',
    marginTop: 2,
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
    borderWidth: 1,
  },
  pendingBadge: {
    backgroundColor: 'rgba(255, 159, 28, 0.1)',
    borderColor: 'rgba(255, 159, 28, 0.2)',
  },
  approvedBadge: {
    backgroundColor: 'rgba(38, 196, 133, 0.1)',
    borderColor: 'rgba(38, 196, 133, 0.2)',
  },
  rejectedBadge: {
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
    borderColor: 'rgba(239, 68, 68, 0.2)',
  },
  statusText: {
    fontSize: 10,
    fontWeight: 'bold',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  pendingText: {
    color: '#ff9f1c',
  },
  approvedText: {
    color: '#26c485',
  },
  rejectedText: {
    color: '#ef4444',
  },
  spotInfo: {
    backgroundColor: '#f8fafc',
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
  },
  spotHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 6,
  },
  spotName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  locationText: {
    fontSize: 12,
    color: '#6b7280',
  },
  timeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  timeText: {
    fontSize: 10,
    color: '#94a3b8',
    fontWeight: '500',
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 12,
    padding: 12,
    backgroundColor: 'rgba(249, 250, 251, 0.5)',
  },
  detailButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#003366',
    paddingVertical: 12,
    borderRadius: 8,
    shadowColor: '#003366',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  detailButtonText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#fff',
  },
  approveButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#26c485',
    paddingVertical: 12,
    borderRadius: 8,
    shadowColor: '#26c485',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 2,
  },
  approveButtonText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#fff',
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyStateText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#6b7280',
    marginTop: 16,
  },
  emptyStateSubtext: {
    fontSize: 14,
    color: '#9ca3af',
    marginTop: 4,
    textAlign: 'center',
  },
  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '70%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#111518',
  },
  regionList: {
    maxHeight: 400,
  },
  regionItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  selectedRegionItem: {
    backgroundColor: 'rgba(0, 51, 102, 0.05)',
  },
  regionItemText: {
    fontSize: 16,
    color: '#334155',
  },
  selectedRegionItemText: {
    color: '#003366',
    fontWeight: '600',
  },
});