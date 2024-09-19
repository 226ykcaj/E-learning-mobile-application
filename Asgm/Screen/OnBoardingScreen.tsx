import {
    Dimensions,
    ImageBackground,
    SafeAreaView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
    Image
  } from "react-native";
  import React from "react";
  
  import { NativeStackScreenProps } from "@react-navigation/native-stack";
  
  const { height } = Dimensions.get("window");
  
  const OnBoardingScreen = ({ navigation: { navigate } }) => {
    return (
      <SafeAreaView style={styles.container}>
        <View>
          <View style={styles.imageBackground}>
            <Image
              resizeMode="contain"
              source={require("../img/Logo.png")}
              style={styles.logo}
            />
          </View>
          <View style={styles.textContainer}>
            <Text style={styles.title}>Unlock Your Learning Potential</Text>
  
            <Text style={styles.subtitle}>
                Discover courses, resources, and tools tailored to your academic journey
            </Text>
          </View>
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              onPress={() => navigate("LoginScreen")}
              style={styles.loginButton}
            >
              <Text style={styles.buttonText}>Login</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => navigate("RegisterScreen")}
              style={styles.registerButton}
            >
              <Text style={styles.registerButtonText}>Register</Text>
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    );
  };
  
  export default OnBoardingScreen;
  
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#252525',
    },
    imageBackground: {

        height: height / 3,
        justifyContent: 'center',
        alignItems: 'center', 
    },
    logo: {
        marginTop: 40,
        width: '40%',
        height: '40%',
    },
    textContainer: {
      paddingHorizontal: 40,
    },
    title: {
      fontSize: 35,
      color: "#98C1D9",
      textAlign: "center",
    },
    subtitle: {
      fontSize: 14,
      color: "#FFFFFF",
      textAlign: "center",
      marginTop: 20,
    },
    buttonContainer: {
      paddingHorizontal: 20,
      paddingTop: 60,
      flexDirection: "row",
      justifyContent: "space-between",
    },
    loginButton: {
      backgroundColor: "#98C1D9",
      paddingVertical: 15,
      paddingHorizontal: 20,
      width: "48%",
      borderRadius: 10,
      shadowColor: "#98C1D9",
      shadowOffset: {
        width: 0,
        height: 10,
      },
      shadowOpacity: 0.3,
      shadowRadius: 10,
    },
    registerButton: {
        backgroundColor: "#98C1D9",
        paddingVertical: 15,
        paddingHorizontal: 20,
        width: "48%",
        borderRadius: 10,
        shadowColor: "#98C1D9",
        shadowOffset: {
          width: 0,
          height: 10,
        },
        shadowOpacity: 0.3,
        shadowRadius: 10,
    },
    buttonText: {
      color: "#000000",
      fontSize: 20,
      textAlign: "center",
    },
    registerButtonText: {
      color: "#000000",
      fontSize: 20,
      textAlign: "center",
    },
  });
  