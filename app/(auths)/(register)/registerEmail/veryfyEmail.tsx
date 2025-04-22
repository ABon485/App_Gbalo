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
  StyleSheet,
} from "react-native";
import styles from "@/styles/auth/register/veryfyEmail";
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
    router.push("/(auths)/(register)/registerEmail/confirmEmail");
  };

  const handleResend = () => {
    Alert.alert("Gửi lại", "Đã gửi lại mã xác nhận.");
    // Gọi API gửi lại mã OTP ở đây
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
            <Text style={styles.title}>Xác thực số email của bạn</Text>
            <Text style={styles.subtitle}>
              Vui lòng nhập mã xác nhận vừa gửi qua email
            </Text>
            <Text style={styles.phoneNumber}>...@gmail.com</Text>

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
            <CustomButtonRN title="Tiếp tục" onPress={handleContinue} />

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

