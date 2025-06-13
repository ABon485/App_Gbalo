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
import AntDesign from "@expo/vector-icons/AntDesign";
import styles from "@/styles/auth/register/veryfyEmail";
import { useRouter, useLocalSearchParams } from "expo-router";
import CustomButtonRN from "@/components/common/customButtonRN";
import api from "@/config/api";
import { ApiResponse } from "@/types/api";
import { useToast } from "@/context/ToastContext";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function VerifyEmail() {
  const router = useRouter();
  const { email } = useLocalSearchParams<{ email: string }>();
  const [otp, setOtp] = useState<string[]>(Array(6).fill(""));
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const inputRefs = useRef<(TextInput | null)[]>([]);
  const { showToast } = useToast();
  const [isButtonDisabled, setIsButtonDisabled] = useState(true);

  // Hide email for display
  const hideEmail = (email: string = ""): string => {
    if (!email) return "";
    const [name, domain] = email.split("@");
    if (name.length <= 2) return `${name[0]}***@${domain}`;
    return `${name.slice(0, 2)}${"*".repeat(name.length - 2)}@${domain}`;
  };

  // Validate email on mount
  useEffect(() => {
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      showToast({ type: "error", message: "Email không hợp lệ" });
    //   router.replace("/(auths)/(Login)/login");
    }
  }, [email, router, showToast]);

  // Validate OTP input
  useEffect(() => {
    const isValidOtp =
      otp.join("").length === 6 && otp.every((digit) => /^\d$/.test(digit));
    setIsButtonDisabled(!isValidOtp);
    if (errorMessage && isValidOtp) setErrorMessage("");
  }, [otp, errorMessage]);

  // Handle OTP input changes
  const handleOtpChange = (text: string, index: number) => {
    if (!/^\d?$/.test(text)) return;

    const newOtp = [...otp];
    newOtp[index] = text;
    setOtp(newOtp);

    if (text && index < 5) {
      inputRefs.current[index + 1]?.focus();
    } else if (!text && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  // Handle OTP verification
  const handleContinue = async () => {
    const code = otp.join("");
    console.log("OTP entered:", otp, "Code:", code);

    if (code.length !== 6) {
      setErrorMessage("Vui lòng nhập đầy đủ mã xác nhận");
      showToast({ type: "error", message: "Vui lòng nhập đầy đủ mã xác nhận" });
      return;
    }

    const token = await AsyncStorage.getItem("registerToken");
    console.log("Token from AsyncStorage:", token);
    if (!token) {
      setErrorMessage("Không tìm thấy token xác minh");
      showToast({
        type: "error",
        message: "Không tìm thấy token xác minh. Vui lòng thử lại từ đầu.",
      });
      return;
    }

    console.log("OTP code before check:", code);

    try {
      setLoading(true);
      console.log("Sending API request with:", { token, code });
      const response = await api.post<ApiResponse>(
        "/Accounts/VerifyChangeEmailCode",
        { token, code },
        { headers: { "Content-Type": "application/json-patch+json" } } 
      );
      console.log("API response:", response.data);

      if (response.data?.status === "Success") {
        showToast({ type: "success", message: "Xác minh OTP thành công!" });
        router.push("/(screens)/profile/profile");
      } else {
        setErrorMessage(response.data?.message || "Mã xác nhận không đúng!");
        showToast({
          type: "error",
          message: response.data?.message || "Mã xác nhận không đúng!",
        });
      }
    } catch (error) {
      if (typeof error === "object" && error !== null && "response" in error) {
        // @ts-ignore
        console.error("API error:", error.response?.data || error.message);
      } else {
        console.error("API error:", error);
      }
      let errorMsg = "Có lỗi xảy ra khi xác minh OTP";
      if (
        typeof error === "object" &&
        error !== null &&
        "response" in error &&
        // @ts-ignore
        error.response?.data?.message
      ) {
        // @ts-ignore
        errorMsg = error.response.data.message;
      }
      setErrorMessage(errorMsg);
      showToast({ type: "error", message: errorMsg });
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    try {
      setLoading(true);
      const token = await AsyncStorage.getItem("registerToken");
      console.log("Current token before resend:", token);

      const response = await api.post<ApiResponse>(
        "/Accounts/SendChangeEmailCode",
        { email },
        { headers: { "Content-Type": "application/json-patch+json" } }
      );
      console.log("SendChangeEmailCode response:", response.data);

      if (response.data?.status === "Success" && response.data?.data?.token) {
        await AsyncStorage.setItem("registerToken", response.data.data.token);
        console.log("Saved new token:", response.data.data.token);
        showToast({ type: "success", message: "Đã gửi lại mã OTP!" });
        setOtp(Array(6).fill(""));
        setErrorMessage("");
        inputRefs.current[0]?.focus();
      } else {
        setErrorMessage(response.data?.message || "Gửi lại OTP thất bại");
        showToast({
          type: "error",
          message: response.data?.message || "Gửi lại OTP thất bại",
        });
      }
    } catch (error) {
      if (
        typeof error === "object" &&
        error !== null &&
        "response" in error &&
        // @ts-ignore
        error.response?.data
      ) {
        // @ts-ignore
        console.error("Resend OTP error:", error.response?.data || error.message);
      } else {
        console.error("Resend OTP error:", error);
      }
      let errorMsg = "Có lỗi xảy ra khi gửi lại OTP";
      if (
        typeof error === "object" &&
        error !== null &&
        "response" in error &&
        // @ts-ignore
        error.response?.data?.message
      ) {
        // @ts-ignore
        errorMsg = error.response.data.message;
      }
      setErrorMessage(errorMsg);
      showToast({ type: "error", message: errorMsg });
    } finally {
      setLoading(false);
    }
  };

  return (
    <ImageBackground
      source={require("@/assets/images/BackGroud.png")}
      style={styles.backgroundImage}
    >
      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        <View style={styles.logoContainer}>
          <Image
            source={require("@/assets/images/imagLogo.png")}
            style={styles.logo}
            resizeMode="contain"
          />
        </View>

        <View style={styles.formContainer}>
          <Text style={styles.title}>Xác thực email của bạn</Text>
          <Text style={styles.subtitle}>
            Vui lòng nhập mã xác nhận vừa gửi qua email
          </Text>
          <Text style={styles.ShowEmail}>{hideEmail(email)}</Text>

          <View style={styles.otpContainer}>
            {otp.map((digit, index) => (
              <TextInput
                key={index}
                ref={(ref) => (inputRefs.current[index] = ref)}
                keyboardType="numeric"
                maxLength={1}
                value={digit}
                onChangeText={(text) => handleOtpChange(text, index)}
                style={[styles.otpInput, errorMessage && styles.otpInputError]}
                textContentType="oneTimeCode"
                autoFocus={index === 0}
              />
            ))}
          </View>

          {errorMessage && (
            <View style={styles.errorContainer}>
              <AntDesign name="exclamationcircleo" size={16} color="#FF4D4F" />
              <Text>{errorMessage}</Text>
            </View>
          )}

          <CustomButtonRN
            title={loading ? "Đang xử lý..." : "Tiếp tục"}
            onPress={handleContinue}
            disabled={isButtonDisabled || loading}
            backgroundColor={
              isButtonDisabled || loading
                ? styles.disabledButton.backgroundColor
                : styles.activeButton.backgroundColor
            }
            textColor={
              isButtonDisabled || loading
                ? styles.disabledButton.color
                : styles.activeButton.color
            }
          />

          <TouchableOpacity
            style={[styles.resendButton, loading && styles.disabledButton]}
            onPress={handleResend}
            disabled={loading}
          >
            <Text style={styles.resendText}>Gửi lại OTP</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </ImageBackground>
  );
}
