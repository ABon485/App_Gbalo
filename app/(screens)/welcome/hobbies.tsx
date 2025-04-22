import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  Image,
  StyleSheet,
} from "react-native";
import styles from "@/styles/welcome/hobbies";
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
      <SafeAreaView style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.replace("/welcome/date")}>
            <AntDesign name="arrowleft" size={24} color="black" />
          </TouchableOpacity>
          <View style={styles.progressWrapper}>
            <View style={styles.progressFill} />
            <View style={{ flex: 1 }} />
          </View>
        </View>

        {/* Title */}
        <Text style={styles.title}>Sở thích du lịch của bạn là gì?</Text>

        {/* List */}
        <View style={styles.listContainer}>
          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 16 }}>
            {visibleData.map((item, index) => (
              <TouchableOpacity key={index} style={styles.hobbyItem}>
                <Image
                  source={item.icon}
                  style={styles.hobbyIcon}
                  resizeMode="contain"
                />
                <Text style={styles.hobbyText}>{item.title}</Text>
              </TouchableOpacity>
            ))}

            {/* Toggle Button */}
            <TouchableOpacity
              style={styles.toggleBtn}
              onPress={() => setShowMore(!showMore)}
            >
              <Text style={styles.toggleText}>
                {showMore ? "Ẩn bớt" : "Xem thêm"}
              </Text>
            </TouchableOpacity>
          </ScrollView>
        </View>

        {/* Finish Button */}
        <View style={styles.buttonWrapper}>
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
