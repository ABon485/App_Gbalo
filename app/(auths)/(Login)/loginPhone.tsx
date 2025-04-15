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
} from "react-native"
import styles from "../../../styles/auth/loginPhone"
import MaterialIcons from "react-native-vector-icons/MaterialIcons"
import FontAwesome from "react-native-vector-icons/FontAwesome"
import { Stack, router } from "expo-router"

const LoginScreen = () => {
  const [phoneNumber, setPhoneNumber] = useState("")
  const [countryCode, setCountryCode] = useState("+84")

  const handleContinue = () => {
    // Navigate to verification screen with phone number
    if (phoneNumber) {
      router.push({
        pathname: "/(auths)/(Login)/verify-phone",
        params: { phoneNumber },
      })
    }
  }

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <ImageBackground source={require("../../../assets/images/BackGroud.png")} style={styles.backgroundImage}>
        <StatusBar translucent backgroundColor="transparent" />
        <SafeAreaView style={styles.container}>
          <ScrollView contentContainerStyle={styles.scrollContainer}>
            <Image source={require("../../../assets/images/imagLogo.png")} style={styles.logo} resizeMode="contain" />

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
                />
              </View>

              <TouchableOpacity style={styles.loginButton} onPress={handleContinue}>
                <Text style={styles.loginButtonText}>Tiếp tục</Text>
              </TouchableOpacity>

              <View style={styles.dividerContainer}>
                <View style={styles.divider} />
                <Text style={styles.dividerText}>Hoặc đăng nhập bằng</Text>
                <View style={styles.divider} />
              </View>

              <TouchableOpacity style={styles.socialButton}>
                <View style={styles.socialIconContainer}>
                  <FontAwesome name="google" size={18} color="#DB4437" />
                </View>
                <Text style={styles.socialButtonText}>Tiếp tục với Google</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.socialButton}>
                <View style={styles.socialIconContainer}>
                  <FontAwesome name="facebook" size={18} color="#3b5998" />
                </View>
                <Text style={styles.socialButtonText}>Tiếp tục với Facebook</Text>
              </TouchableOpacity>

              <View style={styles.registerContainer}>
                <Text style={styles.registerText}>Bạn chưa có tài khoản? </Text>
                <TouchableOpacity>
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
