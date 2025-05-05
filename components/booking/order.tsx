import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Pressable,
  StyleSheet,
  Animated,
  Easing,
} from "react-native";
import { AntDesign } from "@expo/vector-icons";
import Schedule from "../booking/schedule"; 

type Props = {
  visible: boolean;
  onClose: () => void;
  title: string;
};

const OrderTour = ({ visible, onClose, title }: Props) => {
  const [selectedDate, setSelectedDate] = useState("Chọn ngày");
  const [selectedGuests, setSelectedGuests] = useState("1 khách");
  const [showScheduleModal, setShowScheduleModal] = useState(false);

  const bottomSheetY = useRef(new Animated.Value(1000)).current;

  const pricePerPerson = 1988000;
  const totalPrice = 4961400; // Bạn có thể tính động nếu muốn

  const openBottomSheet = () => {
    Animated.timing(bottomSheetY, {
      toValue: 0,
      duration: 300,
      easing: Easing.ease,
      useNativeDriver: true,
    }).start();
  };

  const closeBottomSheet = () => {
    Animated.timing(bottomSheetY, {
      toValue: 1000,
      duration: 300,
      easing: Easing.ease,
      useNativeDriver: true,
    }).start();
  };

  useEffect(() => {
    if (visible) openBottomSheet();
    else closeBottomSheet();
  }, [visible]);

  const handleSaveDate = (date: string) => {
    setSelectedDate(date);
    setShowScheduleModal(false);
  };

  return (
    <>
      <Animated.View
        style={[
          modalStyles.overlay,
          { transform: [{ translateY: bottomSheetY }] },
        ]}
      >
        <View style={modalStyles.container}>
          <View style={modalStyles.header}>
            <View style={modalStyles.titleContainer}>
              <Text style={modalStyles.title}>{title}</Text>
            </View>
            <TouchableOpacity onPress={onClose}>
              <AntDesign name="close" size={20} style={modalStyles.closeIcon} />
            </TouchableOpacity>
          </View>

          <View style={modalStyles.card}>
            <View style={modalStyles.priceBox}>
              <Text style={modalStyles.priceText}>
                Từ <Text style={modalStyles.priceHighlight}>1.988.000đ</Text>{" "}
                /người
              </Text>
            </View>

            <View style={modalStyles.formContainer}>
              <View style={modalStyles.row}>
                <View style={modalStyles.column}>
                  <Text style={modalStyles.label}>Chọn ngày</Text>
                  <TouchableOpacity
                    onPress={() => setShowScheduleModal(true)}
                    style={modalStyles.pickerContainer}
                  >
                    <Text style={{ padding: 12 }}>{selectedDate}</Text>
                  </TouchableOpacity>
                </View>

                <View style={modalStyles.column}>
                  <Text style={modalStyles.label}>Khách</Text>
                  <View style={modalStyles.pickerContainer}>
                    <TouchableOpacity
                      onPress={() =>
                        setSelectedGuests((prev) =>
                          prev === "1 khách" ? "2 khách" : "1 khách"
                        )
                      }
                    >
                      <Text style={{ padding: 12 }}>{selectedGuests}</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </View>

            <View style={modalStyles.footerRow}>
              <Text style={modalStyles.totalPrice}>
                đ {totalPrice.toLocaleString("vi-VN")}
              </Text>
              <Pressable style={modalStyles.bookButton}>
                <Text style={modalStyles.bookButtonText}>Đặt ngay</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Animated.View>

      {/* Schedule Modal */}
      <Schedule
        visible={showScheduleModal}
        onClose={() => setShowScheduleModal(false)}
        onSave={handleSaveDate}
      />
    </>
  );
};

export default OrderTour;

const modalStyles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "flex-end",
    alignItems: "center",
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
  },
  container: {
    width: "100%",
    backgroundColor: "#fff",
    paddingBottom: 16,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  titleContainer: {
    flex: 1,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
  },
  closeIcon: {
    color: "#333",
  },
  priceText: {
    fontSize: 16,
  },
  priceHighlight: {
    color: "#FF5722",
    fontWeight: "bold",
    fontSize: 18,
  },
  row: {
    flexDirection: "row",
    marginBottom: 16,
  },
  column: {
    flex: 1,
    marginHorizontal: 4,
  },
  label: {
    marginBottom: 4,
    fontSize: 14,
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 12,
    overflow: "hidden",
    backgroundColor: "#fff",
  },
  totalPrice: {
    fontSize: 20,
    fontWeight: "bold",
  },
  priceBox: {
    marginBottom: 16,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
    marginTop: 16,
  },
  formContainer: {
    backgroundColor: "#F9FAFB",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 1,
    borderRadius: 12,
    padding: 10,
    marginBottom: 14,
  },
  footerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: 8,
  },
  bookButton: {
    backgroundColor: "#FF5722",
    borderRadius: 24,
    paddingVertical: 12,
    paddingHorizontal: 24,
  },
  bookButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
});
