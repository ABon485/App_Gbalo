import React, { useState } from "react";
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
import Feather from "react-native-vector-icons/Feather";
import EvilIcons from "react-native-vector-icons/EvilIcons";
import GoogleButton from "@/components/common/customButtonSocial/GoogleButton";
import FacebookButton from "@/components/common/customButtonSocial/FacebookButton";
import AppleButton from "@/components/common/customButtonSocial/AppleButton";
import { router, Stack } from "expo-router";
import  authApi  from "@/services/auth";
import { LoginByPhone as LoginByPhoneType } from "@/types/user";
import { useToast } from "@/context/ToastContext";

const LoginByPhone = () => {
    const [formData, setFormData] = useState<LoginByPhoneType>({
        phone: "",
        password: "",
        rememberMe: false,
    });
    const [isLoading, setIsLoading] = useState(false);
    const { showToast } = useToast();

    const handleFacebookLogin = () => {
        console.log("Initiating Facebook login");
    };

    const handleLoginPressApple = () => {
        router.push('/(auths)/(Login)/loginPhone');
    };

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

    const handleLogin = async () => {
        try {
            setIsLoading(true);

            // Validate inputs
            if (!formData.phone || !formData.password) {
                showToast({ type: "error", message: "Vui lòng nhập số điện thoại và mật khẩu." });
                return;
            }

            // Normalize phone number (remove non-digits and leading zeros)
            const normalizedPhone = formData.phone.replace(/\D/g, "").replace(/^0+/, "");
            const phoneRegex = /^[0-9]{7,15}$/;
            if (!phoneRegex.test(normalizedPhone)) {
                showToast({ type: "error", message: "Số điện thoại không hợp lệ." });
                return;
            }

            // Make API call
            const response = await authApi.loginPhone({
                ...formData,
                phone: normalizedPhone,
            });

            if (response.data.status === "Success") {
                // Handle successful login
                showToast({ type: "success", message: "Đăng nhập thành công!" });
                // Optionally store token
                // await AsyncStorage.setItem("loginToken", response.data.data.token);
                // Navigate to home screen
                 router.replace("/(tabs)/assistant");
            }
        } catch (err: any) {
            const errorMessage =
                err.response?.data?.errors?.[Object.keys(err.response?.data?.errors || {})[0]]?.[0] ||
                err.response?.data?.message ||
                "Đăng nhập thất bại. Vui lòng thử lại.";
            showToast({ type: "error", message: errorMessage });
        } finally {
            setIsLoading(false);
        }
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
                            source={require("@/assets/images/imagLogo.png")}
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
                                    value={formData.phone}
                                    onChangeText={(text) => setFormData({ ...formData, phone: text })}
                                    keyboardType="phone-pad"
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
                                    value={formData.password}
                                    onChangeText={(text) => setFormData({ ...formData, password: text })}
                                />
                            </View>

                            <TouchableOpacity
                                style={[styles.loginButton, isLoading && { opacity: 0.6 }]}
                                onPress={handleLogin}
                                disabled={isLoading}
                            >
                                <Text style={styles.loginButtonText}>
                                    {isLoading ? "Đang đăng nhập..." : "Đăng nhập"}
                                </Text>
                            </TouchableOpacity>

                            <View style={styles.authOptionsContainer}>
                                <TouchableOpacity>
                                    <Text style={styles.smsLoginText} onPress={handleSmsLogin}>
                                        Đăng nhập bằng SMS
                                    </Text>
                                </TouchableOpacity>
                                <TouchableOpacity>
                                    <Text style={styles.forgotPasswordText} onPress={handleForgotPassword}>
                                        Quên mật khẩu
                                    </Text>
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

                            <View style={styles.registerContainer}>
                                <Text style={styles.registerText}>Bạn chưa có tài khoản ư ? </Text>
                                <TouchableOpacity onPress={handleRegister}>
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

export default LoginByPhone;