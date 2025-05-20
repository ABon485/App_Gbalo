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
import styles from "@/styles/auth/register/confirmEmail";
import { router, useLocalSearchParams } from "expo-router";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import CustomButtonRN from "@/components/common/customButtonRN";
import api from "@/config/api";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { ApiResponse } from "@/types/api";
import { RegisterTypeEmail } from "@/types/user";
import { useToast } from "@/context/ToastContext";

export default function ConfirmEmail() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [fullName, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { email: emailFromParams, code: otpCodeFromParams } =
    useLocalSearchParams<{ email: string; code: string }>();
  const { showToast } = useToast();

  useEffect(() => {
    if (emailFromParams) {
      setEmail(emailFromParams);
    }
  }, [emailFromParams]);

  const handleLogin = () => {
    router.push("/(auths)/(Login)/login");
  };

  const handleRegister = async () => {
    // Log dữ liệu đầu vào
    console.log("Input data:", {
      fullName,
      email,
      password,
      confirmPassword,
      otpCode: otpCodeFromParams,
    });

    // Kiểm tra trường bắt buộc
    if (!fullName || !password || !confirmPassword) {
      showToast({
        type: "error",
        message: "Vui lòng nhập đầy đủ thông tin",
      });
      console.log("Validation failed: Missing required fields");
      return;
    }

    // Kiểm tra mật khẩu khớp
    if (password !== confirmPassword) {
      showToast({
        type: "error",
        message: "Mật khẩu xác nhận không khớp",
      });
      console.log("Validation failed: Passwords do not match");
      return;
    }

    setLoading(true);

    try {
      // Lấy token thật
      const token = await AsyncStorage.getItem("registerToken");
      console.log("Token retrieved:", token);

      if (!token) {
        showToast({
          type: "error",
          message: "Không tìm thấy token xác minh. Vui lòng thử lại từ đầu.",
        });
        console.log("Error: No registerToken found in AsyncStorage");
        return;
      }

      // Giả lập đăng ký thành công trong giai đoạn hardcode
      const IS_HARDCODE_MODE = true;

      if (IS_HARDCODE_MODE) {
        const token = await AsyncStorage.getItem("registerToken");
        console.log("Token retrieved:", token);

        await AsyncStorage.setItem(
          "data",
          JSON.stringify({
            token,
            email,
            fullName,
            // Thêm các trường khác nếu cần
          })
        );

        console.log("Fake registration successful:", {
          email,
          fullName,
          authToken: token,
        });

        showToast({
          type: "success",
          message: "Đăng ký thành công (hardcode)!",
        });

        console.log("Navigating to /assistant");
        router.replace("/(tabs)/assistant");
      } else {
        // Code gọi API thật để sử dụng sau này
        const formData: RegisterTypeEmail = {
          token,
          fullName,
          password,
          confirmPassword,
          // Loại bỏ confirmPassword và code nếu server không yêu cầu
        };
        console.log("Sending API request with formData:", formData);

        const response: ApiResponse = await api.post(
          "/Accounts/ResgiterByCode", // Sửa chính tả
          formData,
          { headers: { Authorization: `Bearer ${token}` } } // Thêm header nếu cần
        );
        console.log("API response:", response);
        console.log("API response data:", response.data);

        if (response.success) {
          const authToken = response.data?.data?.token;

          if (!authToken) {
            showToast({
              type: "error",
              message: "Không lấy được token từ server.",
            });
            console.log("Error: No authToken in API response");
            return;
          }

          await AsyncStorage.setItem("token", authToken);
          await AsyncStorage.setItem(
            "data",
            JSON.stringify({ token: authToken, email, fullName })
          );
          await AsyncStorage.removeItem("registerToken"); // Xóa token tạm

          console.log("Registration successful:", {
            email,
            fullName,
            authToken,
          });

          showToast({
            type: "success",
            message: "Đăng ký thành công!",
          });

          console.log("Navigating to /assistant");
          router.replace("/(tabs)/assistant");
        } else {
          showToast({
            type: "error",
            message: response.message || "Đăng ký thất bại",
          });
          console.log("API error:", response.message || "Registration failed");
        }
      }
    } catch (error: any) {
      console.error("Error in handleRegister:", error);
      console.error("Error response:", error.response?.data);
      console.error("Error status:", error.response?.status);
      showToast({
        type: "error",
        message:
          error.response?.data?.message || "Có lỗi xảy ra, vui lòng thử lại",
      });
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
          <Text style={styles.title}>Hoàn tất đăng ký</Text>

          {/* Họ và tên */}
          <Text style={styles.label}>
            Họ và tên <Text style={styles.required}>*</Text>
          </Text>
          <TextInput
            style={styles.input}
            placeholder="Nhập tên của bạn"
            value={fullName}
            onChangeText={(text) => setUserName(text)}
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
            editable={false} // Khóa input email
            onChangeText={(text) => setEmail(text)}
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
            // disabled={loading}
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
