import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import tourApi from "@/services/tour";
import { LanguageItem } from "@/types/tour";
import { useTranslation } from "react-i18next";
import { useLanguage } from "@/context/LanguageContext";
import { useToast } from "@/context/ToastContext";

export default function LanguageScreen() {
  const { t } = useTranslation();
  const { showToast } = useToast();
  const { language, changeLanguage } = useLanguage();
  const [languages, setLanguages] = useState<LanguageItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const mapLanguageIdToCode = (id: number): string => {
    switch (id) {
      case 1:
        return "vi";
      case 2:
        return "en";
      case 3:
        return "th";
      default:
        return "vi";
    }
  };

  const handleSelectLanguage = async (id: string) => {
    const code = mapLanguageIdToCode(parseInt(id));
    if (code === language) return;

    try {
      await changeLanguage(code);
    } catch (error) {
      console.error("Failed to update language:", error);
      showToast({
        type: "error",
        heading: t("error"),
        message: t("error_updating_language"),
      });
    }
  };

  useEffect(() => {
    let isMounted = true;

    const fetchLanguages = async () => {
      try {
        setIsLoading(true);
        const response = await tourApi.getLanguage();
        if (isMounted) {
          setLanguages(response.data);
          setError(null);
        }
      } catch (error) {
        console.error("Failed to fetch languages:", error);
        if (isMounted) {
          setLanguages([
            { id: 1, name: "Vietnam" },
            { id: 2, name: "English" },
            { id: 3, name: "Thai" },
          ]);
          setError(null);
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    fetchLanguages();

    return () => {
      isMounted = false;
    };
  }, []);

  const getFlag = (name: string) => {
    if (name.toLowerCase().includes("vietnam")) return "🇻🇳";
    if (name.toLowerCase().includes("english")) return "🇬🇧";
    if (name.toLowerCase().includes("thai") || name.includes("ไทย"))
      return "🇹🇭";
    return "";
  };

  return (
    <View style={styles.container}>
      {isLoading ? (
        <Text style={styles.loadingText}>{t("loading")}</Text>
      ) : error ? (
        <Text style={styles.errorText}>{error}</Text>
      ) : (
        <>
          <View style={styles.header}>
            <TouchableOpacity onPress={() => router.back()}>
              <Ionicons name="arrow-back" size={24} color="#000" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>{t("language")}</Text>
            <View style={{ width: 24 }} />
          </View>
          {languages.map((lang) => (
            <TouchableOpacity
              key={lang.id}
              style={styles.languageItem}
              onPress={() => handleSelectLanguage(lang.id.toString())}
            >
              <Text style={styles.languageText}>
                {getFlag(lang.name)} {lang.name}
              </Text>
              {language === mapLanguageIdToCode(lang.id) && (
                <Ionicons name="checkmark" size={20} color="#ff6600" />
              )}
            </TouchableOpacity>
          ))}
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingTop: 40,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  headerTitle: {
    flex: 1,
    left: 15,
    fontSize: 18,
    fontWeight: "bold",
    color: "#000",
  },
  languageItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 15,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  languageText: {
    fontSize: 16,
    color: "#000",
  },
  loadingText: {
    fontSize: 16,
    color: "#000",
    textAlign: "center",
    marginVertical: 20,
  },
  errorText: {
    fontSize: 16,
    color: "red",
    textAlign: "center",
    marginVertical: 20,
  },
  testText: {
    fontSize: 16,
    color: "#000",
    textAlign: "center",
    marginVertical: 20,
  },
});
