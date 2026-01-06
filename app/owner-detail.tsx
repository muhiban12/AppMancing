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
  Linking,
} from 'react-native';
import { MaterialIcons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from 'expo-router';

type OwnerDetailProps = {
  id?: string;
};

export default function OwnerDetail() {
  const params = useLocalSearchParams();
  const ownerId = params.id as string || '1';
  
  const [showKtpModal, setShowKtpModal] = useState(false);
  const [showSpotPhotosModal, setShowSpotPhotosModal] = useState(false);
  const [ownerStatus, setOwnerStatus] = useState<'pending' | 'approved' | 'rejected'>('pending');

  // Data contoh berdasarkan ownerId
  const ownerData = {
    id: ownerId,
    name: ownerId === '1' ? 'Budi Santoso' : 
          ownerId === '2' ? 'CV Berkah Alam' : 
          ownerId === '3' ? 'Rahmat Wijaya' : 'Siti Aminah',
    ownerId: `#OWN-2023-${parseInt(ownerId) * 100 + 82}`,
    avatar: ownerId === '1' ? 'https://lh3.googleusercontent.com/aida-public/AB6AXuDzqZXWewkiXsf0mpXmev0XMqvYR9-d27WIEjRm9MwU5FgDjJCW0zDRhIETIS0d2LYgCaHjOPGGhq6kUNz-O_cH-OEJtgK3RPW1Q7UUn2YvOjIj8JGlIUT1FY3DqaTM2yyVjy-Akt9MZRm4ulOrBcoopzJzrzxI1Ij5PuO218U8PWi4DU5r_kGSfUedoex2GOzVfKPB6ot3eLid9RHDCBAu3QfY-tJGgOMzvaz1QtVYZ5Dsqb2_i7PVrEMRAbX63BvyTv8-D62YChKD' :
            ownerId === '2' ? 'https://lh3.googleusercontent.com/aida-public/AB6AXuCJ9Wu-7N07WrotpSElj001i0m_8K4plwLz0268jo1LZF3V6J9r3HDZFNOoa4JMUbmZQNL7IX1SbbGu7EMskOrVb9tNWszjNfzFRiakjFsti54A5J2KrI2tTihZaeLQVXZ8Mg_Us_NqTPUAck6HeWIyQggkdyJiRdKjFoEf7pTC4gG83J3SWjkvw7THzRbZKGPmJZhS2kQQMNT_BkNihPZH00KejvRVD_xEtPRdXCMpSRH8z5uhWR7FY6Iy88kv4862g7lNGM1TK2JK' : '',
    phone: '+62 812-3456-7890',
    email: ownerId === '1' ? 'budi.santoso@email.com' :
           ownerId === '2' ? 'cv.berkahalam@email.com' :
           ownerId === '3' ? 'rahmat.wijaya@email.com' : 'siti.aminah@email.com',
    spotName: ownerId === '1' ? 'Pemancingan Jatiasih Indah' :
              ownerId === '2' ? 'Danau Sunter Indah' :
              ownerId === '3' ? 'Kolam Pancing Lestari' : 'Fishing Valley Bogor',
    spotType: 'Galatama',
    spotPhone: '+62 21-8899-0000',
    location: ownerId === '1' ? 'Bekasi, Jawa Barat' :
              ownerId === '2' ? 'Tanjung Priok, Jakarta Utara' :
              ownerId === '3' ? 'Semarang, Jawa Tengah' : 'Bogor, Jawa Barat',
    fullAddress: ownerId === '1' ? 'Jl. Raya Jatiasih No. 45, RT.001/RW.004, Jatiasih, Kec. Jatiasih, Kota Bks, Jawa Barat 17423' :
                 ownerId === '2' ? 'Jl. Danau Sunter Selatan No. 12, Tanjung Priok, Jakarta Utara 14350' :
                 ownerId === '3' ? 'Jl. Lestari No. 88, Semarang, Jawa Tengah 50123' : 'Jl. Puncak Bogor No. 25, Bogor, Jawa Barat 16151',
    description: '"Tempat pemancingan keluarga dengan fasilitas lengkap, kolam luas, dan suasana asri. Tersedia sewa alat pancing dan kantin."',
    submittedTime: ownerId === '1' ? '2 jam lalu' :
                   ownerId === '2' ? '5 jam lalu' :
                   ownerId === '3' ? '1 hari lalu' : '1 hari lalu',
  };

  const handleBack = () => {
    router.back();
  };

  const handleApproveOwner = () => {
    Alert.alert(
      'Setujui Owner',
      'Apakah Anda yakin ingin menyetujui owner ini?',
      [
        { text: 'Batal', style: 'cancel' },
        { 
          text: 'Setujui', 
          onPress: () => {
            setOwnerStatus('approved');
            Alert.alert('Berhasil!', 'Owner telah disetujui.');
            setTimeout(() => router.back(), 1500);
          }
        },
      ]
    );
  };

  const handleRejectOwner = () => {
    Alert.alert(
      'Tolak Owner',
      'Apakah Anda yakin ingin menolak owner ini?',
      [
        { text: 'Batal', style: 'cancel' },
        { 
          text: 'Tolak', 
          style: 'destructive',
          onPress: () => {
            setOwnerStatus('rejected');
            Alert.alert('Berhasil!', 'Owner telah ditolak.');
            setTimeout(() => router.back(), 1500);
          }
        },
      ]
    );
  };

  const handleOpenMaps = () => {
    const address = encodeURIComponent(ownerData.fullAddress);
    const url = `https://maps.google.com/?q=${address}`;
    Linking.openURL(url).catch(err => 
      Alert.alert('Error', 'Tidak dapat membuka peta')
    );
  };

  const handleViewKtp = () => {
    setShowKtpModal(true);
  };

  const handleViewSpotPhotos = () => {
    setShowSpotPhotosModal(true);
  };

  const handleCloseModal = () => {
    setShowKtpModal(false);
    setShowSpotPhotosModal(false);
  };

  const spotPhotos = [
    'https://lh3.googleusercontent.com/aida-public/AB6AXuDzqZXWewkiXsf0mpXmev0XMqvYR9-d27WIEjRm9MwU5FgDjJCW0zDRhIETIS0d2LYgCaHjOPGGhq6kUNz-O_cH-OEJtgK3RPW1Q7UUn2YvOjIj8JGlIUT1FY3DqaTM2yyVjy-Akt9MZRm4ulOrBcoopzJzrzxI1Ij5PuO218U8PWi4DU5r_kGSfUedoex2GOzVfKPB6ot3eLid9RHDCBAu3QfY-tJGgOMzvaz1QtVYZ5Dsqb2_i7PVrEMRAbX63BvyTv8-D62YChKD',
    'https://lh3.googleusercontent.com/aida-public/AB6AXuCJ9Wu-7N07WrotpSElj001i0m_8K4plwLz0268jo1LZF3V6J9r3HDZFNOoa4JMUbmZQNL7IX1SbbGu7EMskOrVb9tNWszjNfzFRiakjFsti54A5J2KrI2tTihZaeLQVXZ8Mg_Us_NqTPUAck6HeWIyQggkdyJiRdKjFoEf7pTC4gG83J3SWjkvw7THzRbZKGPmJZhS2kQQMNT_BkNihPZH00KejvRVD_xEtPRdXCMpSRH8z5uhWR7FY6Iy88kv4862g7lNGM1TK2JK',
  ];

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#003366" />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.menuButton} onPress={handleBack}>
          <MaterialIcons name="arrow-back" size={26} color="#fff" />
        </TouchableOpacity>
        
        <Text style={styles.headerTitle}>Detail Owner</Text>
        
        <View style={styles.placeholder} />
      </View>

      <ScrollView 
        style={styles.content}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.contentContainer}
      >
        {/* Owner Profile */}
        <View style={styles.profileSection}>
          <View style={styles.profileHeader}>
            {ownerData.avatar ? (
              <Image 
                source={{ uri: ownerData.avatar }} 
                style={styles.profileAvatar}
              />
            ) : (
              <View style={styles.profileAvatarPlaceholder}>
                <Text style={styles.profileInitials}>
                  {ownerData.name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2)}
                </Text>
              </View>
            )}
            <View style={styles.profileInfo}>
              <Text style={styles.ownerName}>{ownerData.name}</Text>
              <View style={styles.verificationBadge}>
                <MaterialIcons name="verified" size={12} color="#003366" />
                <Text style={styles.verificationText}>Verifikasi ID Tertunda</Text>
              </View>
              <Text style={styles.ownerId}>{ownerData.ownerId}</Text>
            </View>
          </View>

          <View style={styles.contactInfo}>
            <View style={styles.contactRow}>
              <MaterialIcons name="call" size={14} color="#26c485" />
              <Text style={styles.contactText}>{ownerData.phone}</Text>
            </View>
            <View style={styles.contactRow}>
              <MaterialIcons name="mail" size={14} color="#003366" />
              <Text style={styles.contactText}>{ownerData.email}</Text>
            </View>
            <View style={styles.contactRow}>
              <MaterialIcons name="schedule" size={14} color="#94a3b8" />
              <Text style={styles.timeText}>Diajukan {ownerData.submittedTime}</Text>
            </View>
          </View>
        </View>

        <View style={styles.divider} />

        {/* Spot Information */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>INFORMASI SPOT PANCING</Text>
          
          <View style={styles.spotInfoCard}>
            <View style={styles.spotHeader}>
              <View style={styles.spotIcon}>
                <MaterialIcons name="phishing" size={20} color="#003366" />
              </View>
              <View>
                <Text style={styles.label}>NAMA SPOT</Text>
                <Text style={styles.spotName}>{ownerData.spotName}</Text>
              </View>
            </View>

            <View style={styles.spotDetails}>
              <View style={styles.detailRow}>
                <View style={styles.detailColumn}>
                  <Text style={styles.label}>TIPE PANCINGAN</Text>
                  <View style={styles.typeBadge}>
                    <Text style={styles.typeText}>{ownerData.spotType}</Text>
                  </View>
                </View>
                <View style={styles.detailColumn}>
                  <Text style={styles.label}>TELEPON SPOT</Text>
                  <Text style={styles.detailText}>{ownerData.spotPhone}</Text>
                </View>
              </View>

              <View style={styles.addressContainer}>
                <Text style={styles.label}>ALAMAT LENGKAP</Text>
                <Text style={styles.addressText}>{ownerData.fullAddress}</Text>
              </View>

              {/* Map Preview */}
              <TouchableOpacity 
                style={styles.mapPreview}
                onPress={handleOpenMaps}
                activeOpacity={0.9}
              >
                <View style={styles.mapPlaceholder}>
                  <MaterialIcons name="map" size={40} color="#94a3b8" />
                </View>
                <View style={styles.mapBadge}>
                  <Text style={styles.mapBadgeText}>Buka di Maps</Text>
                </View>
              </TouchableOpacity>

              <View style={styles.descriptionContainer}>
                <Text style={styles.label}>DESKRIPSI SINGKAT</Text>
                <View style={styles.descriptionBox}>
                  <Text style={styles.descriptionText}>{ownerData.description}</Text>
                </View>
              </View>
            </View>
          </View>
        </View>

        {/* Document Actions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>DOKUMEN VERIFIKASI</Text>
          
          <View style={styles.documentActions}>
            <TouchableOpacity 
              style={styles.documentButton}
              onPress={handleViewKtp}
            >
              <MaterialIcons name="badge" size={32} color="#003366" />
              <Text style={styles.documentButtonText}>Lihat Foto KTP</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.documentButton, styles.photoButton]}
              onPress={handleViewSpotPhotos}
            >
              <MaterialIcons name="add-a-photo" size={32} color="#26c485" />
              <Text style={[styles.documentButtonText, styles.photoButtonText]}>
                Lihat Foto Spot
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>

      {/* Action Buttons */}
      <View style={styles.actionSection}>
        <TouchableOpacity 
          style={styles.approveButton}
          onPress={handleApproveOwner}
          disabled={ownerStatus !== 'pending'}
        >
          <MaterialIcons name="check-circle" size={20} color="#fff" />
          <Text style={styles.approveButtonText}>Setujui Owner</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.rejectButton}
          onPress={handleRejectOwner}
          disabled={ownerStatus !== 'pending'}
        >
          <MaterialIcons name="cancel" size={20} color="#ef4444" />
          <Text style={styles.rejectButtonText}>Tolak Owner</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.cancelButton} onPress={handleBack}>
          <Text style={styles.cancelButtonText}>Batal & Tutup</Text>
        </TouchableOpacity>
      </View>

      {/* KTP Modal */}
      <Modal
        visible={showKtpModal}
        transparent
        animationType="slide"
        onRequestClose={handleCloseModal}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Foto KTP - {ownerData.name}</Text>
              <TouchableOpacity onPress={handleCloseModal}>
                <MaterialIcons name="close" size={24} color="#6b7280" />
              </TouchableOpacity>
            </View>
            
            <View style={styles.ktpContainer}>
              <View style={styles.ktpPlaceholder}>
                <MaterialIcons name="badge" size={60} color="#d1d5db" />
                <Text style={styles.ktpText}>Foto KTP Owner</Text>
                <Text style={styles.ktpSubtext}>KTP milik {ownerData.name}</Text>
              </View>
            </View>
            
            <View style={styles.modalFooter}>
              <TouchableOpacity style={styles.modalCloseButton} onPress={handleCloseModal}>
                <Text style={styles.modalCloseText}>Tutup</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Spot Photos Modal */}
      <Modal
        visible={showSpotPhotosModal}
        transparent
        animationType="slide"
        onRequestClose={handleCloseModal}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Foto Spot - {ownerData.spotName}</Text>
              <TouchableOpacity onPress={handleCloseModal}>
                <MaterialIcons name="close" size={24} color="#6b7280" />
              </TouchableOpacity>
            </View>
            
            <ScrollView style={styles.photosContainer}>
              {spotPhotos.map((photo, index) => (
                <View key={index} style={styles.photoItem}>
                  <Image source={{ uri: photo }} style={styles.photoImage} />
                  <Text style={styles.photoCaption}>Foto Spot #{index + 1}</Text>
                </View>
              ))}
            </ScrollView>
            
            <View style={styles.modalFooter}>
              <TouchableOpacity style={styles.modalCloseButton} onPress={handleCloseModal}>
                <Text style={styles.modalCloseText}>Tutup</Text>
              </TouchableOpacity>
            </View>
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
  placeholder: {
    width: 40,
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    paddingHorizontal: 16,
    paddingVertical: 20,
    paddingBottom: 120,
  },
  profileSection: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#f1f5f9',
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  profileAvatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    borderWidth: 2,
    borderColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  profileAvatarPlaceholder: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: 'rgba(0, 51, 102, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  profileInitials: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#003366',
  },
  profileInfo: {
    flex: 1,
    marginLeft: 16,
  },
  ownerName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#111518',
    marginBottom: 4,
  },
  verificationBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 51, 102, 0.1)',
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: 'rgba(0, 51, 102, 0.2)',
    marginBottom: 4,
  },
  verificationText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#003366',
    marginLeft: 4,
  },
  ownerId: {
    fontSize: 12,
    color: '#6b7280',
    fontWeight: '500',
  },
  contactInfo: {
    gap: 8,
  },
  contactRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  contactText: {
    fontSize: 14,
    color: '#374151',
  },
  timeText: {
    fontSize: 12,
    color: '#94a3b8',
    fontWeight: '500',
  },
  divider: {
    height: 1,
    backgroundColor: '#e5e7eb',
    marginVertical: 20,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#003366',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 12,
    marginLeft: 4,
  },
  spotInfoCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: '#f1f5f9',
  },
  spotHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  spotIcon: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: 'rgba(0, 51, 102, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  label: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#6b7280',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  spotName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#111518',
  },
  spotDetails: {
    gap: 16,
  },
  detailRow: {
    flexDirection: 'row',
    gap: 16,
  },
  detailColumn: {
    flex: 1,
  },
  typeBadge: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    paddingHorizontal: 8,
    paddingVertical: 6,
    borderRadius: 6,
    alignSelf: 'flex-start',
  },
  typeText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#374151',
  },
  detailText: {
    fontSize: 14,
    color: '#374151',
    fontWeight: '500',
  },
  addressContainer: {
    marginTop: 4,
  },
  addressText: {
    fontSize: 12,
    color: '#6b7280',
    lineHeight: 18,
  },
  mapPreview: {
    height: 128,
    borderRadius: 12,
    overflow: 'hidden',
    position: 'relative',
  },
  mapPlaceholder: {
    flex: 1,
    backgroundColor: '#e5e7eb',
    alignItems: 'center',
    justifyContent: 'center',
  },
  mapBadge: {
    position: 'absolute',
    bottom: 8,
    right: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  mapBadgeText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#003366',
  },
  descriptionContainer: {
    marginTop: 8,
  },
  descriptionBox: {
    backgroundColor: '#f9fafb',
    borderWidth: 1,
    borderColor: '#f3f4f6',
    borderRadius: 12,
    padding: 16,
    marginTop: 8,
  },
  descriptionText: {
    fontSize: 12,
    color: '#6b7280',
    fontStyle: 'italic',
    lineHeight: 18,
  },
  documentActions: {
    flexDirection: 'row',
    gap: 12,
  },
  documentButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 20,
    borderWidth: 2,
    borderColor: 'rgba(0, 51, 102, 0.3)',
    borderStyle: 'dashed',
    borderRadius: 16,
    backgroundColor: 'rgba(0, 51, 102, 0.05)',
  },
  photoButton: {
    borderColor: 'rgba(38, 196, 133, 0.3)',
    backgroundColor: 'rgba(38, 196, 133, 0.05)',
  },
  documentButtonText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#003366',
    marginTop: 8,
  },
  photoButtonText: {
    color: '#26c485',
  },
  actionSection: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#f1f5f9',
    paddingHorizontal: 16,
    paddingVertical: 16,
    paddingBottom: 20,
  },
  approveButton: {
    backgroundColor: '#003366',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 16,
    borderRadius: 12,
    marginBottom: 8,
    shadowColor: '#003366',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  approveButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
  },
  rejectButton: {
    backgroundColor: '#fff',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#fca5a5',
    marginBottom: 8,
  },
  rejectButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#ef4444',
  },
  cancelButton: {
    alignItems: 'center',
    paddingVertical: 12,
  },
  cancelButtonText: {
    fontSize: 12,
    color: '#94a3b8',
    fontWeight: '500',
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
    maxHeight: '80%',
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
  ktpContainer: {
    padding: 20,
    alignItems: 'center',
  },
  ktpPlaceholder: {
    width: '100%',
    height: 200,
    backgroundColor: '#f9fafb',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#e5e7eb',
    borderStyle: 'dashed',
  },
  ktpText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#6b7280',
    marginTop: 12,
  },
  ktpSubtext: {
    fontSize: 12,
    color: '#9ca3af',
    marginTop: 4,
  },
  photosContainer: {
    maxHeight: 400,
  },
  photoItem: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  photoImage: {
    width: '100%',
    height: 200,
    borderRadius: 12,
    backgroundColor: '#f3f4f6',
  },
  photoCaption: {
    fontSize: 12,
    color: '#6b7280',
    textAlign: 'center',
    marginTop: 8,
  },
  modalFooter: {
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#f1f5f9',
  },
  modalCloseButton: {
    backgroundColor: '#003366',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  modalCloseText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
  },
});