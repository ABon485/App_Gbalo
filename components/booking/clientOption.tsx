import React, { useState, useEffect } from "react";
import { Modal, View, Text, TouchableOpacity } from "react-native";
import tourApi from "@/services/tour";
import { guestType } from "@/types/tour"; // Import guestType
import styles from "@/styles/booking/clientOption";

type Props = {
  visible: boolean;
  onClose: () => void;
  onSave: (client: string, totalPrice: number) => void; // Cập nhật onSave để nhận thêm totalPrice
};

type GuestCount = {
  id: number;
  guestType: string;
  age: string;
  count: number;
};

export default function ClientModal({ visible, onClose, onSave }: Props) {
  const [guestTypes, setGuestTypes] = useState<GuestCount[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Giá vé cố định
  const PRICES = {
    "Người lớn": 1988000, // Từ 13 tuổi trở lên
    "Trẻ em": 1000000, // Từ 2-11 tuổi
    "Em bé": 888000, // Dưới 2 tuổi
  };

  // Fetch guest types từ API khi modal mở
  useEffect(() => {
    if (visible) {
      const fetchGuestTypes = async () => {
        setLoading(true);
        try {
          const response: guestType = await tourApi.GuestType();
          const initialCounts: GuestCount[] = response.data.map((item) => ({
            id: item.id,
            guestType: item.guestType,
            age: item.age,
            count:
              item.guestType === "Người lớn"
                ? 1
                : item.guestType === "Em bé"
                ? 0
                : 0,
          }));
          setGuestTypes(initialCounts);
          setError(null);
        } catch (err) {
          setError("Không thể tải danh sách loại khách");
          console.error("Error fetching guest types:", err);
        } finally {
          setLoading(false);
        }
      };
      fetchGuestTypes();
    }
  }, [visible]);

  // Cập nhật số lượng cho guest type cụ thể
  const updateCount = (id: number, delta: number) => {
    setGuestTypes((prev) =>
      prev.map((item) =>
        item.id === id
          ? {
              ...item,
              count: Math.max(
                item.guestType === "Người lớn" ? 1 : 0,
                item.count + delta
              ),
            }
          : item
      )
    );
  };

  // Reset số lượng khách về mặc định
  const handleReset = () => {
    setGuestTypes((prev) =>
      prev.map((item) => ({
        ...item,
        count:
          item.guestType === "Người lớn"
            ? 1
            : item.guestType === "Em bé"
            ? 0
            : 0,
      }))
    );
    onClose(); // Đóng modal sau khi reset
  };

  // Tính tổng giá
  const calculateTotalPrice = () => {
    return guestTypes.reduce((total, guest) => {
      return (
        total +
        (PRICES[guest.guestType as keyof typeof PRICES] || 0) * guest.count
      );
    }, 0);
  };

  const handleSave = () => {
    // Tạo chuỗi kết quả, ví dụ: "2 Người lớn, 1 Trẻ em, 1 Em bé"
    const result = guestTypes
      .filter((item) => item.count > 0)
      .map((item) => `${item.count} ${item.guestType}`)
      .join(", ");

    // Tính tổng giá
    const totalPrice = calculateTotalPrice();

    // Gọi onSave với chuỗi mô tả và tổng giá
    onSave(result || "1 Người lớn", totalPrice);
    onClose();
  };

  if (loading) {
    return (
      <Modal
        animationType="slide"
        transparent={true}
        visible={visible}
        onRequestClose={onClose}
      >
        <View style={styles.overlay}>
          <View style={styles.container}>
            <Text style={styles.label}>Đang tải...</Text>
          </View>
        </View>
      </Modal>
    );
  }

  if (error) {
    return (
      <Modal
        animationType="slide"
        transparent={true}
        visible={visible}
        onRequestClose={onClose}
      >
        <View style={styles.overlay}>
          <View style={styles.container}>
            <Text style={styles.label}>{error}</Text>
            <TouchableOpacity style={styles.deleteButton} onPress={onClose}>
              <Text style={styles.deleteText}>Đóng</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    );
  }

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.container}>
          {guestTypes.map((guest) => (
            <Counter
              key={guest.id}
              label={guest.guestType}
              description={
                guestTypes.find((item) => item.id === guest.id)?.age || ""
              }
              value={guest.count}
              onIncrease={() => updateCount(guest.id, 1)}
              onDecrease={() => updateCount(guest.id, -1)}
            />
          ))}
          <View style={styles.footer}>
            <TouchableOpacity style={styles.deleteButton} onPress={handleReset}>
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

// Counter Component (giữ nguyên)
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
