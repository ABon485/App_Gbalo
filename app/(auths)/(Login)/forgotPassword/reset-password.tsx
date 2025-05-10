"use client"

import { useState } from "react"
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
  StyleSheet
} from "react-native"
import MaterialIcons from "react-native-vector-icons/MaterialIcons"
import { Stack, router, useLocalSearchParams } from "expo-router"
import authApi from "@/services/auth"
import { ChangePassByCodeType } from "@/types/user"
import { useToast } from "@/context/ToastContext"
import AsyncStorage from "@react-native-async-storage/async-storage"

const ResetPasswordScreen = () => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { showToast } = useToast();
  const { resetToken } = useLocalSearchParams<{ resetToken: string }>();

  // Password validation checks
  const isMinLength = password.length >= 8;
  const isSpecialChar = /[.!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password);
  const isPasswordMatch = password === confirmPassword && confirmPassword.length > 0;
  const isValid = isMinLength && isSpecialChar && isPasswordMatch;

  const handleResetAndLogin = async () => {
    if (isLoading) return; 
    if (!isValid) {
      showToast({ type: "error", message: "Vui lòng kiểm tra lại mật khẩu." });
      return;
    }

    setIsLoading(true);
    try {
      // Retrieve token
      const tokenFromParams = resetToken;
      const tokenFromStorage = await AsyncStorage.getItem("forgotPasswordToken");
      const token = tokenFromParams || tokenFromStorage;
      console.log("Token from params:", tokenFromParams);
      console.log("Token from storage:", tokenFromStorage);
      console.log("Selected token:", token);

      if (!token) {
        showToast({ type: "error", message: "Không tìm thấy token xác thực." });
        return;
      }

      const payload: ChangePassByCodeType = {
        token,
        newPassword: password,
        confirmPassword,
      };
      console.log("Payload:", JSON.stringify(payload, null, 2));

      const response = await authApi.ChangePassByCode(payload);
      console.log("Response:", JSON.stringify(response.data, null, 2));

      if (response.data?.status === "Success") {
        showToast({ type: "success", message: "Đặt lại mật khẩu thành công!" });
        await AsyncStorage.removeItem("forgotPasswordToken");
        console.log("Token đã được xóa khỏi AsyncStorage");
        router.push("/(auths)/(Login)/login");
      } else {
        showToast({
          type: "error",
          message: response.data?.message || "Đặt lại mật khẩu thất bại.",
        });
      }
    } catch (error: any) {
      console.error("Lỗi chi tiết:", JSON.stringify(error?.response?.data || error, null, 2));
      const errorMessage =
        error.response?.data?.errors?.token?.[0] ||
        error.response?.data?.message ||
        error.response?.data?.errors?.newPassword?.[0] ||
        "Đặt lại mật khẩu thất bại. Vui lòng thử lại.";
      showToast({
        type: "error",
        message: errorMessage,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <ImageBackground source={require("@/assets/images/BackGroud.png")} style={styles.background}>
        <StatusBar translucent backgroundColor="transparent" />
        <SafeAreaView style={styles.safeArea}>
          <ScrollView contentContainerStyle={styles.scrollContainer}>
            <Image source={require("@/assets/images/imagLogo.png")} style={styles.logo} resizeMode="contain" />
            <View style={styles.formContainer}>
              <Text style={styles.headerText}>Đặt lại mật khẩu</Text>

              {/* Password Input Field */}
              <View style={styles.inputContainer}>
                <TextInput
                  style={styles.input}
                  placeholder="Nhập mật khẩu mới"
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry={!showPassword}
                  placeholderTextColor="#999999"
                />
                <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                  <MaterialIcons
                    name={showPassword ? "visibility" : "visibility-off"}
                    size={20}
                    color="#999999"
                  />
                </TouchableOpacity>
              </View>

              {/* Confirm Password Input Field */}
              <View style={styles.inputContainer}>
                <TextInput
                  style={styles.input}
                  placeholder="Xác nhận mật khẩu"
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                  secureTextEntry={!showConfirmPassword}
                  placeholderTextColor="#999999"
                />
                <TouchableOpacity onPress={() => setShowConfirmPassword(!showConfirmPassword)}>
                  <MaterialIcons
                    name={showConfirmPassword ? "visibility" : "visibility-off"}
                    size={20}
                    color="#999999"
                  />
                </TouchableOpacity>
              </View>

              {/* Password Requirements */}
              <View style={styles.requirementsContainer}>
                <View style={styles.requirement}>
                  <MaterialIcons
                    name={isMinLength ? "check-circle" : "cancel"}
                    size={16}
                    color={isMinLength ? "green" : "red"}
                  />
                  <Text style={styles.requirementText}>Dài ít nhất 8 ký tự</Text>
                </View>
                <View style={styles.requirement}>
                  <MaterialIcons
                    name={isSpecialChar ? "check-circle" : "cancel"}
                    size={16}
                    color={isSpecialChar ? "green" : "red"}
                  />
                  <Text style={styles.requirementText}>Bao gồm số và ký tự đặc biệt</Text>
                </View>
                <View style={styles.requirement}>
                  <MaterialIcons
                    name={isPasswordMatch ? "check-circle" : "cancel"}
                    size={16}
                    color={isPasswordMatch ? "green" : "red"}
                  />
                  <Text style={styles.requirementText}>Mật khẩu khớp</Text>
                </View>
              </View>

              {/* Reset and Login Button */}
              <TouchableOpacity
                style={[styles.button, !isValid && styles.disabledButton]}
                onPress={handleResetAndLogin}
                disabled={!isValid || isLoading}
              >
                <Text style={styles.buttonText}>
                  {isLoading ? "Đang xử lý..." : "Đặt lại và đăng nhập"}
                </Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </SafeAreaView>
      </ImageBackground>
    </>
  )
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    width: "100%",
    height: "100%",
  },
  safeArea: {
    flex: 1,
    width: "100%",
  },
  scrollContainer: {
    flexGrow: 1,
    alignItems: "center",
    width: "100%",
    paddingTop: 80,
    paddingBottom: 0,
    justifyContent: "space-between",
  },
  logo: {
    width: "50%",
    height: "15%",
    marginBottom: 20,
  },
  formContainer: {
    width: "100%",
    height: "75%",
    backgroundColor: "white",
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 20,
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.25,
    shadowRadius: 5,
    elevation: 5,
  },
  headerText: {
    fontSize: 24,
    marginBottom: 20,
    color: "#000",
    fontFamily: "Inter-Black",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    height: 43,
    borderColor: "#D1D5DB",
    borderWidth: 1,
    borderRadius: 50,
    marginBottom: 16,
    paddingLeft: 10,
    paddingRight: 20,
  },
  input: {
    flex: 1,
    height: "100%",
    fontSize: 16,
    paddingLeft: 10,
    color: "#4B5563",
    fontFamily: "Inter-Medium",
  },
  requirementsContainer: {
    width: "100%",
    marginBottom: 20,
  },
  requirement: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  requirementText: {
    fontSize: 14,
    color: "#4B5563",
    marginLeft: 8,
    fontFamily: "Inter-Medium",
  },
  button: {
    width: "100%",
    height: 43,
    backgroundColor: "#FF5722",
    borderRadius: 50,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
  },
  disabledButton: {
    backgroundColor: "#D1D5DB",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontFamily: "Inter-Medium",
  },
})

export default ResetPasswordScreen