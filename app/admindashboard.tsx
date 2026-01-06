import React from 'react';
import {
  SafeAreaView,
  ScrollView,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  Image,
  Dimensions,
} from 'react-native';
import { MaterialIcons } from "@expo/vector-icons";
import { router } from 'expo-router';

const { width } = Dimensions.get('window');

export default function AdminDashboard() {
  const handleBack = () => {
    router.back();
  };

  const quickActions = [
    { 
      id: 1, 
      icon: 'where-to-vote', 
      label: 'Persetujuan Spot', 
      color: '#2b9dee',
      onPress: () => router.push('/owner-approval') // PERUBAHAN INI
    },
    { 
      id: 2, 
      icon: 'emoji-events', 
      label: 'Persetujuan Lomba', 
      color: '#2b9dee',
      onPress: () => router.push('/event-approval')
    },
    { 
      id: 3, 
      icon: 'add-location-alt', 
      label: 'Tambah Spot Liar', 
      color: '#26c485',
      onPress: () => router.push('/all-wild-spots') 
    },
    { 
      id: 4, 
      icon: 'description', 
      label: 'Laporan', 
      color: '#ff9f1c',
      onPress: () => router.push('/laporan')
    },
  ];

  const systemSummary = [
    { 
      id: 1, 
      title: 'Verifikasi Tertunda', 
      value: '18 Pemilik', 
      status: 'Perlu Tindakan', 
      icon: 'verified-user', 
      color: '#ff9f1c', 
      changeColor: '#ff9f1c' 
    },
    { 
      id: 2, 
      title: 'Acara Tertunda', 
      value: '8 Acara', 
      status: 'Perlu Tindakan', 
      icon: 'emoji-events', 
      color: '#ff9f1c', 
      changeColor: '#ff9f1c' 
    },
    { 
      id: 3, 
      title: 'Total Spot Aktif', 
      value: '843', 
      change: '+5', 
      icon: 'phishing', 
      color: '#26c485', 
      changeColor: '#26c485' 
    },
    { 
      id: 4, 
      title: 'Spot Liar Baru', 
      value: '12 Lokasi', 
      change: 'Baru', 
      icon: 'add-location-alt', 
      color: '#2b9dee', 
      changeColor: '#2b9dee' 
    },
  ];

  const pendingOwners = [
    { id: 1, name: 'Budi Santoso', spot: 'Spot: Pemancingan Jatiasih' },
    { id: 2, name: 'CV Berkah Alam', spot: 'Spot: Danau Sunter Indah' },
  ];

  const pendingEvents = [
    { id: 1, name: 'Galatama Lele Cup', organizer: 'Org: Pemancingan Jaya' },
    { id: 2, name: 'Weekend Bass Pro', organizer: 'Org: Danau Biru Club' },
  ];

  const reports = [
    { 
      id: 1, 
      title: 'Konten Tidak Pantas', 
      time: '10m yang lalu', 
      reporter: 'User882 - "Offensive language in caption"' 
    },
    { 
      id: 2, 
      title: 'Spam / Penipuan', 
      time: '45m yang lalu', 
      reporter: 'AnglerPro - "Promoting gambling site"' 
    },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0B253C" />
      
      {/* Header */}
      <View style={styles.topHeader}>
        <TouchableOpacity style={styles.menuButton} onPress={handleBack}>
          <MaterialIcons name="menu" size={26} color="#fff" />
        </TouchableOpacity>
        
        <Text style={styles.headerTitle}>Dasbor Admin</Text>
        
        <TouchableOpacity style={styles.notificationButton}
          onPress={() => router.push('/notifications')} // TAMBAH INI
        >
          <MaterialIcons name="notifications" size={24} color="#fff" />
          <View style={styles.notificationBadge} />
        </TouchableOpacity>
      </View>

      {/* Hero Section */}
      <View style={styles.heroSection}>
        <View style={styles.userInfo}>
          <Image
            source={{ 
              uri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuADQan5ckuXLS2pba2yKDDMBfVMZuB9N62p2GwgKlaOTCxI_eQTidr3ps8ucKsTjL90Nf8-C33K5yvrb1MBa2y9cbBzsEA0W5yGvnkJQqa84rsp1oyGJPF0bnRhRGCXQTlSbJ_JWtqMTvgz28WIHJ7mXtXN9ORnE0wq-KFlG3KGF7k5Tt_jphj5sOI52JKjRyjMngkuRmM4TDKu74so3U5TK8y0DLLkdqshp2HoQaBX6TPKw2r55ieyOqRQfQTToWpwG8j6gb8wGrGd'
            }}
            style={styles.userAvatar}
          />
          <View style={styles.userDetails}>
            <Text style={styles.userGreeting}>Selamat Pagi, Admin</Text>
            <Text style={styles.userStatus}>Sistem operasional dan berjalan</Text>
          </View>
        </View>
      </View>

      {/* Quick Actions */}
      <View style={styles.quickActionsContainer}>
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.quickActionsContent}
        >
          {quickActions.map((item) => (
            <TouchableOpacity 
              key={item.id} 
              style={styles.quickActionItem}
              onPress={item.onPress}
            >
              <View style={[styles.quickActionIcon, { backgroundColor: `${item.color}20` }]}>
                <MaterialIcons name={item.icon as any} size={20} color={item.color} />
              </View>
              <Text style={styles.quickActionLabel}>{item.label}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Main Content */}
      <ScrollView 
        style={styles.content}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.contentContainer}
      >
        {/* Ringkasan Sistem */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Ringkasan Sistem</Text>
          <View style={styles.summaryGrid}>
            {systemSummary.map((item) => (
              <View key={item.id} style={styles.summaryCard}>
                <View style={styles.cardHeader}>
                  <View style={[styles.cardIcon, { backgroundColor: `${item.color}20` }]}>
                    <MaterialIcons name={item.icon as any} size={20} color={item.color} />
                  </View>
                  <View style={[styles.cardBadge, { backgroundColor: `${item.changeColor}20` }]}>
                    <Text style={[styles.badgeText, { color: item.changeColor }]}>
                      {item.change || item.status}
                    </Text>
                  </View>
                </View>
                <Text style={styles.cardTitle}>{item.title}</Text>
                <Text style={styles.cardValue}>{item.value}</Text>
              </View>
            ))}
          </View>
        </View>
        
        {/* Manajemen Pemilik */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Manajemen Pemilik - Persetujuan Tertunda</Text>
            <View style={[styles.priorityBadge, { backgroundColor: '#ff9f1c20' }]}>
              <Text style={[styles.priorityText, { color: '#ff9f1c' }]}>Prioritas</Text>
            </View>
          </View>
          
          <View style={styles.tableContainer}>
            <View style={styles.tableHeader}>
              <Text style={styles.tableHeaderText}>PEMILIK / SPOT</Text>
              <Text style={[styles.tableHeaderText, styles.textRight]}>Tindakan</Text>
            </View>
            
            {pendingOwners.map((item) => (
              <View key={item.id} style={styles.pendingRow}>
                <View style={styles.pendingInfo}>
                  <Text style={styles.pendingName}>{item.name}</Text>
                  <Text style={styles.pendingDetail}>{item.spot}</Text>
                </View>
                <View style={styles.rowActions}>
                  <TouchableOpacity style={styles.rejectButton}>
                    <Text style={styles.rejectButtonText}>Tolak</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.approveButton}>
                    <Text style={styles.approveButtonText}>Setujui</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))}
            
            // Di bagian viewAllButton di dashboard:
<TouchableOpacity 
  style={styles.viewAllButton}
  onPress={() => router.push('/owner-approval')}
>
  <Text style={styles.viewAllText}>Lihat Semua Pemilik Tertunda</Text>
</TouchableOpacity>
          </View>
        </View>
        
        {/* Persetujuan Acara */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Persetujuan Acara - Prioritas</Text>
            <View style={[styles.priorityBadge, { backgroundColor: '#ff9f1c20' }]}>
              <Text style={[styles.priorityText, { color: '#ff9f1c' }]}>Prioritas</Text>
            </View>
          </View>
          
          <View style={styles.tableContainer}>
            <View style={styles.tableHeader}>
              <Text style={styles.tableHeaderText}>TURNAMEN / PENYELENGGARA</Text>
              <Text style={[styles.tableHeaderText, styles.textRight]}>Tindakan</Text>
            </View>
            
            {pendingEvents.map((item) => (
              <View key={item.id} style={styles.pendingRow}>
                <View style={styles.pendingInfo}>
                  <Text style={styles.pendingName}>{item.name}</Text>
                  <Text style={styles.pendingDetail}>{item.organizer}</Text>
                </View>
                <View style={styles.rowActions}>
                  <TouchableOpacity style={styles.rejectButton}>
                    <Text style={styles.rejectButtonText}>Tolak</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.approveButton}>
                    <Text style={styles.approveButtonText}>Setujui</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))}
            
            <TouchableOpacity 
              style={styles.viewAllButton}
              onPress={() => router.push('/event-approval')}
            >
              <Text style={styles.viewAllText}>Lihat Semua Permintaan</Text>
            </TouchableOpacity>
          </View>
        </View>
        
        {/* Laporan Umpan Strike */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Laporan Umpan Strike</Text>
            <View style={[styles.priorityBadge, { backgroundColor: '#ef444420' }]}>
              <Text style={[styles.priorityText, { color: '#ef4444' }]}>Laporan Baru</Text>
            </View>
          </View>
          
          {reports.map((item) => (
            <View key={item.id} style={styles.reportCard}>
              <View style={styles.reportImage} />
              <View style={styles.reportContent}>
                <View style={styles.reportHeader}>
                  <Text style={styles.reportTitle}>{item.title}</Text>
                  <Text style={styles.reportTime}>{item.time}</Text>
                </View>
                <Text style={styles.reporterText}>{item.reporter}</Text>
                <View style={styles.reportActions}>
                  <TouchableOpacity style={styles.closeReportButton}>
                    <Text style={styles.closeReportButtonText}>Tutup Laporan</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.deletePostButton}>
                    <Text style={styles.deletePostButtonText}>Hapus Posting</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          ))}
        </View>
        
        {/* Bottom Spacing */}
        <View style={styles.bottomSpacing} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f6f7f8',
  },
  topHeader: {
    backgroundColor: '#0B253C',
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
    backgroundColor: '#ef4444',
  },
  heroSection: {
    backgroundColor: '#0B253C',
    paddingHorizontal: 16,
    paddingTop: 20,
    paddingBottom: 60,
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  userAvatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  userDetails: {
    marginLeft: 16,
    flex: 1,
  },
  userGreeting: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  userStatus: {
    color: 'rgba(255,255,255,0.6)',
    fontSize: 14,
    fontWeight: '500',
  },
  quickActionsContainer: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    marginTop: -40,
    marginHorizontal: 16,
    borderWidth: 1,
    borderColor: '#f0f0f0',
  },
  quickActionsContent: {
    paddingHorizontal: 4,
  },
  quickActionItem: {
    alignItems: 'center',
    minWidth: 70,
    marginHorizontal: 8,
    flex: 1,
  },
  quickActionIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  quickActionLabel: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#666',
    textAlign: 'center',
  },
  content: {
    flex: 1,
    marginTop: 20,
  },
  contentContainer: {
    paddingHorizontal: 16,
    paddingTop: 20,
    paddingBottom: 80,
  },
  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
    paddingLeft: 4,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#111518',
    flex: 1,
  },
  priorityBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  priorityText: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  summaryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  summaryCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    width: '48%',
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#f0f0f0',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  cardIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 10,
  },
  badgeText: {
    fontSize: 10,
    fontWeight: 'bold',
  },
  cardTitle: {
    fontSize: 12,
    color: '#617989',
    fontWeight: '500',
    marginBottom: 4,
  },
  cardValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#111518',
  },
  tableContainer: {
    backgroundColor: '#fff',
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#f0f0f0',
  },
  tableHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 12,
    backgroundColor: '#f8f9fa',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  tableHeaderText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#666',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  textRight: {
    textAlign: 'right',
  },
  pendingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
  },
  pendingInfo: {
    flex: 1,
  },
  pendingName: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#111518',
    marginBottom: 2,
  },
  pendingDetail: {
    fontSize: 10,
    color: '#666',
  },
  rowActions: {
    flexDirection: 'row',
    gap: 8,
  },
  rejectButton: {
    backgroundColor: '#ef444420',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  rejectButtonText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#ef4444',
  },
  approveButton: {
    backgroundColor: '#2b9dee',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  approveButtonText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#fff',
  },
  viewAllButton: {
    padding: 12,
    backgroundColor: '#f8f9fa',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  viewAllText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#666',
  },
  reportCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 12,
    flexDirection: 'row',
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#f0f0f0',
  },
  reportImage: {
    width: 64,
    height: 64,
    borderRadius: 8,
    backgroundColor: '#e0e0e0',
    marginRight: 12,
  },
  reportContent: {
    flex: 1,
  },
  reportHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 4,
  },
  reportTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#111518',
    flex: 1,
  },
  reportTime: {
    fontSize: 10,
    color: '#999',
  },
  reporterText: {
    fontSize: 10,
    color: '#666',
    marginBottom: 8,
  },
  reportActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 8,
  },
  closeReportButton: {
    backgroundColor: '#f0f0f0',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  closeReportButtonText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#666',
  },
  deletePostButton: {
    backgroundColor: '#ef4444',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  deletePostButtonText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#fff',
  },
  bottomSpacing: {
    height: 20,
  },
});