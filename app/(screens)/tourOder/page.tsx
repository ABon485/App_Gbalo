"use client";

import React, { useState, useRef, useCallback } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Dimensions,
} from "react-native";
import { useRouter } from "expo-router";
import { AntDesign } from "@expo/vector-icons";
import AllOder from "@/components/booking/headerOder/allOder";
import Pending from "@/components/booking/headerOder/pending-payment";
import Paid from "@/components/booking/headerOder/paid";
import Complete from "@/components/booking/headerOder/Complete-payment";

const { width } = Dimensions.get("window");

const TourListScreen = () => {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("Tất cả");
  const scrollViewRef = useRef<ScrollView>(null);
  const isScrolling = useRef(false); 
  const tabs = ["Tất cả", "Chờ thanh toán", "Đã thanh toán", "Hoàn thành"];

  const handleTabPress = useCallback(
    (tab: string, index: number) => {
      if (activeTab !== tab) {
        setActiveTab(tab);
        scrollViewRef.current?.scrollTo({ x: index * width, animated: true });
      }
    },
    [activeTab]
  );

  const handleScroll = useCallback(
    (event: any) => {
      if (isScrolling.current) return; 
      isScrolling.current = true;
      const offsetX = event.nativeEvent.contentOffset.x;
      const index = Math.round(offsetX / width);
      setActiveTab(tabs[index]);
      setTimeout(() => {
        isScrolling.current = false;
      }, 100); 
    },
    [tabs]
  );

  const handleBackPress = useCallback(() => {
    router.push("/(tabs)/profile");
  }, [router]);

  return (
    <View style={styles.container}>
      {/* Header with Back Button */}
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBackPress} style={styles.backButton}>
          <AntDesign name="arrowleft" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Đơn hàng</Text>
      </View>

      {/* Tabs */}
      <View style={styles.tabContainer}>
        {tabs.map((tab, index) => (
          <TouchableOpacity
            key={tab}
            onPress={() => handleTabPress(tab, index)}
            style={styles.tab}
          >
            <Text
              style={[
                styles.tabText,
                activeTab === tab && styles.activeTabText,
              ]}
            >
              {tab}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Swipeable Content */}
      <ScrollView
        ref={scrollViewRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={handleScroll}
        style={styles.scrollView}
        scrollEventThrottle={16} // Optimize scroll event frequency
      >
        <View style={styles.page}>
          <AllOder />
        </View>
        <View style={styles.page}>
          <Pending />
        </View>
        <View style={styles.page}>
          <Paid />
        </View>
        <View style={styles.page}>
          <Complete />
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
    marginTop: 10,
  },
  header: {
    height: 60,
    backgroundColor: "#fff",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    marginTop: 15,
  },
  backButton: {
    padding: 10,
  },
  headerTitle: {
    flex: 1,
    fontSize: 20,
    fontWeight: "bold",
  },
  tabContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingVertical: 10,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  tab: {
    paddingHorizontal: 5,
  },
  tabText: {
    fontSize: 14,
    color: "#333",
  },
  activeTabText: {
    fontWeight: "bold",
    color: "#ff4500",
    textDecorationLine: "underline",
  },
  scrollView: {
    flex: 1,
  },
  page: {
    width: width,
    flex: 1,
  },
});

export default TourListScreen;
