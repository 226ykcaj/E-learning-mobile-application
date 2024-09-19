import { createStackNavigator, TransitionPresets } from "@react-navigation/stack";
import DrawerNavigator from "./DrawerNavigator"; // or TabNavigator
import TabNavigator from "./TabNavigator";
import DashboardScreen from "../Screen/DashboardScreen";
import SearchScreen from "../Screen/SearchScreen";
import TaskScreen from "../Screen/Task/TaskScreen";
import CreateTask from "../Screen/Task/CreateTask";
import TaskScreenDetails from "../Screen/Task/TaskScreenDetails";
import CourseScreen from "../Screen/Course/CourseScreen";
import ModuleScreen from "../Screen/Course/Module";
import CourseDescriptionScreen from "../Screen/Course/CourseDescriptionScreen";
import AnnouncementScreen from "../Screen/Course/AnnouncementScreen";
import AnnouncementDetailsScreen from "../Screen/Course/AnnouncementDetailScreen";
import DiscussionScreen from "../Screen/Discussion/DiscussionScreen";
import AddDiscussionScreen from "../Screen/Discussion/AddDiscussionScreen";
import NewsScreen from "../Screen/News/NewsScreen";
import SavedNewsScreen from "../Screen/News/SavedNewsScreen";
import DiscussionDetailScreen from "../Screen/Discussion/DiscussionDetailScreen";

const AppStack = createStackNavigator();

const AppStackNavigator = () => {
    return (
    <AppStack.Navigator screenOptions={{ headerShown: false }}>
    <AppStack.Screen
        name="DrawerNavigator"
        component={DrawerNavigator}
    />
    <AppStack.Screen
        name="TabNavigator"
        component={TabNavigator}
    />
    <AppStack.Screen
        name="DashboardScreen"
        component={DashboardScreen}
    />
    <AppStack.Screen
        name="SearchScreen"
        component={SearchScreen}
    />
    <AppStack.Screen
        name="TaskScreen"
        component={TaskScreen}
    />
    <AppStack.Screen
        name="CreateTask"
        component={CreateTask}
        options={{...TransitionPresets.ModalSlideFromBottomIOS, }} 
    />
    <AppStack.Screen
        name="TaskScreenDetails"
        component={TaskScreenDetails}
    />
    <AppStack.Screen 
        name="CourseScreen" 
        component={CourseScreen} 
        options={{ headerShown: false }} 
    />
    <AppStack.Screen 
        name="Modules" 
        component={ModuleScreen} 
        options={{ headerShown: false }} 
    />
    <AppStack.Screen 
        name="CourseDescription" 
        component={CourseDescriptionScreen} 
        options={{ headerShown: false }} 
    />
    <AppStack.Screen 
        name="AnnouncementScreen" 
        component={AnnouncementScreen} 
        options={{ headerShown: false }} 
    />
    <AppStack.Screen 
        name="AnnouncementDetailsScreen" 
        component={AnnouncementDetailsScreen} 
        options={{ headerShown: false }} 
    />
    <AppStack.Screen 
        name="DiscussionScreen" 
        component={DiscussionScreen} 
        options={{ headerShown: false }} 
    />
    <AppStack.Screen 
        name="AddDiscussionScreen" 
        component={AddDiscussionScreen} 
        options={{ headerShown: false, ...TransitionPresets.ModalSlideFromBottomIOS, }} 
    />
    <AppStack.Screen 
        name="NewsScreen" 
        component={NewsScreen} 
        options={{ headerShown: false }} 
    />
    <AppStack.Screen 
        name="SavedNewsScreen" 
        component={SavedNewsScreen} 
        options={{ headerShown: false }} 
    />
    <AppStack.Screen 
        name="DiscussionDetailScreen" 
        component={DiscussionDetailScreen} 
        options={{ headerShown: false }} 
    />
    </AppStack.Navigator>
    );
};

export default AppStackNavigator;
