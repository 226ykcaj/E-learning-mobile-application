import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Keyboard, SafeAreaView } from "react-native";
import { db, firebase_auth } from "../../config";
import DatePicker from "react-native-modern-datepicker";
import { useNavigation } from "@react-navigation/native";
import Modal from "react-native-modal"; // Importing Modal for success and failure messages
import { styles } from "../../Styles";
import TimePicker from 'react-native-date-picker'; // Importing DatePicker for time
import { collection, addDoc, serverTimestamp } from "firebase/firestore"; // Import Firestore

const CreateTask = () => {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [date, setDate] = useState("");
    const [time, setTime] = useState(new Date()); // Set initial time to current time
    const [showTimePicker, setShowTimePicker] = useState(false);
    const [successModalVisible, setSuccessModalVisible] = useState(false);
    const [failModalVisible, setFailModalVisible] = useState(false);
    const navigation = useNavigation();
    const currentUser = firebase_auth.currentUser;

    // This function will save the task along with the selected time
    const addTodo = async () => {
        if (title.trim().length === 0) {
            setFailModalVisible(true); // Show failure modal if title is empty
            return;
        }
    
        if (!date) {
            setFailModalVisible(true); // Show failure modal if date is not selected
            return;
        }
    
        // Ensure that `time` is a Date object before formatting it
        if (!(time instanceof Date)) {
            setFailModalVisible(true); // Show failure modal if time is not valid
            return;
        }
    
        // Format the selected time to be in Malaysia Time (Asia/Kuala_Lumpur)
        const selectedTime = time.toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
            timeZone: 'Asia/Kuala_Lumpur',
            hour12: true,
        });
    
        const data = {
            title: title.trim(),
            description: description.trim() || "",
            date: date || "",
            time: selectedTime, // Save the selected time in the correct format
            createdAt: serverTimestamp(),
            userID: currentUser.uid // Link the task to the user by their userID
        };
    
        try {
            await addDoc(collection(db, "todos"), data); // Add the task to the todos collection
            setTitle("");
            setDescription("");
            setDate("");
            setTime(new Date()); // Reset time to the current time
            Keyboard.dismiss();
            setSuccessModalVisible(true); // Show success modal
        } catch (error) {
            console.error("Error adding document: ", error);
            setFailModalVisible(true); // Show failure modal on error
        }
    };
    

    const closeSuccessModal = () => {
        setSuccessModalVisible(false);
        navigation.goBack(); // Navigate back after closing the success modal
    };

    const closeFailModal = () => {
        setFailModalVisible(false);
    };

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor:"#252525" }}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Text style={styles.cancelButton}>Cancel</Text>
                </TouchableOpacity>
                <Text style={styles.headerTitle}>New Task</Text>
                <TouchableOpacity onPress={addTodo}>
                    <Text style={styles.doneButton}>Done</Text>
                </TouchableOpacity>
            </View>

            <View style={styles.container}>
                <View style={styles.inputContainer}>
                    <Text style={styles.label}>Task Title</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Task Title"
                        placeholderTextColor="#888"
                        onChangeText={setTitle}
                        value={title}
                        underlineColorAndroid="transparent"
                        autoCapitalize="none"
                    />
                </View>

                <View style={styles.inputContainer}>
                    <Text style={styles.label}>Task Description</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Task Description"
                        placeholderTextColor="#888"
                        onChangeText={setDescription}
                        value={description}
                        underlineColorAndroid="transparent"
                        autoCapitalize="none"
                    />
                </View>

                {/* Date Picker */}
                <View style={styles.datePickerWrapper}>
                    <DatePicker
                        mode="calendar"
                        selected={date}
                        minimumDate={new Date().toISOString().split('T')[0]} // Block past dates
                        onSelectedChange={(selectedDate) => setDate(selectedDate)}
                        options={{
                            backgroundColor: "#333",
                            textHeaderColor: "#FFFFFF",
                            textDefaultColor: "#FFFFFF",
                            selectedTextColor: "#FFFFFF",
                            mainColor: "#98C1D9",
                            textSecondaryColor: "#a9a9a9",
                            borderColor: "rgba(122,146,165,0.1)",
                        }}
                    />
                </View>

                {/* Time Picker */}
                <View style={styles.inputContainer}>
                    <Text style={styles.label}>Task Time</Text>
                    <TouchableOpacity onPress={() => setShowTimePicker(true)} style={styles.input}>
                        <Text style={{ color: '#FFFFFF' }}>
                            {time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' , hour12: true})}
                        </Text>
                    </TouchableOpacity>
                    <TimePicker
                        modal
                        open={showTimePicker}
                        date={time} // Pass the currently selected time to the TimePicker
                        mode="time"
                        onConfirm={(selectedTime) => {
                            setShowTimePicker(false);
                            setTime(selectedTime); // Update the time state with the selected time
                        }}
                        onCancel={() => {
                            setShowTimePicker(false);
                        }}
                        theme="dark"  // Setting theme to dark for consistency
                        style={{ backgroundColor: '#333' }} // Dark background color
                        textColor="#FFFFFF" // White text color for better contrast
                    />
                </View>
            </View>

            {/* Success Modal */}
            <Modal isVisible={successModalVisible} onBackdropPress={closeSuccessModal}>
                <View style={styles.modalContent}>
                    <Text style={styles.modalTitle}>Success</Text>
                    <Text style={styles.modalMessage}>Your task has been added successfully!</Text>
                    <TouchableOpacity onPress={closeSuccessModal} style={styles.modalButton}>
                        <Text style={styles.modalButtonText}>OK</Text>
                    </TouchableOpacity>
                </View>
            </Modal>

            {/* Fail Modal */}
            <Modal isVisible={failModalVisible} onBackdropPress={closeFailModal}>
                <View style={styles.modalContent}>
                    <Text style={styles.modalTitle}>Failed</Text>
                    <Text style={styles.modalMessage}>Failed to add the task. Please try again!</Text>
                    <TouchableOpacity onPress={closeFailModal} style={styles.modalButton}>
                        <Text style={styles.modalButtonText}>OK</Text>
                    </TouchableOpacity>
                </View>
            </Modal>
        </SafeAreaView>
    );
};

export default CreateTask;
