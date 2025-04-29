import React, { useRef, useState, useEffect } from "react";
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
import styles from "@/styles/auth/register/veryfyPhone";
import { useRouter } from "expo-router";
import CustomButtonRN from "@/components/common/customButtonRN";

export default function VerifyPhone() {
  const router = useRouter();
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [isButtonDisabled, setIsButtonDisabled] = useState(true); // Trạng thái nút "Tiếp tục"
  const inputRefs = useRef<TextInput[]>([]);

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
      Alert.alert("Lỗi", "Vui lòng nhập đầy đủ mã xác nhận");
      return;
    }

    // Gửi mã về server hoặc điều hướng tiếp
    Alert.alert("Xác thực", `Mã xác nhận là: ${code}`);
    router.push("/(auths)/(register)/registerPhone/confirmPhone");
  };

  const handleResend = () => {
    Alert.alert("Gửi lại", "Đã gửi lại mã xác nhận.");
    // Gọi API gửi lại mã OTP ở đây
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
          <Text style={styles.title}>Xác thực số điện thoại của bạn</Text>
          <Text style={styles.subtitle}>
            Vui lòng nhập mã xác nhận vừa gửi qua SĐT
          </Text>
          <Text style={styles.phoneNumber}>039****267</Text>

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
            title="Tiếp tục"
            onPress={handleContinue}
            disabled={isButtonDisabled} 
            backgroundColor={
              isButtonDisabled ? styles.disabledButton.backgroundColor : styles.activeButton.backgroundColor
            }
            textColor={
              isButtonDisabled ? styles.disabledButton.color : styles.activeButton.color
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
