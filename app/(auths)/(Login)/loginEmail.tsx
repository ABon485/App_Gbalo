import { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  SafeAreaView,
  ScrollView,
  ImageBackground,
  StatusBar,
  TextInput,
} from "react-native";
import styles from "@/styles/auth/loginEmail";
import EvilIcons from "react-native-vector-icons/EvilIcons";
import Feather from "react-native-vector-icons/Feather";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { Stack, router } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import api from "@/config/api";
import { LoginEmailType } from "@/types/user";
import { ApiResponse } from "@/types/api";
import { useToast } from "@/context/ToastContext"; // 👈 import useToast

const LoginEmail = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);

  const { showToast } = useToast(); // 👈 sử dụng useToast

  const handlePhoneLogin = () => {
    router.push("/(auths)/(Login)/loginPhone");
  };

  const handleForgotPassword = () => {
    router.push("/(auths)/(Login)/forgotPassword/forgot-password");
  };

  const handleRegister = () => {
    router.push("/(auths)/(register)/registerPhone/RegisterPhone");
  };

  const handleLogin = async () => {
    if (!email) {
      showToast({
        type: "error",
        heading: "Lỗi",
        message: "Vui lòng nhập email",
      });
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      showToast({
        type: "error",
        heading: "Lỗi",
        message: "Định dạng email không hợp lệ",
      });
      return;
    }

    if (!password) {
      showToast({
        type: "error",
        heading: "Lỗi",
        message: "Vui lòng nhập mật khẩu",
      });
      return;
    }

    setLoading(true);

    try {
      const formData: LoginEmailType = {
        email,
        password,
        rememberMe,
      };

      const response: ApiResponse = await api.post("/LoginByEmail", formData);
      console.log("API /LoginByEmail response:", response);

      const isSuccess = response.data?.status === "Success";
      const token = response.data?.data?.token;

      if (isSuccess && token) {
        // Fetch user profile to get fullName if not included in response
        let fullName = response.data?.data?.fullName;
        if (!fullName) {
          const profileResponse = await api.get("/Accounts/Profile", {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          fullName = profileResponse.data?.data?.fullName || "Khách hàng";
        }

        // Store token and user data in AsyncStorage
        const authData = {
          token,
          email,
          fullName,
        };
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
          errorMessage = "Tài khoản không tồn tại";
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
        message: error.message || "Có lỗi xảy ra, vui lòng thử lại",
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
      >
        <StatusBar translucent backgroundColor="transparent" />
        <SafeAreaView style={styles.container}>
          <ScrollView contentContainerStyle={styles.scrollContainer}>
            <Image
              source={require("@/assets/images/imagLogo.png")}
              style={styles.logo}
              resizeMode="contain"
            />

            <View style={styles.formContainer}>
              <Text style={styles.title}>Đăng nhập</Text>

              <View style={styles.emailLoginContainer}>
                <View style={styles.inputField}>
                  <MaterialCommunityIcons
                    name="email-outline"
                    size={22}
                    color="#999999"
                    style={styles.inputIcon}
                  />
                  <TextInput
                    style={styles.input}
                    placeholder="Địa chỉ email"
                    value={email}
                    onChangeText={setEmail}
                    keyboardType="email-address"
                    autoCapitalize="none"
                  />
                </View>

                <View style={styles.inputField}>
                  <EvilIcons
                    name="lock"
                    size={30}
                    color="#999999"
                    style={styles.inputIcon}
                  />
                  <TextInput
                    style={styles.input}
                    placeholder="Mật khẩu"
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

                <TouchableOpacity
                  style={styles.forgotPasswordContainer}
                  onPress={handleForgotPassword}
                >
                  <Text style={styles.forgotPasswordText}>Quên mật khẩu</Text>
                </TouchableOpacity>
              </View>

              <View style={styles.dividerContainer}>
                <View style={styles.divider} />
                <Text style={styles.dividerText}>Hoặc đăng nhập bằng</Text>
                <View style={styles.divider} />
              </View>

              <TouchableOpacity
                style={styles.socialButton}
                onPress={handlePhoneLogin}
              >
                <View style={styles.socialIconContainer}>
                  <Feather name="phone" size={20} color="gray" />
                </View>
                <Text style={styles.socialButtonText}>
                  Tiếp tục với số điện thoại
                </Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.socialButton}>
                <Image
                  source={require("@/assets/images/Google.png")}
                  className="w-6 h-6"
                />
                <Text style={styles.socialButtonText}>Tiếp tục với Google</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.socialButton}>
                <Image
                  source={require("@/assets/images/Facebook.png")}
                  className="w-6 h-6"
                />
                <Text style={styles.socialButtonText}>
                  Tiếp tục với Facebook
                </Text>
              </TouchableOpacity>

              <View style={styles.registerContainer}>
                <Text style={styles.registerText}>Bạn chưa có tài khoản? </Text>
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

export default LoginEmail;
