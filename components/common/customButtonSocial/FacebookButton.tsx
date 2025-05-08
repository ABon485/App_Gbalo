"use client";

import { TouchableOpacity, Image, Text, StyleSheet } from "react-native";

// Define prop types
interface FacebookButtonProps {
  onPress: () => void;
//   disabled:Boolean;

}

// Use React.FC with typed props
const FacebookButton: React.FC<FacebookButtonProps> = ({ onPress }) => {
  return (
    <TouchableOpacity style={styles.socialButton} onPress={onPress}>
      <Image source={require("@/assets/images/Facebook.png")} className="w-6 h-6" />
      <Text style={styles.socialButtonText}>Tiếp tục với Facebook</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  socialButton: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    height: 43,
    backgroundColor: "white",
    borderRadius: 25,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#ddd",
    paddingHorizontal: 15,
  },
  socialButtonText: {
    fontSize: 13,
    color: "#333",
    flex: 1,
    textAlign: "center",
    paddingRight: 23,
    fontFamily: 'Inter-Medium'
  }
});

export default FacebookButton;