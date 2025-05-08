import React, { useState } from 'react';
import { View, TextInput, Button, StyleSheet, Text, Alert, Platform } from 'react-native';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '@/firebase/firebaseConfig';
import { useRouter } from 'expo-router';

export default function SignIn() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Please enter email and password');
      return;
    }

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Clear inputs
      setEmail('');
      setPassword('');

      Alert.alert('Login successful');
      router.push('/');
    } catch (error) {
      console.error(error);
      const errorMessage = error?.message || 'An unknown error occurred during login';
      Alert.alert('Login error', errorMessage);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome Back</Text>

      <TextInput
        placeholder="Email Address"
        placeholderTextColor="#999"
        style={styles.input}
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />

      <TextInput
        placeholder="Password"
        placeholderTextColor="#999"
        style={styles.input}
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        autoCapitalize="none"
      />

      <View style={styles.buttonWrapper}>
        <Button title="Sign In" color="#2196F3" onPress={handleLogin} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 25,
    flex: 1,
    justifyContent: 'center',
    backgroundColor: '#f9fafa',
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    marginBottom: 30,
    textAlign: 'center',
    color: '#333',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 12,
    padding: Platform.OS === 'ios' ? 15 : 10,
    marginBottom: 15,
    backgroundColor: '#fff',
    fontSize: 16,
  },
  buttonWrapper: {
    marginTop: 10,
    borderRadius: 12,
    overflow: 'hidden',
  },
});
