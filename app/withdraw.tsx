import React, { useState } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  StatusBar,
  TextInput,
  Modal,
  Dimensions,
  Platform,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { router } from 'expo-router';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

interface Bank {
  id: string;
  name: string;
  icon: string;
}

export default function Withdraw() {
  const [withdrawModalVisible, setWithdrawModalVisible] = useState(false);
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [selectedBank, setSelectedBank] = useState<string>('');
  const [accountNumber, setAccountNumber] = useState('');
  
  const totalBalance = 4250000;
  const weeklyIncome = 1450000;
  const monthlyIncome = 8200000;
  const growthPercentage = 15.4;

  const banks: Bank[] = [
    { id: 'bca', name: 'Bank BCA', icon: 'account-balance' },
    { id: 'mandiri', name: 'Bank Mandiri', icon: 'account-balance' },
    { id: 'bni', name: 'Bank BNI', icon: 'account-balance' },
    { id: 'bri', name: 'Bank BRI', icon: 'account-balance' },
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

  const handleOpenWithdrawModal = () => {
    setWithdrawModalVisible(true);
  };

  const handleCloseWithdrawModal = () => {
    setWithdrawModalVisible(false);
    setWithdrawAmount('');
    setSelectedBank('');
    setAccountNumber('');
  };

  const handleSubmitWithdrawal = () => {
    if (!withdrawAmount || !selectedBank || !accountNumber) {
      alert('Harap lengkapi semua data penarikan');
      return;
    }

    const amount = parseInt(withdrawAmount);
    if (amount < 50000) {
      alert('Minimum penarikan adalah Rp 50.000');
      return;
    }

    if (amount > totalBalance) {
      alert('Saldo tidak mencukupi');
      return;
    }

    console.log('Submitting withdrawal:', {
      amount,
      bank: selectedBank,
      accountNumber,
    });

    alert('Permintaan penarikan berhasil dikirim! Dana akan diproses dalam 1-2 hari kerja.');
    handleCloseWithdrawModal();
  };

  const handleBankSelect = (bankId: string) => {
    setSelectedBank(bankId);
  };

  const getSelectedBankName = () => {
    const bank = banks.find(b => b.id === selectedBank);
    return bank ? bank.name : 'Pilih Bank Tujuan';
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
          onPress={handleOpenWithdrawModal}
        >
          <MaterialIcons name="payments" size={20} color="#fff" />
          <Text style={styles.withdrawButtonText}>Penarikan Dana</Text>
        </TouchableOpacity>

        {/* Stats Card */}
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

        {/* Withdrawal Modal */}
        <Modal
          animationType="slide"
          transparent={true}
          visible={withdrawModalVisible}
          onRequestClose={handleCloseWithdrawModal}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              {/* Modal Header */}
              <View style={styles.modalHeader}>
                <View style={styles.modalGradient} />
                <View style={styles.modalTitleContainer}>
                  <Text style={styles.modalTitle}>Penarikan Dana</Text>
                  <TouchableOpacity 
                    style={styles.modalCloseButton}
                    onPress={handleCloseWithdrawModal}
                  >
                    <MaterialIcons name="close" size={24} color="#64748b" />
                  </TouchableOpacity>
                </View>
              </View>

              {/* Modal Body */}
              <ScrollView 
                style={styles.modalBody}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.modalBodyContent}
              >
                {/* Balance Info */}
                <View style={styles.balanceInfoCard}>
                  <View>
                    <Text style={styles.balanceInfoLabel}>Total Saldo Anda</Text>
                    <Text style={styles.balanceInfoAmount}>Rp {totalBalance.toLocaleString('id-ID')}</Text>
                  </View>
                  <View style={styles.balanceIconContainer}>
                    <MaterialIcons name="account-balance-wallet" size={24} color="#0f4c81" />
                  </View>
                </View>

                {/* Withdrawal Form */}
                <View style={styles.formSection}>
                  {/* Amount Input */}
                  <View style={styles.formGroup}>
                    <Text style={styles.formLabel}>Jumlah Penarikan</Text>
                    <View style={styles.amountInputContainer}>
                      <Text style={styles.currencySymbol}>Rp</Text>
                      <TextInput
                        style={styles.amountInput}
                        placeholder="0"
                        placeholderTextColor="#94a3b8"
                        keyboardType="numeric"
                        value={withdrawAmount}
                        onChangeText={setWithdrawAmount}
                      />
                    </View>
                    <Text style={styles.minAmountText}>Min. Rp 50.000</Text>
                  </View>

                  {/* Bank Selection */}
                  <View style={styles.formGroup}>
                    <Text style={styles.formLabel}>Pilih Bank</Text>
                    <View style={styles.bankSelection}>
                      {banks.map((bank) => (
                        <TouchableOpacity
                          key={bank.id}
                          style={[
                            styles.bankOption,
                            selectedBank === bank.id && styles.selectedBankOption
                          ]}
                          onPress={() => handleBankSelect(bank.id)}
                        >
                          <View style={[
                            styles.bankIcon,
                            selectedBank === bank.id && styles.selectedBankIcon
                          ]}>
                            <MaterialIcons 
                              name={bank.icon as any} 
                              size={20} 
                              color={selectedBank === bank.id ? '#fff' : '#0f4c81'} 
                            />
                          </View>
                          <Text style={[
                            styles.bankName,
                            selectedBank === bank.id && styles.selectedBankName
                          ]}>
                            {bank.name}
                          </Text>
                        </TouchableOpacity>
                      ))}
                    </View>
                  </View>

                  {/* Account Number Input */}
                  <View style={styles.formGroup}>
                    <Text style={styles.formLabel}>Nomor Rekening</Text>
                    <View style={styles.accountInputContainer}>
                      <MaterialIcons name="credit-card" size={20} color="#64748b" />
                      <TextInput
                        style={styles.accountInput}
                        placeholder="Contoh: 1234567890"
                        placeholderTextColor="#94a3b8"
                        keyboardType="numeric"
                        value={accountNumber}
                        onChangeText={setAccountNumber}
                      />
                    </View>
                  </View>
                </View>

                {/* Security Info */}
                <View style={styles.securityInfo}>
                  <MaterialIcons name="lock" size={16} color="#2ecc71" />
                  <Text style={styles.securityText}>Transaksi aman & terenkripsi</Text>
                </View>

                {/* Action Buttons */}
                <View style={styles.modalActions}>
                  <TouchableOpacity 
                    style={styles.cancelButton}
                    onPress={handleCloseWithdrawModal}
                  >
                    <Text style={styles.cancelButtonText}>Batal</Text>
                  </TouchableOpacity>
                  
                  <TouchableOpacity 
                    style={styles.submitButton}
                    onPress={handleSubmitWithdrawal}
                  >
                    <Text style={styles.submitButtonText}>Kirim Permintaan</Text>
                  </TouchableOpacity>
                </View>
              </ScrollView>
            </View>
          </View>
        </Modal>

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
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingBottom: Platform.OS === 'ios' ? 20 : 0,
  },
  modalContent: {
    width: '100%',
    maxWidth: 480,
    backgroundColor: '#fff',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    overflow: 'hidden',
    maxHeight: screenHeight * 0.85,
  },
  modalHeader: {
    position: 'relative',
  },
  modalGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 4,
    backgroundColor: '#ff9f43',
  },
  modalTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#f8fafc',
    paddingHorizontal: 24,
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#111518',
  },
  modalCloseButton: {
    padding: 8,
    borderRadius: 20,
  },
  modalBody: {
    maxHeight: screenHeight * 0.7,
  },
  modalBodyContent: {
    padding: 24,
    paddingBottom: 40,
  },
  balanceInfoCard: {
    backgroundColor: 'rgba(15, 76, 129, 0.05)',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(15, 76, 129, 0.1)',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  balanceInfoLabel: {
    fontSize: 12,
    color: '#0f4c81',
    fontWeight: '500',
    marginBottom: 4,
  },
  balanceInfoAmount: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#111518',
  },
  balanceIconContainer: {
    backgroundColor: 'rgba(15, 76, 129, 0.1)',
    padding: 12,
    borderRadius: 12,
  },
  formSection: {
    gap: 20,
    marginBottom: 24,
  },
  formGroup: {
    gap: 8,
  },
  formLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
  },
  amountInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 12,
    backgroundColor: '#fff',
    overflow: 'hidden',
  },
  currencySymbol: {
    fontSize: 16,
    fontWeight: '500',
    color: '#374151',
    paddingHorizontal: 16,
    paddingVertical: 14,
    backgroundColor: '#f9fafb',
    borderRightWidth: 1,
    borderRightColor: '#d1d5db',
  },
  amountInput: {
    flex: 1,
    fontSize: 16,
    color: '#111518',
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  minAmountText: {
    fontSize: 10,
    color: '#6b7280',
    textAlign: 'right',
    marginTop: 4,
  },
  bankSelection: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  bankOption: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    backgroundColor: '#fff',
    flex: 1,
    minWidth: '45%',
  },
  selectedBankOption: {
    backgroundColor: '#0f4c81',
    borderColor: '#0f4c81',
  },
  bankIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(15, 76, 129, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  selectedBankIcon: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  bankName: {
    fontSize: 12,
    fontWeight: '500',
    color: '#374151',
    flex: 1,
  },
  selectedBankName: {
    color: '#fff',
    fontWeight: '600',
  },
  accountInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 12,
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    gap: 12,
  },
  accountInput: {
    flex: 1,
    fontSize: 16,
    color: '#111518',
    paddingVertical: 14,
  },
  securityInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 8,
    marginBottom: 24,
  },
  securityText: {
    fontSize: 12,
    color: '#6b7280',
  },
  modalActions: {
    flexDirection: 'row',
    gap: 12,
  },
  cancelButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#d1d5db',
    backgroundColor: '#fff',
    alignItems: 'center',
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#6b7280',
  },
  submitButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 16,
    backgroundColor: '#ff9f43',
    alignItems: 'center',
    shadowColor: '#ff9f43',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 8,
  },
  submitButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
  },
  bottomSpacer: {
    height: 20,
  },
});