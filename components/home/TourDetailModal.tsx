import React from "react";
import { Modal, View, Text, TouchableOpacity, ScrollView } from "react-native";
import { styles } from "@/styles/detail/ModalDetail";
import { AntDesign } from "@expo/vector-icons";
import RenderHtml from "react-native-render-html";
import { useWindowDimensions } from "react-native";

type Props = {
  visible: boolean;
  onClose: () => void;
  content: string;
  title: string;
};

const TourDetailModal = ({ visible, onClose, content, title }: Props) => {
  const { width } = useWindowDimensions();

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
              <Text style={styles.modalTitle}>{title}</Text>
            </View>
            <TouchableOpacity onPress={onClose}>
              <AntDesign name="close" size={20} style={styles.modalCloseIcon} />
            </TouchableOpacity>
          </View>

          <ScrollView>
            <RenderHtml contentWidth={width} source={{ html: content }} />
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

export default TourDetailModal;
