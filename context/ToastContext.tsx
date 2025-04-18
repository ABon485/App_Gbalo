import React, { createContext, useContext, useCallback } from 'react';
import Toast from 'react-native-toast-message';

type ToastType = 'success' | 'error' | 'info' | 'warning';
type ToastData = {
  heading?: string;
  message?: string;
  type?: ToastType;
  duration?: number;
};

const ToastContext = createContext<{
  showToast: (data: ToastData) => void;
} | undefined>(undefined);

export const ToastProvider = ({ children }: { children: React.ReactNode }) => {
  const showToast = useCallback(({ heading, message, type, duration }: ToastData) => {
    Toast.show({
      type: type === 'warning' ? 'info' : type,
      text1: heading || type?.toUpperCase(),
      text2: message,
      visibilityTime: duration || 3000,
      position: 'top',
    });
  }, []);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <Toast />
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};