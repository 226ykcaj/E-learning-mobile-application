import {
    StyleSheet,
    Text,
    TextInput,
    TextInputProps,
    View,
  } from "react-native";
  import React, { useState } from "react";
  
  const AppTextInput = ({ ...otherProps }) => {
    const [focused, setFocused] = useState<boolean>(false);
    return (
      <TextInput
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        placeholderTextColor={"dark"}
        style={[
          {
            fontFamily: "poppins-regular",
            fontSize: 14,
            padding: 20,
            backgroundColor: "lightBlue",
            borderRadius: 10,
            marginVertical: 10,
          },
          focused && {
            borderWidth: 3,
            borderColor: "blue",
            shadowOffset: { width: 4, height: 10 },
            shadowColor: "blue",
            shadowOpacity: 0.2,
            shadowRadius: 10,
          },
        ]}
        {...otherProps}
      />
    );
  };
  
  export default AppTextInput;
  
  const styles = StyleSheet.create({});