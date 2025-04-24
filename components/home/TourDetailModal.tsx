import React from "react";
import { Modal, View, Text, TouchableOpacity, ScrollView } from "react-native";
import { styles } from "@/styles/detail/ModalDetail";
import { Ionicons, AntDesign } from "@expo/vector-icons";
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
              <Text style={styles.modalTitle}>Giới thiệu về tour</Text>
            </View>
            <TouchableOpacity onPress={onClose}>
              <AntDesign name="close" size={20} style={styles.modalCloseIcon} />
            </TouchableOpacity>
          </View>

          <ScrollView>
            <Text style={styles.modalText}>
              Tại Sun World Ba Na Hills, du khách dễ dàng tìm thấy hệ thống nhà
              hàng tại 3 khu vực chính:
            </Text>
            <Text style={styles.modalBullet}>
              • Khám phá thế giới dưới lòng đất của mạng lưới địa đạo phức tạp
              của Việt Nam khi bạn đặt tour này trên Gbalô
            </Text>
            <Text style={styles.modalBullet}>
              • Tìm hiểu về cuộc sống phức tạp và vô cùng sáng tạo của những
              người lính sống dưới lòng đất
            </Text>
            <Text style={styles.modalBullet}>
              • Du lịch vòng quanh Địa Đạo Củ Chi và Hồ Chí Minh trên chiếc xe
              limousine sang trọng, hiện đại
            </Text>
            <Text style={styles.modalBullet}>
              • Chiêm ngưỡng vẻ đẹp của sông Cửu Long khi bạn đi thuyền dọc sông
              với hướng dẫn viên thân thiện
            </Text>
            <Text style={styles.modalBullet}>
              • Thưởng thức đồ ăn tuyệt vời của người dân địa phương khi bạn ghé
              qua một trang trại, một ngôi làng nhỏ ở bên ngoài thành phố
            </Text>
            <Text style={styles.modalFooter}>
              Với hệ thống hơn 30 nhà hàng, Sun World Ba Na Hills phục vụ ẩm
              thực Á-Âu đa dạng. Du khách có thể lựa chọn nhiều hình thức ẩm
              thực, buffet hoặc chọn món.
            </Text>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

export default TourDetailModal;
