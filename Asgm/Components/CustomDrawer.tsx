import React, { useEffect, useState } from "react";
import { View, Text, Image, TouchableOpacity, StyleSheet } from "react-native";
import { DrawerItemList } from "@react-navigation/drawer";
import Ionicons from 'react-native-vector-icons/Ionicons'; 
import Modal from 'react-native-modal';
import { styles } from '../Styles';
import { firebase_auth,db } from '../config';
import { doc, onSnapshot } from 'firebase/firestore';

const CustomDrawer = (props: any) => {
    const [logoutModalVisible, setLogoutModalVisible] = useState(false);
    const navigation = props.navigation;
    const [userData, setUserData] = useState({ name: '', email: '', img: '' }); // Store user data
    const [loading, setLoading] = useState(true); // Track loading state

    useEffect(() => {
        const unsubscribe = () => {
            const uid = firebase_auth.currentUser?.uid; // Get current user's UID
            if (uid) {
                const userDocRef = doc(db, "users", uid); // Reference to the user document
                
                // Use onSnapshot to listen to real-time updates
                return onSnapshot(userDocRef, (userDoc) => {
                    if (userDoc.exists()) {
                        const userData = userDoc.data();
                        setUserData({
                            name: userData.name,
                            email: userData.email,
                            img: userData.img,
                        });
                    } else {
                        console.error("User document does not exist");
                    }
                    setLoading(false);
                }, (error) => {
                    console.error("Error fetching user data: ", error);
                    setLoading(false);
                });
            } else {
                setLoading(false); // Set loading false if no user is authenticated
            }
        };
    
        const unsubscribeFromSnapshot = unsubscribe(); // Start listening when the component mounts
    
        return () => unsubscribeFromSnapshot(); // Cleanup the listener when the component unmounts
    }, []);
    
    
    const handleLogout = () => {
        setLogoutModalVisible(true); // Show the logout confirmation modal
    };

    const confirmLogout = () => {
        setLogoutModalVisible(false);
        try{
            firebase_auth.signOut().then(() => {
                navigation.navigate("AuthStack", { screen: "OnBoardingScreen" });
              });
              

        }catch(e){
            console.error(e.message);
        }
    };

    const cancelLogout = () => {
        setLogoutModalVisible(false);
    };

    return (
        <View style={{ flex: 1, zIndex: 100 }}>
            {/* Drawer Header */}
            <View style={styles.drawerHeader}>
                <Image
                    source={{ uri: userData.img }}
                    style={styles.HomeProfileImage}
                />
                <Text style={styles.userName}>{userData.name}</Text>
                <Text style={styles.userEmail}>{userData.email}</Text>
            </View>
            {/* Drawer Items */}
            <View style={styles.drawerItems}>
                <DrawerItemList {...props} />
            </View>
            {/* Footer */}
            <View style={styles.footer}>
                <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
                    <Ionicons name="exit-outline" size={20} color="#999999" style={styles.logoutIcon} />
                    <Text style={styles.logoutButtonText}>Logout</Text>
                </TouchableOpacity>
                <Text style={styles.footerText}>UAcademia V1.0</Text>
            </View>

            {/* Logout Confirmation Modal */}
            <Modal isVisible={logoutModalVisible} onBackdropPress={cancelLogout}>
                <View style={internalStyles.modalContent}>
                    <Text style={internalStyles.modalTitle}>Confirm Logout</Text>
                    <Text style={internalStyles.modalMessage}>Are you sure you want to logout?</Text>
                    <View style={internalStyles.modalButtonRow}>
                        <TouchableOpacity onPress={confirmLogout} style={internalStyles.modalButton}>
                            <Text style={internalStyles.modalButtonText}>Yes</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={cancelLogout} style={internalStyles.modalButton}>
                            <Text style={internalStyles.modalButtonText}>No</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </View>
    );
};

export default CustomDrawer;

// Internal styles for the modal
const internalStyles = StyleSheet.create({
    modalContent: {
        backgroundColor: '#333',
        padding: 20,
        borderRadius: 10,
        alignItems: 'center',
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#FFFFFF',
        marginBottom: 10,
    },
    modalMessage: {
        fontSize: 16,
        color: '#FFFFFF',
        marginBottom: 20,
        textAlign: 'center',
    },
    modalButtonRow: {
        flexDirection: 'row',
        justifyContent: 'space-between', 
        width: '100%',
    },
    modalButton: {
        backgroundColor: '#98C1D9',
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 5,
        marginHorizontal: 5, 
        flex: 1, 
        alignItems: 'center',
    },
    modalButtonText: {
        color: '#293241',
        fontSize: 16,
        fontWeight: 'bold',
    },
});
