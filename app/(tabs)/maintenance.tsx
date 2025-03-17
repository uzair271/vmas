import { View, Text, StyleSheet } from 'react-native';

export default function MaintenanceScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Maintenance Records</Text>
      <Text>Here you will see all vehicle maintenance records.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F5F5F5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
});
