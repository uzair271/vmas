import React from 'react';
import { View, FlatList, StyleSheet } from 'react-native';
import Header from '@/components/Header';
import Service from '@/components/Service';

export default function ServicesScreen() {
  const services = [
    { id: '1', name: 'Oil Change' },
    { id: '2', name: 'Brake Inspection' },
    { id: '3', name: 'Engine Tune-Up' },
  ];

  return (
    <View style={styles.container}>
      <Header />
      <FlatList
        data={services}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <Service id={item.id} name={item.name} />}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F0F4F8' },
});
