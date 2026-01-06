import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function TestScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>🎉 TEST SCREEN BERHASIL!</Text>
      <Text>Event Approval Screen</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f6f7f8',
  },
  text: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#003366',
    marginBottom: 20,
  },
});