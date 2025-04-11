import React from "react";
import { View, Text, ImageBackground, Dimensions } from "react-native";

const { width, height } = Dimensions.get("window");

const Intro1 = () => {
  return (
    <ImageBackground
      source={require("@/assets/images/image3.png")}
      style={{ width, height }} 
    >
      <View className="flex-1 bg-black/30 justify-end pb-[150px] px-5">
        <View className="w-full">
          <Text className="text-white text-[30px] font-bold mb-4">
            Explore the world easily
          </Text>
          <Text className="text-white text-base">To your desire</Text>
        </View>
      </View>
    </ImageBackground>
  );
};

export default Intro1;
