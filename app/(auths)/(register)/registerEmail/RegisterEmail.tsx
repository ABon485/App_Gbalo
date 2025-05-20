import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  ScrollView,
  ImageBackground,
  StatusBar,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import styles from "@/styles/auth/register/registerEmail";
import { useRouter } from "expo-router";
import CustomButtonRN from "@/components/common/customButtonRN";
import { useToast } from "@/context/ToastContext";
import AsyncStorage from "@react-native-async-storage/async-storage";
import api from "@/config/api";
import { ApiResponse } from "@/types/api";
import { RegistercodeByEmail } from "@/types/user";

export default function RegisterEmail() {
  const router = useRouter();
  const { showToast } = useToast();

  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = () => router.push("/(auths)/(Login)/login");
  const handleRegisterPhone = () =>
    router.push("/(auths)/(register)/registerPhone/RegisterPhone");

  const verifyEmail = async () => {
    if (!email) {
      showToast({ type: "error", message: "Vui lòng nhập email" });
      return;
    }

    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(email)) {
      showToast({ type: "error", message: "Email không hợp lệ" });
      return;
    }

    try {
      setLoading(true);
      const response = await api.post<ApiResponse<RegistercodeByEmail>>(
        "/Accounts/SendResgiterCode",
        { email }
      );
      console.log("Full response:", response.data);
      if (response.data?.status === "Success") {
        showToast({
          type: "success",
          message: "Mã xác minh đã được gửi đến email của bạn",
        });
        router.push({
          pathname: "/(auths)/(register)/registerEmail/veryfyEmail",
          params: { email },
        });
      } else {
        showToast({
          type: "error",
          message: "Gửi mã xác minh thất bại. Vui lòng thử lại.",
        });
      }
    } catch (error: any) {
      showToast({ type: "error", message: "Có lỗi xảy ra, vui lòng thử lại" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <ImageBackground
      source={require("../../../../assets/images/BackGroud.png")}
      style={styles.backgroundImage}
    >
      <StatusBar translucent backgroundColor="transparent" />
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={{ flex: 1 }}
      >
        <View style={{ flex: 1 }}>
          <View style={styles.topHalf}>
            <Image
              source={require("../../../../assets/images/imagLogo.png")}
              resizeMode="contain"
              style={{ width: 180, height: 100 }}
            />
          </View>

          <View style={styles.bottomHalf}>
            <ScrollView
              contentContainerStyle={styles.scrollViewContent}
              showsVerticalScrollIndicator={false}
              keyboardShouldPersistTaps="handled"
            >
              <Text style={styles.title}>Đăng ký</Text>

              <Text style={styles.inputLabel}>
                Email <Text style={styles.required}>*</Text>
              </Text>

              <TextInput
                placeholder="Nhập email"
                keyboardType="email-address"
                style={styles.input}
                value={email}
                onChangeText={setEmail}
                autoCapitalize="none"
              />

              <Text style={styles.privacyText}>
                Bằng cách đăng ký hoặc đăng nhập, bạn đã hiểu và đồng ý với
                <Text style={styles.privacyLink}>
                  {" "}
                  Điều Khoản Sử Dụng Chung{" "}
                </Text>
                và
                <Text style={styles.privacyLink}> Chính sách bảo mật</Text> của
                Gbalo
              </Text>

              <CustomButtonRN
                title={loading ? "Đang gửi..." : "Tiếp tục"}
                onPress={verifyEmail}
                disabled={loading}
              />

              <View style={styles.divider}>
                <View style={styles.dividerLine} />
                <Text style={styles.dividerText}>Hoặc</Text>
                <View style={styles.dividerLine} />
              </View>

              <TouchableOpacity
                style={styles.socialButton}
                onPress={handleRegisterPhone}
              >
                <Image
                  source={require("../../../../assets/images/social/Phone.png")}
                />
                <Text style={styles.socialButtonText}>
                  Tiếp tục với số điện thoại
                </Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.socialButton}>
                <Image
                  source={require("../../../../assets/images/social/Google.png")}
                />
                <Text style={styles.socialButtonText}>Tiếp tục với Google</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.socialButton}>
                <Image
                  source={require("../../../../assets/images/social/Facebook.png")}
                />
                <Text style={styles.socialButtonText}>
                  Tiếp tục với Facebook
                </Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.socialButton}>
                <Image
                  source={require("../../../../assets/images/social/apple.png")}
                />
                <Text style={styles.socialButtonText}>Tiếp tục với Apple</Text>
              </TouchableOpacity>

              <View style={styles.loginLinkContainer}>
                <Text style={styles.loginLinkText}>Bạn đã có tài khoản? </Text>
                <TouchableOpacity onPress={handleLogin}>
                  <Text style={styles.loginLink}>Đăng nhập</Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
          </View>
        </View>
      </KeyboardAvoidingView>
    </ImageBackground>
  );
}
