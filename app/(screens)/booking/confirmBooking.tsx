import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  TextInput,
} from "react-native";
import AntDesign from "@expo/vector-icons/AntDesign";
import styles from "@/styles/booking/confirmBooking";
import Schedule from "@/components/booking/schedule";
import ClientOption from "@/components/booking/clientOption";
import EditPersonalInformation from "@/components/booking/edit-personal-information";
import AddDiscountCode from "@/components/booking/add-discount-code";
import { router, useLocalSearchParams } from "expo-router";
import tourApi from "@/services/tour";
import bookingApi from "@/services/tour";
import { Booking, Policy, TourDetail } from "@/types/tour";
import { useToast } from "@/context/ToastContext";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Hàm chuyển đổi định dạng ngày từ DD/MM/YYYY sang YYYY-MM-DD
const formatDateToYYYYMMDD = (date: string): string => {
  if (/^\d{2}\/\d{2}\/\d{4}$/.test(date)) {
    const [day, month, year] = date.split("/");
    return `${year}-${month}-${day}`;
  }
  return date; // Trả về nguyên gốc nếu đã đúng định dạng
};

export default function ConfirmBooking() {
  const [checkbox, setIsCheckbox] = useState(false);
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedGuests, setSelectedGuests] = useState("");
  const [totalPrice, setTotalPrice] = useState(0);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [tourName, setTourName] = useState<string>("");
  const [tourSubName, setTourSubName] = useState<string>("");
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [showClientModal, setShowClientModal] = useState(false);
  const [showEditPersonalModal, setShowEditPersonalModal] = useState(false);
  const [showAddDiscountModal, setShowAddDiscountModal] = useState(false);
  const [tour, setTour] = useState<TourDetail | null>(null);
  const [userId, setUserId] = useState<number | null>(null);
  const [policyData, setPolicyData] = useState<Policy | null>(null);
  const { showToast } = useToast();
  const [userInfo, setUserInfo] = useState<{
    fullName?: string;
    phone?: string;
    email?: string;
    address?: string;
  } | null>(null);
  const [contactErrors, setContactErrors] = useState<{
    fullName?: string;
    phone?: string;
    email?: string;
  }>({});

  const updateUserInfo = (field: keyof typeof userInfo, value: string) => {
    setUserInfo((prev) => ({ ...prev, [field]: value }));
    setContactErrors((prevErrors) => {
      const newErrors = { ...prevErrors };
      if (value.trim() !== "") delete newErrors[field];
      return newErrors;
    });
  };

  // Calculate prepayment based on depositPercent from policyData, with fallback to 0 if not available
  const prepayment = policyData?.depositPercent
    ? Math.round(totalPrice * (policyData.depositPercent / 100))
    : 0;

  const params = useLocalSearchParams();
  const tourId = Number(params.tourId);
  const initialDate = params.selectedDate as string;
  const initialGuests = params.selectedGuests as string;
  const initialTotalPrice = Number(params.totalPrice) || 0;
  const initialImageUrl = params.imageUrl as string;
  const initialTourName = params.tourName as string;
  const initialTourSubName = params.tourSubName as string;

  useEffect(() => {
    try {
      const parsedUser = params.user ? JSON.parse(params.user as string) : null;
      setUserInfo(parsedUser);
    } catch (error) {
      console.error("Lỗi khi parse user:", error);
      setUserInfo(null);
    }
  }, [params.user]);

  useEffect(() => {
    const fetchTourDetail = async () => {
      try {
        const detail = await tourApi.TourDetail(tourId);
        setTour(detail);
      } catch (error) {
        console.error("Lỗi khi lấy chi tiết tour:", error);
      }
    };
    if (tourId) fetchTourDetail();
  }, [tourId]);

  useEffect(() => {
    const fetchUserId = async () => {
      try {
        const dataStr = await AsyncStorage.getItem("data");
        if (dataStr) {
          const data = JSON.parse(dataStr);
          if (data && data.userId) setUserId(data.userId);
        }
      } catch (err) {
        console.error("Lỗi lấy userId từ AsyncStorage:", err);
      }
    };
    fetchUserId();
  }, []);

  useEffect(() => {
    if (initialDate && initialDate !== "Chọn ngày") {
      setSelectedDate(formatDateToYYYYMMDD(initialDate));
    }
    if (initialGuests && initialGuests !== "1 khách")
      setSelectedGuests(initialGuests);
    if (initialTotalPrice) setTotalPrice(initialTotalPrice);
    if (initialImageUrl) setImageUrl(initialImageUrl);
    if (initialTourName) setTourName(initialTourName);
    if (initialTourSubName) setTourSubName(initialTourSubName);
  }, [
    initialDate,
    initialGuests,
    initialTotalPrice,
    initialImageUrl,
    initialTourName,
    initialTourSubName,
  ]);

  useEffect(() => {
    const fetchPolicy = async () => {
      if (
        tourId &&
        selectedDate &&
        selectedDate !== "Chọn ngày" &&
        selectedDate !== "Chưa chọn" &&
        /^\d{4}-\d{2}-\d{2}$/.test(selectedDate)
      ) {
        try {
          console.log(
            "Gửi yêu cầu API với:",
            JSON.stringify({ tourId, selectedDate }, null, 2)
          );
          const res = await tourApi.getPolicy(tourId, selectedDate);
          setPolicyData(res.data);
          console.log(
            "Lấy chính sách thành công:",
            JSON.stringify(res, null, 2)
          );
        } catch (err) {
          let errorMessage = "Không thể tải chính sách.";
          if (typeof err === "object" && err !== null && "response" in err) {
            const response = (err as any).response;
            console.error("Lỗi khi gọi API getPolicy:", response?.data || err);
            errorMessage = response?.data?.message || errorMessage;
          } else {
            console.error("Lỗi khi gọi API getPolicy:", err);
          }
          showToast({ type: "error", message: errorMessage });
          setPolicyData(null);
        }
      } else {
        console.log("Tham số không hợp lệ:", { tourId, selectedDate });
      }
    };
    fetchPolicy();
  }, [tourId, selectedDate]);

  const handleSaveDate = (date: string) => {
    setSelectedDate(formatDateToYYYYMMDD(date));
    setShowScheduleModal(false);
  };

  const handleSaveClient = (client: string, price: number) => {
    setSelectedGuests(client);
    setTotalPrice(price);
    setShowClientModal(false);
  };

  const handleSavePersonalInfo = (personalInfo: {
    fullName: string;
    phone: string;
    email: string;
  }) => {
    setUserInfo((prev) => ({
      ...prev,
      fullName: personalInfo.fullName,
      phone: personalInfo.phone,
      email: personalInfo.email,
    }));
    setContactErrors((prevErrors) => {
      const newErrors = { ...prevErrors };
      if (personalInfo.fullName.trim() !== "") delete newErrors.fullName;
      if (personalInfo.phone.trim() !== "") delete newErrors.phone;
      if (personalInfo.email.trim() !== "") delete newErrors.email;
      return newErrors;
    });
    setShowEditPersonalModal(false);
  };

  const handleApplyDiscount = (code: string) => {
    console.log("Applied discount code:", code);
  };

  const renderCheckbox = (
    label: string,
    isChecked: boolean,
    onPress: () => void
  ) => (
    <TouchableOpacity style={styles.checkboxRow} onPress={onPress}>
      <View style={[styles.checkbox, isChecked && styles.checkboxChecked]}>
        {isChecked && <AntDesign name="check" size={14} color="#fff" />}
      </View>
      <Text style={styles.checkboxLabel}>{label}</Text>
    </TouchableOpacity>
  );

  const handlePayment = async () => {
    // Validate selectedDate
    if (
      !selectedDate ||
      selectedDate === "Chưa chọn" ||
      selectedDate === "Chọn ngày"
    ) {
      showToast({
        type: "error",
        message: "Vui lòng chọn ngày khởi hành trước khi thanh toán.",
      });
      return;
    }

    // Validate selectedGuests
    if (
      !selectedGuests ||
      selectedGuests === "Chưa chọn" ||
      selectedGuests === "1 khách"
    ) {
      showToast({
        type: "error",
        message: "Vui lòng chọn số lượng khách trước khi thanh toán.",
      });
      return;
    }

    // Validate userInfo
    const errors: typeof contactErrors = {};
    if (!userInfo?.fullName || userInfo.fullName.trim() === "")
      errors.fullName = "Vui lòng điền tên của bạn.";
    if (!userInfo?.phone || userInfo.phone.trim() === "")
      errors.phone = "Vui lòng điền số điện thoại của bạn.";
    if (!userInfo?.email || userInfo.email.trim() === "")
      errors.email = "Vui lòng điền email của bạn.";
    setContactErrors(errors);

    if (Object.keys(errors).length > 0) return;

    if (!checkbox) {
      showToast({
        type: "error",
        message:
          "Vui lòng đồng ý với Điều khoản sử dụng và Chính sách hoàn hủy.",
      });
      return;
    }

    if (!policyData?.depositPercent) {
      showToast({
        type: "error",
        message: "Không thể xác định tỷ lệ thanh toán trước. Vui lòng thử lại.",
      });
      return;
    }
    if (!userInfo || !userId) {
      router.push("/(auths)/(Login)/login");
      return;
    }

    // Parse selectedGuests, e.g., "1 người lớn, 1 trẻ em, 1 em bé"
    const guestEntries = selectedGuests.split(",").map((entry) => entry.trim());
    const guestDetails: { quantity: number; guestType: string }[] = [];

    for (const entry of guestEntries) {
      const guestMatch = entry.match(/^(\d+)\s*(.+)$/); // e.g., "1 người lớn" -> ["1 người lớn", "1", "người lớn"]
      if (!guestMatch) {
        console.log("Validation failed: Invalid selectedGuests format for", entry);
        showToast({
          type: "error",
          message: `Dữ liệu số lượng khách không hợp lệ: ${entry}.`,
        });
        return;
      }
      const quantity = parseInt(guestMatch[1], 10);
      const guestType = guestMatch[2].trim();
      guestDetails.push({ quantity, guestType });
    }

    // Validate and calculate total price for each guest type
    let expectedTotalPrice = 0;
    const serviceDetails: { serviceDetailId: number; quantity: number; price: number }[] = [];

    for (const { quantity, guestType } of guestDetails) {
      let tourPrice;

      // Map guestType to tourPrice based on guestType and age
      if (guestType.toLowerCase() === "người lớn") {
        tourPrice = tour?.tourPrices.find(
          (price) => price.guestType.toLowerCase() === "người lớn"
        );
      } else if (guestType.toLowerCase() === "trẻ em") {
        tourPrice = tour?.tourPrices.find(
          (price) =>
            price.guestType.toLowerCase() === "trẻ em" &&
            price.age === "Từ 6-11 tuổi"
        );
      } else if (guestType.toLowerCase() === "em bé") {
        tourPrice = tour?.tourPrices.find(
          (price) =>
            price.guestType.toLowerCase() === "trẻ em" &&
            price.age === "Từ 2-5 tuổi"
        );
      } else {
        console.log("Validation failed: Unrecognized guestType", guestType);
        showToast({
          type: "error",
          message: `Loại khách không hợp lệ: ${guestType}.`,
        });
        return;
      }

      if (!tourPrice) {
        console.log("Validation failed: No matching tourPrice for guestType", guestType);
        showToast({
          type: "error",
          message: `Không tìm thấy thông tin giá cho loại khách: ${guestType}.`,
        });
        return;
      }

      const guestTypeId = tourPrice.guestTypeId;
      const price = tourPrice.price;
      expectedTotalPrice += price * quantity;
      serviceDetails.push({ serviceDetailId: guestTypeId, quantity, price });
    }

    // Verify totalPrice consistency
    if (totalPrice !== expectedTotalPrice) {
      console.log("Validation failed: Total price mismatch", {
        totalPrice,
        expectedTotalPrice,
      });
      showToast({
        type: "error",
        message: "Tổng giá không khớp, vui lòng kiểm tra lại.",
      });
      return;
    }

    // Create booking data
    const bookingData: Booking = {
      CustomerId: userId,
      departureDate: selectedDate,
      customerName: userInfo.fullName || "",
      customerPhone: userInfo.phone || "",
      customerEmail: userInfo.email || "",
      customerAddress: userInfo.address || "",
      note: "",
      services: [
        {
          serviceId: tourId,
          serviceName: tourName,
          details: serviceDetails,

        },
      ],
      payments: [
        {
          paymentDate: new Date().toISOString(),
          paymentMethodId: 1,
          bankCode: "VNPay",
          paymentAmount: prepayment,
          paymentAmountByCurrency: prepayment,
          currencyType: "VND",
          currencyRate: 1,
          note: "",
          isDeposit: typeof policyData?.depositPercent !== "undefined" && policyData.depositPercent > 0,
          isDepositPaid: false,
        },
      ],
    };

    try {
      const response = await bookingApi.createBooking(bookingData);
      router.push({
        pathname: "/(screens)/booking/successBooking",
        params: { bookingId: response.data.bookingId.toString() },
      });
    } catch (error) {
      console.error("Error in bookingApi.createBooking:", error);
      showToast({
        type: "error",
        message: "Tạo booking thất bại, vui lòng thử lại.",
      });
    }
  };

  if (!tour) {
    return (
      <View style={styles.container}>
        <Text>Đang tải thông tin tour...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <TouchableOpacity onPress={() => router.back()}>
          <AntDesign name="arrowleft" size={20} color="black" />
        </TouchableOpacity>
        <Text style={styles.headerText}>Xác nhận và thanh toán</Text>
      </View>

      <ScrollView style={styles.scrollContent}>
        <View style={styles.tourCard}>
          <Image
            source={
              imageUrl
                ? { uri: imageUrl }
                : require("@/assets/images/home/Property1.png")
            }
            style={styles.tourImage}
            onError={() => {
              console.log("Failed to load image from URL:", imageUrl);
              setImageUrl(null);
            }}
          />
          <View style={styles.tourInfo}>
            <Text style={styles.tourTitle}>{tourName || tour.name}</Text>
            <Text style={styles.rating}>⭐ 4.95/5 (648)</Text>
            <Text style={styles.price}>
              Từ{" "}
              <Text style={styles.bold}>
                {" "}
                {totalPrice.toLocaleString("vi-VN")}₫/
              </Text>
              Người
            </Text>
          </View>
        </View>

        <Text style={styles.notice}>
          <Text style={styles.bold}>Hủy miễn phí</Text>{" "}
          {" trước 8 tháng 4. Được hoàn tiền đầy đủ nếu bạn thay đổi kế hoạch."}
        </Text>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Thời gian chuyến đi</Text>
          <View style={styles.scheduleRow}>
            <View style={styles.labelValueBlock}>
              <Text style={styles.label}>Ngày khởi hành:</Text>
              <Text style={styles.value}>{selectedDate || "Chưa chọn"}</Text>
            </View>
            <TouchableOpacity onPress={() => setShowScheduleModal(true)}>
              <Text style={styles.link}>Chỉnh sửa</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.scheduleRow}>
            <View style={styles.labelValueBlock}>
              <Text style={styles.label}>Khách:</Text>
              <Text style={styles.value}>{selectedGuests || "Chưa chọn"}</Text>
            </View>
            <TouchableOpacity onPress={() => setShowClientModal(true)}>
              <Text style={styles.link}>Chỉnh sửa</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Thông tin liên hệ</Text>
            <TouchableOpacity
              style={styles.editButton}
              onPress={() => setShowEditPersonalModal(true)}
            >
              <Text style={styles.link}>Chỉnh sửa</Text>
            </TouchableOpacity>
          </View>
          <Text style={styles.contactText}>
            Họ tên <Text style={styles.required}>*</Text>:{" "}
            {userInfo?.fullName || "Chưa cung cấp"}
          </Text>
          {contactErrors.fullName && (
            <Text style={styles.errorText}>{contactErrors.fullName}</Text>
          )}
          <Text style={styles.contactText}>
            Số điện thoại <Text style={styles.required}>*</Text>:{" "}
            {userInfo?.phone || "Chưa cung cấp"}
          </Text>
          {contactErrors.phone && (
            <Text style={styles.errorText}>{contactErrors.phone}</Text>
          )}
          <Text style={styles.contactText}>
            Email <Text style={styles.required}>*</Text>:{" "}
            {userInfo?.email || "Chưa cung cấp"}
          </Text>
          {contactErrors.email && (
            <Text style={styles.errorText}>{contactErrors.email}</Text>
          )}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Bạn yêu cầu nào không?</Text>
          <Text style={styles.sectionSub}>
            Hãy gửi yêu cầu của bạn để chúng tôi hỗ trợ tốt hơn.
          </Text>
          <TextInput
            style={styles.input}
            placeholder="Nhập yêu cầu của bạn..."
            multiline
            numberOfLines={4}
            scrollEnabled={true}
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Giảm giá</Text>
          <View style={styles.discountRow}>
            <Text style={styles.discountLabel}>Mã ưu đãi nền tảng</Text>
            <Text style={styles.disabled}>Không khả dụng</Text>
          </View>
          <View style={styles.discountRow}>
            <Text style={styles.discountLabel}>Mã ưu đãi thanh toán</Text>
            <TouchableOpacity
              style={styles.discountContainer}
              onPress={() => setShowAddDiscountModal(true)}
            >
              <View style={styles.plusBox}>
                <Text style={styles.plusText}>+</Text>
              </View>
              <Text style={styles.discountText}>Thêm mã giảm giá</Text>
            </TouchableOpacity>
          </View>
        </View>

        <Text style={styles.paymentTitle}>Thanh toán bằng</Text>
        <Text style={styles.introText}>
          Tất cả thông tin đều được mã hóa và bảo mật
        </Text>
        <View style={styles.paymentBox}>
          <Image
            source={{
              uri:
                "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTp1v7T287-ikP1m7dEUbs2n1SbbLEqkMd1ZA&s",
            }}
            style={styles.vnpayLogo}
          />
          <View style={styles.textContainer}>
            <Text style={styles.sectionTitle}>Thanh toán bằng VNPAY - QR</Text>
            <Text style={styles.smallText}>
              Đảm bảo thanh toán an toàn với VN Pay bằng các hình thức chuyển
              khoản hoặc thẻ tín dụng
            </Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Chính sách</Text>
          <View>
            {policyData?.policies && policyData.policies.length > 0 ? (
              policyData.policies.map((item: string, index: number) => (
                <View key={index} style={styles.policyItem}>
                  <Text style={styles.checkMark}>
                    <AntDesign name="check" size={20} color="green" />
                  </Text>
                  <Text style={styles.policyText}>{item}</Text>
                </View>
              ))
            ) : (
              <>
                <View style={styles.policyItem}>
                  <Text style={styles.checkMark}>Không có chính sách </Text>
                </View>
              </>
            )}
          </View>

          <View style={styles.checkboxContainer}>
            {renderCheckbox("", checkbox, () => setIsCheckbox(!checkbox))}
            <Text style={styles.checkboxText}>
              Bạn đồng ý rằng bạn đã đọc và hiểu{" "}
              <Text style={styles.Newlink}>Điều khoản sử dụng</Text> và{" "}
              <Text style={styles.Newlink}>Chính sách hoàn hủy</Text>
            </Text>
          </View>
        </View>

        <View style={styles.footer}>
          <View style={styles.priceInfo}>
            <View style={styles.priceRow}>
              <Text style={styles.label}>Tổng cộng:</Text>
              <Text style={styles.totalAmount}>
                đ {totalPrice.toLocaleString("vi-VN")}
              </Text>
            </View>
            <View style={styles.prepayRow}>
              <Text style={styles.label}>
                Thanh toán trước{" "}
                {policyData?.depositPercent
                  ? `${policyData.depositPercent}%`
                  : "N/A"}
                :
              </Text>
              <Text style={styles.prepayAmount}>
                đ {prepayment.toLocaleString("vi-VN")}
              </Text>
            </View>
          </View>
          <TouchableOpacity style={styles.button} onPress={handlePayment}>
            <Text style={styles.buttonText}>Thanh toán</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      <Schedule
        visible={showScheduleModal}
        onClose={() => setShowScheduleModal(false)}
        onSave={handleSaveDate}
      />
      <ClientOption
        visible={showClientModal}
        onClose={() => setShowClientModal(false)}
        onSave={handleSaveClient}
        tourPrices={tour.tourPrices || []}
      />
      <EditPersonalInformation
        visible={showEditPersonalModal}
        onClose={() => setShowEditPersonalModal(false)}
        onSave={handleSavePersonalInfo}
        initialFullName={userInfo?.fullName || ""}
        initialPhone={userInfo?.phone || ""}
        initialEmail={userInfo?.email || ""}
      />
      <AddDiscountCode
        visible={showAddDiscountModal}
        onClose={() => setShowAddDiscountModal(false)}
        onApply={handleApplyDiscount}
      />
    </View>
  );
}
