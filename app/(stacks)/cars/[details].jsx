// app/(stacks)/cars/[details].jsx

import { useLocalSearchParams } from "expo-router";
import React from "react";
import { Text, View, StyleSheet } from "react-native";

const Details = () => {
  const { service, mileage } = useLocalSearchParams();

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Service Details</Text>

      <View style={styles.card}>
        <Text style={styles.label}>Service:</Text>
        <Text style={styles.value}>{service}</Text>

        <Text style={styles.label}>Mileage:</Text>
        <Text style={styles.value}>{mileage} km</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#F9F9F9',
    flex: 1,
  },
  heading: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 20,
    textAlign: 'center',
    color: '#333',
  },
  card: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginTop: 10,
    color: '#555',
  },
  value: {
    fontSize: 18,
    fontWeight: '400',
    color: '#222',
  },
});

export default Details;
