import React, { useRef, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  ScrollView,
  Alert,
  ImageBackground,
} from "react-native";
import { Stack, useRouter } from "expo-router";
import CustomButtonRN from "@/components/common/customButtonRN";

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
      <ImageBackground
        source={require("../../../assets/images/BackGroud.png")}
        style={{ flex: 1, width: "100%", height: "100%" }}
      >
        <ScrollView contentContainerStyle={{ flexGrow: 1 }} className="pt-12">
          {/* Logo */}
          <View className="items-center mb-20 mt-10">
            <Image
              source={require("../../../assets/images/imagLogo.png")}
              resizeMode="contain"
            />
          </View>

          {/* Form container */}
          <View className="bg-white rounded-t-3xl px-6 py-8 shadow-md">
            <Text
              style={{
                fontFamily: "Inter-Black",
                fontSize: 24,
                color: "black",
                textAlign:"center"
              }}
            >
              Xác thực số điện thoại của bạn
            </Text>
            <Text
              style={{
                fontFamily: "Inter-Medium",
                fontSize: 16,
                color: "black",
                textAlign:"center"
              }}
            >
              Vui lòng nhập mã xác nhận vừa gửi qua SĐT
            </Text>
            <Text
              style={{
                fontFamily: "Inter-Medium",
                fontSize: 16,
                textAlign:"center",
                color: "red",
                marginBottom: 15,
              }}
            >
              039****267
            </Text>

            {/* OTP inputs */}
            <View className="flex-row justify-center gap-x-1 mb-20">
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
            <CustomButtonRN title="Tiếp tục" onPress={handleContinue} />

            {/* Resend button */}
            <TouchableOpacity
              className="border border-gray-400 rounded-full py-3 items-center mb-40 mt-7"
              onPress={handleResend}
            >
              <Text className="text-base text-black" style={{ fontFamily:"Inter-Black" }}>Gửi lại</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </ImageBackground>
    </>
  );
}
