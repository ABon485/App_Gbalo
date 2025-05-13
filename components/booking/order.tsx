import React, { useState } from "react";
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Pressable,
} from "react-native";
import { AntDesign } from "@expo/vector-icons";
import Schedule from "../booking/schedule";
import ClientOption from "../booking/clientOption";
import ConfirmBooking from "@/app/(screens)/booking/confirmBooking";
import styles from "@/styles/booking/order";

type Props = {
  visible: boolean;
  onClose: () => void;
  title: string;
  fromPrice: number;
  onConfirm: () => void;
};

const OrderTourModal = ({ visible, onClose, title, fromPrice, onConfirm }: Props) => {
  const [selectedDate, setSelectedDate] = useState("Chọn ngày");
  const [selectedGuests, setSelectedGuests] = useState("1 khách");
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [showClientModal, setShowClientModal] = useState(false);
  const [showOrderModal, setShowOrderModal] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const handleSaveDate = (date: string) => {
    setSelectedDate(date);
    setShowScheduleModal(false);
  };

  const handleSaveClient = (client: string) => {
    setSelectedGuests(client);
    setShowClientModal(false);
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
                  Từ{" "}
                  <Text style={styles.priceHighlight}>
                    {fromPrice.toLocaleString("vi-VN")}đ
                  </Text>{" "}
                  /người
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
                  đ {fromPrice.toLocaleString("vi-VN")}
                </Text>
                <TouchableOpacity
                  style={styles.bookButton}
                  onPress={() => {
                    onConfirm(); 
                  }}
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
      />
    </>
  );
};

export default OrderTourModal;

