import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  ScrollView,
  ImageBackground,
  Alert,
  StyleSheet,
} from "react-native";
import styles from "@/styles/auth/register/confirmEmail";
import { router, Stack } from "expo-router";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import CustomButtonRN from "@/components/common/customButtonRN";
import api from "@/config/api";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { ApiResponse } from "@/types/api";
import { RegisterType } from "@/types/user";

export default function Confirm() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [userName, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = () => {
    router.push("/(auths)/(Login)/login");
  };

  const handleRegister = async () => {
    if (!userName || !email || !password || !confirmPassword) {
      Alert.alert("Lỗi", "Vui lòng nhập đầy đủ thông tin");
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert("Lỗi", "Mật khẩu xác nhận không khớp");
      return;
    }

    setLoading(true);

    try {
      const formData: RegisterType = {
        userName,
        email,
        password,
        confirmPassword,
      };

      const response: ApiResponse = await api.post(
        "/Accounts/Resgiter",
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
        Alert.alert("Thành công", "Đăng ký thành công!");
        router.replace("/(tabs)/assistant");
      } else {
        Alert.alert("Lỗi", response.message || "Đăng ký thất bại");
      }
    } catch (error: any) {
      Alert.alert("Lỗi", error.message || "Có lỗi xảy ra, vui lòng thử lại");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
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
            <CustomButtonRN title="Tiếp tục" onPress={handleRegister} />

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
    </>
  );
}

