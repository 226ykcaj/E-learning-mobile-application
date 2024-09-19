import React, {useState} from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, ScrollView, FlatList } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Ionicons from "react-native-vector-icons/Ionicons";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

import { styles } from '../Styles';


export const MenuItem = ({ title, icon, onPress } : any) => (
    <TouchableOpacity style={styles.menuItem} onPress={onPress}>
      <MaterialCommunityIcons name={icon} size={24} color="#98C1D9" />
      <Text style={styles.menuItemText}>{title}</Text>
      <Ionicons name="chevron-forward-outline" size={24} color="white" />
    </TouchableOpacity>
  );