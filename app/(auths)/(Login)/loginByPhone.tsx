import React from "react";
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    Image,
    SafeAreaView,
    ScrollView,
    ImageBackground,
    StatusBar,
} from "react-native";
import styles from "@/styles/auth/loginByPhone";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import AntDesign from "@expo/vector-icons/AntDesign";
import GoogleButton from "@/components/common/customButtonSocial/GoogleButton";
import FacebookButton from "@/components/common/customButtonSocial/FacebookButton";
import AppleButton from "@/components/common/customButtonSocial/AppleButton";
import { router, Stack } from "expo-router";
import Feather from "react-native-vector-icons/Feather";
import EvilIcons from "react-native-vector-icons/EvilIcons";

const loginByPhone = () => {
    const handleFacebookLogin = () => {
        console.log("Initiating Facebook login");
    };
    const handleLoginPressApple = () => {
        router.push('/(auths)/(Login)/loginPhone');
    }
    const handleForgotPassword = () => {
        router.push("/(auths)/(Login)/forgotPassword/forgot-password-phone");
    };
    const handleSmsLogin = () => {
        router.push('/(auths)/(Login)/loginPhone');
    };
    const handleEmailLogin = () => {
        router.push("/(auths)/(Login)/loginEmail");
    };
      const handleRegister = () => {
    router.replace("/(auths)/(register)/registerPhone/RegisterPhone");
  };


    return (
        <>
            <Stack.Screen options={{ headerShown: false }} />
            <ImageBackground
                source={require("../../../assets/images/BackGroud.png")}
                style={styles.backgroundImage}
                resizeMode="cover"
            >
                <StatusBar translucent backgroundColor="transparent" />
                <SafeAreaView style={styles.container}>
                    <ScrollView contentContainerStyle={styles.scrollContainer}>
                        <Image
                            source={require("@/assets/images/imagLogo.png")} // Replace with your "Gbalo" logo path
                            style={styles.logo}
                            resizeMode="contain"
                        />
                        <Text style={styles.title}>Đăng nhập</Text>

                        <View style={styles.formContainer}>
                            <View style={styles.inputContainer}>
                                <Feather
                                    name="phone"
                                    size={20}
                                    color="#999999"
                                    style={styles.optionIcon}
                                />
                                <TextInput
                                    style={styles.input}
                                    placeholder="Nhập số điện thoại"
                                    placeholderTextColor="#999"
                                />
                            </View>

                            <View style={styles.inputContainer}>
                                <EvilIcons
                                    name="lock"
                                    size={30}
                                    color="#999999"
                                    style={styles.inputIcon}
                                />
                                <TextInput
                                    style={styles.input}
                                    placeholder="Mật khẩu"
                                    placeholderTextColor="#999"
                                    secureTextEntry
                                />
                            </View>

                            <TouchableOpacity style={styles.loginButton}>
                                <Text style={styles.loginButtonText}>Đăng nhập</Text>
                            </TouchableOpacity>

                            <View style={styles.authOptionsContainer}>
                                <TouchableOpacity>
                                    <Text style={styles.smsLoginText} onPress={handleSmsLogin}>Đăng nhập bằng SMS</Text>
                                </TouchableOpacity>
                                <TouchableOpacity>
                                    <Text style={styles.forgotPasswordText} onPress={handleForgotPassword}>Quên mật khẩu</Text>
                                </TouchableOpacity>
                            </View>

                            <Text style={styles.orText}>Hoặc đăng nhập bằng</Text>

                            <TouchableOpacity style={styles.socialButton} onPress={handleEmailLogin}>
                                <MaterialCommunityIcons name="email-outline" size={24} color="gray" />
                                <Text style={styles.socialButtonText}>Tiếp tục với Email</Text>
                            </TouchableOpacity>
                            <GoogleButton disabled={false} />
                            <FacebookButton onPress={handleFacebookLogin} />
                            <AppleButton onPress={handleLoginPressApple} />

                            <View style={styles.registerContainer} >
                                <Text style={styles.registerText}>Bạn chưa có tài khoản ư ? </Text>
                                <TouchableOpacity onPress={handleRegister}  >
                                    <Text style={styles.registerLink}>Đăng ký</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </ScrollView>
                </SafeAreaView>
            </ImageBackground>
        </>
    );
};

export default loginByPhone;