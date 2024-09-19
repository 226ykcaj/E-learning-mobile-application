import React, { useState, useEffect } from "react";
import { View, Text, FlatList, TouchableOpacity, Pressable } from "react-native";
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useNavigation } from "@react-navigation/native";
import { FloatingAction } from "react-native-floating-action";
import Modal from 'react-native-modal';
import { SafeAreaView } from "react-native-safe-area-context";
import io from "socket.io-client"; // Import socket.io-client
import { styles } from "../../Styles";
import { collection, doc, deleteDoc } from "@firebase/firestore"; // Import deleteDoc here
import { firebase_auth, db } from "../../config";
import { listenToTask } from "../../Database/dataUtils";

const TaskScreen = () => {
    const [todos, setTodos] = useState([]);
    const [sortOption, setSortOption] = useState("dateDesc");
    const [deleteModalVisible, setDeleteModalVisible] = useState(false);
    const [reminderModalVisible, setReminderModalVisible] = useState(false); // New state for reminder modal
    const [reminderData, setReminderData] = useState({ title: '', description: '', date: '', time: '' }); // State to hold reminder data
    
    const navigation = useNavigation();
    const [loading, setLoading] = useState(true);
    const [empty, setEmpty] = useState(true);

    useEffect(() => {
        // Initialize socket connection
        const socket = io("http://192.168.0.13:3000"); // Replace with your server URL

        // Listen for upcoming task notifications
        socket.on("upcomingTask", (data) => {
            setReminderData(data);
            setReminderModalVisible(true);
        });

        // Fetch todos and set loading/empty state
        const unsubscribe = listenToTask((todoList) => {
            setLoading(false); // Data fetching is done

            if (todoList.length === 0) {
                setEmpty(true);  // If no todos found, set empty to true
            } else {
                setEmpty(false); // Data exists
                setTodos(todoList); // Set the fetched todos
            }
        });

        // Cleanup function to close the socket connection and unsubscribe from Firestore listener
        return () => {
            socket.disconnect();
            unsubscribe();
        };
    }, []);

    const sortTodos = (todos) => {
        if (sortOption.includes("date")) {
            todos.sort((a, b) => {
                // Combine both date and time into a single comparison string for sorting
                const dateTimeA = `${a.date} ${a.time}`;
                const dateTimeB = `${b.date} ${b.time}`;
                
                return sortOption === "dateAsc" ? dateTimeA.localeCompare(dateTimeB) : dateTimeB.localeCompare(dateTimeA);
            });
        } else if (sortOption.includes("title")) {
            todos.sort((a, b) => (sortOption === "titleAsc" ? a.title.localeCompare(b.title) : b.title.localeCompare(a.title)));
        } else if (sortOption.includes("description")) {
            todos.sort((a, b) => (sortOption === "descriptionAsc" ? a.description.localeCompare(b.description) : b.description.localeCompare(a.description)));
        }
        return todos;
    };

    const deleteTodo = async (todo) => {
        try {
            await deleteDoc(doc(db, "todos", todo.id)); // Correct way to delete document
            // Filter out the deleted task from the local state
            setTodos((prevTodos) => prevTodos.filter((item) => item.id !== todo.id));
            setDeleteModalVisible(true); // Show the delete confirmation modal
        } catch (error) {
            console.log(error);
        }
    };

    const closeDeleteModal = () => {
        setDeleteModalVisible(false);
    };

    const closeReminderModal = () => { // Function to close the reminder modal
        setReminderModalVisible(false);
    };

    const actions = [
        {
            text: "Sort by Date Asc",
            name: "dateAsc",
            icon: <Ionicons name="calendar-outline" size={20} color="#000000" />,
            color: "#98C1D9",
            textColor: "#000000",
            textBackground: "#FFFFFF",
            position: 1
        },
        {
            text: "Sort by Date Desc",
            name: "dateDesc",
            icon: <Ionicons name="calendar-outline" size={20} color="#000000" />,
            color: "#98C1D9",
            textColor: "#000000",
            position: 2
        },
        {
            text: "Sort by Title Asc",
            name: "titleAsc",
            icon: <Ionicons name="text-outline" size={20} color="#000000" />,
            color: "#98C1D9",
            textColor: "#000000",
            position: 3
        },
        {
            text: "Sort by Title Desc",
            name: "titleDesc",
            icon: <Ionicons name="text-outline" size={20} color="#000000" />,
            color: "#98C1D9",
            textColor: "#000000",
            position: 4
        },
        {
            text: "Sort by Description Asc",
            name: "descriptionAsc",
            icon: <Ionicons name="document-text-outline" size={20} color="#000000" />,
            color: "#98C1D9",
            textColor: "#000000",
            position: 5
        },
        {
            text: "Sort by Description Desc",
            name: "descriptionDesc",
            icon: <Ionicons name="document-text-outline" size={20} color="#000000" />,
            color: "#98C1D9",
            textColor: "#000000",
            position: 6
        }
    ];

    return (
        <SafeAreaView style={{flex:1}}>
            <View style={styles.container}>
                <View style={{paddingTop: 10}}>
                    <TouchableOpacity style={styles.button} onPress={() => navigation.navigate("CreateTask")}>
                        <Text style={styles.buttonText}>Create Task</Text>
                    </TouchableOpacity>
                </View>
                
                {/* If empty, show message, else show the task list */}
                {empty ? (
                    <View style={styles.nothingContainer}>
                        <Text style={styles.nothingText}>
                            No to-do list yet, let's build one!
                        </Text>
                    </View>
                ) : (
                    <FlatList
                        data={sortTodos([...todos])}
                        keyExtractor={(item) => item.id}
                        renderItem={({ item }) => (
                            <View>
                                <Text style={styles.dateHeading}>
                                    {item.date} {item.time}
                                </Text>
                                <Pressable
                                    style={styles.todoContainer}
                                    onPress={() => navigation.navigate("TaskScreenDetails", { item })}
                                >
                                    <Ionicons
                                        name="trash-outline"
                                        color="#e63946"
                                        onPress={() => deleteTodo(item)}
                                        style={styles.todoIcon}
                                    />
                                    <View style={styles.innerContainer}>
                                        <Text style={styles.itemHeading}>
                                            {item.title}
                                        </Text>
                                        <Text style={styles.itemDescription}>{item.description}</Text>
                                    </View>
                                </Pressable>
                            </View>
                        )}
                    />
                )}
                
                <FloatingAction
                    actions={actions}
                    color="#98C1D9" 
                    overlayColor="rgba(37, 37, 37, 0.8)"
                    floatingIcon={<Ionicons name="filter" size={25} color="#000000" />}
                    onPressItem={name => {
                        setSortOption(name);
                    }}
                />

                {/* Modal for delete success */}
                <Modal isVisible={deleteModalVisible} onBackdropPress={closeDeleteModal}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>Deleted</Text>
                        <Text style={styles.modalMessage}>Todo deleted successfully!</Text>
                        <TouchableOpacity onPress={closeDeleteModal} style={styles.modalButton}>
                            <Text style={styles.modalButtonText}>OK</Text>
                        </TouchableOpacity>
                    </View>
                </Modal>

                {/* Modal for upcoming task reminder */}
                <Modal isVisible={reminderModalVisible} onBackdropPress={closeReminderModal}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>Upcoming Task Reminder</Text>
                        <Text style={styles.modalMessage}>
                            Task: {reminderData.title}
                            {'\n'}Description: {reminderData.description}
                            {'\n'}Date: {reminderData.date}
                            {'\n'}Time: {reminderData.time}
                        </Text>
                        <TouchableOpacity onPress={closeReminderModal} style={styles.modalButton}>
                            <Text style={styles.modalButtonText}>OK</Text>
                        </TouchableOpacity>
                    </View>
                </Modal>
            </View>
        </SafeAreaView>
    );
};

export default TaskScreen;
