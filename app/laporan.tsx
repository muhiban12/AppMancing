import React, { useState } from 'react';
import {
  SafeAreaView,
  ScrollView,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  Image,
  Alert,
} from 'react-native';
import { MaterialIcons } from "@expo/vector-icons";
import { router } from 'expo-router';

type ReportType = 'feed' | 'review';
type ReportStatus = 'inappropriate' | 'spam' | 'fake' | 'hate';
type Report = {
  id: string;
  type: ReportType;
  status: ReportStatus;
  userName: string;
  userAvatar: string;
  timeAgo: string;
  content: string;
  imageUrl?: string;
  spotName?: string;
  rating?: number;
  reportedBy: string;
  reportedReason: string;
  isPreview?: boolean;
};

export default function ContentModeration() {
  const [activeTab, setActiveTab] = useState<'feed' | 'review'>('feed');
  const [reports, setReports] = useState<Report[]>([
    {
      id: '1',
      type: 'feed',
      status: 'inappropriate',
      userName: 'FishingMaster99',
      userAvatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuADQan5ckuXLS2pba2yKDDMBfVMZuB9N62p2GwgKlaOTCxI_eQTidr3ps8ucKsTjL90Nf8-C33K5yvrb1MBa2y9cbBzsEA0W5yGvnkJQqa84rsp1oyGJPF0bnRhRGCXQTlSbJ_JWtqMTvgz28WIHJ7mXtXN9ORnE0wq-KFlG3KGF7k5Tt_jphj5sOI52JKjRyjMngkuRmM4TDKu74so3U5TK8y0DLLkdqshp2HoQaBX6TPKw2r55ieyOqRQfQTToWpwG8j6gb8wGrGd',
      timeAgo: '2 jam lalu',
      content: 'Look at this absolute monster! Too bad the spot was crowded with idiots. #dumbpeople',
      imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDzqZXWewkiXsf0mpXmev0XMqvYR9-d27WIEjRm9MwU5FgDjJCW0zDRhIETIS0d2LYgCaHjOPGGhq6kUNz-O_cH-OEJtgK3RPW1Q7UUn2YvOjIj8JGlIUT1FY3DqaTM2yyVjy-Akt9MZRm4ulOrBcoopzJzrzxI1Ij5PuO218U8PWi4DU5r_kGSfUedoex2GOzVfKPB6ot3eLid9RHDCBAu3QfY-tJGgOMzvaz1QtVYZ5Dsqb2_i7PVrEMRAbX63BvyTv8-D62YChKD',
      reportedBy: '3 users',
      reportedReason: 'Offensive language, Harassment.',
    },
    {
      id: '2',
      type: 'feed',
      status: 'spam',
      userName: 'ShopDiscount_Official',
      userAvatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCJ9Wu-7N07WrotpSElj001i0m_8K4plwLz0268jo1LZF3V6J9r3HDZFNOoa4JMUbmZQNL7IX1SbbGu7EMskOrVb9tNWszjNfzFRiakjFsti54A5J2KrI2tTihZaeLQVXZ8Mg_Us_NqTPUAck6HeWIyQggkdyJiRdKjFoEf7pTC4gG83J3SWjkvw7THzRbZKGPmJZhS2kQQMNT_BkNihPZH00KejvRVD_xEtPRdXCMpSRH8z5uhWR7FY6Iy88kv4862g7lNGM1TK2JK',
      timeAgo: '15 menit lalu',
      content: '🔥 90% OFF Premium Gear! Visit www.fish-scam-site.com now before it\'s gone! limited time offer!!',
      imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCJ9Wu-7N07WrotpSElj001i0m_8K4plwLz0268jo1LZF3V6J9r3HDZFNOoa4JMUbmZQNL7IX1SbbGu7EMskOrVb9tNWszjNfzFRiakjFsti54A5J2KrI2tTihZaeLQVXZ8Mg_Us_NqTPUAck6HeWIyQggkdyJiRdKjFoEf7pTC4gG83J3SWjkvw7THzRbZKGPmJZhS2kQQMNT_BkNihPZH00KejvRVD_xEtPRdXCMpSRH8z5uhWR7FY6Iy88kv4862g7lNGM1TK2JK',
      reportedBy: 'System AI + 1 User',
      reportedReason: 'Spam, Suspicious Link.',
    },
    {
      id: '3',
      type: 'review',
      status: 'fake',
      userName: 'SaltyRod_User',
      userAvatar: '',
      timeAgo: '1 jam lalu',
      content: '"Tempat ini bau sampah! Jangan kesini kalau gamau rugi bandar. Pemiliknya kasar."',
      spotName: 'Muara Angke Spot',
      rating: 1,
      reportedBy: 'Spot Owner',
      reportedReason: 'Review bombing from competitor account, never visited.',
      isPreview: true,
    },
    {
      id: '4',
      type: 'review',
      status: 'hate',
      userName: 'KangAngler_123',
      userAvatar: '',
      timeAgo: '45 menit lalu',
      content: '"Woy anj*** tempat apaan nih, isinya cuman bocil kematian semua!"',
      spotName: 'Danau Sunter Paradise',
      rating: 2,
      reportedBy: '5 Users',
      reportedReason: 'Inappropriate language, offensive content.',
      isPreview: true,
    },
    // Tambahan data untuk tab review
    {
      id: '5',
      type: 'review',
      status: 'fake',
      userName: 'AnglerPro_88',
      userAvatar: '',
      timeAgo: '3 jam lalu',
      content: '"Pelayanan buruk, harga mahal, tidak worth it sama sekali!"',
      spotName: 'Kolam Pancing Jaya',
      rating: 1,
      reportedBy: 'Spot Manager',
      reportedReason: 'Fake negative review, user never visited.',
    },
    {
      id: '6',
      type: 'review',
      status: 'inappropriate',
      userName: 'FishKiller_007',
      userAvatar: '',
      timeAgo: '5 jam lalu',
      content: '"Disini ikan kecil semua, buang waktu saja!"',
      spotName: 'Danau Lestari',
      rating: 2,
      reportedBy: '2 Users',
      reportedReason: 'Harassment to spot owner.',
    },
  ]);

  const handleBack = () => {
    router.back();
  };

  const handleFilter = () => {
    console.log('Open filter');
  };

  const handleCloseReport = (reportId: string) => {
    Alert.alert(
      'Tutup Laporan',
      'Apakah Anda yakin ingin menutup laporan ini?',
      [
        { text: 'Batal', style: 'cancel' },
        { 
          text: 'Tutup', 
          onPress: () => {
            setReports(prev => prev.filter(report => report.id !== reportId));
            Alert.alert('Berhasil!', 'Laporan telah ditutup.');
          }
        },
      ]
    );
  };

  const handleDeleteContent = (reportId: string, type: ReportType) => {
    const contentType = type === 'feed' ? 'posting' : 'ulasan';
    
    Alert.alert(
      `Hapus ${contentType === 'posting' ? 'Posting' : 'Ulasan'}`,
      `Apakah Anda yakin ingin menghapus ${contentType} ini?`,
      [
        { text: 'Batal', style: 'cancel' },
        { 
          text: 'Hapus', 
          style: 'destructive',
          onPress: () => {
            setReports(prev => prev.filter(report => report.id !== reportId));
            Alert.alert('Berhasil!', `${contentType === 'posting' ? 'Posting' : 'Ulasan'} telah dihapus.`);
          }
        },
      ]
    );
  };

  const getStatusColor = (status: ReportStatus) => {
    switch (status) {
      case 'inappropriate': return '#ef4444';
      case 'spam': return '#ff9f1c';
      case 'fake': return '#6b7280';
      case 'hate': return '#ef4444';
      default: return '#6b7280';
    }
  };

  const getStatusIcon = (status: ReportStatus) => {
    switch (status) {
      case 'inappropriate': return 'warning';
      case 'spam': return 'phishing';
      case 'fake': return 'reviews';
      case 'hate': return 'gavel';
      default: return 'flag';
    }
  };

  const getStatusText = (status: ReportStatus) => {
    switch (status) {
      case 'inappropriate': return 'Tidak Pantas';
      case 'spam': return 'Spam / Scam';
      case 'fake': return 'Ulasan Palsu';
      case 'hate': return 'Hate Speech';
      default: return 'Laporan';
    }
  };

  // Filter reports berdasarkan tab aktif
  const filteredReports = reports.filter(report => {
    if (activeTab === 'feed') {
      // Di tab feed, tampilkan posting umpan DAN preview ulasan
      return report.type === 'feed' || report.isPreview;
    } else {
      // Di tab review, tampilkan semua ulasan (tanpa filter preview)
      return report.type === 'review';
    }
  });

  const pendingCount = reports.filter(report => 
    activeTab === 'feed' ? report.type === 'feed' : report.type === 'review'
  ).length;

  // Preview reports (untuk tab feed)
  const previewReviews = reports.filter(report => 
    report.type === 'review' && report.isPreview
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#003366" />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.menuButton} onPress={handleBack}>
          <MaterialIcons name="menu" size={26} color="#fff" />
        </TouchableOpacity>
        
        <Text style={styles.headerTitle}>Moderasi Konten</Text>
        
        <TouchableOpacity style={styles.filterButton} onPress={handleFilter}>
          <MaterialIcons name="filter-list" size={24} color="#fff" />
        </TouchableOpacity>
      </View>

      {/* Tab Navigation */}
      <View style={styles.tabContainer}>
        <View style={styles.tabWrapper}>
          <TouchableOpacity
            style={[styles.tabButton, activeTab === 'feed' && styles.activeTab]}
            onPress={() => setActiveTab('feed')}
          >
            <Text style={[styles.tabText, activeTab === 'feed' && styles.activeTabText]}>
              Laporan Posting Umpan
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[styles.tabButton, activeTab === 'review' && styles.activeTab]}
            onPress={() => setActiveTab('review')}
          >
            <Text style={[styles.tabText, activeTab === 'review' && styles.activeTabText]}>
              Laporan Ulasan
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView 
        style={styles.content}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.contentContainer}
      >
        {/* Header Info */}
        <View style={styles.headerInfo}>
          <View>
            <Text style={styles.title}>Laporan Tertunda</Text>
            <Text style={styles.subtitle}>Kelola konten yang dilaporkan dengan efisien</Text>
          </View>
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{pendingCount} Tertunda</Text>
          </View>
        </View>

        {/* Reports List */}
        {filteredReports.map((report, index) => (
          <View key={report.id} style={[
            styles.reportCard,
            report.type === 'review' && styles.reviewCard,
            report.isPreview && styles.previewCard
          ]}>
            {/* User Info */}
            <View style={styles.userSection}>
              <View style={styles.userInfo}>
                {report.userAvatar ? (
                  <Image 
                    source={{ uri: report.userAvatar }} 
                    style={styles.userAvatar} 
                  />
                ) : (
                  <View style={[
                    styles.avatarPlaceholder,
                    { backgroundColor: index % 2 === 0 ? 'rgba(38, 196, 133, 0.1)' : 'rgba(168, 85, 247, 0.1)' }
                  ]}>
                    <Text style={[
                      styles.avatarText,
                      { color: index % 2 === 0 ? '#26c485' : '#a855f7' }
                    ]}>
                      {report.userName.substring(0, 2).toUpperCase()}
                    </Text>
                  </View>
                )}
                <View style={styles.userDetails}>
                  <Text style={styles.userName}>{report.userName}</Text>
                  <Text style={styles.timeText}>Diposting {report.timeAgo}</Text>
                  {report.spotName && (
                    <Text style={styles.spotText}>Ulasan untuk: <Text style={styles.spotName}>{report.spotName}</Text></Text>
                  )}
                </View>
              </View>
              
              <View style={[
                styles.statusBadge,
                { backgroundColor: `${getStatusColor(report.status)}20` }
              ]}>
                <MaterialIcons 
                  name={getStatusIcon(report.status) as any} 
                  size={14} 
                  color={getStatusColor(report.status)} 
                />
                <Text style={[styles.statusText, { color: getStatusColor(report.status) }]}>
                  {getStatusText(report.status)}
                </Text>
              </View>
            </View>

            {/* Content */}
            <View style={styles.contentSection}>
              {report.rating && (
                <View style={styles.ratingContainer}>
                  {[1, 2, 3, 4, 5].map((star) => (
                    <MaterialIcons
                      key={star}
                      name={star <= report.rating! ? "star" : "star-border"}
                      size={16}
                      color={star <= report.rating! ? "#ff9f1c" : "#d1d5db"}
                    />
                  ))}
                </View>
              )}
              
              <Text style={styles.reportContent}>{report.content}</Text>
              
              {report.imageUrl && (
                <View style={styles.imageContainer}>
                  <Image 
                    source={{ uri: report.imageUrl }} 
                    style={styles.contentImage} 
                  />
                  <View style={styles.imageBadge}>
                    <Text style={styles.imageBadgeText}>Strike Feed</Text>
                  </View>
                </View>
              )}

              {/* Report Info */}
              <View style={styles.reportInfo}>
                <MaterialIcons 
                  name={report.isPreview ? "report-problem" : "flag"} 
                  size={18} 
                  color="#6b7280" 
                />
                <View style={styles.reportDetails}>
                  <Text style={styles.reportBy}>Dilaporkan oleh {report.reportedBy}</Text>
                  <Text style={styles.reportReason}>Alasan: {report.reportedReason}</Text>
                </View>
              </View>
            </View>

            {/* Actions - Hanya tampilkan jika bukan preview */}
            {!report.isPreview && (
              <View style={styles.actionSection}>
                <TouchableOpacity 
                  style={styles.closeButton}
                  onPress={() => handleCloseReport(report.id)}
                >
                  <Text style={styles.closeButtonText}>Tutup Laporan</Text>
                </TouchableOpacity>
                
                <TouchableOpacity 
                  style={styles.deleteButton}
                  onPress={() => handleDeleteContent(report.id, report.type)}
                >
                  <MaterialIcons 
                    name={report.type === 'feed' ? "delete" : "delete-forever"} 
                    size={16} 
                    color="#fff" 
                  />
                  <Text style={styles.deleteButtonText}>
                    Hapus {report.type === 'feed' ? 'Posting' : 'Ulasan'}
                  </Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        ))}

        {/* Divider untuk Preview */}
        {activeTab === 'feed' && previewReviews.length > 0 && (
          <>
            <View style={styles.dividerSection}>
              <View style={styles.dividerLine} />
              <Text style={styles.dividerText}>Preview: Laporan Ulasan</Text>
              <View style={styles.dividerLine} />
            </View>
            
            {/* Preview Reviews */}
            {previewReviews.map((report) => (
              <View key={`preview-${report.id}`} style={[styles.reportCard, styles.reviewCard, styles.previewCard]}>
                <View style={styles.userSection}>
                  <View style={styles.userInfo}>
                    <View style={[styles.avatarPlaceholder, { backgroundColor: 'rgba(38, 196, 133, 0.1)' }]}>
                      <Text style={[styles.avatarText, { color: '#26c485' }]}>
                        {report.userName.substring(0, 2).toUpperCase()}
                      </Text>
                    </View>
                    <View style={styles.userDetails}>
                      <Text style={styles.userName}>{report.userName}</Text>
                      <Text style={styles.timeText}>Diposting {report.timeAgo}</Text>
                      {report.spotName && (
                        <Text style={styles.spotText}>Ulasan untuk: <Text style={styles.spotName}>{report.spotName}</Text></Text>
                      )}
                    </View>
                  </View>
                  
                  <View style={[styles.statusBadge, { backgroundColor: `${getStatusColor(report.status)}20` }]}>
                    <MaterialIcons 
                      name={getStatusIcon(report.status) as any} 
                      size={14} 
                      color={getStatusColor(report.status)} 
                    />
                    <Text style={[styles.statusText, { color: getStatusColor(report.status) }]}>
                      {getStatusText(report.status)}
                    </Text>
                  </View>
                </View>

                <View style={styles.contentSection}>
                  <View style={styles.ratingContainer}>
                    {[1, 2, 3, 4, 5].map((star) => (
                      <MaterialIcons
                        key={star}
                        name={star <= report.rating! ? "star" : "star-border"}
                        size={16}
                        color={star <= report.rating! ? "#ff9f1c" : "#d1d5db"}
                      />
                    ))}
                  </View>
                  
                  <Text style={[styles.reportContent, styles.italicText]}>{report.content}</Text>
                  
                  <View style={styles.reportInfo}>
                    <MaterialIcons name="report-problem" size={18} color="#6b7280" />
                    <View style={styles.reportDetails}>
                      <Text style={styles.reportBy}>Dilaporkan oleh {report.reportedBy}</Text>
                      <Text style={styles.reportReason}>Alasan: {report.reportedReason}</Text>
                    </View>
                  </View>
                </View>

                {/* Preview Action Hint */}
                <View style={styles.previewHint}>
                  <Text style={styles.previewHintText}>
                    Switch ke tab "Laporan Ulasan" untuk mengelola laporan ini
                  </Text>
                </View>
              </View>
            ))}
          </>
        )}

        {/* Load More */}
        <TouchableOpacity style={styles.loadMoreButton}>
          <MaterialIcons name="expand-more" size={20} color="#6b7280" />
          <Text style={styles.loadMoreText}>Muat lebih banyak laporan</Text>
        </TouchableOpacity>
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
  filterButton: {
    padding: 4,
  },
  tabContainer: {
    paddingHorizontal: 16,
    paddingTop: 24,
    paddingBottom: 16,
  },
  tabWrapper: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 4,
    borderWidth: 1,
    borderColor: '#f1f5f9',
  },
  tabButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  activeTab: {
    backgroundColor: '#003366',
  },
  tabText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#6b7280',
  },
  activeTabText: {
    color: '#fff',
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    paddingHorizontal: 16,
    paddingBottom: 40,
  },
  headerInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#003366',
  },
  subtitle: {
    fontSize: 14,
    color: '#6b7280',
    marginTop: 2,
  },
  badge: {
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(239, 68, 68, 0.2)',
  },
  badgeText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#ef4444',
  },
  reportCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#f1f5f9',
    overflow: 'hidden',
  },
  reviewCard: {
    borderLeftWidth: 4,
    borderLeftColor: '#26c485',
  },
  previewCard: {
    opacity: 0.9,
  },
  userSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  userAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  avatarPlaceholder: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },
  avatarText: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  userDetails: {
    flex: 1,
  },
  userName: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#111518',
  },
  timeText: {
    fontSize: 12,
    color: '#6b7280',
    marginTop: 2,
  },
  spotText: {
    fontSize: 11,
    color: '#6b7280',
    marginTop: 2,
  },
  spotName: {
    color: '#003366',
    fontWeight: '600',
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  statusText: {
    fontSize: 10,
    fontWeight: 'bold',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  contentSection: {
    padding: 16,
  },
  ratingContainer: {
    flexDirection: 'row',
    gap: 2,
    marginBottom: 8,
  },
  reportContent: {
    fontSize: 14,
    color: '#374151',
    lineHeight: 20,
    marginBottom: 12,
  },
  italicText: {
    fontStyle: 'italic',
  },
  imageContainer: {
    width: '100%',
    aspectRatio: 4/3,
    backgroundColor: '#f3f4f6',
    borderRadius: 8,
    overflow: 'hidden',
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#f1f5f9',
    position: 'relative',
  },
  contentImage: {
    width: '100%',
    height: '100%',
  },
  imageBadge: {
    position: 'absolute',
    bottom: 8,
    right: 8,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  imageBadgeText: {
    fontSize: 10,
    color: '#fff',
    fontWeight: '500',
  },
  reportInfo: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
    backgroundColor: '#f9fafb',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#f3f4f6',
  },
  reportDetails: {
    flex: 1,
  },
  reportBy: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#374151',
  },
  reportReason: {
    fontSize: 11,
    color: '#6b7280',
    marginTop: 2,
  },
  actionSection: {
    flexDirection: 'row',
    gap: 12,
    padding: 12,
    backgroundColor: '#f9fafb',
    borderTopWidth: 1,
    borderTopColor: '#f3f4f6',
  },
  closeButton: {
    flex: 1,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#d1d5db',
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  closeButtonText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#374151',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  deleteButton: {
    flex: 1,
    backgroundColor: '#ef4444',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 10,
    borderRadius: 8,
  },
  deleteButtonText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#fff',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  previewHint: {
    padding: 12,
    backgroundColor: 'rgba(255, 159, 28, 0.1)',
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 159, 28, 0.2)',
    alignItems: 'center',
  },
  previewHintText: {
    fontSize: 11,
    color: '#ff9f1c',
    fontWeight: '500',
    textAlign: 'center',
  },
  dividerSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    marginVertical: 24,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#e5e7eb',
  },
  dividerText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#9ca3af',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  loadMoreButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 16,
  },
  loadMoreText: {
    fontSize: 14,
    color: '#6b7280',
    fontWeight: '500',
  },
});