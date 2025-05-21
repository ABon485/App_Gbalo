import React, { useState } from "react";
import { Modal, View, Text, TouchableOpacity, StyleSheet } from "react-native";

type Props = {
  visible: boolean;
  onClose: () => void;
  onSave: (client: string, totalPrice: number) => void; // Cập nhật onSave để trả về tổng giá
  tourPrices: Array<{
    id: number;
    guestTypeId: number;
    guestType: string;
    age: string;
    price: number;
    unitId: number;
    unitName: string | null;
  }>; // Thêm tourPrices vào Props
};

export default function ClientModal({
  visible,
  onClose,
  onSave,
  tourPrices,
}: Props) {
  const [adults, setAdults] = useState(0); // Mặc định 1 người lớn
  const [children, setChildren] = useState(0);
  const [infants, setInfants] = useState(0);

  // Tìm giá cho từng loại khách từ tourPrices
  const adultPrice =
    tourPrices.find((price) => price.guestType === "Người lớn")?.price || 0;
  const childPrice =
    tourPrices.find(
      (price) => price.guestType === "Trẻ em" && price.age === "Từ 6-11 tuổi"
    )?.price || 0;
  const infantPrice =
    tourPrices.find(
      (price) => price.guestType === "Trẻ em" && price.age === "Từ 2-5 tuổi"
    )?.price || 0;

  // Tính tổng giá
  const calculateTotalPrice = () => {
    return adults * adultPrice + children * childPrice + infants * infantPrice;
  };

  const handleSave = () => {
    // Tạo chuỗi mô tả khách
    const guestDescription =
      [
        adults > 0 ? `${adults} người lớn` : null,
        children > 0 ? `${children} trẻ em` : null,
        infants > 0 ? `${infants} em bé` : null,
      ]
        .filter(Boolean)
        .join(", ") || "1 người lớn";

    // Tính tổng giá
    const totalPrice = calculateTotalPrice();

    // Gọi onSave với chuỗi mô tả và tổng giá
    onSave(guestDescription, totalPrice);
    onClose();
  };

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.container}>
          <Counter
            label="Người lớn"
            description={`Từ 13 tuổi trở lên - ${adultPrice.toLocaleString(
              "vi-VN"
            )}đ`}
            value={adults}
            onIncrease={() => setAdults(adults + 1)}
            onDecrease={() => setAdults(Math.max(1, adults - 1))}
          />
          <Counter
            label="Trẻ em"
            description={`Từ 6-11 tuổi - ${childPrice.toLocaleString(
              "vi-VN"
            )}đ`}
            value={children}
            onIncrease={() => setChildren(children + 1)}
            onDecrease={() => setChildren(Math.max(0, children - 1))}
          />
          <Counter
            label="Em bé"
            description={`Từ 2-5 tuổi - ${infantPrice.toLocaleString(
              "vi-VN"
            )}đ`}
            value={infants}
            onIncrease={() => setInfants(infants + 1)}
            onDecrease={() => setInfants(Math.max(0, infants - 1))}
          />

          <View style={styles.footer}>
            <TouchableOpacity style={styles.deleteButton} onPress={onClose}>
              <Text style={styles.deleteText}>Xóa</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
              <Text style={styles.saveText}>Lưu</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

// Counter Component
function Counter({
  label,
  description,
  value,
  onIncrease,
  onDecrease,
}: {
  label: string;
  description: string;
  value: number;
  onIncrease: () => void;
  onDecrease: () => void;
}) {
  return (
    <View style={styles.counterContainer}>
      <View>
        <Text style={styles.label}>{label}</Text>
        <Text style={styles.description}>{description}</Text>
      </View>
      <View style={styles.counterControls}>
        <TouchableOpacity style={styles.button} onPress={onDecrease}>
          <Text style={styles.buttonText}>-</Text>
        </TouchableOpacity>
        <Text style={styles.value}>{value}</Text>
        <TouchableOpacity style={styles.button} onPress={onIncrease}>
          <Text style={styles.buttonText}>+</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "flex-end",
  },
  container: {
    padding: 16,
    backgroundColor: "#fff",
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },
  counterContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginVertical: 12,
  },
  label: {
    fontSize: 16,
    fontWeight: "bold",
  },
  description: {
    fontSize: 12,
    color: "#888",
  },
  counterControls: {
    flexDirection: "row",
    alignItems: "center",
  },
  button: {
    width: 32,
    height: 32,
    borderWidth: 1,
    borderColor: "#333",
    borderRadius: 4,
    alignItems: "center",
    justifyContent: "center",
    marginHorizontal: 8,
  },
  buttonText: {
    fontSize: 18,
    color: "#333",
  },
  value: {
    fontSize: 16,
    color: "#FF5722",
    fontWeight: "bold",
  },

  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 24,
  },
  deleteButton: {
    flex: 1,
    marginRight: 100,
    paddingVertical: 12,
    backgroundColor: "#E0E0E0",
    borderRadius: 24,
    alignItems: "center",
    width: "30%",
  },
  deleteText: {
    fontSize: 16,
    color: "#333",
  },
  saveButton: {
    flex: 1,
    marginLeft: 8,
    paddingVertical: 12,
    backgroundColor: "#FF5722",
    borderRadius: 24,
    alignItems: "center",
  },
  saveText: {
    fontSize: 16,
    color: "#fff",
  },
});
