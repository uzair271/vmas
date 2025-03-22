import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

// Define TypeScript props for the component
type MaintenanceItemProps = {
  item: { id: string; service: string; mileage: number };
  onEdit: (item: { id: string; service: string; mileage: number }) => void;
  onDelete: (id: string) => void;
};

const MaintenanceItem: React.FC<MaintenanceItemProps> = ({ item, onEdit, onDelete }) => {
  return (
    <View style={styles.record}>
      <Text style={styles.recordText}>{item.service} - {item.mileage} km</Text>

      <View style={styles.buttons}>
        {/* Edit Button */}
        <TouchableOpacity onPress={() => onEdit(item)} style={styles.editButton}>
          <Text style={styles.buttonText}>Edit</Text>
        </TouchableOpacity>

        {/* Delete Button */}
        <TouchableOpacity onPress={() => onDelete(item.id)} style={styles.deleteButton}>
          <Text style={styles.buttonText}>Delete</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

// Styling for the component
const styles = StyleSheet.create({
  record: { 
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    padding: 15, backgroundColor: '#FFF', borderRadius: 10, marginBottom: 10, 
    shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 5, elevation: 3 
  },
  recordText: { fontSize: 16, color: '#333' },
  buttons: { flexDirection: 'row', gap: 10 },
  editButton: { backgroundColor: '#34A853', padding: 8, borderRadius: 6 },
  deleteButton: { backgroundColor: '#EA4335', padding: 8, borderRadius: 6 },
  buttonText: { color: '#fff', fontWeight: 'bold' },
});

export default MaintenanceItem;

