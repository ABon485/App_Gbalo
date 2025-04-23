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
import styles from "@/styles/auth/register/veryfyEmail";
import { Stack, useRouter, useLocalSearchParams } from "expo-router";
import CustomButtonRN from "@/components/common/customButtonRN";
import api from "@/config/api";
import { ApiResponse } from "@/types/api";

export default function VerifyEmail() {
  const router = useRouter();
  const { email } = useLocalSearchParams<{ email: string }>();
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [loading, setLoading] = useState(false);
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

    // Bỏ qua gọi API và điều hướng thẳng đến ConfirmEmail
    setLoading(true);
    setTimeout(() => {
      Alert.alert("Thành công", "Xác minh OTP thành công!");
      router.push({
        pathname: "/(auths)/(register)/registerEmail/confirmEmail",
        params: { email },
      });
      setLoading(false);
    }, 500); // Giả lập thời gian xử lý
  };

  const handleResend = async () => {
    try {
      const response: ApiResponse = await api.post(
        "/Accounts/SendResgiterCode",
        {
          email,
        }
      );
      if (response.success) {
        Alert.alert("Thành công", "Đã gửi lại mã OTP!");
      } else {
        Alert.alert("Lỗi", response.message || "Gửi lại OTP thất bại");
      }
    } catch (error: any) {
      Alert.alert("Lỗi", error.message || "Có lỗi xảy ra, vui lòng thử lại");
    }
  };

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <ImageBackground
        source={require("../../../../assets/images/BackGroud.png")}
        style={styles.backgroundImage}
      >
        <ScrollView contentContainerStyle={styles.scrollViewContent}>
          {/* Logo */}
          <View style={styles.logoContainer}>
            <Image
              source={require("../../../../assets/images/imagLogo.png")}
              resizeMode="contain"
            />
          </View>

          {/* Form container */}
          <View style={styles.formContainer}>
            <Text style={styles.title}>Xác thực email của bạn</Text>
            <Text style={styles.subtitle}>
              Vui lòng nhập mã xác nhận vừa gửi qua email
            </Text>
            <Text style={styles.phoneNumber}>{email}</Text>

            {/* OTP inputs */}
            <View style={styles.otpContainer}>
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
                  style={styles.otpInput}
                />
              ))}
            </View>

            {/* Continue button */}
            <CustomButtonRN
              title={loading ? "Đang xác minh..." : "Tiếp tục"}
              onPress={handleContinue}
              // disabled={loading}
            />

            {/* Resend button */}
            <TouchableOpacity
              style={styles.resendButton}
              onPress={handleResend}
            >
              <Text style={styles.resendText}>Gửi lại</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </ImageBackground>
    </>
  );
}
