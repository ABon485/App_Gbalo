import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  StyleSheet,
  Dimensions,
} from "react-native";
import dayjs from "dayjs";
import "dayjs/locale/vi";

const { width } = Dimensions.get("window");

const getDaysInMonth = (year: number, month: number) => {
  const firstDay = dayjs(`${year}-${month + 1}-01`);
  const days = [];

  const offset = firstDay.day(); 
  for (let i = 0; i < offset; i++) {
    days.push(null); 
  }

  const totalDays = firstDay.daysInMonth();
  for (let d = 1; d <= totalDays; d++) {
    days.push(dayjs(new Date(year, month, d)));
  }

  return days;
};

const CustomDatePicker = ({
  visible,
  onClose,
  onSave,
}: {
  visible: boolean;
  onClose: () => void;
  onSave: (date: string) => void;
}) => {
  const today = dayjs();
  const [currentMonth, setCurrentMonth] = useState(today.month());
  const [currentYear, setCurrentYear] = useState(today.year());
  const [selectedDate, setSelectedDate] = useState<dayjs.Dayjs | null>(null);

  const handleMonthChange = (direction: "prev" | "next") => {
    let newMonth = currentMonth;
    let newYear = currentYear;

    if (direction === "prev") {
      if (newMonth === 0) {
        newMonth = 11;
        newYear -= 1;
      } else {
        newMonth -= 1;
      }
    } else {
      if (newMonth === 11) {
        newMonth = 0;
        newYear += 1;
      } else {
        newMonth += 1;
      }
    }

    setCurrentMonth(newMonth);
    setCurrentYear(newYear);
  };

  const days = getDaysInMonth(currentYear, currentMonth);
  const weeks = ["CN", "T2", "T3", "T4", "T5", "T6", "T7"];

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={styles.overlay}>
        <View style={styles.container}>
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity onPress={() => handleMonthChange("prev")}>
              <Text style={styles.arrowText}>{"<"}</Text>
            </TouchableOpacity>

            <Text style={styles.headerText}>
              Tháng {currentMonth + 1} năm {currentYear}
            </Text>

            <TouchableOpacity onPress={() => handleMonthChange("next")}>
              <Text style={styles.arrowText}>{">"}</Text>
            </TouchableOpacity>
          </View>

          {/* Week days */}
          <View style={styles.weekRow}>
            {weeks.map((d) => (
              <Text key={d} style={styles.weekText}>
                {d}
              </Text>
            ))}
          </View>

          {/* Dates */}
          <View style={styles.daysContainer}>
            {days.map((d, index) => {
              if (!d) {
                return <View key={index} style={styles.emptyDay} />;
              }

              const isSelected =
                selectedDate &&
                selectedDate.format("YYYY-MM-DD") === d.format("YYYY-MM-DD");

              const isPast = d.isBefore(today, "day");

              return (
                <TouchableOpacity
                  key={index}
                  style={[
                    styles.day,
                    isSelected && styles.selectedDay,
                    isPast && styles.disabledDay,
                  ]}
                  disabled={isPast}
                  onPress={() => setSelectedDate(d)}
                >
                  <Text
                    style={[
                      styles.dayText,
                      isSelected && styles.selectedDayText,
                      isPast && styles.disabledDayText,
                    ]}
                  >
                    {d.date()}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>

          {/* Actions */}
          <View style={styles.actions}>
            <TouchableOpacity style={styles.cancelBtn} onPress={onClose}>
              <Text style={styles.cancelText}>Xóa</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.saveBtn}
              onPress={() => {
                if (selectedDate) {
                  onSave(selectedDate.format("YYYY-MM-DD"));
                  onClose();
                }
              }}
            >
              <Text style={styles.saveText}>Lưu</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const daySize = (width - 32) / 7;

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0,0,0,0.3)",
  },
  container: {
    backgroundColor: "#fff",
    padding: 16,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
    alignItems: "center",
  },
  headerText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
  arrowText: {
    fontSize: 29,
    color: "#000",
  },
  weekRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 4,
  },
  weekText: {
    width: daySize,
    textAlign: "center",
    fontWeight: "bold",
    fontSize: 12,
    color: "#555",
  },
  daysContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "flex-start",
  },
  day: {
    width: daySize,
    height: daySize,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 4,
    borderRadius: daySize / 2,
  },
  dayText: {
    fontSize: 14,
    color: "#333",
  },
  selectedDay: {
    backgroundColor: "#FF5722",
  },
  selectedDayText: {
    color: "#fff",
    fontWeight: "bold",
  },
  disabledDay: {
    backgroundColor: "#f0f0f0",
  },
  disabledDayText: {
    color: "#bbb",
  },
  emptyDay: {
    width: daySize,
    height: daySize,
    marginBottom: 4,
  },
  actions: {
    flexDirection: "row",
    marginTop: 16,
  },
  cancelBtn: {
    flex: 1,
    marginRight: 100,
    paddingVertical: 12,
    backgroundColor: "#E0E0E0",
    borderRadius: 24,
    alignItems: "center",
  },
  saveBtn: {
    flex: 1,
    marginLeft: 8,
    paddingVertical: 12,
    backgroundColor: "#FF5722",
    borderRadius: 24,
    alignItems: "center",
  },
  cancelText: {
    color: "#333",
    fontWeight: "bold",
  },
  saveText: {
    color: "#fff",
    fontWeight: "bold",
  },
});

export default CustomDatePicker;
