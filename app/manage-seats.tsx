import React, { useState } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Image,
  TextInput,
  StatusBar,
  Dimensions,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { router } from 'expo-router';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

type SeatStatus = 'available' | 'occupied' | 'offline' | 'broken';
type SeatType = 'online' | 'offline';

interface Seat {
  id: number;
  number: string;
  status: SeatStatus;
  type?: SeatType;
  customerName?: string;
  x: number;
  y: number;
}

export default function ManageSeats() {
  const [selectedSeat, setSelectedSeat] = useState<Seat | null>(null);
  const [seatCount, setSeatCount] = useState(20);
  const [basePrice, setBasePrice] = useState(50000);
  const [customerName, setCustomerName] = useState('');

  const seats: Seat[] = [
    { id: 1, number: '01', status: 'occupied', type: 'online', x: 20, y: 35 },
    { id: 2, number: '02', status: 'occupied', type: 'online', x: 40, y: 35 },
    { id: 3, number: '03', status: 'available', x: 60, y: 35 },
    { id: 4, number: '04', status: 'occupied', type: 'online', x: 80, y: 35 },
    { id: 5, number: '05', status: 'occupied', type: 'offline', customerName: 'Pak Budi', x: 20, y: 35 },
    { id: 6, number: '06', status: 'available', x: 40, y: 35 },
    { id: 7, number: '07', status: 'broken', x: 60, y: 35 },
    { id: 8, number: '08', status: 'occupied', type: 'offline', customerName: 'Pak Joko', x: 80, y: 35 },
    { id: 9, number: '09', status: 'occupied', type: 'online', x: 20, y: 20 },
    { id: 10, number: '10', status: 'available', x: 40, y: 20 },
    { id: 11, number: '11', status: 'occupied', type: 'online', x: 60, y: 20 },
    { id: 12, number: '12', status: 'occupied', type: 'online', x: 80, y: 20 },
  ];

  const totalSeats = seatCount;
  const emptySeats = seats.filter(s => s.status === 'available').length;
  const occupiedSeats = seats.filter(s => s.status === 'occupied').length;

  const handleBack = () => {
    router.back();
  };

  const handleSeatPress = (seat: Seat) => {
    setSelectedSeat(seat);
    setCustomerName(seat.customerName || '');
  };

  const handleStatusChange = (newStatus: SeatStatus, type?: SeatType) => {
    if (selectedSeat) {
      const updatedSeat = { 
        ...selectedSeat, 
        status: newStatus,
        type: type,
        customerName: newStatus === 'occupied' && type === 'offline' ? customerName : undefined
      };
      setSelectedSeat(updatedSeat);
    }
  };

  const handleReset = () => {
    setSelectedSeat(null);
    setCustomerName('');
  };

  const handleSaveChanges = () => {
    console.log('Saving changes...');
    // Simpan logika di sini
    alert('Perubahan berhasil disimpan!');
    router.back();
  };

  const handleUpdateLayout = () => {
    console.log('Update layout');
    alert('Fitur update layout akan datang!');
  };

  const handleFinishSession = () => {
    if (selectedSeat) {
      const updatedSeat = { 
        ...selectedSeat, 
        status: 'available', 
        type: undefined,
        customerName: undefined 
      };
      setSelectedSeat(updatedSeat);
      setCustomerName('');
    }
  };

  const getSeatStyle = (seat: Seat) => {
    switch (seat.status) {
      case 'available':
        return {
          backgroundColor: '#fff',
          borderColor: '#2ecc71',
          borderWidth: 2,
        };
      case 'occupied':
        return {
          backgroundColor: seat.type === 'offline' ? '#38bdf8' : '#003366',
          borderColor: seat.type === 'offline' ? '#ff9f43' : '#fff',
          borderWidth: 2,
        };
      case 'broken':
        return {
          backgroundColor: '#cbd5e1',
          borderColor: '#fff',
          borderWidth: 2,
        };
      default:
        return {
          backgroundColor: '#003366',
          borderColor: '#fff',
          borderWidth: 2,
        };
    }
  };

  const getSeatTextStyle = (seat: Seat) => {
    switch (seat.status) {
      case 'available':
        return { color: '#2ecc71' };
      case 'occupied':
        return { color: '#fff' };
      case 'broken':
        return { color: '#64748b' };
      default:
        return { color: '#fff' };
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={handleBack}>
          <MaterialIcons name="arrow-back" size={24} color="#003366" />
        </TouchableOpacity>
        <View style={styles.headerTitleContainer}>
          <Text style={styles.headerTitle}>Kelola Kursi</Text>
          <Text style={styles.headerSubtitle}>Telaga Berkah</Text>
        </View>
        <TouchableOpacity style={styles.resetButton} onPress={handleReset}>
          <Text style={styles.resetText}>Reset</Text>
        </TouchableOpacity>
      </View>

      <ScrollView 
        style={styles.content}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.contentContainer}
      >
        {/* Map Section */}
        <View style={styles.section}>
          <View style={styles.mapCard}>
            <View style={styles.mapHeader}>
              <View style={styles.mapTitleContainer}>
                <MaterialIcons name="map" size={20} color="#003366" />
                <Text style={styles.mapTitle}>Peta Lokasi Lapak</Text>
              </View>
              <TouchableOpacity 
                style={styles.updateLayoutButton}
                onPress={handleUpdateLayout}
              >
                <MaterialIcons name="upload-file" size={14} color="#003366" />
                <Text style={styles.updateLayoutText}>Update Layout</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.mapContainer}>
              <Image
                source={{ uri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBcMs4OQmgTt-dWM_vyMdhqJNug36bHQXzI3BUhZXal-RAVe81uNMMgIcbtTqSMsqrbsdH6Rzsk13dN5Ypmos0D-iiq2iE5wQecoVCuzQe4CDYA7_ZGX91UuQEI1T3m0wek4M0HAFr-rXIt7sGg6bS3NsNfEK2WMDX3irTVTBA7nL1on7mEGQEjGDwIfdbFQEaPCKT6LIf-0WB4LecWhiR23Iq6KmHJ4F3iJq5Kn5JneSTL0HLan4KZLXP29dMlvILwbSlYEvvNrSai' }}
                style={styles.mapImage}
              />
              <View style={styles.mapOverlay} />
              
              {/* Map Seats */}
              {seats.map(seat => (
                <TouchableOpacity
                  key={seat.id}
                  style={[
                    styles.mapSeat,
                    getSeatStyle(seat),
                    {
                      top: `${seat.y}%`,
                      left: `${seat.x}%`,
                    },
                    selectedSeat?.id === seat.id && styles.selectedMapSeat,
                  ]}
                  onPress={() => handleSeatPress(seat)}
                >
                  <Text style={[styles.mapSeatText, getSeatTextStyle(seat)]}>
                    {seat.number}
                  </Text>
                  {seat.id === 8 && selectedSeat?.id !== seat.id && (
                    <View style={styles.highlightDot} />
                  )}
                </TouchableOpacity>
              ))}

              <View style={styles.mapHint}>
                <Text style={styles.mapHintText}>Klik nomor untuk edit</Text>
              </View>
            </View>
          </View>

          {/* Stats Cards */}
          <View style={styles.statsGrid}>
            <View style={styles.statCard}>
              <Text style={styles.statLabel}>Total</Text>
              <Text style={styles.statValue}>{totalSeats}</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={[styles.statLabel, styles.emptyLabel]}>Kosong</Text>
              <Text style={[styles.statValue, styles.emptyValue]}>{emptySeats}</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={[styles.statLabel, styles.occupiedLabel]}>Terisi</Text>
              <Text style={[styles.statValue, styles.occupiedValue]}>{occupiedSeats}</Text>
            </View>
          </View>
        </View>

        {/* Grid Section */}
        <View style={styles.section}>
          <View style={styles.gridCard}>
            <View style={styles.gridHeader}>
              <Text style={styles.gridTitle}>Denah Lokasi (Grid)</Text>
              <View style={styles.legendContainer}>
                <View style={styles.legendItem}>
                  <View style={[styles.legendDot, styles.emptyDot]} />
                  <Text style={styles.legendText}>Kosong</Text>
                </View>
                <View style={styles.legendItem}>
                  <View style={[styles.legendDot, styles.onlineDot]} />
                  <Text style={styles.legendText}>Online</Text>
                </View>
                <View style={styles.legendItem}>
                  <View style={[styles.legendDot, styles.offlineDot]} />
                  <Text style={styles.legendText}>Offline</Text>
                </View>
                <View style={styles.legendItem}>
                  <View style={[styles.legendDot, styles.brokenDot]} />
                  <Text style={styles.legendText}>Rusak</Text>
                </View>
              </View>
            </View>

            <View style={styles.gridContainer}>
              {/* Row 1 */}
              <View style={styles.gridRow}>
                {seats.slice(0, 4).map(seat => (
                  <TouchableOpacity
                    key={seat.id}
                    style={[
                      styles.gridSeat,
                      getSeatStyle(seat),
                      selectedSeat?.id === seat.id && styles.selectedGridSeat,
                    ]}
                    onPress={() => handleSeatPress(seat)}
                  >
                    <Text style={[styles.gridSeatText, getSeatTextStyle(seat)]}>
                      {seat.number}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              {/* Water Area */}
              <View style={styles.waterArea}>
                <Text style={styles.waterText}>Area Air</Text>
              </View>

              {/* Row 2 */}
              <View style={styles.gridRow}>
                {seats.slice(4, 8).map(seat => (
                  <TouchableOpacity
                    key={seat.id}
                    style={[
                      styles.gridSeat,
                      getSeatStyle(seat),
                      selectedSeat?.id === seat.id && styles.selectedGridSeat,
                    ]}
                    onPress={() => handleSeatPress(seat)}
                  >
                    <Text style={[styles.gridSeatText, getSeatTextStyle(seat)]}>
                      {seat.number}
                    </Text>
                    {seat.id === 8 && selectedSeat?.id !== seat.id && (
                      <View style={styles.gridHighlightDot} />
                    )}
                  </TouchableOpacity>
                ))}
              </View>

              {/* Row 3 */}
              <View style={styles.gridRow}>
                {seats.slice(8, 12).map(seat => (
                  <TouchableOpacity
                    key={seat.id}
                    style={[
                      styles.gridSeat,
                      getSeatStyle(seat),
                      selectedSeat?.id === seat.id && styles.selectedGridSeat,
                    ]}
                    onPress={() => handleSeatPress(seat)}
                  >
                    <Text style={[styles.gridSeatText, getSeatTextStyle(seat)]}>
                      {seat.number}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </View>
        </View>

        {/* Edit Section (hanya muncul jika ada kursi yang dipilih) */}
        {selectedSeat && (
          <View style={styles.section}>
            <View style={styles.editCard}>
              <View style={styles.editHeader}>
                <View style={styles.editTitleContainer}>
                  <MaterialIcons name="edit-location-alt" size={20} color="#ff9f43" />
                  <Text style={styles.editTitle}>Edit Lapak {selectedSeat.number}</Text>
                </View>
                <View style={styles.selectedBadge}>
                  <Text style={styles.selectedBadgeText}>Dipilih</Text>
                </View>
              </View>

              <View style={styles.editContent}>
                {/* Status Buttons */}
                <View style={styles.statusSection}>
                  <Text style={styles.sectionLabel}>Ubah Status</Text>
                  <View style={styles.statusButtons}>
                    <TouchableOpacity 
                      style={[
                        styles.statusButton,
                        selectedSeat.status === 'available' && styles.activeStatusButton
                      ]}
                      onPress={() => handleStatusChange('available')}
                    >
                      <MaterialIcons 
                        name="check-circle" 
                        size={20} 
                        color={selectedSeat.status === 'available' ? '#2ecc71' : '#64748b'} 
                      />
                      <Text style={[
                        styles.statusButtonText,
                        selectedSeat.status === 'available' && styles.activeStatusText
                      ]}>Tersedia</Text>
                    </TouchableOpacity>
                    
                    <TouchableOpacity 
                      style={[
                        styles.statusButton,
                        selectedSeat.status === 'occupied' && selectedSeat.type === 'offline' && styles.activeStatusButton
                      ]}
                      onPress={() => handleStatusChange('occupied', 'offline')}
                    >
                      <MaterialIcons 
                        name="person-add" 
                        size={20} 
                        color={selectedSeat.status === 'occupied' && selectedSeat.type === 'offline' ? '#38bdf8' : '#64748b'} 
                      />
                      <Text style={[
                        styles.statusButtonText,
                        selectedSeat.status === 'occupied' && selectedSeat.type === 'offline' && styles.activeStatusText
                      ]}>Booked (Offline)</Text>
                      <View style={styles.statusDot} />
                    </TouchableOpacity>
                    
                    <TouchableOpacity 
                      style={[
                        styles.statusButton,
                        selectedSeat.status === 'broken' && styles.activeStatusButton
                      ]}
                      onPress={() => handleStatusChange('broken')}
                    >
                      <MaterialIcons 
                        name="build" 
                        size={20} 
                        color={selectedSeat.status === 'broken' ? '#ef4444' : '#64748b'} 
                      />
                      <Text style={[
                        styles.statusButtonText,
                        selectedSeat.status === 'broken' && styles.activeStatusText
                      ]}>Perbaikan</Text>
                    </TouchableOpacity>
                  </View>

                  {/* Customer Name Input (hanya untuk offline booking) */}
                  {selectedSeat.status === 'occupied' && selectedSeat.type === 'offline' && (
                    <View style={styles.customerInputContainer}>
                      <View style={styles.customerInputLabel}>
                        <MaterialIcons name="badge" size={14} color="#64748b" />
                        <Text style={styles.customerInputLabelText}>Nama Pelanggan (Opsional)</Text>
                      </View>
                      <TextInput
                        style={styles.customerInput}
                        placeholder="Masukkan nama tamu..."
                        placeholderTextColor="#94a3b8"
                        value={customerName}
                        onChangeText={setCustomerName}
                      />
                    </View>
                  )}
                </View>

                {/* Current Status Card */}
                <View style={styles.currentStatusCard}>
                  <View style={styles.currentStatusInfo}>
                    <View style={[
                      styles.statusIconContainer,
                      selectedSeat.status === 'available' && styles.availableIcon,
                      selectedSeat.status === 'occupied' && selectedSeat.type === 'offline' && styles.offlineIcon,
                      selectedSeat.status === 'broken' && styles.brokenIcon,
                    ]}>
                      <MaterialIcons 
                        name="person" 
                        size={20} 
                        color={
                          selectedSeat.status === 'available' ? '#2ecc71' :
                          selectedSeat.status === 'occupied' && selectedSeat.type === 'offline' ? '#38bdf8' :
                          selectedSeat.status === 'broken' ? '#ef4444' : '#003366'
                        } 
                      />
                    </View>
                    <View>
                      <Text style={styles.currentStatusLabel}>Status Saat Ini</Text>
                      <Text style={styles.currentStatusValue}>
                        {selectedSeat.status === 'available' ? 'Tersedia' : 
                         selectedSeat.status === 'occupied' && selectedSeat.type === 'online' ? 'Terisi - Online' :
                         selectedSeat.status === 'occupied' && selectedSeat.type === 'offline' ? 'Terisi - Offline' : 
                         selectedSeat.status === 'broken' ? 'Rusak' : ''}
                      </Text>
                    </View>
                  </View>
                  {selectedSeat.status === 'occupied' && (
                    <TouchableOpacity 
                      style={styles.finishButton}
                      onPress={handleFinishSession}
                    >
                      <MaterialIcons name="cancel" size={16} color="#ef4444" />
                      <Text style={styles.finishButtonText}>Selesaikan Sesi</Text>
                    </TouchableOpacity>
                  )}
                </View>
              </View>
            </View>
          </View>
        )}

        {/* General Settings */}
        <View style={styles.section}>
          <Text style={styles.settingsTitle}>Pengaturan Umum</Text>
          <View style={styles.settingsCard}>
            {/* Base Price */}
            <TouchableOpacity style={styles.settingItem}>
              <View style={[styles.settingIconContainer, { backgroundColor: '#2ecc7110' }]}>
                <MaterialIcons name="payments" size={24} color="#2ecc71" />
              </View>
              <View style={styles.settingInfo}>
                <Text style={styles.settingTitle}>Harga Dasar</Text>
                <Text style={styles.settingSubtitle}>Per lapak / sesi</Text>
              </View>
              <View style={styles.settingValueContainer}>
                <Text style={styles.settingValue}>Rp {basePrice.toLocaleString('id-ID')}</Text>
                <MaterialIcons name="chevron-right" size={20} color="#cbd5e1" />
              </View>
            </TouchableOpacity>

            {/* Capacity */}
            <View style={[styles.settingItem, styles.capacityItem]}>
              <View style={[styles.settingIconContainer, { backgroundColor: '#00336610' }]}>
                <MaterialIcons name="grid-view" size={24} color="#003366" />
              </View>
              <View style={styles.settingInfo}>
                <Text style={styles.settingTitle}>Kapasitas</Text>
                <Text style={styles.settingSubtitle}>Jumlah total lapak</Text>
              </View>
              <View style={styles.capacityControls}>
                <TouchableOpacity 
                  style={styles.capacityButton}
                  onPress={() => setSeatCount(prev => Math.max(1, prev - 1))}
                >
                  <MaterialIcons name="remove" size={16} color="#64748b" />
                </TouchableOpacity>
                <Text style={styles.capacityValue}>{seatCount}</Text>
                <TouchableOpacity 
                  style={styles.capacityButton}
                  onPress={() => setSeatCount(prev => prev + 1)}
                >
                  <MaterialIcons name="add" size={16} color="#64748b" />
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>

        <View style={styles.bottomSpacer} />
      </ScrollView>

      {/* Save Button */}
      <View style={styles.saveButtonContainer}>
        <TouchableOpacity style={styles.saveButton} onPress={handleSaveChanges}>
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
  headerTitleContainer: {
    flex: 1,
    alignItems: 'center',
    marginLeft: -40,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#003366',
  },
  headerSubtitle: {
    fontSize: 12,
    color: '#617989',
  },
  resetButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  resetText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#003366',
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    paddingBottom: 100,
  },
  section: {
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  mapCard: {
    backgroundColor: '#fff',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#f1f5f9',
    overflow: 'hidden',
    marginBottom: 12,
  },
  mapHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  mapTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  mapTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#1e293b',
  },
  updateLayoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#0033660d',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#00336633',
  },
  updateLayoutText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#003366',
  },
  mapContainer: {
    width: '100%',
    aspectRatio: 4/3,
    backgroundColor: '#f8fafc',
    position: 'relative',
  },
  mapImage: {
    width: '100%',
    height: '100%',
    opacity: 0.9,
  },
  mapOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  mapSeat: {
    position: 'absolute',
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 4,
  },
  selectedMapSeat: {
    transform: [{ scale: 1.25 }],
    borderWidth: 2,
    borderColor: '#ff9f43',
    shadowColor: '#ff9f43',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 8,
    elevation: 8,
  },
  mapSeatText: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  highlightDot: {
    position: 'absolute',
    top: -2,
    right: -2,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#ff9f43',
    borderWidth: 1.5,
    borderColor: '#fff',
  },
  mapHint: {
    position: 'absolute',
    bottom: 12,
    right: 12,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  mapHintText: {
    fontSize: 10,
    color: '#fff',
  },
  statsGrid: {
    flexDirection: 'row',
    gap: 12,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#f1f5f9',
    alignItems: 'center',
  },
  statLabel: {
    fontSize: 12,
    color: '#64748b',
    fontWeight: '500',
    marginBottom: 4,
  },
  emptyLabel: {
    color: '#2ecc71',
  },
  occupiedLabel: {
    color: '#ff9f43',
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#003366',
  },
  emptyValue: {
    color: '#2ecc71',
  },
  occupiedValue: {
    color: '#ff9f43',
  },
  gridCard: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: '#f1f5f9',
  },
  gridHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  gridTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#475569',
  },
  legendContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    maxWidth: '70%',
    gap: 8,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  legendDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    borderWidth: 1,
  },
  emptyDot: {
    backgroundColor: '#fff',
    borderColor: '#2ecc71',
  },
  onlineDot: {
    backgroundColor: '#003366',
    borderColor: '#fff',
  },
  offlineDot: {
    backgroundColor: '#38bdf8',
    borderColor: '#ff9f43',
  },
  brokenDot: {
    backgroundColor: '#cbd5e1',
    borderColor: '#fff',
  },
  legendText: {
    fontSize: 10,
    color: '#64748b',
    fontWeight: '500',
  },
  gridContainer: {
    gap: 12,
  },
  gridRow: {
    flexDirection: 'row',
    gap: 12,
  },
  gridSeat: {
    flex: 1,
    aspectRatio: 1,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  selectedGridSeat: {
    transform: [{ scale: 1.05 }],
    borderWidth: 2,
    borderColor: '#ff9f43',
    shadowColor: '#ff9f43',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 6,
  },
  gridSeatText: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  gridHighlightDot: {
    position: 'absolute',
    top: -2,
    right: -2,
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#ff9f43',
    borderWidth: 1.5,
    borderColor: '#fff',
  },
  waterArea: {
    height: 64,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 12,
  },
  waterText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#38bdf8',
    letterSpacing: 2,
    opacity: 0.5,
  },
  editCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 159, 67, 0.2)',
    overflow: 'hidden',
  },
  editHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(255, 159, 67, 0.05)',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 159, 67, 0.1)',
  },
  editTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  editTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#1e293b',
  },
  selectedBadge: {
    backgroundColor: '#fff',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: 'rgba(255, 159, 67, 0.2)',
  },
  selectedBadgeText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#ff9f43',
  },
  editContent: {
    padding: 16,
  },
  statusSection: {
    marginBottom: 16,
  },
  sectionLabel: {
    fontSize: 12,
    color: '#64748b',
    fontWeight: '500',
    marginBottom: 12,
  },
  statusButtons: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 12,
  },
  statusButton: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 4,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  activeStatusButton: {
    backgroundColor: 'rgba(56, 189, 248, 0.1)',
    borderColor: '#38bdf8',
  },
  statusButtonText: {
    fontSize: 10,
    color: '#64748b',
    marginTop: 4,
  },
  activeStatusText: {
    color: '#38bdf8',
    fontWeight: '500',
  },
  statusDot: {
    position: 'absolute',
    top: 4,
    right: 4,
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#38bdf8',
  },
  customerInputContainer: {
    backgroundColor: '#f8fafc',
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#f1f5f9',
    marginTop: 12,
  },
  customerInputLabel: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 6,
  },
  customerInputLabelText: {
    fontSize: 11,
    color: '#64748b',
    fontWeight: '600',
  },
  customerInput: {
    fontSize: 12,
    color: '#1e293b',
    padding: 8,
    borderRadius: 8,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  currentStatusCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#f1f5f9',
  },
  currentStatusInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  statusIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  availableIcon: {
    backgroundColor: 'rgba(46, 204, 113, 0.1)',
  },
  offlineIcon: {
    backgroundColor: 'rgba(56, 189, 248, 0.1)',
  },
  brokenIcon: {
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
  },
  currentStatusLabel: {
    fontSize: 10,
    color: '#64748b',
    fontWeight: '500',
  },
  currentStatusValue: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#1e293b',
  },
  finishButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#fee2e2',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#fecaca',
  },
  finishButtonText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#ef4444',
  },
  settingsTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#111518',
    marginBottom: 12,
  },
  settingsCard: {
    backgroundColor: '#fff',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#f1f5f9',
    overflow: 'hidden',
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  capacityItem: {
    borderBottomWidth: 0,
  },
  settingIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  settingInfo: {
    flex: 1,
  },
  settingTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#111518',
    marginBottom: 2,
  },
  settingSubtitle: {
    fontSize: 12,
    color: '#64748b',
  },
  settingValueContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  settingValue: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#111518',
  },
  capacityControls: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8fafc',
    borderRadius: 8,
    padding: 4,
  },
  capacityButton: {
    padding: 4,
  },
  capacityValue: {
    fontSize: 14,
    fontWeight: 'bold',
    paddingHorizontal: 12,
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
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: '#e2e8f0',
    paddingBottom: 32,
  },
  saveButton: {
    backgroundColor: '#003366',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 14,
    borderRadius: 16,
    shadowColor: '#003366',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 8,
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
  },
});