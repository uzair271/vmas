import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, ActivityIndicator, StyleSheet } from 'react-native';
import { fetchManufacturers } from '@/services/FetchManufacturers'; // ✅ Import the API function

export default function VehicleData() {
  const [manufacturers, setManufacturers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadManufacturers = async () => {
      setLoading(true);
      const data = await fetchManufacturers();
      setManufacturers(data);
      setLoading(false);
    };

    loadManufacturers();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🚗 Honda Manufacturers</Text>

      {loading ? (
        <ActivityIndicator size="large" color="#007BFF" />
      ) : (
        <FlatList
          data={manufacturers}
          keyExtractor={(item) => item.Id?.toString() || Math.random().toString()}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <Text style={styles.text}>🏭 Manufacturer: {item.Name || "Unknown"}</Text>
              <Text style={styles.text}>🌍 Country: {item.Country || "N/A"}</Text>
              <Text style={styles.text}>🚗 Vehicle Type: {item.VehicleType || "Unknown"}</Text>
              <Text style={styles.text}>🔢 WMI: {item.WMI || "N/A"}</Text>
            </View>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#F0F4F8' },
  title: { fontSize: 24, fontWeight: 'bold', textAlign: 'center', marginBottom: 10 },
  card: { backgroundColor: '#FFF', padding: 12, marginVertical: 6, borderRadius: 8, elevation: 3 },
  text: { fontSize: 16, color: '#333' }
});
