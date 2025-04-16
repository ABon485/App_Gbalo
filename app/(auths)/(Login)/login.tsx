    "use client"

    import { useState } from "react"
    import { View, Text, TouchableOpacity, Image, SafeAreaView, ScrollView, ImageBackground, StatusBar } from "react-native"
    import styles from "../../../styles/auth/loginScreen"
    import MaterialIcons from "react-native-vector-icons/MaterialIcons"
    import FontAwesome from "react-native-vector-icons/FontAwesome"
    import { Stack, useRouter } from "expo-router" // ✅ Thêm useRouter

    const LoginScreen = () => {
      const [loginMethod, setLoginMethod] = useState("email")
      const router = useRouter() // ✅ Khởi tạo router  
      const handleLoginPressEmail = () => {
        router.push('/(auths)/(Login)/loginEmail'); // ✅ Điều hướng đến trang login
      };
      const handleLoginPressPhone = () => {
        router.push('/(auths)/(Login)/loginPhone'); // ✅ Điều hướng đến trang login
      };
      const handleRegister = () => {
        router.replace("/(auths)/(register)/Register")
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

                  <View style={styles.inputContainer}>
                    {/* Email button */}
                    <TouchableOpacity
                      style={styles.optionButton}
                      onPress={handleLoginPressEmail} // ✅ Điều hướng đến loginEmail
                    >
                      <MaterialIcons name="email" size={20} color="#999999" style={styles.optionIcon} />
                      <Text style={styles.optionText}>Email</Text>
                    </TouchableOpacity>

                    {/* Phone button */}
                    <TouchableOpacity style={styles.optionButton} onPress={handleLoginPressPhone  }>
                      <MaterialIcons name="phone" size={20} color="#999999" style={styles.optionIcon} />
                      <Text style={styles.optionText}>Số điện thoại</Text>
                    </TouchableOpacity>
                  </View>
                  <View style={styles.dividerContainer}>
                    <View style={styles.divider} />
                    <Text style={styles.dividerText}>Hoặc đăng nhập bằng</Text>
                    <View style={styles.divider} />
                  </View>

                  <TouchableOpacity style={styles.socialButton}>
                    <FontAwesome name="google" size={20} color="#DB4437" style={styles.socialIcon} />
                    <Text style={styles.socialButtonText}>Tiếp tục với Google</Text>
                  </TouchableOpacity>

                  <TouchableOpacity style={styles.socialButton}>
                    <FontAwesome name="facebook" size={20} color="#3b5998" style={styles.socialIcon} />
                    <Text style={styles.socialButtonText}>Tiếp tục với Facebook</Text>
                  </TouchableOpacity>
                  <View style={styles.registerContainer}>
                    <Text style={styles.registerText}>Bạn chưa có tài khoản? </Text>
                    <TouchableOpacity onPress={handleRegister}>
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
