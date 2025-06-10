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
import { useToast } from "@/context/ToastContext";
import GoogleButton from "@/components/common/customButtonSocial/GoogleButton";
import FacebookButton from "@/components/common/customButtonSocial/FacebookButton";
import AppleButton from "@/components/common/customButtonSocial/AppleButton";

const LoginEmail = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const [userId, setUserId] = useState<number | null>(null);


  const { showToast } = useToast();

  const handlePhoneLogin = () => {
    router.push("/(auths)/(Login)/loginByPhone");
  };
  const handleForgotPassword = () => {
    router.push("/(auths)/(Login)/forgotPassword/forgot-password-email");
  };
  const handleRegister = () => {
    router.push("/(auths)/(register)/registerPhone/RegisterPhone");
  };
  const handleFacebookLogin = () => {
    console.log("Initiating Facebook login");
  };
  const handleLoginPressApple = () => {
    router.push('/(auths)/(Login)/loginPhone');
  };

  const handleLogin = async () => {
    // Trim inputs to avoid whitespace issues
    const trimmedEmail = email.trim();
    const trimmedPassword = password.trim();

    // Validate empty fields
    if (!trimmedEmail) {
      showToast({
        type: "error",
        heading: "Lỗi",
        message: "Vui lòng nhập email",
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

    // Validate email format
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(trimmedEmail)) {
      showToast({
        type: "error",
        heading: "Lỗi",
        message: "Định dạng email không hợp lệ",
      });
      return;
    }

    // Validate password: at least 8 characters, one uppercase, one number, one special character
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
      const formData: LoginEmailType = {
        email: trimmedEmail,
        password: trimmedPassword,
        rememberMe,
      };

      const response: ApiResponse = await api.post("/LoginByEmail", formData);
      console.log("API /LoginByEmail response:", response);

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

        // Đặt userId vào state
        setUserId(user.id);

        // Lưu token dưới key "accessToken"
        await AsyncStorage.setItem("accessToken", token);
        console.log("Stored Access Token:", token); // Log token để kiểm tra

        // Lưu thông tin khác nếu cần
        const authData = {
          token,
          email: trimmedEmail,
          fullName: user.fullName || "Khách hàng",
          userId: user.id,
        };
        await AsyncStorage.setItem("data", JSON.stringify(authData));
        console.log("Stored Auth Data:", authData);

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
                    size={32}
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

export default LoginEmail;