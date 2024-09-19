import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, ScrollView, Image, Modal, StyleSheet, TextInput } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import * as ImagePicker from "react-native-image-picker";
import DatePicker, { getFormatedDate } from "react-native-modern-datepicker";
import { firebase_auth, db, storage } from '../config'; 
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

import { styles } from "../Styles";

const Profile = ({ navigation }: any) => {
    const [selectedImage, setSelectedImage] = useState("");
    const [name, setName] = useState("");
    const [phone, setPhone] = useState("");
    const [email, setEmail] = useState("");
    const [successModalVisible, setSuccessModalVisible] = useState(false);
    const [failModalVisible, setFailModalVisible] = useState(false);

    const [openStartDatePicker, setOpenStartDatePicker] = useState(false);
    const today = new Date();
    const startDate = getFormatedDate(
        today.setDate(today.getDate()),
        "YYYY/MM/DD"
    );
    const [selectedStartDate, setSelectedStartDate] = useState("");
    const [startedDate, setStartedDate] = useState("");

    const handleChangeStartDate = (propDate) => {
        setStartedDate(propDate);
    };

    const handleOnChangeStartDate = () => {
        setOpenStartDatePicker(!openStartDatePicker);
    };

    // Fetch user data from Firestore
    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const uid = firebase_auth.currentUser?.uid;
                if (uid) {
                    const userDocRef = doc(db, "users", uid);
                    const userDoc = await getDoc(userDocRef);
                    if (userDoc.exists()) {
                        const userData = userDoc.data();
                        setName(userData.name );
                        setPhone(userData.phone );
                        setEmail(userData.email );
                        setSelectedImage(userData.img ); // Load the URL from Firestore
                        setSelectedStartDate(userData.dob );
                    }
                }
            } catch (error) {
                console.error("Error fetching user data:", error);
            }
        };

        fetchUserData();
    }, []);

    // Function to upload image to Firebase Storage
    const uploadImageToFirebase = async (imageUri) => {
        try {
          const uid = firebase_auth.currentUser?.uid;
          if (uid) {
            // Create a reference to the file you want to upload
            const storageRef = ref(storage, `users/${uid}/profile.jpg`);
      
            // Convert the image to a blob
            const response = await fetch(imageUri);
            const blob = await response.blob();
      
            // Upload the image to Firebase Storage
            const snapshot = await uploadBytes(storageRef, blob);
      
            // Get the download URL of the uploaded file
            const downloadURL = await getDownloadURL(snapshot.ref);
            console.log("Download URL:", downloadURL);
            return downloadURL; // Return the download URL
          }
        } catch (error) {
          console.error("Error uploading image to Firebase Storage:", error);
          return null;
        }
      };

    // Handle image selection and upload to Firebase Storage
    const handleImageSelection = () => {
        ImagePicker.launchImageLibrary(
            {
                mediaType: 'photo',
                includeBase64: false,
                maxHeight: 200,
                maxWidth: 200,
            },
            async (response) => {
                if (response.didCancel) {
                    console.log('User cancelled image picker');
                } else if (response.error) {
                    console.log('ImagePicker Error: ', response.error);
                } else {
                    const imageUri = response.assets[0].uri;
                    setSelectedImage(imageUri);
                    console.log("local: ", imageUri);
                    // Upload image to Firebase Storage and get the public URL
                    const imageUrl = await uploadImageToFirebase(imageUri);
                    if (imageUrl) {
                        setSelectedImage(imageUrl); // Set the URL of the uploaded image
                    }
                }
            }
        );
    };

    const handleSave = async () => {
        if (name.trim() === '' || phone.trim() === '' || email.trim() === '') {
            setFailModalVisible(true);
            return;
        }
    
        try {
            const uid = firebase_auth.currentUser?.uid;
            if (uid) {
                const userDocRef = doc(db, "users", uid);
    
                let imageUrl = selectedImage;
    
                // Check if the selected image is a local URI (starting with "file://")
                if (selectedImage && selectedImage.startsWith("file://")) {
                    // Upload the image to Firebase Storage
                    imageUrl = await uploadImageToFirebase(selectedImage);
                    if (!imageUrl) {
                        throw new Error("Image upload failed.");
                    }
                }
    
                // Now save the correct imageUrl to Firestore
                await updateDoc(userDocRef, {
                    name: name.trim() || null, // Keep the previous value if empty
                    phone: phone.trim() || null,
                    email: email.trim() || null,
                    img: imageUrl || null, // Save the correct image URL
                    dob: selectedStartDate || null, // Update Date of Birth
                });
    
                setSuccessModalVisible(true);
            }
        } catch (error) {
            console.error("Error updating user profile:", error);
            setFailModalVisible(true);
        }
    };
    

    const closeSuccessModal = () => {
        setSuccessModalVisible(false);
        navigation.goBack();
    };

    const closeFailModal = () => {
        setFailModalVisible(false);
    };

    function renderDatePicker() {
        return (
            <Modal
                animationType="slide"
                transparent={true}
                visible={openStartDatePicker}
            >
                <View style={styles.overlay} />
                <View style={styles.datePickerModal}>
                    <View style={styles.datePickerContainer}>
                        <DatePicker
                            mode="calendar"
                            selected={startedDate}
                            onDateChanged={handleChangeStartDate}
                            onSelectedChange={date => setSelectedStartDate(date)}
                            options={{
                                backgroundColor: "#333",
                                textHeaderColor: "#ffffff", 
                                textDefaultColor: "#ffffff",
                                selectedTextColor: "#ffffff", 
                                mainColor: "#98C1D9",
                                textSecondaryColor: "#a9a9a9", 
                                borderColor: "rgba(122,146,165,0.1)",
                                borderRadius: 5,
                            }}
                        />

                        <TouchableOpacity onPress={handleOnChangeStartDate} style={styles.longButtonStyle}>
                            <Text style={styles.buttonText}>Close</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        );
    }

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <MaterialIcons name="arrow-back" size={24} color="white" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Profile</Text>
                <TouchableOpacity onPress={handleSave}>
                        <Text style={styles.doneButton}>Save</Text>
                    </TouchableOpacity>
            </View>

            <ScrollView style={styles.container}>
                <View style={styles.imageContainer}>
                    <TouchableOpacity onPress={handleImageSelection}>
                        <Image source={{ uri: selectedImage }} style={styles.imageStyle} />
                        <View style={styles.imageIconContainer}>
                            <MaterialIcons name="photo-camera" size={32} color="white" />
                        </View>
                    </TouchableOpacity>
                </View>

                <View>
                    <View style={styles.inputContainer}>
                        <Text style={styles.label}>Name</Text>
                        <TextInput
                            value={name}
                            onChangeText={value => setName(value)}
                            editable={true}
                            style={styles.input}
                        />
                    </View>

                    <View style={styles.inputContainer}>
                        <Text style={styles.label}>Phone</Text>
                        <TextInput
                            value={phone}
                            onChangeText={value => setPhone(value)}
                            editable={true}
                            style={styles.input}
                        />
                    </View>

                    <View style={styles.inputContainer}>
                        <Text style={styles.label}>Email</Text>
                        <TextInput
                            value={email}
                            onChangeText={value => setEmail(value)}
                            editable={true}
                            style={styles.input}
                        />
                    </View>

                    <View style={styles.inputContainer}>
                        <Text style={styles.label}>Date of Birth</Text>
                        <TouchableOpacity onPress={handleOnChangeStartDate}>
                            <Text style={styles.input}>{selectedStartDate}</Text>
                        </TouchableOpacity>
                    </View>

                </View>
                {renderDatePicker()}

                {/* Success Modal */}
                <Modal
                    visible={successModalVisible}
                    transparent={true}
                    animationType="slide"
                    onRequestClose={closeSuccessModal}
                >
                    <View style={styles.overlay} />
                    <View style={styles.datePickerModal}>
                        <View style={styles.modalContent}>
                            <Text style={styles.modalTitle}>Success</Text>
                            <Text style={styles.modalMessage}>Your profile has been updated successfully!</Text>
                            <TouchableOpacity onPress={closeSuccessModal} style={styles.modalButton}>
                                <Text style={styles.modalButtonText}>OK</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </Modal>

                {/* Fail Modal */}
                <Modal
                    visible={failModalVisible}
                    transparent={true}
                    animationType="slide"
                    onRequestClose={closeFailModal}
                >
                    <View style={styles.overlay} />
                    <View style={styles.datePickerModal}>
                        <View style={styles.modalContent}>
                            <Text style={styles.modalTitle}>Error</Text>
                            <Text style={styles.modalMessage}>Fail to update profile. Please input all the field.</Text>
                            <TouchableOpacity onPress={closeFailModal} style={styles.modalButton}>
                                <Text style={styles.modalButtonText}>OK</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </Modal>
            </ScrollView>
        </SafeAreaView>
    );
};

export default Profile;
