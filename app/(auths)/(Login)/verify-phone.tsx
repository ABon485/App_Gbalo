"use client"

import { useState, useRef } from "react"
import { View, Text, TouchableOpacity, Image, SafeAreaView, ImageBackground, StatusBar, TextInput, StyleSheet } from "react-native"
import { Stack, useLocalSearchParams, router } from "expo-router"
import type { TextInput as RNTextInput } from "react-native"

const VerifyPhoneScreen = () => {
  const { phoneNumber } = useLocalSearchParams()
  const [verificationCode, setVerificationCode] = useState(["", "", "", "", "", ""])

  // 👇 Fix 1: Khai báo rõ kiểu của ref
  const inputRefs = useRef<Array<RNTextInput | null>>([])

  // Format phone number to display with asterisks
  const formatPhoneNumber = (phone: string | string[] | undefined) => {
    if (!phone) return ""
    const phoneStr = String(phone)
    if (phoneStr.length <= 4) return phoneStr

    const firstPart = phoneStr.substring(0, 3)
    const lastPart = phoneStr.substring(phoneStr.length - 3)
    const middlePart = "*".repeat(Math.min(4, phoneStr.length - 6))

    return `${firstPart}${middlePart}${lastPart}`
  }

  // 👇 Fix 2: Gán kiểu cho index
  const handleCodeChange = (text: string, index: number) => {
    const newCode = [...verificationCode]
    newCode[index] = text
    setVerificationCode(newCode)

    if (text && index < 5 && inputRefs.current[index + 1]) {
      inputRefs.current[index + 1]?.focus()
    }
  }

  const handleKeyPress = (e: any, index: number) => {
    if (e.nativeEvent.key === "Backspace" && !verificationCode[index] && index > 0) {
      inputRefs.current[index - 1]?.focus()
    }
  }

  const handleContinue = () => {
    const code = verificationCode.join("")
    if (code.length === 6) {
      router.push("/(tabs)/assistant")
    }
  }

  const isCodeComplete = verificationCode.join("").length === 6

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <ImageBackground
        source={require("@/assets/images/BackGroud.png")}
        style={styles.backgroundImage}
      >
        <StatusBar translucent backgroundColor="transparent" />
        <SafeAreaView style={styles.safeArea}>
          <View style={styles.container}>
            <Image
              source={require("@/assets/images/imagLogo.png")}
              style={styles.logo}
              resizeMode="contain"
            />

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

              <TouchableOpacity
                style={[styles.continueButton, isCodeComplete ? styles.activeButton : styles.inactiveButton]}
                onPress={handleContinue}
                disabled={!isCodeComplete}
              >
                <Text style={[styles.continueButtonText, isCodeComplete ? styles.activeButtonText : styles.inactiveButtonText]}>
                  Tiếp tục
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </SafeAreaView>
      </ImageBackground>
    </>
  )
}

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  safeArea: {
    flex: 1,
    width: '100%',
  },
  container: {
    flex: 1,
    alignItems: 'center',
    width: '100%',
    paddingTop: 90,
  },
  logo: {
    width: '50%',
    height: '15%',
    marginBottom:"auto",
  },
  formContainer: {
    width: '100%',
    height: '75%',
    backgroundColor: 'white',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingVertical: 30,
    paddingHorizontal: 20,
    alignItems: 'center',
    shadowColor: 'black',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    marginTop: 'auto',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
    color: 'black',
  },
  subtitle: {
    fontSize: 14,
    color: '#777',
    textAlign: 'center',
    marginBottom: 10,
  },
  phoneNumber: {
    fontSize: 16,
    fontWeight: '500',
    color: '#FF5722',
    marginBottom: 20,
  },
  codeInputContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 20,
    paddingHorizontal: 30,
  },
  codeInput: {
    width: 40,
    height: 40,
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 5,
    textAlign: 'center',
    fontSize: 18,
    color: '#333',
  },
  continueButton: {
    width: '100%',
    height: 50,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
  },
  activeButton: {
    backgroundColor: '#FF5722',
  },
  inactiveButton: {
    backgroundColor: '#ddd',
  },
  continueButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  activeButtonText: {
    color: 'white',
  },
  inactiveButtonText: {
    color: '#666',
  },
})

export default VerifyPhoneScreen
