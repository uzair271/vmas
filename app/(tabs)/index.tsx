import React from "react";
import { View, Text, FlatList, StyleSheet, Switch } from "react-native";
import { useSelector } from "react-redux";
import { useTheme } from "@/components/ThemeContext"; // ✅ import your custom theme context

export default function HomeScreen() {
  const bookedServices = useSelector((state: any) => state.bookings.services);

  // ✅ Access theme and toggle function
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === "dark";

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: isDark ? "#121212" : "#F0F4F8" },
      ]}
    >
      <Text style={[styles.title, { color: isDark ? "#fff" : "#000" }]}>
        🏠 Welcome to Vehicle Maintenance
      </Text>

      {/* 🌗 Theme Switch */}
      <View style={styles.switchContainer}>
        <Text style={{ color: isDark ? "#fff" : "#000", marginRight: 10 }}>
          {isDark ? "🌙 Dark Mode" : "☀️ Light Mode"}
        </Text>
        <Switch value={isDark} onValueChange={toggleTheme} />
      </View>

      {/* Booked Services Section */}
      <Text style={[styles.subtitle, { color: isDark ? "#fff" : "#000" }]}>
        📅 Your Booked Services:
      </Text>
      {bookedServices.length === 0 ? (
        <Text style={[styles.noBooking, { color: isDark ? "#ccc" : "#666" }]}>
          No services booked yet.
        </Text>
      ) : (
        <FlatList
          data={bookedServices}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <View
              style={[
                styles.serviceItem,
                { backgroundColor: isDark ? "#1e1e1e" : "#fff" },
              ]}
            >
              <Text
                style={[
                  styles.serviceText,
                  { color: isDark ? "#fff" : "#333" },
                ]}
              >
                🔧 {item.name}
              </Text>
            </View>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 10,
  },
  subtitle: { fontSize: 20, fontWeight: "bold", marginTop: 15 },
  noBooking: { fontSize: 16, marginTop: 10, textAlign: "center" },
  switchContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
  },
  serviceItem: {
    padding: 12,
    marginVertical: 6,
    borderRadius: 8,
    elevation: 3,
  },
  serviceText: { fontSize: 16, fontWeight: "bold" },
});
