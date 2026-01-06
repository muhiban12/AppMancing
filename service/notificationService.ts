// services/notificationService.ts
import api from './api';

export interface Notification {
  id: number;
  title: string;
  message: string;
  is_read: boolean;
  created_at: string;
  type?: string; // Optional: untuk menentukan jenis notifikasi
  icon?: string;
  color?: string;
  borderColor?: string;
}

export const notificationService = {
  // Get all notifications for user
  async getNotifications(): Promise<Notification[]> {
    try {
      const response = await api.get('/notifications');
      return response.data;
    } catch (error) {
      console.error('Error fetching notifications:', error);
      throw error;
    }
  },

  // Mark notification as read
  async markAsRead(notificationId: number): Promise<void> {
    try {
      await api.patch(`/notifications/${notificationId}/read`);
    } catch (error) {
      console.error('Error marking notification as read:', error);
      throw error;
    }
  },

  // Mark all notifications as read
  async markAllAsRead(): Promise<void> {
    try {
      const response = await api.get('/notifications');
      const unreadNotifications = response.data.filter((notif: Notification) => !notif.is_read);
      
      // Mark each unread notification
      for (const notif of unreadNotifications) {
        await this.markAsRead(notif.id);
      }
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
      throw error;
    }
  },

  // Determine notification type and styling based on content
  getNotificationStyle(notification: Notification) {
    let icon = 'notifications';
    let color = '#0B253C';
    let borderColor = '#f0f0f0';
    let type = 'general';

    // Determine type based on title or message content
    const title = notification.title.toLowerCase();
    const message = notification.message.toLowerCase();

    if (title.includes('verifikasi') || message.includes('verifikasi')) {
      icon = 'verified-user';
      color = '#ff9f1c';
      type = 'verification';
    } else if (title.includes('laporan') || message.includes('lapor')) {
      icon = 'report';
      color = '#ef4444';
      type = 'report';
    } else if (title.includes('spot') || message.includes('spot')) {
      icon = 'add-location-alt';
      color = '#26c485';
      type = 'spot';
    } else if (title.includes('lomba') || title.includes('event') || title.includes('turnamen')) {
      icon = 'emoji-events';
      color = '#2b9dee';
      type = 'event';
    } else if (title.includes('sistem') || title.includes('maintenance')) {
      icon = 'system-update';
      color = '#0B253C';
      type = 'system';
    } else if (title.includes('selesai') || title.includes('completed')) {
      icon = 'check-circle';
      color = '#26c485';
      type = 'completed';
    } else if (title.includes('pembayaran') || message.includes('pembayaran')) {
      icon = 'payment';
      color = '#8b5cf6';
      type = 'payment';
    } else if (title.includes('booking') || message.includes('kursi')) {
      icon = 'event-seat';
      color = '#3b82f6';
      type = 'booking';
    }

    return { icon, color, borderColor: notification.is_read ? '#f0f0f0' : color, type };
  },

  // Format time relative to now
  formatRelativeTime(dateString: string): string {
    const now = new Date();
    const notificationDate = new Date(dateString);
    const diffMs = now.getTime() - notificationDate.getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffMins < 1) {
      return 'Baru saja';
    } else if (diffMins < 60) {
      return `${diffMins}m lalu`;
    } else if (diffHours < 24) {
      return `${diffHours}j lalu`;
    } else if (diffDays === 1) {
      return 'Kemarin';
    } else if (diffDays < 7) {
      return `${diffDays} hari lalu`;
    } else {
      // Format tanggal
      return notificationDate.toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'short',
        year: 'numeric'
      });
    }
  },

  // Group notifications by date
  groupNotificationsByDate(notifications: Notification[]) {
    const today = new Date().toDateString();
    const yesterday = new Date(Date.now() - 86400000).toDateString();
    
    const todayNotifications: Notification[] = [];
    const yesterdayNotifications: Notification[] = [];
    const olderNotifications: Notification[] = [];

    notifications.forEach(notif => {
      const notifDate = new Date(notif.created_at).toDateString();
      
      if (notifDate === today) {
        todayNotifications.push(notif);
      } else if (notifDate === yesterday) {
        yesterdayNotifications.push(notif);
      } else {
        olderNotifications.push(notif);
      }
    });

    return {
      today: todayNotifications,
      yesterday: yesterdayNotifications,
      older: olderNotifications
    };
  }
};