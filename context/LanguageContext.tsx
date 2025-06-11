import React, { createContext, useContext, useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import i18n from "@/config/i18n";

interface LanguageContextType {
  language: string;
  changeLanguage: (lang: string) => Promise<void>;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [language, setLanguage] = useState("vi");

  useEffect(() => {
    const loadLanguage = async () => {
      const savedLanguage = await AsyncStorage.getItem("selectedLanguage");
      if (savedLanguage) {
        setLanguage(savedLanguage);
        await i18n.changeLanguage(savedLanguage);
      }
    };
    loadLanguage();
  }, []);

  const changeLanguage = async (lang: string) => {
    try {
      await i18n.changeLanguage(lang);
      await AsyncStorage.setItem("selectedLanguage", lang);
      setLanguage(lang);
    } catch (error) {
      console.error("Failed to change language:", error);
    }
  };

  return (
    <LanguageContext.Provider value={{ language, changeLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
};