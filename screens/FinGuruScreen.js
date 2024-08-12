import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function FinGuruScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome to FinGuru</Text>
      <Text style={styles.description}>
        Here you can find financial advice, tips, and answers to your questions.
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
