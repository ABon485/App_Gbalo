import React, { useRef, useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  ScrollView,
  ImageBackground,
} from "react-native";
import styles from "@/styles/auth/register/veryfyPhone";
import { useRouter, useLocalSearchParams } from "expo-router";
import CustomButtonRN from "@/components/common/customButtonRN";
import api from "@/config/api";
import { ApiResponse } from "@/types/api";
import { useToast } from "@/context/ToastContext";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { AntDesign } from "@expo/vector-icons";

export default function VerifyPhone() {
  const router = useRouter();
  const { phone } = useLocalSearchParams<{ phone: string }>();
  const [otp, setOtp] = useState<string[]>(Array(6).fill(""));
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const inputRefs = useRef<(TextInput | null)[]>([]);
  const { showToast } = useToast();
  const [isButtonDisabled, setIsButtonDisabled] = useState(true);

  const hidePhone = (phone: string = ""): string => {
    if (!phone) return "";
    return phone.replace(/(\+\d{1,3})(\d{3})\d{3}(\d{3})/, "$1$2***$3");
  };

  useEffect(() => {
    if (!phone || !/^\+?[0-9]{7,15}$/.test(phone)) {
      showToast({ type: "error", message: "Số điện thoại không hợp lệ" });
      router.replace("/(auths)/(Login)/login");
    }
  }, [phone, router, showToast]);

  useEffect(() => {
    const isValidOtp =
      otp.join("").length === 6 && otp.every((digit) => /^\d$/.test(digit));
    setIsButtonDisabled(!isValidOtp);
    if (errorMessage && isValidOtp) setErrorMessage("");
  }, [otp, errorMessage]);

  const handleOtpChange = (text: string, index: number) => {
    if (!/^\d?$/.test(text)) return;
    const newOtp = [...otp];
    newOtp[index] = text;
    setOtp(newOtp);
    if (text && index < 5) inputRefs.current[index + 1]?.focus();
    else if (!text && index > 0) inputRefs.current[index - 1]?.focus();
  };

  const handleContinue = async () => {
    const code = otp.join("");
    if (code.length !== 6) {
      setErrorMessage("Vui lòng nhập đầy đủ mã xác nhận");
      showToast({ type: "error", message: "Vui lòng nhập đầy đủ mã xác nhận" });
      return;
    }

    const token = await AsyncStorage.getItem("registerToken");
    if (!token) {
      setErrorMessage("Không tìm thấy token xác minh");
      showToast({
        type: "error",
        message: "Không tìm thấy token xác minh. Vui lòng thử lại từ đầu.",
      });
      return;
    }

    try {
      setLoading(true);
      const response = await api.post<ApiResponse>(
        "/Accounts/VerifyResgiterCode",
        { token, code },
        { headers: { "Content-Type": "application/json-patch+json" } }
      );

      if (response.data?.status === "Success") {
        showToast({ type: "success", message: "Xác minh OTP thành công!" });
        router.push({
          pathname: "/(auths)/(register)/registerPhone/confirmPhone",
          params: { phone, code },
        });
      } else {
        setErrorMessage(response.data?.message || "Mã xác nhận không đúng!");
        showToast({
          type: "error",
          message: response.data?.message || "Mã xác nhận không đúng!",
        });
      }
    } catch (error) {
      let errorMsg = "Có lỗi xảy ra khi xác minh OTP";
      if (
        error &&
        typeof error === "object" &&
        "response" in error &&
        (error as any).response?.data?.message
      ) {
        errorMsg = (error as any).response.data.message;
      }
      setErrorMessage(errorMsg);
      showToast({ type: "error", message: errorMsg });
      console.error(
        "VerifyResgiterCode error:",
        (error as any)?.response?.data || error
      );
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    try {
      setLoading(true);
      const response = await api.post<ApiResponse>(
        "/Accounts/SendResgiterCode",
        { type: "Phone", phone },
        { headers: { "Content-Type": "application/json-patch+json" } }
      );

      if (response.data?.status === "Success" && response.data?.data?.token) {
        await AsyncStorage.setItem("registerToken", response.data.data.token);
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
      let errorMsg = "Có lỗi xảy ra khi gửi lại OTP";
      if (
        error &&
        typeof error === "object" &&
        "response" in error &&
        (error as any).response?.data?.message
      ) {
        errorMsg = (error as any).response.data.message;
      }
      setErrorMessage(errorMsg);
      showToast({ type: "error", message: errorMsg });
      console.error(
        "Resend OTP error:",
        (error as any)?.response?.data || error
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <ImageBackground
      source={require("../../../../assets/images/BackGroud.png")}
      style={styles.backgroundImage}
    >
      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        <View style={styles.logoContainer}>
          <Image
            source={require("../../../../assets/images/imagLogo.png")}
            style={styles.logo}
            resizeMode="contain"
          />
        </View>

        <View style={styles.formContainer}>
          <Text style={styles.title}>Xác thực số điện thoại của bạn</Text>
          <Text style={styles.subtitle}>
            Vui lòng nhập mã xác nhận vừa gửi qua số điện thoại
          </Text>
          <Text style={styles.showEmail}>{hidePhone(phone)}</Text>

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
            <View style={styles.formContainer}>
              <AntDesign name="exclamationcircleo" size={16} color="#FF4D4F" />
              {/* <Text style={styles.errorText}>{errorMessage}</Text> */}
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
