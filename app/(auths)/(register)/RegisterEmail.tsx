import React from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  ScrollView,
  ImageBackground,
} from "react-native";
import { Stack, useRouter } from "expo-router";

export default function RegisterEmail() {
  const router = useRouter();

  const handleLogin = () => {
    router.push("/(auths)/(Login)/login");
  };
  const VerifyPhone = () => {
    router.push("/(auths)/(register)/veryfyPhone");
  };

  return (
    <>
      <Stack.Screen
        name="/(auths)/(register)/Register"
        options={{ headerShown: false }}
      />
      <ImageBackground
        source={require("../../../assets/images/BackGroud.png")}
        style={{ flex: 1, width: "100%", minHeight: "100%" }}
      >
        <ScrollView
          contentContainerStyle={{ flexGrow: 1 }}
          className="bg-white pt-12"
        >
          {/* Logo */}
          <View className="items-center mb-40 mt-1">
            <Image
              source={require("../../../assets/images/imagLogo.png")}
              resizeMode="contain"
            />
          </View>

          {/* Form */}
          <View className="bg-white rounded-t-3xl px-6 py-4 shadow-md">
            <Text className="text-2xl font-bold text-center mb-4">Đăng ký</Text>

            <Text className="font-semibold">
              Email <Text className="text-red-500">*</Text>
            </Text>
            <TextInput
              placeholder="Nhập email"
              keyboardType="email-address"
              className="border border-gray-300 rounded-full px-4 py-2 mt-1 mb-4"
            />

            <Text className="text-xs text-gray-500 mb-4">
              Chúng tôi sẽ gọi điện hoặc nhắn tin cho bạn để xác nhận số điện
              thoại. Có áp dụng phí dữ liệu và phí tin nhắn tiêu chuẩn.
              <Text className="text-blue-500 underline">
                {" "}
                Chính sách về quyền riêng tư
              </Text>
            </Text>

            {/* Tiếp tục */}
            <TouchableOpacity
              className="bg-orange-600 rounded-full py-3 items-center mb-4"
              onPress={VerifyPhone}
            >
              <Text className="text-white font-semibold text-base">
                Tiếp tục
              </Text>
            </TouchableOpacity>

            {/* Divider */}
            <View className="flex-row items-center my-4">
              <View className="flex-1 h-px bg-gray-300" />
              <Text className="mx-2 text-gray-500">Hoặc</Text>
              <View className="flex-1 h-px bg-gray-300" />
            </View>

            {/* Social buttons */}
            <TouchableOpacity className=" h-[43px] flex-row items-center border border-gray-300 rounded-full py-3 px-4 mb-3">
              <Image
                source={require("../../../assets/images/social/Phone.png")}
              />
              <Text className="ml-20">Tiếp tục với số điện thoại</Text>
            </TouchableOpacity>

            <TouchableOpacity className=" h-[43px] flex-row items-center border border-gray-300 rounded-full py-3 px-4 mb-3">
              <Image
                source={require("../../../assets/images/social/Google.png")}
              />
              <Text className="ml-20">Tiếp tục với Google</Text>
            </TouchableOpacity>

            <TouchableOpacity className="h-[43px] flex-row items-center border border-gray-300 rounded-full py-3 px-4">
              <Image
                source={require("../../../assets/images/social/Facebook.png")}
              />
              <Text className="ml-20">Tiếp tục với Facebook</Text>
            </TouchableOpacity>

            {/* Login link */}
            <View className="flex-row justify-center items-center mt-3">
              <Text>Bạn đã có tài khoản? </Text>
              <TouchableOpacity onPress={handleLogin}>
                <Text className="text-blue-500 underline">Đăng nhập</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </ImageBackground>
    </>
  );
}