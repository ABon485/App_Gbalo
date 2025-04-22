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
  StyleSheet
} from "react-native"
import MaterialIcons from "react-native-vector-icons/MaterialIcons"
import { Stack, router } from "expo-router"

const ResetPasswordScreen = () => {
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)

  // Password validation checks
  const isMinLength = password.length >= 8
  const isSpecialChar = /[.!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)

  // Handle Reset and Login
  const handleResetAndLogin = () => {
    if (isMinLength && isSpecialChar) {
      // Add logic to reset password and log in
      router.push("/(auths)/(Login)/login") // Navigate to login screen after reset
    }
  }

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <ImageBackground source={require("@/assets/images/BackGroud.png")} style={styles.background}>
        <StatusBar translucent backgroundColor="transparent" />
        <SafeAreaView style={styles.safeArea}>
          <ScrollView contentContainerStyle={styles.scrollContainer}>
            <Image source={require("@/assets/images/imagLogo.png")} style={styles.logo} resizeMode="contain" />

            <View style={styles.formContainer}>
              <Text style={styles.headerText}>Đặt lại mật khẩu</Text>

              {/* Password Input Field */}
              <View style={styles.inputContainer}>
                <TextInput
                  style={styles.input}
                  placeholder="Nhập mật khẩu của bạn"
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry={!showPassword}
                  placeholderTextColor="#999999"
                />
                <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                  <MaterialIcons
                    name={showPassword ? "visibility" : "visibility-off"}
                    size={20}
                    color="#999999"
                  />
                </TouchableOpacity>
              </View>

              {/* Password Requirements */}
              <View style={styles.requirementsContainer}>
                <View style={styles.requirement}>
                  <MaterialIcons
                    name={isMinLength ? "check-circle" : "cancel"}
                    size={16}
                    color={isMinLength ? "green" : "red"}
                  />
                  <Text style={styles.requirementText}>
                    Dài ít nhất 8 ký tự
                  </Text>
                </View>
                <View style={styles.requirement}>
                  <MaterialIcons
                    name={isSpecialChar ? "check-circle" : "cancel"}
                    size={16}
                    color={isSpecialChar ? "green" : "red"}
                  />
                  <Text style={styles.requirementText}>
                    Bao gồm số ký và ký tự đặc biệt
                  </Text>
                </View>
              </View>

              {/* Reset and Login Button */}
              <TouchableOpacity
                style={[styles.button, !(isMinLength && isSpecialChar) && styles.disabledButton]}
                onPress={handleResetAndLogin}
                disabled={!(isMinLength && isSpecialChar)}
              >
                <Text style={styles.buttonText}>Đặt lại và đăng nhập</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </SafeAreaView>
      </ImageBackground>
    </>
  )
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    width: "100%",
    height: "100%",
  },
  safeArea: {
    flex: 1,
    width: "100%",
  },
  scrollContainer: {
    flexGrow: 1,
    alignItems: "center",
    width: "100%",
    paddingTop: 80,
    paddingBottom: 0,
    justifyContent: "space-between",
  },
  logo: {
    width: "50%",
    height: "15%",
    marginBottom: 20,
  },
  formContainer: {
    width: "100%",
    height: "75%",
    backgroundColor: "white",
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 20,
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.25,
    shadowRadius: 5,
    elevation: 5,
  },
  headerText: {
    fontSize: 24,
    marginBottom: 20,
    color: "#000",
    fontFamily: "Inter-Black",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    height: 43,
    borderColor: "#D1D5DB",
    borderWidth: 1,
    borderRadius: 50,
    marginBottom: 16,
    paddingLeft: 10,
    paddingRight: 20,
  },
  input: {
    flex: 1,
    height: "100%",
    fontSize: 16,
    paddingLeft: 10,
    color: "#4B5563",
    fontFamily: "Inter-Medium",
  },
  requirementsContainer: {
    width: "100%",
    marginBottom: 20,
  },
  requirement: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  requirementText: {
    fontSize: 14,
    color: "#4B5563",
    marginLeft: 8,
    fontFamily: "Inter-Medium",
  },
  button: {
    width: "100%",
    height: 43,
    backgroundColor: "#FF5722",
    borderRadius: 50,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
  },
  disabledButton: {
    backgroundColor: "#D1D5DB",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontFamily: "Inter-Medium",
  },
})

export default ResetPasswordScreen
