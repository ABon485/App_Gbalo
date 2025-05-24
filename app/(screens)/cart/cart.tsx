import {
  View,
  Text,
  FlatList,
  Image,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import React, { useState } from "react";
import Ionicons from "@expo/vector-icons/Ionicons";
import AntDesign from "@expo/vector-icons/AntDesign";
import Feather from "@expo/vector-icons/Feather";
import { router } from "expo-router";

const cartData = [
  {
    id: "1",
    title: "Tour sớm đến đồi BanaHill/Cầu vàng",
    location: "Đà Nẵng",
    rating: "4.95",
    reviews: 648,
    date: "06/05/2025",
    guests: "2 người lớn",
    price: "1.145.000 đ",
    image: require("@/assets/images/home/example.png"),
    selected: true,
  },
  {
    id: "2",
    title: "Tour sớm đến đồi BanaHill/Cầu vàng",
    location: "Đà Nẵng",
    rating: "4.95",
    reviews: 648,
    date: "06/05/2025",
    guests: "2 người lớn",
    price: "1.145.000 đ",
    image: require("@/assets/images/home/example.png"),
    selected: false,
  },
  {
    id: "3",
    title: "Tour sớm đến đồi BanaHill/Cầu vàng",
    location: "Đà Nẵng",
    rating: "4.95",
    reviews: 648,
    date: "06/05/2025",
    guests: "2 người lớn",
    price: "1.145.000 đ",
    image: require("@/assets/images/home/example.png"),
    selected: false,
  },
];

export default function CartScreen() {
  const [cartItems, setCartItems] = useState(cartData);

  const renderItem = ({ item }: any) => (
    <View style={styles.itemContainer}>
      <View style={styles.row}>
        <TouchableOpacity style={styles.checkbox}>
          {item.selected && <AntDesign name="check" size={16} color="#fff" />}
        </TouchableOpacity>
        <Image source={item.image} style={styles.image} />
        <View style={styles.info}>
          <Text style={styles.title}>{item.title}</Text>
          <Text style={styles.rating}>
            <Text style={styles.star}>★</Text> {item.rating}/5 ({item.reviews})
          </Text>
          <Text style={styles.location}>{item.location}</Text>
          <Text style={styles.date}>Ngày khởi hành: {item.date}</Text>
          <View style={styles.rowBetween}>
            <Text style={styles.guests}>Khách: {item.guests}</Text>
            <Text style={styles.price}>{item.price}</Text>
          </View>
        </View>
        <TouchableOpacity>
          <AntDesign name="edit" size={20} color="black" />
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={router.back} style={styles.leftIcon}>
          <AntDesign name="arrowleft" size={22} color="black" />
        </TouchableOpacity>

        <View style={styles.headerCenter}>
          <Text style={styles.headerTitle}>Giỏ hàng</Text>
          <Text style={styles.itemCount}>(4)</Text>
        </View>

        <TouchableOpacity style={styles.rightIcon}>
          <Feather name="trash-2" size={20} color="black" />
        </TouchableOpacity>
      </View>

      {/* Danh sách */}
      <FlatList
        data={cartItems}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 80 }}
      />

      {/* Footer */}
      <View style={styles.footer}>
        <View>
          <Text style={styles.totalLabel}>Tổng cộng</Text>
          <Text style={styles.totalPrice}>1.145.000đ</Text>
        </View>
        <TouchableOpacity style={styles.checkoutBtn}>
          <Text style={styles.checkoutText}>Thanh toán(1)</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingHorizontal: 18,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 40,
    paddingBottom: 10,
    borderBottomWidth: 0.5,
    borderColor: "#ddd",
    paddingHorizontal: 12,
  },

  leftIcon: {
    width: 40,
    alignItems: "flex-start",
  },

  rightIcon: {
    width: 40,
    alignItems: "flex-end",
  },

  headerCenter: {
    flexDirection: "row",
    flex: 1,
  },

  headerTitle: {
    fontSize: 18,
    fontWeight: "bold",
  },

  itemCount: {
    fontSize: 18,
    fontWeight: "bold",
    marginLeft: 4,
  },

  itemContainer: {
    paddingVertical: 10,
    borderBottomWidth: 0.5,
    borderColor: "#ddd",
  },
  row: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 10,
  },
  checkbox: {
    width: 18,
    height: 18,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 4,
    backgroundColor: "#F24E1E",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 4,
  },
  image: {
    width: 75,
    height: 75,
    borderRadius: 6,
  },
  info: {
    flex: 1,
  },
  title: {
    fontWeight: "bold",
    fontSize: 13,
    marginBottom: 2,
  },
  rating: {
    fontSize: 12,
    color: "#555",
  },
  star: {
    color: "#F24E1E",
  },
  location: {
    fontSize: 12,
    color: "#777",
  },
  date: {
    fontSize: 12,
    color: "#777",
  },
  rowBetween: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 4,
  },

  guests: {
    fontSize: 12,
    color: "#777",
  },
  price: {
    alignSelf: "flex-end",
    color: "#F24E1E",
    fontWeight: "bold",
    marginTop: 6,
  },
  footer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: "row",
    backgroundColor: "#fff",
    padding: 16,
    borderTopWidth: 0.5,
    borderColor: "#ccc",
    justifyContent: "space-between",
    alignItems: "center",
  },
  totalLabel: {
    fontSize: 12,
    fontWeight: "bold",
  },
  totalPrice: {
    fontSize: 18,
    color: "#F24E1E",
    fontWeight: "bold",
  },
  checkoutBtn: {
    backgroundColor: "#F24E1E",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 24,
  },
  checkoutText: {
    color: "#fff",
    fontWeight: "bold",
  },
});
