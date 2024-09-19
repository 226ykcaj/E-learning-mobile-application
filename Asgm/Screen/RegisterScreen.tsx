import React, { useContext, useState } from "react";
import {
  Alert,
  Image,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import Modal from "react-native-modal";
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { firebase_auth, db } from "../config";
import { getStorage, ref, getDownloadURL } from "firebase/storage";
import MessageModal from "../Components/Messagemodal";
import { ModalContext } from "../Components/ModalContext";


const RegisterScreen = ({ navigation: { navigate }}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [passwordConfirmed, setPasswordConfirmed] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { showModal } = useContext(ModalContext);

  const signUp = async () => {
    if (password !== passwordConfirmed) {
      showModal({title: "Error", body: "Passwords do not match."});
      return;
    }
    
    if (!name) {
      showModal({title: "Error", body: "Please enter your name."});  // Ensure name is not empty
      return;
    }
    
    setLoading(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(firebase_auth, email, password);
      const user = userCredential.user;
      
      // Initialize Firebase Storage
      const storage = getStorage();
      const storageRef = ref(storage, 'profile/profile.jpg');
  
      let profileImageUrl = '';
      try {
        // Get the download URL of the default profile image
        profileImageUrl = await getDownloadURL(storageRef);
      } catch (error) {
        console.error("Error fetching default profile image URL: ", error);
        profileImageUrl = ''; // Fallback to empty string or another default URL
      }
  
      // Create user Firestore document
      const userDocRef = doc(db, "users", user.uid);
      await setDoc(userDocRef, {
        email: user.email,
        name: name,
        img: profileImageUrl, // Set the default profile image URL
        createdAt: new Date(),
      });
  
      // Navigate to AppStack after document is created
      showModal({title : 'Success', body : 'You have successfully created an account. Let\'s log in your account!'});
      
      navigate("LoginScreen"); // Ensure document creation is done before navigating
  
    } catch (error) {
      console.error(error);
      
      if (error.code === 'auth/email-already-in-use') {
        showModal({title: "Error", body: "The email address is already in use by another account."});
      } else if (error.code === 'auth/invalid-email') {
        showModal({title: "Error", body: "The email address is not valid."});
      } else if (error.code === 'auth/weak-password') {
        showModal({title: "Error", body: "The password is too weak."});
      } else if (error.code === 'auth/invalid-password') {
        showModal({title: "Error", body: "The password should be at least 6 characters."});
      } else {
        showModal({title: "Error", body: "Failed to sign up: " + error.message});
      }
      
    } finally {
      setLoading(false);
    }
  };
  

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ScrollView style={styles.container}>
        <View style={styles.innerContainer}>
          <View style={styles.headerContainer}>
            <Text style={styles.title}>Register</Text>
            <Text style={styles.subtitle}>
            Create an account so you can explore all the leaning courses
            </Text>
          </View>

          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="Username"
              placeholderTextColor="#888"
              value={name}
              onChangeText={setName}
              autoCapitalize="none"
            />

            <TextInput
              style={styles.input}
              placeholder="Email"
              placeholderTextColor="#888"
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
            />
            
              <View style={styles.passwordContainer}>
                <TextInput
                  style={styles.input}
                  placeholder="Password"
                  placeholderTextColor="#888"
                  secureTextEntry={!showPassword}
                  value={password}
                  onChangeText={setPassword}
                />
                <TouchableOpacity onPress={toggleShowPassword} style={styles.eyeIconContainer}>
                  <Image
                    source={showPassword ? require("../img/eye.png") : require("../img/hidden.png")}
                    style={styles.eyeIcon}
                  />
                </TouchableOpacity>
              </View>
            
              <View style={styles.passwordContainer}>
                <TextInput
                  style={styles.input}
                  placeholder="Confirm Password"
                  placeholderTextColor="#888"
                  secureTextEntry={!showPassword}
                  value={passwordConfirmed}
                  onChangeText={setPasswordConfirmed}
                />
                <TouchableOpacity onPress={toggleShowPassword} style={styles.eyeIconContainer}>
                  <Image
                    source={showPassword ? require("../img/eye.png") : require("../img/hidden.png")}
                    style={styles.eyeIcon}
                  />
                </TouchableOpacity>
              </View>
            
          </View>

          <TouchableOpacity style={styles.signUpButton} onPress={signUp} disabled={loading}>
            <Text style={styles.signUpButtonText}>{loading ? "Signing Up..." : "Sign up"}</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => navigate("LoginScreen")} style={styles.signInLink}>
            <Text style={styles.signInLinkText}>Already have an account? Sign in</Text>
          </TouchableOpacity>

        <MessageModal />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default RegisterScreen;

const styles = StyleSheet.create({
  signUpButton: {
    padding: 15,
    backgroundColor: "#98C1D9", // Button color consistent with previous screens
    marginTop: 30,
    marginBottom: 10,
    borderRadius: 10,
    shadowColor: "#98C1D9",
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.3,
    shadowRadius: 10,
  },
  signUpButtonText: {
    fontFamily: "poppins-bold",
    color: "#252525",
    textAlign: "center",
    fontSize: 20,
  },
  signInLink: {
    padding: 10,
  },
  signInLinkText: {
    fontFamily: "poppins-semiBold",
    color: "#98C1D9", // Link color consistent with previous screens
    textAlign: "center",
    fontSize: 14,
  },
  container: {
    flex: 1,
    backgroundColor: '#252525',
    paddingHorizontal: 20,
  },
  innerContainer: {
    padding: 20,
    marginTop: 50,
  },
  headerContainer: {
    alignItems: "center",
    marginVertical: 30,
  },
  title: {
    fontSize: 30,
    color: "#98C1D9",
    fontWeight: "bold",
  },
  subtitle: {
    fontSize: 15,
    maxWidth: "60%",
    textAlign: "center",
    color: '#FFFFFF',
    marginTop: 10,
  },
  inputContainer: {
    marginTop: 30,
  },
  input: {
    backgroundColor: '#333333',
    color: '#FFFFFF',
    padding: 15,
    marginBottom: 15,
    borderRadius: 10,
    paddingRight: 45, // Added padding to make room for the eye icon
  },
  passwordContainer: {
    position: 'relative',
  },
  socialLoginContainer: {
    marginVertical: 30,
  },
  socialLoginText: {
    color: "#98C1D9",
    textAlign: "center",
    fontSize: 14,
  },
  socialButtonsContainer: {
    marginTop: 10,
    flexDirection: "row",
    justifyContent: "center",
  },
  socialButton: {
    padding: 10,
    backgroundColor: "#474747",
    borderRadius: 5,
    marginHorizontal: 10,
  },
  socialIcon: {
    width: 20,
    height: 20,
  },
  eyeIconContainer: {
    position: 'absolute',
    right: 15,
    top: 17,
  },
  eyeIcon: {
    width: 24,
    height: 24,
  },
  modalContent: {
    backgroundColor: '#333',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
},
modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 10,
},
modalMessage: {
    fontSize: 16,
    color: '#FFFFFF',
    marginBottom: 20,
    textAlign: 'center',
},
modalButton: {
    backgroundColor: '#98C1D9',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 5,
},
modalButtonText: {
    color: '#293241',
    fontSize: 16,
    fontWeight: 'bold',
},
});
