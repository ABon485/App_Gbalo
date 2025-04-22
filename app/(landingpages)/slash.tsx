import React, { useEffect, useRef } from "react";
import { View, Text, Image, Animated, StyleSheet } from "react-native";
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
      <View style={styles.container}>
        <Animated.View style={{ opacity: fadeOutAnim }}>
          <View style={styles.logoRow}>
            <Image
              source={require("@/assets/images/Gbalo_logo.png")}
              style={styles.logo}
              resizeMode="contain"
            />
            <View style={styles.letterRow}>
              {letters.map((letter, index) => (
                <Animated.Text
                  key={index}
                  style={[
                    styles.letter,
                    {
                      opacity: animations[index],
                      transform: [
                        {
                          translateY: animations[index].interpolate({
                            inputRange: [0, 1],
                            outputRange: [20, 0],
                          }),
                        },
                      ],
                      color:
                        index === 0
                          ? "#FFE700"
                          : index === 1
                          ? "#65B741"
                          : index === 2
                          ? "#00CCDD"
                          : "#A5158C",
                    },
                  ]}
                >
                  {letter}
                </Animated.Text>
              ))}
            </View>
          </View>
          <Image
            source={require("@/assets/images/Slash.png")}
            style={styles.slash}
            resizeMode="contain"
          />
        </Animated.View>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
    justifyContent: "center",
    alignItems: "center",
  },
  logoRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  logo: {
    width: 120,
    height: 120,
    marginLeft: 32,
  },
  letterRow: {
    flexDirection: "row",
  },
  letter: {
    fontSize: 55,
    lineHeight: 120,
    position: "relative",
    top: 17,
  },
  slash: {
    width: 320,
    height: 320,
  },
});

export default SplashScreen;
