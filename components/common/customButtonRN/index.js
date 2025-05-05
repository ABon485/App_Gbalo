import React from "react";
import { TouchableOpacity, Text } from "react-native";
import styles from "./styles";

const CustomButtonRN = ({
  title,
  onPress,
  backgroundColor = "#f97316", 
  textColor = "#fff", 
  disabled = false, 
}) => {
  return (
    <TouchableOpacity
      style={[
        styles.button,
        { backgroundColor: disabled ? "#cccccc" : backgroundColor }, 
      ]}
      onPress={onPress}
      disabled={disabled} 
    >
      <Text
        style={[
          styles.text,
          { color: disabled ? "#666666" : textColor }, 
        ]}
      >
        {title}
      </Text>
    </TouchableOpacity>
  );
};

export default CustomButtonRN;
