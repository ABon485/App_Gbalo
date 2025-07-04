import {
  View,
  Text,
  FlatList,
  Image,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from "react-native";
import React, { useState, useEffect } from "react";
import Ionicons from "@expo/vector-icons/Ionicons";
import AntDesign from "@expo/vector-icons/AntDesign";
import Feather from "@expo/vector-icons/Feather";
import { router } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import tourApi from "@/services/tour";
import { CartItem } from "@/types/tour";
import Order from "@/components/booking/order";

export default function CartScreen() {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [showOrderModal, setShowOrderModal] = useState(false);
  const [user, setUser] = useState<any>(null);

  // Load giỏ hàng từ API
  const loadCart = async () => {
    try {
      const userData = await AsyncStorage.getItem("data");
      const userInfo = userData ? JSON.parse(userData) : null;
      setUser(userInfo);

      if (!userInfo?.id) {
        console.warn("Không tìm thấy ID người dùng");
        return;
      }

      const response = await tourApi.GetCart(userInfo.id);
      console.log("Cart Items:", JSON.stringify(response, null, 2));

      if (!Array.isArray(response)) {
        console.warn("Dữ liệu giỏ hàng không hợp lệ:", response);
        setCartItems([]);
        return;
      }

      // Khởi tạo selected là false cho tất cả item nếu chưa có
      const initializedItems = response.map((item) => ({
        ...item,
        selected: item.selected ?? false,
      }));
      setCartItems(initializedItems);
    } catch (error) {
      console.error("Không thể tải giỏ hàng:", error);
      setCartItems([]);
    }
  };

  useEffect(() => {
    loadCart();
  }, []);

  // Xử lý nhấn checkbox
  const toggleCheckbox = (itemId: number) => {
    setCartItems((prevItems) =>
      prevItems.map((item) =>
        item.id === itemId
          ? { ...item, selected: !item.selected }
          : { ...item, selected: false }
      )
    );
  };

  // Xử lý xóa item hoặc giỏ hàng
  const handleDelete = async () => {
  try {
    const userData = await AsyncStorage.getItem("data");
    const userInfo = userData ? JSON.parse(userData) : null;
    if (!userInfo) {
      console.warn("Không tìm thấy thông tin người dùng");
      Alert.alert("Lỗi", "Vui lòng đăng nhập lại.");
      return;
    }
    const customerId = userInfo.customerId || userInfo.id;
    console.log("Customer ID used:", customerId);

    const selectedItems = cartItems.filter((item) => item.selected);
    if (selectedItems.length > 0) {
      const itemIds = selectedItems.map((item) => item.id);
      console.log("Item IDs to remove:", itemIds);
      const response = await tourApi.RemoveCartItem(itemIds);
      if (response && response.success !== false) {
        const updatedItems = cartItems.filter((item) => !itemIds.includes(item.id));
        setCartItems(updatedItems);
      } else {
        throw new Error(response?.message || "Xóa mục thất bại");
      }
    } else {
      Alert.alert("Thông báo", "Vui lòng chọn ít nhất một mục để xóa.");
    }
  } catch (error: any) {
    console.error("Lỗi khi xóa giỏ hàng:", {
      message: error.message,
      status: error?.response?.status,
      data: error?.response?.data,
      stack: error.stack,
    });
    Alert.alert(
      "Lỗi",
      `Không thể xóa giỏ hàng. Mã lỗi: ${error?.response?.status || "Không xác định"} - ${error?.response?.data?.message || "Vui lòng thử lại sau."}`
    );
  }
};

  // Tính tổng tiền cho các item được chọn
  const calculateTotal = () => {
    return cartItems
      .filter((item) => item.selected)
      .reduce((sum, item) => sum + item.price * item.quantity, 0);
  };

  // Đếm số item được chọn
  const countSelectedItems = () => {
    return cartItems.filter((item) => item.selected).length;
  };

  // Xử lý nhấn nút thanh toán
  const handleBookTour = async () => {
    try {
      const userData = await AsyncStorage.getItem("data");
      const userInfo = userData ? JSON.parse(userData) : null;
      if (!userInfo) {
        alert("Vui lòng đăng nhập để đặt tour.");
        router.push("/(auths)/(Login)/login");
        return;
      }

      const selectedItems = cartItems.filter((item) => item.selected);
      if (selectedItems.length === 0) {
        alert("Vui lòng chọn ít nhất một tour để thanh toán!");
        return;
      }

      setShowOrderModal(true);
    } catch (error) {
      console.error("Lỗi khi kiểm tra thông tin người dùng:", error);
      alert("Không thể kiểm tra thông tin người dùng.");
      router.push("/(auths)/(Login)/login");
    }
  };

  const renderItem = ({ item }: { item: CartItem }) => (
    <View style={styles.itemContainer}>
      <View style={styles.row}>
        <TouchableOpacity
          style={[
            styles.checkbox,
            { backgroundColor: item.selected ? "#F24E1E" : "#fff" },
          ]}
          onPress={() => toggleCheckbox(item.id)}
        >
          {item.selected && <AntDesign name="check" size={16} color="#fff" />}
        </TouchableOpacity>
        <Image
          source={{ uri: item.imageUrl || "https://via.placeholder.com/75" }}
          style={styles.image}
        />
        <View style={styles.info}>
          <Text style={styles.title}>
            {item.tourName || "Tên tour không có"}
          </Text>
          {item.rating > 0 && (
            <View style={styles.ratingContainer}>
              <Text style={styles.rating}>{item.rating.toFixed(1)}</Text>
              <Ionicons name="star" size={12} style={styles.star} />
            </View>
          )}
          <Text style={styles.location}>
            {item.province || "Không có tỉnh"}
          </Text>
          <Text style={styles.date}>
            Ngày khởi hành:{" "}
            {new Date(item.departureDate ?? "").toLocaleDateString("vi-VN")}
          </Text>
          <View style={styles.rowBetween}>
            <Text style={styles.guests}>Khách: {item.quantity}</Text>
            <Text style={styles.price}>{item.price.toLocaleString()}đ</Text>
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
          <Text style={styles.itemCount}>({cartItems.length})</Text>
        </View>

        <TouchableOpacity style={styles.rightIcon} onPress={handleDelete}>
          <Feather name="trash-2" size={20} color="black" />
        </TouchableOpacity>
      </View>

      {/* Danh sách */}
      <FlatList
        data={cartItems}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 80 }}
      />

      {/* Footer */}
      <View style={styles.footer}>
        <View>
          <Text style={styles.totalLabel}>Tổng cộng</Text>
          <Text style={styles.totalPrice}>
            {calculateTotal().toLocaleString()} đ
          </Text>
        </View>
        <TouchableOpacity
          style={[
            styles.checkoutBtn,
            // { opacity: countSelectedItems() === 0 ? 0.5 : 1 },
          ]}
          onPress={handleBookTour}
        // disabled={countSelectedItems() === 0}
        >
          <Text style={styles.checkoutText}>
            Thanh toán
          </Text>
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
    alignItems: "center",
    justifyContent: "center",
    marginTop: 45,
  },
  image: {
    width: 90,
    height: 100,
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
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    marginBottom: 2,
  },
  star: {
    color: "red",
  },
  location: {
    fontSize: 12,
    color: "#777",
  },
  date: {
    fontSize: 12,
    color: "#000000",
  },
  rowBetween: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 4,
  },
  guests: {
    fontSize: 12,
    color: "#000000",
  },
  price: {
    color: "#F24E1E",
    fontWeight: "bold",
    marginTop: 6,
    left: 30,
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
