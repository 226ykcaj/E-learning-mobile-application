import React, { useContext, useEffect, useState } from 'react';
import { Image, SafeAreaView, StyleSheet, Text, TextInput, TouchableOpacity, View, ActivityIndicator, Alert } from 'react-native';
import MessageModal from '../Components/Messagemodal';

import { firebase_auth } from '../config';
import { signInWithEmailAndPassword, onAuthStateChanged, sendPasswordResetEmail } from 'firebase/auth';
import { ModalContext } from '../Components/ModalContext';


const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  
  const { showModal } = useContext(ModalContext);

  // Function to handle password reset via email
  const resetPassword = async () => {
    if (!email) {
      showModal({title : 'Error', body : 'Please enter your email to reset the password.'});
      return;
    }

    try {
      await sendPasswordResetEmail(firebase_auth, email);
      showModal({title : 'Success', body : 'Password reset email sent. Check your inbox.'});
    } catch (error) {
      showModal({title : 'Error', body : error.message});
      
    }
  };

  const signIn = async () => {
    setLoading(true);
    try {
      const userCredential = await signInWithEmailAndPassword(firebase_auth, email, password);      
 
      console.log(userCredential);

    } catch (error) {
      let errorMessage;
      if (error.code === 'auth/user-not-found') {
        showModal({title : "Failure", body : "No user found with this email."});
      } else if (error.code === 'auth/wrong-password') {
        showModal({title : "Failure", body : "Incorrect password."});
      } else if (error.code === 'auth/invalid-email') {
        showModal({title : "Failure", body : "Invalid email format."});
      }else{
        showModal({title : "Failure", body : error.message});
      }
      
      console.error("Error: " + errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={styles.container}>
        <View style={styles.innerContainer}>
          <View style={styles.headerContainer}>
            <Text style={styles.title}>Login</Text>
            <Text style={styles.subtitle}>
              Welcome back, you've been missed!
            </Text>
          </View>
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="Email"
              placeholderTextColor="#888"
              autoCapitalize="none"
              value={email}
              onChangeText={text => setEmail(text)}
            />
            <View style={styles.inputWrapper}>
              <TextInput
                style={styles.input}
                placeholder="Password"
                placeholderTextColor="#888"
                secureTextEntry={!showPassword}
                value={password}
                onChangeText={text => setPassword(text)}
              />
              <TouchableOpacity onPress={toggleShowPassword} style={styles.eyeIconContainer}>
                <Image
                  source={showPassword ? require("../img/eye.png") : require("../img/hidden.png")}
                  style={styles.eyeIcon}
                />
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.forgotPasswordContainer}>
            <TouchableOpacity onPress={resetPassword}>
            <Text style={styles.forgotPasswordText}>
              Forgot your password?
            </Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity style={styles.signInButton} onPress={signIn} disabled={loading}>
            {loading ? (
              <ActivityIndicator size="small" color="#252525" />
            ) : (
              <Text style={styles.signInButtonText}>Sign in</Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity onPress={() => navigation.navigate("RegisterScreen")} style={styles.registerLink}>
            <Text style={styles.registerLinkText}>Create new account</Text>
          </TouchableOpacity>


          <MessageModal/>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({
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
  inputWrapper: {
    position: 'relative',
    marginBottom: 15,
  },
  input: {
    backgroundColor: '#333333',
    color: '#FFFFFF',
    padding: 15,
    marginBottom : 15,
    borderRadius: 10,
    paddingRight: 45, // Added padding to make room for the eye icon
  },
  forgotPasswordContainer: {
    alignItems: 'flex-end',
    marginBottom: 30,
  },
  forgotPasswordText: {
    fontSize: 14,
    color: "#98C1D9",
  },
  signInButton: {
    padding: 15,
    backgroundColor: "#98C1D9",
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
    alignItems: 'center',
  },
  signInButtonText: {
    color: "#252525",
    textAlign: "center",
    fontSize: 20,
  },
  registerLink: {
    padding: 10,
  },
  registerLinkText: {
    color: "#98C1D9",
    textAlign: "center",
    fontSize: 14,
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
