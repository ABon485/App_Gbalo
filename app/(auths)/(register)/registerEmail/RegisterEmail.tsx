import React from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  ScrollView,
  ImageBackground,
  StyleSheet,
} from "react-native";
import styles from "@/styles/auth/register/registerEmail";
import { Stack, useRouter } from "expo-router";
import CustomButtonRN from "@/components/common/customButtonRN";

export default function RegisterEmail() {
  const router = useRouter();

  const handleLogin = () => {
    router.push("/(auths)/(Login)/login");
  };

  const VerifyEmail = () => {
    router.push("/(auths)/(register)/registerEmail/veryfyEmail");
  };

  const HandleRegister = () => {
    router.push("/(auths)/(register)/registerPhone/RegisterPhone");
  };

  return (
    <>
      <Stack.Screen
        name="/(auths)/(register)/Register"
        options={{ headerShown: false }}
      />
      <ImageBackground
        source={require("../../../../assets/images/BackGroud.png")}
        style={styles.backgroundImage}
      >
        <ScrollView contentContainerStyle={styles.scrollViewContent}>
          {/* Logo */}
          <View style={styles.logoContainer}>
            <Image
              source={require("../../../../assets/images/imagLogo.png")}
              resizeMode="contain"
            />
          </View>

          {/* Form */}
          <View style={styles.formContainer}>
            <Text style={styles.title}>Đăng ký</Text>

            <Text style={styles.inputLabel}>
              Email <Text style={styles.required}>*</Text>
            </Text>
            <TextInput
              style={styles.input}
              placeholder="Nhập email"
              keyboardType="email-address"
            />

            <Text style={styles.infoText}>
              Chúng tôi sẽ gọi điện hoặc nhắn tin cho bạn để xác nhận số điện
              thoại. Có áp dụng phí dữ liệu và phí tin nhắn tiêu chuẩn.
              <Text style={styles.privacyPolicy}>
                {" "}
                Chính sách về quyền riêng tư
              </Text>
            </Text>

            {/* Continue Button */}
            <CustomButtonRN title="Tiếp tục" onPress={VerifyEmail} />

            {/* Divider */}
            <View style={styles.dividerContainer}>
              <View style={styles.dividerLine} />
              <Text style={styles.dividerText}>Hoặc</Text>
              <View style={styles.dividerLine} />
            </View>

            {/* Social buttons */}
            <TouchableOpacity
              style={styles.socialButton}
              onPress={HandleRegister}
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

            {/* Login link */}
            <View style={styles.loginLinkContainer}>
              <Text>Bạn đã có tài khoản? </Text>
              <TouchableOpacity onPress={handleLogin}>
                <Text style={styles.loginLink}>Đăng nhập</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </ImageBackground>
    </>
  );
}

