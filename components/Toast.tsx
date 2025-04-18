// components/Toast.tsx
import React, { useEffect } from 'react';
import Toast, { ToastConfig, ToastConfigParams } from 'react-native-toast-message';
import { View, Text } from "react-native";

type ToastType = {
  heading?: string;
  message?: string;
  type?: 'error' | 'success' | 'info' | 'warning';
  duration?: number;
};

type ToastData = {
  toast: ToastType | undefined;
};

const ToastComponent = ({ toast: toastData }: ToastData) => {
  useEffect(() => {
    if (toastData) {
      const { heading, message, type, duration } = toastData;

      Toast.show({
        type: type === 'warning' ? 'info' : type,
        text1: heading || type?.toUpperCase(),
        text2: message,
        visibilityTime: duration || 3000,
        position: 'top',
      });
    }
  }, [toastData]);

  return <Toast />;
};

// ✅ Fix: proper typing and safe access for optional values
const toastConfig: ToastConfig = {
  success: ({ text1, text2 }: ToastConfigParams<any>) => (
    <View style={{
      backgroundColor: '#4ade80',
      padding: 16,
      borderRadius: 8,
      margin: 16,
      width: '90%',
    }}>
      <Text style={{ color: '#fff', fontWeight: 'bold' }}>{text1 ?? ""}</Text>
      <Text style={{ color: '#fff' }}>{text2 ?? ""}</Text>
    </View>
  ),
  error: ({ text1, text2 }: ToastConfigParams<any>) => (
    <View style={{
      backgroundColor: '#f87171',
      padding: 16,
      borderRadius: 8,
      margin: 16,
      width: '90%',
    }}>
      <Text style={{ color: '#fff', fontWeight: 'bold' }}>{text1 ?? ""}</Text>
      <Text style={{ color: '#fff' }}>{text2 ?? ""}</Text>
    </View>
  ),
  info: ({ text1, text2 }: ToastConfigParams<any>) => (
    <View style={{
      backgroundColor: '#60a5fa',
      padding: 16,
      borderRadius: 8,
      margin: 16,
      width: '90%',
    }}>
      <Text style={{ color: '#fff', fontWeight: 'bold' }}>{text1 ?? ""}</Text>
      <Text style={{ color: '#fff' }}>{text2 ?? ""}</Text>
    </View>
  ),
};


export default ToastComponent;
export { toastConfig };
