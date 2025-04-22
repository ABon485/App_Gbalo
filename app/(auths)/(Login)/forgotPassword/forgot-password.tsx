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
      <ImageBackground source={require("@/assets/images/BackGroud.png")} className="flex-1 w-full h-full">
        <StatusBar translucent backgroundColor="transparent" />
        <SafeAreaView className="flex-1 w-full">
          <ScrollView contentContainerStyle={{ flexGrow: 1, alignItems: "center", width: "100%", paddingTop: 80, paddingBottom: 0, justifyContent: "space-between" }}>
            <Image source={require("@/assets/images/imagLogo.png")} className="w-1/2 h-[15%] mb-5" resizeMode="contain" />

            <View className="w-full h-3/4 bg-white rounded-t-3xl px-6 pt-6 pb-5 items-center shadow-lg shadow-black/25">
              <Text className="text-2xl mb-6 text-black text-center" style={{ fontFamily:"Inter-Black"  }}>Quên mật khẩu</Text>

              <View className="flex-row items-center w-full h-[43px] border border-gray-300 rounded-full mb-4 pl-1 pr-4">
                <TouchableOpacity className="flex-row items-center px-2 h-full">
                  <Text className="text-base mr-0.5 text-gray-800">{countryCode}</Text>
                  <MaterialIcons name="keyboard-arrow-down" size={18} color="#999999" />
                </TouchableOpacity>
                <TextInput
                  className="flex-1 h-full text-base px-2 text-gray-800"
                  style={{ fontFamily:"Inter-Medium"  }}
                  placeholder="Nhập số điện thoại"
                  value={phoneNumber}
                  onChangeText={setPhoneNumber}
                  keyboardType="phone-pad"
                  placeholderTextColor="#999999"
                />
              </View>

              <TouchableOpacity className="w-full h-[43px] bg-orange-500 rounded-full justify-center items-center mb-2.5" onPress={handleSendCode}>
                <Text className="text-white text-base " style={{ fontFamily:"Inter-Medium"  }}>Gửi mã xác minh </Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </SafeAreaView>
      </ImageBackground>
    </>
  )
}

export default ForgotPasswordScreen