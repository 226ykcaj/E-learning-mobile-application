import { initializeApp } from "firebase/app";
import { initializeAuth, getReactNativePersistence } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage"; 
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyC1Tq5gh18dnGCsx7HeYrPwiNdGfc2BhQ8",
  authDomain: "wble2-f5f4d.firebaseapp.com",
  projectId: "wble2-f5f4d",
  storageBucket: "wble2-f5f4d.appspot.com",
  messagingSenderId: "427976090518",
  appId: "1:427976090518:android:f0181ad9e825ac18ce33b7",
};

// Initialize Firebase
export const firebase_app = initializeApp(firebaseConfig);

// Initialize Firebase Auth with AsyncStorage persistence
export const firebase_auth = initializeAuth(firebase_app, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage),
});

export const db = getFirestore(firebase_app);

// Initialize Firebase Storage
export const storage = getStorage(firebase_app);