import React from "react";
import { TouchableOpacity, Text } from "react-native";
import styles from "./styles";

const CustomButtonRN = ({
  title,
  onPress,
  backgroundColor = "#f97316",
  textColor = "#fff",
}) => {
  return (
    <TouchableOpacity
      style={[styles.button, { backgroundColor }]}
      onPress={onPress}
    >
      <Text style={[styles.text, { color: textColor, fontFamily: "Inter-ExtraBold" }]}>
        {title}
      </Text>
    </TouchableOpacity>
  );
};

export default CustomButtonRN;
