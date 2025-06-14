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
import styles from "@/styles/auth/register/confirmPhone";
import { router, useLocalSearchParams } from "expo-router";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import CustomButtonRN from "@/components/common/customButtonRN";
// import { useToast } from "@/context/ToastContext";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { RegisterTypePhone } from "@/types/user";
import api from "@/config/api";
import { ApiResponse } from "@/types/api";
import { AntDesign } from "@expo/vector-icons";

export default function ConfirmPhone() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const { phone: phoneFromParams, code } = useLocalSearchParams<{
    phone: string;
    code: string;
  }>();
  // const { showToast } = useToast();

  useEffect(() => {
    if (phoneFromParams) {
      setPhone(phoneFromParams);
    }
  }, [phoneFromParams]);

  const handleLogin = () => {
    router.push("/(auths)/(Login)/login");
  };

  const validatePassword = (password: string) => {
    const minLength = password.length >= 8;
    const hasNumber = /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

    if (!minLength) return "Mật khẩu phải có ít nhất 8 ký tự";
    if (!hasNumber) return "Mật khẩu phải chứa ít nhất một số";
    if (!hasSpecialChar) return "Mật khẩu phải chứa ít nhất một ký tự đặc biệt";
    return "";
  };

  const handleRegister = async () => {
    if (loading) return;

    if (!fullName || !phone || !password || !confirmPassword || !code) {
      setErrorMessage("Vui lòng nhập đầy đủ thông tin");
      // showToast({ type: "error", message: "Vui lòng nhập đầy đủ thông tin" });
      return;
    }

    const phoneRegex = /^\+?[0-9]{7,15}$/;
    if (!phoneRegex.test(phone)) {
      setErrorMessage("Số điện thoại không hợp lệ");
      // showToast({ type: "error", message: "Số điện thoại không hợp lệ" });
      return;
    }

    const passwordError = validatePassword(password);
    if (passwordError) {
      setErrorMessage(passwordError);
      // showToast({ type: "error", message: passwordError });
      return;
    }

    if (password !== confirmPassword) {
      setErrorMessage("Mật khẩu xác nhận không khớp");
      // showToast({ type: "error", message: "Mật khẩu xác nhận không khớp" });
      return;
    }

    try {
      setLoading(true);
      const registerToken = await AsyncStorage.getItem("registerToken");
      if (!registerToken) {
        setErrorMessage("Token xác minh không hợp lệ hoặc không tồn tại");
        // showToast({
        //   type: "error",
        //   message:
        //     "Token xác minh không hợp lệ hoặc không tồn tại. Vui lòng thử lại từ đầu.",
        // });
        return;
      }

      const formData: RegisterTypePhone = {
        token: registerToken,
        fullName,
        phone,
        password,
        confirmPassword,
        code,
      };

      const response = await api.post<ApiResponse>(
        "/Accounts/ResgiterByCode",
        formData,
        {
          headers: {
            Authorization: `Bearer ${registerToken}`,
            "Content-Type": "application/json-patch+json",
          },
        }
      );

      if (response.data?.status === "Success" && response.data.data?.token) {
        const token = response.data.data.token;
        const profileResponse = await api.get("/Accounts/Profile", {
          headers: { Authorization: `Bearer ${token}` },
        });

        const user = profileResponse.data?.data;
        if (!user) {
          // showToast({
          //   type: "error",
          //   message: "Không thể lấy thông tin người dùng",
          // });
          return;
        }

        const authData = {
          token,
          phone,
          fullName: user.fullName || fullName,
          userId: user.id,
        };
        await AsyncStorage.setItem("data", JSON.stringify(authData));

        // showToast({
        //   type: "success",
        //   message: "Đăng ký thành công!",
        // });
        router.replace("/(tabs)/assistant");
      } else {
        let errorMessage = response.data?.message || "Đăng ký thất bại";
        if (errorMessage.toLowerCase().includes("password")) {
          errorMessage = "Sai mật khẩu";
        } else if (errorMessage.toLowerCase().includes("not found")) {
          errorMessage = "Tài khoản không tồn tại";
        }
        setErrorMessage(errorMessage);
        // showToast({ type: "error", message: errorMessage });
      }
    } catch (error) {
      let msg = "Có lỗi xảy ra, vui lòng thử lại";
      if (
        error &&
        typeof error === "object" &&
        "response" in error &&
        (error as any).response?.data?.message
      ) {
        msg = (error as any).response.data.message;
      } else if ((error as any)?.message) {
        msg = (error as any).message;
      }
      setErrorMessage(msg);
      // showToast({ type: "error", message: msg });
      console.error("Register error:", (error as any)?.response?.data || error);
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
            onChangeText={setFullName}
          />

          <Text style={styles.label}>
            Số điện thoại <Text style={styles.required}>*</Text>
          </Text>
          <TextInput
            style={styles.input}
            placeholder="Số điện thoại"
            keyboardType="phone-pad"
            value={phone}
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
              onChangeText={setPassword}
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
              onChangeText={setConfirmPassword}
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
