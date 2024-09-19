import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity } from "react-native";
import Ionicons from 'react-native-vector-icons/Ionicons';
import { db } from "../../config";
import { useNavigation } from "@react-navigation/native";
import DatePicker from 'react-native-modern-datepicker';
import { SafeAreaView } from "react-native-safe-area-context";
import Modal from "react-native-modal";
import TimePicker from 'react-native-date-picker';
import { styles } from "../../Styles";
import { collection, doc, updateDoc } from '@firebase/firestore';

const TaskScreenDetails = ({ route }) => {
    const todoRef = collection(db, "todos");
    const [textHeading, onChangeHeadingText] = useState(route.params.item.title);
    const [description, onChangeDescription] = useState(route.params.item.description || "");
    const [date, onChangeDate] = useState(route.params.item.date || "");
    const [time, setTime] = useState(() => {
        if (route.params.item.time) {
            const [hours, minutes] = route.params.item.time.split(":");
            const tempDate = new Date();
            const isPM = route.params.item.time.includes("PM");
            let adjustedHours = parseInt(hours, 10);

            // Adjust hours based on AM/PM
            if (isPM && adjustedHours < 12) {
                adjustedHours += 12;
            } else if (!isPM && adjustedHours === 12) {
                adjustedHours = 0;
            }

            tempDate.setHours(adjustedHours, parseInt(minutes, 10), 0, 0);
            return tempDate;
        }
        return new Date();
    });

    const [showTimePicker, setShowTimePicker] = useState(false);
    const navigation = useNavigation();
    const [SuccessModalVisible, setSuccessModalVisible] = useState(false);
    const [FailModalVisible, setFailModalVisible] = useState(false);

    // Function to format time in 12-hour format with AM/PM
    const formatTime12Hour = (time) => {
        return time.toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit',
            hour12: true,
        });
    };

    const updateTodo = async () => {
        if (textHeading && textHeading.length > 0) {
            const todoDocRef = doc(db, "todos", route.params.item.id);
            try {
                await updateDoc(todoDocRef, {
                    title: textHeading,
                    description: description,
                    date: date,
                    time: formatTime12Hour(time) // Save the formatted time in 12-hour format with AM/PM
                });
                setSuccessModalVisible(true);
            } catch (error) {
                console.log(error);
                setFailModalVisible(true);
            }
        } else {
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

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: "#252525" }}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Text style={styles.cancelButton}>Cancel</Text>
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Edit Task</Text>
                <TouchableOpacity onPress={updateTodo}>
                    <Text style={styles.doneButton}>Done</Text>
                </TouchableOpacity>
            </View>

            <View style={styles.container}>
                <View style={styles.inputContainer}>
                    <Text style={styles.label}>Task Title</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Update Title"
                        placeholderTextColor="#888"
                        onChangeText={onChangeHeadingText}
                        value={textHeading}
                        underlineColorAndroid="transparent"
                        autoCapitalize="none"
                    />
                </View>

                <View style={styles.inputContainer}>
                    <Text style={styles.label}>Task Description</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Update Task Description"
                        placeholderTextColor="#888"
                        onChangeText={onChangeDescription}
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
                        minimumDate={new Date().toISOString().split('T')[0]} 
                        onDateChange={onChangeDate}
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
                            {formatTime12Hour(time)} {/* Display time in 12-hour format */}
                        </Text>
                    </TouchableOpacity>
                    <TimePicker
                        modal
                        open={showTimePicker}
                        date={time}
                        mode="time"
                        onConfirm={(selectedTime) => {
                            setShowTimePicker(false);
                            setTime(selectedTime);
                        }}
                        onCancel={() => {
                            setShowTimePicker(false);
                        }}
                        theme="dark"
                        style={{ backgroundColor: '#333' }}
                        textColor="#FFFFFF"
                    />
                </View>
            </View>

            {/* Success Modal */}
            <Modal isVisible={SuccessModalVisible} onBackdropPress={closeSuccessModal}>
                <View style={styles.modalContent}>
                    <Text style={styles.modalTitle}>Success</Text>
                    <Text style={styles.modalMessage}>Your task has been updated successfully!</Text>
                    <TouchableOpacity onPress={closeSuccessModal} style={styles.modalButton}>
                        <Text style={styles.modalButtonText}>OK</Text>
                    </TouchableOpacity>
                </View>
            </Modal>

            {/* Fail Modal */}
            <Modal isVisible={FailModalVisible} onBackdropPress={closeFailModal}>
                <View style={styles.modalContent}>
                    <Text style={styles.modalTitle}>Failed</Text>
                    <Text style={styles.modalMessage}>Failed to update the task. Please try again!</Text>
                    <TouchableOpacity onPress={closeFailModal} style={styles.modalButton}>
                        <Text style={styles.modalButtonText}>OK</Text>
                    </TouchableOpacity>
                </View>
            </Modal>
        </SafeAreaView>
    );
};

export default TaskScreenDetails;
