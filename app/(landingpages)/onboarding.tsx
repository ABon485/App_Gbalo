import React, { useState, useRef } from "react";
import {
  View,
  FlatList,
  Dimensions,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { AntDesign } from "@expo/vector-icons";
import { router, Stack } from "expo-router";

import Intro1 from "./intro1";
import Intro2 from "./intro2";
import Intro3 from "./intro3";

const { width } = Dimensions.get("window");

const Onboarding = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const flatListRef = useRef<FlatList<any>>(null);

  const slides = [
    { key: "intro1", component: <Intro1 /> },
    { key: "intro2", component: <Intro2 /> },
    { key: "intro3", component: <Intro3 /> },
  ];

  const renderItem = ({
    item,
  }: {
    item: { key: string; component: JSX.Element };
  }) => {
    return <View style={styles.slide}>{item.component}</View>;
  };

  const handleNext = () => {
    if (currentIndex < slides.length - 1) {
      flatListRef.current?.scrollToIndex({
        index: currentIndex + 1,
        animated: true,
      });
      setCurrentIndex(currentIndex + 1);
    } else {
      router.replace("/(screens)/welcome/welcome");
    }
  };

  const onScroll = (event: {
    nativeEvent: { contentOffset: { x: number } };
  }) => {
    const contentOffsetX = event.nativeEvent.contentOffset.x;
    const newIndex = Math.round(contentOffsetX / width);
    if (newIndex !== currentIndex) {
      setCurrentIndex(newIndex);
    }
  };

  const renderPagination = () => (
    <View style={styles.paginationContainer}>
      <View style={styles.paginationRow}>
        <View style={styles.dotsContainer}>
          {slides.map((_, index) => (
            <View
              key={index}
              style={[
                styles.dot,
                index === currentIndex ? styles.dotActive : styles.dotInactive,
              ]}
            />
          ))}
        </View>
        <TouchableOpacity style={styles.nextButton} onPress={handleNext}>
          <AntDesign name="rightcircle" size={40} color="white" />
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <View style={styles.container}>
        <FlatList
          ref={flatListRef}
          data={slides}
          renderItem={renderItem}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onScroll={onScroll}
          scrollEventThrottle={16}
          keyExtractor={(item) => item.key}
        />
        {renderPagination()}
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  slide: {
    width: width,
    flex: 1,
  },
  paginationContainer: {
    position: "absolute",
    bottom: 40,
    left: 0,
    right: 0,
    paddingHorizontal: 20,
  },
  paginationRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  dotsContainer: {
    flexDirection: "row",
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginHorizontal: 5,
  },
  dotActive: {
    backgroundColor: "#ea580c", // Tailwind's orange-600
  },
  dotInactive: {
    backgroundColor: "#d1d5db", // Tailwind's gray-300
  },
  nextButton: {
    width: 50,
    height: 50,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 25,
  },
});

export default Onboarding;
