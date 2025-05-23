import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Fontisto, Ionicons, FontAwesome6 } from "@expo/vector-icons";
import { router } from "expo-router";

const SearchHeader = () => {
  const handleLoginPres = () => {
    router.push("/(screens)/search/searchTour");
  };

  const Notification = () => {
    router.push("/(screens)/notification/notification");
  };

  return (
    <View style={styles.headerContainer}>
      <TouchableOpacity
        style={styles.searchContainer}
        onPress={handleLoginPres}
        activeOpacity={0.8}
      >
        <FontAwesome6
          name="location-dot"
          size={20}
          color="#f97316"
          style={styles.searchIcon}
        />
        <Text style={styles.fakeInput}>Bạn muốn đi đâu?</Text>
        <View style={styles.searchButtonContainer}>
          <Ionicons name="search" size={18} color="#fff" />
        </View>
      </TouchableOpacity>

      <View style={styles.iconsContainer}>
        <View style={styles.iconWrapper}>
          <View style={styles.iconBackground}>
            <Ionicons name="cart-outline" size={22} color="#999999" />
          </View>
          <View style={styles.badge}>
            <Text style={styles.badgeText}>2</Text>
          </View>
        </View>
        <View style={styles.iconWrapper}>
          <TouchableOpacity onPress={Notification}>
            <View style={styles.iconBackground}>
              <Fontisto name="bell" size={20} color="#999999" />
            </View>
            <View style={styles.badge}>
              <Text style={styles.badgeText}>4</Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: "#fff",
  },
  searchContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 9999,
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderWidth: 1,
    borderColor: "#e0e0e0",
    height: 43,
  },
  searchIcon: {
    marginRight: 10,
  },
  fakeInput: {
    flex: 1,
    fontSize: 13,
    color: "#000",
    padding: 0,
    fontFamily: "Inter-Medium",
  },
  searchButtonContainer: {
    backgroundColor: "#f97316",
    width: 30,
    height: 30,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
  },
  iconsContainer: {
    flexDirection: "row",
    marginLeft: 2,
  },
  iconWrapper: {
    position: "relative",
    marginLeft: 2,
  },
  iconBackground: {
    backgroundColor: "#f5f5f5",
    width: 30,
    height: 30,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  badge: {
    position: "absolute",
    top: -2,
    right: -2,
    backgroundColor: "#f97316",
    borderRadius: 10,
    width: 14,
    height: 14,
    justifyContent: "center",
    alignItems: "center",
  },
  badgeText: {
    color: "#ffffff",
    fontSize: 10,
    fontWeight: "bold",
  },
});

export default SearchHeader;
