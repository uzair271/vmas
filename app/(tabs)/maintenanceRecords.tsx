import React, { useState } from 'react';
import { View, Text, FlatList, TextInput, Button, StyleSheet, TouchableOpacity } from 'react-native';
import MaintenanceItem from './MaintenanceItem'; // Importing external component

export default function MaintenanceRecords() {
  // State to store maintenance records
  const [records, setRecords] = useState<{ id: string; service: string; mileage: number }[]>([
    { id: '1', service: 'Oil Change', mileage: 5000 },
    { id: '2', service: 'Brake Check', mileage: 10000 },
  ]);

  const [newService, setNewService] = useState('');
  const [newMileage, setNewMileage] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);

  // Create: Add a new record
  const addRecord = () => {
    if (newService.trim() && newMileage.trim() && !isNaN(Number(newMileage))) {
      setRecords((prevRecords) => [
        ...prevRecords,
        { id: Date.now().toString(), service: newService, mileage: parseInt(newMileage) },
      ]);
      setNewService('');
      setNewMileage('');
    }
  };

  // Update: Modify an existing record
  const updateRecord = () => {
    if (newService.trim() && newMileage.trim() && !isNaN(Number(newMileage))) {
      setRecords((prevRecords) =>
        prevRecords.map((record) =>
          record.id === editingId ? { ...record, service: newService, mileage: parseInt(newMileage) } : record
        )
      );
      setEditingId(null);
      setNewService('');
      setNewMileage('');
    }
  };

  // Delete: Remove a record
  const deleteRecord = (id: string) => {
    setRecords((prevRecords) => prevRecords.filter((record) => record.id !== id));
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🚗 Maintenance Records</Text>

      {/* Input Fields */}
      <TextInput
        style={styles.input}
        placeholder="🔧 Service Type"
        placeholderTextColor="#7a869a"
        value={newService}
        onChangeText={setNewService}
      />
      <TextInput
        style={styles.input}
        placeholder="📏 Mileage (km)"
        placeholderTextColor="#7a869a"
        value={newMileage}
        keyboardType="numeric"
        onChangeText={setNewMileage}
      />

      <TouchableOpacity style={styles.addButton} onPress={editingId ? updateRecord : addRecord}>
        <Text style={styles.buttonText}>{editingId ? 'Update Record' : 'Add Record'}</Text>
      </TouchableOpacity>

     
      <FlatList
        data={records}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <MaintenanceItem
            item={item}
            onEdit={(selectedItem) => {
              setEditingId(selectedItem.id);
              setNewService(selectedItem.service);
              setNewMileage(selectedItem.mileage.toString());
            }}
            onDelete={deleteRecord}
          />
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#F0F4F8' },
  title: { fontSize: 26, fontWeight: 'bold', color: '#1E3A8A', marginBottom: 15, textAlign: 'center' },
  input: { 
    borderWidth: 1, borderColor: '#7a869a', padding: 12, borderRadius: 10, backgroundColor: '#fff', 
    marginBottom: 10, fontSize: 16, color: '#333' 
  },
  addButton: { 
    backgroundColor: '#1E3A8A', paddingVertical: 14, borderRadius: 8, alignItems: 'center', marginBottom: 15 
  },
  buttonText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
});


