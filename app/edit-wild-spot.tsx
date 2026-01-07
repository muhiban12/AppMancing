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
  Alert,
} from 'react-native';
import { MaterialIcons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from 'expo-router';

type FishType = {
  id: string;
  name: string;
  checked: boolean;
};

export default function EditWildSpot() {
  const params = useLocalSearchParams();
  const spotId = params.id as string;
  
  const [spotName, setSpotName] = useState('Muara Sungai Cisadane');
  const [location, setLocation] = useState('Tangerang, Banten');
  const [accessibility, setAccessibility] = useState('Jalan masuk mobil aman sampai bibir sungai, parkir luas dikelola warga sekitar Rp 5.000.');
  const [description, setDescription] = useState('Air cenderung keruh saat hujan, arus tenang. Spot favorit warga lokal saat sore hari. Banyak warung kopi di sekitar spot.');
  
  const [fishes, setFishes] = useState<FishType[]>([
    { id: '1', name: 'Barramundi', checked: true },
    { id: '2', name: 'Kakap Putih', checked: true },
    { id: '3', name: 'Gabus', checked: false },
    { id: '4', name: 'Nila', checked: false },
    { id: '5', name: 'Lele', checked: false },
    { id: '6', name: 'Kerapu', checked: false },
  ]);
  
  const [photos] = useState([
    { id: '1', uri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAktWrIaj3uUyswaaVJ3J3BPQzPvzdf5Za1hnMxvg_tQtplf2qNxZ3Y-xDXDn_I1A39c_oXmf_GYL-ZDtgVbl8r9nVoJ6UZiVVNqfaVZnjlzTQQQnsSwvaMJZwXfI0waKxa4u_48-OspTCXWKKNPe2Qc4PDtU2Pd6ZTecpnMvdBOfeqLpQEOB6lN3d_cSjaNo0Vo9oqB7ikUiSmemxC7TuFTi7Ap8w9NNtZuhwsS0LQoIHtMxF1aNA4WCzBln92vzCGMoQ8-CSeghYE' },
    { id: '2', uri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD8KAYETfcVFw6ZwtWSMqloE_iTFPjRwZtV-HoXN2pT9wT0_-7jh0zWGL8LZiez0x84XHn1o0kxBufwaSKFXuo50WSFdJVVPnc9-zlQhUdCE3LYL5DQoZrby8I14G_5JKPHMcOxDM84ANKQzhAVq0Jr-G9CoCx6u5rcnSjVJdbU67caGBKCqt5Ql3ytRudzQx7U-NJ6lOUnV3i9OoWeoqayp3XR1_aC4A6cxV2nm-63CkqJqEhbmuAQl4LXWCE-ogPaQx1Ws_wPuxkR' },
  ]);

  const handleBack = () => {
    router.back();
  };

  const handleSave = () => {
    console.log('Menyimpan perubahan spot:', {
      spotId,
      spotName,
      location,
      accessibility,
      description,
      selectedFishes: fishes.filter(fish => fish.checked),
    });
    
    Alert.alert(
      'Berhasil!',
      'Perubahan spot telah disimpan.',
      [{ text: 'OK', onPress: () => router.back() }]
    );
  };

  const toggleFishSelection = (id: string) => {
    setFishes(prev => prev.map(fish => 
      fish.id === id ? { ...fish, checked: !fish.checked } : fish
    ));
  };

  const handleSelectOnMap = () => {
    console.log('Pilih lokasi di peta');
    // router.push('/map-selector');
  };

  const handlePinpointAdjust = () => {
    console.log('Sesuaikan pinpoint');
    // router.push('/pinpoint-adjust');
  };

  const handleDeletePhoto = (photoId: string) => {
    Alert.alert(
      'Hapus Foto',
      'Apakah Anda yakin ingin menghapus foto ini?',
      [
        { text: 'Batal', style: 'cancel' },
        { 
          text: 'Hapus', 
          style: 'destructive',
          onPress: () => console.log('Hapus foto:', photoId)
        },
      ]
    );
  };

  const handleViewAllPhotos = () => {
    console.log('Lihat semua foto');
    // router.push('/spot-photos');
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0B253C" />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={handleBack}>
          <MaterialIcons name="arrow-back" size={26} color="#fff" />
        </TouchableOpacity>
        
        <Text style={styles.headerTitle}>Edit Spot Liar</Text>
        
        <View style={styles.placeholder} />
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
          {/* Informasi Utama */}
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <View style={[styles.indicator, { backgroundColor: '#0B253C' }]} />
              <Text style={styles.cardTitle}>INFORMASI UTAMA</Text>
            </View>
            
            <View style={styles.formGroup}>
              <Text style={styles.label}>Nama Spot Liar</Text>
              <View style={styles.inputContainer}>
                <TextInput
                  style={styles.input}
                  placeholder="Nama tempat mancing..."
                  placeholderTextColor="#94a3b8"
                  value={spotName}
                  onChangeText={setSpotName}
                />
                <MaterialIcons name="edit" size={20} color="#94a3b8" style={styles.inputIcon} />
              </View>
            </View>
            
            <View style={styles.formGroup}>
              <Text style={styles.label}>Lokasi Spot</Text>
              <View style={styles.locationInputRow}>
                <View style={[styles.inputContainer, styles.flex1]}>
                  <MaterialIcons name="location-on" size={20} color="#0B253C" style={styles.leftIcon} />
                  <TextInput
                    style={[styles.input, styles.withLeftIcon]}
                    placeholder="Cari lokasi..."
                    placeholderTextColor="#94a3b8"
                    value={location}
                    onChangeText={setLocation}
                  />
                </View>
                <TouchableOpacity style={styles.mapButton} onPress={handleSelectOnMap}>
                  <MaterialIcons name="map" size={20} color="#0B253C" />
                </TouchableOpacity>
              </View>
              
              <TouchableOpacity 
                style={styles.mapPreview}
                onPress={handlePinpointAdjust}
                activeOpacity={0.8}
              >
                <View style={styles.mapPlaceholder} />
                <View style={styles.pinpointButton}>
                  <Text style={styles.pinpointText}>Sesuaikan Pinpoint</Text>
                  <MaterialIcons name="open-in-new" size={16} color="#0B253C" />
                </View>
              </TouchableOpacity>
            </View>
          </View>

          {/* Potensi Ikan */}
          <View style={styles.card}>
            <View style={styles.cardHeaderWithBadge}>
              <View style={styles.cardHeaderLeft}>
                <View style={[styles.indicator, { backgroundColor: '#26c485' }]} />
                <Text style={styles.cardTitle}>POTENSI IKAN</Text>
              </View>
              <View style={styles.badge}>
                <Text style={styles.badgeText}>Multi-select</Text>
              </View>
            </View>
            
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
                  <Text style={[
                    styles.fishChipText,
                    fish.checked && styles.fishChipTextSelected
                  ]}>
                    {fish.name}
                  </Text>
                  {fish.checked && (
                    <MaterialIcons name="check" size={16} color="#fff" style={styles.checkIcon} />
                  )}
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Detail Spot */}
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <View style={[styles.indicator, { backgroundColor: '#ff9f1c' }]} />
              <Text style={styles.cardTitle}>DETAIL SPOT</Text>
            </View>
            
            <View style={styles.formGroup}>
              <Text style={styles.label}>Aksesibilitas</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                placeholder="Contoh: Bisa parkir mobil, jalan setapak 200m..."
                placeholderTextColor="#94a3b8"
                value={accessibility}
                onChangeText={setAccessibility}
                multiline
                numberOfLines={3}
                textAlignVertical="top"
              />
            </View>
            
            <View style={styles.formGroup}>
              <Text style={styles.label}>Deskripsi Spot</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                placeholder="Jelaskan kondisi spot..."
                placeholderTextColor="#94a3b8"
                value={description}
                onChangeText={setDescription}
                multiline
                numberOfLines={4}
                textAlignVertical="top"
              />
            </View>
          </View>

          {/* Foto Spot */}
          <View style={styles.card}>
            <View style={styles.cardHeaderWithBadge}>
              <View style={styles.cardHeaderLeft}>
                <View style={[styles.indicator, { backgroundColor: '#94a3b8' }]} />
                <Text style={styles.cardTitle}>FOTO SPOT</Text>
              </View>
              <TouchableOpacity onPress={handleViewAllPhotos}>
                <Text style={styles.viewAllText}>Lihat Semua</Text>
              </TouchableOpacity>
            </View>
            
            <View style={styles.photosGrid}>
              {photos.map((photo) => (
                <View key={photo.id} style={styles.photoContainer}>
                  <Image source={{ uri: photo.uri }} style={styles.photo} />
                  <TouchableOpacity 
                    style={styles.deletePhotoButton}
                    onPress={() => handleDeletePhoto(photo.id)}
                  >
                    <MaterialIcons name="delete" size={16} color="#fff" />
                  </TouchableOpacity>
                </View>
              ))}
              
              <TouchableOpacity style={styles.addPhotoButton}>
                <MaterialIcons name="add-a-photo" size={24} color="#94a3b8" />
                <Text style={styles.addPhotoText}>Tambah</Text>
              </TouchableOpacity>
            </View>
            
            <Text style={styles.photoHint}>Format: JPG, PNG. Maks 5MB per foto.</Text>
          </View>

          {/* Spacer untuk tombol */}
          <View style={styles.bottomSpacer} />
        </ScrollView>

        {/* Tombol Simpan */}
        <View style={styles.saveButtonContainer}>
          <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
            <MaterialIcons name="save" size={20} color="#fff" />
            <Text style={styles.saveButtonText}>Simpan Perubahan</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
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
  placeholder: {
    width: 40,
  },
  keyboardView: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#f1f5f9',
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  cardHeaderWithBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  cardHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  indicator: {
    width: 4,
    height: 20,
    borderRadius: 2,
    marginRight: 8,
  },
  cardTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: '#1e293b',
    textTransform: 'uppercase',
  },
  badge: {
    backgroundColor: '#f1f5f9',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  badgeText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#94a3b8',
  },
  formGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#64748b',
    marginBottom: 6,
    marginLeft: 4,
  },
  inputContainer: {
    position: 'relative',
  },
  input: {
    backgroundColor: '#f8fafc',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 14,
    fontWeight: '600',
    color: '#1e293b',
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  inputIcon: {
    position: 'absolute',
    right: 16,
    top: '50%',
    transform: [{ translateY: -10 }],
  },
  leftIcon: {
    position: 'absolute',
    left: 16,
    top: '50%',
    transform: [{ translateY: -10 }],
    zIndex: 1,
  },
  withLeftIcon: {
    paddingLeft: 44,
  },
  locationInputRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 12,
  },
  flex1: {
    flex: 1,
  },
  mapButton: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: 'rgba(11, 37, 60, 0.05)',
    borderWidth: 1,
    borderColor: 'rgba(11, 37, 60, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  mapPreview: {
    height: 96,
    backgroundColor: '#f1f5f9',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  mapPlaceholder: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#cbd5e1',
    opacity: 0.4,
  },
  pinpointButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#f1f5f9',
  },
  pinpointText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#1e293b',
  },
  textArea: {
    minHeight: 80,
    textAlignVertical: 'top',
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
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 2,
  },
  checkIcon: {
    marginLeft: 4,
  },
  fishChipText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#64748b',
  },
  fishChipTextSelected: {
    color: '#fff',
  },
  photosGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 8,
  },
  photoContainer: {
    width: 100,
    height: 100,
    borderRadius: 12,
    overflow: 'hidden',
    position: 'relative',
  },
  photo: {
    width: '100%',
    height: '100%',
  },
  deletePhotoButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(239, 68, 68, 0.9)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  addPhotoButton: {
    width: 100,
    height: 100,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#e2e8f0',
    borderStyle: 'dashed',
    backgroundColor: '#f8fafc',
    alignItems: 'center',
    justifyContent: 'center',
  },
  addPhotoText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#94a3b8',
    marginTop: 4,
  },
  photoHint: {
    fontSize: 10,
    color: '#94a3b8',
    fontStyle: 'italic',
    marginTop: 4,
  },
  viewAllText: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#2b9dee',
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
    paddingHorizontal: 16,
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
    borderRadius: 12,
    shadowColor: '#0B253C',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 16,
    elevation: 5,
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
  },
});