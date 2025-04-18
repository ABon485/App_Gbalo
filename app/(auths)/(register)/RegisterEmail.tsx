import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  ScrollView,
  ImageBackground,
  StatusBar,
  Alert,
} from "react-native";
import { Stack, useRouter } from "expo-router";
import CustomButtonRN from "@/components/common/customButtonRN";
import api from "@/config/api";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { ApiResponse } from "@/types/api";
import { RegisterType } from "@/types/user";

export default function RegisterEmail() {
  const router = useRouter();
  const [userName, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = () => {
    router.push("/(auths)/(Login)/login");
  };

  const handleRegister = async () => {
    if (!userName || !email || !password || !confirmPassword) {
      Alert.alert("Lỗi", "Vui lòng nhập đầy đủ thông tin");
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert("Lỗi", "Mật khẩu xác nhận không khớp");
      return;
    }

    setLoading(true);

    try {
      const formData: RegisterType = {
        userName,
        email,
        password,
        confirmPassword,
      };

      const response: ApiResponse = await api.post(
        "/Accounts/Register",
        formData
      ); // Sửa lỗi chính tả nếu cần
      if (response.success) {
        await AsyncStorage.setItem(
          "data",
          JSON.stringify({
            token: response.data.token,
            user: response.data.user,
          })
        );
        Alert.alert("Thành công", "Đăng ký thành công!");
        router.replace("/(auths)/(register)/veryfyPhone");
      } else {
        Alert.alert("Lỗi", response.message || "Đăng ký thất bại");
      }
    }
    catch (error) {
      // Alert.alert("Lỗi", error.message || "Có lỗi xảy ra, vui lòng thử lại");
    } finally {
      setLoading(false);
    }
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
          <View className="items-center mb-24 mt-6">
            <Image
              source={require("../../../assets/images/imagLogo.png")}
              resizeMode="contain"
            />
          </View>

          <View className="bg-white rounded-t-3xl px-6 py-4 shadow-md">
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
              Tên người dùng <Text className="text-red-500">*</Text>
            </Text>

            <TextInput
              placeholder="Nhập tên người dùng"
              value={userName}
              onChangeText={setUserName}
              className="border border-gray-300 rounded-full px-4 py-3 mt-1 mb-4"
            />

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
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              className="border border-gray-300 rounded-full px-4 py-3 mt-1 mb-4"
            />

            <Text
              style={{
                fontFamily: "Mulish-ExtraBold",
                fontSize: 16,
                color: "black",
              }}
            >
              Mật khẩu
            </Text>

            <TextInput
              placeholder="Nhập mật khẩu"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              className="border border-gray-300 rounded-full px-4 py-3 mt-1 mb-4"
            />

            <Text
              style={{
                fontFamily: "Mulish-ExtraBold",
                fontSize: 16,
                color: "black",
              }}
            >
              Xác nhận mật khẩu
            </Text>

            <TextInput
              placeholder="Xác nhận mật khẩu"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              secureTextEntry
              className="border border-gray-300 rounded-full px-4 py-3 mt-1 mb-4"
            />

            <Text
              style={{
                fontFamily: "Inter-Extra",
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

            <CustomButtonRN
              title={loading ? "Đang xử lý..." : "Tiếp tục"}
              onPress={handleRegister}
              // disabled={loading}
            />

            {/* Divider */}
            <View className="flex-row items-center my-4">
              <View className="flex-1 h-px bg-gray-300" />
              <Text className="mx-2 text-black">Hoặc</Text>
              <View className="flex-1 h-px bg-gray-300" />
            </View>

            {/* Social buttons */}
            <TouchableOpacity className="flex-row items-center border border-gray-300 rounded-full py-3 px-4 mb-3">
              <Image
                source={require("../../../assets/images/social/Phone.png")}
              />
              <Text className="ml-16">Tiếp tục với số điện thoại</Text>
            </TouchableOpacity>

            <TouchableOpacity className="flex-row items-center border border-gray-300 rounded-full py-3 px-4 mb-3">
              <Image
                source={require("../../../assets/images/social/Google.png")}
              />
              <Text className="ml-16">Tiếp tục với Google</Text>
            </TouchableOpacity>

            <TouchableOpacity className="flex-row items-center border border-gray-300 rounded-full py-3 px-4">
              <Image
                source={require("../../../assets/images/social/Facebook.png")}
              />
              <Text className="ml-16">Tiếp tục với Facebook</Text>
            </TouchableOpacity>

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
