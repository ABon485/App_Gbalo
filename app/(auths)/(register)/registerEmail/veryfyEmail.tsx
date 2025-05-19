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
  const inputRefs = useRef<TextInput[]>([]);
  const { showToast } = useToast();
  const [isButtonDisabled, setIsButtonDisabled] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  const hideEmail = (email: string) => {
    if (!email) return "";
    const [name, domain] = email.split("@");
    if (name.length <= 2) {
      // Nếu tên quá ngắn thì ẩn hết trừ 1 ký tự đầu
      return name[0] + "***@" + domain;
    }
    // Giữ lại 2 ký tự đầu, ẩn phần còn lại
    const visibleName = name.slice(0, 2);
    const hiddenPart = "*".repeat(name.length - 2);
    return `${visibleName}${hiddenPart}@${domain}`;
  };

  useEffect(() => {
    if (!email) {
      showToast({
        type: "error",
        message: "Email không hợp lệ",
      });
      router.replace("/(auths)/login");
    }
  }, []);

  useEffect(() => {
    const isValidOtp =
      otp.join("").length === 6 && otp.every((digit) => /^\d$/.test(digit));
    setIsButtonDisabled(!isValidOtp);
    if (errorMessage) setErrorMessage(""); // Reset lỗi khi người dùng sửa OTP
  }, [otp]);

  const handleOtpChange = (text: string, index: number) => {
    if (/^\d?$/.test(text)) {
      const newOtp = [...otp];
      newOtp[index] = text;
      setOtp(newOtp);

      if (text && index < 5) {
        inputRefs.current[index + 1]?.focus();
      } else if (!text && index > 0) {
        inputRefs.current[index - 1]?.focus();
      }
    }
  };

  // const handleContinue = async () => {
  //   const code = otp.join("");

  //   if (code.length < 6) {
  //     showToast({ type: "error", message: "Vui lòng nhập đầy đủ mã xác nhận" });
  //     return;
  //   }

  //   try {
  //     setLoading(true);

  //     // Lấy token xác minh từ AsyncStorage
  //     const token = await AsyncStorage.getItem("registerToken");

  //     if (!token) {
  //       showToast({
  //         type: "error",
  //         message: "Không tìm thấy token xác minh. Vui lòng thử lại từ đầu.",
  //       });
  //       return;
  //     }

  //     // Gửi mã OTP và token lên server để xác thực
  //     const response: ApiResponse = await api.post(
  //       "/Accounts/VerifyRegisterCode",
  //       {
  //         token,
  //         code,
  //       }
  //     );

  //     if (response.success) {
  //       showToast({ type: "success", message: "Xác minh OTP thành công!" });
  //       router.push({
  //         pathname: "/(auths)/(register)/registerEmail/confirmEmail",
  //         params: { email, code:"123456" },
  //       });
  //     } else {
  //       showToast({ type: "error", message: "Mã xác nhận không đúng!" });
  //     }
  //   } catch (error: any) {
  //     showToast({
  //       type: "error",
  //       message: error.message || "Có lỗi xảy ra, vui lòng thử lại",
  //     });
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  const handleContinue = async () => {
    const code = otp.join("");

    if (code.length < 6) {
      showToast({ type: "error", message: "Vui lòng nhập đầy đủ mã xác nhận" });
      return;
    }

    if (code !== "123456") {
      setErrorMessage("Mã xác nhận không đúng. Vui lòng nhập mã 123456.");
      showToast({
        type: "error",
        message: "Mã xác nhận không đúng. Vui lòng nhập mã 123456.",
      });
      return;
    }

    const token = await AsyncStorage.getItem("registerToken");
    console.log("Token retrieved:", token);

    try {
      setLoading(true);

      if (!token) {
        showToast({
          type: "error",
          message: "Không tìm thấy token xác minh. Vui lòng thử lại từ đầu.",
        });
        return;
      }

      console.log("Navigating to ConfirmEmail with:", { email, code });

      showToast({ type: "success", message: "Xác minh OTP thành công!" });
      router.push({
        pathname: "/(auths)/(register)/registerEmail/confirmEmail",
        params: { email, code:"123456" },
      });
    } catch (error: any) {
      console.error("Error in handleContinue:", error);
      showToast({
        type: "error",
        message: "Có lỗi xảy ra, vui lòng thử lại",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    try {
      // Lấy token từ AsyncStorage
      const token = await AsyncStorage.getItem("registerToken");

      if (!token) {
        showToast({ type: "error", message: "Không tìm thấy token xác minh" });
        return;
      }

      const response: ApiResponse = await api.post(
        "/Accounts/VerifyResgiterCode",
        {
          code: "123456",
          token,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.success) {
        showToast({
          type: "success",
          message: "Đã gửi lại mã OTP!",
        });
        setOtp(Array(6).fill("")); // Reset OTP fields
        inputRefs.current[0]?.focus(); // Focus vào trường đầu tiên
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
        <View style={styles.logoContainer}>
          <Image
            source={require("../../../../assets/images/imagLogo.png")}
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
