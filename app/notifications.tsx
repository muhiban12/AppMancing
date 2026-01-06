// app/(tabs)/notifications.tsx
import React, { useState, useEffect } from 'react';
import {
  SafeAreaView,
  ScrollView,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  RefreshControl,
  ActivityIndicator,
} from 'react-native';
import { MaterialIcons } from "@expo/vector-icons";
import { router } from 'expo-router';
import { notificationService, Notification } from '../service/notificationService';

export default function NotificationsScreen() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [groupedNotifications, setGroupedNotifications] = useState({
    today: [] as Notification[],
    yesterday: [] as Notification[],
    older: [] as Notification[]
  });

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const data = await notificationService.getNotifications();
      setNotifications(data);
      
      // Group notifications by date
      const grouped = notificationService.groupNotificationsByDate(data);
      setGroupedNotifications(grouped);
    } catch (error) {
      console.error('Error fetching notifications:', error);
      // Fallback ke data dummy jika error
      setNotifications(getFallbackNotifications());
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // Fallback data jika API gagal
  const getFallbackNotifications = (): Notification[] => {
    return [
      {
        id: 1,
        title: 'Verifikasi Pemilik Baru',
        message: '"Pemancingan Galatama Jaya" mengajukan verifikasi akun. Dokumen SIUP dan KTP telah diunggah.',
        is_read: false,
        created_at: new Date(Date.now() - 120000).toISOString(), // 2 menit lalu
      },
      {
        id: 2,
        title: 'Laporan Konten Baru',
        message: 'User @angler_pro melaporkan postingan yang mengandung unsur penipuan di spot "Danau Biru".',
        is_read: false,
        created_at: new Date(Date.now() - 900000).toISOString(), // 15 menit lalu
      },
      {
        id: 3,
        title: 'Spot Baru Terdaftar',
        message: 'Spot liar baru ditambahkan di area "Sungai Citarum Sektor 5". Menunggu persetujuan admin.',
        is_read: true,
        created_at: new Date(Date.now() - 3600000).toISOString(), // 1 jam lalu
      },
    ];
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    fetchNotifications();
  };

  const handleBack = () => {
    router.back();
  };

  const handleNotificationPress = async (notification: Notification) => {
    // Mark as read jika belum dibaca
    if (!notification.is_read) {
      try {
        await notificationService.markAsRead(notification.id);
        // Update local state
        setNotifications(prev => 
          prev.map(n => 
            n.id === notification.id ? { ...n, is_read: true } : n
          )
        );
      } catch (error) {
        console.error('Error marking notification as read:', error);
      }
    }

    // Navigate based on notification type
    const style = notificationService.getNotificationStyle(notification);
    
    switch (style.type) {
      case 'verification':
        router.push('/owner-approval');
        break;
      case 'report':
        router.push('/laporan');
        break;
      case 'spot':
        // Untuk admin: pergi ke approval spot
        // Untuk owner: pergi ke spot detail
        router.push('/owner-spot');
        break;
      case 'event':
        router.push('/event-approval');
        break;
      case 'payment':
        router.push('/finance');
        break;
      case 'booking':
        // Bisa navigate ke booking detail
        console.log('Navigate to booking detail');
        break;
      default:
        console.log('Notification pressed:', notification);
    }
  };

  const markAllAsRead = async () => {
    try {
      await notificationService.markAllAsRead();
      // Update local state
      setNotifications(prev => 
        prev.map(notification => ({ ...notification, is_read: true }))
      );
      alert('Semua notifikasi telah ditandai sebagai sudah dibaca');
    } catch (error) {
      console.error('Error marking all as read:', error);
      alert('Gagal menandai semua notifikasi sebagai sudah dibaca');
    }
  };

  const NotificationCard = ({ notification }: { notification: Notification }) => {
    const style = notificationService.getNotificationStyle(notification);
    const timeText = notificationService.formatRelativeTime(notification.created_at);

    return (
      <TouchableOpacity 
        style={[
          styles.notificationCard, 
          { 
            borderLeftColor: style.borderColor,
            opacity: notification.is_read ? 0.7 : 1
          }
        ]}
        onPress={() => handleNotificationPress(notification)}
      >
        {!notification.is_read && (
          <View style={styles.unreadDot} />
        )}
        <View style={[styles.notificationIcon, { backgroundColor: `${style.color}20` }]}>
          <MaterialIcons name={style.icon as any} size={20} color={style.color} />
        </View>
        <View style={styles.notificationContent}>
          <View style={styles.notificationHeader}>
            <Text style={styles.notificationTitle}>{notification.title}</Text>
            <Text style={styles.notificationTime}>{timeText}</Text>
          </View>
          <Text style={styles.notificationMessage} numberOfLines={2}>
            {notification.message}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="light-content" backgroundColor="#0B253C" />
        <View style={styles.header}>
          <View style={styles.headerContent}>
            <TouchableOpacity style={styles.menuButton} onPress={handleBack}>
              <MaterialIcons name="arrow-back" size={26} color="#fff" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Notifikasi</Text>
            <View style={styles.filterButton} />
          </View>
        </View>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#0B253C" />
          <Text style={styles.loadingText}>Memuat notifikasi...</Text>
        </View>
      </SafeAreaView>
    );
  }

  const hasUnread = notifications.some(notif => !notif.is_read);
  const hasNotifications = notifications.length > 0;

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
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={['#0B253C']}
            tintColor="#0B253C"
          />
        }
      >
        {hasNotifications ? (
          <>
            {/* Header Section */}
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Notifikasi</Text>
              {hasUnread && (
                <TouchableOpacity onPress={markAllAsRead}>
                  <Text style={styles.markAllText}>Tandai Semua Sudah Dibaca</Text>
                </TouchableOpacity>
              )}
            </View>

            {/* Today's Notifications */}
            {groupedNotifications.today.length > 0 && (
              <>
                <Text style={styles.sectionSubtitle}>Hari Ini</Text>
                <View style={styles.notificationsList}>
                  {groupedNotifications.today.map((notification) => (
                    <NotificationCard key={notification.id} notification={notification} />
                  ))}
                </View>
              </>
            )}

            {/* Yesterday's Notifications */}
            {groupedNotifications.yesterday.length > 0 && (
              <>
                <View style={styles.divider} />
                <Text style={styles.sectionSubtitle}>Kemarin</Text>
                <View style={styles.notificationsList}>
                  {groupedNotifications.yesterday.map((notification) => (
                    <NotificationCard key={notification.id} notification={notification} />
                  ))}
                </View>
              </>
            )}

            {/* Older Notifications */}
            {groupedNotifications.older.length > 0 && (
              <>
                <View style={styles.divider} />
                <Text style={styles.sectionSubtitle}>Sebelumnya</Text>
                <View style={styles.notificationsList}>
                  {groupedNotifications.older.map((notification) => (
                    <NotificationCard key={notification.id} notification={notification} />
                  ))}
                </View>
              </>
            )}

            {/* End of Notifications */}
            <View style={styles.endContainer}>
              <Text style={styles.endText}>Tidak ada notifikasi lainnya</Text>
            </View>
          </>
        ) : (
          <View style={styles.emptyContainer}>
            <MaterialIcons name="notifications-off" size={64} color="#ccc" />
            <Text style={styles.emptyTitle}>Tidak ada notifikasi</Text>
            <Text style={styles.emptyText}>
              Anda belum memiliki notifikasi. Notifikasi akan muncul di sini 
              ketika ada pembaruan terkait akun atau aktivitas Anda.
            </Text>
            <TouchableOpacity 
              style={styles.refreshButton}
              onPress={fetchNotifications}
            >
              <Text style={styles.refreshButtonText}>Refresh</Text>
            </TouchableOpacity>
          </View>
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 12,
    color: '#666',
    fontSize: 14,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 60,
    paddingHorizontal: 32,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#111518',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 24,
  },
  refreshButton: {
    backgroundColor: '#0B253C',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  refreshButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 14,
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
  sectionSubtitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#111518',
    marginBottom: 12,
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