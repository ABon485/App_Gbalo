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
import CustomButtonRN from "@/components/common/customButtonRN";

export default function RegisterEmail() {
  const router = useRouter();

  const handleLogin = () => {
    router.push("/(auths)/(Login)/login");
  };
  const VerifyPhone = () => {
    router.push("/(auths)/(register)/veryfyPhone");
  };
  const HandleRegister = () => {
    router.push("/(auths)/(register)/Register");
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
          className="pt-12"
        >
          {/* Logo */}
          <View className="items-center mb-auto mt-1">
            <Image
              source={require("../../../assets/images/imagLogo.png")}
              resizeMode="contain"
            />
          </View>

          {/* Form */}
          <View className="bg-white rounded-t-3xl px-6 py-4 shadow-md">
            <Text className="text-3xl text-center mb-4" style={{ fontFamily:"Inter-Black"}}>Đăng ký</Text>

            <Text className="font-semibold" style={{ fontFamily:"Inter-Black"}}>
              Email <Text className="text-red-500">*</Text>
            </Text>
            <TextInput
            style={{ fontFamily:"Inter-Medium"}}
              placeholder="Nhập email"
              keyboardType="email-address"
              className="border border-gray-300 rounded-full px-4 py-2 mt-1 mb-4"
            />

            <Text className="text-xs text-gray-500 mb-4" style={{ fontFamily:"Inter-Medium"}}>
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
              <Text className="mx-2 text-gray-500" style={{ fontFamily:"Inter-Medium"}}>Hoặc</Text>
              <View className="flex-1 h-px bg-gray-300" />
            </View>

            {/* Social buttons */}
            <TouchableOpacity className=" h-[43px] flex-row items-center border border-gray-300 rounded-full py-3 px-4 mb-3" onPress={HandleRegister}>
              <Image
                source={require("../../../assets/images/social/Phone.png")}
              />
              <Text className="ml-12" style={{ fontFamily:"Inter-Medium"}}>Tiếp tục với số điện thoại</Text>
            </TouchableOpacity>

            <TouchableOpacity className=" h-[43px] flex-row items-center border border-gray-300 rounded-full py-3 px-4 mb-3">
              <Image
                source={require("../../../assets/images/social/Google.png")}
              />
              <Text className="ml-[55px]" style={{ fontFamily:"Inter-Medium"}}>Tiếp tục với Google</Text>
            </TouchableOpacity>

            <TouchableOpacity className="h-[43px] flex-row items-center border border-gray-300 rounded-full py-3 px-4">
              <Image
                source={require("../../../assets/images/social/Facebook.png")}
              />
              <Text className="ml-[45px]" style={{ fontFamily:"Inter-Medium"}}>Tiếp tục với Facebook</Text>
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