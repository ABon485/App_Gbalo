import React, { useRef, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  ScrollView,
  Alert,
} from "react-native";
import { Stack, useRouter } from "expo-router";

export default function VerifyPhone() {
  const router = useRouter();
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);

  const inputRefs = useRef<TextInput[]>([]);

  const handleOtpChange = (text: string, index: number) => {
    if (/^\d*$/.test(text)) {
      const newOtp = [...otp];
      newOtp[index] = text;
      setOtp(newOtp);

      if (text && index < 5) {
        inputRefs.current[index + 1]?.focus();
      }
    }
  };

  const handleContinue = () => {
    const code = otp.join("");
    if (code.length < 6) {
      Alert.alert("Lỗi", "Vui lòng nhập đầy đủ mã xác nhận");
      return;
    }

    // Gửi mã về server hoặc điều hướng tiếp
    Alert.alert("Xác thực", `Mã xác nhận là: ${code}`);
    router.push("/(auths)/(register)/confirm");
  };

  const handleResend = () => {
    Alert.alert("Gửi lại", "Đã gửi lại mã xác nhận.");
    // Gọi API gửi lại mã OTP ở đây
  };

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />

      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        className="bg-white pt-12"
      >
        {/* Logo */}
        <View className="items-center mb-40">
          <Image
            source={require("../../../assets/images/imagLogo.png")}
            resizeMode="contain"
          />
        </View>

        {/* Form container */}
        <View className="bg-white rounded-t-3xl px-6 py-8 shadow-md">
          <Text className="text-xl font-bold text-center mb-1">
            Xác thực số điện thoại của bạn
          </Text>
          <Text className="text-center text-gray-600 mb-3">
            Vui lòng nhập mã xác nhận vừa gửi qua SĐT
          </Text>
          <Text className="text-center text-red-500 font-semibold mb-4"></Text>

          {/* OTP inputs */}
          <View className="flex-row justify-center space-x-2 mb-20">
            {otp.map((digit, index) => (
              <TextInput
                key={index}
                ref={(ref) => {
                  if (ref) inputRefs.current[index] = ref;
                }}
                keyboardType="numeric"
                maxLength={1}
                value={digit}
                onChangeText={(text) => handleOtpChange(text, index)}
                className="border border-gray-400 text-xl text-center w-12 h-12 rounded-md"
              />
            ))}
          </View>

          {/* Continue button */}
          <TouchableOpacity
            className="bg-orange-600 rounded-full py-3 items-center mb-6"
            onPress={handleContinue}
          >
            <Text className="text-white font-semibold text-base">Tiếp tục</Text>
          </TouchableOpacity>

          {/* Resend button */}
          <TouchableOpacity
            className="border border-gray-400 rounded-full py-3 items-center mb-40"
            onPress={handleResend}
          >
            <Text className="text-base text-black">Gửi lại</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </>
  );
}
