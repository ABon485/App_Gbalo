import React, { useEffect, useRef } from "react";
import { View, Text, Image, Animated } from "react-native";
import { router, Stack } from "expo-router";

const SplashScreen = () => {
  const letters = ["b", "a", "l", "o"];
  const animations = letters.map(() => useRef(new Animated.Value(0)).current);
  const fadeOutAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.sequence(
      animations.map((anim) =>
        Animated.timing(anim, {
          toValue: 1,
          duration: 900,
          useNativeDriver: true,
        })
      )
    ).start(() => {
      Animated.timing(fadeOutAnim, {
        toValue: 0,
        duration: 600,
        useNativeDriver: true,
      }).start(() => {
        router.replace("./onboarding");
      });
    });
  }, []);

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <View className="flex-1 bg-white justify-center items-center">
        <Animated.View style={{ opacity: fadeOutAnim }}>
          <View className="flex-row items-center space-x-2">
            <Image
              source={require("@/assets/images/Gbalo_logo.png")}
              className="w-30 h-30 ml-8"
              resizeMode="contain"
            />
            <View className="flex-row">
              {letters.map((letter, index) => (
                <Animated.Text
                  key={index}
                  style={{
                    opacity: animations[index],
                    transform: [
                      {
                        translateY: animations[index].interpolate({
                          inputRange: [0, 1],
                          outputRange: [20, 0],
                        }),
                      },
                    ],
                    top: 17,
                    fontSize: 55,
                    lineHeight: 120,
                    color:
                      index === 0
                        ? "#FFE700"
                        : index === 1
                        ? "#65B741"
                        : index === 2
                        ? "#00CCDD"
                        : "#A5158C",
                  }}
                >
                  {letter}
                </Animated.Text>
              ))}
            </View>
          </View>
          <Image
            source={require("@/assets/images/Slash.png")}
            className="w-80 h-80"
            resizeMode="contain"
          />
        </Animated.View>
      </View>
    </>
  );
};

export default SplashScreen;
