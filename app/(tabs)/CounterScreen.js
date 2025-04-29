import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { resetBookings, removeService, bookService } from '../../redux/slices/bookingsSlice';

export default function CounterScreen() {
  const bookingCount = useSelector((state) => state.bookings.count);
  const dispatch = useDispatch();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>📅 Total Bookings: {bookingCount}</Text>

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.button}
          onPress={() => dispatch(bookService({ id: Date.now().toString(), name: "New Booking" }))}
        >
          <Text style={styles.buttonText}>➕ Book Service</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.button}
          onPress={() => dispatch(removeService("1"))} // Replace "1" with a valid ID dynamically
        >
          <Text style={styles.buttonText}>➖ Remove Service</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.resetButton}
          onPress={() => dispatch(resetBookings())}
        >
          <Text style={styles.buttonText}>🔄 Reset Bookings</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20 },
  buttonContainer: { flexDirection: 'row', gap: 10 },
  button: { backgroundColor: '#007BFF', padding: 12, borderRadius: 8 },
  resetButton: { backgroundColor: 'red', padding: 12, borderRadius: 8 },
  buttonText: { color: '#FFF', fontSize: 16, fontWeight: 'bold' },
});
