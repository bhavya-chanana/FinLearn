import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Modal, TextInput, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Picker } from '@react-native-picker/picker';
import DateTimePicker from '@react-native-community/datetimepicker';

export default function FinanceScreen() {
  const [modalVisible, setModalVisible] = useState(false);
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('Others');
  const [paymentMode, setPaymentMode] = useState('cash');
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTransactions();
  }, []);

  const fetchTransactions = async () => {
    try {
      const response = await fetch('http://10.0.2.2:5000/expenses');
      if (response.ok) {
        const data = await response.json();
        console.log('Fetched transactions:', data); // Debugging line
        setTransactions(data);
      } else {
        console.error('Failed to fetch transactions');
        setTransactions([]);
      }
    } catch (error) {
      console.error('Error fetching transactions:', error);
      setTransactions([]);
    } finally {
      setLoading(false);
    }
  };

  const openModal = () => {
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
  };

  const onDateChange = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setShowDatePicker(false);
    setDate(currentDate);
  };

  const handleSaveTransaction = async () => {
    try {
        const response = await fetch('http://10.0.2.2:5000/expenses', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                amount: parseFloat(amount),
                category,
                payment_mode: paymentMode,
                date: date.toISOString(), // Ensure date is properly formatted in ISO 8601
                description: "", // Add default empty description if necessary
                tags: [] // Add default empty tags if necessary
            }),
        });

        if (response.ok) {
            const newTransaction = await response.json();
            setTransactions([newTransaction, ...transactions]);
            closeModal(); // Close the modal after saving
        } else {
            console.error('Failed to save transaction');
        }
    } catch (error) {
        console.error('Error:', error);
        }
    };


  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#6200EE" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollView}>
        <Text style={styles.headerText}>This month</Text>
        <View style={styles.balanceContainer}>
          <View style={[styles.balanceBox, { backgroundColor: '#FF6347' }]}>
            <Text style={styles.balanceLabel}>Spending</Text>
            <Text style={styles.spendingText}>
              ₹{transactions && transactions.length > 0 ? transactions.reduce((sum, txn) => sum + parseFloat(txn.amount), 0) : 0}
            </Text>
          </View>
          <View style={[styles.balanceBox, { backgroundColor: '#32CD32' }]}>
            <Text style={styles.balanceLabel}>Income</Text>
            <Text style={styles.incomeText}>₹0.00</Text>
          </View>
        </View>

        <Text style={styles.subHeaderText}>Recent transactions</Text>
        {transactions.map((transaction) => (
          <View key={transaction.id} style={styles.transactionItem}>
            <View style={styles.transactionIcon}>
              <Ionicons name="md-receipt" size={24} color="#6200EE" />
            </View>
            <View style={styles.transactionDetails}>
              <Text style={styles.transactionAmount}>₹{transaction.amount}</Text>
              <Text style={styles.transactionCategory}>{transaction.category}</Text>
            </View>
            <Text style={styles.transactionDate}>{new Date(transaction.date).toLocaleDateString()}</Text>
          </View>
        ))}
      </ScrollView>

      {/* Floating Action Button */}
      <TouchableOpacity style={styles.fab} onPress={openModal}>
        <Ionicons name="add" size={24} color="white" />
      </TouchableOpacity>

      {/* Modal for Adding Expense */}
      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={closeModal}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Add Expense</Text>

            {/* Date Picker */}
            <TouchableOpacity onPress={() => setShowDatePicker(true)} style={styles.datePicker}>
              <Text style={styles.datePickerText}>{date.toDateString()}</Text>
            </TouchableOpacity>
            {showDatePicker && (
              <DateTimePicker
                value={date}
                mode="date"
                display="default"
                onChange={onDateChange}
              />
            )}

            {/* Amount Input */}
            <View style={styles.row}>
              <Text style={styles.label}>Amount</Text>
              <TextInput
                style={styles.input}
                keyboardType="numeric"
                value={amount}
                onChangeText={setAmount}
              />
            </View>

            {/* Category Picker */}
            <View style={styles.row}>
              <Text style={styles.label}>Category</Text>
              <Picker
                selectedValue={category}
                style={styles.picker}
                onValueChange={(itemValue) => setCategory(itemValue)}
              >
                <Picker.Item label="Others" value="Others" />
                <Picker.Item label="Food" value="Food" />
                <Picker.Item label="Transport" value="Transport" />
                <Picker.Item label="Shopping" value="Shopping" />
                <Picker.Item label="Entertainment" value="Entertainment" />
              </Picker>
            </View>

            {/* Payment Mode Picker */}
            <View style={styles.row}>
              <Text style={styles.label}>Payment Mode</Text>
              <Picker
                selectedValue={paymentMode}
                style={styles.picker}
                onValueChange={(itemValue) => setPaymentMode(itemValue)}
              >
                <Picker.Item label="Cash" value="cash" />
                <Picker.Item label="UPI" value="upi" />
                <Picker.Item label="Debit/Credit Card" value="debit/credit card" />
                <Picker.Item label="Bank Transfer" value="bank transfer" />
              </Picker>
            </View>

            {/* Save Button */}
            <TouchableOpacity onPress={handleSaveTransaction} style={styles.saveButton}>
              <Text style={styles.saveButtonText}>Save</Text>
            </TouchableOpacity>

            {/* Close Button */}
            <TouchableOpacity onPress={closeModal} style={styles.closeButton}>
              <Text style={styles.closeButtonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollView: {
    padding: 20,
    paddingBottom: 100,
  },
  headerText: {
    fontSize: 24,
    color: '#000000',
    marginBottom: 20,
  },
  balanceContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  balanceBox: {
    flex: 1,
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginHorizontal: 5,
  },
  balanceLabel: {
    fontSize: 16,
    color: '#000000',
    marginBottom: 5,
  },
  spendingText: {
    color: '#FFFFFF',
    fontSize: 20,
  },
  incomeText: {
    color: '#FFFFFF',
    fontSize: 20,
  },
  subHeaderText: {
    fontSize: 20,
    color: '#000000',
    marginBottom: 10,
  },
  transactionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderRadius: 10,
    backgroundColor: '#F5F5F5',
    marginBottom: 10,
  },
  transactionIcon: {
    marginRight: 15,
  },
  transactionDetails: {
    flex: 1,
  },
  transactionAmount: {
    fontSize: 16,
    color: '#000000',
  },
  transactionCategory: {
    fontSize: 14,
    color: '#666666',
  },
  transactionDate: {
    fontSize: 14,
    color: '#666666',
  },
  fab: {
    position: 'absolute',
    right: 20,
    bottom: 30,
    backgroundColor: '#6200EE',
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '90%',
    padding: 20,
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
  },
  modalTitle: {
    fontSize: 18,
    color: '#000000',
    marginBottom: 20,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginVertical: 10,
  },
  label: {
    fontSize: 16,
    color: '#333333',
  },
  input: {
    borderWidth: 1,
    borderColor: '#CCCCCC',
    padding: 10,
    borderRadius: 5,
    flex: 1,
  },
  picker: {
    height: 50,
    width: 150,
  },
  datePicker: {
    marginBottom: 20,
    padding: 10,
    borderWidth: 1,
    borderColor: '#CCCCCC',
    borderRadius: 5,
  },
  datePickerText: {
    fontSize: 16,
    color: '#333333',
  },
  saveButton: {
    marginTop: 20,
    backgroundColor: '#6200EE',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  saveButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
  },
  closeButton: {
    marginTop: 10,
    backgroundColor: '#FF6347',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  closeButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
  },
});
