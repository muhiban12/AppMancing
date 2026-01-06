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
import DateTimePicker from '@react-native-community/datetimepicker';
import * as ImagePicker from 'expo-image-picker';

export default function CreateEvent() {
  const [eventName, setEventName] = useState('');
  const [eventDate, setEventDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [eventDescription, setEventDescription] = useState('');
  const [participationFee, setParticipationFee] = useState('');
  const [maxParticipants, setMaxParticipants] = useState('');
  const [posterImage, setPosterImage] = useState<string | null>(null);

  const handleBack = () => {
    router.back();
  };

  const handleHelp = () => {
    console.log('Show help');
    Alert.alert('Bantuan', 'Buat event lomba mancing dengan mengisi form ini. Event akan ditinjau admin sebelum dipublikasikan.');
  };

  const handlePickImage = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [16, 9],
        quality: 0.8,
      });

      if (!result.canceled) {
        setPosterImage(result.assets[0].uri);
      }
    } catch (error) {
      console.error('Error picking image:', error);
      Alert.alert('Error', 'Gagal memilih gambar');
    }
  };

  const handleDateChange = (event: any, selectedDate?: Date) => {
    setShowDatePicker(false);
    if (selectedDate) {
      setEventDate(selectedDate);
    }
  };

  const handlePublishEvent = () => {
    if (!eventName.trim()) {
      Alert.alert('Error', 'Nama event tidak boleh kosong');
      return;
    }

    if (!eventDescription.trim()) {
      Alert.alert('Error', 'Deskripsi event tidak boleh kosong');
      return;
    }

    const fee = parseInt(participationFee) || 0;
    const max = parseInt(maxParticipants) || 0;

    if (fee < 0) {
      Alert.alert('Error', 'Biaya partisipasi tidak valid');
      return;
    }

    if (max <= 0) {
      Alert.alert('Error', 'Jumlah peserta maksimal harus lebih dari 0');
      return;
    }

    console.log('Publishing event:', {
      eventName,
      eventDate,
      eventDescription,
      participationFee: fee,
      maxParticipants: max,
      hasPoster: !!posterImage,
    });

    Alert.alert(
      'Sukses!',
      'Event berhasil dibuat dan sedang dalam proses peninjauan admin.',
      [
        {
          text: 'OK',
          onPress: () => router.back(),
        },
      ]
    );
  };

  const formatDateTime = (date: Date) => {
    return date.toLocaleString('id-ID', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <TouchableOpacity style={styles.backButton} onPress={handleBack}>
            <MaterialIcons name="arrow-back" size={24} color="#111518" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Buat Event Lomba</Text>
        </View>
        <TouchableOpacity style={styles.helpButton} onPress={handleHelp}>
          <MaterialIcons name="help" size={20} color="#0f4c81" />
        </TouchableOpacity>
      </View>

      <ScrollView 
        style={styles.content}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.contentContainer}
      >
        {/* Poster Upload Section */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>Poster Event</Text>
          <TouchableOpacity 
            style={styles.posterUploadContainer}
            onPress={handlePickImage}
          >
            {posterImage ? (
              <View style={styles.posterImageContainer}>
                <Image source={{ uri: posterImage }} style={styles.posterImage} />
                <TouchableOpacity 
                  style={styles.changeImageButton}
                  onPress={handlePickImage}
                >
                  <MaterialIcons name="edit" size={16} color="#fff" />
                  <Text style={styles.changeImageText}>Ubah Gambar</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <View style={styles.uploadPlaceholder}>
                <View style={styles.uploadIconContainer}>
                  <MaterialIcons name="add-photo-alternate" size={32} color="#94a3b8" />
                </View>
                <Text style={styles.uploadTitle}>Upload Poster / Banner</Text>
                <Text style={styles.uploadSubtitle}>Format: JPG, PNG (Max 5MB)</Text>
              </View>
            )}
          </TouchableOpacity>
        </View>

        {/* Form Section */}
        <View style={styles.formSection}>
          {/* Event Name */}
          <View style={styles.formGroup}>
            <Text style={styles.formLabel}>Nama Event</Text>
            <TextInput
              style={styles.textInput}
              placeholder="Contoh: Lomba Mancing Galatama Minggu"
              placeholderTextColor="#94a3b8"
              value={eventName}
              onChangeText={setEventName}
            />
          </View>

          {/* Event Date & Time */}
          <View style={styles.formGroup}>
            <Text style={styles.formLabel}>Tanggal & Waktu</Text>
            <TouchableOpacity 
              style={styles.dateInputContainer}
              onPress={() => setShowDatePicker(true)}
            >
              <MaterialIcons name="calendar-month" size={20} color="#64748b" />
              <Text style={[styles.dateInputText, eventDate && styles.dateInputTextFilled]}>
                {eventDate ? formatDateTime(eventDate) : 'Pilih tanggal & waktu'}
              </Text>
            </TouchableOpacity>

            {showDatePicker && (
              <DateTimePicker
                value={eventDate}
                mode="datetime"
                display="spinner"
                onChange={handleDateChange}
                minimumDate={new Date()}
              />
            )}
          </View>

          {/* Event Description */}
          <View style={styles.formGroup}>
            <Text style={styles.formLabel}>Deskripsi Event</Text>
            <TextInput
              style={[styles.textInput, styles.textArea]}
              placeholder="Jelaskan detail peraturan lomba, hadiah, dan informasi penting lainnya..."
              placeholderTextColor="#94a3b8"
              value={eventDescription}
              onChangeText={setEventDescription}
              multiline
              numberOfLines={4}
              textAlignVertical="top"
            />
          </View>

          {/* Fee & Participants */}
          <View style={styles.rowContainer}>
            <View style={[styles.formGroup, styles.halfWidth]}>
              <Text style={styles.formLabel}>Biaya Partisipasi</Text>
              <View style={styles.currencyInputContainer}>
                <Text style={styles.currencySymbol}>Rp</Text>
                <TextInput
                  style={styles.currencyInput}
                  placeholder="0"
                  placeholderTextColor="#94a3b8"
                  keyboardType="numeric"
                  value={participationFee}
                  onChangeText={setParticipationFee}
                />
              </View>
            </View>

            <View style={[styles.formGroup, styles.halfWidth]}>
              <Text style={styles.formLabel}>Peserta Maksimal</Text>
              <View style={styles.participantsInputContainer}>
                <MaterialIcons name="groups" size={18} color="#64748b" />
                <TextInput
                  style={styles.participantsInput}
                  placeholder="Ex: 50"
                  placeholderTextColor="#94a3b8"
                  keyboardType="numeric"
                  value={maxParticipants}
                  onChangeText={setMaxParticipants}
                />
              </View>
            </View>
          </View>

          {/* Info Banner */}
          <View style={styles.infoBanner}>
            <MaterialIcons name="info" size={20} color="#ff9f43" />
            <Text style={styles.infoText}>
              Event akan ditinjau oleh tim admin sebelum dipublikasikan. Pastikan data yang Anda masukkan sudah benar.
            </Text>
          </View>
        </View>

        <View style={styles.bottomSpacer} />
      </ScrollView>

      {/* Publish Button */}
      <View style={styles.publishButtonContainer}>
        <TouchableOpacity 
          style={styles.publishButton}
          onPress={handlePublishEvent}
        >
          <Text style={styles.publishButtonText}>Publikasikan Event</Text>
          <MaterialIcons name="send" size={20} color="#fff" />
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
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
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
  helpButton: {
    padding: 8,
    borderRadius: 20,
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    padding: 16,
    paddingBottom: 100,
  },
  section: {
    marginBottom: 24,
  },
  sectionLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
  },
  posterUploadContainer: {
    borderWidth: 2,
    borderStyle: 'dashed',
    borderColor: '#d1d5db',
    borderRadius: 20,
    backgroundColor: '#fff',
    height: 192,
    overflow: 'hidden',
  },
  uploadPlaceholder: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  uploadIconContainer: {
    padding: 12,
    backgroundColor: '#f3f4f6',
    borderRadius: 999,
    marginBottom: 12,
  },
  uploadTitle: {
    fontSize: 14,
    fontWeight: '500',
    color: '#6b7280',
    marginBottom: 4,
  },
  uploadSubtitle: {
    fontSize: 12,
    color: '#9ca3af',
  },
  posterImageContainer: {
    flex: 1,
    position: 'relative',
  },
  posterImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  changeImageButton: {
    position: 'absolute',
    bottom: 12,
    right: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
  },
  changeImageText: {
    fontSize: 12,
    color: '#fff',
    fontWeight: '500',
  },
  formSection: {
    gap: 20,
  },
  formGroup: {
    gap: 8,
  },
  formLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
  },
  textInput: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 14,
    color: '#111518',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  textArea: {
    height: 120,
    textAlignVertical: 'top',
  },
  dateInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  dateInputText: {
    flex: 1,
    fontSize: 14,
    color: '#94a3b8',
  },
  dateInputTextFilled: {
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
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  currencySymbol: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#374151',
    paddingHorizontal: 16,
    paddingVertical: 14,
    backgroundColor: '#f9fafb',
    borderRightWidth: 1,
    borderRightColor: '#d1d5db',
  },
  currencyInput: {
    flex: 1,
    fontSize: 14,
    color: '#111518',
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  participantsInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  participantsInput: {
    flex: 1,
    fontSize: 14,
    color: '#111518',
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
    marginTop: 8,
  },
  infoText: {
    flex: 1,
    fontSize: 12,
    color: '#6b7280',
    lineHeight: 18,
  },
  bottomSpacer: {
    height: 20,
  },
  publishButtonContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: '#e2e8f0',
    paddingBottom: Platform.OS === 'ios' ? 32 : 12,
  },
  publishButton: {
    backgroundColor: '#0f4c81',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 16,
    borderRadius: 16,
    shadowColor: '#0f4c81',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  publishButtonText: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#fff',
  },
});