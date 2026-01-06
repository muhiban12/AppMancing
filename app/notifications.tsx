import React from 'react';
import {
  SafeAreaView,
  ScrollView,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
} from 'react-native';
import { MaterialIcons } from "@expo/vector-icons";
import { router } from 'expo-router';

export default function NotificationsScreen() {
  const handleBack = () => {
    router.back();
  };

  const notifications = [
    {
      id: 1,
      title: 'Verifikasi Pemilik Baru',
      time: '2m lalu',
      message: '"Pemancingan Galatama Jaya" mengajukan verifikasi akun. Dokumen SIUP dan KTP telah diunggah.',
      icon: 'verified-user',
      color: '#ff9f1c',
      borderColor: '#ff9f1c',
      unread: true,
      type: 'verification'
    },
    {
      id: 2,
      title: 'Laporan Konten Baru',
      time: '15m lalu',
      message: 'User @angler_pro melaporkan postingan yang mengandung unsur penipuan di spot "Danau Biru".',
      icon: 'report',
      color: '#ef4444',
      borderColor: '#ef4444',
      unread: true,
      type: 'report'
    },
    {
      id: 3,
      title: 'Spot Baru Terdaftar',
      time: '1j lalu',
      message: 'Spot liar baru ditambahkan di area "Sungai Citarum Sektor 5". Menunggu persetujuan admin.',
      icon: 'add-location-alt',
      color: '#26c485',
      borderColor: '#f0f0f0',
      unread: false,
      type: 'spot'
    },
    {
      id: 4,
      title: 'Lomba Disetujui',
      time: '3j lalu',
      message: 'Event "Turnamen Mas Koki Nasional" telah disetujui otomatis oleh sistem.',
      icon: 'emoji-events',
      color: '#2b9dee',
      borderColor: '#f0f0f0',
      unread: false,
      type: 'event'
    },
  ];

  const yesterdayNotifications = [
    {
      id: 5,
      title: 'Pembaruan Sistem',
      time: 'Kemarin, 20:00',
      message: 'Maintenance server mingguan telah selesai. Semua layanan berjalan normal kembali.',
      icon: 'system-update',
      color: '#0B253C',
      borderColor: '#f0f0f0',
      unread: false,
      type: 'system'
    },
    {
      id: 6,
      title: 'Laporan Diselesaikan',
      time: 'Kemarin, 14:30',
      message: 'Anda telah menyelesaikan laporan #REP-2023-882 terkait konten spam.',
      icon: 'check-circle',
      color: '#26c485',
      borderColor: '#f0f0f0',
      unread: false,
      type: 'completed'
    },
    {
      id: 7,
      title: 'Spot Baru Terdaftar',
      time: 'Kemarin, 09:15',
      message: 'Spot "Kolam Pancing Bahagia" telah didaftarkan oleh pemilik.',
      icon: 'add-location-alt',
      color: '#26c485',
      borderColor: '#f0f0f0',
      unread: false,
      type: 'spot'
    },
  ];

  const NotificationCard = ({ notification }: { notification: any }) => (
    <TouchableOpacity 
      style={[
        styles.notificationCard, 
        { borderLeftColor: notification.borderColor, opacity: notification.unread ? 1 : 0.7 }
      ]}
      onPress={() => handleNotificationPress(notification)}
    >
      {notification.unread && (
        <View style={styles.unreadDot} />
      )}
      <View style={[styles.notificationIcon, { backgroundColor: `${notification.color}20` }]}>
        <MaterialIcons name={notification.icon as any} size={20} color={notification.color} />
      </View>
      <View style={styles.notificationContent}>
        <View style={styles.notificationHeader}>
          <Text style={styles.notificationTitle}>{notification.title}</Text>
          <Text style={styles.notificationTime}>{notification.time}</Text>
        </View>
        <Text style={styles.notificationMessage} numberOfLines={2}>
          {notification.message}
        </Text>
      </View>
    </TouchableOpacity>
  );

  const handleNotificationPress = (notification: any) => {
    console.log(`Notification ${notification.id} pressed`);
    // Navigate based on notification type
    switch (notification.type) {
      case 'verification':
        // Navigate to verification screen
        break;
      case 'report':
        // Navigate to reports screen
        break;
      case 'spot':
        // Navigate to spot approval
        break;
      case 'event':
        router.push('/event-approval');
        break;
    }
  };

  const markAllAsRead = () => {
    console.log('Mark all as read');
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0B253C" />
      
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <TouchableOpacity style={styles.menuButton} onPress={handleBack}>
            <MaterialIcons name="arrow-back" size={26} color="#fff" />
          </TouchableOpacity>

          <Text style={styles.headerTitle}>Notifikasi</Text>

          <TouchableOpacity style={styles.filterButton}>
            <MaterialIcons name="tune" size={24} color="#fff" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Content */}
      <ScrollView 
        style={styles.content}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.contentContainer}
      >
        {/* Header Section */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Terbaru</Text>
          <TouchableOpacity onPress={markAllAsRead}>
            <Text style={styles.markAllText}>Tandai Semua Sudah Dibaca</Text>
          </TouchableOpacity>
        </View>

        {/* Today's Notifications */}
        <View style={styles.notificationsList}>
          {notifications.map((notification) => (
            <NotificationCard key={notification.id} notification={notification} />
          ))}
        </View>

        {/* Divider */}
        <View style={styles.divider} />

        {/* Yesterday's Notifications */}
        <Text style={styles.yesterdayTitle}>Kemarin</Text>
        <View style={styles.notificationsList}>
          {yesterdayNotifications.map((notification) => (
            <NotificationCard key={notification.id} notification={notification} />
          ))}
        </View>

        {/* End of Notifications */}
        <View style={styles.endContainer}>
          <Text style={styles.endText}>Tidak ada notifikasi lainnya</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f6f7f8',
  },
  header: {
    backgroundColor: '#0B253C',
  },
  headerContent: {
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
  filterButton: {
    padding: 4,
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    paddingHorizontal: 16,
    paddingTop: 20,
    paddingBottom: 40,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#111518',
  },
  markAllText: {
    fontSize: 12,
    color: '#2b9dee',
    fontWeight: '600',
  },
  notificationsList: {
    gap: 12,
    marginBottom: 20,
  },
  notificationCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    flexDirection: 'row',
    borderLeftWidth: 4,
    borderWidth: 1,
    borderColor: '#f0f0f0',
    position: 'relative',
  },
  unreadDot: {
    position: 'absolute',
    top: 16,
    right: 16,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#ef4444',
  },
  notificationIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  notificationContent: {
    flex: 1,
  },
  notificationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 4,
  },
  notificationTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#111518',
    flex: 1,
  },
  notificationTime: {
    fontSize: 10,
    color: '#999',
    marginLeft: 8,
  },
  notificationMessage: {
    fontSize: 12,
    color: '#666',
    lineHeight: 16,
  },
  divider: {
    height: 1,
    backgroundColor: '#f0f0f0',
    marginVertical: 20,
  },
  yesterdayTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#111518',
    marginBottom: 12,
  },
  endContainer: {
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
  },
  endText: {
    fontSize: 12,
    color: '#999',
  },
});