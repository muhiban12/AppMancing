<<<<<<< HEAD
// app/index.tsx
import React from 'react';
import SplashScreen from '../splash'; // pastikan file ini ada di app/splashscreen.tsx

export default function Index() {
  return <SplashScreen />;
}
=======
import { Link } from 'expo-router';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

export default function HomeScreen() {
  return (
    <View style={styles.container}>
      {/* Logo & Title */}
      <View style={styles.header}>
        <MaterialIcons name="phishing" size={48} color="#003366" />
        <Text style={styles.title}>MancingGo</Text>
        <Text style={styles.subtitle}>Pilih Dashboard</Text>
      </View>
      
      {/* Dashboard Options */}
      <View style={styles.options}>
        <Link href="/admindashboard" asChild>
          <TouchableOpacity style={styles.optionCard}>
            <View style={[styles.iconContainer, styles.adminIcon]}>
              <MaterialIcons name="dashboard" size={28} color="#fff" />
            </View>
            <Text style={styles.optionTitle}>Admin</Text>
            <Text style={styles.optionDesc}>Kelola Sistem</Text>
          </TouchableOpacity>
        </Link>
        
        <Link href="/owner-spot" asChild>
          <TouchableOpacity style={styles.optionCard}>
            <View style={[styles.iconContainer, styles.ownerIcon]}>
              <MaterialIcons name="storefront" size={28} color="#fff" />
            </View>
            <Text style={styles.optionTitle}>Owner</Text>
            <Text style={styles.optionDesc}>Kelola Spot</Text>
          </TouchableOpacity>
        </Link>
      </View>
      
      {/* Version */}
      <Text style={styles.version}>v2.1.0</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
    padding: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: 60,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#003366',
    marginTop: 16,
  },
  subtitle: {
    fontSize: 16,
    color: '#64748b',
    marginTop: 8,
  },
  options: {
    flexDirection: 'row',
    gap: 24,
    marginBottom: 60,
  },
  optionCard: {
    alignItems: 'center',
    padding: 24,
    backgroundColor: '#fff',
    borderRadius: 20,
    width: 140,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  iconContainer: {
    width: 64,
    height: 64,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  adminIcon: {
    backgroundColor: '#003366',
  },
  ownerIcon: {
    backgroundColor: '#34D399',
  },
  optionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#334155',
    marginBottom: 4,
  },
  optionDesc: {
    fontSize: 14,
    color: '#64748b',
  },
  version: {
    fontSize: 12,
    color: '#94a3b8',
    marginTop: 40,
  },
});
>>>>>>> 6bcd6deecd930aef6d03550407b8aac774cb4468
