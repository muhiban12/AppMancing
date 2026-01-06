import React, { useState } from 'react';
import { router } from 'expo-router';
import {
  SafeAreaView,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  ScrollView,
  TextInput,
  Dimensions,
  Modal,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

export default function OwnerSidebar() {
  const [sidebarVisible, setSidebarVisible] = useState(false);
  const [activeFilter, setActiveFilter] = useState<'wild' | 'commercial' | 'weather'>('wild');

  const fishingSpots = [
    { id: 1, name: 'Kolam Bahagia', type: 'commercial', color: '#13a4ec', icon: 'storefront' },
    { id: 2, name: 'Sungai Deras', type: 'wild', color: '#34D399', icon: 'forest' },
    { id: 3, name: 'Telaga Berkah', type: 'commercial', color: '#13a4ec', icon: 'phishing', rating: 4.5 },
  ];

  const filterChips = [
    { id: 1, label: 'Liar / Alam', color: '#34D399', type: 'wild' },
    { id: 2, label: 'Komersial', color: '#13a4ec', type: 'commercial' },
    { id: 3, label: 'Cuaca', icon: 'cloud', type: 'weather' },
  ];

  const bottomNav = [
    { id: 1, icon: 'map', label: 'Map', active: true },
    { id: 2, icon: 'confirmation-number', label: 'Tiket Saya' },
    { id: 3, icon: 'emoji-events', label: 'Turnamen' },
    { id: 4, icon: 'leaderboard', label: 'Rank' },
    { id: 5, icon: 'rss-feed', label: 'Feed' },
  ];

  return (
    <SafeAreaView style={styles.container}>
      {/* Main Map */}
      <View style={styles.mapContainer}>
        <Image
          source={{ uri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCWbJh-cZqgLRhIJeykxKeLoSxRcbBlBf2yyEq8G5Dz0LJgNIXr9g81l8gfYofJqybpSna-BvdQ1IqVsZ2aoriJI69rcb-rpIncASaGy2CeBNOUm1vm7GGKd06DObOHF0Dihl8zje8EsMam9URQQ9lfWPhrM88z0ygWFWVyrnKkjZJ0HoECLMjV_5cRtSrv-5O5mzbP0z6HueqmesgH6HfCt_TdI4n2ZEPCEwVaWYrTck46B_Pnrv9OJ2pCEFjhHzXv3L-5eqZ4WH9E' }}
          style={styles.map}
        />

        {/* Top Bar */}
        <View style={styles.topBar}>
          <TouchableOpacity onPress={() => setSidebarVisible(true)} style={styles.menuBtn}>
            <MaterialIcons name="menu" size={24} color="#334155" />
          </TouchableOpacity>
          
          <View style={styles.searchBox}>
            <MaterialIcons name="search" size={20} color="#94a3b8" />
            <TextInput placeholder="Cari spot atau lokasi..." style={styles.searchInput} />
          </View>
          
          <TouchableOpacity style={styles.filterBtn}>
            <MaterialIcons name="tune" size={24} color="#334155" />
          </TouchableOpacity>
        </View>

        {/* Filter Chips */}
        <ScrollView horizontal style={styles.chipContainer}>
          {filterChips.map(chip => (
            <TouchableOpacity
              key={chip.id}
              style={[styles.chip, activeFilter === chip.type && styles.activeChip]}
              onPress={() => setActiveFilter(chip.type as any)}
            >
              {chip.color && <View style={[styles.chipDot, { backgroundColor: chip.color }]} />}
              {chip.icon && <MaterialIcons name={chip.icon as any} size={16} color="#64748b" />}
              <Text style={styles.chipText}>{chip.label}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Map Markers */}
        <View style={[styles.marker, { top: '30%', left: '20%' }]}>
          <View style={[styles.markerIcon, { backgroundColor: '#13a4ec' }]}>
            <MaterialIcons name="storefront" size={20} color="#fff" />
          </View>
          <View style={styles.markerLabel}>
            <Text style={styles.markerText}>Kolam Bahagia</Text>
          </View>
        </View>

        <View style={[styles.marker, { top: '45%', right: '15%' }]}>
          <View style={[styles.markerIcon, { backgroundColor: '#34D399' }]}>
            <MaterialIcons name="forest" size={20} color="#fff" />
          </View>
          <View style={styles.markerLabel}>
            <Text style={styles.markerText}>Sungai Deras</Text>
          </View>
        </View>

        <View style={[styles.marker, { top: '52%', left: '48%' }]}>
          <View style={styles.featuredLabel}>
            <Text style={styles.featuredText}>Telaga Berkah</Text>
            <View style={styles.rating}>
              <Text style={styles.ratingText}>4.5</Text>
              <MaterialIcons name="star" size={10} color="#f59e0b" />
            </View>
          </View>
          <View style={styles.featuredMarker}>
            <MaterialIcons name="phishing" size={24} color="#fff" />
          </View>
        </View>

        {/* Bottom Nav */}
        <View style={styles.bottomNav}>
          <View style={styles.navContainer}>
            {bottomNav.map(item => (
              <TouchableOpacity key={item.id} style={styles.navItem}>
                {item.active ? (
                  <View style={styles.activeNav}>
                    <MaterialIcons name="map" size={30} color="#fff" />
                  </View>
                ) : (
                  <MaterialIcons name={item.icon as any} size={24} color="rgba(255,255,255,0.6)" />
                )}
                <Text style={[styles.navText, item.active && styles.activeNavText]}>
                  {item.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </View>

      {/* Sidebar Modal */}
      <Modal visible={sidebarVisible} transparent animationType="slide">
        <TouchableOpacity 
          style={styles.sidebarOverlay}
          onPress={() => setSidebarVisible(false)}
        >
          <View style={styles.sidebar}>
            {/* Profile Section */}
            <View style={styles.profileSection}>
              <View style={styles.avatarWrapper}>
                <Image
                  source={{ uri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD9qHLC5c9jZ7DFR__tKXnPNj23I6wVGjhetuYPRQ6CbpE5KC0B2uV9MXszXAhPAj1-6cb2i0Vrv0VVyPeyeWAZw33KFKaSkgGufXs46MujXpts7FZIW9reCHfjap0iAMxUtqVKeYfJaroqTawlb2AXo0tnGiL52IwX7_UzLmFI8PIjJir-P_DTwmtqbd9GgeBCYRePmzixDAWtVWZtQ2rxrL8uUjs_id4-_YNMHbv32WCYcsAovTCEmwCfliaA3qDBQFqpskGuY902' }}
                  style={styles.avatar}
                />
                <View style={styles.verifiedBadge}>
                  <MaterialIcons name="verified" size={18} color="#fff" />
                </View>
              </View>
              <Text style={styles.ownerName}>Juragan Rizky</Text>
              <Text style={styles.ownerRole}>Owner Spot Premium</Text>
            </View>

            {/* Dashboard Button */}
<TouchableOpacity 
  style={styles.dashboardBtn}
  onPress={() => {
    setSidebarVisible(false); // Tutup sidebar
    router.push('/owner-dashboard'); // Navigasi ke dashboard
  }}
>
  <View style={styles.dashboardIcon}>
    <MaterialIcons name="monitoring" size={28} color="#34D399" />
  </View>
  <View style={styles.dashboardText}>
    <Text style={styles.dashboardTitle}>Dashboard Owner</Text>
    <Text style={styles.dashboardSubtitle}>Kelola spot & laporan</Text>
  </View>
  <MaterialIcons name="arrow-forward-ios" size={16} color="#fff" />
</TouchableOpacity>

            {/* Menu Items */}
            <View style={styles.menuSection}>
              <Text style={styles.menuTitle}>Menu Utama</Text>
              <TouchableOpacity 
  style={styles.menuItem}
  onPress={() => {
    setSidebarVisible(false); // Tutup sidebar
    router.push('/owner-help'); // Navigasi ke halaman bantuan
  }}
>
  <MaterialIcons name="help" size={24} color="#64748b" />
  <Text style={styles.menuText}>Pusat Bantuan</Text>
</TouchableOpacity>


              
              <TouchableOpacity style={styles.menuItem}>
                <MaterialIcons name="settings" size={24} color="#64748b" />
                <Text style={styles.menuText}>Pengaturan Akun</Text>
              </TouchableOpacity>
            </View>

            {/* Footer */}
            <View style={styles.sidebarFooter}>
              <TouchableOpacity style={styles.switchBtn}>
                <MaterialIcons name="person" size={18} color="#003366" />
                <Text style={styles.switchText}>Switch to User Mode</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.logoutBtn}>
                <MaterialIcons name="logout" size={20} color="#ef4444" />
                <Text style={styles.logoutText}>Log Out</Text>
              </TouchableOpacity>
              <Text style={styles.version}>v2.1.0 • Owner Build</Text>
            </View>
          </View>
        </TouchableOpacity>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#e5e3df',
  },
  mapContainer: {
    flex: 1,
  },
  map: {
    width: '100%',
    height: '100%',
    opacity: 0.9,
  },
  topBar: {
    position: 'absolute',
    top: 48,
    left: 16,
    right: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  menuBtn: {
    width: 48,
    height: 48,
    backgroundColor: '#fff',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchBox: {
    flex: 1,
    height: 48,
    backgroundColor: '#fff',
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    gap: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: '#334155',
  },
  filterBtn: {
    width: 48,
    height: 48,
    backgroundColor: '#fff',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  chipContainer: {
    position: 'absolute',
    top: 112,
    left: 16,
    right: 16,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#fff',
    borderRadius: 20,
    marginRight: 8,
  },
  activeChip: {
    backgroundColor: '#f8fafc',
  },
  chipDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  chipText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#334155',
  },
  marker: {
    position: 'absolute',
    alignItems: 'center',
  },
  markerIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#fff',
  },
  markerLabel: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    backgroundColor: 'rgba(255,255,255,0.9)',
    borderRadius: 6,
    marginTop: 4,
  },
  markerText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#334155',
  },
  featuredLabel: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: '#fff',
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  featuredText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#1e293b',
  },
  rating: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  ratingText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#f59e0b',
  },
  featuredMarker: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#13a4ec',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#fff',
  },
  bottomNav: {
    position: 'absolute',
    bottom: 32,
    left: 16,
    right: 16,
  },
  navContainer: {
    backgroundColor: '#003366',
    height: 80,
    borderRadius: 40,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  navItem: {
    alignItems: 'center',
    flex: 1,
    paddingTop: 8,
  },
  activeNav: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#13a4ec',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    top: -24,
    borderWidth: 6,
    borderColor: '#003366',
  },
  navText: {
    fontSize: 9,
    color: 'rgba(255,255,255,0.6)',
    marginTop: 28,
  },
  activeNavText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 10,
  },
  sidebarOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
  },
  sidebar: {
    width: '85%',
    maxWidth: 340,
    height: '100%',
    backgroundColor: '#fff',
    borderTopRightRadius: 40,
    borderBottomRightRadius: 40,
    overflow: 'hidden',
  },
  profileSection: {
    backgroundColor: '#003366',
    paddingTop: 64,
    paddingBottom: 48,
    paddingHorizontal: 32,
    alignItems: 'center',
  },
  avatarWrapper: {
    position: 'relative',
    marginBottom: 16,
  },
  avatar: {
    width: 96,
    height: 96,
    borderRadius: 24,
  },
  verifiedBadge: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    backgroundColor: '#34D399',
    padding: 6,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#003366',
  },
  ownerName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 4,
  },
  ownerRole: {
    fontSize: 12,
    color: '#bfdbfe',
    backgroundColor: 'rgba(255,255,255,0.1)',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  dashboardBtn: {
    backgroundColor: '#003366',
    marginHorizontal: 24,
    marginTop: -24,
    marginBottom: 32,
    padding: 16,
    borderRadius: 24,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  dashboardIcon: {
    width: 48,
    height: 48,
    borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  dashboardText: {
    flex: 1,
  },
  dashboardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
  dashboardSubtitle: {
    fontSize: 11,
    color: '#bfdbfe',
  },
  menuSection: {
    paddingHorizontal: 24,
    marginBottom: 32,
  },
  menuTitle: {
    fontSize: 10,
    color: '#94a3b8',
    fontWeight: 'bold',
    marginBottom: 8,
    paddingLeft: 8,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    padding: 16,
    borderRadius: 24,
  },
  menuText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#475569',
  },
  sidebarFooter: {
    paddingHorizontal: 24,
    paddingBottom: 40,
    paddingTop: 24,
    borderTopWidth: 1,
    borderTopColor: '#f1f5f9',
    alignItems: 'center',
    gap: 24,
  },
  switchBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  switchText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#003366',
  },
  logoutBtn: {
    width: '100%',
    paddingVertical: 16,
    backgroundColor: '#fee2e2',
    borderRadius: 24,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
  },
  logoutText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#ef4444',
  },
  version: {
    fontSize: 10,
    color: '#cbd5e1',
  },
});