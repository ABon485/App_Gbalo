"use client"
import { View, Text, TouchableOpacity, ScrollView, StatusBar, SafeAreaView } from "react-native"
import { useRouter } from "expo-router"
import { FileText, Tag, CreditCard, Star, Lock, Bell, Globe, ChevronRight, User } from "lucide-react-native"

export default function ProfileScreen() {
  const router = useRouter()

  const handleLogin = () => {
    router.push("/(auths)/(Login)/login")
  }

  const handleRegister = () => {
    router.replace("/(auths)/(register)/Register")
  }

  const menuItems = [
    { id: 1, title: "Đơn hàng", icon: <FileText size={20} color="#333" /> },
    { id: 2, title: "Ưu đãi của tôi", icon: <Tag size={20} color="#333" /> },
    { id: 3, title: "Phương thức thanh toán", icon: <CreditCard size={20} color="#333" /> },
    { id: 4, title: "Đánh giá của tôi", icon: <Star size={20} color="#333" /> },
    { id: 5, title: "Đăng nhập và mật khẩu", icon: <Lock size={20} color="#333" /> },
    { id: 6, title: "Cài đặt thông báo", icon: <Bell size={20} color="#333" /> },
    { id: 7, title: "Ngôn ngữ", icon: <Globe size={20} color="#333" /> },
  ]

  return (
    <SafeAreaView className="flex-1 bg-gray-100">
      <StatusBar barStyle="dark-content" />
      <ScrollView className="flex-1">
        <View className="px-5 py-3">
          <Text className="text-xl font-bold text-black">Hồ sơ</Text>
        </View>

        <View className="bg-white rounded-3xl mx-4 mb-4 p-5">
          <Text className="text-xl font-bold text-black mb-4">Hồ sơ</Text>

          <View className="flex-row items-center mb-4">
            <View className="w-16 h-16 rounded-full bg-gray-200 justify-center items-center mr-4">
              <User size={30} color="#999" />
            </View>

            <View className="flex-row flex-1 justify-end">
              <TouchableOpacity className="bg-[#FF5722] py-2 px-6 rounded-full mr-3" onPress={handleLogin}>
                <Text className="text-white font-medium text-sm">Đăng nhập</Text>
              </TouchableOpacity>

              <TouchableOpacity
                className="bg-white py-2 px-6 rounded-full border border-[#FF5722]"
                onPress={handleRegister}
              >
                <Text className="text-[#FF5722] font-medium text-sm">Đăng kí</Text>
              </TouchableOpacity>
            </View>
          </View>

          <View className="flex-row items-center">
            <Text className="text-gray-500 text-xs flex-1 leading-4">
              Đăng ký/Đăng nhập để trở thành thành viên và nhận được nhiều voucher từ Giao
            </Text>
            <View className="ml-2">
              <FileText size={18} color="#999" />
            </View>
          </View>
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
                <Text className="ml-3 text-sm text-gray-800">{item.title}</Text>
              </View>
              <ChevronRight size={18} color="#999" />
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}
