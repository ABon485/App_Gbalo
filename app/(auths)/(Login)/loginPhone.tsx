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
  Alert,
} from "react-native"
import styles from "@/styles/auth/loginPhone"
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons"
import MaterialIcons from "react-native-vector-icons/MaterialIcons"
import { Stack, router } from "expo-router"
import authApi from "@/services/auth"
import { ApiResponse } from "@/types/api"

const LoginScreen = () => {
  const [phoneNumber, setPhoneNumber] = useState("")
  const [countryCode] = useState("+84")
  const [isLoading, setIsLoading] = useState(false)

  const handleContinue = async () => {
    // Kiểm tra số điện thoại: phải có đúng 10 chữ số và chỉ chứa số
    if (!phoneNumber || phoneNumber.length !== 10 || !/^\d{10}$/.test(phoneNumber)) {
      Alert.alert("Lỗi", "Vui lòng nhập số điện thoại hợp lệ (10 chữ số).")
      return
    }

    setIsLoading(true)
    try {
      const fullPhoneNumber = countryCode + phoneNumber
      const formData = {
        phone: fullPhoneNumber,
        password: "123456", // Mật khẩu mặc định theo yêu cầu
        rememberMe: true, // Đặt rememberMe là true theo yêu cầu từ Swagger
      }

      const axiosResponse = await authApi.loginPhone(formData)
      const response: ApiResponse = axiosResponse.data

      if (response.success) {
        // Chuyển sang màn xác thực OTP, gửi số điện thoại và OTP mặc định
        router.push({
          pathname: "/(auths)/(Login)/verify-phone",
          params: {
            phoneNumber: fullPhoneNumber,
            otp: "123456", // OTP mặc định là mật khẩu
          },
        })
      } else {
        Alert.alert("Lỗi", response.message || "Không thể gửi mã OTP. Vui lòng thử lại.")
      }
    } catch (error: any) {
      Alert.alert("Lỗi", error.message || "Đã xảy ra lỗi. Vui lòng thử lại.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleEmailLogin = () => {
    router.push("/(auths)/(Login)/loginEmail")
  }

  const handleRegister = () => {
    router.push("/(auths)/(register)/registerPhone/RegisterPhone")
  }

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <ImageBackground
        source={require("../../../assets/images/BackGroud.png")}
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

              <View style={styles.phoneInputField}>
                <TouchableOpacity style={styles.countryCodeContainer}>
                  <Text style={styles.countryCodeText}>{countryCode}</Text>
                  <MaterialIcons name="keyboard-arrow-down" size={18} color="#999999" />
                </TouchableOpacity>
                <TextInput
                  style={styles.phoneInput}
                  placeholder="Nhập số điện thoại"
                  value={phoneNumber}
                  onChangeText={setPhoneNumber}
                  keyboardType="phone-pad"
                  placeholderTextColor="#999999"
                  maxLength={10}
                />
              </View>

              <TouchableOpacity
                style={[styles.loginButton, isLoading && { opacity: 0.6 }]}
                onPress={handleContinue}
                disabled={isLoading}
              >
                <Text style={styles.loginButtonText}>
                  {isLoading ? "Đang xử lý..." : "Tiếp tục"}
                </Text>
              </TouchableOpacity>

              <View style={styles.dividerContainer}>
                <View style={styles.divider} />
                <Text style={styles.dividerText}>Hoặc đăng nhập bằng</Text>
                <View style={styles.divider} />
              </View>

              <TouchableOpacity style={styles.socialButton} onPress={handleEmailLogin}>
                <View style={styles.socialIconContainer}>
                  <MaterialCommunityIcons name="email-outline" size={20} color="gray" />
                </View>
                <Text style={styles.socialButtonText}>Tiếp tục với Email</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.socialButton}>
                <View style={styles.socialIconContainer}>
                  <Image source={require("@/assets/images/Google.png")} className="w-6 h-6" />
                </View>
                <Text style={styles.socialButtonText}>Tiếp tục với Google</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.socialButton}>
                <View style={styles.socialIconContainer}>
                  <Image source={require("@/assets/images/Facebook.png")} className="w-6 h-6" />
                </View>
                <Text style={styles.socialButtonText}>Tiếp tục với Facebook</Text>
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
  )
}

export default LoginScreen