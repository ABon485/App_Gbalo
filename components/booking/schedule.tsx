import React, { useRef, useEffect, useState } from "react";
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  StyleSheet,
  Animated,
  Easing,
  Dimensions,
} from "react-native";
import DatePicker from "react-native-ui-datepicker";
import dayjs from "dayjs";
import "dayjs/locale/vi"; // Import Vietnamese locale for dayjs

const { height } = Dimensions.get("window");

type Props = {
  visible: boolean;
  onClose: () => void;
  onSave: (date: string) => void;
  selectedDates?: string[];
};

export default function Schedule({
  visible,
  onClose,
  onSave,
  selectedDates = [],
}: Props) {
  const slideAnim = useRef(new Animated.Value(height)).current;
  const [selectedDate, setSelectedDate] = useState(dayjs());
  const [currentYear, setCurrentYear] = useState(dayjs().year());
  const [currentMonth, setCurrentMonth] = useState(dayjs().month());

  const selectedDatesArray = selectedDates.map((date) => dayjs(date));

  useEffect(() => {
    Animated.timing(slideAnim, {
      toValue: visible ? 0 : height,
      duration: 300,
      easing: Easing.out(Easing.ease),
      useNativeDriver: true,
    }).start();

    if (visible) {
      setSelectedDate(dayjs(new Date(currentYear, currentMonth, 1)));
    }
  }, [visible, currentMonth, currentYear]);

  const handleMonthChange = (direction: "prev" | "next") => {
    let newMonth = currentMonth;
    let newYear = currentYear;

    if (direction === "prev") {
      if (currentMonth === 0) {
        newMonth = 11;
        newYear -= 1;
      } else {
        newMonth -= 1;
      }
    } else {
      if (currentMonth === 11) {
        newMonth = 0;
        newYear += 1;
      } else {
        newMonth += 1;
      }
    }

    setCurrentMonth(newMonth);
    setCurrentYear(newYear);
    setSelectedDate(dayjs(new Date(newYear, newMonth, selectedDate.date())));
  };

  const handleDateChange = (date: any) => {
    setSelectedDate(dayjs(date));
  };

  const isSelectedPreviously = (date: Date) => {
    return selectedDatesArray.some(
      (d) => d.format("YYYY-MM-DD") === dayjs(date).format("YYYY-MM-DD")
    );
  };

  const customDayStyle = (date: any) => {
    const formattedDate = dayjs(date);
    const today = dayjs(); // Real-time current date (May 5, 2025)

    if (formattedDate.isBefore(today, "day")) {
      return {
        textStyle: { color: "#bbb" },
        containerStyle: { backgroundColor: "#f0f0f0" },
        disabled: true,
      };
    }

    if (isSelectedPreviously(date)) {
      return {
        textStyle: { color: "#333", fontWeight: "bold" },
        containerStyle: {
          backgroundColor: "#E0E0E0",
          borderRadius: 20,
        },
      };
    }

    if (formattedDate.isSame(selectedDate, "day")) {
      return {
        textStyle: { color: "#fff", fontWeight: "bold" },
        containerStyle: {
          backgroundColor: "#FF5722",
          borderRadius: 20,
        },
      };
    }

    return {
      textStyle: { color: "#333" },
      containerStyle: { backgroundColor: "transparent" },
    };
  };

  return (
    <Modal transparent animationType="none" visible={visible}>
      <View style={styles.overlay}>
        <TouchableOpacity style={styles.backdrop} onPress={onClose} />
        <Animated.View
          style={[styles.sheet, { transform: [{ translateY: slideAnim }] }]}
        >
          // ... import và định nghĩa như bạn có sẵn
          <DatePicker
            mode="single"
            date={selectedDate.toDate()}
            onChange={(params) => handleDateChange(params.date)}
            locale="vi"
            height={300}
            selectedTextColor="#fff"
            selectedBackgroundColor="#FF5722"
            style={styles.datePicker}
            headerTextStyle={styles.headerText}
            dayTextStyle={styles.dayText}
            weekDaysTextStyle={styles.weekDaysTextStyle} // ✅ sửa key đúng tên
            customDayStyle={customDayStyle}
            minDate={dayjs().toDate()}
            // ✅ Custom header đảm bảo style hoạt động
            header={({ date }: { date: Date | null }) => {
              if (!date) return null;

              return (
                <View style={styles.header}>
                  <TouchableOpacity onPress={() => handleMonthChange("prev")}>
                    <Text style={styles.arrowText}>{"<"}</Text>
                  </TouchableOpacity>

                  <Text style={styles.monthTitle}>
                    {`Tháng ${dayjs(date).month() + 1} năm ${dayjs(
                      date
                    ).year()}`}
                  </Text>

                  <TouchableOpacity onPress={() => handleMonthChange("next")}>
                    <Text style={styles.arrowText}>{">"}</Text>
                  </TouchableOpacity>
                </View>
              );
            }}
          />
          <View style={styles.actions}>
            <TouchableOpacity style={styles.cancelBtn} onPress={onClose}>
              <Text style={styles.cancelText}>Xóa</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.saveBtn}
              onPress={() => {
                onSave(selectedDate.format("YYYY-MM-DD"));
                onClose();
              }}
            >
              <Text style={styles.saveText}>Lưu</Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0,0,0,0.4)",
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
  },
  sheet: {
    backgroundColor: "#fff",
    paddingTop: 16,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    paddingBottom: 30,
    paddingHorizontal: 16,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
    paddingVertical: 10,
    backgroundColor: "#f9f9f9", // ✅ để kiểm tra hiển thị
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    paddingHorizontal: 12,
  },
  monthTitle: {
    textAlign: "center",
    fontWeight: "bold",
    fontSize: 16,
    color: "#333",
  },
  arrowText: {
    fontSize: 24,
    color: "#333",
  },
  weekDaysTextStyle: {
    fontSize: 12,
    color: "#333",
    fontWeight: "bold",
  },
  datePicker: {
    width: "100%",
  },
  headerText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
  dayText: {
    fontSize: 14,
    color: "#333",
  },
  weekDaysText: {
    fontSize: 12,
    color: "#333",
    fontWeight: "bold",
  },
  actions: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 16,
  },
  cancelBtn: {
    flex: 1,
    marginRight: 8,
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
    fontSize: 16,
  },
  saveText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
});
