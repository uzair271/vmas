import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useSelector } from 'react-redux';

export default function Header() {
  const bookingCount = useSelector((state) => state.bookings.count);

  return (
    <View style={styles.header}>
      <Text style={styles.title}>🚗 Vehicle Services</Text>
      <Text style={styles.counter}>📅 Bookings: {bookingCount}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  header: { padding: 20, backgroundColor: '#1E3A8A', alignItems: 'center' },
  title: { fontSize: 20, color: '#FFF', fontWeight: 'bold' },
  counter: { fontSize: 16, color: '#FFF' },
});
