import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import StackNavigator from './Navigator/StackNavigator';
import { ModalProvider } from "./Components/ModalContext";

const App = () => {
  return (
    <ModalProvider>
      <NavigationContainer>
        <StackNavigator />
      </NavigationContainer>
    </ModalProvider>
  );
};

export default App;
