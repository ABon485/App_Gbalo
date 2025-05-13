import React, { useState } from "react";
import { Modal, View, Text, TouchableOpacity, StyleSheet } from "react-native";

type Props = {
  visible: boolean;
  onClose: () => void;
  onSave: (client: string) => void;
};

export default function ClientModal({ visible, onClose, onSave }: Props) {
  const [adults, setAdults] = useState(2);
  const [children, setChildren] = useState(0);
  const [infants, setInfants] = useState(1);

  const handleSave = () => {
    onSave(`${adults} người lớn, ${children} trẻ em, ${infants} em bé`);
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
            description="Từ 13 tuổi trở lên"
            value={adults}
            onIncrease={() => setAdults(adults + 1)}
            onDecrease={() => setAdults(Math.max(1, adults - 1))}
          />
          <Counter
            label="Trẻ em"
            description="Từ 2 - 12 tuổi"
            value={children}
            onIncrease={() => setChildren(children + 1)}
            onDecrease={() => setChildren(Math.max(0, children - 1))}
          />
          <Counter
            label="Em bé"
            description="Dưới 2 tuổi"
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
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 24,
  },
  deleteButton: {
    flex: 1,
    marginRight: 8,
    paddingVertical: 12,
    backgroundColor: "#E0E0E0",
    borderRadius: 24,
    alignItems: "center",
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
