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
  Modal,
  Platform,
  Alert,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';

export default function AddWildSpot() {
  const [spotName, setSpotName] = useState('');
  const [description, setDescription] = useState('');
  const [address, setAddress] = useState('');
  const [openTime, setOpenTime] = useState('');
  const [closeTime, setCloseTime] = useState('');
  const [pricePerHour, setPricePerHour] = useState('');
  const [capacity, setCapacity] = useState('');
  const [mainImage, setMainImage] = useState<string | null>(null);
  const [modalVisible, setModalVisible] = useState(true);

  const handleCloseModal = () => {
    setModalVisible(false);
    router.back();
  };

  const handlePickImage = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });

      if (!result.canceled) {
        setMainImage(result.assets[0].uri);
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

  const handleSubmitSpot = () => {
    if (!spotName.trim()) {
      Alert.alert('Error', 'Nama spot tidak boleh kosong');
      return;
    }

    if (!address.trim()) {
      Alert.alert('Error', 'Alamat tidak boleh kosong');
      return;
    }

    if (!openTime || !closeTime) {
      Alert.alert('Error', 'Jam operasional harus diisi');
      return;
    }

    const price = parseInt(pricePerHour) || 0;
    const cap = parseInt(capacity) || 0;

    if (price <= 0) {
      Alert.alert('Error', 'Harga per jam harus lebih dari 0');
      return;
    }

    if (cap <= 0) {
      Alert.alert('Error', 'Kapasitas kursi harus lebih dari 0');
      return;
    }

    console.log('Submitting spot:', {
      spotName,
      description,
      address,
      openTime,
      closeTime,
      pricePerHour: price,
      capacity: cap,
      hasImage: !!mainImage,
    });

    Alert.alert(
      'Sukses!',
      'Spot berhasil diajukan. Akan ditinjau oleh admin dalam 1-24 jam.',
      [
        {
          text: 'OK',
          onPress: () => {
            handleCloseModal();
            // Navigate back to my-spots or refresh list
            router.push('/my-spot');
          },
        },
      ]
    );
  };

  const handleCancel = () => {
    handleCloseModal();
  };

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={modalVisible}
      onRequestClose={handleCloseModal}
    >
      <SafeAreaView style={styles.modalContainer}>
        <StatusBar barStyle="dark-content" backgroundColor="rgba(0, 0, 0, 0.5)" />
        
        {/* Modal Content */}
        <View style={styles.modalContent}>
          {/* Modal Header */}
          <View style={styles.modalHeader}>
            <View>
              <Text style={styles.modalTitle}>Tambah Spot Baru</Text>
              <Text style={styles.modalSubtitle}>Isi detail lokasi pemancingan</Text>
            </View>
            <TouchableOpacity 
              style={styles.closeButton}
              onPress={handleCloseModal}
            >
              <MaterialIcons name="close" size={24} color="#94a3b8" />
            </TouchableOpacity>
          </View>

          {/* Modal Body */}
          <ScrollView 
            style={styles.modalBody}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.modalBodyContent}
          >
            {/* Spot Name */}
            <View style={styles.formGroup}>
              <Text style={styles.formLabel}>NAMA SPOT</Text>
              <View style={styles.inputContainer}>
                <MaterialIcons name="storefront" size={18} color="#94a3b8" />
                <TextInput
                  style={styles.textInput}
                  placeholder="Contoh: Pemancingan Barokah"
                  placeholderTextColor="#94a3b8"
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
                placeholder="Jelaskan fasilitas, aturan main, dan keunggulan spot Anda..."
                placeholderTextColor="#94a3b8"
                value={description}
                onChangeText={setDescription}
                multiline
                numberOfLines={3}
                textAlignVertical="top"
              />
            </View>

            {/* Address */}
            <View style={styles.formGroup}>
              <Text style={styles.formLabel}>ALAMAT LENGKAP</Text>
              <TextInput
                style={[styles.textInput, styles.addressInput]}
                placeholder="Jl. Kapten Tendean..."
                placeholderTextColor="#94a3b8"
                value={address}
                onChangeText={setAddress}
                multiline
                numberOfLines={2}
                textAlignVertical="top"
              />
              
              {/* Map Placeholder */}
              <TouchableOpacity 
                style={styles.mapPlaceholder}
                onPress={handleOpenMap}
              >
                <View style={styles.mapBackground}>
                  <View style={styles.mapMarker}>
                    <MaterialIcons name="add-location" size={20} color="#0f4c81" />
                    <Text style={styles.mapMarkerText}>Set Lokasi di Peta</Text>
                  </View>
                </View>
              </TouchableOpacity>
            </View>

            {/* Operating Hours */}
            <View style={styles.formGroup}>
              <Text style={styles.formLabel}>JAM OPERASIONAL</Text>
              <View style={styles.timeInputs}>
                <View style={styles.timeInputContainer}>
                  <MaterialIcons name="schedule" size={18} color="#94a3b8" />
                  <TextInput
                    style={styles.timeInput}
                    placeholder="Buka"
                    placeholderTextColor="#94a3b8"
                    value={openTime}
                    onChangeText={setOpenTime}
                  />
                </View>
                
                <View style={styles.timeInputContainer}>
                  <MaterialIcons name="schedule" size={18} color="#94a3b8" />
                  <TextInput
                    style={styles.timeInput}
                    placeholder="Tutup"
                    placeholderTextColor="#94a3b8"
                    value={closeTime}
                    onChangeText={setCloseTime}
                  />
                </View>
              </View>
            </View>

            {/* Price & Capacity */}
            <View style={styles.rowContainer}>
              <View style={[styles.formGroup, styles.halfWidth]}>
                <Text style={styles.formLabel}>HARGA / JAM</Text>
                <View style={styles.currencyInputContainer}>
                  <Text style={styles.currencySymbol}>Rp</Text>
                  <TextInput
                    style={styles.currencyInput}
                    placeholder="0"
                    placeholderTextColor="#94a3b8"
                    keyboardType="numeric"
                    value={pricePerHour}
                    onChangeText={setPricePerHour}
                  />
                </View>
              </View>

              <View style={[styles.formGroup, styles.halfWidth]}>
                <Text style={styles.formLabel}>KAPASITAS KURSI</Text>
                <View style={styles.capacityInputContainer}>
                  <TextInput
                    style={styles.capacityInput}
                    placeholder="Total"
                    placeholderTextColor="#94a3b8"
                    keyboardType="numeric"
                    value={capacity}
                    onChangeText={setCapacity}
                  />
                  <MaterialIcons name="chair" size={18} color="#94a3b8" />
                </View>
              </View>
            </View>

            {/* Image Upload */}
            <View style={styles.formGroup}>
              <Text style={styles.formLabel}>UPLOAD FOTO UTAMA</Text>
              <TouchableOpacity 
                style={styles.imageUploadContainer}
                onPress={handlePickImage}
              >
                {mainImage ? (
                  <View style={styles.imagePreview}>
                    <Text style={styles.imageUploadedText}>Foto sudah dipilih</Text>
                    <TouchableOpacity 
                      style={styles.changeImageButton}
                      onPress={handlePickImage}
                    >
                      <Text style={styles.changeImageText}>Ubah Foto</Text>
                    </TouchableOpacity>
                  </View>
                ) : (
                  <View style={styles.uploadPlaceholder}>
                    <View style={styles.uploadIconContainer}>
                      <MaterialIcons name="add-a-photo" size={24} color="#94a3b8" />
                    </View>
                    <Text style={styles.uploadTitle}>Tap untuk upload</Text>
                    <Text style={styles.uploadSubtitle}>Format JPG/PNG, Max 5MB</Text>
                  </View>
                )}
              </TouchableOpacity>
            </View>

            {/* Info Banner */}
            <View style={styles.infoBanner}>
              <MaterialIcons name="info" size={20} color="#ff9f43" />
              <View>
                <Text style={styles.infoTitle}>Info Penting</Text>
                <Text style={styles.infoText}>
                  Spot Anda akan ditinjau oleh Admin (1-24 jam) sebelum ditampilkan secara publik.
                </Text>
              </View>
            </View>
          </ScrollView>

          {/* Modal Footer */}
          <View style={styles.modalFooter}>
            <TouchableOpacity 
              style={styles.cancelButton}
              onPress={handleCancel}
            >
              <Text style={styles.cancelButtonText}>Batal</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.submitButton}
              onPress={handleSubmitSpot}
            >
              <Text style={styles.submitButtonText}>Ajukan Spot</Text>
              <MaterialIcons name="arrow-forward" size={18} color="#fff" />
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(27, 20, 100, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  modalContent: {
    width: '100%',
    maxWidth: 480,
    backgroundColor: '#fff',
    borderRadius: 24,
    maxHeight: '90%',
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 20,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#fff',
    paddingHorizontal: 20,
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#0f4c81',
  },
  modalSubtitle: {
    fontSize: 12,
    color: '#94a3b8',
    marginTop: 4,
  },
  closeButton: {
    padding: 8,
    borderRadius: 20,
  },
  modalBody: {
    maxHeight: '70%',
  },
  modalBodyContent: {
    padding: 20,
    paddingBottom: 20,
    gap: 20,
  },
  modalFooter: {
    flexDirection: 'row',
    gap: 12,
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#f1f5f9',
    backgroundColor: '#fff',
  },
  formGroup: {
    gap: 8,
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
  addressInput: {
    minHeight: 60,
    backgroundColor: '#f9fafb',
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    textAlignVertical: 'top',
    marginBottom: 12,
  },
  mapPlaceholder: {
    height: 128,
    borderRadius: 12,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  mapBackground: {
    flex: 1,
    backgroundColor: '#f1f5f9',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  mapMarker: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
  mapMarkerText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#0f4c81',
  },
  timeInputs: {
    flexDirection: 'row',
    gap: 12,
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
    color: '#111518',
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
    color: '#111518',
    marginRight: 12,
  },
  imageUploadContainer: {
    borderWidth: 2,
    borderStyle: 'dashed',
    borderColor: '#d1d5db',
    borderRadius: 12,
    backgroundColor: '#f9fafb',
    padding: 24,
    alignItems: 'center',
  },
  uploadPlaceholder: {
    alignItems: 'center',
    gap: 8,
  },
  uploadIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#e5e7eb',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  uploadTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#6b7280',
  },
  uploadSubtitle: {
    fontSize: 10,
    color: '#9ca3af',
  },
  imagePreview: {
    alignItems: 'center',
    gap: 8,
  },
  imageUploadedText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#2ecc71',
  },
  changeImageButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: '#0f4c81',
    borderRadius: 8,
  },
  changeImageText: {
    fontSize: 11,
    fontWeight: '500',
    color: '#fff',
  },
  infoBanner: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    backgroundColor: 'rgba(255, 159, 67, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(255, 159, 67, 0.2)',
    borderRadius: 12,
    padding: 12,
  },
  infoTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#ff9f43',
    marginBottom: 4,
  },
  infoText: {
    fontSize: 11,
    color: '#6b7280',
    lineHeight: 16,
  },
  cancelButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  cancelButtonText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#6b7280',
  },
  submitButton: {
    flex: 2,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 14,
    borderRadius: 12,
    backgroundColor: '#ff9f43',
    shadowColor: '#ff9f43',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 8,
  },
  submitButtonText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#fff',
  },
});