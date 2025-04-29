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
import { RegisterType } from "@/types/user";
import { useToast } from "@/context/ToastContext";

export default function ConfirmEmail() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [userName, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { email: emailFromParams } = useLocalSearchParams<{ email: string }>();
  const { showToast } = useToast();

  useEffect(() => {
    if (emailFromParams) {
      setEmail(emailFromParams);
    }
  }, [emailFromParams]);

  const handleLogin = () => {
    router.push("/(auths)/(Login)/login");
  };

  // const handleRegister = async () => {
  //   if (!userName || !password || !confirmPassword) {
  //     showToast({
  //       type: "error",
  //       message: "Vui lòng nhập đầy đủ thông tin",
  //     });
  //     return;
  //   }

  //   if (password !== confirmPassword) {
  //     showToast({
  //       type: "error",
  //       message: "Mật khẩu xác nhận không khớp",
  //     });
  //     return;
  //   }

  //   setLoading(true);

  //   try {
  //     const formData: RegisterType = {
  //       token: "",
  //       code: "",
  //       userName,
  //       email,
  //       password,
  //       confirmPassword,
  //     };

  //     const response: ApiResponse = await api.post(
  //       "/Accounts/ResgiterByCode",
  //       formData
  //     );

  //     if (response.success) {
  //       await AsyncStorage.setItem(
  //         "data",
  //         JSON.stringify({
  //           token: response.data.token,
  //           user: response.data.user,
  //         })
  //       );
  //       showToast({
  //         type: "success",
  //         message: "Đăng ký thành công!",
  //       });
  //       router.replace("/(tabs)/assistant");
  //     } else {
  //       showToast({
  //         type: "error",
  //         message: response.message || "Đăng ký thất bại",
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

  const handleRegister = async () => {
    console.log("Đang kiểm tra xem tên người dùng đã tồn tại chưa...");

    // Giả sử có một API để kiểm tra tên người dùng
    try {
      const checkUserResponse: ApiResponse = await api.get(
        `/Accounts/checkUserExists?userName=${userName}`
      );

      if (checkUserResponse.success && checkUserResponse.data.exists) {
        // Nếu tên người dùng đã tồn tại
        console.log("Tên người dùng đã tồn tại: ", userName);
        showToast({
          type: "error",
          message: "Tên người dùng đã tồn tại, vui lòng chọn tên khác.",
        });
        return; // Dừng lại nếu tên người dùng đã tồn tại
      }

      console.log("Tên người dùng chưa tồn tại, tiếp tục đăng ký...");

      // Kiểm tra các trường thông tin
      if (!userName || !password || !confirmPassword) {
        showToast({
          type: "error",
          message: "Vui lòng nhập đầy đủ thông tin",
        });
        return;
      }

      if (password !== confirmPassword) {
        showToast({
          type: "error",
          message: "Mật khẩu xác nhận không khớp",
        });
        return;
      }

      // Tạo token và code mặc định
      const token = "defaultGeneratedToken"; // Token mặc định
      const code = "defaultGeneratedCode"; // Code mặc định

      // Kiểm tra xem token và code có giá trị hợp lệ không
      if (!token || !code) {
        showToast({
          type: "error",
          message: "Token và Code là bắt buộc.",
        });
        return;
      }

      setLoading(true);

      const formData: RegisterType = {
        token, // Gửi token mặc định
        code, // Gửi code mặc định
        userName,
        email,
        password,
        confirmPassword,
      };

      const response: ApiResponse = await api.post(
        "/Accounts/ResgiterByCode",
        formData
      );

      if (response.success) {
        await AsyncStorage.setItem(
          "data",
          JSON.stringify({
            token: response.data.token,
            user: response.data.user,
          })
        );
        showToast({
          type: "success",
          message: "Đăng ký thành công!",
        });
        router.replace("/(tabs)/assistant");
      } else {
        showToast({
          type: "error",
          message: response.message || "Đăng ký thất bại",
        });
      }
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
            <Text style={styles.title}>Hoàn tất đăng ký</Text>

            {/* Họ và tên */}
            <Text style={styles.label}>
              Họ và tên <Text style={styles.required}>*</Text>
            </Text>
            <TextInput
              style={styles.input}
              placeholder="Nhập tên của bạn"
              value={userName}
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
              <Text style={styles.boldText}>Chính sách của Gbalo</Text>, đồng
              thời chấp thuận{" "}
              <Text style={styles.boldText}>Chính sách về quyền riêng tư</Text>.
            </Text>
          </View>
        </ScrollView>
      </ImageBackground>
  );
}
