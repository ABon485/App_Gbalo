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
import { useToast } from "@/context/ToastContext";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { RegisterTypePhone } from "@/types/user";
import { ApiResponse } from "@/types/api";
import api from "@/config/api";

export default function Confirm() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [userName, setUserName] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { showToast } = useToast();
  const { phone: phoneFromParams, code: otpCodeFromParams } =
    useLocalSearchParams<{ phone: string; code: string }>();

  useEffect(() => {
    if (phoneFromParams) {
      setPhone(phoneFromParams);
    }
  }, [phoneFromParams]);

  const handleRegister = async () => {
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

    setLoading(true);

    try {
      const token = await AsyncStorage.getItem("registerToken");
      if (!token) {
        showToast({
          type: "error",
          message: "Không tìm thấy token xác minh. Vui lòng thử lại từ đầu.",
        });
        return;
      }

      const formattedPhone = phone.replace(/^\+\d{1,3}/, "0");
      console.log("formattedPhone", formattedPhone);
      const formData = {
        token,
        userName,
        phone: formattedPhone,
        password,
        confirmPassword,
        code: otpCodeFromParams,
      };

      console.log("first", formData);
      const response: ApiResponse = await api.post(
        "/Accounts/ResgiterByCode",
        formData
      );
      console.log("trả về", response);

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
      console.log(
        "Full error:",
        JSON.stringify(error?.response?.data, null, 2)
      );
      showToast({
        type: "error",
        message:
          error?.response?.data?.message || "Có lỗi xảy ra, vui lòng thử lại",
      });
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

          {/* Số điện thoại */}
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

          {/* Button */}
          <CustomButtonRN
            title={loading ? "Đang đăng ký..." : "Tiếp tục"}
            onPress={handleRegister}
            disabled={loading}
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
