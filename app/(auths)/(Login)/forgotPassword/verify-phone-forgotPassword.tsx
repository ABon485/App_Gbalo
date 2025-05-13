"use client"

import { useState, useRef } from "react"
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  SafeAreaView,
  ImageBackground,
  StatusBar,
  TextInput,
  StyleSheet,
  ActivityIndicator,
} from "react-native"
import { Stack, useLocalSearchParams, router } from "expo-router"
import authApi from "@/services/auth"
import AsyncStorage from "@react-native-async-storage/async-storage"
import { useToast } from "@/context/ToastContext"
import { VerifyChangePassCodeType } from "@/types/user"
import type { TextInput as RNTextInput } from "react-native"

const VerifyPhoneForgotPasswordScreen = () => {
  const { phoneNumber } = useLocalSearchParams()
  const [otp, setOtp] = useState(["", "", "", "", "", ""])
  const [isLoading, setIsLoading] = useState(false)
  const inputRefs = useRef<Array<RNTextInput | null>>([])
  const { showToast } = useToast()

  const formatPhoneNumber = (phone: string | string[] | undefined) => {
    if (!phone) return ""
    const phoneStr = String(phone)
    if (phoneStr.length <= 4) return phoneStr
    const firstPart = phoneStr.substring(0, 3)
    const lastPart = phoneStr.substring(phoneStr.length - 3)
    const middlePart = "*".repeat(Math.min(4, phoneStr.length - 6))
    return `${firstPart}${middlePart}${lastPart}`
  }

  const handleOtpChange = (text: string, index: number) => {
    if (/^\d?$/.test(text)) {
      const newOtp = [...otp]
      newOtp[index] = text
      setOtp(newOtp)

      if (text && index < 5 && inputRefs.current[index + 1]) {
        inputRefs.current[index + 1]?.focus()
      }
    }
  }

  const handleKeyPress = (e: any, index: number) => {
    if (e.nativeEvent.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus()
    }
  }

  const handleContinue = async () => {
    const code = otp.join("");
    if (code.length < 6) {
      showToast({
        type: "error",
        message: "Vui lòng nhập đầy đủ mã xác nhận",
      });
      return;
    }

    try {
      setIsLoading(true);
      const publicKey = await AsyncStorage.getItem("forgotPasswordToken");
      if (!publicKey) {
        showToast({
          type: "error",
          message: "Không tìm thấy token xác thực. Vui lòng thử lại.",
        });
        return;
      }

      // Gọi API xác minh OTP
      const payload: VerifyChangePassCodeType = {
        token: publicKey,
        code,
      };
      const response = await authApi.VerifyChangePassByCode(payload);
      console.log("Verify response:", JSON.stringify(response.data, null, 2));

      if (response.data?.status === "Success") {
        showToast({
          type: "success",
          message: "Xác thực mã OTP thành công!",
        });
        // Lưu token mới nếu server trả về
        if (response.data?.data?.token) {
          await AsyncStorage.setItem("forgotPasswordToken", response.data.data.token);
        }
        router.push("/(auths)/(Login)/forgotPassword/reset-password");
      } else {
        showToast({
          type: "error",
          message: response.data?.message || "Mã xác nhận không đúng.",
        });
      }
    } catch (error: any) {
      console.error("Lỗi xác thực:", JSON.stringify(error, null, 2));
      showToast({
        type: "error",
        message: error.message || "Xác thực mã OTP thất bại. Vui lòng thử lại.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const isOtpComplete = otp.join("").length === 6

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <ImageBackground
        source={require("@/assets/images/BackGroud.png")}
        style={styles.backgroundImage}
      >
        <StatusBar translucent backgroundColor="transparent" />
        <SafeAreaView style={styles.safeArea}>
          <View style={styles.container}>
            <Image
              source={require("@/assets/images/imagLogo.png")}
              style={styles.logo}
              resizeMode="contain"
            />

            <View style={styles.formContainer}>
              <Text style={styles.title}>Xác thực số điện thoại của bạn</Text>
              <Text style={styles.subtitle}>
                Vui lòng nhập mã xác nhận vừa gửi qua SĐT
              </Text>
              <Text style={styles.phoneNumber}>
                {formatPhoneNumber(phoneNumber)}
              </Text>

              <View style={styles.codeInputContainer}>
                {otp.map((digit, index) => (
                  <TextInput
                    key={index}
                    ref={(ref) => (inputRefs.current[index] = ref)}
                    style={styles.codeInput}
                    value={digit}
                    onChangeText={(text) => handleOtpChange(text, index)}
                    onKeyPress={(e) => handleKeyPress(e, index)}
                    keyboardType="number-pad"
                    maxLength={1}
                    selectTextOnFocus
                    editable={!isLoading}
                  />
                ))}
              </View>

              <Text style={styles.hintText}>
                Mã xác nhận mặc định là: <Text style={styles.hintHighlight}>123456</Text>
              </Text>

              <TouchableOpacity
                style={[
                  styles.continueButton,
                  isOtpComplete ? styles.activeButton : styles.inactiveButton,
                  isLoading && styles.loadingButton,
                ]}
                onPress={handleContinue}
                disabled={!isOtpComplete || isLoading}
              >
                {isLoading ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text
                    style={[
                      styles.continueButtonText,
                      isOtpComplete ? styles.activeButtonText : styles.inactiveButtonText,
                    ]}
                  >
                    Tiếp tục
                  </Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </SafeAreaView>
      </ImageBackground>
    </>
  )
}

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    width: "100%",
    height: "100%",
  },
  safeArea: {
    flex: 1,
    width: "100%",
  },
  container: {
    flex: 1,
    alignItems: "center",
    width: "100%",
    paddingTop: 90,
  },
  logo: {
    width: "50%",
    height: "15%",
    marginBottom: 20,
  },
  formContainer: {
    width: "100%",
    height: "75%",
    backgroundColor: "white",
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingVertical: 30,
    paddingHorizontal: 20,
    alignItems: "center",
    shadowColor: "black",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 4,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: "#666",
    marginBottom: 4,
  },
  phoneNumber: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 16,
    color: '#FF5722'
  },
  codeInputContainer: {
    flexDirection: "row",
    justifyContent: "center",
    width: "80%",
    marginVertical: 20,
    gap:10, 
  },
  codeInput: {
    width: 40,
    height: 50,
    borderWidth: 1,
    borderColor: "#ccc",
    textAlign: "center",
    fontSize: 18,
    borderRadius: 8,
  },
  hintText: {
    fontSize: 14,
    color: "#999",
    marginBottom: 20,
  },
  hintHighlight: {
    color: "#FF5722",
    fontWeight: "bold",
  },
  continueButton: {
    width: "80%",
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 16,
  },
  activeButton: {
    backgroundColor: "#FF5722"
  },
  inactiveButton: {
    backgroundColor: "#ccc",
  },
  loadingButton: {
    opacity: 0.7,
  },
  continueButtonText: {
    fontSize: 16,
  },
  activeButtonText: {
    color: "#fff",
  },
  inactiveButtonText: {
    color: "#666",
  },
})

export default VerifyPhoneForgotPasswordScreen