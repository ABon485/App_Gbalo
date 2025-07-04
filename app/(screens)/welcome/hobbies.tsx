import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
} from "react-native";
import styles from "@/styles/welcome/hobbies";
import { AntDesign } from "@expo/vector-icons";
import { Stack, useRouter } from "expo-router";
import CustomButtonRN from "@/components/common/customButtonRN/index";
import tourApi from "@/services/tour"; 
import { Preference } from "@/types/tour"; 

const Hobbies = () => {
  const router = useRouter();
  const [showMore, setShowMore] = useState(false);
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [preferences, setPreferences] = useState<Preference[]>([]);

  useEffect(() => {
    const fetchPreferences = async () => {
      try {
        const data = await tourApi.getPreferences(); 
        setPreferences(data);
      } catch (error) {
        console.error("Lỗi khi lấy danh sách preference:", error);
      }
    };
    fetchPreferences();
  }, []);

  const visibleData = showMore ? preferences : preferences.slice(0, 7);

  const handleSelectItem = (name: string) => {
    if (selectedItems.includes(name)) {
      setSelectedItems(selectedItems.filter((item) => item !== name));
    } else {
      setSelectedItems([...selectedItems, name]);
    }
  };

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <SafeAreaView style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.replace("/welcome/date")}>
            <AntDesign name="arrowleft" size={24} color="black" />
          </TouchableOpacity>
          <View style={styles.progressWrapper}>
            <View style={styles.progressFill} />
            <View style={{ flex: 1 }} />
          </View>
        </View>

        {/* Title */}
        <Text style={styles.title}>Sở thích du lịch của bạn là gì?</Text>

        {/* List */}
        <View style={styles.listContainer}>
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 16 }}
          >
            {visibleData.map((item) => {
              const isSelected = selectedItems.includes(item.name);
              return (
                <TouchableOpacity
                  key={item.id}
                  style={[
                    styles.hobbyItem,
                    isSelected && { backgroundColor: "#d3d3d3" },
                  ]}
                  onPress={() => handleSelectItem(item.name)}
                >
                  <Text style={styles.hobbyText}>{item.name}</Text>
                </TouchableOpacity>
              );
            })}

            {/* Toggle Button */}
            {preferences.length > 7 && (
              <TouchableOpacity
                style={styles.toggleBtn}
                onPress={() => setShowMore(!showMore)}
              >
                <Text style={styles.toggleText}>
                  {showMore ? "Ẩn bớt" : "Xem thêm"}
                </Text>
              </TouchableOpacity>
            )}
          </ScrollView>
        </View>

        {/* Finish Button */}
        <View style={styles.buttonWrapper}>
          <CustomButtonRN
            title="Hoàn thành"
            onPress={() => router.replace("/(tabs)/assistant")}
          />
        </View>
      </SafeAreaView>
    </>
  );
};

export default Hobbies;
