import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useDispatch } from 'react-redux';
import { bookService } from '@/redux/slices/bookingsSlice';

export default function Service({ id, name }) {
  const dispatch = useDispatch();

  return (
    <View style={styles.service}>
      <Text style={styles.serviceName}>🔧 {name}</Text>
      <TouchableOpacity
        style={styles.button}
        onPress={() => dispatch(bookService({ id, name }))}
      >
        <Text style={styles.buttonText}>📅 Book Service</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  service: { padding: 15, backgroundColor: '#FFF', marginBottom: 10, borderRadius: 8 },
  serviceName: { fontSize: 18, fontWeight: 'bold' },
  button: { backgroundColor: '#007BFF', padding: 10, borderRadius: 5, marginTop: 5 },
  buttonText: { color: '#FFF', fontSize: 16, textAlign: 'center' },
});
