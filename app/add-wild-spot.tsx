import React, { useState } from 'react';
import {
  SafeAreaView,
  ScrollView,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  TextInput,
  Image,
  KeyboardAvoidingView,
  Platform,
  Modal,
} from 'react-native';
import { MaterialIcons } from "@expo/vector-icons";
import { router } from 'expo-router';

type FishType = {
  id: string;
  name: string;
  checked: boolean;
};

export default function AddWildSpot() {
  const [spotName, setSpotName] = useState('');
  const [accessibility, setAccessibility] = useState('');
  const [description, setDescription] = useState('');
  const [fishes, setFishes] = useState<FishType[]>([
    { id: '1', name: 'Ikan Mas', checked: false },
    { id: '2', name: 'Lele Liar', checked: true },
    { id: '3', name: 'Gabus', checked: false },
    { id: '4', name: 'Nila', checked: false },
    { id: '5', name: 'Patin', checked: false },
  ]);
  const [showOtherFishModal, setShowOtherFishModal] = useState(false);
  const [otherFishInput, setOtherFishInput] = useState('');

  const handleClose = () => {
    router.back();
  };

  const handleSave = () => {
    console.log('Menyimpan spot:', {
      spotName,
      accessibility,
      description,
      selectedFishes: fishes.filter(fish => fish.checked),
    });
    // Simulasi penyimpanan
    setTimeout(() => {
      router.back();
    }, 1000);
  };

  const toggleFishSelection = (id: string) => {
    setFishes(prev => prev.map(fish => 
      fish.id === id ? { ...fish, checked: !fish.checked } : fish
    ));
  };

  const handleAddOtherFish = () => {
    if (otherFishInput.trim()) {
      setFishes(prev => [
        ...prev,
        { id: Date.now().toString(), name: otherFishInput.trim(), checked: true }
      ]);
      setOtherFishInput('');
      setShowOtherFishModal(false);
    }
  };

  const handleSelectOnMap = () => {
    console.log('Pilih di peta');
    // router.push('/map-selector');
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0B253C" />
      
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <View>
            <Text style={styles.headerTitle}>Tambah Spot Liar</Text>
            <Text style={styles.headerSubtitle}>Fishing Spot Administrator</Text>
          </View>
          <TouchableOpacity style={styles.closeButton} onPress={handleClose}>
            <MaterialIcons name="close" size={20} color="#0B253C" />
          </TouchableOpacity>
        </View>
      </View>

      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <ScrollView 
          style={styles.scrollView}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {/* Nama Spot */}
          <View style={styles.section}>
            <Text style={styles.sectionLabel}>NAMA SPOT</Text>
            <TextInput
              style={styles.input}
              placeholder="Contoh: Muara Sungai Cisadane"
              placeholderTextColor="#94a3b8"
              value={spotName}
              onChangeText={setSpotName}
            />
          </View>

          {/* Lokasi Spot */}
          <View style={styles.section}>
            <Text style={styles.sectionLabel}>LOKASI SPOT</Text>
            <TouchableOpacity 
              style={styles.mapContainer}
              onPress={handleSelectOnMap}
              activeOpacity={0.9}
            >
              <View style={styles.mapImage}>
                {/* Background map placeholder */}
                <View style={styles.mapOverlay} />
                <View style={styles.mapButton}>
                  <MaterialIcons name="add-location-alt" size={20} color="#26c485" />
                  <Text style={styles.mapButtonText}>Pilih di Peta</Text>
                </View>
              </View>
            </TouchableOpacity>
            <View style={styles.infoBox}>
              <MaterialIcons name="info" size={14} color="#ff9f1c" />
              <Text style={styles.infoText}>
                Pastikan titik koordinat akurat agar user mudah menemukan lokasi.
              </Text>
            </View>
          </View>

          <View style={styles.divider} />

          {/* Potensi Ikan */}
          <View style={styles.section}>
            <Text style={styles.sectionLabel}>POTENSI IKAN</Text>
            <View style={styles.fishChipsContainer}>
              {fishes.map((fish) => (
                <TouchableOpacity
                  key={fish.id}
                  style={[
                    styles.fishChip,
                    fish.checked && styles.fishChipSelected
                  ]}
                  onPress={() => toggleFishSelection(fish.id)}
                >
                  {fish.checked && (
                    <MaterialIcons name="check" size={16} color="#fff" style={styles.checkIcon} />
                  )}
                  <Text style={[
                    styles.fishChipText,
                    fish.checked && styles.fishChipTextSelected
                  ]}>
                    {fish.name}
                  </Text>
                </TouchableOpacity>
              ))}
              <TouchableOpacity 
                style={styles.addFishButton}
                onPress={() => setShowOtherFishModal(true)}
              >
                <MaterialIcons name="add" size={16} color="#64748b" />
                <Text style={styles.addFishText}>Lainnya</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Aksesibilitas */}
          <View style={styles.section}>
            <Text style={styles.sectionLabel}>AKSESIBILITAS</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Jelaskan kondisi jalan, parkir, dan jarak jalan kaki..."
              placeholderTextColor="#94a3b8"
              value={accessibility}
              onChangeText={setAccessibility}
              multiline
              numberOfLines={3}
              textAlignVertical="top"
            />
          </View>

          {/* Deskripsi Spot */}
          <View style={styles.section}>
            <Text style={styles.sectionLabel}>DESKRIPSI SPOT</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Ceritakan detail tentang spot ini, waktu terbaik, atau tips..."
              placeholderTextColor="#94a3b8"
              value={description}
              onChangeText={setDescription}
              multiline
              numberOfLines={4}
              textAlignVertical="top"
            />
          </View>

          <View style={styles.divider} />

          {/* Foto Spot */}
          <View style={styles.section}>
            <View style={styles.photoHeader}>
              <Text style={styles.sectionLabel}>FOTO SPOT</Text>
              <View style={styles.maxPhotoBadge}>
                <Text style={styles.maxPhotoText}>Max 5 Foto</Text>
              </View>
            </View>
            <View style={styles.photosGrid}>
              <TouchableOpacity style={styles.uploadPhotoButton}>
                <View style={styles.uploadIconContainer}>
                  <MaterialIcons name="add-a-photo" size={18} color="#0B253C" />
                </View>
                <Text style={styles.uploadText}>Upload</Text>
              </TouchableOpacity>
              <View style={styles.photoPreview}>
                <Image
                  source={{ uri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuClOCNw5leJSSSxc1hm-uTpSS-oa7JPiM0Hc44icrISaUrLwV12MnSIbYRrcGRk2us0i4FjhG7hQ-B5KERwX6WXUdxnUhuzbSvLv_8q5Cmcwv-ihE3niqTkGHLm_BN-IXW-dKznvixTnInA8hW9w-rOL0LDSygio9KEaFblhLS1_HHw0xHIef8WjGKbE-Z0RBFqgPOrtu00jAugPRhaulOPPwW6RZb_PqY7w39mwn5hLuyOOK8Jf5j30oCFfEbUantasE6xi8Ei-VgY' }}
                  style={styles.previewImage}
                />
                <TouchableOpacity style={styles.deletePhotoButton}>
                  <MaterialIcons name="close" size={14} color="#64748b" />
                </TouchableOpacity>
              </View>
            </View>
          </View>

          {/* Spacer untuk tombol */}
          <View style={styles.bottomSpacer} />
        </ScrollView>

        {/* Tombol Simpan */}
        <View style={styles.saveButtonContainer}>
          <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
            <MaterialIcons name="save" size={20} color="#fff" />
            <Text style={styles.saveButtonText}>Simpan & Publikasikan</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>

      {/* Modal Tambah Ikan Lainnya */}
      <Modal
        visible={showOtherFishModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowOtherFishModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Tambah Jenis Ikan</Text>
            <TextInput
              style={styles.modalInput}
              placeholder="Nama ikan"
              placeholderTextColor="#94a3b8"
              value={otherFishInput}
              onChangeText={setOtherFishInput}
              autoFocus
            />
            <View style={styles.modalButtons}>
              <TouchableOpacity 
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setShowOtherFishModal(false)}
              >
                <Text style={styles.cancelButtonText}>Batal</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.modalButton, styles.confirmButton]}
                onPress={handleAddOtherFish}
              >
                <Text style={styles.confirmButtonText}>Tambah</Text>
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
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
    paddingTop: 12,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingBottom: 12,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#0B253C',
  },
  headerSubtitle: {
    fontSize: 12,
    color: '#94a3b8',
    fontWeight: '600',
    marginTop: 2,
  },
  closeButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#f1f5f9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  keyboardView: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingVertical: 20,
  },
  section: {
    marginBottom: 24,
  },
  sectionLabel: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#94a3b8',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 8,
    marginLeft: 4,
  },
  input: {
    backgroundColor: '#f8fafc',
    borderRadius: 16,
    paddingHorizontal: 20,
    paddingVertical: 16,
    fontSize: 14,
    fontWeight: '600',
    color: '#0B253C',
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  textArea: {
    minHeight: 80,
    textAlignVertical: 'top',
  },
  mapContainer: {
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  mapImage: {
    width: '100%',
    aspectRatio: 16/9,
    backgroundColor: '#cbd5e1',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  mapOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(11, 37, 60, 0.3)',
  },
  mapButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.5)',
  },
  mapButtonText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#0B253C',
  },
  infoBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
    paddingHorizontal: 8,
  },
  infoText: {
    flex: 1,
    fontSize: 12,
    color: '#64748b',
    lineHeight: 16,
  },
  divider: {
    height: 1,
    backgroundColor: '#e2e8f0',
    marginVertical: 20,
  },
  fishChipsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  fishChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    backgroundColor: '#fff',
  },
  fishChipSelected: {
    backgroundColor: '#0B253C',
    borderColor: '#0B253C',
    shadowColor: '#0B253C',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 3,
  },
  checkIcon: {
    marginRight: 4,
  },
  fishChipText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#64748b',
  },
  fishChipTextSelected: {
    color: '#fff',
  },
  addFishButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderStyle: 'dashed',
    backgroundColor: '#f8fafc',
    gap: 4,
  },
  addFishText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#64748b',
  },
  photoHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  maxPhotoBadge: {
    backgroundColor: '#f1f5f9',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  maxPhotoText: {
    fontSize: 10,
    color: '#94a3b8',
    fontWeight: '600',
  },
  photosGrid: {
    flexDirection: 'row',
    gap: 12,
  },
  uploadPhotoButton: {
    width: 100,
    aspectRatio: 1,
    borderRadius: 16,
    backgroundColor: 'rgba(11, 37, 60, 0.03)',
    borderWidth: 2,
    borderColor: 'rgba(11, 37, 60, 0.2)',
    borderStyle: 'dashed',
    alignItems: 'center',
    justifyContent: 'center',
  },
  uploadIconContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
  },
  uploadText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: 'rgba(11, 37, 60, 0.7)',
  },
  photoPreview: {
    width: 100,
    aspectRatio: 1,
    borderRadius: 16,
    overflow: 'hidden',
    position: 'relative',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  previewImage: {
    width: '100%',
    height: '100%',
  },
  deletePhotoButton: {
    position: 'absolute',
    top: -6,
    right: -6,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#f1f5f9',
  },
  bottomSpacer: {
    height: 100,
  },
  saveButtonContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#f1f5f9',
    paddingHorizontal: 24,
    paddingVertical: 16,
    paddingBottom: Platform.OS === 'ios' ? 32 : 16,
  },
  saveButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    backgroundColor: '#0B253C',
    paddingVertical: 16,
    borderRadius: 16,
    shadowColor: '#0B253C',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 16,
    elevation: 5,
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
  },
  // Modal styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 24,
    width: '100%',
    maxWidth: 400,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#0B253C',
    marginBottom: 16,
    textAlign: 'center',
  },
  modalInput: {
    backgroundColor: '#f8fafc',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 14,
    color: '#0B253C',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    marginBottom: 20,
  },
  modalButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  modalButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#f1f5f9',
  },
  confirmButton: {
    backgroundColor: '#0B253C',
  },
  cancelButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#64748b',
  },
  confirmButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#fff',
  },
});