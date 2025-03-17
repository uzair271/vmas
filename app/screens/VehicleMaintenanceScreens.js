import React from "react";
import { View, Text, Button, StyleSheet, Alert } from "react-native";

const VehicleMaintenanceScreen = () => {
  const handleServiceRequest = () => {
    Alert.alert("Service Requested", "Your vehicle service has been scheduled!");
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Vehicle Maintenance & Services</Text>
      <Text style={styles.info}>
        Keep your vehicle in top condition with regular maintenance!
      </Text>
      <Button title="Request Service" onPress={handleServiceRequest} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f8f9fa",
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
  },
  info: {
    fontSize: 16,
    textAlign: "center",
    marginBottom: 20,
  },
});

export default VehicleMaintenanceScreen;
