import Ionicons from "react-native-vector-icons/Ionicons";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, FlatList, SafeAreaView } from 'react-native';
import { firebase_auth, db } from '../../config'; // Import Firebase config
import { collection, query, where, onSnapshot } from 'firebase/firestore'; // Firestore functions
import { styles } from '../../Styles';

// Function to format the Firestore Timestamp
const formatDateTime = (timestamp) => {
  if (!timestamp || !timestamp.toDate) return 'Unknown'; // Handle missing or invalid timestamp
  const date = timestamp.toDate(); // Convert Firestore Timestamp to JS Date
  return new Intl.DateTimeFormat('en-US', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    hour12: true,
  }).format(date);
};


const DiscussionScreen = ({ navigation, route }: any) => {
  const [discussions, setDiscussions] = useState([]); // State to store discussions
  const [loading, setLoading] = useState(true); // State for loading
  const { courseId } = route.params; // Assuming you pass the courseId as a parameter

  const fetchDiscussions = () => {
    try {
      const discussionsCollectionRef = collection(db, 'discussions');
      const q = query(discussionsCollectionRef, where('courseId', '==', courseId)); // Filter by courseId
  
      // Set up real-time listener
      const unsubscribe = onSnapshot(
        q, 
        (snapshot) => {
          try {
            const discussionsList = snapshot.docs.map((doc) => ({
              id: doc.id,
              ...doc.data(),
            }));
            setDiscussions(discussionsList);
            setLoading(false);
          } catch (error) {
            console.error('Error processing snapshot data:', error);
            setLoading(false);
          }
        },
        (error) => {
          console.error('Snapshot listener error:', error);
          setLoading(false);
        }
      );
  
      // Clean up the listener on unmount
      return unsubscribe;
    } catch (error) {
      console.error('Error fetching discussions:', error);
      setLoading(false);
    }
  };
  

  // Fetch discussions on component mount and set up real-time listener
  useEffect(() => {
    const unsubscribe = fetchDiscussions();
    return () => unsubscribe && unsubscribe(); // Clean up listener
  }, []);

  // Render each discussion item
  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.discussionItem}
      onPress={() => navigation.navigate('DiscussionDetailScreen', { discussionId: item.id })}
    >
      <Text style={styles.discussionTitle}>Discussion - {item.title}</Text>
      <Text style={styles.details}>
        Last post {formatDateTime(item.createdAt)} {/* Format the timestamp */}
      </Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Discussion</Text>
        <TouchableOpacity onPress={() => navigation.navigate("AddDiscussionScreen", { courseId })}>
          <MaterialCommunityIcons name="plus" size={24} color="white" />
        </TouchableOpacity>
      </View>

      <View style={styles.container}>
        {loading ? (
          <Text style={styles.loadingText}>Loading discussions...</Text>
        ) : discussions.length > 0 ? (
          <FlatList
            data={discussions}
            keyExtractor={(item) => item.id}
            renderItem={renderItem}
          />
        ) : (
          <View style={styles.nothingContainer}>
            <Text style={styles.nothingText}>No discussions found for this course.</Text>
            <Text style={styles.nothingText}>Let's add a discussion now!</Text>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
};

export default DiscussionScreen;
