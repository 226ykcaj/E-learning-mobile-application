import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import DashboardScreen from "../Screen/DashboardScreen";
import SearchScreen from "../Screen/SearchScreen";
import TaskScreen from "../Screen/Task/TaskScreen";
import CustomHeader from "../Components/CustomHeader";
import CustomTab from '../Components/CustomTab';

const Tab = createBottomTabNavigator();

const TabNavigator = () => {
    return (
        <Tab.Navigator
            tabBar={props => <CustomTab {...props} />}
            screenOptions={{
                headerShown: true, 
            }}
        >
            <Tab.Screen
                name="Dashboard"
                component={DashboardScreen}
                options={{
                    header: ({ navigation }) => <CustomHeader title="Dashboard" navigation={navigation} />,
                }}
            />
            <Tab.Screen
                name="Search"
                component={SearchScreen}
                options={{
                    header: ({ navigation }) => <CustomHeader title="Calendar" navigation={navigation} />,
                }}
            />
            <Tab.Screen
                name="Task"
                component={TaskScreen}
                options={{
                    header: ({ navigation }) => <CustomHeader title="To-do" navigation={navigation} />,
                }}
            />
        </Tab.Navigator>
    );
};

export default TabNavigator;
