import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, SafeAreaView } from 'react-native';
import { styles } from '../../Styles';
import Modal from 'react-native-modal';
import { firebase_auth, db } from '../../config'; // Ensure your Firestore config is imported
import { doc, getDoc, addDoc, collection, Timestamp } from 'firebase/firestore';

const AddDiscussionScreen = ({ navigation, route }: any) => {
  const { courseId } = route.params; // Get courseId from route parameters
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [SuccessModalVisible, setSuccessModalVisible] = useState(false);
  const [FailModalVisible, setFailModalVisible] = useState(false);
  const [currentUserData, setCurrentUserData] = useState({ name: '', img: '' });

  // Fetch the current user's data from Firestore
  useEffect(() => {
    const fetchUserData = async () => {
      const uid = firebase_auth.currentUser?.uid; // Get the current user's uid
      if (uid) {
        try {
          const userDocRef = doc(db, "users", uid);
          const userDoc = await getDoc(userDocRef);
          if (userDoc.exists()) {
            const userData = userDoc.data();
            setCurrentUserData({
              name: userData?.name || '',
              img: userData?.img || '', // Assuming user image is saved as `img` in Firestore
            });
          }
        } catch (error) {
          console.error("Error fetching user data: ", error);
        }
      }
    };
    fetchUserData();
  }, []);

  // Handle save discussion
const handleSave = async () => {
  if (title.trim() === '' || description.trim() === '') {
    setFailModalVisible(true);
    return;
  } else {
    const uid = firebase_auth.currentUser?.uid; // Get current user ID
    const discussionData = {
      title: title,
      description: description,
      courseId: courseId, // Attach the courseId to the discussion
      authorUid: uid, // Save only the user's uid
      createdAt: Timestamp.now(), // Save as Firestore Timestamp
    };

    try {
      // Add the discussion to the "discussions" collection in Firestore
      const discussionsCollectionRef = collection(db, "discussions");
      await addDoc(discussionsCollectionRef, discussionData);
      setSuccessModalVisible(true); // Show success modal after successful save
    } catch (error) {
      console.error("Error saving discussion: ", error);
      setFailModalVisible(true); // Show failure modal on error
    }
  }
};


  const closeSuccessModal = () => {
    setSuccessModalVisible(false);
    navigation.goBack(); // Navigate back after successful save
  };

  const closeFailModal = () => {
    setFailModalVisible(false);
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.cancelButton}>Cancel</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>New Discussion</Text>
        <TouchableOpacity onPress={handleSave}>
          <Text style={styles.doneButton}>Done</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.container}>
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Title</Text>
          <TextInput
            style={styles.input}
            placeholder="Add Title"
            placeholderTextColor="#888"
            value={title}
            onChangeText={setTitle}
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Description</Text>
          <TextInput
            style={styles.input}
            placeholder="Add description"
            placeholderTextColor="#888"
            value={description}
            onChangeText={setDescription}
            multiline
          />
        </View>

        {/* Success Modal */}
        <Modal isVisible={SuccessModalVisible} onBackdropPress={closeSuccessModal}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Success</Text>
            <Text style={styles.modalMessage}>Your discussion has been posted successfully!</Text>
            <TouchableOpacity onPress={closeSuccessModal} style={styles.modalButton}>
              <Text style={styles.modalButtonText}>OK</Text>
            </TouchableOpacity>
          </View>
        </Modal>

        {/* Fail Modal */}
        <Modal isVisible={FailModalVisible} onBackdropPress={closeFailModal}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Failed</Text>
            <Text style={styles.modalMessage}>Failed to post your discussion. Please try again!</Text>
            <TouchableOpacity onPress={closeFailModal} style={styles.modalButton}>
              <Text style={styles.modalButtonText}>OK</Text>
            </TouchableOpacity>
          </View>
        </Modal>
      </ScrollView>
    </SafeAreaView>
  );
};

export default AddDiscussionScreen;
