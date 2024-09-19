import React, { useEffect, useState } from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { onAuthStateChanged } from "firebase/auth";
import { firebase_auth, db } from "../config"; 
import { doc, getDoc } from "firebase/firestore";
import AuthStackNavigator from "./AuthStackNavigator";
import AppStackNavigator from "./AppStackNavigator";
import { ActivityIndicator, View } from "react-native";

const Stack = createStackNavigator();

const StackNavigator = () => {
  const [user, setUser] = useState(null); // User state
  const [loading, setLoading] = useState(true); // Loading state for auth check

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(firebase_auth, async (authUser) => {
      setLoading(true); // Start loading when auth state changes

      if (authUser) {
        // Fetch Firestore user document
        const userDocRef = doc(db, "users", authUser.uid);
        const userDoc = await getDoc(userDocRef);

        if (userDoc.exists()) {
          setUser({ ...authUser, ...userDoc.data() });
        } else {
          setUser(authUser); 
        }
      } else {
        setUser(null); // No user is authenticated
      }

      setLoading(false); // Done loading after auth check and Firestore fetch
    });

    return () => unsubscribe(); // Clean up the subscription
  }, []);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {user ? (
        <Stack.Screen name="AppStack" component={AppStackNavigator} />
      ) : (
        <Stack.Screen name="AuthStack" component={AuthStackNavigator} />
      )}
    </Stack.Navigator>
  );
};

export default StackNavigator;
