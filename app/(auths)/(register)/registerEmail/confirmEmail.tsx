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
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const { email: emailFromParams, code } = useLocalSearchParams<{
    email: string;
    code: string;
  }>();
  const { showToast } = useToast();

  useEffect(() => {
    if (emailFromParams) {
      setEmail(emailFromParams);
    }
  }, [emailFromParams]);

  const handleLogin = () => {
    router.push("/(auths)/(Login)/login");
  };

  const validatePassword = (password: string) => {
    const minLength = password.length >= 8;
    const hasNumber = /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

    if (!minLength) {
      return "Mật khẩu phải có ít nhất 8 ký tự";
    }
    if (!hasNumber) {
      return "Mật khẩu phải chứa ít nhất một số";
    }
    if (!hasSpecialChar) {
      return "Mật khẩu phải chứa ít nhất một ký tự đặc biệt";
    }
    return "";
  };

  const handleRegister = async () => {
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

    // Kiểm tra mật khẩu hợp lệ
    const passwordError = validatePassword(password);
    if (passwordError) {
      setErrorMessage(passwordError);
      showToast({
        type: "error",
        message: passwordError,
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
      return;
    }

    try {
      setLoading(true);
      const registerToken = await AsyncStorage.getItem("registerToken");
      if (!registerToken) {
        setErrorMessage("Không tìm thấy token xác minh");
        showToast({
          type: "error",
          message: "Không tìm thấy token xác minh. Vui lòng thử lại từ đầu.",
        });
        return;
      }

      // Gửi request đăng ký
      const formData: RegisterTypeEmail = {
        token: registerToken,
        fullName,
        password,
        confirmPassword,
        code,
      };

      const response = await api.post<ApiResponse>(
        "/Accounts/ResgiterByCode",
        formData,
        { headers: { Authorization: `Bearer ${registerToken}` } }
      );

      const isSuccess = response.data?.status === "Success";
      const accessToken = response.data?.data?.token;

      if (isSuccess && accessToken) {
        const profileResponse = await api.get("/Accounts/Profile", {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
        console.log("Profile response:", profileResponse.data);

        await AsyncStorage.setItem("token", accessToken);
        await AsyncStorage.setItem(
          "data",
          JSON.stringify({
            token: accessToken,
            email,
            fullName,
            profile: profileResponse.data?.data || null,
          })
        );
        await AsyncStorage.removeItem("registerToken");

        showToast({ type: "success", message: "Đăng ký thành công!" });
        router.replace("/(tabs)/assistant");
      } else {
        const msg = response.data?.message || "Đăng ký thất bại";
        setErrorMessage(msg);
        showToast({ type: "error", message: msg });
      }
    } catch (error) {
      const err = error as any;
      const msg = err?.response?.data?.message || "Có lỗi xảy ra khi đăng ký";
      setErrorMessage(msg);
      showToast({ type: "error", message: msg });
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
