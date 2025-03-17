import { Image, StyleSheet, Platform, TouchableOpacity, View } from 'react-native';
import { HelloWave } from '@/components/HelloWave';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { useRouter } from 'expo-router';

export default function HomeScreen() {
  const router = useRouter();

  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#A1CEDC', dark: '#1D3D47' }}
      headerImage={
        <Image
          source={require('@/assets/images/partial-react-logo.png')}
          style={styles.reactLogo}
        />
      }>
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title">Welcome to Vehicle Maintenance</ThemedText>
        <HelloWave />
      </ThemedView>

      {/* Step Instructions */}
      <ThemedView style={styles.stepContainer}>
        <ThemedText type="subtitle">Get Started</ThemedText>
        <ThemedText>
          Edit <ThemedText type="defaultSemiBold">app/(tabs)/index.tsx</ThemedText> to see changes.
        </ThemedText>
      </ThemedView>

      {/* Maintenance Reminder Section */}
      <ThemedView style={styles.maintenanceContainer}>
        <ThemedText type="subtitle">Upcoming Maintenance</ThemedText>
        <ThemedText>Your next oil change is due in 500 km.</ThemedText>
        <ThemedText>Check tire pressure and brake fluid.</ThemedText>
      </ThemedView>



      {/* Action Button */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button} onPress={() => router.push('/maintenance')}>
          <ThemedText type="defaultSemiBold" style={styles.buttonText}>View Maintenance Records</ThemedText>
        </TouchableOpacity>
      </View>
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    padding: 15,
    backgroundColor: '#EAF6F6',
    borderRadius: 10,
    marginBottom: 10,
  },
  stepContainer: {
    padding: 15,
    backgroundColor: '#FAFAFA',
    borderRadius: 10,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  maintenanceContainer: {
    padding: 15,
    backgroundColor: '#FFF3E6',
    borderRadius: 10,
    marginBottom: 10,
    borderLeftWidth: 5,
    borderLeftColor: '#FFA500',
  },
  buttonContainer: {
    alignItems: 'center',
    marginTop: 20,
  },
  button: {
    backgroundColor: '#007BFF',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  buttonText: {
    color: '#fff',
    textAlign: 'center',
  },
  reactLogo: {
    height: 150,
    width: 250,
    bottom: 0,
    left: 0,
    position: 'absolute',
  },
});