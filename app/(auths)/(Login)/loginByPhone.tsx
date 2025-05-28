import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  SafeAreaView,
  ScrollView,
  ImageBackground,
  StatusBar,
} from "react-native";
import styles from "@/styles/auth/loginByPhone";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import Feather from "react-native-vector-icons/Feather";
import EvilIcons from "react-native-vector-icons/EvilIcons";
import { router, Stack } from "expo-router";
import GoogleButton from "@/components/common/customButtonSocial/GoogleButton";
import FacebookButton from "@/components/common/customButtonSocial/FacebookButton";
import AppleButton from "@/components/common/customButtonSocial/AppleButton";
import AsyncStorage from "@react-native-async-storage/async-storage";
import api from "@/config/api";
import { LoginByPhone } from "@/types/user";
import { ApiResponse } from "@/types/api";
import { useToast } from "@/context/ToastContext";

const loginByPhone = () => {
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const { showToast } = useToast();

  const handleFacebookLogin = () => {
    console.log("Initiating Facebook login");
  };

  const handleLoginPressApple = () => {
    router.push("/(auths)/(Login)/loginPhone");
  };

  const handleForgotPassword = () => {
    router.push("/(auths)/(Login)/forgotPassword/forgot-password-phone");
  };

  const handleSmsLogin = () => {
    router.push("/(auths)/(Login)/loginPhone");
  };
  const handleEmailLogin = () => {
    router.push("/(auths)/(Login)/loginEmail");
  };
  const handleRegister = () => {
    router.replace("/(auths)/(register)/registerPhone/RegisterPhone");
  };
  const handleLogin = async () => {
    const trimmedPhone = phone.trim();
    const trimmedPassword = password.trim();
    if (!trimmedPhone) {
      showToast({
        type: "error",
        heading: "Lỗi",
        message: "Vui lòng nhập số điện thoại",
      });
      return;
    }
    if (!trimmedPassword) {
      showToast({
        type: "error",
        heading: "Lỗi",
        message: "Vui lòng nhập mật khẩu",
      });
      return;
    }
    const phoneRegex = /^(0|\+84)(3|5|7|8|9)[0-9]{8}$/;
    if (!phoneRegex.test(trimmedPhone)) {
      showToast({
        type: "error",
        heading: "Lỗi",
        message: "Số điện thoại không hợp lệ",
      });
      return;
    }
    const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/;
    if (!passwordRegex.test(trimmedPassword)) {
      showToast({
        type: "error",
        heading: "Lỗi",
        message: "Mật khẩu phải có ít nhất 8 ký tự, bao gồm chữ hoa, số và ký tự đặc biệt",
      });
      return;
    }
    setLoading(true);
    try {
      const formData: LoginByPhone = {
        phone: trimmedPhone,
        password: trimmedPassword,
        rememberMe,
      };
      const response: ApiResponse = await api.post("/LoginByPhone", formData);
      console.log("API /LoginByPhone response:", response);
      const isSuccess = response.data?.status === "Success";
      const token = response.data?.data?.token;
      if (isSuccess && token) {
        // Gọi API UserProfile để lấy thông tin user
        const profileResponse = await api.get("/Accounts/Profile", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const user = profileResponse.data?.data;

        if (!user) {
          showToast({
            type: "error",
            heading: "Lỗi",
            message: "Không thể lấy thông tin người dùng",
          });
          return;
        }

        const authData = {
          token,
          phone: trimmedPhone,
          fullName: user.fullName || "Khách hàng",
          userId: user.id, // Lưu userId vào authData
        };
      console.log(authData)

        await AsyncStorage.setItem("data", JSON.stringify(authData));
        showToast({
          type: "success",
          heading: "Thành công",
          message: "Đăng nhập thành công!",
        });

        router.replace("/(tabs)/assistant");
      } else {
        let errorMessage = response.data?.message || "Đăng nhập thất bại";

        if (errorMessage.toLowerCase().includes("password")) {
          errorMessage = "Sai mật khẩu";
        } else if (errorMessage.toLowerCase().includes("not found")) {
          errorMessage = "Số điện thoại không tồn tại";
        } else if (!errorMessage) {
          errorMessage = "Có lỗi xảy ra, vui lòng thử lại";
        }

        showToast({
          type: "error",
          heading: "Lỗi",
          message: errorMessage,
        });
      }
    } catch (error: any) {
      showToast({
        type: "error",
        heading: "Lỗi",
        message: error.response?.data?.message || error.message || "Có lỗi xảy ra, vui lòng thử lại",
      });
    } finally {
      setLoading(false);
    }
  };
  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <ImageBackground
        source={require("@/assets/images/BackGroud.png")}
        style={styles.backgroundImage}
        resizeMode="cover"
      >
        <StatusBar translucent backgroundColor="transparent" />
        <SafeAreaView style={styles.container}>
          <ScrollView contentContainerStyle={styles.scrollContainer}>
            <Image
              source={require("@/assets/images/imagLogo.png")}
              style={styles.logo}
              resizeMode="contain"
            />
            <Text style={styles.title}>Đăng nhập</Text>

            <View style={styles.formContainer}>
              <View style={styles.inputContainer}>
                <Feather
                  name="phone"
                  size={20}
                  color="#999999"
                  style={styles.optionIcon}
                />
                <TextInput
                  style={styles.input}
                  placeholder="Nhập số điện thoại"
                  placeholderTextColor="#999"
                  value={phone}
                  onChangeText={setPhone}
                  keyboardType="phone-pad"
                  autoCapitalize="none"
                />
              </View>

              <View style={styles.inputContainer}>
                <EvilIcons
                  name="lock"
                  size={30}
                  color="#999999"
                  style={styles.inputIcon}
                />
                <TextInput
                  style={styles.input}
                  placeholder="Mật khẩu"
                  placeholderTextColor="#999"
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry
                />
              </View>

              <TouchableOpacity
                style={styles.loginButton}
                onPress={handleLogin}
                disabled={loading}
              >
                <Text style={styles.loginButtonText}>
                  {loading ? "Đang đăng nhập..." : "Đăng nhập"}
                </Text>
              </TouchableOpacity>

              <View style={styles.authOptionsContainer}>
                <TouchableOpacity onPress={handleSmsLogin}>
                  <Text style={styles.smsLoginText}>Đăng nhập bằng SMS</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={handleForgotPassword}>
                  <Text style={styles.forgotPasswordText}>Quên mật khẩu</Text>
                </TouchableOpacity>
              </View>

              <Text style={styles.orText}>Hoặc đăng nhập bằng</Text>

              <TouchableOpacity style={styles.socialButton} onPress={handleEmailLogin}>
                <MaterialCommunityIcons name="email-outline" size={24} color="gray" />
                <Text style={styles.socialButtonText}>Tiếp tục với Email</Text>
              </TouchableOpacity>
              <GoogleButton disabled={false} />
              <FacebookButton onPress={handleFacebookLogin} />
              <AppleButton onPress={handleLoginPressApple} />

              <View style={styles.registerContainer}>
                <Text style={styles.registerText}>Bạn chưa có tài khoản ư ? </Text>
                <TouchableOpacity onPress={handleRegister}>
                  <Text style={styles.registerLink}>Đăng ký</Text>
                </TouchableOpacity>
              </View>
            </View>
          </ScrollView>
        </SafeAreaView>
      </ImageBackground>
    </>
  );
};

export default loginByPhone;