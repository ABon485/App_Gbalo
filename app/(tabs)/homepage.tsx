import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  SafeAreaView,
} from "react-native";

import Suggested from "@/app/(screens)/home/Suggested";
// import Recent from '@/components/home/Recent';
// import Popular from '@/components/home/Popular';
import SearchHeader from "@/components/home/search";
import DestinationSection from "@/app/(screens)/home/attractive";
import Banner from "@/components/banner";

const Home = () => {
  const [activeTab, setActiveTab] = useState("suggested");

  const renderContent = () => {
    return (
      <SafeAreaView style={styles.container}>
        <SearchHeader />
        <Banner />
        <View style={styles.tabsContainer}>
          <TouchableOpacity onPress={() => setActiveTab("suggested")}>
            <Text
              style={
                activeTab === "suggested"
                  ? styles.activeTabText
                  : styles.inactiveTabText
              }
            >
              Đề xuất
            </Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setActiveTab("recent")}>
            <Text
              style={
                activeTab === "recent"
                  ? styles.activeTabText
                  : styles.inactiveTabText
              }
            >
              Gần đây
            </Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setActiveTab("popular")}>
            <Text
              style={
                activeTab === "popular"
                  ? styles.activeTabText
                  : styles.inactiveTabText
              }
            >
              Trending
            </Text>
          </TouchableOpacity>
        </View>

        {activeTab === "suggested" && <Suggested />}
        {/* {activeTab === 'recent' && <Recent />}
        {activeTab === 'popular' && <Popular />} */}

        <DestinationSection />
      </SafeAreaView>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={[1]} // Dữ liệu giả để render 1 lần
        renderItem={renderContent}
        keyExtractor={() => "home-screen"}
        showsVerticalScrollIndicator={false}
        nestedScrollEnabled={true} // ✅ Cho phép nested scroll trong các FlatList con
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 30,
    backgroundColor: "white",
  },
  tabsContainer: {
    flexDirection: "row",
    justifyContent: "flex-start",
    paddingHorizontal: 16,
    paddingVertical: 24,
    gap: 16,
  },
  activeTabText: {
    fontSize: 15,
    color: "#f97316",
    fontFamily: "Inter-Medium",
  },
  inactiveTabText: {
    fontSize: 15,
    fontFamily: "Inter-Medium",
  },
});

export default Home;
