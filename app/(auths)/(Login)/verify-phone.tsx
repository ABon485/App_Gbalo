"use client"

import { useState, useRef } from "react"
import { View, Text, TouchableOpacity, Image, SafeAreaView, ImageBackground, StatusBar, TextInput } from "react-native"
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
        source={require("../../../assets/images/BackGroud.png")}
        className="flex-1 w-full h-full"
      >
        <StatusBar translucent backgroundColor="transparent" />
        <SafeAreaView className="flex-1 w-full">
          <View className="flex-1 items-center w-full pt-20">
            <Image
              source={require("../../../assets/images/imagLogo.png")}
              className="w-1/2 h-[15%] mb-5"
              resizeMode="contain"
            />

            <View className="w-full h-3/4 bg-white rounded-t-3xl px-6 pt-6 pb-5 items-center shadow-md mt-auto">
              <Text className="text-xl font-bold mb-2 text-black text-center">
                Xác thực số điện thoại của bạn
              </Text>
              <Text className="text-sm text-gray-600 text-center mb-2">
                Vui lòng nhập mã xác nhận vừa gửi qua SĐT
              </Text>

              <Text className="text-base text-[#FF5722] font-medium mb-6">
                {formatPhoneNumber(phoneNumber)}
              </Text>

              <View className="flex-row justify-between w-full px-5 mb-8">
                {verificationCode.map((digit, index) => (
                  <TextInput
                    key={index}
                    ref={(ref) => (inputRefs.current[index] = ref)}
                    className="w-10 h-12 border border-gray-300 rounded-lg text-center text-lg text-gray-800"
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
                className={`w-full h-12 rounded-3xl justify-center items-center mt-2 ${isCodeComplete ? "bg-[#FF5722]" : "bg-gray-300"
                  }`}
                onPress={handleContinue}
              >
                <Text
                  className={`text-base font-bold ${isCodeComplete ? "text-white" : "text-gray-600"
                    }`}
                >
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

export default VerifyPhoneScreen
