import React from "react";
import { createDrawerNavigator } from "@react-navigation/drawer";
import Ionicons from 'react-native-vector-icons/Ionicons';
import ProfileScreen from "../Screen/Profile";
import CustomDrawer from "../Components/CustomDrawer";
import CustomHeader from "../Components/CustomHeader";
import TabNavigator from "./TabNavigator";
import { styles } from '../Styles'; // Import styles
import { TransitionPresets } from "@react-navigation/stack";
import NewsScreen from "../Screen/News/NewsScreen"; 
import SavedNewsScreen from "../Screen/News/SavedNewsScreen";
import OnBoardingScreen from "../Screen/OnBoardingScreen";

const Drawer = createDrawerNavigator();

const DrawerNavigator = () => {
    return (
        <Drawer.Navigator
            drawerContent={(props) => <CustomDrawer {...props} />}
            screenOptions={({ navigation, route }) => ({
                header: () => (
                    <CustomHeader title={route.name} navigation={navigation} />
                ),
                drawerStyle: {
                    backgroundColor: '#474747',
                },
                drawerActiveTintColor: '#98C1D9',
                drawerInactiveTintColor: '#999999', 
                drawerItemStyle: {
                    borderRadius: 5,
                    marginVertical: 5,
                },
                drawerLabelStyle: {
                    fontSize: 16,
                },
            })}
        >
            <Drawer.Screen
                name="Home"
                component={TabNavigator}
                options={{
                    headerShown: false,
                    drawerIcon: ({ color, size }) => (
                        <Ionicons name="home-outline" size={size} color={color} />
                    ),
                }}
            />

            <Drawer.Screen
                name="Profile"
                component={ProfileScreen}
                options={{
                    headerShown: false,
                    ...TransitionPresets.SlideFromRightIOS,
                    drawerIcon: ({ color, size }) => (
                        <Ionicons name="person-outline" size={size} color={color} />
                    ),
                }}
            />

            <Drawer.Screen
                name="News"
                component={NewsScreen}
                options={{
                    headerShown: false,
                    drawerIcon: ({ color, size }) => (
                        <Ionicons name="newspaper-outline" size={size} color={color} />
                    ),
                }}
            />

            <Drawer.Screen
                name="Saved News"
                component={SavedNewsScreen}
                options={{
                    headerShown: false,
                    drawerIcon: ({ color, size }) => (
                        <Ionicons name="bookmark-outline" size={size} color={color} />
                    ),
                }}
            />
        </Drawer.Navigator>
    );
};

export default DrawerNavigator;