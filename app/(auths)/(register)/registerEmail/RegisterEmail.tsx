// RegisterEmail.tsx
import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  ScrollView,
  ImageBackground,
} from "react-native";
import styles from "@/styles/auth/register/registerEmail";
import {useRouter } from "expo-router";
import CustomButtonRN from "@/components/common/customButtonRN";
import { Registercode } from "@/types/user";
import { ApiResponse } from "@/types/api";
import api from "@/config/api";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useToast } from "@/context/ToastContext"

export default function RegisterEmail() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const { showToast } = useToast(); 

  const handleLogin = () => {
    router.push("/(auths)/(Login)/login");
  };

  const handleRegisterPhone = () => {
    router.push("/(auths)/(register)/registerPhone/RegisterPhone");
  };

//   const handleContinue = async () => {
//   const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

//   if (!email) {
//     showToast({
//       type: "error",
//       message: "Vui lòng nhập email",
//     });
//     return;
//   }

//   if (!emailRegex.test(email)) {
//     showToast({
//       type: "error",
//       message: "Email không hợp lệ",
//     });
//     return;
//   }

//   try {
//     setLoading(true);
//     const formData: Registercode = { email };
//     const response: ApiResponse = await api.post(
//       "/Accounts/SendResgiterCode",
//       formData
//     );

//     if (response.success) {
//       const token = response.data.token;
//       if (token) {
//         await AsyncStorage.setItem("registerToken", token);
//       }
//       showToast({
//         type: "success",
//         message: "Mã OTP đã được gửi đến email của bạn!",
//       });
//       router.push({
//         pathname: "/(auths)/(register)/registerEmail/veryfyEmail",
//         params: { email },
//       });
//     } else {
//       showToast({
//         type: "error",
//         message: response.message || "Gửi OTP thất bại",
//       });
//     }
//   } catch (error: any) {
//     showToast({
//       type: "error",
//       message: error.message || "Có lỗi xảy ra, vui lòng thử lại",
//     });
//   } finally {
//     setLoading(false);
//   }
  // };
  
  const handleContinue = async () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  
    if (!email) {
      showToast({
        type: "error",
        message: "Vui lòng nhập email",
      });
      return;
    }
  
    if (!emailRegex.test(email)) {
      showToast({
        type: "error",
        message: "Email không hợp lệ",
      });
      return;
    }
  
    try {
      setLoading(true);
  
      // Gán token mặc định
      const defaultToken = "03a83b5c-be9b-4fce-81ee-601428074be5"; // <-- Token giả
      await AsyncStorage.setItem("registerToken", defaultToken);
  
      showToast({
        type: "success",
        message: "Mã OTP đã được gửi đến email của bạn!",
      });
  
      router.push({
        pathname: "/(auths)/(register)/registerEmail/veryfyEmail",
        params: { email },
      });
    } catch (error: any) {
      showToast({
        type: "error",
        message: error.message || "Có lỗi xảy ra, vui lòng thử lại",
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
            <Text style={styles.title}>Đăng ký</Text>
            <Text style={styles.inputLabel}>
              Email <Text style={styles.required}>*</Text>
            </Text>
            <TextInput
              style={styles.input}
              placeholder="Nhập email"
              keyboardType="email-address"
              value={email}
              onChangeText={setEmail}
            />
            <Text style={styles.infoText}>
              Chúng tôi sẽ gửi mã xác nhận qua email để xác minh tài khoản. Có
              áp dụng phí dữ liệu tiêu chuẩn.
              <Text style={styles.privacyPolicy}>
                {" "}
                Chính sách về quyền riêng tư
              </Text>
            </Text>
            <CustomButtonRN
              title={loading ? "Đang gửi..." : "Tiếp tục"}
              onPress={handleContinue}
              // disabled={loading}
            />
            <View style={styles.dividerContainer}>
              <View style={styles.dividerLine} />
              <Text style={styles.dividerText}>Hoặc</Text>
              <View style={styles.dividerLine} />
            </View>
            <TouchableOpacity
              style={styles.socialButton}
              onPress={handleRegisterPhone}
            >
              <Image
                source={require("../../../../assets/images/social/Phone.png")}
              />
              <Text style={styles.socialButtonText}>
                Tiếp tục với số điện thoại
              </Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.socialButton}>
              <Image
                source={require("../../../../assets/images/social/Google.png")}
              />
              <Text style={styles.socialButtonText}>Tiếp tục với Google</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.socialButton}>
              <Image
                source={require("../../../../assets/images/social/Facebook.png")}
              />
              <Text style={styles.socialButtonText}>Tiếp tục với Facebook</Text>
            </TouchableOpacity>
            <View style={styles.loginLinkContainer}>
              <Text>Bạn đã có tài khoản? </Text>
              <TouchableOpacity onPress={handleLogin}>
                <Text style={styles.loginLink}>Đăng nhập</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </ImageBackground>
  );
}
