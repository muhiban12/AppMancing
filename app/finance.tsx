import React, { useState } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  StatusBar,
  Dimensions,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { router } from 'expo-router';

const { width: screenWidth } = Dimensions.get('window');

type TimeFilter = 'daily' | 'weekly' | 'monthly';
type TransactionType = 'income' | 'withdrawal';

interface Transaction {
  id: number;
  customer: string;
  transactionId: string;
  time: string;
  amount: number;
  type: TransactionType;
  status: 'success' | 'processing' | 'failed';
}

export default function Finance() {
  const [timeFilter, setTimeFilter] = useState<TimeFilter>('daily');
  const [selectedMonth, setSelectedMonth] = useState('Okt 2023');

  const totalBalance = 4250000;
  const weeklyIncome = 1450000;
  const monthlyIncome = 8200000;
  const growthPercentage = 15.4;

  const transactions: Transaction[] = [
    {
      id: 1,
      customer: 'Budi Santoso',
      transactionId: '#8821',
      time: 'Hari Ini, 08:00',
      amount: 150000,
      type: 'income',
      status: 'success',
    },
    {
      id: 2,
      customer: 'Dimas Pratama',
      transactionId: '#8824',
      time: 'Hari Ini, 09:15',
      amount: 75000,
      type: 'income',
      status: 'success',
    },
    {
      id: 3,
      customer: 'Penarikan Dana',
      transactionId: 'Bank BCA',
      time: 'Kemarin',
      amount: 500000,
      type: 'withdrawal',
      status: 'processing',
    },
    {
      id: 4,
      customer: 'Agus Setiawan',
      transactionId: '#8819',
      time: '23 Okt, 14:20',
      amount: 150000,
      type: 'income',
      status: 'success',
    },
  ];

  const dailyStats = [
    { day: 'Sen', amount: 400, color: '#0f4c81', height: 40 },
    { day: 'Sel', amount: 650, color: '#0f4c81', height: 65 },
    { day: 'Rab', amount: 300, color: '#0f4c81', height: 30 },
    { day: 'Kam', amount: 550, color: '#0f4c81', height: 55 },
    { day: 'Jum', amount: 850, color: '#0f4c81', height: 85 },
    { day: 'Sab', amount: 1000, color: '#ff9f43', height: 100 },
    { day: 'Min', amount: 750, color: '#0f4c81', height: 75 },
  ];

  const handleBack = () => {
    router.back();
  };

  const handleWithdraw = () => {
    console.log('Navigate to withdraw');
    alert('Fitur penarikan dana akan segera hadir!');
  };

  const handleDownloadReport = () => {
    console.log('Download report');
    alert('Laporan sedang dipersiapkan...');
  };

  const handleTimeFilterChange = (filter: TimeFilter) => {
    setTimeFilter(filter);
  };

  const handleMonthChange = () => {
    console.log('Change month');
    // Implement month picker
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={handleBack}>
          <MaterialIcons name="arrow-back" size={24} color="#111518" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Pendapatan Saya</Text>
        <TouchableOpacity style={styles.moreButton}>
          <MaterialIcons name="more-vert" size={24} color="#0f4c81" />
        </TouchableOpacity>
      </View>

      <ScrollView 
        style={styles.content}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.contentContainer}
      >
        {/* Balance Card */}
        <View style={styles.balanceCard}>
          <View style={styles.balanceBackground}>
            <MaterialIcons name="savings" size={120} color="#fff" style={styles.balanceIcon} />
          </View>
          
          <View style={styles.balanceContent}>
            <View style={styles.balanceHeader}>
              <Text style={styles.balanceLabel}>Total Saldo</Text>
              <View style={styles.growthBadge}>
                <MaterialIcons name="trending-up" size={12} color="#fff" />
                <Text style={styles.growthText}>+{growthPercentage}%</Text>
              </View>
            </View>
            
            <Text style={styles.balanceAmount}>Rp {totalBalance.toLocaleString('id-ID')}</Text>
            
            <View style={styles.incomeStats}>
              <View style={styles.incomeItem}>
                <Text style={styles.incomeLabel}>Minggu Ini</Text>
                <Text style={styles.incomeValue}>Rp {weeklyIncome.toLocaleString('id-ID')}</Text>
              </View>
              
              <View style={styles.incomeItem}>
                <Text style={styles.incomeLabel}>Bulan Ini</Text>
                <Text style={styles.incomeValue}>Rp {monthlyIncome.toLocaleString('id-ID')}</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Withdraw Button */}
       <TouchableOpacity 
  style={styles.withdrawButton}
  onPress={() => router.push('/withdraw')}
>
  <MaterialIcons name="payments" size={20} color="#fff" />
  <Text style={styles.withdrawButtonText}>Penarikan Dana</Text>
</TouchableOpacity>
        {/* Time Filters */}
        <View style={styles.filterSection}>
          <View style={styles.timeFilters}>
            <TouchableOpacity 
              style={[
                styles.timeFilterButton,
                timeFilter === 'daily' && styles.activeTimeFilter
              ]}
              onPress={() => handleTimeFilterChange('daily')}
            >
              <Text style={[
                styles.timeFilterText,
                timeFilter === 'daily' && styles.activeTimeFilterText
              ]}>Harian</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[
                styles.timeFilterButton,
                timeFilter === 'weekly' && styles.activeTimeFilter
              ]}
              onPress={() => handleTimeFilterChange('weekly')}
            >
              <Text style={[
                styles.timeFilterText,
                timeFilter === 'weekly' && styles.activeTimeFilterText
              ]}>Mingguan</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[
                styles.timeFilterButton,
                timeFilter === 'monthly' && styles.activeTimeFilter
              ]}
              onPress={() => handleTimeFilterChange('monthly')}
            >
              <Text style={[
                styles.timeFilterText,
                timeFilter === 'monthly' && styles.activeTimeFilterText
              ]}>Bulanan</Text>
            </TouchableOpacity>
          </View>
          
          <TouchableOpacity 
            style={styles.monthButton}
            onPress={handleMonthChange}
          >
            <MaterialIcons name="calendar-month" size={16} color="#0f4c81" />
            <Text style={styles.monthButtonText}>{selectedMonth}</Text>
          </TouchableOpacity>
        </View>

        {/* Income Statistics */}
        <View style={styles.statsCard}>
          <View style={styles.statsHeader}>
            <Text style={styles.statsTitle}>Statistik Pendapatan</Text>
            <Text style={styles.statsSubtitle}>Dalam Ribuan (Rp)</Text>
          </View>
          
          <View style={styles.chartContainer}>
            {dailyStats.map((stat, index) => (
              <View key={index} style={styles.chartColumn}>
                <View style={styles.chartBarContainer}>
                  <View 
                    style={[
                      styles.chartBar,
                      { 
                        height: `${stat.height}%`,
                        backgroundColor: stat.color,
                      }
                    ]}
                  />
                </View>
                <Text style={[
                  styles.chartDay,
                  stat.day === 'Sab' && styles.highlightedDay
                ]}>{stat.day}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Transaction History */}
        <View style={styles.transactionSection}>
          <View style={styles.transactionHeader}>
            <Text style={styles.transactionTitle}>Riwayat Transaksi</Text>
            <TouchableOpacity onPress={handleDownloadReport}>
              <Text style={styles.downloadButton}>Unduh Laporan</Text>
            </TouchableOpacity>
          </View>
          
          <View style={styles.transactionList}>
            {transactions.map((transaction) => (
              <View 
                key={transaction.id}
                style={[
                  styles.transactionCard,
                  transaction.status === 'processing' && styles.processingCard
                ]}
              >
                <View style={styles.transactionInfo}>
                  <View style={[
                    styles.transactionIcon,
                    transaction.type === 'income' 
                      ? styles.incomeIcon 
                      : styles.withdrawalIcon
                  ]}>
                    <MaterialIcons 
                      name={transaction.type === 'income' ? 'call-received' : 'call-made'} 
                      size={20} 
                      color={transaction.type === 'income' ? '#2ecc71' : '#ff9f43'} 
                    />
                  </View>
                  
                  <View>
                    <Text style={styles.transactionCustomer}>{transaction.customer}</Text>
                    <View style={styles.transactionDetails}>
                      <Text style={styles.transactionId}>{transaction.transactionId}</Text>
                      <View style={styles.dotSeparator} />
                      <Text style={styles.transactionTime}>{transaction.time}</Text>
                    </View>
                  </View>
                </View>
                
                <View style={styles.transactionAmount}>
                  <Text style={[
                    styles.amountText,
                    transaction.type === 'income' ? styles.incomeAmount : styles.withdrawalAmount
                  ]}>
                    {transaction.type === 'income' ? '+' : '-'}Rp {transaction.amount.toLocaleString('id-ID')}
                  </Text>
                  <Text style={[
                    styles.statusText,
                    transaction.status === 'processing' && styles.processingStatus
                  ]}>
                    {transaction.status === 'success' ? 'Sukses' : 
                     transaction.status === 'processing' ? 'Diproses' : 'Gagal'}
                  </Text>
                </View>
              </View>
            ))}
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
    color: '#111518',
    textAlign: 'center',
    flex: 1,
  },
  moreButton: {
    padding: 8,
    borderRadius: 20,
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    padding: 16,
    paddingBottom: 20,
  },
  balanceCard: {
    backgroundColor: '#0f4c81',
    borderRadius: 20,
    padding: 20,
    marginBottom: 16,
    position: 'relative',
    overflow: 'hidden',
    shadowColor: '#0f4c81',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 8,
  },
  balanceBackground: {
    position: 'absolute',
    top: 0,
    right: 0,
    opacity: 0.1,
  },
  balanceIcon: {
    opacity: 0.1,
  },
  balanceContent: {
    position: 'relative',
    zIndex: 10,
  },
  balanceHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  balanceLabel: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.9)',
    fontWeight: '500',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  growthBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    backdropFilter: 'blur(10px)',
  },
  growthText: {
    fontSize: 10,
    color: '#fff',
    fontWeight: 'bold',
  },
  balanceAmount: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 16,
  },
  incomeStats: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.1)',
    paddingTop: 16,
    gap: 16,
  },
  incomeItem: {
    flex: 1,
  },
  incomeLabel: {
    fontSize: 10,
    color: 'rgba(255, 255, 255, 0.8)',
    marginBottom: 4,
  },
  incomeValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#fff',
  },
  withdrawButton: {
    backgroundColor: '#ff9f43',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 14,
    borderRadius: 16,
    marginBottom: 20,
    shadowColor: '#ff9f43',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 8,
  },
  withdrawButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
  },
  filterSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  timeFilters: {
    flexDirection: 'row',
    backgroundColor: '#e2e8f0',
    borderRadius: 8,
    padding: 4,
    flex: 1,
    marginRight: 12,
  },
  timeFilterButton: {
    flex: 1,
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 6,
    alignItems: 'center',
  },
  activeTimeFilter: {
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  timeFilterText: {
    fontSize: 12,
    color: '#64748b',
    fontWeight: '500',
  },
  activeTimeFilterText: {
    color: '#0f4c81',
    fontWeight: 'bold',
  },
  monthButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#0f4c8110',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
  },
  monthButtonText: {
    fontSize: 12,
    color: '#0f4c81',
    fontWeight: '500',
  },
  statsCard: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: '#f1f5f9',
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  statsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  statsTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#111518',
  },
  statsSubtitle: {
    fontSize: 10,
    color: '#94a3b8',
  },
  chartContainer: {
    height: 160,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    paddingHorizontal: 4,
  },
  chartColumn: {
    flex: 1,
    alignItems: 'center',
    gap: 8,
  },
  chartBarContainer: {
    width: '80%',
    height: '100%',
    backgroundColor: '#f8fafc',
    borderRadius: 4,
    overflow: 'hidden',
    justifyContent: 'flex-end',
  },
  chartBar: {
    width: '100%',
    borderRadius: 4,
  },
  chartDay: {
    fontSize: 10,
    color: '#94a3b8',
    fontWeight: '500',
  },
  highlightedDay: {
    color: '#111518',
    fontWeight: 'bold',
  },
  transactionSection: {
    marginBottom: 20,
  },
  transactionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  transactionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#111518',
  },
  downloadButton: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#0f4c81',
  },
  transactionList: {
    gap: 12,
  },
  transactionCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#f1f5f9',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  processingCard: {
    opacity: 0.8,
  },
  transactionInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  transactionIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  incomeIcon: {
    backgroundColor: '#2ecc7110',
  },
  withdrawalIcon: {
    backgroundColor: '#ff9f4310',
  },
  transactionCustomer: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#111518',
    marginBottom: 4,
  },
  transactionDetails: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  transactionId: {
    fontSize: 11,
    color: '#64748b',
  },
  dotSeparator: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#cbd5e1',
  },
  transactionTime: {
    fontSize: 11,
    color: '#64748b',
  },
  transactionAmount: {
    alignItems: 'flex-end',
  },
  amountText: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 2,
  },
  incomeAmount: {
    color: '#2ecc71',
  },
  withdrawalAmount: {
    color: '#111518',
  },
  statusText: {
    fontSize: 10,
    color: '#94a3b8',
  },
  processingStatus: {
    color: '#ff9f43',
  },
  bottomSpacer: {
    height: 20,
  },
});