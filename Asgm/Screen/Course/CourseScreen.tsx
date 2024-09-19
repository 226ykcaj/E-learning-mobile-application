import React, {useEffect, useState} from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, ScrollView, FlatList } from 'react-native';
import Ionicons from "react-native-vector-icons/Ionicons";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { styles } from '../../Styles';
import { SafeAreaView } from 'react-native-safe-area-context';

import {firebase_app} from '../../config';
const CourseScreen = ({ route, navigation }: any) => {
  const {course} = route.params;

    if (!course) {
        return (
            <View style={styles.container}>
                <Text style={{color:"white"}}>Loading...</Text>
            </View>
        );
    }

    return (
        <SafeAreaView style={{flex: 1}}>
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity onPress={()=> navigation.goBack()}>
              <Ionicons name="arrow-back" size={24} color="white" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>{course.shortTitle}</Text>
            <View style={{ width: 24 }} />
          </View>
          <View style={styles.container}>
            {/* Course Image and Title */}
            <View style={{paddingTop: 10}}>
              <View style={styles.courseBanner}>
                <Image
                  source={{ uri: course.img }} 
                  style={styles.courseImage}
                />
                <Text style={styles.courseTitle}>{course.title}</Text>
              </View>
            </View>
            {/* Menu List */}
            <ScrollView style={styles.menuList}>
              <MenuItem title="Course Overview" icon="home-variant"  onPress={() => navigation.navigate('CourseDescription', {course})}  />
              <MenuItem title="Announcements" icon="bullhorn" onPress={() => navigation.navigate('AnnouncementScreen')}  />
              <MenuItem title="Discussions" icon="forum" onPress={() => navigation.navigate('DiscussionScreen', {courseId: course.courseId})}  />
              <MenuItem title="Modules" icon="view-module" onPress={() => navigation.navigate('Modules', {modules: course.modules, title: course.title})} />
            </ScrollView>
            </View>
        </SafeAreaView>
      );
    };

    const MenuItem = ({ title, icon, onPress } : any) => (
        <TouchableOpacity style={styles.menuItem} onPress={onPress}>
          <MaterialCommunityIcons name={icon} size={24} color="#98C1D9" />
          <Text style={styles.menuItemText}>{title}</Text>
          <Ionicons name="chevron-forward-outline" size={24} color="white" />
        </TouchableOpacity>
      );
    export default CourseScreen;