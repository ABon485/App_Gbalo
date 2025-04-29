import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  ScrollView,
  ImageBackground,
} from "react-native";
import styles from "@/styles/auth/register/veryfyEmail";
import { useRouter, useLocalSearchParams } from "expo-router";
import CustomButtonRN from "@/components/common/customButtonRN";
import api from "@/config/api";
import { ApiResponse } from "@/types/api";
import { useToast } from "@/context/ToastContext";

export default function VerifyEmail() {
  const router = useRouter();
  const { email } = useLocalSearchParams<{ email: string }>();
  const [otp, setOtp] = useState(["1", "2", "3", "4", "5", "6"]);
  const [loading, setLoading] = useState(false);
  const inputRefs = useRef<TextInput[]>([]);
  const { showToast } = useToast();
  const [isButtonDisabled, setIsButtonDisabled] = useState(true); // Trạng thái nút "Tiếp tục"

  useEffect(() => {
    // Kiểm tra mã OTP khi nó thay đổi
    const isValidOtp =
      otp.join("").length === 6 && otp.every((digit) => /^\d$/.test(digit));
    setIsButtonDisabled(!isValidOtp); // Nếu mã OTP chưa đủ 6 chữ số hoặc có ký tự không hợp lệ, vô hiệu hóa nút
  }, [otp]);

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
      showToast({
        type: "error",
        message: "Vui lòng nhập đầy đủ mã xác nhận",
      });
      return;
    }

    setLoading(true);
    setTimeout(() => {
      showToast({
        type: "success",
        message: "Xác minh OTP thành công!",
      });
      router.push({
        pathname: "/(auths)/(register)/registerEmail/confirmEmail",
        params: { email },
      });
      setLoading(false);
    }, 500);
  };

  const handleResend = async () => {
    try {
      const response: ApiResponse = await api.post(
        "/Accounts/SendResgiterCode",
        { email }
      );
      if (response.success) {
        showToast({
          type: "success",
          message: "Đã gửi lại mã OTP!",
        });
      } else {
        showToast({
          type: "error",
          message: response.message || "Gửi lại OTP thất bại",
        });
      }
    } catch (error: any) {
      showToast({
        type: "error",
        message: error.message || "Có lỗi xảy ra, vui lòng thử lại",
      });
    }
  };

  return (
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

          <CustomButtonRN
            title="Tiếp tục"
            onPress={handleContinue}
            disabled={isButtonDisabled}
            backgroundColor={
              isButtonDisabled
                ? styles.disabledButton.backgroundColor
                : styles.activeButton.backgroundColor
            }
            textColor={
              isButtonDisabled
                ? styles.disabledButton.color
                : styles.activeButton.color
            }
          />

          {/* Resend button */}
          <TouchableOpacity style={styles.resendButton} onPress={handleResend}>
            <Text style={styles.resendText}>Gửi lại</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </ImageBackground>
  );
}
