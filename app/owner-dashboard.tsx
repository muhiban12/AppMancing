import React, { useState } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  Image,
  ScrollView,
  Dimensions,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { router } from 'expo-router';

const { width: screenWidth } = Dimensions.get('window');

export default function OwnerDashboard() {
  const [activeTab, setActiveTab] = useState<'home' | 'spot' | 'profile'>('home');

  // Stats data
  const stats = [
    {
      id: 1,
      title: 'Pendapatan',
      value: 'Rp 850rb',
      change: '+12% Hari ini',
      icon: 'payments',
      color: '#2ecc71',
      bgColor: '#2ecc7110',
    },
    {
      id: 2,
      title: 'Kursi Terisi',
      value: '15',
      subtitle: '/ 20',
      progress: 75,
      icon: 'chair-alt',
      color: '#0f4c81',
      bgColor: '#0f4c8110',
    },
    {
      id: 3,
      title: 'Belum Scan',
      value: '3 Tiket',
      status: 'Action Needed',
      icon: 'qr-code-scanner',
      color: '#ff9f43',
      bgColor: '#ff9f4310',
    },
  ];

  // Today's reservations
  const reservations = [
    {
      id: 1,
      time: '08:00',
      customer: 'Budi Santoso',
      ticket: '#8821',
      spot: 'Lapak 12',
      status: 'Lunas',
      statusColor: '#2ecc71',
      bgColor: '#2ecc7110',
    },
    {
      id: 2,
      time: '09:15',
      customer: 'Dimas Pratama',
      ticket: '#8824',
      spot: 'Lapak 05',
      status: 'Belum Scan',
      statusColor: '#ff9f43',
      bgColor: '#ff9f4310',
      highlighted: true,
    },
    {
      id: 3,
      time: '10:30',
      customer: 'Agus Setiawan',
      ticket: '#8819',
      spot: 'Lapak 02',
      status: 'Selesai',
      statusColor: '#95a5a6',
      bgColor: '#ecf0f1',
      completed: true,
    },
  ];

  // Reviews data
  const reviews = {
    rating: 4.8,
    totalReviews: 124,
    latestReview: {
      customer: 'Raka Aditya',
      initials: 'RA',
      time: 'Baru saja',
      comment: '"Tempatnya chill banget, fasilitas lengkap. Recommended buat yang mau mancing santai!"',
    },
  };

  const handleScanTicket = () => {
    console.log('Open scanner');
  };

  const handleViewAllReservations = () => {
    console.log('View all reservations');
  };

  const handleViewAllReviews = () => {
    console.log('View all reviews');
  };

  const handleBackToMap = () => {
    router.back();
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      
      {/* Header with Back Button */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={handleBackToMap}
          >
            <MaterialIcons name="arrow-back" size={24} color="#0f4c81" />
          </TouchableOpacity>
          
          <View style={styles.profileSection}>
            <View style={styles.avatarContainer}>
              <Image
                source={{ uri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC6B_GxbiVADNTOlQ3rT-X6udAIgmqbH44Sv55578iYRBXdNNn4Gb4DlWdEcJDsd0CY8VvhnyLaZoA8uMmQUIvVKHsDpHQdzOjbgnoUrToxeksCk5DJ0JJu4EtpX2We2rMfNqnXna-_uTLqB7vnew6bpmLunl-SrCJs4jJZ6gxkl-sRkr8Y-uUYZjgBs-RddZWrozyVvaIsTbJ8HM6qC8dC0fvMLhM08cJjFGuBBoSoir8qCnn021zxoynxi4H44jrNggMzdeNME-Xa' }}
                style={styles.avatar}
              />
              <View style={styles.onlineIndicator} />
            </View>
            <View style={styles.profileInfo}>
              <Text style={styles.profileRole}>Dashboard Pemilik</Text>
              <Text style={styles.profileName}>Telaga Berkah</Text>
            </View>
          </View>
        </View>
        
        <TouchableOpacity 
  style={styles.notificationButton}
  onPress={() => router.push('/notifications-owner')}
>
  <MaterialIcons name="notifications" size={24} color="#617989" />
  <View style={styles.notificationBadge}>
    <View style={styles.notificationPing} />
    <View style={styles.notificationDot} />
  </View>
</TouchableOpacity>
      </View>

      <ScrollView 
        style={styles.content}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.contentContainer}
      >
        {/* Stats Cards */}
        <View style={styles.statsSection}>
          <View style={styles.statsGrid}>
            {stats.map((stat) => (
              <View key={stat.id} style={styles.statCard}>
                <View style={[styles.statIcon, { backgroundColor: stat.bgColor }]}>
                  <MaterialIcons name={stat.icon as any} size={20} color={stat.color} />
                </View>
                <Text style={styles.statTitle}>{stat.title}</Text>
                <View style={styles.statValueContainer}>
                  <Text style={styles.statValue}>{stat.value}</Text>
                  {stat.subtitle && (
                    <Text style={styles.statSubtitle}>{stat.subtitle}</Text>
                  )}
                </View>
                {stat.change && (
                  <Text style={[styles.statChange, { color: stat.color }]}>
                    {stat.change}
                  </Text>
                )}
                {stat.progress && (
                  <View style={styles.progressBar}>
                    <View 
                      style={[
                        styles.progressFill, 
                        { 
                          width: `${stat.progress}%`,
                          backgroundColor: stat.color 
                        }
                      ]} 
                    />
                  </View>
                )}
                {stat.status && (
                  <Text style={[styles.statStatus, { color: stat.color }]}>
                    {stat.status}
                  </Text>
                )}
              </View>
            ))}
          </View>
        </View>

        {/* Management Menu */}
        <View style={styles.menuSection}>
          <Text style={styles.sectionTitle}>Menu Kelola</Text>
          <View style={styles.menuGrid}>
            <TouchableOpacity
              style={styles.menuButton}
              onPress={() => router.push('/manage-seats')}
            >
              <View style={styles.menuIcon}>
                <MaterialIcons name="event-seat" size={24} color="#0f4c81" />
              </View>
              <Text style={styles.menuLabel}>Kelola Kursi</Text>
            </TouchableOpacity>
            
            <TouchableOpacity
  style={styles.menuButton}
  onPress={() => router.push('/create-event')}
>
  <View style={styles.menuIcon}>
    <MaterialIcons name="emoji-events" size={24} color="#0f4c81" />
  </View>
  <Text style={styles.menuLabel}>Buat Event</Text>
</TouchableOpacity>
            
            <TouchableOpacity
  style={styles.menuButton}
  onPress={() => router.push('/finance')}
>
  <View style={styles.menuIcon}>
    <MaterialIcons name="analytics" size={24} color="#0f4c81" />
  </View>
  <Text style={styles.menuLabel}>Keuangan</Text>
</TouchableOpacity>
          </View>
        </View>

        {/* Today's Reservations */}
        <View style={styles.reservationSection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Reservasi Hari Ini</Text>
            <TouchableOpacity onPress={handleViewAllReservations}>
              <Text style={styles.viewAllButton}>Lihat Semua</Text>
            </TouchableOpacity>
          </View>
          
          <View style={styles.reservationList}>
            {reservations.map((res) => (
              <View 
                key={res.id} 
                style={[
                  styles.reservationCard,
                  res.highlighted && styles.highlightedCard,
                  res.completed && styles.completedCard
                ]}
              >
                <View style={styles.timeColumn}>
                  <Text style={[
                    styles.timeText,
                    res.completed && styles.completedText
                  ]}>
                    {res.time}
                  </Text>
                  <Text style={styles.timeZone}>WIB</Text>
                </View>
                
                <View style={styles.reservationInfo}>
                  <View style={styles.reservationHeader}>
                    <Text style={[
                      styles.customerName,
                      res.completed && styles.completedText
                    ]}>
                      {res.customer}
                    </Text>
                    <View style={[styles.statusBadge, { backgroundColor: res.bgColor }]}>
                      <Text style={[styles.statusText, { color: res.statusColor }]}>
                        {res.status}
                      </Text>
                    </View>
                  </View>
                  
                  <View style={styles.reservationDetails}>
                    <View style={styles.detailItem}>
                      <MaterialIcons name="confirmation-number" size={14} color="#617989" />
                      <Text style={[
                        styles.detailText,
                        res.completed && styles.completedText
                      ]}>
                        {res.ticket}
                      </Text>
                    </View>
                    
                    <View style={styles.dotSeparator} />
                    
                    <Text style={[
                      styles.spotText,
                      res.completed && styles.completedText
                    ]}>
                      {res.spot}
                    </Text>
                  </View>
                </View>
              </View>
            ))}
          </View>
        </View>

        {/* Customer Reviews */}
        <View style={styles.reviewSection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Ulasan Pelanggan</Text>
            <TouchableOpacity onPress={handleViewAllReviews}>
              <Text style={styles.viewAllButton}>Lihat Semua</Text>
            </TouchableOpacity>
          </View>
          
          <View style={styles.reviewCard}>
            <View style={styles.ratingSection}>
              <View style={styles.ratingCircle}>
                <Text style={styles.ratingNumber}>{reviews.rating}</Text>
                <View style={styles.starsContainer}>
                  {[1, 2, 3, 4].map((star) => (
                    <MaterialIcons key={star} name="star" size={14} color="#ff9f43" />
                  ))}
                  <MaterialIcons name="star-half" size={14} color="#ff9f43" />
                </View>
              </View>
              
              <View style={styles.ratingInfo}>
                <Text style={styles.ratingTitle}>Sangat Bagus</Text>
                <Text style={styles.ratingSubtitle}>
                  Berdasarkan {reviews.totalReviews} ulasan bulan ini
                </Text>
                <View style={styles.ratingProgress}>
                  <View style={styles.progressTrack} />
                  <View style={styles.progressFill85} />
                </View>
              </View>
            </View>
            
            <View style={styles.latestReview}>
              <View style={styles.reviewerAvatar}>
                <Text style={styles.reviewerInitials}>{reviews.latestReview.initials}</Text>
              </View>
              
              <View style={styles.reviewContent}>
                <View style={styles.reviewHeader}>
                  <Text style={styles.reviewerName}>{reviews.latestReview.customer}</Text>
                  <Text style={styles.reviewTime}>{reviews.latestReview.time}</Text>
                </View>
                <Text style={styles.reviewComment}>{reviews.latestReview.comment}</Text>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Scan Ticket Button */}
      <TouchableOpacity 
        style={styles.scanButton}
        onPress={handleScanTicket}
      >
        <View style={styles.scanIcon}>
          <MaterialIcons name="qr-code-scanner" size={20} color="#fff" />
        </View>
        <Text style={styles.scanText}>Scan Tiket</Text>
      </TouchableOpacity>

      {/* Bottom Navigation */}
      <View style={styles.bottomNav}>
        <TouchableOpacity 
          style={styles.navItem}
          onPress={() => setActiveTab('home')}
        >
          <MaterialIcons 
            name="dashboard" 
            size={24} 
            color={activeTab === 'home' ? '#0f4c81' : '#617989'} 
          />
          <Text style={[
            styles.navText,
            activeTab === 'home' && styles.navTextActive
          ]}>
            Beranda
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
  style={styles.navItem}
  onPress={() => router.push('/my-spot')}
>
  <MaterialIcons 
    name="location-on" 
    size={24} 
    color={activeTab === 'spot' ? '#0f4c81' : '#617989'} 
  />
  <Text style={[
    styles.navText,
    activeTab === 'spot' && styles.navTextActive
  ]}>
    Spot Saya
  </Text>
</TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.navItem}
          onPress={() => setActiveTab('profile')}
        >
          <MaterialIcons 
            name="person" 
            size={24} 
            color={activeTab === 'profile' ? '#0f4c81' : '#617989'} 
          />
          <Text style={[
            styles.navText,
            activeTab === 'profile' && styles.navTextActive
          ]}>
            Profil
          </Text>
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
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingVertical: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8fafc',
    borderRadius: 20,
  },
  profileSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  avatarContainer: {
    position: 'relative',
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
  },
  onlineIndicator: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#2ecc71',
    borderWidth: 2,
    borderColor: '#fff',
  },
  profileInfo: {
    gap: 2,
  },
  profileRole: {
    fontSize: 12,
    color: '#617989',
    fontWeight: '500',
  },
  profileName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#0f4c81',
  },
  notificationButton: {
    padding: 8,
    position: 'relative',
  },
  notificationBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
  },
  notificationPing: {
    position: 'absolute',
    top: -4,
    right: -4,
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: '#ff9f43',
    opacity: 0.75,
  },
  notificationDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#ff9f43',
    position: 'absolute',
    top: 0,
    right: 0,
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    paddingBottom: 100,
  },
  statsSection: {
    padding: 16,
  },
  statsGrid: {
    flexDirection: 'row',
    gap: 12,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 12,
    gap: 8,
    borderWidth: 1,
    borderColor: '#f1f5f9',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  statIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  statTitle: {
    fontSize: 10,
    color: '#617989',
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  statValueContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 2,
  },
  statValue: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#111518',
  },
  statSubtitle: {
    fontSize: 9,
    color: '#95a5a6',
    marginBottom: 1,
  },
  statChange: {
    fontSize: 9,
    fontWeight: '500',
  },
  statStatus: {
    fontSize: 9,
    fontWeight: '500',
  },
  progressBar: {
    height: 4,
    backgroundColor: '#f8f9fa',
    borderRadius: 2,
    marginTop: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 2,
  },
  menuSection: {
    paddingHorizontal: 16,
    paddingBottom: 8,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#111518',
    marginBottom: 12,
  },
  menuGrid: {
    flexDirection: 'row',
    gap: 12,
  },
  menuButton: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    gap: 8,
    borderWidth: 1,
    borderColor: '#f1f5f9',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  menuIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#f8fafc',
    justifyContent: 'center',
    alignItems: 'center',
  },
  menuLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: '#2d3436',
    textAlign: 'center',
  },
  reservationSection: {
    paddingHorizontal: 16,
    paddingTop: 24,
    paddingBottom: 8,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  viewAllButton: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#0f4c81',
    backgroundColor: '#0f4c810d',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  reservationList: {
    gap: 12,
  },
  reservationCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    flexDirection: 'row',
    gap: 16,
    borderWidth: 1,
    borderColor: '#f1f5f9',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  highlightedCard: {
    borderLeftWidth: 4,
    borderLeftColor: '#ff9f43',
  },
  completedCard: {
    opacity: 0.7,
  },
  timeColumn: {
    alignItems: 'center',
    minWidth: 56,
    borderRightWidth: 1,
    borderRightColor: '#f1f5f9',
    paddingRight: 16,
  },
  timeText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#0f4c81',
  },
  completedText: {
    color: '#95a5a6',
  },
  timeZone: {
    fontSize: 10,
    color: '#95a5a6',
    fontWeight: '500',
  },
  reservationInfo: {
    flex: 1,
  },
  reservationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  customerName: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#111518',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 10,
    fontWeight: 'bold',
  },
  reservationDetails: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  detailText: {
    fontSize: 12,
    color: '#617989',
  },
  dotSeparator: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#bdc3c7',
  },
  spotText: {
    fontSize: 12,
    color: '#2d3436',
    fontWeight: '500',
  },
  reviewSection: {
    paddingHorizontal: 16,
    paddingTop: 24,
    paddingBottom: 24,
  },
  reviewCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#f1f5f9',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  ratingSection: {
    flexDirection: 'row',
    gap: 16,
    alignItems: 'center',
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  ratingCircle: {
    width: 72,
    height: 72,
    borderRadius: 12,
    backgroundColor: '#ff9f4310',
    justifyContent: 'center',
    alignItems: 'center',
  },
  ratingNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ff9f43',
  },
  starsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 2,
    marginTop: 4,
  },
  ratingInfo: {
    flex: 1,
  },
  ratingTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#111518',
    marginBottom: 4,
  },
  ratingSubtitle: {
    fontSize: 10,
    color: '#617989',
    marginBottom: 8,
  },
  ratingProgress: {
    height: 6,
    backgroundColor: '#f8f9fa',
    borderRadius: 3,
    overflow: 'hidden',
    position: 'relative',
  },
  progressTrack: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    backgroundColor: '#f8f9fa',
  },
  progressFill85: {
    width: '85%',
    height: '100%',
    backgroundColor: '#ff9f43',
    borderRadius: 3,
  },
  latestReview: {
    flexDirection: 'row',
    gap: 12,
    alignItems: 'flex-start',
    marginTop: 16,
  },
  reviewerAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#2ecc7110',
    justifyContent: 'center',
    alignItems: 'center',
  },
  reviewerInitials: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#2ecc71',
  },
  reviewContent: {
    flex: 1,
  },
  reviewHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  reviewerName: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#111518',
  },
  reviewTime: {
    fontSize: 10,
    color: '#95a5a6',
  },
  reviewComment: {
    fontSize: 12,
    color: '#2d3436',
    fontStyle: 'italic',
    lineHeight: 18,
  },
  scanButton: {
    position: 'absolute',
    bottom: 80,
    right: 16,
    backgroundColor: '#0f4c81',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 24,
    shadowColor: '#0f4c81',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  scanIcon: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    padding: 4,
    borderRadius: 6,
  },
  scanText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
    letterSpacing: 0.5,
  },
  bottomNav: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#e2e8f0',
    flexDirection: 'row',
    height: 64,
    paddingBottom: 8,
  },
  navItem: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 4,
  },
  navText: {
    fontSize: 10,
    color: '#617989',
    fontWeight: '500',
  },
  navTextActive: {
    color: '#0f4c81',
    fontWeight: 'bold',
  },
});