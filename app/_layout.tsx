import { useEffect, useState } from "react";
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import * as Font from "expo-font";
import { View, ActivityIndicator } from "react-native";
import { useColorScheme } from "@/hooks/useColorScheme";
import Toast from "react-native-toast-message";
import { toastConfig } from "@/components/Toast";
import { ToastProvider } from "@/context/ToastContext";

function RootLayoutNav() {
  const colorScheme = useColorScheme();
  const [fontsLoaded, setFontsLoaded] = useState(false);

  useEffect(() => {
    (async () => {
      await Font.loadAsync({
        "Inter-Black": require("../assets/fonts/Inter_18pt-Black.ttf"),
        "Inter-Medium": require("../assets/fonts/Inter_18pt-Medium.ttf"),
        "Inter-Bold": require("../assets/fonts/Inter_18pt-Bold.ttf"),
        "Inter-BlackItalic": require("../assets/fonts/Inter_18pt-BlackItalic.ttf"),
        "Inter-BoldItalic": require("../assets/fonts/Inter_18pt-BoldItalic.ttf"),
        "Inter-ExtraBold": require("../assets/fonts/Inter_18pt-ExtraBold.ttf"),
        "Mulish-Black": require("../assets/fonts/Mulish-Black.ttf"),
        "Mulish-BlackItalic": require("../assets/fonts/Mulish-BlackItalic.ttf"),
        "Mulish-Bold": require("../assets/fonts/Mulish-Bold.ttf"),
        "Mulish-BoldItalic": require("../assets/fonts/Mulish-BoldItalic.ttf"),
        "Mulish-ExtraBold": require("../assets/fonts/Mulish-ExtraBold.ttf"),
        "Mulish-ExtraBoldItalic": require("../assets/fonts/Mulish-ExtraBoldItalic.ttf"),
        "Mulish-ExtraLight": require("../assets/fonts/Mulish-ExtraLight.ttf"),
        "Mulish-ExtraLightItalic": require("../assets/fonts/Mulish-ExtraLightItalic.ttf"),
        "Mulish-Italic": require("../assets/fonts/Mulish-Italic.ttf"),
        "Mulish-Light": require("../assets/fonts/Mulish-Light.ttf"),
        "Mulish-LightItalic": require("../assets/fonts/Mulish-LightItalic.ttf"),
        "Mulish-Medium": require("../assets/fonts/Mulish-Medium.ttf"),
        "Mulish-MediumItalic": require("../assets/fonts/Mulish-MediumItalic.ttf"),
        "Mulish-Regular": require("../assets/fonts/Mulish-Regular.ttf"),
        "Mulish-SemiBold": require("../assets/fonts/Mulish-SemiBold.ttf"),
        "Mulish-SemiBoldItalic": require("../assets/fonts/Mulish-SemiBoldItalic.ttf"),
      });
      setFontsLoaded(true);
    })();
  }, []);

  if (!fontsLoaded) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <ToastProvider>
      {" "}
      {/* ✅ Bọc toàn bộ app bằng ToastProvider */}
      <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
        <Stack>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="+not-found" />
          <Stack.Screen name="slash" options={{ headerShown: false }} />
          <Stack.Screen name="onboarding" options={{ headerShown: false }} />
          <Stack.Screen name="auth/login" options={{ headerShown: false }} />
          <Stack.Screen name="auth/register" options={{ headerShown: false }} />
          <Stack.Screen name="auth/registerEmail" options={{ headerShown: false }} />
          <Stack.Screen name="(auths)/(register)/registerPhone/confirmPhone" options={{ headerShown: false }} />
          <Stack.Screen name="(auths)/(register)/registerEmail/confirmEmail" options={{ headerShown: false }} />
          <Stack.Screen name="(auths)/(register)/registerPhone/RegisterPhone" options={{ headerShown: false }} />
          <Stack.Screen name="(auths)/(register)/registerEmail/RegisterEmail" options={{ headerShown: false }} />
          <Stack.Screen name="(auths)/(register)/registerPhone/veryfyPhone" options={{ headerShown: false }} />
          <Stack.Screen name="(auths)/(register)/registerEmail/veryfyEmail" options={{ headerShown: false }} />
          <Stack.Screen name="(screens)/detail/[detailID]" options={{ headerShown: false }} />
          <Stack.Screen name="(screens)/profile/profile" options={{ headerShown: false }} />
          <Stack.Screen name="(screens)/booking/confirmBooking" options={{ headerShown: false }} />
          <Stack.Screen name="(screens)/booking/successBooking" options={{ headerShown: false }} />
          <Stack.Screen name="(screens)/blog/infor_blog" options={{ headerShown: false }} />
          <Stack.Screen name="(screens)/notification/notification" options={{ headerShown: false }} />
          <Stack.Screen name="(screens)/notification/detailNotification" options={{ headerShown: false }} />



        </Stack>
        <StatusBar style="auto" />
        {/* <Toast config={toastConfig} /> vẫn giữ để hiển thị Toast */}
      </ThemeProvider>
    </ToastProvider>
  );
}

export default RootLayoutNav;
