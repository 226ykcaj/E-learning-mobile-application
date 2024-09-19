import React, {useEffect, useState} from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, ScrollView, FlatList, Systrace, SafeAreaView } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Ionicons from "react-native-vector-icons/Ionicons";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import Unorderedlist from 'react-native-unordered-list';
import {firebase} from "../../config";
import { styles } from '../../Styles';

const CourseDescriptionScreen = ({ route, navigation } : any) => {
    const {course} = route.params;

    if (!course) {
        return (
            <View style={styles.container}>
                <Text>Loading...</Text>
            </View>
        );
    }

  return (
    <SafeAreaView style={{flex:1}}>
        {/* Header */}
        <View style={styles.header}>
            <TouchableOpacity
                onPress={()=>navigation.goBack()}
            >
              <Ionicons name="arrow-back" size={24} color="white" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>{course.shortTitle}</Text>
            <View style={{ width: 24 }} />
        </View>
        <ScrollView style={styles.container}>
            <View style={{paddingTop: 10}}>
                <Image
                    style={styles.image}
                    source={{ uri: course.img }}
                />
            </View>
        <Text style={styles.title}>{course['title']}</Text>
        <Text style={styles.subtitle}>Synopsis</Text>
        <Text style={styles.description}>
            {course.synopsis}   
        </Text>

        <Text style={styles.subtitle}>Course Outline</Text>
        <View style={styles.courseOutlineCon}>
            <Text style={styles.description}>
                {course.courseOutline[0]}
            </Text>
            <Unorderedlist style={styles.ul} color='white'>
                <Text style={styles.li}>{course.courseOutline[1]}</Text>
            </Unorderedlist>

            <Unorderedlist style={styles.ul} color='white'>
                <Text style={styles.li}>{course.courseOutline[2]}</Text>
            </Unorderedlist>

            <Unorderedlist style={styles.ul} color='white'>
                <Text style={styles.li}>{course.courseOutline[3]}</Text>
            </Unorderedlist>
        </View>
        </ScrollView>
    </SafeAreaView>
  );
};
export default CourseDescriptionScreen;