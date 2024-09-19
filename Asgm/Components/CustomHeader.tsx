import React from "react";
import { View, Text, TouchableOpacity, TouchableNativeFeedback, Image } from "react-native";
import { createDrawerNavigator, DrawerContentScrollView, DrawerItemList } from "@react-navigation/drawer";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createStackNavigator, TransitionPresets } from "@react-navigation/stack";
import Ionicons from 'react-native-vector-icons/Ionicons';

//Ben
import { styles } from '../Styles';

const Drawer = createDrawerNavigator();
const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();


const CustomHeader = ({ title, navigation }: any) => {
    return (
        <View style={styles.homeHeader}>
            <TouchableOpacity onPress={() => navigation.openDrawer()}>
            <Ionicons name="menu" size={30} color="white" />
            </TouchableOpacity>
            <Image
                source={require('../img/Logo.png')}
                style={styles.logo}  
            />
            <View style={{ width: 24 }} />
        </View>
    );
};

export default CustomHeader;