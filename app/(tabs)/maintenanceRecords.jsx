import React, { useEffect, useState, useRef } from 'react';
import { View, Text, Button, FlatList, StyleSheet, Alert, TextInput, Image, ActivityIndicator } from 'react-native';
import { collection, addDoc, getDocs, deleteDoc, doc, updateDoc, getDoc } from 'firebase/firestore';
import { db, storage, auth } from '../../firebase/firebaseConfig'; // Import auth from Firebase
import { Formik } from 'formik';
import * as Yup from 'yup';
import { Link, useRouter } from 'expo-router'; // Import useRouter
import * as ImagePicker from 'expo-image-picker';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { onAuthStateChanged } from 'firebase/auth'; // Import to check auth state

export default function MaintenanceRecords() {
  const [records, setRecords] = useState([]);
  const [editId, setEditId] = useState(null);
  const [imageUri, setImageUri] = useState(null);
  const [isLoading, setIsLoading] = useState(true); // Add loading state
  const [isSubmitting, setIsSubmitting] = useState(false); // Add submitting state
  const router = useRouter(); // Initialize router
  const formikRef = useRef(null); // Create a ref to access Formik methods

  // Check authentication status on component mount
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (!user) {
        // No user is signed in, redirect to sign-in page
        Alert.alert(
          "Authentication Required",
          "Please sign in to access maintenance records.",
          [
            { text: "OK", onPress: () => router.push('/signin') }
          ]
        );
      } else {
        // User is signed in, fetch records
        setIsLoading(false);
        fetchRecords();
      }
    });

    // Cleanup subscription
    return () => unsubscribe();
  }, []);

  // Fetch records from Firestore
  const fetchRecords = async () => {
    try {
      const snapshot = await getDocs(collection(db, 'maintenance'));
      const data = snapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
      setRecords(data);
    } catch (error) {
      console.error("Error fetching records:", error);
      Alert.alert("Error", "Could not fetch maintenance records");
    }
  };

  // Handle add or update of records
  const handleAddOrUpdate = async (values, { resetForm }) => {
    // Check if user is authenticated before proceeding
    if (!auth.currentUser) {
      Alert.alert("Authentication Required", "Please sign in to perform this action");
      router.push('/signin');
      return;
    }

    try {
      let imageUrl = imageUri;
      
      // If a new image was picked and it's not a URL (not already uploaded)
      if (imageUri && !imageUri.startsWith('http')) {
        const response = await fetch(imageUri);
        const blob = await response.blob();
        const storageRef = ref(storage, `maintenance_images/${Date.now()}`);
        const uploadTask = await uploadBytes(storageRef, blob);
        imageUrl = await getDownloadURL(uploadTask.ref); // Get the download URL of the uploaded image
      }

      if (editId) {
        // Update record in Firestore
        const updateData = {
          service: values.service,
          mileage: parseInt(values.mileage),
          userId: auth.currentUser.uid, // Add user ID to the record
          updatedAt: new Date().toISOString(), // Add timestamp
        };

        // Only update image if we have a new one or need to clear it
        if (imageUrl !== undefined) {
          updateData.image = imageUrl;
        }

        await updateDoc(doc(db, 'maintenance', editId), updateData);
        Alert.alert('✅ Record updated!');
        setEditId(null);
      } else {
        // Add new record to Firestore
        await addDoc(collection(db, 'maintenance'), {
          service: values.service,
          mileage: parseInt(values.mileage),
          image: imageUrl, // Save image URL
          userId: auth.currentUser.uid, // Add user ID to the record
          createdAt: new Date().toISOString(), // Add timestamp
        });
        Alert.alert('✅ Record added!');
      }
      setImageUri(null); // Reset the image URI after submission
      resetForm();
      fetchRecords(); // Refresh the records
    } catch (error) {
      console.error('Error:', error);
      Alert.alert('Error', 'Failed to save record: ' + error.message);
    }
  };

  // Delete a record
  const deleteRecord = async (id) => {
    // Check if user is authenticated before proceeding
    if (!auth.currentUser) {
      Alert.alert("Authentication Required", "Please sign in to perform this action");
      router.push('/signin');
      return;
    }

    try {
      setIsSubmitting(true);
      // Get the record to check if it has an image
      const recordRef = doc(db, 'maintenance', id);
      const recordSnap = await getDoc(recordRef);
      
      if (recordSnap.exists()) {
        // Delete the document from Firestore
        await deleteDoc(recordRef);
        
        // Reset edit state if the deleted item was being edited
        if (editId === id) {
          setEditId(null);
          setImageUri(null);
          if (formikRef.current) {
            formikRef.current.resetForm();
          }
        }
        
        Alert.alert('Record deleted successfully');
      } else {
        Alert.alert('Error', 'Record not found');
      }
      
      // Refresh the records list
      fetchRecords();
    } catch (error) {
      console.error('Error deleting record:', error);
      Alert.alert('Error', 'Failed to delete record: ' + error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Pick an image from the gallery
  const pickImage = async () => {
    // Check if user is authenticated before proceeding
    if (!auth.currentUser) {
      Alert.alert("Authentication Required", "Please sign in to perform this action");
      router.push('/signin');
      return;
    }

    try {
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        quality: 0.8, // Slightly compress for better performance
        allowsEditing: true,
      });

      if (!result.canceled) {
        setImageUri(result.assets[0].uri); // Set the selected image URI
      }
    } catch (error) {
      console.error('Error picking image:', error);
      Alert.alert('Error', 'Failed to pick image');
    }
  };

  // If still loading auth state, show loading indicator
  if (isLoading) {
    return (
      <View style={[styles.container, styles.centered]}>
        <Text>Checking authentication...</Text>
      </View>
    );
  }

  // If no current user, redirect handled in useEffect, but just in case
  if (!auth.currentUser) {
    return (
      <View style={[styles.container, styles.centered]}>
        <Text>Please sign in to access maintenance records</Text>
        <Button 
          title="Go to Sign In" 
          onPress={() => router.push('/signin')} 
        />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🛠 Maintenance Records</Text>
      <Text style={styles.subtitle}>Logged in as: {auth.currentUser.email}</Text>

      <Formik
        initialValues={{ service: '', mileage: '' }}
        enableReinitialize
        innerRef={formikRef}
        validationSchema={Yup.object({
          service: Yup.string().required('Service type is required'),
          mileage: Yup.number().typeError('Must be a number').required('Mileage is required'),
        })}
        onSubmit={(values, formikBag) => {
          setIsSubmitting(true);
          handleAddOrUpdate(values, formikBag)
            .finally(() => setIsSubmitting(false));
        }}
      >
        {({ handleChange, handleBlur, handleSubmit, values, errors, touched, resetForm }) => (
          <View style={styles.formContainer}>
            <Text style={styles.formTitle}>{editId ? 'Edit Record' : 'Add New Record'}</Text>
            
            <TextInput
              style={styles.input}
              placeholder="Service Type"
              onChangeText={handleChange('service')}
              onBlur={handleBlur('service')}
              value={values.service}
              editable={!isSubmitting}
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
              editable={!isSubmitting}
            />
            {touched.mileage && errors.mileage && (
              <Text style={styles.error}>{errors.mileage}</Text>
            )}

            {/* Image picker button */}
            <Button 
              title="Pick an Image" 
              onPress={pickImage}
              disabled={isSubmitting} 
            />
            {imageUri && (
              <View style={styles.imageContainer}>
                <Image source={{ uri: imageUri }} style={styles.image} />
                <Button 
                  title="Remove Image" 
                  color="gray" 
                  onPress={() => setImageUri(null)}
                  disabled={isSubmitting}
                />
              </View>
            )}

            <View style={styles.formButtons}>
              <View style={styles.buttonContainer}>
                <Button 
                  title={editId ? 'Update Record' : 'Add Record'} 
                  onPress={handleSubmit}
                  disabled={isSubmitting}
                />
              </View>
              
              {editId && (
                <View style={styles.buttonContainer}>
                  <Button 
                    title="Cancel Edit" 
                    color="gray"
                    disabled={isSubmitting}
                    onPress={() => {
                      setEditId(null);
                      setImageUri(null);
                      resetForm();
                    }} 
                  />
                </View>
              )}
            </View>
            
            {isSubmitting && (
              <View style={styles.loadingOverlay}>
                <ActivityIndicator size="large" color="#0000ff" />
                <Text style={styles.loadingText}>
                  {editId ? 'Updating...' : 'Saving...'}
                </Text>
              </View>
            )}
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
              <Text style={styles.recordTitle}>
                {item.service} - {item.mileage} km
              </Text>
            </Link>
            {item.image && (
              <Image source={{ uri: item.image }} style={styles.recordImage} />
            )}
            <View style={styles.buttonRow}>
              <View style={styles.buttonContainer}>
                <Button
                  title="Edit"
                  onPress={() => {
                    // When editing, populate the form with the current values
                    setEditId(item.id);
                    setImageUri(item.image);
                    
                    // Find the Formik form's setValues function
                    const formikBag = formikRef.current;
                    if (formikBag) {
                      formikBag.setValues({
                        service: item.service,
                        mileage: item.mileage.toString()
                      });
                    }
                  }}
                />
              </View>
              <View style={styles.buttonContainer}>
                <Button 
                  title="Delete" 
                  color="red" 
                  onPress={() => {
                    Alert.alert(
                      "Confirm Delete",
                      "Are you sure you want to delete this record?",
                      [
                        { text: "Cancel", style: "cancel" },
                        { text: "Delete", onPress: () => deleteRecord(item.id), style: "destructive" }
                      ]
                    );
                  }} 
                />
              </View>
            </View>
          </View>
        )}
      />
      
      <View style={styles.logoutContainer}>
        <Button 
          title="Sign Out" 
          color="#FF6347" 
          onPress={() => {
            auth.signOut().then(() => {
              router.push('/signin');
            }).catch(error => {
              console.error('Error signing out:', error);
            });
          }} 
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    padding: 20, 
    backgroundColor: '#F0F4F8' 
  },
  centered: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: { 
    fontSize: 22, 
    fontWeight: 'bold', 
    marginBottom: 5, 
    textAlign: 'center' 
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 15,
    textAlign: 'center',
  },
  formContainer: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 8,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
    position: 'relative', // For loading overlay
  },
  formTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 15,
    color: '#333',
  },
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
    fontSize: 12,
  },
  formButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  record: {
    backgroundColor: '#fff',
    padding: 15,
    marginBottom: 15,
    borderRadius: 8,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  recordTitle: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 8,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  buttonContainer: {
    flex: 1,
    marginHorizontal: 5,
  },
  imageContainer: {
    marginVertical: 10,
    alignItems: 'center',
  },
  image: {
    width: 120,
    height: 120,
    borderRadius: 10,
    marginBottom: 10,
  },
  recordImage: {
    width: 120,
    height: 120,
    borderRadius: 10,
    marginVertical: 10,
    alignSelf: 'center',
  },
  logoutContainer: {
    marginTop: 10,
    marginBottom: 20,
  },
  loadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
  },
  loadingText: {
    marginTop: 10,
    color: '#333',
  }
});