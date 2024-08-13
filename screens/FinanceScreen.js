import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Modal, TextInput, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Picker } from '@react-native-picker/picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import { PieChart } from 'react-native-chart-kit';
import { Dimensions } from 'react-native';

export default function FinanceScreen() {
  const [modalVisible, setModalVisible] = useState(false);
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('Others');
  const [paymentMode, setPaymentMode] = useState('cash');
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAllTransactions, setShowAllTransactions] = useState(false);

  useEffect(() => {
    fetchTransactions();
  }, []);

  const fetchTransactions = async () => {
    try {
      const response = await fetch('http://10.0.2.2:5000/expenses');
      if (response.ok) {
        const data = await response.json();
        const parsedTransactions = data.map(transaction => ({
          ...transaction,
          date: transaction.date ? new Date(transaction.date) : null,
          amount: parseFloat(transaction.amount)
        }));
        setTransactions(parsedTransactions);
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
      const formattedDate = new Date(date.toISOString().split('.')[0] + 'Z');

      const response = await fetch('http://10.0.2.2:5000/expenses', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: parseFloat(amount),
          category,
          payment_mode: paymentMode,
          date: formattedDate,
          description: "",
          tags: []
        }),
      });

      if (response.ok) {
        const newTransaction = await response.json();

        newTransaction.date = new Date(newTransaction.date);
        newTransaction.amount = parseFloat(newTransaction.amount);

        setTransactions([newTransaction, ...transactions]);
        closeModal();
      } else {
        console.error('Failed to save transaction');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const toggleShowAllTransactions = () => {
    setShowAllTransactions(!showAllTransactions);
  };

  const displayedTransactions = showAllTransactions ? transactions : transactions.slice(0, 5);

  const getCategoryWiseSpending = () => {
    const totalSpending = transactions.reduce((acc, transaction) => acc + transaction.amount, 0);

    const categorySpending = transactions.reduce((acc, transaction) => {
      const { category, amount } = transaction;
      if (!acc[category]) {
        acc[category] = 0;
      }
      acc[category] += amount;
      return acc;
    }, {});

    return Object.keys(categorySpending).map(category => {
      const amount = categorySpending[category];
      const percentage = ((amount / totalSpending) * 100).toFixed(2);
      return {
        name: `${category} ${percentage}%`,
        amount: amount,
        color: getRandomColor(),
        legendFontColor: '#7F7F7F',
        legendFontSize: 15,
      };
    });
  };

  const getRandomColor = () => {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#B68D40" />
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
              ₹{transactions && transactions.length > 0 ? transactions.reduce((sum, txn) => sum + txn.amount, 0).toFixed(2) : '0.00'}
            </Text>
          </View>
          <View style={[styles.balanceBox, { backgroundColor: '#32CD32' }]}>
            <Text style={styles.balanceLabel}>Income</Text>
            <Text style={styles.incomeText}>₹0.00</Text>
          </View>
        </View>

        <Text style={styles.subHeaderText}>Recent transactions</Text>
        {displayedTransactions.map((transaction) => (
          <View key={transaction.id} style={styles.transactionItem}>
            <View style={styles.transactionIcon}>
              <Ionicons name="receipt" size={24} color="#B68D40" />
            </View>
            <View style={styles.transactionDetails}>
              <Text style={styles.transactionAmount}>₹{transaction.amount.toFixed(2)}</Text>
              <Text style={styles.transactionCategory}>{transaction.category}</Text>
            </View>
            <Text style={styles.transactionDate}>
              {transaction.date ? transaction.date.toDateString() : 'Invalid Date'}
            </Text>
          </View>
        ))}

        {transactions.length > 5 && (
          <>
            <TouchableOpacity onPress={toggleShowAllTransactions} style={styles.showMoreButton}>
              <Text style={styles.showMoreText}>
                {showAllTransactions ? 'Show Less' : 'Show More'}
              </Text>
            </TouchableOpacity>

            <PieChart
              data={getCategoryWiseSpending()}
              width={Dimensions.get('window').width - 40}
              height={220}
              chartConfig={{
                backgroundColor: '#1F1B2E',
                backgroundGradientFrom: '#1F1B2E',
                backgroundGradientTo: '#1F1B2E',
                color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                style: {
                  borderRadius: 16,
                },
                propsForDots: {
                  r: '6',
                  strokeWidth: '2',
                  stroke: '#ffa726',
                },
              }}
              accessor={'amount'}
              backgroundColor={'transparent'}
              paddingLeft={'15'}
              absolute
            />
          </>
        )}
      </ScrollView>

      <TouchableOpacity style={styles.fab} onPress={openModal}>
        <Ionicons name="add" size={24} color="white" />
      </TouchableOpacity>

      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={closeModal}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Add Expense</Text>

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

            <View style={styles.row}>
              <Text style={styles.label}>Amount</Text>
              <TextInput
                style={styles.input}
                keyboardType="numeric"
                value={amount.toString()}
                onChangeText={setAmount}
              />
            </View>

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

            <TouchableOpacity onPress={handleSaveTransaction} style={styles.saveButton}>
              <Text style={styles.saveButtonText}>Save</Text>
            </TouchableOpacity>

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
    backgroundColor: '#0E0B1F',
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
    color: '#FFF',
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
    color: '#FFF',
    marginBottom: 5,
  },
  spendingText: {
    color: '#FFF',
    fontSize: 20,
  },
  incomeText: {
    color: '#FFF',
    fontSize: 20,
  },
  subHeaderText: {
    fontSize: 20,
    color: '#FFF',
    marginBottom: 10,
  },
  transactionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderRadius: 10,
    backgroundColor: '#1F1B2E',
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
    color: '#FFF',
  },
  transactionCategory: {
    fontSize: 14,
    color: '#B0B0B0',
  },
  transactionDate: {
    fontSize: 14,
    color: '#B0B0B0',
  },
  showMoreButton: {
    marginVertical: 15,
    alignItems: 'center',
  },
  showMoreText: {
    color: '#B68D40',
    fontSize: 16,
  },
  fab: {
    position: 'absolute',
    right: 20,
    bottom: 30,
    backgroundColor: '#B68D40',
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
    backgroundColor: '#1F1B2E',
    borderRadius: 10,
  },
  modalTitle: {
    fontSize: 18,
    color: '#FFF',
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
    color: '#B0B0B0',
  },
  input: {
    borderWidth: 1,
    borderColor: '#333',
    padding: 10,
    borderRadius: 5,
    flex: 1,
    color: '#FFF',
    backgroundColor: '#333',
  },
  picker: {
    height: 50,
    width: 150,
    color: '#FFF',
    backgroundColor: '#333',
  },
  datePicker: {
    marginBottom: 20,
    padding: 10,
    borderWidth: 1,
    borderColor: '#333',
    borderRadius: 5,
  },
  datePickerText: {
    fontSize: 16,
    color: '#FFF',
  },
  saveButton: {
    marginTop: 20,
    backgroundColor: '#B68D40',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  saveButtonText: {
    color: '#FFF',
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
    color: '#FFF',
    fontSize: 16,
  },
});
