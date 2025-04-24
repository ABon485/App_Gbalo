import React from "react";
import { Modal, View, Text, TouchableOpacity, ScrollView } from "react-native";
import { styles } from "@/styles/detail/extraUserModal";
import { AntDesign, Ionicons, FontAwesome6, FontAwesome5,MaterialIcons } from "@expo/vector-icons";

type Props = {
  visible: boolean;
  onClose: () => void;
};

const ExtraUserModal = ({ visible, onClose }: Props) => {
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
              <Text style={styles.modalTitle}>
                Những yêu cầu đối với khách hàng
              </Text>
            </View>
            <TouchableOpacity onPress={onClose}>
              <AntDesign name="close" size={20} style={styles.modalCloseIcon} />
            </TouchableOpacity>
          </View>

          <ScrollView contentContainerStyle={{ paddingBottom: 20 }}>
            {/* Requirement 1 */}
            <View style={styles.scheduleItem}>
              <FontAwesome6
                name="wine-glass"
                size={20}
                style={styles.scheduleIcon}
              />
              <Text style={styles.scheduleText}>
                Khách phải đủ tuổi uống rượu bia mới được phục vụ đồ uống có
                cồn.
              </Text>
            </View>
            <View style={styles.scheduleItem}>
              <FontAwesome5
                name="user"
                size={16}
                style={styles.scheduleIcon}
              />
              <Text style={styles.scheduleText}>
                Khách từ 4 tuổi trở lên có thể tham gia, đoàn tối đa 10 khách.
                Cha mẹ có thể mang theo trẻ dưới 2 tuổi.
              </Text>
            </View>

            <View style={styles.scheduleItem}>
              <FontAwesome6
                name="head-side-mask"
                size={16}
                style={styles.scheduleIcon}
              />
              <Text style={styles.scheduleText}>
                Có áp dụng hướng dẫn về sức khỏe và an toàn của Sun World
              </Text>
            </View>

            {/* Requirement 2 */}
            <View style={styles.scheduleItem}>
              <MaterialIcons
                name="shopping-bag"
                size={16}
                style={styles.scheduleIcon}
              />
              <Text style={styles.scheduleText}>
                Mang theo trang phục phù hợp, mũ nón, áo khoác, kem chống nắng
                cùng các loại thuốc cần thiết như đau bụng, đau đầu, say xe, dị
                ứng,...
              </Text>
            </View>

            {/* Requirement 3 */}
            <View style={styles.scheduleItem}>
              <MaterialIcons
                name="no-food"
                size={16}
                style={styles.scheduleIcon}
              />
              <Text style={styles.scheduleText}>
                Du Khách nên thực hiện đúng quy định không mang đồ ăn, thức uống
                lên Bà Nà Hills.
              </Text>
            </View>

            <View style={styles.scheduleItem}>
              <Ionicons
                name="trash-bin-outline"
                size={16}
                style={styles.scheduleIcon}
              />
              <Text style={styles.scheduleText}>
                Không xả rác bừa bãi để bảo vệ môi trường cùng khung cảnh thiên
                nhiên tuyệt đẹp tại Bà Nà Hills.
              </Text>
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

export default ExtraUserModal;
