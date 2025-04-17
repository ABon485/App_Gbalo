import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  Image,
} from "react-native";
import { AntDesign } from "@expo/vector-icons";
import { Stack, useRouter } from "expo-router";
import CustomButtonRN from "@/components/common/customButtonRN/index";

const data = [
  {
    title: "Du lịch mạo hiểm",
    icon: require("../../../assets/images/hobbies/mountain.png"),
  },
  {
    title: "Kỳ nghỉ bãi biển",
    icon: require("../../../assets/images/hobbies/beach.png"),
  },
  {
    title: "Kỳ nghỉ thành phố",
    icon: require("../../../assets/images/hobbies/skyscraper.png"),
  },
  {
    title: "Khám phá văn hóa",
    icon: require("../../../assets/images/hobbies/history.png"),
  },
  {
    title: "Nơi nghỉ thư giãn",
    icon: require("../../../assets/images/hobbies/hotel.png"),
  },
  {
    title: "Du lịch ẩm thực",
    icon: require("../../../assets/images/hobbies/foods.png"),
  },
  {
    title: "Kỳ nghỉ du thuyền",
    icon: require("../../../assets/images/hobbies/ship.png"),
  },
  {
    title: "Phòng trưng bày nghệ thuật",
    icon: require("../../../assets/images/hobbies/art.png"),
  },
  {
    title: "Chuyến đi ngắm động vật hoang dã",
    icon: require("../../../assets/images/hobbies/animals.png"),
  },
  {
    title: "Du lịch một mình",
    icon: require("../../../assets/images/hobbies/tourism.png"),
  },
  {
    title: "Chuyến đi đường bộ",
    icon: require("../../../assets/images/hobbies/road.png"),
  },
  {
    title: "Cắm trại",
    icon: require("../../../assets/images/hobbies/campingTent.png"),
  },
  {
    title: "Du lịch gia đình",
    icon: require("../../../assets/images/hobbies/familyTravel.png"),
  },
  {
    title: "Du lịch lịch sử",
    icon: require("../../../assets/images/hobbies/history.png"),
  },
];

const Hobbies = () => {
  const router = useRouter();
  const [showMore, setShowMore] = useState(false);
  const visibleData = showMore ? data : data.slice(0, 7);

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <SafeAreaView className="flex-1 bg-white px-5 pt-12">
        {/* Header */}
        <View className="flex-row items-center mt-2.5">
          <TouchableOpacity onPress={() => router.replace("/welcome/date")}>
            <AntDesign name="arrowleft" size={24} color="black" />
          </TouchableOpacity>
          <View className="w-4/5 flex-row h-2 bg-gray-300 rounded ml-4 overflow-hidden">
            <View className="w-[100%] bg-orange-500" />
            <View className="flex-1" />
          </View>
        </View>

        {/* Title */}
        <Text className="text-xl font-bold mt-10 mb-4">
          Sở thích du lịch của bạn là gì?
        </Text>

        {/* List */}
        <View className="flex-1">
          <ScrollView showsVerticalScrollIndicator={false} className="mb-4">
            {visibleData.map((item, index) => (
              <TouchableOpacity
                key={index}
                className="flex-row items-center border border-gray-300 rounded-xl px-4 py-3 space-x-2 mb-3"
              >
                <Image
                  source={item.icon}
                  className="w-6 h-6"
                  resizeMode="contain"
                />
                <Text className="text-base font-medium ml-4">{item.title}</Text>
              </TouchableOpacity>
            ))}

            {/* Toggle Button */}
            <TouchableOpacity
              className="items-center mt-2 mb-4"
              onPress={() => setShowMore(!showMore)}
            >
              <Text className="text-black font-semibold underline">
                {showMore ? "Ẩn bớt" : "Xem thêm"}
              </Text>
            </TouchableOpacity>
          </ScrollView>
        </View>

        {/* Finish Button */}
        <View className="pb-6">
          <CustomButtonRN
            title="Tiếp tục"
            onPress={() => router.replace("/(tabs)/assistant")}
          />
        </View>
      </SafeAreaView>
    </>
  );
};

export default Hobbies;
