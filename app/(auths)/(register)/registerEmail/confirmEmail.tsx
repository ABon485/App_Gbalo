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
// import { useToast } from "@/context/ToastContext";
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
  const [userId, setUserId] = useState<string | null>(null); // Thêm state userId
  const { email: emailFromParams, code } = useLocalSearchParams<{
    email: string;
    code: string;
  }>();
  // const { showToast } = useToast();

  // Cập nhật email từ params
  useEffect(() => {
    if (emailFromParams) {
      setEmail(emailFromParams);
    }
  }, [emailFromParams]);

  const handleLogin = () => {
    router.push("/(auths)/(Login)/login");
  };

  // Hàm kiểm tra mật khẩu
  const validatePassword = (password: string) => {
    const minLength = password.length >= 8;
    const hasNumber = /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

    if (!minLength) return "Mật khẩu phải có ít nhất 8 ký tự";
    if (!hasNumber) return "Mật khẩu phải chứa ít nhất một số";
    if (!hasSpecialChar) return "Mật khẩu phải chứa ít nhất một ký tự đặc biệt";
    return "";
  };

  // Hàm xử lý đăng ký
  const handleRegister = async () => {
    if (loading) {
      console.log("Registration already in progress, ignoring...");
      return;
    }

    // Kiểm tra các trường bắt buộc
    if (!fullName || !email || !password || !confirmPassword || !code) {
      setErrorMessage("Vui lòng nhập đầy đủ thông tin");
      // showToast({ type: "error", message: "Vui lòng nhập đầy đủ thông tin" });
      console.log("Validation failed: Missing required fields", {
        fullName,
        email,
        password,
        confirmPassword,
        code,
      });
      return;
    }

    // Kiểm tra định dạng email
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(email)) {
      setErrorMessage("Định dạng email không hợp lệ");
      // showToast({ type: "error", message: "Định dạng email không hợp lệ" });
      return;
    }

    // Kiểm tra mật khẩu
    const passwordError = validatePassword(password);
    if (passwordError) {
      setErrorMessage(passwordError);
      // showToast({ type: "error", message: passwordError });
      return;
    }

    // Kiểm tra xác nhận mật khẩu
    if (password !== confirmPassword) {
      setErrorMessage("Mật khẩu xác nhận không khớp");
      // showToast({ type: "error", message: "Mật khẩu xác nhận không khớp" });
      return;
    }

    try {
      setLoading(true);
      console.log("Starting registration process...");

      // Lấy registerToken từ AsyncStorage
      const registerToken = await AsyncStorage.getItem("registerToken");
      console.log("Register token from AsyncStorage:", registerToken);
      if (!registerToken || typeof registerToken !== "string") {
        setErrorMessage("Token xác minh không hợp lệ hoặc không tồn tại");
        // showToast({
        //   type: "error",
        //   message:
        //     "Token xác minh không hợp lệ hoặc không tồn tại. Vui lòng thử lại từ đầu.",
        // });
        return;
      }

      // Chuẩn bị dữ liệu gửi API
      const formData: RegisterTypeEmail = {
        token: registerToken,
        fullName,
        password,
        confirmPassword,
        code,
      };
      console.log("Sending API request with formData:", formData);

      // Gửi request đăng ký
      const response = await api.post<ApiResponse>(
        "/Accounts/ResgiterByCode",
        formData,
        { headers: { Authorization: `Bearer ${registerToken}` } }
      );
      console.log(
        "Register API response:",
        JSON.stringify(response.data, null, 2)
      );

      // Kiểm tra trạng thái đăng ký
      const isSuccess = response.data?.status === "Success";
      const token = response.data.data?.token;

      if (isSuccess && token) {
        // Gọi API UserProfile để lấy thông tin user
        const profileResponse = await api.get("/Accounts/Profile", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const user = profileResponse.data?.data;

        if (!user) {
          // showToast({
          //   type: "error",
          //   heading: "Lỗi",
          //   message: "Không thể lấy thông tin người dùng",
          // });
          return;
        }
        // Đặt userId vào state
        setUserId(user.id);

        const authData = {
          token,
          email: email, // Thay trimmedEmail bằng email
          fullName: user.fullName || "Khách hàng",
          userId: user.id, // Lưu userId vào authData
        };
        console.log(authData);
        await AsyncStorage.setItem("data", JSON.stringify(authData));

        // showToast({
        //   type: "success",
        //   heading: "Thành công",
        //   message: "Đăng nhập thành công!",
        // });

        router.replace("/(tabs)/assistant");
      } else {
        let errorMessage = response.data?.message || "Đăng ký thất bại";

        if (errorMessage.toLowerCase().includes("password")) {
          errorMessage = "Sai mật khẩu";
        } else if (errorMessage.toLowerCase().includes("not found")) {
          errorMessage = "Tài khoản không tồn tại";
        } else if (!errorMessage) {
          errorMessage = "Có lỗi xảy ra, vui lòng thử lại";
        }

        // showToast({
        //   type: "error",
        //   heading: "Lỗi",
        //   message: errorMessage,
        // });
        setErrorMessage(errorMessage);
      }
    } catch (error) {
      const err = error as any;
      let msg = err.message || "Có lỗi xảy ra, vui lòng thử lại";

      // Xử lý lỗi cụ thể
      if (err.message.includes("token")) {
        msg = "Token không hợp lệ hoặc đã hết hạn";
      } else if (err.message.includes("id")) {
        msg = "Không tìm thấy thông tin người dùng";
      } else if (err.message.includes("Network Error")) {
        msg = "Lỗi kết nối mạng, vui lòng kiểm tra lại kết nối";
      } else if (err.response?.data?.message) {
        msg = err.response.data.message;
      } else if (err.response?.status === 401) {
        msg = "Xác thực thất bại, token không hợp lệ";
      } else if (err.response?.status === 400) {
        msg = "Dữ liệu không hợp lệ, vui lòng kiểm tra lại";
      }

      setErrorMessage(msg);
      // showToast({ type: "error", message: msg });
      console.error("Error details:", {
        message: err.message,
        response: err?.response?.data,
        status: err?.response?.status,
        stack: err.stack,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <ImageBackground
      // source={require("../../../../assets/images/Background.png")}
      style={styles.backgroundImage}
    >
      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        <View style={styles.logoContainer}>
          <Image
            // source={require("../../../../assets/images/imagLogo.png")}
            style={styles.logo}
            resizeMode="contain"
          />
        </View>

        <View style={styles.formContainer}>
          <Text style={styles.title}>Hoàn tất đăng ký</Text>

          {errorMessage && (
            <View style={styles.errorContainer}>
              <AntDesign name="exclamationcircleo" size={16} color="#FF4D4F" />
              <Text style={styles.errorText}>{errorMessage}</Text>
            </View>
          )}

          <Text style={styles.label}>
            Họ và tên <Text style={styles.required}>*</Text>
          </Text>
          <TextInput
            style={styles.input}
            placeholder="Nhập tên của bạn"
            value={fullName}
            onChangeText={(text) => setFullName(text)}
          />

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

          <CustomButtonRN
            title={loading ? "Đang đăng ký..." : "Tiếp tục"}
            onPress={handleRegister}
            disabled={loading}
          />

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
