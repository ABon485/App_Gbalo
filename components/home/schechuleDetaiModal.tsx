import React from "react";
import { Modal, View, Text, TouchableOpacity, ScrollView } from "react-native";
import { styles } from "@/styles/detail/schechuleModal";
import { AntDesign, Ionicons } from "@expo/vector-icons";

type Props = {
  visible: boolean;
  onClose: () => void;
};

const TourDetailModal = ({ visible, onClose }: Props) => {
  return (
    <Modal
      animationType="slide"
      transparent
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <View style={styles.modalTitleContainer}>
              <Text style={styles.modalTitle}>Lịch trình chi tiết</Text>
            </View>
            <TouchableOpacity onPress={onClose}>
              <AntDesign name="close" size={20} style={styles.modalCloseIcon} />
            </TouchableOpacity>
          </View>

          <ScrollView contentContainerStyle={{ paddingBottom: 20 }}>
            <Text style={styles.modalSubTitle}>
              Khởi hành {">"} Đón tại khách sạn
            </Text>

            {/* 07:30 */}
            <View style={styles.scheduleItem}>
              <Ionicons
                name="time-outline"
                size={16}
                style={styles.scheduleIcon}
              />
              <Text style={styles.scheduleTime}>07:30</Text>
              <Text style={styles.scheduleText}>
                Quý khách tự túc ăn sáng. Sau đó xe và HDV của Tour du lịch Bà
                Nà sẽ đón quý khách tại khách sạn hoặc các điểm đã hẹn trước
                hàng ngày.
              </Text>
            </View>

            {/* 08:30 */}
            <View style={styles.scheduleItem}>
              <Ionicons
                name="time-outline"
                size={16}
                style={styles.scheduleIcon}
              />
              <Text style={styles.scheduleTime}>08:30</Text>
              <Text style={styles.scheduleText}>
                Đoàn đến cổng khu du lịch Bà Nà Hills, HDV làm thủ tục đưa du
                khách lên cáp treo nhanh nhất không phải xếp hàng.
              </Text>
            </View>

            {/* 10:30 */}
            <View style={styles.scheduleItem}>
              <Ionicons
                name="time-outline"
                size={16}
                style={styles.scheduleIcon}
              />
              <Text style={styles.scheduleTime}>10:30</Text>
              <Text style={styles.scheduleText}>
                Ngồi trên Cáp Treo với khoảng thời gian từ 15 – 20 phút, quý
                khách được thưởng thức khung cảnh núi rừng cực đẹp từ trên cao.
              </Text>
            </View>

            {/* 11:30 */}
            <View style={styles.scheduleItem}>
              <Ionicons
                name="time-outline"
                size={16}
                style={styles.scheduleIcon}
              />
              <Text style={styles.scheduleTime}>11:30</Text>
              <Text style={styles.scheduleText}>
                Tiếp tục di chuyển đến vườn hoa D’Amour được chia thành 9 khu
                vườn mang 9 chủ đề khác nhau.
              </Text>
            </View>

            {/* 13:00 */}
            <View style={styles.scheduleItem}>
              <Ionicons
                name="time-outline"
                size={16}
                style={styles.scheduleIcon}
              />
              <Text style={styles.scheduleTime}>13:00</Text>
              <Text style={styles.scheduleText}>
                Đoàn di chuyển bằng tàu hỏa leo Núi số 2 lên tham quan Lầu Đài
                Mặt Trăng, Quảng Trường Nhật Thực.
              </Text>
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

export default TourDetailModal;
