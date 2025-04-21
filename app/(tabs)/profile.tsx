"use client"
import { useState, useEffect } from "react"
import { View, Text, TouchableOpacity, ScrollView, StatusBar, SafeAreaView, Image } from "react-native"
import { useRouter } from "expo-router"
import { FileText, Tag, CreditCard, Star, Lock, Bell, Globe, ChevronRight, User } from "lucide-react-native"
import AsyncStorage from "@react-native-async-storage/async-storage"
import { useToast } from "@/context/ToastContext"

export default function ProfileScreen() {
  const router = useRouter();
  const { showToast } = useToast();

  // State để lưu thông tin người dùng và trạng thái đăng nhập
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState<{ userName?: string } | null>(null);

  // Kiểm tra trạng thái đăng nhập khi component được mount
  useEffect(() => {
    const checkLoginStatus = async () => {
      try {
        const data = await AsyncStorage.getItem("data");
        if (data) {
          const parsedData = JSON.parse(data);
          setUser(parsedData.user); // Lấy thông tin user từ AsyncStorage
          setIsLoggedIn(true); // Đánh dấu trạng thái đăng nhập
        }
      } catch (error) {
        console.error("Lỗi khi kiểm tra trạng thái đăng nhập:", error);
      }
    };
    checkLoginStatus();
  }, []);

  const handleLogin = () => {
    router.push("/(auths)/(Login)/login");
  };

  const handleRegister = () => {
    router.replace("/(auths)/(register)/Register");
  };

  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem("data"); // Xóa dữ liệu đăng nhập
      setIsLoggedIn(false); // Cập nhật trạng thái
      setUser(null); // Xóa thông tin user
      showToast({
        type: "success",
        heading: "Thành công",
        message: "Đăng xuất thành công!",
      });
      router.replace("/(auths)/(Login)/login"); // Chuyển hướng về màn hình đăng nhập
    } catch (error) {
      showToast({
        type: "error",
        heading: "Lỗi",
        message: "Đăng xuất thất bại, vui lòng thử lại",
      });
    }
  };

  const handleUpdateProfile = () => {
    router.push("/(tabs)/homepage"); // Điều hướng đến trang cập nhật thông tin (bạn cần tạo route này)
  };

  const menuItems = [
    { id: 1, title: "Đơn hàng", icon: <FileText size={20} color="#333" /> },
    { id: 2, title: "Ưu đãi của tôi", icon: <Tag size={20} color="#333" /> },
    { id: 3, title: "Phương thức thanh toán", icon: <CreditCard size={20} color="#333" /> },
    { id: 4, title: "Đánh giá của tôi", icon: <Star size={20} color="#333" /> },
    { id: 5, title: "Đăng nhập và mật khẩu", icon: <Lock size={20} color="#333" /> },
    { id: 6, title: "Cài đặt thông báo", icon: <Bell size={20} color="#333" /> },
    { id: 7, title: "Ngôn ngữ", icon: <Globe size={20} color="#333" /> },
  ];

  return (
    <SafeAreaView className="flex-1 bg-gray-100">
      <StatusBar barStyle="dark-content" />
      <ScrollView className="flex-1">
        <View className="bg-white rounded-3xl mx-4 mb-4 p-5 mt-10">
          <Text className="text-xl text-black mb-4" style={{ fontFamily: "Inter-Medium" }}>
            Hồ sơ
          </Text>

          {isLoggedIn ? (
            // Giao diện khi đã đăng nhập
            <View>
              <View className="flex-row items-center mb-4">
                <Image
                  source={require("@/assets/images/icon.png")} // Thay bằng hình ảnh thực tế nếu có
                  className="w-16 h-16 rounded-full mr-4"
                />
                <View className="flex-1">
                  <Text className="text-lg font-semibold text-black" style={{ fontFamily: "Inter-Medium" }}>
                    {user?.userName || "Chị Thanh"} {/* Hiển thị userName */}
                  </Text>
                  <TouchableOpacity onPress={handleUpdateProfile}>
                    <Text className="text-blue-500 text-sm" style={{ fontFamily: "Inter-Medium" }}>
                      Cập nhật thông tin cá nhân
                    </Text>
                  </TouchableOpacity>
                </View>
                <View className="bg-purple-500 rounded-full w-8 h-8 justify-center items-center">
                  <Text className="text-white font-bold">T</Text>
                </View>
              </View>

              <View className="flex-row items-center">
                <Text className="text-gray-500 text-xs flex-1 leading-4" style={{ fontFamily: "Inter-Medium" }}>
                  Đăng ký để trở thành thành viên bạch kim. Cần 120 điểm nữa để đạt hạng Vàng
                </Text>
                <View className="ml-2">
                  <FileText size={18} color="#999" />
                </View>
              </View>
            </View>
          ) : (
            // Giao diện khi chưa đăng nhập
            <View>
              <View className="flex-row items-center mb-4">
                <View className="w-16 h-16 rounded-full bg-gray-200 justify-center items-center mr-4">
                  <User size={30} color="#999" />
                </View>

                <View className="flex-row flex-1 justify-end">
                  <TouchableOpacity className="bg-[#FF5722] py-2 px-6 rounded-full mr-3" onPress={handleLogin}>
                    <Text className="text-white font-medium text-sm" style={{ fontFamily: "Inter-Medium" }}>
                      Đăng nhập
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    className="bg-white py-2 px-6 rounded-full border border-[#FF5722]"
                    onPress={handleRegister}
                  >
                    <Text className="text-[#FF5722] font-medium text-sm" style={{ fontFamily: "Inter-Medium" }}>
                      Đăng kí
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>

              <View className="flex-row items-center">
                <Text className="text-gray-500 text-xs flex-1 leading-4" style={{ fontFamily: "Inter-Medium" }}>
                  Đăng ký/Đăng nhập để trở thành thành viên và nhận được nhiều voucher từ Giao
                </Text>
                <View className="ml-2">
                  <FileText size={18} color="#999" />
                </View>
              </View>
            </View>
          )}
        </View>

        <View className="bg-white rounded-3xl mx-4 overflow-hidden">
          {menuItems.map((item, index) => (
            <TouchableOpacity
              key={item.id}
              className={`flex-row items-center justify-between py-3.5 px-5 ${
                index < menuItems.length - 1 ? "border-b border-gray-100" : ""
              }`}
            >
              <View className="flex-row items-center">
                {item.icon}
                <Text className="ml-3 text-sm text-gray-800" style={{ fontFamily: "Inter-Medium" }}>
                  {item.title}
                </Text>
              </View>
              <ChevronRight size={18} color="#999" />
            </TouchableOpacity>
          ))}

          {isLoggedIn && (
            // Nút đăng xuất chỉ hiển thị khi đã đăng nhập
            <TouchableOpacity
              className="flex-row items-center justify-between py-3.5 px-5 border-t border-gray-100"
              onPress={handleLogout}
            >
              <Text className="text-sm text-red-500" style={{ fontFamily: "Inter-Medium" }}>
                Đăng xuất
              </Text>
            </TouchableOpacity>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}