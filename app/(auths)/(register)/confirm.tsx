import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  ScrollView,
  ImageBackground,
  Alert,
} from "react-native";
import { router, Stack, useRouter } from "expo-router";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import CustomButtonRN from "@/components/common/customButtonRN";
import api from "@/config/api";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { ApiResponse } from "@/types/api";
import { RegisterType } from "@/types/user";

export default function Confirm() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
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
        "/Accounts/Resgiter",
        formData
      );
      if (response.success) {
        await AsyncStorage.setItem(
          "data",
          JSON.stringify({
            token: response.data.token,
            user: response.data.user,
          })
        );
        Alert.alert("Thành công", "Đăng ký thành công!");
        router.replace("/(auths)/(Login)/login");
      } else {
        Alert.alert("Lỗi", response.message || "Đăng ký thất bại");
      }
    } catch (error: any) {
      Alert.alert("Lỗi", error.message || "Có lỗi xảy ra, vui lòng thử lại");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <ImageBackground
        source={require("../../../assets/images/BackGroud.png")}
        style={{ flex: 1, width: "100%", height: "100%" }}
      >
        <ScrollView contentContainerStyle={{ flexGrow: 1 }} className="pt-12">
          <View className="items-center mb-20 mt-6">
            <Image
              source={require("../../../assets/images/imagLogo.png")}
              resizeMode="contain"
            />
          </View>

          <View className="bg-white rounded-t-6xl px-6 py-8 shadow-md">
            <Text
              style={{
                fontFamily: "Inter-Black",  
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
                fontFamily: "Inter-Medium",
                fontSize: 16,
                color: "black",
              }}
            >
              Họ và tên <Text className="text-red-500">*</Text>
            </Text>
            <TextInput
            style={{
              fontFamily: "Inter-Medium",
            }}
              placeholder="Nhập tên của bạn"
              className=" h-[43px] border border-gray-300 rounded-full px-4 mt-1 mb-4"
              value={userName}
              onChangeText={(text) => setUserName(text)}
            />

            {/* Email */}
            <Text
              style={{
                fontFamily: "Inter-Medium",
                fontSize: 16,
                color: "black",
              }}
            >
              Email <Text className="text-red-500">*</Text>
            </Text>
            <TextInput
             style={{
              fontFamily: "Inter-Medium",
            }}
              placeholder="Email của bạn"
              keyboardType="email-address"
              className="h-[43px] border border-gray-300 rounded-full px-4 mt-1 mb-4"
              value={email}
              onChangeText={(text) => setEmail(text)}
            />

            {/* Mật khẩu */}
            <Text
              style={{
                fontFamily: "Inter-Medium",
                fontSize: 16,
                color: "black",
              }}
            >
              Mật khẩu <Text className="text-red-500">*</Text>
            </Text>
            <View className=" h-[43px] flex-row items-center border border-gray-300 rounded-full px-4 mt-1 mb-4">
              <TextInput
               style={{
                fontFamily: "Inter-Medium",
              }}
                placeholder="Nhập mật khẩu"
                secureTextEntry={!showPassword}
                className="flex-1"
                value={password}
                onChangeText={(text) => setPassword(text)}
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
                fontFamily: "Inter-Medium",
                fontSize: 16,
                color: "black",
              }}
            >
              Xác nhận mật khẩu <Text className="text-red-500">*</Text>
            </Text>
            <View className="h-[43px] flex-row items-center border border-gray-300 rounded-full px-4 mt-1 mb-6">
              <TextInput
               style={{
                fontFamily: "Inter-Medium",
              }}
                placeholder="Nhập lại mật khẩu"
                secureTextEntry={!showConfirm}
                className="flex-1"
                value={confirmPassword}
                onChangeText={(text) => setConfirmPassword(text)}
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
            <CustomButtonRN title="Tiếp tục" onPress={handleRegister} />

            {/* Chính sách */}
            <Text
              style={{
                fontFamily: "Inter-Medium",
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
