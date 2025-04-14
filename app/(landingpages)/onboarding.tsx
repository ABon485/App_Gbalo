import React, { useState, useRef } from "react";
import { View, FlatList, Dimensions, TouchableOpacity } from "react-native";
import { AntDesign } from "@expo/vector-icons";
import { router } from "expo-router";

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
    return <View className="w-full flex-1">{item.component}</View>;
  };

  const handleNext = () => {
    if (currentIndex < slides.length - 1) {
      flatListRef.current?.scrollToIndex({
        index: currentIndex + 1,
        animated: true,
      });
      setCurrentIndex(currentIndex + 1);
    }
    else {
      // router.push("/landingpage/formIntro");
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
    <View className="absolute bottom-10 left-0 right-0 px-5">
      <View className="flex-row justify-between items-center">
        <View className="flex-row">
          {slides.map((_, index) => (
            <View
              key={index}
              className={`w-[10px] h-[10px] rounded-full mx-[5px] ${
                index === currentIndex ? "bg-orange-600" : "bg-gray-300"
              }`}
            />
          ))}
        </View>
        <TouchableOpacity
          className="w-[50px] h-[50px] justify-center items-center rounded-ful"
          onPress={handleNext}
        >
          <AntDesign name="rightcircle" size={40} color="white" />
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View className="flex-1 bg-white">
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
  );
};

export default Onboarding;
