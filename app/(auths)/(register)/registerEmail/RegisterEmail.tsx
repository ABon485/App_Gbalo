// RegisterEmail.tsx
import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  ScrollView,
  ImageBackground,
} from "react-native";
import styles from "@/styles/auth/register/registerEmail";
import { useRouter } from "expo-router";
import CustomButtonRN from "@/components/common/customButtonRN";
import { RegistercodeByEmail } from "@/types/user";
import { ApiResponse } from "@/types/api";
import api from "@/config/api";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useToast } from "@/context/ToastContext";

export default function RegisterEmail() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const { showToast } = useToast();

  const handleLogin = () => {
    router.push("/(auths)/(Login)/login");
  };

  const handleRegisterPhone = () => {
    router.push("/(auths)/(register)/registerPhone/RegisterPhone");
  };

  const handleContinue = async () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!email) {
      showToast({ type: "error", message: "Vui lòng nhập email" });
      return;
    }

    if (!emailRegex.test(email)) {
      showToast({ type: "error", message: "Email không hợp lệ" });
      return;
    }

    try {
      setLoading(true);

      // Lấy token từ AsyncStorage
      const token = await AsyncStorage.getItem("registerToken");

      if (!token) {
        showToast({ type: "error", message: "Không tìm thấy token xác minh" });
        return;
      }

      const response = await api.post<ApiResponse<RegistercodeByEmail>>(
        "/Accounts/SendResgiterCode",
        {
          email,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`, // Sử dụng token thật trong header
          },
        }
      );

      const data = response.data;

      if (data?.data?.token) {
        await AsyncStorage.setItem("registerToken", data.data.token);

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
          message: "Không nhận được token từ server",
        });
      }
    } catch (error: any) {
      console.error("Đăng ký lỗi:", error?.response?.data || error.message);
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
      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        <View style={styles.logoContainer}>
          <Image
            source={require("../../../../assets/images/imagLogo.png")}
            resizeMode="contain"
          />
        </View>
        <View style={styles.formContainer}>
          <Text style={styles.title}>Đăng ký</Text>
          <Text style={styles.inputLabel}>
            Email <Text style={styles.required}>*</Text>
          </Text>
          <TextInput
            style={styles.input}
            placeholder="Nhập email"
            keyboardType="email-address"
            value={email}
            onChangeText={setEmail}
          />
          <Text style={styles.infoText}>
            Chúng tôi sẽ gửi mã xác nhận qua email để xác minh tài khoản. Có áp
            dụng phí dữ liệu tiêu chuẩn.
            <Text style={styles.privacyPolicy}>
              {" "}
              Chính sách về quyền riêng tư
            </Text>
          </Text>
          <CustomButtonRN
            title={loading ? "Đang gửi..." : "Tiếp tục"}
            onPress={handleContinue}
            // disabled={loading}
          />
          <View style={styles.dividerContainer}>
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
            <Text style={styles.socialButtonText}>Tiếp tục với Facebook</Text>
          </TouchableOpacity>
          <View style={styles.loginLinkContainer}>
            <Text>Bạn đã có tài khoản? </Text>
            <TouchableOpacity onPress={handleLogin}>
              <Text style={styles.loginLink}>Đăng nhập</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </ImageBackground>
  );
}
