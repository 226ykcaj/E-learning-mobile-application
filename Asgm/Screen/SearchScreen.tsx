import React, { useState, useEffect, useContext } from "react";
import { View, Text, StyleSheet, TouchableOpacity, FlatList, Image, Alert } from "react-native";
import { Searchbar } from "react-native-paper";
import MasonryList from '@react-native-seoul/masonry-list';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { SafeAreaView } from "react-native-safe-area-context";

import MessageModal from "../Components/Messagemodal";
import { fetchCourses } from '../Database/dataUtils';  // Ensure this import is correct
import { db, firebase_auth } from '../config';  // Use the correct import from your config file
import { collection, query, where, getDocs, addDoc } from 'firebase/firestore';  // Import Firestore functions
import { ModalContext } from "../Components/ModalContext";

interface Course {
  id: string;
  shortTitle: string,
  title: string,
  desc: string,
  synopsis: string,
  courseOutline: Array<string>,
  img: string,
  isEnrolled?: boolean,
}

const SearchScreen = (navigation:{navigate}) => {
  const [searchbar, setSearchbar] = useState('');
  const [course, setCourse] = useState<Course[]>([]);
  const [filteredResults, setFilteredResults] = useState<Course[]>([]);
  const [selectedItem, setSelectedItem] = useState<Course[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  // const [expandedCards, setExpandedCards] = useState<{ [key: string]: boolean }>({});
  const { showModal } = useContext(ModalContext);


  const userId = firebase_auth.currentUser?.uid;

  // Fetch courses and user data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const courses = await fetchCourses(); // Fetch courses from Firestore
        setCourse(courses); // Set courses to state
        setSelectedItem(courses); // Initially show all items
      } catch (error) {
        showModal({title : 'Error', body:'Fail to fetch courses from firebase.'});
        
        console.error("Fail to fetch courses from firebase: ", error);
      }
    };

    fetchData();
  }, []);

  // Filter search results based on user input
  useEffect(() => {
    if (searchbar.trim() === '') {
      setFilteredResults([]);
      setShowSuggestions(false);
    } else {
      const results = course.filter(item =>
        item.title.toLowerCase().includes(searchbar.toLowerCase())
      );
      const exactMatch = course.find(item =>
        item.title.toLowerCase() === searchbar.toLowerCase()
      );

      setFilteredResults(results);

      if (exactMatch) {
        setSelectedItem([exactMatch]);
        setShowSuggestions(false);
      } else {
        setShowSuggestions(true); // Show suggestions when there are results
      }
    }
  }, [searchbar]);

  const handleItemPress = (item: Course) => {
    setSelectedItem([item]); // Set the MasonryList to show the selected item only
    setSearchbar(item.title); // Set the search bar text to the selected item title
    setShowSuggestions(false); // Hide the search suggestions
  };

  const handleSearchbarChange = (text: string) => {
    setSearchbar(text);
    setShowSuggestions(true); // Show suggestions when typing
  };

  const handleEnrollPress = async (item: Course) => {
    try {
      // Check if the user is already enrolled in the course
      const enrolledCoursesRef = collection(db, "enrolledCourses");
      const q = query(enrolledCoursesRef, where("userId", "==", userId), where("courseId", "==", item.id));
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        showModal({title: "Error", body: "You have already enrolled in this course."});
        
        return; // Exit the function early if the user is already enrolled
      }

      // Add the enrollment document to the 'enrolledCourses' collection
      await addDoc(enrolledCoursesRef, {
        userId: userId,
        courseId: item.id,
      });

      console.log(`User enrolled in course: ${item.title}`);
      showModal({title: "Success", body: "Successfully enrolled in course!"});
      
      // Update the course list to reflect the enrollment
      const updatedCourses = course.map(courseItem =>
        courseItem.id === item.id ? { ...courseItem, isEnrolled: true } : courseItem
      );
      setCourse(updatedCourses);
      setSelectedItem(updatedCourses);
    } catch (error) {
      console.error("Error enrolling in course: ", error);
      Alert.alert("Failed to enroll in course. Please try again.");
    }
  };


  return (
    <SafeAreaView style={{flex: 1}}>
      <View style={styles.container}>
        <Searchbar
          placeholder="Type here..."
          onChangeText={handleSearchbarChange}
          value={searchbar}
          keyboardType="default"
          style={styles.searchbar}
          onFocus={() => setShowSuggestions(true)} // Show suggestions when the search bar is focused
          inputStyle={{ color: '#FFFFFF' }} 
          iconColor="#FFFFFF" 
          placeholderTextColor="#888" 
          theme={{ roundness: 10 }} 
        />

        {showSuggestions && filteredResults.length > 0 && (
          <FlatList
            data={filteredResults}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.searchResult}
                onPress={() => handleItemPress(item)} // Handle item press in one click
              >
                <Text style={styles.searchText}>{item.title}</Text>
              </TouchableOpacity>
            )}
            style={styles.resultsContainer}
          />
        )}

        <MasonryList
          style={styles.masonryListContainer}
          data={selectedItem}
          keyExtractor={(item) => item.id}
          numColumns={2}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => {
            return (
              <View
                style={[
                  styles.masonryCardContainer
                ]}
              >
                <View style={styles.masonryCard}>
                  <Image
                    source={{ uri: item.img }}
                    style={styles.courseImage}
                    resizeMode="cover"
                  />
                  <View style={styles.courseInfo}>
                    <Text style={styles.shortTitle}>{item.shortTitle}</Text>
                    <Text style={styles.titleText}>{item.title}</Text>
                  </View>
                </View>

                <TouchableOpacity
                  style={styles.enrollButton}
                  onPress={() => handleEnrollPress(item)} // Handle enroll action
                >
                  <MaterialCommunityIcons name="plus-circle" size={30} color="#98c1d9" />
                </TouchableOpacity>
              </View>
            );
          }}
          refreshing={false}
        />
      </View>

      <MessageModal />
    </SafeAreaView>
  );
}

export default SearchScreen;

const styles = StyleSheet.create({
  resultsContainer: {
    maxHeight: 200,
    position: 'absolute',
    top: 60,
    left: 10,
    right: 10,
    zIndex: 1, // Ensure it appears above the MasonryList
    borderRadius: 10,
    backgroundColor: '#333', // Match the background color of the search bar for consistency
  },
  searchResult: {
    backgroundColor: "#333",
    height: 40,
    borderRadius: 6,
    justifyContent: 'center',
    borderColor: "#98c1d9", // Match border color for consistency
    borderWidth: 0.5,
    paddingHorizontal: 10,
    marginBottom: 5,
    width: "95%",
    alignSelf: "center",
  },
  searchText: {
    color: '#FFFFFF', // Match text color for consistency
    marginBottom: 10, // Space between text and button
  },

  expandedCardBackground: {
    backgroundColor: '#fddb93', // Change the background color when expanded
  },

  container: {
    flex: 1,
    backgroundColor: '#252525',
    paddingHorizontal: 20,
  },
  searchbar: {
    marginVertical: 10,
    backgroundColor: '#333', // Match the background color for consistency
  },
  masonryListContainer: {
    marginTop: 10, // Ensure some spacing between the search bar and masonry list
  },
  masonryCardContainer: {
    margin: 5,
    flex: 1,
    backgroundColor: '#474747',
    borderRadius: 10,
    overflow: 'hidden', // Ensures the image and content fit within rounded borders
  },
  masonryCard: {
    backgroundColor: '#333',
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'space-between',
    padding: 10,
  },
  courseImage: {
    width: '100%',
    height: 100, // Adjust this height based on your design needs
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  courseInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  shortTitle: {
    color: '#98c1d9',
    fontWeight: 'bold',
    fontSize: 14,
    marginBottom: 5,
  },
  titleText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
    lineHeight: 20, // Ensure consistent spacing between lines
    flex: 1,
    flexWrap: 'wrap',
  },
  descText: {
    color: '#FFFFFF',
    fontSize: 14,
  },
  infoButton: {
    position: 'absolute',
    top: 10,
    right: 10,
  },
  enrollButton: {
    position: 'absolute',
    bottom: 10,
    right: 10,
  },

});
