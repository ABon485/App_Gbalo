import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  ScrollView,
  ImageBackground,
} from "react-native";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import styles from "@/styles/auth/register/confirmEmail";
import { router, useLocalSearchParams } from "expo-router";
import CustomButtonRN from "@/components/common/customButtonRN";
import api from "@/config/api";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { ApiResponse } from "@/types/api";
import { RegisterTypeEmail } from "@/types/user";
import { useToast } from "@/context/ToastContext";
import { AntDesign } from "@expo/vector-icons";

export default function ConfirmEmail() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState(""); // Thêm để hiển thị lỗi
  const [loading, setLoading] = useState(false);
  const { email: emailFromParams, code } = useLocalSearchParams<{
    email: string;
    code: string;
  }>();
  const { showToast } = useToast();

  // Cập nhật email từ params
  useEffect(() => {
    if (emailFromParams) {
      setEmail(emailFromParams);
    }
  }, [emailFromParams]);

  const handleLogin = () => {
    router.push("/(auths)/(Login)/login");
  };

  const handleRegister = async () => {
    // Kiểm tra trường bắt buộc
    if (!fullName || !email || !password || !confirmPassword || !code) {
      setErrorMessage("Vui lòng nhập đầy đủ thông tin");
      showToast({
        type: "error",
        message: "Vui lòng nhập đầy đủ thông tin",
      });
      console.log("Validation failed: Missing required fields", {
        fullName,
        email,
        password,
        confirmPassword,
        code,
      });
      return;
    }

    // Kiểm tra mật khẩu khớp
    if (password !== confirmPassword) {
      setErrorMessage("Mật khẩu xác nhận không khớp");
      showToast({
        type: "error",
        message: "Mật khẩu xác nhận không khớp",
      });
      console.log("Validation failed: Passwords do not match");
      return;
    }

    try {
      setLoading(true);
      const token = await AsyncStorage.getItem("registerToken");
      if (!token) {
        setErrorMessage("Không tìm thấy token xác minh");
        showToast({
          type: "error",
          message: "Không tìm thấy token xác minh. Vui lòng thử lại từ đầu.",
        });
        console.log("Error: No registerToken found in AsyncStorage");
        return;
      }

      // Gửi request API
      const formData: RegisterTypeEmail = {
        token,
        fullName,
        password,
        confirmPassword,
        code, // Đồng bộ với VerifyEmail
      };
      console.log("Sending API request with formData:", formData);

      const response = await api.post<ApiResponse>(
        "/Accounts/ResgiterByCode", // Sửa lỗi chính tả
        formData,
        { headers: { Authorization: `Bearer ${token}` } } // Đồng bộ với VerifyEmail
      );

      if (response.data?.status === "Success" && response.data?.data?.token) {
        await AsyncStorage.setItem("token", response.data.data.token);
        await AsyncStorage.setItem(
          "data",
          JSON.stringify({ token: response.data.data.token, email, fullName })
        );
        await AsyncStorage.removeItem("registerToken");
        showToast({ type: "success", message: "Đăng ký thành công!" });
        console.log("Registration successful:", {
          email,
          fullName,
          authToken: response.data.data.token,
        });
        router.replace("/(tabs)/assistant");
      } else {
        setErrorMessage(response.data?.message || "Đăng ký thất bại");
        showToast({
          type: "error",
          message: response.data?.message || "Đăng ký thất bại",
        });
        console.log(
          "API error:",
          response.data?.message || "Registration failed"
        );
      }
    } catch (error) {
      const err = error as any;
      const errorMessage =
        err?.response?.data?.message || "Có lỗi xảy ra khi đăng ký";
      setErrorMessage(errorMessage);
      showToast({ type: "error", message: errorMessage });
      // console.error("Error in handleRegister:", error, {  });
      console.error("Error response:", err?.response?.data);
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
          <Text style={styles.title}>Hoàn tất đăng ký</Text>

          {/* Hiển thị lỗi nếu có */}
          {errorMessage && (
            <View style={styles.errorContainer}>
              <AntDesign name="exclamationcircleo" size={16} color="#FF4D4F" />
              <Text style={styles.errorText}>{errorMessage}</Text>
            </View>
          )}

          {/* Họ và tên */}
          <Text style={styles.label}>
            Họ và tên <Text style={styles.required}>*</Text>
          </Text>
          <TextInput
            style={styles.input}
            placeholder="Nhập tên của bạn"
            value={fullName}
            onChangeText={(text) => setFullName(text)}
          />

          {/* Email */}
          <Text style={styles.label}>
            Email <Text style={styles.required}>*</Text>
          </Text>
          <TextInput
            style={styles.input}
            placeholder="Email của bạn"
            keyboardType="email-address"
            value={email}
            editable={false}
          />

          {/* Mật khẩu */}
          <Text style={styles.label}>
            Mật khẩu <Text style={styles.required}>*</Text>
          </Text>
          <View style={styles.inputContainer}>
            <TextInput
              style={[styles.input, styles.inputWithIcon]}
              placeholder="Nhập mật khẩu"
              secureTextEntry={!showPassword}
              value={password}
              onChangeText={(text) => setPassword(text)}
            />
            <TouchableOpacity
              style={styles.eyeIcon}
              onPress={() => setShowPassword(!showPassword)}
            >
              <FontAwesome
                name={showPassword ? "eye" : "eye-slash"}
                size={18}
                color="black"
              />
            </TouchableOpacity>
          </View>

          {/* Xác nhận mật khẩu */}
          <Text style={styles.label}>
            Xác nhận mật khẩu <Text style={styles.required}>*</Text>
          </Text>
          <View style={styles.inputContainer}>
            <TextInput
              style={[styles.input, styles.inputWithIcon]}
              placeholder="Nhập lại mật khẩu"
              secureTextEntry={!showConfirm}
              value={confirmPassword}
              onChangeText={(text) => setConfirmPassword(text)}
            />
            <TouchableOpacity
              style={styles.eyeIcon}
              onPress={() => setShowConfirm(!showConfirm)}
            >
              <FontAwesome
                name={showConfirm ? "eye" : "eye-slash"}
                size={18}
                color="black"
              />
            </TouchableOpacity>
          </View>

          {/* Tiếp tục */}
          <CustomButtonRN
            title={loading ? "Đang đăng ký..." : "Tiếp tục"}
            onPress={handleRegister}
            disabled={loading}
          />

          {/* Chính sách */}
          <Text style={styles.policyText}>
            Bằng việc chọn Đồng ý và tiếp tục, tôi đồng ý với{" "}
            <Text style={styles.boldText}>Điều khoản dịch vụ</Text> và{" "}
            <Text style={styles.boldText}>Chính sách của Gbalo</Text>, đồng thời
            chấp thuận{" "}
            <Text style={styles.boldText}>Chính sách về quyền riêng tư</Text>.
          </Text>
        </View>
      </ScrollView>
    </ImageBackground>
  );
}
