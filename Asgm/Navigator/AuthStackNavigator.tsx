import { createStackNavigator } from "@react-navigation/stack";
import OnBoardingScreen from "../Screen/OnBoardingScreen";
import LoginScreen from "../Screen/LoginScreen";
import RegisterScreen from "../Screen/RegisterScreen";

const AuthStack = createStackNavigator();

const AuthStackNavigator = ({ setModalDismissed }) => {
  return (
    <AuthStack.Navigator screenOptions={{ headerShown: false }}>
      <AuthStack.Screen name="OnBoardingScreen" component={OnBoardingScreen} />
      
      <AuthStack.Screen name="LoginScreen" component={LoginScreen}/>
      
      <AuthStack.Screen name="RegisterScreen" component={RegisterScreen} />
    </AuthStack.Navigator>
  );
};

export default AuthStackNavigator;
