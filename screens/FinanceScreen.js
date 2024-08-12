import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function FinanceScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Finance Overview</Text>
      <Text style={styles.description}>
        Track your finances, manage your budget, and see your financial health all in one place.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F8F8F8',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
  },
  description: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
});
