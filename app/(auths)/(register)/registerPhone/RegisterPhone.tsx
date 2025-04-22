import React from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  ScrollView,
  ImageBackground,
  StatusBar,
  StyleSheet,
} from "react-native";
import styles from "@/styles/auth/register/registerPhone";
import { Stack, useRouter } from "expo-router";
import CustomButtonRN from "@/components/common/customButtonRN";

export default function Register() {
  const router = useRouter();

  const handleLogin = () => {
    router.push("/(auths)/(Login)/login");
  };

  const handleRegisterEmail = () => {
    router.push("/(auths)/(register)/registerEmail/RegisterEmail");
  };

  const verifyPhone = () => {
    router.push("/(auths)/(register)/registerPhone/veryfyPhone");
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
        <StatusBar translucent backgroundColor="transparent" />
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

            {/* Quốc gia/Khu vực + Số điện thoại */}
            <View style={styles.countryPhoneContainer}>
              <View style={styles.countryPhoneHeader}>
                <Text style={styles.countryPhoneLabel}>Quốc gia/Khu vực</Text>
                <Text style={styles.countryPhoneText}>Việt Nam (+84)</Text>
              </View>
              <TextInput
                placeholder="Số điện thoại"
                keyboardType="phone-pad"
                style={styles.input}
              />
            </View>

            {/* Mô tả xác nhận */}
            <Text style={styles.privacyText}>
              Chúng tôi sẽ gọi điện hoặc nhắn tin cho bạn để xác nhận số điện
              thoại. Có áp dụng phí dữ liệu và phí tin nhắn tiêu chuẩn.
              <Text style={styles.privacyLink}>
                {" "}
                Chính sách về quyền riêng tư
              </Text>
            </Text>

            {/* Tiếp tục */}
            <CustomButtonRN title="Tiếp tục" onPress={verifyPhone} />

            {/* Divider */}
            <View style={styles.divider}>
              <View style={styles.dividerLine} />
              <Text style={styles.dividerText}>Hoặc</Text>
              <View style={styles.dividerLine} />
            </View>

            {/* Social buttons */}
            <TouchableOpacity
              style={styles.socialButton}
              onPress={handleRegisterEmail}
            >
              <Image
                source={require("../../../../assets/images/social/email.png")}
              />
              <Text style={styles.socialButtonText}>Tiếp tục với email</Text>
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
              <Text style={styles.loginLinkText}>Bạn đã có tài khoản? </Text>
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

