import React, { useState } from 'react';
import {
  View, TextInput, Button, StyleSheet, Text, Alert, Platform
} from 'react-native';
import { createUserWithEmailAndPassword, sendEmailVerification } from 'firebase/auth';
import { collection, addDoc } from 'firebase/firestore';
import { auth, db } from '@/firebase/firebaseConfig';
import { useRouter } from 'expo-router';
import { Picker } from '@react-native-picker/picker';

export default function Signup() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [role, setRole] = useState('user');
  const router = useRouter();

  const handleSignup = async () => {
    if (!email || !password || !name) {
      Alert.alert('Please fill all fields');
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Send email verification
      await sendEmailVerification(user);

      // Save user data to Firestore
      await addDoc(collection(db, 'users'), {
        uid: user.uid,
        name,
        email,
        role,
      });

      Alert.alert(
        'Signup Successful',
        'Verification email sent. Please verify your email before logging in.'
      );
      router.push('/signin');




    } catch (error) {
      console.error(error);
      const errorMessage = error?.message || 'An unknown error occurred during signup';
      Alert.alert('Signup error', errorMessage);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Create Account</Text>

      <TextInput
        placeholder="Full Name"
        style={styles.input}
        value={name}
        onChangeText={setName}
        placeholderTextColor="#999"
      />
      <TextInput
        placeholder="Email Address"
        style={styles.input}
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
        placeholderTextColor="#999"
      />
      <TextInput
        placeholder="Password"
        style={styles.input}
        value={password}
        secureTextEntry
        onChangeText={setPassword}
        autoCapitalize="none"
        placeholderTextColor="#999"
      />

      <Text style={styles.label}>Role</Text>
      <View style={styles.pickerContainer}>
        <Picker
          selectedValue={role}
          onValueChange={(itemValue) => setRole(itemValue)}
          style={styles.picker}
        >
          <Picker.Item label="User" value="user" />
          <Picker.Item label="Admin" value="admin" />
        </Picker>
      </View>

      <View style={styles.buttonWrapper}>
        <Button title="Sign Up" color="#4CAF50" onPress={handleSignup} />
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
  label: {
    fontWeight: '600',
    marginBottom: 5,
    fontSize: 16,
    color: '#555',
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 12,
    marginBottom: 20,
    backgroundColor: '#fff',
    overflow: 'hidden',
  },
  picker: {
    height: 50,
  },
  buttonWrapper: {
    marginTop: 10,
    borderRadius: 12,
    overflow: 'hidden',
  },
});
