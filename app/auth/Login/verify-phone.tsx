"use client"

import { useState, useRef } from "react"
import { View, Text, TouchableOpacity, Image, SafeAreaView, ImageBackground, StatusBar, TextInput } from "react-native"
import { Stack, useLocalSearchParams, router } from "expo-router"
import styles from "../../../styles/auth/verifyPhone"

const VerifyPhoneScreen = () => {
  const { phoneNumber } = useLocalSearchParams()
  const [verificationCode, setVerificationCode] = useState(["", "", "", "", "", ""])
  const inputRefs = useRef([])

  // Format phone number to display with asterisks
  const formatPhoneNumber = (phone) => {
    if (!phone) return ""
    const phoneStr = String(phone)
    if (phoneStr.length <= 4) return phoneStr

    const firstPart = phoneStr.substring(0, 3)
    const lastPart = phoneStr.substring(phoneStr.length - 3)
    const middlePart = "*".repeat(Math.min(4, phoneStr.length - 6))

    return `${firstPart}${middlePart}${lastPart}`
  }

  const handleCodeChange = (text, index) => {
    // Update the code at the current index
    const newCode = [...verificationCode]
    newCode[index] = text

    setVerificationCode(newCode)

    // Auto-focus to next input if current input is filled
    if (text && index < 5) {
      inputRefs.current[index + 1].focus()
    }
  }

  const handleKeyPress = (e, index) => {
    // Move to previous input on backspace if current input is empty
    if (e.nativeEvent.key === "Backspace" && !verificationCode[index] && index > 0) {
      inputRefs.current[index - 1].focus()
    }
  }

  const handleContinue = () => {
    // Validate and proceed with verification
    const code = verificationCode.join("")
    if (code.length === 6) {
      // Here you would verify the code with your backend
      // For now, just navigate to the next screen
      router.push("/(tabs)/homepage")
    }
  }

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <ImageBackground source={require("../../../assets/images/BackGroud.png")} style={styles.backgroundImage}>
        <StatusBar translucent backgroundColor="transparent" />
        <SafeAreaView style={styles.container}>
          <View style={styles.content}>
            <Image source={require("../../../assets/images/imagLogo.png")} style={styles.logo} resizeMode="contain" />

            <View style={styles.formContainer}>
              <Text style={styles.title}>Xác thực số điện thoại của bạn</Text>
              <Text style={styles.subtitle}>Vui lòng nhập mã xác nhận vừa gửi qua SĐT</Text>

              <Text style={styles.phoneNumber}>{formatPhoneNumber(phoneNumber)}</Text>

              <View style={styles.codeInputContainer}>
                {verificationCode.map((digit, index) => (
                  <TextInput
                    key={index}
                    ref={(ref) => (inputRefs.current[index] = ref)}
                    style={styles.codeInput}
                    value={digit}
                    onChangeText={(text) => handleCodeChange(text, index)}
                    onKeyPress={(e) => handleKeyPress(e, index)}
                    keyboardType="number-pad"
                    maxLength={1}
                    selectTextOnFocus
                  />
                ))}
              </View>

              <TouchableOpacity style={styles.continueButton} onPress={handleContinue}>
                <Text style={styles.continueButtonText}>Tiếp tục</Text>
              </TouchableOpacity>
            </View>
          </View>
        </SafeAreaView>
      </ImageBackground>
    </>
  )
}

export default VerifyPhoneScreen
