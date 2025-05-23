import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  ActivityIndicator,
  useWindowDimensions,
  ScrollView,
} from "react-native";
import HTML from "react-native-render-html";
import { useToast } from "@/context/ToastContext";
import { useRouter } from "expo-router";
import BlogApi from "@/services/blog";
import { TermsResponse } from "@/types/blog";
import AntDesign from "@expo/vector-icons/AntDesign";

export default function InforBlog() {
  const { showToast } = useToast();
  const router = useRouter();
  const { width } = useWindowDimensions();
  const [loading, setLoading] = useState(false);
  const [content, setContent] = useState("");
  const [activeTab, setActiveTab] = useState<"terms" | "privacy">("terms");

  const formatTermsResponse = (
    data: TermsResponse["data"],
    type: "terms" | "privacy"
  ): string => {
    if (!data) return "";
    const html = type === "terms" ? data.TermsConditions : data.PrivacyPolicy;
    return html?.trim() || "";
  };

  const getTermsContent = async (type: "terms" | "privacy") => {
    try {
      setLoading(true);
      setActiveTab(type);
      const policyKey = type === "terms" ? "TermsConditions" : "PrivacyPolicy";
      const response = await BlogApi.postTermsConditions([policyKey]);

      console.log("API Response:", JSON.stringify(response.data, null, 2));

      const resData = response.data as TermsResponse;
      const contentHtml = formatTermsResponse(resData.data, type);

      if (resData?.status === "Success" && contentHtml) {
        setContent(contentHtml);
      } else {
        throw new Error("Không có nội dung điều khoản");
      }
    } catch (error) {
      console.error("API Error:", error);
      showToast({
        type: "error",
        message: "Không thể tải điều khoản, vui lòng thử lại sau",
      });
      setContent("");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getTermsContent("terms");
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <AntDesign name="arrowleft" size={20} color="black" />
        </TouchableOpacity>
        <Text style={styles.title}>Gbalo</Text>
      </View>

      {/* Tabs */}
      <View style={styles.tab}>
        <TouchableOpacity
          onPress={() => getTermsContent("terms")}
          style={styles.tabButton}
        >
          <Text
            style={[styles.tabItem, activeTab === "terms" && styles.activeTab]}
          >
            Điều khoản sử dụng
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => getTermsContent("privacy")}
          style={styles.tabButton}
        >
          <Text
            style={[
              styles.tabItem,
              activeTab === "privacy" && styles.activeTab,
            ]}
          >
            Chính sách bảo mật
          </Text>
        </TouchableOpacity>
      </View>

      {/* Nội dung */}
      {loading ? (
        <View style={styles.imageContainer}>
          <ActivityIndicator size="large" color="#000" />
          <Text style={styles.caption}>Đang tải...</Text>
        </View>
      ) : content ? (
        <ScrollView style={styles.contentContainer}>
          <HTML
            source={{ html: content }}
            contentWidth={width}
            tagsStyles={{
              p: {
                marginBottom: 12,
                fontSize: 14,
                lineHeight: 22,
                color: "#333",
              },
              h1: { fontSize: 20, fontWeight: "bold", marginBottom: 16 },
              ul: { paddingLeft: 20, marginBottom: 10 },
              li: { marginBottom: 6 },
              a: { color: "#007AFF", textDecorationLine: "underline" },
            }}
            systemFonts={["System"]}
          />
        </ScrollView>
      ) : (
        <View style={styles.imageContainer}>
          <Image
            source={require("@/assets/images/home/download.png")}
            style={styles.image}
            resizeMode="contain"
          />
          <Text style={styles.caption}>
            Điều khoản sử dụng đang được cập nhật
          </Text>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingHorizontal: 16,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 50,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginLeft: 16,
  },
  tab: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
    marginTop: 16,
  },
  tabButton: {
    paddingBottom: 10,
    marginHorizontal: 20,
  },
  tabItem: {
    fontSize: 14,
    color: "#999",
  },
  activeTab: {
    color: "black",
    fontWeight: "bold",
    borderBottomColor: "#000",
  },
  imageContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  contentContainer: {
    flex: 1,
    marginTop: 16,
  },
  image: {
    width: 300,
    height: 300,
  },
  caption: {
    textAlign: "center",
    fontSize: 14,
    marginBottom: 40,
    marginTop: 20,
  },
});
