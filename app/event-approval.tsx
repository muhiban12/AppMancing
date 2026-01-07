import React, { useState, useEffect } from 'react';
import {
  SafeAreaView,
  ScrollView,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { MaterialIcons } from "@expo/vector-icons";
import { router } from 'expo-router';

type CompetitionStatus = 'review' | 'approved' | 'rejected';
type Competition = {
  id: string;
  title: string;
  venue: string;
  date: string;
  time: string;
  prize: string;
  status: CompetitionStatus;
  color: string;
};

export default function CompetitionApproval() {
  const [isLoading, setIsLoading] = useState(true);
  const [competitions, setCompetitions] = useState<Competition[]>([]);
  const [activeCompetitions, setActiveCompetitions] = useState(24);
  const [pendingRequests, setPendingRequests] = useState(5);

  useEffect(() => {
    // Simulasi loading data
    setTimeout(() => {
      setCompetitions([
        {
          id: '1',
          title: 'Grand Fishing Tournament',
          venue: 'Danau Sunter Indah',
          date: 'Sab, 14 Okt 2023',
          time: '08:00 AM',
          prize: 'IDR 5.000.000',
          status: 'review',
          color: 'orange',
        },
        {
          id: '2',
          title: 'Weekend Strike Battle',
          venue: 'Pemancingan Galatama',
          date: 'Min, 15 Okt 2023',
          time: '07:00 AM',
          prize: 'IDR 2.500.000',
          status: 'review',
          color: 'deep-ocean',
        },
        {
          id: '3',
          title: 'Family Fun Catch',
          venue: 'Kolam Pancing Lestari',
          date: 'Jum, 20 Okt 2023',
          time: '09:00 AM',
          prize: 'IDR 1.000.000',
          status: 'review',
          color: 'mint',
        },
      ]);
      setIsLoading(false);
    }, 500);
  }, []);

  const handleBack = () => {
    router.back();
  };

  const handleNotification = () => {
    router.push('/notifications');
  };

  const handleApprove = (competitionId: string) => {
    Alert.alert(
      'Setujui Lomba',
      'Apakah Anda yakin ingin menyetujui lomba ini?',
      [
        { text: 'Batal', style: 'cancel' },
        { 
          text: 'Setujui', 
          onPress: () => {
            try {
              setCompetitions(prev => prev.map(comp => 
                comp.id === competitionId ? { ...comp, status: 'approved' } : comp
              ));
              setActiveCompetitions(prev => prev + 1);
              setPendingRequests(prev => Math.max(0, prev - 1));
              Alert.alert('Berhasil!', 'Lomba telah disetujui.');
            } catch (error) {
              console.error('Error approving competition:', error);
              Alert.alert('Error', 'Gagal menyetujui lomba. Silakan coba lagi.');
            }
          }
        },
      ]
    );
  };

  const handleReject = (competitionId: string) => {
    Alert.alert(
      'Tolak Lomba',
      'Apakah Anda yakin ingin menolak lomba ini?',
      [
        { text: 'Batal', style: 'cancel' },
        { 
          text: 'Tolak', 
          style: 'destructive',
          onPress: () => {
            try {
              setCompetitions(prev => prev.map(comp => 
                comp.id === competitionId ? { ...comp, status: 'rejected' } : comp
              ));
              setPendingRequests(prev => Math.max(0, prev - 1));
              Alert.alert('Berhasil!', 'Lomba telah ditolak.');
            } catch (error) {
              console.error('Error rejecting competition:', error);
              Alert.alert('Error', 'Gagal menolak lomba. Silakan coba lagi.');
            }
          }
        },
      ]
    );
  };

  const getStatusColor = (status: CompetitionStatus) => {
    switch (status) {
      case 'review': return '#ff9f1c';
      case 'approved': return '#26c485';
      case 'rejected': return '#ef4444';
      default: return '#6b7280';
    }
  };

  const getStatusText = (status: CompetitionStatus) => {
    switch (status) {
      case 'review': return 'Perlu Review';
      case 'approved': return 'Disetujui';
      case 'rejected': return 'Ditolak';
      default: return 'Unknown';
    }
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#003366" />
        <Text style={styles.loadingText}>Memuat data...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#003366" />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.menuButton} onPress={handleBack}>
          <MaterialIcons name="arrow-back" size={26} color="#fff" />
        </TouchableOpacity>
        
        <Text style={styles.headerTitle}>Persetujuan Lomba</Text>
        
        <TouchableOpacity 
          style={styles.notificationButton}
          onPress={handleNotification}
        >
          <MaterialIcons name="notifications" size={24} color="#fff" />
          <View style={styles.notificationBadge} />
        </TouchableOpacity>
      </View>

      {/* Hero Section */}
      <View style={styles.heroSection}>
        <View style={styles.heroContent}>
          <Text style={styles.heroSubtitle}>Ringkasan Antrian</Text>
          <Text style={styles.heroTitle}>Permintaan Lomba</Text>
        </View>
        
        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <View style={styles.statHeader}>
              <View style={[styles.statIcon, { backgroundColor: 'rgba(38, 196, 133, 0.1)' }]}>
                <MaterialIcons name="event-available" size={24} color="#26c485" />
              </View>
              <View style={[styles.statBadge, { backgroundColor: 'rgba(38, 196, 133, 0.1)' }]}>
                <Text style={[styles.badgeText, { color: '#26c485' }]}>Live</Text>
              </View>
            </View>
            <Text style={styles.statLabel}>Lomba Aktif</Text>
            <Text style={styles.statValue}>{activeCompetitions}</Text>
          </View>
          
          <View style={[styles.statCard, styles.secondaryStatCard]}>
            <View style={styles.statHeader}>
              <View style={[styles.statIcon, { backgroundColor: 'rgba(255, 159, 28, 0.1)' }]}>
                <MaterialIcons name="hourglass-top" size={24} color="#ff9f1c" />
              </View>
              <View style={[styles.statBadge, { backgroundColor: 'rgba(255, 159, 28, 0.1)' }]}>
                <Text style={[styles.badgeText, { color: '#ff9f1c' }]}>Tindakan</Text>
              </View>
            </View>
            <Text style={styles.statLabel}>Permintaan Tertunda</Text>
            <Text style={styles.statValue}>{pendingRequests}</Text>
          </View>
        </View>
      </View>

      <ScrollView 
        style={styles.content}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.contentContainer}
      >
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Permintaan Baru</Text>
          <Text style={styles.sortText}>Diurutkan berdasarkan Tanggal</Text>
        </View>

        {competitions.length === 0 ? (
          <View style={styles.emptyState}>
            <MaterialIcons name="emoji-events" size={48} color="#d1d5db" />
            <Text style={styles.emptyStateText}>Tidak ada permintaan lomba</Text>
            <Text style={styles.emptyStateSubtext}>Semua permintaan telah diproses</Text>
          </View>
        ) : (
          <>
            {competitions.map((competition) => (
              <View key={competition.id} style={styles.competitionCard}>
                <View style={[styles.competitionDecoration, 
                  competition.color === 'orange' ? styles.orangeDecoration :
                  competition.color === 'deep-ocean' ? styles.blueDecoration :
                  styles.greenDecoration
                ]} />
                
                <View style={styles.competitionContent}>
                  <View style={styles.competitionHeader}>
                    <View style={styles.competitionInfo}>
                      <View style={styles.venueContainer}>
                        <MaterialIcons name="storefront" size={14} color="#6b7280" />
                        <Text style={styles.venueText}>{competition.venue}</Text>
                      </View>
                      <Text style={styles.competitionTitle}>{competition.title}</Text>
                    </View>
                    <View style={[
                      styles.statusBadge,
                      { backgroundColor: `${getStatusColor(competition.status)}20` }
                    ]}>
                      <Text style={[
                        styles.statusText,
                        { color: getStatusColor(competition.status) }
                      ]}>
                        {getStatusText(competition.status)}
                      </Text>
                    </View>
                  </View>

                  <View style={styles.competitionDetails}>
                    <View style={styles.detailRow}>
                      <MaterialIcons name="calendar-month" size={18} color="#2b9dee" />
                      <Text style={styles.detailText}>{competition.date} • {competition.time}</Text>
                    </View>
                    <View style={styles.detailRow}>
                      <MaterialIcons name="trophy" size={18} color="#ff9f1c" />
                      <Text style={[styles.detailText, styles.prizeText]}>
                        Hadiah: {competition.prize}
                      </Text>
                    </View>
                  </View>

                  <TouchableOpacity 
                    style={styles.posterButton}
                    onPress={() => router.push('/competition-poster')}
                  >
                    <MaterialIcons name="image" size={18} color="#6b7280" />
                    <Text style={styles.posterButtonText}>Lihat Poster Lomba</Text>
                  </TouchableOpacity>

                  {competition.status === 'review' && (
                    <View style={styles.actionButtons}>
                      <TouchableOpacity 
                        style={styles.rejectButton}
                        onPress={() => handleReject(competition.id)}
                      >
                        <MaterialIcons name="close" size={18} color="#ef4444" />
                        <Text style={styles.rejectButtonText}>Tolak</Text>
                      </TouchableOpacity>
                      <TouchableOpacity 
                        style={styles.approveButton}
                        onPress={() => handleApprove(competition.id)}
                      >
                        <MaterialIcons name="check" size={18} color="#fff" />
                        <Text style={styles.approveButtonText}>Setujui Lomba</Text>
                      </TouchableOpacity>
                    </View>
                  )}
                </View>
              </View>
            ))}

            <View style={styles.endSection}>
              <Text style={styles.endText}>Akhir Antrian</Text>
            </View>
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f6f7f8',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f6f7f8',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: '#6b7280',
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
  heroSection: {
    backgroundColor: '#003366',
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 100,
    borderBottomLeftRadius: 40,
    borderBottomRightRadius: 40,
    marginBottom: 60,
  },
  heroContent: {
    marginBottom: 20,
  },
  heroSubtitle: {
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 4,
  },
  heroTitle: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
  },
  statsContainer: {
    flexDirection: 'row',
    gap: 12,
    position: 'absolute',
    bottom: -56,
    left: 16,
    right: 16,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    borderLeftWidth: 4,
    borderLeftColor: '#26c485',
    shadowColor: '#003366',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.15,
    shadowRadius: 30,
    elevation: 5,
  },
  secondaryStatCard: {
    borderLeftColor: '#ff9f1c',
  },
  statHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  statIcon: {
    width: 40,
    height: 40,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 10,
  },
  badgeText: {
    fontSize: 10,
    fontWeight: 'bold',
  },
  statLabel: {
    fontSize: 12,
    color: '#6b7280',
    fontWeight: '500',
    marginBottom: 4,
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#111518',
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    paddingHorizontal: 16,
    paddingBottom: 80,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    paddingLeft: 4,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#111518',
  },
  sortText: {
    fontSize: 12,
    color: '#6b7280',
    fontWeight: '500',
  },
  competitionCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#f3f4f6',
    overflow: 'hidden',
    position: 'relative',
  },
  competitionDecoration: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: 96,
    height: 96,
    borderBottomLeftRadius: 96,
  },
  orangeDecoration: {
    backgroundColor: 'rgba(255, 159, 28, 0.05)',
  },
  blueDecoration: {
    backgroundColor: 'rgba(0, 51, 102, 0.05)',
  },
  greenDecoration: {
    backgroundColor: 'rgba(38, 196, 133, 0.05)',
  },
  competitionContent: {
    padding: 20,
    position: 'relative',
    zIndex: 1,
  },
  competitionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  competitionInfo: {
    flex: 1,
    marginRight: 12,
  },
  venueContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 4,
  },
  venueText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#6b7280',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  competitionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#003366',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 10,
    fontWeight: 'bold',
  },
  competitionDetails: {
    gap: 8,
    marginBottom: 20,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  detailText: {
    fontSize: 14,
    color: '#4b5563',
  },
  prizeText: {
    fontWeight: '600',
  },
  posterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 12,
    marginBottom: 20,
  },
  posterButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6b7280',
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  rejectButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    paddingVertical: 12,
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
    borderRadius: 12,
  },
  rejectButtonText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#ef4444',
  },
  approveButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    paddingVertical: 12,
    backgroundColor: '#26c485',
    borderRadius: 12,
    shadowColor: '#26c485',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 3,
  },
  approveButtonText: {
    fontSize: 14,
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
  },
  endSection: {
    paddingVertical: 16,
    alignItems: 'center',
  },
  endText: {
    fontSize: 12,
    color: '#9ca3af',
    fontWeight: '500',
  },
});