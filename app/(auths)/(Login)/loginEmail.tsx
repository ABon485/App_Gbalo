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
import styles from "../../../styles/auth/loginEmail"
import EvilIcons from "react-native-vector-icons/EvilIcons"
import Feather from "react-native-vector-icons/Feather"
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons"
import { Stack,router } from "expo-router"

const LoginEmail = () => {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
    const handlePhoneLogin = () => {
        router.push("/(auths)/(Login)/loginPhone")
      }
      const handleForgotPassword = () => {
        router.push("/(auths)/(Login)/forgotPassword/forgot-password")
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

              <View style={styles.emailLoginContainer}>
                <View style={styles.inputField}>
                  <MaterialCommunityIcons name="email-outline" size={22} color="#999999" style={styles.inputIcon} />
                  <TextInput
                    style={styles.input}
                    placeholder="Địa chỉ email"
                    value={email}
                    onChangeText={setEmail}
                    keyboardType="email-address"
                    autoCapitalize="none"
                  />
                </View>

                <View style={styles.inputField}>
                  <EvilIcons name="lock" size={30} color="#999999" style={styles.inputIcon} />
                  <TextInput
                    style={styles.input}
                    placeholder="Mật khẩu"
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry
                  />
                </View>

                <TouchableOpacity style={styles.loginButton}>
                  <Text style={styles.loginButtonText}>Đăng nhập</Text>
                </TouchableOpacity>

                  <TouchableOpacity style={styles.forgotPasswordContainer} onPress={handleForgotPassword}>
                    <Text style={styles.forgotPasswordText}>Quên mật khẩu</Text>
                  </TouchableOpacity>
              </View>

              <View style={styles.dividerContainer}>
                <View style={styles.divider} />
                <Text style={styles.dividerText}>Hoặc đăng nhập bằng</Text>
                <View style={styles.divider} />
              </View>
              <TouchableOpacity style={styles.socialButton} onPress={handlePhoneLogin}>
                <View style={styles.socialIconContainer}>
                  <Feather name="phone" size={20} color="gray" />
                </View>
                <Text style={styles.socialButtonText}>Tiếp tục với số điện thoại</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.socialButton}>
              <Image source={require("../../../assets/images/Google.png")} className="w-6 h-6"/>
                <Text style={styles.socialButtonText}>Tiếp tục với Google</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.socialButton}>
              <Image source={require("../../../assets/images/Facebook.png")} className="w-6 h-6"/>
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

export default LoginEmail