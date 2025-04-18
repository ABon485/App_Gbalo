import React from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  ScrollView,
  ImageBackground,
  StatusBar,
} from "react-native";
import { Stack, useRouter } from "expo-router";
import CustomButtonRN from "@/components/common/customButtonRN";

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
        <StatusBar translucent backgroundColor="transparent" />
        <ScrollView contentContainerStyle={{ flexGrow: 1 }} className="pt-12">
          {/* Logo */}
          <View className="items-center mb-24 mt-6">
            <Image
              source={require("../../../assets/images/imagLogo.png")}
              resizeMode="contain"
            />
          </View>

          {/* Form */}
          <View className="bg-white rounded-t-3xl px-6 shadow-md">
            <Text
              style={{
                fontFamily: "Mulish-ExtraBold",
                fontSize: 30,
                color: "black",
                textAlign: "center",
                margin: 5,
              }}
            >
              Đăng ký
            </Text>

            <Text
              style={{
                fontFamily: "Mulish-ExtraBold",
                fontSize: 16,
                color: "black",
              }}
            >
              Email <Text className="text-red-500">*</Text>
            </Text>
            <TextInput
              placeholder="Nhập email"
              keyboardType="email-address"
              className="border border-gray-300 rounded-full px-4 py-3 mt-1 mb-4"
              style={{ fontFamily:"Inter-Medium" }}
            />

            <Text
              style={{
                fontFamily: "Inter-Medium",
                fontSize: 10,
                color: "black",
                marginBottom: 13,
              }}
            >
              Chúng tôi sẽ gọi điện hoặc nhắn tin cho bạn để xác nhận số điện
              thoại. Có áp dụng phí dữ liệu và phí tin nhắn tiêu chuẩn.
              <Text className="text-blue-500 underline">
                {" "}
                Chính sách về quyền riêng tư
              </Text>
            </Text>

            {/* Tiếp tục */}
            <CustomButtonRN title="Tiếp tục" onPress={VerifyPhone} />

            {/* Divider */}
            <View className="flex-row items-center my-4">
              <View className="flex-1 h-px bg-gray-300" />
              <Text
                style={{
                  fontFamily: "Inter-Medium",
                  fontSize: 16,
                  color: "black",
                }}
              >
                Hoặc
              </Text>
              <View className="flex-1 h-px bg-gray-300" />
            </View>

            {/* Social buttons */}
            <TouchableOpacity className="flex-row items-center border border-gray-300 rounded-full py-3 px-4 mb-3">
              <Image
                source={require("../../../assets/images/social/Phone.png")}
              />
              <Text className="ml-16" style={{ fontFamily:"Inter-Medium" }}>Tiếp tục với số điện thoại</Text>
            </TouchableOpacity>

            <TouchableOpacity className="flex-row items-center border border-gray-300 rounded-full py-3 px-4 mb-3">
              <Image
                source={require("../../../assets/images/social/Google.png")}
              />
              <Text className="ml-16" style={{ fontFamily:"Inter-Medium" }}>Tiếp tục với Google</Text>
            </TouchableOpacity>

            <TouchableOpacity className="flex-row items-center border border-gray-300 rounded-full py-3 px-4">
              <Image
                source={require("../../../assets/images/social/Facebook.png")}
              />
              <Text className="ml-16" style={{ fontFamily:"Inter-Medium" }}>Tiếp tục với Facebook</Text>
            </TouchableOpacity>

            {/* Login link */}
            <View className="flex-row justify-center items-center mt-3">
              <Text style={{ fontFamily:"Inter-Medium" }}>Bạn đã có tài khoản? </Text>
              <TouchableOpacity onPress={handleLogin}>
                <Text className="text-blue-500 underline" style={{ fontFamily:"Inter-Medium" }}>Đăng nhập</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </ImageBackground>
    </>
  );
}
