"use client";

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
} from "react-native";
import styles from "@/styles/auth/loginScreen";
import Feather from "react-native-vector-icons/Feather";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { Stack, useRouter } from "expo-router";
import GoogleButton from "@/components/common/customButtonSocial/GoogleButton"; 
import FacebookButton from "@/components/common/customButtonSocial/FacebookButton"; 
import AppleButton from "@/components/common/customButtonSocial/AppleButton"; 


const LoginScreen = () => {
  const [loginMethod, setLoginMethod] = useState("email");
  const router = useRouter();
  const handleFacebookLogin = () => {
    console.log("Initiating Facebook login");
  };

  const handleLoginPressEmail = () => {
    router.push('/(auths)/(Login)/loginEmail');
  };

  const handleLoginPressPhone = () => {
    router.push('/(auths)/(Login)/loginByPhone');
  };

  const handleLoginPressApple = () => {
    router.push('/(auths)/(Login)/loginPhone');
  };

  const handleRegister = () => {
    router.replace("/(auths)/(register)/registerPhone/RegisterPhone");
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
              <View style={styles.inputContainer}>
                {/* Email button */}
                <TouchableOpacity
                  style={styles.optionButton}
                  onPress={handleLoginPressEmail}
                >
                  <MaterialCommunityIcons
                    name="email-outline"
                    size={22}
                    color="#999999"
                    style={styles.optionIcon}
                  />
                  <Text style={styles.optionText}>Email</Text>
                </TouchableOpacity>

                {/* Phone button */}
                <TouchableOpacity
                  style={styles.optionButton}
                  onPress={handleLoginPressPhone}
                >
                  <Feather
                    name="phone"
                    size={20}
                    color="#999999"
                    style={styles.optionIcon}
                  />
                  <Text style={styles.optionText}>Số điện thoại</Text>
                </TouchableOpacity>
              </View>

              <View style={styles.dividerContainer}>
                <View style={styles.divider} />
                <Text style={styles.dividerText}>Hoặc đăng nhập bằng</Text>
                <View style={styles.divider} />
              </View>
              <GoogleButton disabled={false} />
              <FacebookButton onPress={handleFacebookLogin} />
              <AppleButton onPress={handleLoginPressApple}/>
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

export default LoginScreen;