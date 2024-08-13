import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Picker } from '@react-native-picker/picker';

export default function AddTransactionScreen({ navigation }) {
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('Others');
  const [paymentMode, setPaymentMode] = useState('cash'); // Default value as per the backend's check constraint
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);

  const onDateChange = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setShowDatePicker(false);
    setDate(currentDate);
  };

  const handleAddTransaction = async () => {
    try {
      const response = await fetch('http://10.0.2.2:5000/expenses', { // Use your backend's correct URL and port
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: parseFloat(amount),
          category,
          payment_mode: paymentMode,
          date: date.toISOString(), // Ensure date is properly formatted
        }),
      });

      if (response.ok) {
        const data = await response.json();
        console.log('Transaction Added:', data);
        navigation.goBack(); // Go back to the Finance screen
      } else {
        const errorData = await response.json();
        console.error('Failed to add transaction:', errorData);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.row}>
        <Text style={styles.label}>Date</Text>
        <TouchableOpacity onPress={() => setShowDatePicker(true)}>
          <Text style={styles.value}>{date.toDateString()}</Text>
        </TouchableOpacity>
      </View>

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
          value={amount}
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

      <TouchableOpacity style={styles.addButton} onPress={handleAddTransaction}>
        <Text style={styles.addButtonText}>Add Transaction</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#FFFFFF',
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
  value: {
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
  addButton: {
    marginTop: 20,
    padding: 15,
    backgroundColor: '#6200EE',
    borderRadius: 5,
    alignItems: 'center',
  },
  addButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
  },
});
