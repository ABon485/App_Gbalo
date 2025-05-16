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
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const inputRefs = useRef<TextInput[]>([]);
  const [loading, setLoading] = useState(false);
  const [isButtonDisabled, setIsButtonDisabled] = useState(true);
  const { showToast } = useToast();
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const isValid = otp.every((char) => /^\d$/.test(char));
    setIsButtonDisabled(!(isValid && otp.join("").length === 6));
    if (errorMessage) setErrorMessage("");
  }, [otp]);

  const handleOtpChange = (text: string, index: number) => {
    if (/^\d?$/.test(text)) {
      const newOtp = [...otp];
      newOtp[index] = text;
      setOtp(newOtp);
      if (text && index < 5) inputRefs.current[index + 1]?.focus();
      else if (!text && index > 0) inputRefs.current[index - 1]?.focus();
    }
  };

  const handleContinue = async () => {
    const code = otp.join("");

    if (code.length < 6) {
      showToast({ type: "error", message: "Vui lòng nhập đầy đủ mã xác nhận" });
      return;
    }

    if (code !== "123456") {
      setErrorMessage(
        "Rất tiếc, chúng tôi không thể xác minh mã. Vui lòng đảm bảo bạn nhập đúng số điện thoại di động và mã."
      );
      return;
    }

    const token = await AsyncStorage.getItem("registerToken");

    if (!token) {
      showToast({
        type: "error",
        message: "Không tìm thấy token xác minh. Vui lòng thử lại.",
      });
      return;
    }

    try {
      setLoading(true);

      const response: ApiResponse = await api.post(
        "/Accounts/VerifyResgiterCode",
        { token, code: "123456" }
      );
      console.log("Response data:", response.data);

      if (response.success) {
        showToast({ type: "success", message: "Xác minh OTP thành công!" });
        router.push({
          pathname: "/(auths)/(register)/registerPhone/confirmPhone",
          params: { phone, code: "123456" },
        });
      } else {
        showToast({ type: "error", message: "Mã xác nhận không đúng!" });
      }
    } catch (error: any) {
      showToast({
        type: "error",
        message: error.message || "Có lỗi xảy ra, vui lòng thử lại",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    try {
      const token = await AsyncStorage.getItem("registerToken");

      if (!token) {
        showToast({ type: "error", message: "Không tìm thấy token xác minh" });
        return;
      }

      const response = await api.post(
        "/Accounts/SendResgiterCode",
        {
          phone, // gửi số điện thoại hiện tại
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const newToken = response.data?.data?.token;

      if (newToken) {
        await AsyncStorage.setItem("registerToken", newToken);

        showToast({
          type: "success",
          message: "Đã gửi lại mã OTP!",
        });

        setOtp(Array(6).fill(""));
        inputRefs.current[0]?.focus();
      } else {
        showToast({
          type: "error",
          message: "Không nhận được token mới từ server",
        });
      }
    } catch (error: any) {
      showToast({
        type: "error",
        message: error.message || "Có lỗi xảy ra, vui lòng thử lại",
      });
    }
  };

  const maskedPhone = phone?.replace(/(\d{3})\d{3}(\d{3})/, "$1***$2") || "";

  return (
    <ImageBackground
      source={require("../../../../assets/images/BackGroud.png")}
      style={styles.backgroundImage}
    >
      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        <View style={styles.logoContainer}>
          <Image
            source={require("../../../../assets/images/imagLogo.png")}
            resizeMode="contain"
          />
        </View>

        <View style={styles.formContainer}>
          <Text style={styles.title}>Xác thực số điện thoại của bạn</Text>
          <Text style={styles.subtitle}>
            Vui lòng nhập mã xác nhận đã được gửi đến số điện thoại
          </Text>
          <Text style={styles.phoneNumber}>{maskedPhone}</Text>

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
                style={[
                  styles.otpInput,
                  errorMessage
                    ? { borderColor: "#FF4D4F", borderWidth: 1 }
                    : {},
                ]}
                textContentType="oneTimeCode"
                autoFocus={index === 0}
              />
            ))}
          </View>
          {errorMessage ? (
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                marginBottom: 10,
                paddingHorizontal: 4,
              }}
            >
              <AntDesign name="exclamationcircleo" size={16} color="#FF4D4F" />
              <Text
                style={{
                  color: "#FF4D4F",
                  fontSize: 10,
                  marginLeft: 6,
                  flexShrink: 1,
                }}
              >
                {errorMessage}
              </Text>
            </View>
          ) : null}

          <CustomButtonRN
            title="Tiếp tục"
            onPress={handleContinue}
            disabled={isButtonDisabled || loading}
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

          <TouchableOpacity style={styles.resendButton} onPress={handleResend}>
            <Text style={styles.resendText}>Gửi lại</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </ImageBackground>
  );
}
