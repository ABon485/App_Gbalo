import React from "react";
import { View, Text, ImageBackground, Dimensions } from "react-native";

const { width, height } = Dimensions.get("window");

const Intro1 = () => {
  return (
    <ImageBackground
      source={require("@/assets/images/image1.png")}
      style={{ width, height }}
    >
      <View className="flex-1 bg-black/30 justify-end pb-[150px] px-5">
        <View className="w-full">
          <Text
            style={{ fontFamily: "Mulish-ExtraBold", fontSize: 36, color: "white" }}
          >
            Explore the world easily
          </Text>
          <Text
            style={{
              fontFamily: "Inter-Light",
              fontSize: 24,
              color: "white",
            }}
          >
            To your desire
          </Text>
        </View>
      </View>
    </ImageBackground>
  );
};

export default Intro1;
