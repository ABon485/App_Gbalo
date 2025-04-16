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
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons"
import MaterialIcons from "react-native-vector-icons/MaterialIcons"
import { Stack, router } from "expo-router"

const LoginScreen = () => {
  const [phoneNumber, setPhoneNumber] = useState("")
  const [countryCode, setCountryCode] = useState("+84")

  const handleContinue = () => {
    if (phoneNumber) {
      router.push({
        pathname: "/(auths)/(Login)/verify-phone",
        params: { phoneNumber },
      })
    }
  }

  const handleEmailLogin = () => {
    router.push("/(auths)/(Login)/loginEmail") // Navigate to email login screen
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

              {/* New Email Social Button */}
              <TouchableOpacity style={styles.socialButton} onPress={handleEmailLogin}>
                <View style={styles.socialIconContainer}>
                  <MaterialCommunityIcons name="email-outline" size={20} color="gray" />
                </View>
                <Text style={styles.socialButtonText}>Tiếp tục với Email</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.socialButton}>
                <View style={styles.socialIconContainer}>
                <Image source={require("../../../assets/images/Google.png")} className="w-6 h-6"/>
                </View>
                <Text style={styles.socialButtonText}>Tiếp tục với Google</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.socialButton}>
                <View style={styles.socialIconContainer}>
                <Image source={require("../../../assets/images/Facebook.png")} className="w-6 h-6"/>
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