import React, { useState, useCallback, useContext } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView } from "react-native";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import MasonryList from '@react-native-seoul/masonry-list';
import Swiper from 'react-native-swiper';
import { SafeAreaView } from "react-native-safe-area-context";
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import MessageModal from "../Components/Messagemodal";

import { db } from "../config";
import { listenToEnrolledCourses } from '../Database/dataUtils';
import { getAuth } from 'firebase/auth';
import { doc, deleteDoc, getDocs, collection, query, where, writeBatch} from "firebase/firestore";
import { styles } from "../Styles";
import { ModalContext } from "../Components/ModalContext";
interface Course {
    id: string;
    title: string;
    desc: string;
}

const DashboardScreen = ({ navigation: { navigate } }) => {
    const [enrolledCourses, setEnrolledCourses] = useState<Course[]>([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const { showModal } = useContext(ModalContext);
    const auth = getAuth();

    useFocusEffect(
        useCallback(() => {
            const user = auth.currentUser;
            if (!user) {
                console.log("No user is currently signed in.");
                return;
            }
    
            const handleEnrolledCoursesUpdate = (courses: Course[]) => {
                setEnrolledCourses(courses);
                setLoading(false);
            };

            const unsubscribe = listenToEnrolledCourses(handleEnrolledCoursesUpdate);

            return () => {
                unsubscribe();
            };

        }, [auth])
    );
    
    const handleCardPress = (item: Course) => {
        navigate('CourseScreen', { course: item });
    };

    const handleRemoveCourse = async (item: Course) => {
        try {
            const user = auth.currentUser;
            if (!user) {
                console.error("No user is currently signed in.");
                return;
            }
    
            // Reference to the enrolledCourses collection
            const enrolledCoursesRef = collection(db, "enrolledCourses");
    
            // Query to find the document where the userId and courseId match
            const q = query(
                enrolledCoursesRef,
                where("userId", "==", user.uid),
                where("courseId", "==", item.id)
            );
    
            const querySnapshot = await getDocs(q);
    
            // If a matching document is found, delete it
            const batch = writeBatch(db);
            querySnapshot.forEach((doc) => {
                batch.delete(doc.ref);
            });
    
            await batch.commit();
    
            // Update local state
            const updatedCourses = enrolledCourses.filter(course => course.id !== item.id);
            setEnrolledCourses(updatedCourses);
            showModal({title: 'Success' , body : "Course removed successfully!"});
            
        } catch (error) {
            console.error("Error removing course: ", error);
            showModal({title: 'Error' , body : "Fail to remove course."});
            
        }
    };

    const onRefresh = async () => {
        setRefreshing(true);
        setRefreshing(false);
    };

    const sliderImages = [
        { uri: 'https://www.classcentral.com/report/wp-content/uploads/2024/01/bcg_machine_learning_banner.png' },
        { uri: 'https://blog.bingx.com/wp-content/uploads/2023/07/twitter_1200x628-10.png' },
        { uri: 'https://www.ade-technologies.com/blog/wp-content/uploads/2021/09/Web-Application-Development.png' },
    ];

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <ScrollView style={styles.container}>
                <View style={{ marginTop: 10 }}>
                    <Text style={styles.title}>Coming Soon New Course</Text>
                </View>

                <View style={internalstyles.sliderContainer}>
                    <Swiper
                        autoplay
                        autoplayTimeout={4}
                        showsPagination={true}
                        dotColor="#fff"
                        activeDotColor="#98C1D9"
                    >
                        {sliderImages.map((image, index) => (
                            <Image key={index} source={image} style={internalstyles.sliderImage} />
                        ))}
                    </Swiper>
                </View>

                <View style={{ marginTop: 10 }}>
                    <Text style={styles.title}>Enrolled Courses</Text>
                </View>

                {enrolledCourses.length === 0 ? (
                    <View style={internalstyles.noCoursesContainer}>
                        <Text style={internalstyles.noCoursesText}>
                            No enrolled courses. Please go to the search page to enroll in courses.
                        </Text>
                        <TouchableOpacity
                            style={internalstyles.searchButton}
                            onPress={() => { navigate('Search') }}
                        >
                            <Text style={internalstyles.searchButtonText}>Go to Search</Text>
                        </TouchableOpacity>
                    </View>
                ) : (
                    <MasonryList
                        style={styles.masonryListContainer}
                        data={enrolledCourses}
                        keyExtractor={(item) => item.id}
                        numColumns={2}
                        showsVerticalScrollIndicator={false}
                        renderItem={({ item }) => (
                            <View style={styles.masonryCardContainer}>
                                <TouchableOpacity
                                    onPress={() => handleCardPress(item)}
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
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={styles.enrollButton}
                                    onPress={() => handleRemoveCourse(item)}
                                >
                                    <Image source={require("../img/trash.png")} style={{width:30, height:30}}/>
                                </TouchableOpacity>
                            </View>
                        )}
                        refreshing={refreshing}
                        onRefresh={onRefresh}
                    />
                )}
            </ScrollView>

                <MessageModal />
        </SafeAreaView>
    );
};

export default DashboardScreen;


const internalstyles = StyleSheet.create({
    sliderContainer: {
        height: 200, // Adjust height as needed
        marginVertical: 10,
    },
    sliderImage: {
        width: '100%',
        height: '100%',
        borderRadius: 10,
    },
    courseImage: {
        width: '100%',
        height: 100,
        borderTopLeftRadius: 10,
        borderTopRightRadius: 10,
    },
    noCoursesContainer: {
        alignItems: 'center',
        marginTop: 20,
    },
    noCoursesText: {
        color: '#FFFFFF',
        fontSize: 16,
        textAlign: 'center',
        marginBottom: 10,
    },
    searchButton: {
        backgroundColor: '#98C1D9',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 5,
    },
    searchButtonText: {
        color: '#293241',
        fontSize: 16,
        fontWeight: 'bold',
    },
});
