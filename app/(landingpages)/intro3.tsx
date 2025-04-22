import React from "react";
import {
  View,
  Text,
  ImageBackground,
  Dimensions,
  StyleSheet,
} from "react-native";

const { width, height } = Dimensions.get("window");

const Intro1 = () => {
  return (
    <ImageBackground
      source={require("@/assets/images/image3.png")}
      style={styles.background}
    >
      <View style={styles.overlay}>
        <View style={styles.textContainer}>
          <Text style={styles.title}>Explore the world easily</Text>
          <Text style={styles.subtitle}>To your desire</Text>
        </View>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: {
    width,
    height,
  },
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.3)",
    justifyContent: "flex-end",
    paddingBottom: 150,
    paddingHorizontal: 20,
  },
  textContainer: {
    width: "100%",
  },
  title: {
    fontFamily: "Mulish-ExtraBold",
    fontSize: 36,
    color: "white",
  },
  subtitle: {
    fontFamily: "Inter-Light",
    fontSize: 24,
    color: "white",
  },
});

export default Intro1;
