import React, { useEffect, useState } from 'react';
import { View, Text, Button, FlatList, StyleSheet, Alert, TextInput } from 'react-native';
import { collection, addDoc, getDocs, deleteDoc, doc, updateDoc } from 'firebase/firestore';
import { db } from '../../firebase/firebaseConfig';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { Link } from 'expo-router';

export default function MaintenanceRecords() {
  const [records, setRecords] = useState([]);
  const [editId, setEditId] = useState(null);

  const fetchRecords = async () => {
    const snapshot = await getDocs(collection(db, 'maintenance'));
    const data = snapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
    setRecords(data);
  };

  const handleAddOrUpdate = async (values, { resetForm }) => {
    try {
      if (editId) {
        await updateDoc(doc(db, 'maintenance', editId), {
          service: values.service,
          mileage: parseInt(values.mileage),
        });
        Alert.alert('✅ Record updated!');
        setEditId(null);
      } else {
        await addDoc(collection(db, 'maintenance'), {
          service: values.service,
          mileage: parseInt(values.mileage),
        });
        Alert.alert('✅ Record added!');
      }
      resetForm();
      fetchRecords();
    } catch (error) {
      console.log('Error:', error);
    }
  };

  const deleteRecord = async (id) => {
    await deleteDoc(doc(db, 'maintenance', id));
    fetchRecords();
  };

  useEffect(() => {
    fetchRecords();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🛠 Maintenance Records</Text>

      <Formik
        initialValues={{ service: '', mileage: '' }}
        enableReinitialize
        validationSchema={Yup.object({
          service: Yup.string().required('Service type is required'),
          mileage: Yup.number().typeError('Must be a number').required('Mileage is required'),
        })}
        onSubmit={handleAddOrUpdate}
      >
        {({ handleChange, handleBlur, handleSubmit, values, errors, touched }) => (
          <View>
            <TextInput
              style={styles.input}
              placeholder="Service Type"
              onChangeText={handleChange('service')}
              onBlur={handleBlur('service')}
              value={values.service}
            />
            {touched.service && errors.service && (
              <Text style={styles.error}>{errors.service}</Text>
            )}

            <TextInput
              style={styles.input}
              placeholder="Mileage"
              keyboardType="numeric"
              onChangeText={handleChange('mileage')}
              onBlur={handleBlur('mileage')}
              value={values.mileage}
            />
            {touched.mileage && errors.mileage && (
              <Text style={styles.error}>{errors.mileage}</Text>
            )}

            <Button title={editId ? 'Update Record' : 'Add Record'} onPress={handleSubmit} />
          </View>
        )}
      </Formik>

      <FlatList
        data={records}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.record}>
            <Link
              href={{
                pathname: '/cars/[details]',
                params: {
                  service: item.service,
                  mileage: item.mileage,
                },
              }}
            >
              <Text>
                {item.service} - {item.mileage} km
              </Text>
            </Link>
            <Button
              title="Edit"
              onPress={() => {
                setEditId(item.id);
              }}
            />
            <Button title="Delete" color="red" onPress={() => deleteRecord(item.id)} />
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#F0F4F8' },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 15, textAlign: 'center' },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    marginBottom: 10,
    borderRadius: 6,
    backgroundColor: '#fff',
  },
  error: {
    color: 'red',
    marginBottom: 10,
    marginLeft: 4,
  },
  record: {
    backgroundColor: '#fff',
    padding: 10,
    marginBottom: 10,
    borderRadius: 6,
  },
});
