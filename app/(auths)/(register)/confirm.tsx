import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  ScrollView,
  ImageBackground,
} from "react-native";
import { router, Stack } from "expo-router";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import CustomButtonRN from "@/components/common/customButtonRN";

export default function Confirm() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const handleLogin = () => {
    router.push("/(auths)/(Login)/login");
  };
  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <ImageBackground
        source={require("../../../assets/images/BackGroud.png")}
        style={{ flex: 1, width: "100%", height: "100%" }}
      >
        <ScrollView contentContainerStyle={{ flexGrow: 1 }} className="pt-12">
          {/* Logo */}
          <View className="items-center mb-20 mt-6">
            <Image
              source={require("../../../assets/images/imagLogo.png")}
              resizeMode="contain"
            />
          </View>

          {/* Form */}
          <View className="bg-white rounded-t-6xl px-6 py-8 shadow-md">
            <Text
              style={{
                fontFamily: "Inter-Medium",
                fontSize: 24,
                textAlign: "center",
                color: "black",
              }}
            >
              Hoàn tất đăng ký
            </Text>

            {/* Họ và tên */}
            <Text
              style={{
                fontFamily: "Inter-Extra",
                fontSize: 16,
                color: "black",
              }}
            >
              Họ và tên <Text className="text-red-500">*</Text>
            </Text>
            <TextInput
              placeholder="Nhập tên của bạn"
              className="border border-gray-300 rounded-full px-4 mt-1 mb-4"
            />

            {/* Email */}
            <Text
              style={{
                fontFamily: "Inter-Extra",
                fontSize: 16,
                color: "black",
              }}
            >
              Email <Text className="text-red-500">*</Text>
            </Text>
            <TextInput
              placeholder="Email của bạn"
              keyboardType="email-address"
              defaultValue="gbalovietnam@gmail.com"
              className="border border-gray-300 rounded-full px-4 mt-1 mb-4"
            />

            {/* Mật khẩu */}
            <Text
              style={{
                fontFamily: "Inter-Extra",
                fontSize: 16,
                color: "black",
              }}
            >
              Mật khẩu <Text className="text-red-500">*</Text>
            </Text>
            <View className="flex-row items-center border border-gray-300 rounded-full px-4 mt-1 mb-4">
              <TextInput
                placeholder="Nhập mật khẩu"
                secureTextEntry={!showPassword}
                className="flex-1"
              />
              <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                <FontAwesome
                  name={showPassword ? "eye" : "eye-slash"}
                  size={18}
                  color="black"
                />
              </TouchableOpacity>
            </View>

            {/* Xác nhận mật khẩu */}
            <Text
              style={{
                fontFamily: "Inter-Extra",
                fontSize: 16,
                color: "black",
              }}
            >
              Xác nhận mật khẩu <Text className="text-red-500">*</Text>
            </Text>
            <View className="flex-row items-center border border-gray-300 rounded-full px-4 mt-1 mb-6">
              <TextInput
                placeholder="Nhập lại mật khẩu"
                secureTextEntry={!showConfirm}
                className="flex-1"
              />
              <TouchableOpacity onPress={() => setShowConfirm(!showConfirm)}>
                <FontAwesome
                  name={showConfirm ? "eye" : "eye-slash"}
                  size={18}
                  color="black"
                />
              </TouchableOpacity>
            </View>

            {/* Tiếp tục */}
            <CustomButtonRN title="Tiếp tục" onPress={handleLogin} />

            {/* Chính sách */}
            <Text
              style={{
                fontFamily: "Inter-Extra",
                fontSize: 14,
                color: "black",
                top: 8,
                textAlign: "center",
              }}
            >
              Bằng việc chọn Đồng ý và tiếp tục, tôi đồng ý với{" "}
              <Text className="text-black font-semibold">
                Điều khoản dịch vụ
              </Text>{" "}
              và{" "}
              <Text className="text-black font-semibold">
                Chính sách của Gbalo
              </Text>
              , đồng thời chấp thuận{" "}
              <Text className="text-black font-semibold">
                Chính sách về quyền riêng tư
              </Text>
              .
            </Text>
          </View>
        </ScrollView>
      </ImageBackground>
    </>
  );
}
