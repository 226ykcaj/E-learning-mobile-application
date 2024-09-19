import React, {useState} from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, ScrollView, FlatList, SafeAreaView } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Ionicons from "react-native-vector-icons/Ionicons";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

import { styles } from '../../Styles';
import { MenuItem } from '../../Components/MenuItem';

const AnnouncementScreen = ({route, navigation} : any) => {
    return (
        <SafeAreaView style={{flex: 1}}>
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity
                  onPress={()=>navigation.goBack()}
              >
              <Ionicons name="arrow-back" size={24} color="white" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Announcement</Text>
            <View style={{ width: 24 }} />
          </View>

          {/* Menu List */}
          <View style={styles.container}>
            <ScrollView style={styles.menuList}>
              <MenuItem title="First Announcement" icon="bullhorn" onPress={() => navigation.navigate('AnnouncementDetailsScreen')}/>
            </ScrollView>
          </View>

        </SafeAreaView>
    );
};
export default AnnouncementScreen;