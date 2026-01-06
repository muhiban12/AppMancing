import React, { useState } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  TextInput,
  Linking,
  StatusBar,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { router } from 'expo-router';

export default function OwnerHelp() {
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedCategory, setExpandedCategory] = useState<string | null>('account');

  const helpCategories = [
    {
      id: 'account',
      title: 'Akun & Profil',
      description: 'Verifikasi, data owner, password',
      icon: 'manage-accounts',
      color: '#13a4ec',
      bgColor: '#13a4ec10',
      topics: [
        { id: '1', title: 'Cara ubah foto profil owner?' },
        { id: '2', title: 'Lupa kata sandi akun' },
        { id: '3', title: 'Verifikasi KTP Owner' },
      ],
    },
    {
      id: 'spot',
      title: 'Manajemen Spot',
      description: 'Update tiket, jam buka, fasilitas',
      icon: 'storefront',
      color: '#34D399',
      bgColor: '#34D39910',
      topics: [
        { id: '4', title: 'Cara update harga tiket' },
        { id: '5', title: 'Edit jam operasional' },
        { id: '6', title: 'Tambah fasilitas spot' },
      ],
    },
    {
      id: 'payment',
      title: 'Pembayaran & Penarikan',
      description: 'Withdraw saldo, rekening bank',
      icon: 'payments',
      color: '#FF6B00',
      bgColor: '#FF6B0010',
      topics: [
        { id: '7', title: 'Cara withdraw saldo' },
        { id: '8', title: 'Tambah rekening bank' },
        { id: '9', title: 'Minimum penarikan' },
      ],
    },
    {
      id: 'event',
      title: 'Event & Promosi',
      description: 'Buat turnamen, iklan spot',
      icon: 'campaign',
      color: '#8B5CF6',
      bgColor: '#8B5CF610',
      topics: [
        { id: '10', title: 'Buat turnamen mancing' },
        { id: '11', title: 'Promo diskon tiket' },
        { id: '12', title: 'Iklan spot premium' },
      ],
    },
  ];

  const contactOptions = [
    {
      id: 'whatsapp',
      title: 'WhatsApp Chat',
      subtitle: 'Respon instan < 5 menit',
      icon: 'chat',
      color: '#25D366',
      bgColor: '#25D36610',
      action: () => Linking.openURL('https://wa.me/6281234567890?text=Halo%20MancingGo%20Support'),
    },
    {
      id: 'email',
      title: 'Email Support',
      subtitle: 'support@mancinggo.com',
      icon: 'mail',
      color: '#FFFFFF',
      bgColor: '#FFFFFF10',
      action: () => Linking.openURL('mailto:support@mancinggo.com'),
    },
    {
      id: 'form',
      title: 'Formulir Kontak',
      subtitle: 'Isi form online',
      icon: 'edit-document',
      color: '#FFFFFF',
      bgColor: '#FFFFFF10',
      action: () => console.log('Open contact form'),
    },
  ];

  const toggleCategory = (categoryId: string) => {
    setExpandedCategory(expandedCategory === categoryId ? null : categoryId);
  };

  const handleBack = () => {
    router.back();
  };

  const handleSearch = () => {
    console.log('Searching for:', searchQuery);
  };

  const handleViewAllCategories = () => {
    console.log('View all categories');
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={handleBack}>
          <MaterialIcons name="arrow-back" size={24} color="#003366" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Pusat Bantuan Owner</Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView 
        style={styles.content}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.contentContainer}
      >
        {/* Hero Section */}
        <View style={styles.heroSection}>
          <View style={styles.heroBackground}>
            <View style={[styles.heroBlob, styles.heroBlob1]} />
            <View style={[styles.heroBlob, styles.heroBlob2]} />
          </View>
          
          <View style={styles.heroContent}>
            <Text style={styles.heroTitle}>Butuh bantuan,{"\n"}Juragan?</Text>
            <Text style={styles.heroSubtitle}>
              Temukan jawaban cepat untuk pengelolaan spot pemancingan Anda.
            </Text>
            
            {/* Search Bar */}
            <View style={styles.searchContainer}>
              <MaterialIcons name="search" size={20} color="#94a3b8" />
              <TextInput
                style={styles.searchInput}
                placeholder="Cari topik (misal: withdraw, tiket)..."
                placeholderTextColor="#94a3b8"
                value={searchQuery}
                onChangeText={setSearchQuery}
                onSubmitEditing={handleSearch}
              />
            </View>
          </View>
        </View>

        {/* Categories Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Kategori Topik</Text>
            <TouchableOpacity onPress={handleViewAllCategories}>
              <Text style={styles.viewAllButton}>Lihat Semua</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.categoriesList}>
            {helpCategories.map((category) => (
              <View key={category.id} style={styles.categoryCard}>
                <TouchableOpacity
                  style={[
                    styles.categoryHeader,
                    expandedCategory === category.id && styles.expandedHeader,
                  ]}
                  onPress={() => toggleCategory(category.id)}
                >
                  <View style={[
                    styles.categoryIcon,
                    { backgroundColor: expandedCategory === category.id ? category.color : category.bgColor }
                  ]}>
                    <MaterialIcons 
                      name={category.icon as any} 
                      size={20} 
                      color={expandedCategory === category.id ? '#fff' : category.color} 
                    />
                  </View>
                  
                  <View style={styles.categoryInfo}>
                    <Text style={styles.categoryTitle}>{category.title}</Text>
                    <Text style={styles.categoryDescription}>{category.description}</Text>
                  </View>
                  
                  <MaterialIcons 
                    name={expandedCategory === category.id ? 'expand-less' : 'expand-more'} 
                    size={24} 
                    color="#cbd5e1" 
                  />
                </TouchableOpacity>

                {expandedCategory === category.id && (
                  <View style={styles.topicsList}>
                    <View style={styles.topicsSpacer} />
                    {category.topics.map((topic) => (
                      <TouchableOpacity key={topic.id} style={styles.topicItem}>
                        <Text style={styles.topicTitle}>{topic.title}</Text>
                        <MaterialIcons name="arrow-forward-ios" size={14} color="#cbd5e1" />
                      </TouchableOpacity>
                    ))}
                  </View>
                )}
              </View>
            ))}
          </View>
        </View>

        {/* Contact Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Hubungi Kami</Text>
          
          <View style={styles.contactCard}>
            <View style={styles.contactBackground}>
              <View style={styles.contactBlob} />
            </View>
            
            <Text style={styles.contactTitle}>Masih belum ketemu solusinya?</Text>
            <Text style={styles.contactSubtitle}>
              Tim support kami siap bantuin Juragan 24/7. Pilih cara kontak yang paling nyaman.
            </Text>
            
            <View style={styles.contactOptions}>
              {contactOptions.map((option) => (
                <TouchableOpacity
                  key={option.id}
                  style={[
                    styles.contactButton,
                    option.id === 'whatsapp' ? styles.whatsappButton : styles.otherButton,
                  ]}
                  onPress={option.action}
                >
                  <View style={[
                    styles.contactIcon,
                    { backgroundColor: option.bgColor, borderColor: option.color }
                  ]}>
                    <MaterialIcons 
                      name={option.icon as any} 
                      size={18} 
                      color={option.id === 'whatsapp' ? option.color : '#fff'} 
                    />
                  </View>
                  
                  <View style={styles.contactInfo}>
                    <Text style={[
                      styles.contactButtonTitle,
                      option.id === 'whatsapp' ? styles.whatsappText : styles.otherText
                    ]}>
                      {option.title}
                    </Text>
                    <Text style={[
                      styles.contactButtonSubtitle,
                      option.id === 'whatsapp' ? styles.whatsappSubtext : styles.otherSubtext
                    ]}>
                      {option.subtitle}
                    </Text>
                  </View>
                  
                  <MaterialIcons 
                    name="arrow-forward" 
                    size={18} 
                    color={option.id === 'whatsapp' ? '#25D366' : 'rgba(255,255,255,0.7)'} 
                  />
                </TouchableOpacity>
              ))}
            </View>
          </View>
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
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 20,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#003366',
    textAlign: 'center',
    flex: 1,
  },
  headerSpacer: {
    width: 40,
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    paddingBottom: 20,
  },
  heroSection: {
    backgroundColor: '#fff',
    borderBottomLeftRadius: 40,
    borderBottomRightRadius: 40,
    marginBottom: 24,
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 32,
    position: 'relative',
    overflow: 'hidden',
  },
  heroBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  heroBlob: {
    position: 'absolute',
    borderRadius: 999,
  },
  heroBlob1: {
    width: 192,
    height: 192,
    backgroundColor: 'rgba(52, 211, 153, 0.1)',
    top: -96,
    right: -48,
    blurRadius: 48,
  },
  heroBlob2: {
    width: 128,
    height: 128,
    backgroundColor: 'rgba(19, 164, 236, 0.05)',
    bottom: -64,
    left: -64,
    blurRadius: 32,
  },
  heroContent: {
    position: 'relative',
    zIndex: 10,
  },
  heroTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: '#003366',
    lineHeight: 34,
    marginBottom: 8,
  },
  heroSubtitle: {
    fontSize: 14,
    color: '#64748b',
    marginBottom: 24,
    maxWidth: '80%',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8fafc',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderWidth: 1,
    borderColor: '#f1f5f9',
  },
  searchInput: {
    flex: 1,
    marginLeft: 12,
    fontSize: 14,
    color: '#334155',
    fontWeight: '500',
  },
  section: {
    paddingHorizontal: 24,
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#94a3b8',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  viewAllButton: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#13a4ec',
  },
  categoriesList: {
    gap: 12,
  },
  categoryCard: {
    backgroundColor: '#fff',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#f1f5f9',
    overflow: 'hidden',
  },
  categoryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    gap: 16,
  },
  expandedHeader: {
    backgroundColor: 'rgba(19, 164, 236, 0.02)',
  },
  categoryIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'transparent',
  },
  categoryInfo: {
    flex: 1,
  },
  categoryTitle: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#1e293b',
    marginBottom: 2,
  },
  categoryDescription: {
    fontSize: 12,
    color: '#94a3b8',
  },
  topicsList: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  topicsSpacer: {
    height: 8,
  },
  topicItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#f8fafc',
    paddingHorizontal: 12,
    paddingVertical: 14,
    borderRadius: 14,
    marginBottom: 8,
  },
  topicTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#475569',
  },
  contactCard: {
    backgroundColor: '#003366',
    borderRadius: 30,
    padding: 24,
    position: 'relative',
    overflow: 'hidden',
  },
  contactBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  contactBlob: {
    position: 'absolute',
    width: 160,
    height: 160,
    backgroundColor: 'rgba(52, 211, 153, 0.2)',
    borderRadius: 999,
    bottom: -80,
    right: -80,
    blurRadius: 48,
  },
  contactTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
  },
  contactSubtitle: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.9)',
    lineHeight: 20,
    marginBottom: 24,
    fontWeight: '300',
  },
  contactOptions: {
    gap: 12,
  },
  contactButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    borderRadius: 16,
    gap: 12,
  },
  whatsappButton: {
    backgroundColor: '#fff',
  },
  otherButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  contactIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
  },
  contactInfo: {
    flex: 1,
  },
  contactButtonTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 2,
  },
  whatsappText: {
    color: '#1e293b',
  },
  otherText: {
    color: '#fff',
  },
  contactButtonSubtitle: {
    fontSize: 10,
  },
  whatsappSubtext: {
    color: '#64748b',
  },
  otherSubtext: {
    color: 'rgba(255, 255, 255, 0.7)',
  },
  bottomSpacer: {
    height: 32,
  },
});