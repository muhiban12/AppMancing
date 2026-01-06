import React, { useState } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  TextInput,
  StatusBar,
  Image,
  Alert,
  Platform,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';

export default function EditWildSpot() {
  const [spotName, setSpotName] = useState('Telaga Berkah Fishing');
  const [description, setDescription] = useState('Tempat mancing keluarga dengan suasana asri, dilengkapi saung gazebo, kantin bersih, dan musholla.');
  const [pricePerHour, setPricePerHour] = useState('50000');
  const [capacity, setCapacity] = useState('45');
  const [openTime, setOpenTime] = useState('08:00');
  const [closeTime, setCloseTime] = useState('18:00');
  const [address, setAddress] = useState('Jl. Raya Mancing No. 12, Bogor Selatan, Jawa Barat 16123');
  const [gpsLocation, setGpsLocation] = useState('-6.595038, 106.816635');
  const [mainImage, setMainImage] = useState<string | null>('https://lh3.googleusercontent.com/aida-public/AB6AXuCIyYjY4tG1zCJZlUyEO8PdGUULB8kbeo44NK4Rsjpd6AI6D1nGrMlh4zRrIz-VxmSVciI7KzvYZhdcrfvI3ll_7aRmyTT2SdlIAC8M-4hNr9VFvhCcqsCwPy5hphv3AI-nVpjKSpEtkRJb0KByecwe6ctJ0gSxTjVArgaduAStawKk4bJSZvifPV7xuP1d6oHuEESWieZIRaTkuCzeD0obL2LRt4_NYpj9B4N6hGBfNIFd1pryDu65V3MaxvgrUMAMFFVWFN-xsTnH');

  const handleBack = () => {
    router.back();
  };

  const handleChangePhoto = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [16, 9],
        quality: 0.8,
      });

      if (!result.canceled) {
        setMainImage(result.assets[0].uri);
        Alert.alert('Sukses', 'Foto berhasil diubah');
      }
    } catch (error) {
      console.error('Error picking image:', error);
      Alert.alert('Error', 'Gagal memilih gambar');
    }
  };

  const handleOpenMap = () => {
    console.log('Open map to set location');
    Alert.alert('Peta', 'Fitur peta akan segera hadir!');
  };

  const handleSaveChanges = () => {
    if (!spotName.trim()) {
      Alert.alert('Error', 'Nama spot tidak boleh kosong');
      return;
    }

    if (!address.trim()) {
      Alert.alert('Error', 'Alamat tidak boleh kosong');
      return;
    }

    const price = parseInt(pricePerHour) || 0;
    const cap = parseInt(capacity) || 0;

    if (price <= 0) {
      Alert.alert('Error', 'Harga per jam harus lebih dari 0');
      return;
    }

    if (cap <= 0) {
      Alert.alert('Error', 'Kapasitas harus lebih dari 0');
      return;
    }

    console.log('Saving changes:', {
      spotName,
      description,
      pricePerHour: price,
      capacity: cap,
      openTime,
      closeTime,
      address,
      gpsLocation,
      hasNewImage: mainImage !== 'https://lh3.googleusercontent.com/aida-public/AB6AXuCIyYjY4tG1zCJZlUyEO8PdGUULB8kbeo44NK4Rsjpd6AI6D1nGrMlh4zRrIz-VxmSVciI7KzvYZhdcrfvI3ll_7aRmyTT2SdlIAC8M-4hNr9VFvhCcqsCwPy5hphv3AI-nVpjKSpEtkRJb0KByecwe6ctJ0gSxTjVArgaduAStawKk4bJSZvifPV7xuP1d6oHuEESWieZIRaTkuCzeD0obL2LRt4_NYpj9B4N6hGBfNIFd1pryDu65V3MaxvgrUMAMFFVWFN-xsTnH',
    });

    Alert.alert(
      'Sukses!',
      'Perubahan berhasil disimpan.',
      [
        {
          text: 'OK',
          onPress: () => router.back(),
        },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={handleBack}>
          <MaterialIcons name="arrow-back" size={24} color="#111518" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Edit Detail Spot</Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView 
        style={styles.content}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.contentContainer}
      >
        {/* Main Photo Section */}
        <View style={styles.photoSection}>
          <Text style={styles.sectionLabel}>FOTO UTAMA</Text>
          <TouchableOpacity 
            style={styles.photoContainer}
            onPress={handleChangePhoto}
          >
            {mainImage ? (
              <Image source={{ uri: mainImage }} style={styles.photoImage} />
            ) : (
              <View style={styles.photoPlaceholder} />
            )}
            
            <View style={styles.photoOverlay}>
              <TouchableOpacity style={styles.changePhotoButton}>
                <MaterialIcons name="add-a-photo" size={20} color="#0f4c81" />
                <Text style={styles.changePhotoText}>Ganti Foto</Text>
              </TouchableOpacity>
            </View>
            
            <View style={styles.photoInfo}>
              <Text style={styles.photoInfoText}>Max 5MB (JPG/PNG)</Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* Basic Info Card */}
        <View style={styles.card}>
          {/* Spot Name */}
          <View style={styles.formGroup}>
            <Text style={styles.formLabel}>NAMA SPOT</Text>
            <View style={styles.inputContainer}>
              <MaterialIcons name="storefront" size={20} color="#94a3b8" />
              <TextInput
                style={styles.textInput}
                value={spotName}
                onChangeText={setSpotName}
              />
            </View>
          </View>

          {/* Description */}
          <View style={styles.formGroup}>
            <Text style={styles.formLabel}>DESKRIPSI</Text>
            <TextInput
              style={[styles.textInput, styles.textArea]}
              value={description}
              onChangeText={setDescription}
              multiline
              numberOfLines={3}
              textAlignVertical="top"
            />
          </View>
        </View>

        {/* Pricing & Capacity Card */}
        <View style={styles.card}>
          <View style={styles.rowContainer}>
            {/* Price per Hour */}
            <View style={[styles.formGroup, styles.halfWidth]}>
              <Text style={styles.formLabel}>HARGA / JAM</Text>
              <View style={styles.currencyInputContainer}>
                <Text style={styles.currencySymbol}>Rp</Text>
                <TextInput
                  style={styles.currencyInput}
                  keyboardType="numeric"
                  value={pricePerHour}
                  onChangeText={setPricePerHour}
                />
              </View>
            </View>

            {/* Capacity */}
            <View style={[styles.formGroup, styles.halfWidth]}>
              <Text style={styles.formLabel}>KAPASITAS</Text>
              <View style={styles.capacityInputContainer}>
                <MaterialIcons name="chair" size={20} color="#94a3b8" />
                <TextInput
                  style={styles.capacityInput}
                  keyboardType="numeric"
                  value={capacity}
                  onChangeText={setCapacity}
                />
                <Text style={styles.capacityUnit}>Pax</Text>
              </View>
            </View>
          </View>

          {/* Operating Hours */}
          <View style={styles.formGroup}>
            <Text style={styles.formLabel}>JAM OPERASIONAL</Text>
            <View style={styles.timeInputs}>
              <View style={styles.timeInputContainer}>
                <MaterialIcons name="schedule" size={20} color="#94a3b8" />
                <TextInput
                  style={styles.timeInput}
                  value={openTime}
                  onChangeText={setOpenTime}
                  placeholder="08:00"
                />
              </View>
              
              <Text style={styles.timeSeparator}>-</Text>
              
              <View style={styles.timeInputContainer}>
                <MaterialIcons name="schedule" size={20} color="#94a3b8" />
                <TextInput
                  style={styles.timeInput}
                  value={closeTime}
                  onChangeText={setCloseTime}
                  placeholder="18:00"
                />
              </View>
            </View>
          </View>
        </View>

        {/* Location Card */}
        <View style={styles.card}>
          {/* Address */}
          <View style={styles.formGroup}>
            <Text style={styles.formLabel}>ALAMAT LENGKAP</Text>
            <View style={styles.addressInputContainer}>
              <MaterialIcons name="pin-drop" size={20} color="#94a3b8" />
              <TextInput
                style={[styles.textInput, styles.addressInput]}
                value={address}
                onChangeText={setAddress}
                multiline
                numberOfLines={2}
                textAlignVertical="top"
              />
            </View>
          </View>

          {/* Map Location */}
          <View style={styles.formGroup}>
            <View style={styles.locationHeader}>
              <Text style={styles.formLabel}>LOKASI DI PETA (GPS)</Text>
              <View style={styles.gpsStatus}>
                <Text style={styles.gpsStatusText}>Terisi</Text>
              </View>
            </View>
            
            <TouchableOpacity 
              style={styles.mapContainer}
              onPress={handleOpenMap}
            >
              <View style={styles.mapBackground}>
                {/* Map Pattern Background */}
                <View style={styles.mapPattern} />
                
                {/* Road lines */}
                <View style={styles.roadLine1} />
                <View style={styles.roadLine2} />
                
                {/* Location Marker */}
                <View style={styles.locationMarker}>
                  <MaterialIcons name="location-on" size={36} color="#ef4444" />
                </View>
                
                {/* Set Location Button */}
                <View style={styles.setLocationButton}>
                  <MaterialIcons name="edit-location-alt" size={18} color="#0f4c81" />
                  <Text style={styles.setLocationText}>Set Lokasi di Peta</Text>
                </View>
                
                {/* GPS Coordinates */}
                <View style={styles.gpsCoordinates}>
                  <Text style={styles.gpsText}>{gpsLocation}</Text>
                </View>
              </View>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.bottomSpacer} />
      </ScrollView>

      {/* Save Button */}
      <View style={styles.saveButtonContainer}>
        <TouchableOpacity 
          style={styles.saveButton}
          onPress={handleSaveChanges}
        >
          <MaterialIcons name="save" size={20} color="#fff" />
          <Text style={styles.saveButtonText}>Simpan Perubahan</Text>
        </TouchableOpacity>
      </View>
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
    textAlign: 'center',
    flex: 1,
  },
  headerSpacer: {
    width: 40,
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    padding: 20,
    paddingBottom: 100,
  },
  photoSection: {
    gap: 8,
    marginBottom: 24,
  },
  sectionLabel: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#6b7280',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    paddingLeft: 4,
  },
  photoContainer: {
    borderRadius: 20,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#e5e7eb',
    backgroundColor: '#f9fafb',
    aspectRatio: 16/9,
    position: 'relative',
  },
  photoImage: {
    width: '100%',
    height: '100%',
    opacity: 0.9,
  },
  photoPlaceholder: {
    width: '100%',
    height: '100%',
    backgroundColor: '#e5e7eb',
  },
  photoOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  changePhotoButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 8,
  },
  changePhotoText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#0f4c81',
  },
  photoInfo: {
    position: 'absolute',
    bottom: 12,
    right: 12,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    backdropFilter: 'blur(10px)',
  },
  photoInfoText: {
    fontSize: 10,
    color: '#fff',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: '#f1f5f9',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  formGroup: {
    gap: 8,
    marginBottom: 16,
  },
  formLabel: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#374151',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: '#f9fafb',
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  textInput: {
    flex: 1,
    fontSize: 14,
    fontWeight: '500',
    color: '#111518',
  },
  textArea: {
    minHeight: 80,
    backgroundColor: '#f9fafb',
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    textAlignVertical: 'top',
  },
  rowContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  halfWidth: {
    flex: 1,
  },
  currencyInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f9fafb',
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 12,
    overflow: 'hidden',
  },
  currencySymbol: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#374151',
    paddingHorizontal: 16,
    paddingVertical: 14,
    backgroundColor: '#f3f4f6',
    borderRightWidth: 1,
    borderRightColor: '#e5e7eb',
  },
  currencyInput: {
    flex: 1,
    fontSize: 14,
    fontWeight: '500',
    color: '#111518',
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  capacityInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f9fafb',
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  capacityInput: {
    flex: 1,
    fontSize: 14,
    fontWeight: '500',
    color: '#111518',
    marginLeft: 12,
  },
  capacityUnit: {
    fontSize: 12,
    color: '#94a3b8',
    fontWeight: '500',
  },
  timeInputs: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  timeInputContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: '#f9fafb',
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  timeInput: {
    flex: 1,
    fontSize: 14,
    fontWeight: '500',
    color: '#111518',
  },
  timeSeparator: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#94a3b8',
    paddingHorizontal: 8,
  },
  addressInputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    backgroundColor: '#f9fafb',
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    minHeight: 60,
  },
  addressInput: {
    flex: 1,
    fontSize: 14,
    fontWeight: '500',
    color: '#111518',
    textAlignVertical: 'top',
  },
  locationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  gpsStatus: {
    backgroundColor: '#2ecc7110',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: '#2ecc7120',
  },
  gpsStatusText: {
    fontSize: 10,
    fontWeight: '500',
    color: '#2ecc71',
    textTransform: 'uppercase',
  },
  mapContainer: {
    height: 144,
    borderRadius: 12,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  mapBackground: {
    flex: 1,
    backgroundColor: '#f1f5f9',
    position: 'relative',
  },
  mapPattern: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#e5e7eb',
    opacity: 0.3,
  },
  roadLine1: {
    position: 'absolute',
    top: '50%',
    left: 0,
    right: 0,
    height: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.6)',
    transform: [{ translateY: -8 }, { rotate: '-6deg' }],
  },
  roadLine2: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: '33%',
    width: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.6)',
    transform: [{ rotate: '12deg' }],
  },
  locationMarker: {
    position: 'absolute',
    top: '50%',
    left: '33%',
    transform: [{ translateY: -24 }, { translateX: -18 }],
  },
  setLocationButton: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: [{ translateY: 20 }, { translateX: -80 }],
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
  setLocationText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#0f4c81',
  },
  gpsCoordinates: {
    position: 'absolute',
    bottom: 8,
    left: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  gpsText: {
    fontSize: 10,
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
    color: '#374151',
  },
  bottomSpacer: {
    height: 20,
  },
  saveButtonContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#fff',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: '#e2e8f0',
    paddingBottom: Platform.OS === 'ios' ? 32 : 16,
  },
  saveButton: {
    backgroundColor: '#ff9f43',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 16,
    borderRadius: 16,
    shadowColor: '#ff9f43',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 8,
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
  },
});