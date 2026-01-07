import React from 'react';
import {
  SafeAreaView,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  StatusBar,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { router } from 'expo-router';

interface Notification {
  id: number;
  title: string;
  message: string;
  time: string;
  icon: string;
  iconColor: string;
  bgColor: string;
  borderColor: string;
  unread: boolean;
  read: boolean;
}

export default function Notifications() {
  const notifications: Notification[] = [
    {
      id: 1,
      title: 'Booking Baru Masuk!',
      message: 'Budi Santoso baru saja memesan Lapak 12 untuk besok pagi. Segera konfirmasi.',
      time: 'Baru Saja',
      icon: 'book-online',
      iconColor: '#2ecc71',
      bgColor: '#2ecc7110',
      borderColor: '#2ecc71',
      unread: true,
      read: false,
    },
    {
      id: 2,
      title: 'Tiket Dibayar',
      message: 'Pembayaran sebesar Rp 150.000 dari Dimas Pratama telah masuk ke saldo dompet.',
      time: '15 menit yang lalu',
      icon: 'payments',
      iconColor: '#0f4c81',
      bgColor: '#0f4c8110',
      borderColor: '#0f4c81',
      unread: true,
      read: false,
    },
    {
      id: 3,
      title: 'Peringatan Cuaca',
      message: 'BMKG memprediksi hujan deras di area kolam Anda sore ini. Pastikan area berteduh siap.',
      time: '2 jam yang lalu',
      icon: 'warning',
      iconColor: '#ff9f43',
      bgColor: '#ff9f4310',
      borderColor: '#e2e8f0',
      unread: false,
      read: true,
    },
    {
      id: 4,
      title: 'Ulasan Bintang 5!',
      message: '"Tempatnya nyaman banget, ikannya juga gede-gede. Recommended!" - Agus Setiawan',
      time: 'Kemarin, 14:30',
      icon: 'star',
      iconColor: '#fbbf24',
      bgColor: '#fbbf2410',
      borderColor: '#e2e8f0',
      unread: false,
      read: true,
    },
    {
      id: 5,
      title: 'Jadwal Maintenance',
      message: 'Sistem akan melakukan maintenance rutin pada hari Selasa dini hari pukul 02:00 - 04:00 WIB.',
      time: '2 Hari yang lalu',
      icon: 'build',
      iconColor: '#64748b',
      bgColor: '#64748b10',
      borderColor: '#e2e8f0',
      unread: false,
      read: true,
    },
    {
      id: 6,
      title: 'Event Mancing Mania',
      message: 'Event yang Anda buat "Mancing Mania Mantap" telah disetujui admin dan kini live di aplikasi.',
      time: '3 Hari yang lalu',
      icon: 'campaign',
      iconColor: '#1B1464',
      bgColor: '#1B146410',
      borderColor: '#e2e8f0',
      unread: false,
      read: true,
    },
  ];

  const handleBack = () => {
    router.back();
  };

  const handleMarkAllAsRead = () => {
    console.log('Mark all as read');
    alert('Semua notifikasi telah ditandai sebagai sudah dibaca');
  };

  const handleNotificationPress = (notification: Notification) => {
    console.log('Notification pressed:', notification.id);
    // Navigasi ke detail notifikasi atau action lainnya
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={handleBack}>
          <MaterialIcons name="arrow-back" size={24} color="#0f4c81" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Notifikasi</Text>
        <View style={styles.headerSpacer} />
      </View>

      {/* Mark All as Read Button */}
      <View style={styles.markAllContainer}>
        <TouchableOpacity 
          style={styles.markAllButton}
          onPress={handleMarkAllAsRead}
        >
          <MaterialIcons name="done-all" size={16} color="#0f4c81" />
          <Text style={styles.markAllText}>Tandai Semua Sudah Dibaca</Text>
        </TouchableOpacity>
      </View>

      {/* Notifications List */}
      <ScrollView 
        style={styles.content}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.contentContainer}
      >
        <View style={styles.notificationsList}>
          {notifications.map((notification) => (
            <TouchableOpacity
              key={notification.id}
              style={[
                styles.notificationCard,
                { 
                  borderLeftColor: notification.borderColor,
                  borderLeftWidth: 4,
                  opacity: notification.read ? 0.9 : 1,
                }
              ]}
              onPress={() => handleNotificationPress(notification)}
            >
              {/* Unread Indicator */}
              {notification.unread && (
                <View style={styles.unreadIndicator}>
                  <View style={styles.unreadPulse} />
                  <View style={styles.unreadDot} />
                </View>
              )}
              
              {/* Icon */}
              <View style={[styles.notificationIcon, { backgroundColor: notification.bgColor }]}>
                <MaterialIcons 
                  name={notification.icon as any} 
                  size={20} 
                  color={notification.iconColor} 
                />
              </View>
              
              {/* Content */}
              <View style={styles.notificationContent}>
                <View style={styles.notificationHeader}>
                  <Text style={[
                    styles.notificationTitle,
                    notification.read && styles.readTitle
                  ]}>
                    {notification.title}
                  </Text>
                  {notification.unread && (
                    <View style={styles.newBadge}>
                      <Text style={styles.newBadgeText}>BARU</Text>
                    </View>
                  )}
                </View>
                
                <Text style={[
                  styles.notificationMessage,
                  notification.read && styles.readMessage
                ]}>
                  {notification.message}
                </Text>
                
                <Text style={[
                  styles.notificationTime,
                  notification.read && styles.readTime
                ]}>
                  {notification.time}
                </Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>
        
        <View style={styles.bottomSpacer} />
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
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingVertical: 16,
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
    color: '#0f4c81',
    textAlign: 'center',
    flex: 1,
  },
  headerSpacer: {
    width: 40,
  },
  markAllContainer: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    alignItems: 'flex-end',
  },
  markAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  markAllText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#0f4c81',
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    paddingBottom: 20,
  },
  notificationsList: {
    paddingHorizontal: 16,
    gap: 12,
  },
  notificationCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    flexDirection: 'row',
    gap: 16,
    borderWidth: 1,
    borderColor: '#f1f5f9',
    position: 'relative',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  unreadIndicator: {
    position: 'absolute',
    top: 16,
    right: 16,
    width: 12,
    height: 12,
  },
  unreadPulse: {
    position: 'absolute',
    top: -2,
    right: -2,
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: '#ff9f43',
    opacity: 0.5,
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#ff9f43',
    position: 'absolute',
    top: 2,
    right: 2,
  },
  notificationIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  notificationContent: {
    flex: 1,
  },
  notificationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 6,
  },
  notificationTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#111518',
    flex: 1,
  },
  readTitle: {
    color: '#475569',
  },
  newBadge: {
    backgroundColor: '#ff9f43',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    marginLeft: 8,
  },
  newBadgeText: {
    fontSize: 8,
    fontWeight: 'bold',
    color: '#fff',
  },
  notificationMessage: {
    fontSize: 12,
    color: '#64748b',
    lineHeight: 18,
    marginBottom: 8,
  },
  readMessage: {
    color: '#94a3b8',
  },
  notificationTime: {
    fontSize: 10,
    color: '#94a3b8',
    fontWeight: '500',
  },
  readTime: {
    color: '#cbd5e1',
  },
  bottomSpacer: {
    height: 20,
  },
});