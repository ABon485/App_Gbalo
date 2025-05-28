// Order.js
import React, { useState } from "react";
import { Modal, View, Text, TouchableOpacity, ScrollView, Alert } from "react-native";
import { AntDesign } from "@expo/vector-icons";
import Schedule from "../booking/schedule";
import ClientOption from "../booking/clientOption";
import styles from "@/styles/booking/order";
import { useRouter } from "expo-router";

type Props = {
  visible: boolean;
  onClose: () => void;
  title: string;
  fromPrice: number;
  tourId: number;
  user: any;
  imageUrl: string | null;
  tourName: string;
  tourSubName: string;
  tourPrices: Array<{
    id: number;
    guestTypeId: number;
    guestType: string;
    age: string;
    price: number;
    unitId: number;
    unitName: string | null;
  }>;
  onConfirm: () => void;
};

const OrderTourModal = ({
  visible,
  onClose,
  title,
  fromPrice,
  tourId,
  user,
  imageUrl,
  tourName,
  tourSubName,
  tourPrices, 
  onConfirm,
}: Props) => {
  const [selectedDate, setSelectedDate] = useState("Chọn ngày");
  const [selectedGuests, setSelectedGuests] = useState("0 khách");
  const [totalPrice, setTotalPrice] = useState(fromPrice);
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [showClientModal, setShowClientModal] = useState(false);
  const router = useRouter();

  const handleSaveDate = (date: string) => {
    setSelectedDate(date);
    setShowScheduleModal(false);
  };

  const handleSaveClient = (client: string, price: number) => {
    setSelectedGuests(client);
    setTotalPrice(price);
    setShowClientModal(false);
  };

  // Trong Order.js
const handleConfirm = () => {
  if (!user) {
    router.push("/(auths)/(Login)/login");
    onClose();
    return;
  }

  // Kiểm tra validate
  if (!selectedDate || selectedDate === "Chọn ngày") {
    Alert.alert("Lỗi", "Vui lòng chọn ngày khởi hành trước khi tiếp tục.");
    return;
  }
  if (!selectedGuests || selectedGuests === "1 khách") {
    Alert.alert("Lỗi", "Vui lòng chọn số lượng khách trước khi tiếp tục.");
    return;
  }

  onConfirm();
  router.push({
    pathname: "/booking/confirmBooking",
    params: {
      tourId: tourId.toString(),
      selectedDate,
      selectedGuests,
      totalPrice: totalPrice.toString(),
      user: JSON.stringify(user),
      imageUrl: imageUrl || "",
      tourName,
      tourSubName,
    },
  });
};

  return (
    <>
      <Modal
        animationType="slide"
        transparent
        visible={visible}
        onRequestClose={onClose}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>{title}</Text>
              <TouchableOpacity onPress={onClose}>
                <AntDesign
                  name="close"
                  size={20}
                  style={styles.modalCloseIcon}
                />
              </TouchableOpacity>
            </View>
            <ScrollView contentContainerStyle={styles.scrollViewContent}>
              <View style={styles.priceBox}>
                <Text style={styles.priceText}>
                  Tổng giá:{" "}
                  <Text style={styles.priceHighlight}>
                    {totalPrice.toLocaleString("vi-VN")}đ
                  </Text>
                </Text>
              </View>

              <View style={styles.formContainer}>
                <View style={styles.row}>
                  <View style={styles.column}>
                    <Text style={styles.label}>Chọn ngày khởi hành</Text>
                    <TouchableOpacity
                      onPress={() => setShowScheduleModal(true)}
                      style={styles.pickerContainer}
                    >
                      <Text style={{ padding: 12 }}>{selectedDate}</Text>
                    </TouchableOpacity>
                  </View>

                  <View style={styles.column}>
                    <Text style={styles.label}>Khách</Text>
                    <TouchableOpacity
                      onPress={() => setShowClientModal(true)}
                      style={styles.pickerContainer}
                    >
                      <Text
                        style={{ padding: 12 }}
                        numberOfLines={1}
                        ellipsizeMode="tail"
                      >
                        {selectedGuests}
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>

              <View style={styles.footerRow}>
                <Text style={styles.totalPrice}>
                  đ {totalPrice.toLocaleString("vi-VN")}
                </Text>
                <TouchableOpacity
                  style={styles.bookButton}
                  onPress={handleConfirm}
                >
                  <Text style={styles.bookButtonText}>Đặt ngay</Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>

      <Schedule
        visible={showScheduleModal}
        onClose={() => setShowScheduleModal(false)}
        onSave={handleSaveDate}
      />
      <ClientOption
        visible={showClientModal}
        onClose={() => setShowClientModal(false)}
        onSave={handleSaveClient}
        tourPrices={tourPrices}
      />
    </>
  );
};

export default OrderTourModal;
