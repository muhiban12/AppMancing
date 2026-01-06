import React, { useState, useRef } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  Image,
  ScrollView,
  Alert,
  Modal,
  Dimensions,
  Platform,
} from 'react-native';
import { MaterialIcons } from "@expo/vector-icons";
import { router } from 'expo-router';
import * as FileSystem from 'expo-file-system';
import * as MediaLibrary from 'expo-media-library';
import * as Sharing from 'expo-sharing';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

export default function ViewCompetitionPoster() {
  const [isZoomed, setIsZoomed] = useState(false);
  const [showActions, setShowActions] = useState(false);
  const [downloading, setDownloading] = useState(false);

  const handleBack = () => {
    router.back();
  };

  const handleZoom = () => {
    setIsZoomed(!isZoomed);
  };

  const handleDownload = async () => {
    try {
      setDownloading(true);
      
      // Permissions for iOS
      if (Platform.OS === 'ios') {
        const { status } = await MediaLibrary.requestPermissionsAsync();
        if (status !== 'granted') {
          Alert.alert('Izin diperlukan', 'Izin diperlukan untuk menyimpan gambar.');
          return;
        }
      }

      // Simulasi download (dalam implementasi nyata, gunakan URL poster asli)
      const fileUri = FileSystem.documentDirectory + 'poster-lomba.jpg';
      
      // Untuk demo, kita akan menggunakan sharing karena tidak ada file nyata
      if (await Sharing.isAvailableAsync()) {
        Alert.alert(
          'Download Poster',
          'Pilih aksi:',
          [
            {
              text: 'Simpan ke Galeri',
              onPress: async () => {
                try {
                  const asset = await MediaLibrary.createAssetAsync(fileUri);
                  await MediaLibrary.createAlbumAsync('FishingApp', asset, false);
                  Alert.alert('Berhasil!', 'Poster berhasil disimpan ke galeri.');
                } catch (error) {
                  console.error('Error saving to gallery:', error);
                  Alert.alert('Error', 'Gagal menyimpan ke galeri.');
                }
              }
            },
            {
              text: 'Bagikan',
              onPress: async () => {
                try {
                  await Sharing.shareAsync(fileUri, {
                    mimeType: 'image/jpeg',
                    dialogTitle: 'Bagikan Poster Lomba',
                    UTI: 'public.jpeg'
                  });
                } catch (error) {
                  console.error('Error sharing:', error);
                  Alert.alert('Error', 'Gagal membagikan poster.');
                }
              }
            },
            { text: 'Batal', style: 'cancel' }
          ]
        );
      }
    } catch (error) {
      console.error('Download error:', error);
      Alert.alert('Error', 'Gagal mengunduh poster.');
    } finally {
      setDownloading(false);
    }
  };

  const handleRejectPoster = () => {
    Alert.alert(
      'Tolak Poster',
      'Apakah Anda yakin ingin menolak poster ini?',
      [
        { text: 'Batal', style: 'cancel' },
        { 
          text: 'Tolak', 
          style: 'destructive',
          onPress: () => {
            Alert.alert('Berhasil!', 'Poster telah ditolak.');
            router.back();
          }
        },
      ]
    );
  };

  const handleApprovePoster = () => {
    Alert.alert(
      'Setujui Poster',
      'Apakah Anda yakin ingin menyetujui poster ini?',
      [
        { text: 'Batal', style: 'cancel' },
        { 
          text: 'Setujui', 
          onPress: () => {
            Alert.alert('Berhasil!', 'Poster telah disetujui.');
            router.back();
          }
        },
      ]
    );
  };

  const toggleActions = () => {
    setShowActions(!showActions);
  };

  const posterUrl = 'https://lh3.googleusercontent.com/aida-public/AB6AXuCaGAihSANu355Sh0kG3Zph6GCECruSLxIMNpMN9t8RWQyxnYh1E7idGsaUCdjROr91Kfffw18-xOo0Qwy-ThKugEErqdzzmxXGApLLvWs1URxcOAKpL8maJgITs1ao_Qf3xyjbDW7C7yVrwryLdNAmgUIVpMNS9L6AFxuEYss_-nVSNlKNlWe2OyiHXjNTiUUmMqpd7T5NO-TkCsDazM3NF90E1rLV9nEblnCKs8mOop5lB5amZ8hXoFKCWof82Uut_toisvywNmGH';

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#003366" />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={handleBack}
        >
          <MaterialIcons name="arrow-back" size={24} color="#fff" />
          <Text style={styles.backText}>Kembali</Text>
        </TouchableOpacity>
        
        <Text style={styles.headerTitle}>Lihat Poster</Text>
        
        <TouchableOpacity 
          style={styles.moreButton}
          onPress={toggleActions}
        >
          <MaterialIcons name="more-vert" size={24} color="#fff" />
        </TouchableOpacity>
      </View>

      {/* Image Container */}
      <View style={styles.imageContainer}>
        <ScrollView 
          maximumZoomScale={3}
          minimumZoomScale={1}
          showsHorizontalScrollIndicator={false}
          showsVerticalScrollIndicator={false}
          centerContent={true}
          contentContainerStyle={styles.scrollContent}
        >
          <Image
            source={{ uri: posterUrl }}
            style={[
              styles.posterImage,
              isZoomed && styles.zoomedImage
            ]}
            resizeMode={isZoomed ? 'contain' : 'contain'}
          />
        </ScrollView>
      </View>

      {/* Bottom Actions Panel */}
      <View style={styles.bottomPanel}>
        <View style={styles.posterInfo}>
          <View style={styles.infoContent}>
            <Text style={styles.posterTitle}>Grand Fishing Tournament 2024</Text>
            <View style={styles.submitterInfo}>
              <MaterialIcons name="image" size={16} color="rgba(255,255,255,0.8)" />
              <Text style={styles.submitterText}>Dikirim oleh: Pemilik Spot #8842</Text>
            </View>
          </View>
          
          <View style={styles.quickActions}>
            <TouchableOpacity 
              style={styles.iconButton}
              onPress={handleZoom}
              disabled={downloading}
            >
              <MaterialIcons 
                name={isZoomed ? "zoom-out" : "zoom-in"} 
                size={20} 
                color="#fff" 
              />
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.iconButton}
              onPress={handleDownload}
              disabled={downloading}
            >
              {downloading ? (
                <MaterialIcons name="download-for-offline" size={20} color="#fff" />
              ) : (
                <MaterialIcons name="download" size={20} color="#fff" />
              )}
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.actionButtons}>
          <TouchableOpacity 
            style={styles.rejectButton}
            onPress={handleRejectPoster}
            disabled={downloading}
          >
            <MaterialIcons name="close" size={20} color="#fca5a5" />
            <Text style={styles.rejectButtonText}>Tolak Poster</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.approveButton}
            onPress={handleApprovePoster}
            disabled={downloading}
          >
            <MaterialIcons name="check" size={20} color="#fff" />
            <Text style={styles.approveButtonText}>Setujui Poster</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Actions Modal */}
      <Modal
        visible={showActions}
        transparent
        animationType="fade"
        onRequestClose={() => setShowActions(false)}
      >
        <TouchableOpacity 
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setShowActions(false)}
        >
          <View style={styles.actionsModal}>
            <TouchableOpacity 
              style={styles.actionItem}
              onPress={() => {
                setShowActions(false);
                handleDownload();
              }}
            >
              <MaterialIcons name="download" size={20} color="#64748b" />
              <Text style={styles.actionText}>Download Poster</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.actionItem}
              onPress={() => {
                setShowActions(false);
                // router.push('/poster-details');
              }}
            >
              <MaterialIcons name="info" size={20} color="#64748b" />
              <Text style={styles.actionText}>Info Detail</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.actionItem}
              onPress={() => {
                setShowActions(false);
                // router.push('/report-poster');
              }}
            >
              <MaterialIcons name="flag" size={20} color="#ef4444" />
              <Text style={[styles.actionText, styles.reportText]}>Laporkan Poster</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.95)',
  },
  header: {
    backgroundColor: '#003366',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    padding: 4,
  },
  backText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '500',
  },
  headerTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  moreButton: {
    padding: 4,
  },
  imageContainer: {
    flex: 1,
    backgroundColor: '#000',
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  posterImage: {
    width: screenWidth,
    height: screenHeight * 0.7,
  },
  zoomedImage: {
    width: screenWidth * 1.5,
    height: screenHeight * 1.5,
  },
  bottomPanel: {
    backgroundColor: 'rgba(0, 0, 0, 0.9)',
    paddingTop: 20,
    paddingBottom: Platform.OS === 'ios' ? 40 : 20,
    paddingHorizontal: 20,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.1)',
  },
  posterInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  infoContent: {
    flex: 1,
    marginRight: 16,
  },
  posterTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
  },
  submitterInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  submitterText: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  quickActions: {
    flexDirection: 'row',
    gap: 8,
  },
  iconButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    backdropFilter: 'blur(10px)',
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 12,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.1)',
  },
  rejectButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 14,
    backgroundColor: 'rgba(239, 68, 68, 0.2)',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(239, 68, 68, 0.3)',
  },
  rejectButtonText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#fca5a5',
  },
  approveButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 14,
    backgroundColor: '#2b9dee',
    borderRadius: 12,
    shadowColor: '#2b9dee',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  approveButtonText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#fff',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-start',
    alignItems: 'flex-end',
    paddingTop: 60,
    paddingRight: 16,
  },
  actionsModal: {
    backgroundColor: '#fff',
    borderRadius: 12,
    minWidth: 200,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
    overflow: 'hidden',
  },
  actionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  actionText: {
    fontSize: 14,
    color: '#334155',
    fontWeight: '500',
  },
  reportText: {
    color: '#ef4444',
  },
});