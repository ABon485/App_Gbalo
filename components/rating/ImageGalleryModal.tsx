import React, { useState } from "react";
import ImageViewing from "react-native-image-viewing";
import { Image, Text, View, StyleSheet, Pressable } from "react-native";
import AntDesign from "@expo/vector-icons/AntDesign";

type ImageGalleryModalProps = {
  visible: boolean;
  images: (string | number)[];
  index: number;
  onClose: () => void;
};

export default function ImageGalleryModal({
  visible,
  images,
  index,
  onClose,
}: ImageGalleryModalProps) {
  const [currentIndex, setCurrentIndex] = useState(index);

  return (
    <ImageViewing
      images={images.map((img) =>
        typeof img === "number"
          ? { uri: Image.resolveAssetSource(img).uri }
          : { uri: img }
      )}
      imageIndex={index}
      visible={visible}
      onRequestClose={onClose}
      onImageIndexChange={(newIndex) => setCurrentIndex(newIndex)}
      HeaderComponent={() => (
        <View style={styles.header}>
          {/* Nút Thoát */}
          <Pressable onPress={onClose} style={styles.closeButton}>
            <AntDesign name="arrowleft" size={24} color="white" />
          </Pressable>

          {/* Pagination */}
          <Text style={styles.pageText}>
            {currentIndex + 1}/{images.length}
          </Text>
        </View>
      )}
    />
  );
}

const styles = StyleSheet.create({
  header: {
    position: "absolute",
    top: 40,
    left: 0,
    right: 0,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    zIndex: 10,
  },
  closeButton: {
    padding: 4,
  },
  pageText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
    textAlign: "center",
    flex: 1,
  },
});
