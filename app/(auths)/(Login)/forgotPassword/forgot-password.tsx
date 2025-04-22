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

const ForgotPasswordScreen = () => {
  const [phoneNumber, setPhoneNumber] = useState("")
  const [countryCode, setCountryCode] = useState("+84")

  const handleSendCode = () => {
    if (phoneNumber) {
      router.push({
        pathname: "/(auths)/(Login)/forgotPassword/verify-phone-forgotPassword",
        params: { phoneNumber },
      })
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
              <Text style={styles.headerText}>Quên mật khẩu</Text>

              <View style={styles.inputContainer}>
                <TouchableOpacity style={styles.countryCodeButton}>
                  <Text style={styles.countryCodeText}>{countryCode}</Text>
                  <MaterialIcons name="keyboard-arrow-down" size={18} color="#999999" />
                </TouchableOpacity>
                <TextInput
                  style={styles.input}
                  placeholder="Nhập số điện thoại"
                  value={phoneNumber}
                  onChangeText={setPhoneNumber}
                  keyboardType="phone-pad"
                  placeholderTextColor="#999999"
                />
              </View>

              <TouchableOpacity style={styles.sendCodeButton} onPress={handleSendCode}>
                <Text style={styles.sendCodeButtonText}>Gửi mã xác minh</Text>
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
  countryCodeButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingRight: 10,
  },
  countryCodeText: {
    fontSize: 16,
    color: "#4B5563",
  },
  input: {
    flex: 1,
    height: "100%",
    fontSize: 16,
    paddingLeft: 10,
    color: "#4B5563",
    fontFamily: "Inter-Medium",
  },
  sendCodeButton: {
    width: "100%",
    height: 43,
    backgroundColor: "#FF5722",
    borderRadius: 50,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
  },
  sendCodeButtonText: {
    color: "#fff",
    fontSize: 16,
    fontFamily: "Inter-Medium",
  },
})

export default ForgotPasswordScreen
