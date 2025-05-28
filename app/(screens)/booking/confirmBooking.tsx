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
import { TourDetail } from "@/types/tour";
import { useToast } from "@/context/ToastContext";

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
  const { showToast } = useToast();
  const [userInfo, setUserInfo] = useState<{
    fullName?: string;
    phone?: string;
    email?: string;
  } | null>(null);
  const [contactErrors, setContactErrors] = useState<{
    fullName?: string;
    phone?: string;
    email?: string;
  }>({});
  const updateUserInfo = (field: keyof typeof userInfo, value: string) => {
    setUserInfo(prev => ({
      ...prev,
      [field]: value,
    }));

    // Nếu dữ liệu hợp lệ thì xóa lỗi tương ứng
    setContactErrors(prevErrors => {
      const newErrors = { ...prevErrors };
      if (value.trim() !== "") {
        delete newErrors[field];
      }
      return newErrors;
    });
  };

  const prepayment = Math.round(totalPrice * 0.3);

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

    if (tourId) {
      fetchTourDetail();
    }
  }, [tourId]);

  useEffect(() => {
    // Cập nhật dữ liệu ban đầu
    if (initialDate && initialDate !== "Chọn ngày") {
      setSelectedDate(initialDate);
    }
    if (initialGuests && initialGuests !== "1 khách") {
      setSelectedGuests(initialGuests);
    }
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

  const handleSaveDate = (date: string) => {
    setSelectedDate(date);
    setShowScheduleModal(false);
  };

  const handleSaveClient = (client: string, price: number) => {
    setSelectedGuests(client);
    setTotalPrice(price);
    setShowClientModal(false);
  };

  const handleSavePersonalInfo = (personalInfo: { fullName: string; phone: string; email: string; }) => {
    setUserInfo(prev => ({
      ...prev,
      fullName: personalInfo.fullName,
      phone: personalInfo.phone,
      email: personalInfo.email,
    }));

    setContactErrors(prevErrors => {
      const newErrors = { ...prevErrors };
      if (personalInfo.fullName.trim() !== "") {
        delete newErrors.fullName;
      }
      if (personalInfo.phone.trim() !== "") {
        delete newErrors.phone;
      }
      if (personalInfo.email.trim() !== "") {
        delete newErrors.email;
      }
      return newErrors;
    });

    setShowEditPersonalModal(false);
  };

  const handleApplyDiscount = (code: string) => {
    console.log("Applied discount code:", code);
    // Thêm logic giảm giá nếu cần
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

  const handlePayment = () => {
    // Validate ngày khởi hành
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

    // Validate số khách
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

    // Validate contact info
    const errors: typeof contactErrors = {};
    if (!userInfo?.fullName || userInfo.fullName.trim() === "") {
      errors.fullName = "Vui lòng điền tên của bạn.";
    }
    if (!userInfo?.phone || userInfo.phone.trim() === "") {
      errors.phone = "Vui lòng điền số điện thoại của bạn.";
    }
    if (!userInfo?.email || userInfo.email.trim() === "") {
      errors.email = "Vui lòng điền email của bạn.";
    }
    setContactErrors(errors);

    if (Object.keys(errors).length > 0) {
      // Có lỗi, không cho tiếp tục
      return;
    }

    // Kiểm tra checkbox
    if (!checkbox) {
      showToast({
        type: "error",
        message:
          "Vui lòng đồng ý với Điều khoản sử dụng và Chính sách hoàn hủy.",
      });
      return;
    }

    // Kiểm tra đăng nhập
    if (!userInfo) {
      router.push("/(auths)/(Login)/login");
      return;
    }

    // Thành công
    router.push({
      pathname: "/booking/successBooking",
      params: {
        tourId: tourId.toString(),
        selectedDate,
        selectedGuests,
        totalPrice: totalPrice.toString(),
        imageUrl: imageUrl || "",
        tourName,
        tourSubName,
        userInfo: JSON.stringify(userInfo),
      },
    });
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
      {/* Fixed Header */}
      <View style={styles.headerRow}>
        <TouchableOpacity onPress={() => router.back()}>
          <AntDesign name="arrowleft" size={20} color="black" />
        </TouchableOpacity>
        <Text style={styles.headerText}>Xác nhận và thanh toán</Text>
      </View>

      {/* Scrollable Content */}
      <ScrollView style={styles.scrollContent}>
        {/* Tour Info */}
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
            {/* <Text style={styles.tourDesc}>{tourSubName || tour.subName}</Text> */}
            <Text style={styles.rating}>⭐ 4.95/5 (648)</Text>
            <Text style={styles.price}>
              Từ
              <Text style={styles.bold}>
                {" "}
                {totalPrice.toLocaleString("vi-VN")}₫/
              </Text>Người
            </Text>
          </View>
        </View>

        {/* Cancellation Notice */}
        <Text style={styles.notice}>
          <Text style={styles.bold}>Hủy miễn phí</Text>
          {" trước 8 tháng 4. Được hoàn tiền đầy đủ nếu bạn thay đổi kế hoạch."}
        </Text>

        {/* Schedule Section */}
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

        {/* Contact Info */}
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

        {/* Requirements */}
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

        {/* Discount */}
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

        {/* Payment */}
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

        {/* Chính sách */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Chính sách</Text>
          <View style={styles.policyItem}>
            <Text style={styles.checkMark}>
              <AntDesign name="check" size={20} color="green" />
            </Text>
            <Text style={styles.policyText}>
              Khách sẽ thanh toán trước 30% tổng tiền tour, bằng hình thức
              vnpay.
            </Text>
          </View>
          <View style={styles.policyItem}>
            <Text style={styles.checkMark}>
              <AntDesign name="check" size={20} color="green" />
            </Text>
            <Text style={styles.policyText}>
              Khách không được hoàn lại số tiền đã thanh toán trước nếu hủy tour
              bất kỳ lúc nào.
            </Text>
          </View>
          <View style={styles.policyItem}>
            <Text style={styles.checkMark}>
              <AntDesign name="check" size={20} color="green" />
            </Text>
            <Text style={styles.policyText}>
              Khách có thể hủy đến 14 ngày trước khi tour khởi hành. Khách phải
              trả 50% tổng tiền thanh toán trước nếu hủy tour trong vòng 14 ngày
              trước khi tour khởi hành và phải trả 100% tổng tiền thanh toán
              trước nếu vắng mặt.
            </Text>
          </View>

          <View style={styles.checkboxContainer}>
            {renderCheckbox("", checkbox, () => setIsCheckbox(!checkbox))}
            <Text style={styles.checkboxText}>
              Bạn đồng ý rằng bạn đã đọc và hiểu{" "}
              <Text style={styles.Newlink}>Điều khoản sử dụng</Text> và{" "}
              <Text style={styles.Newlink}>Chính sách hoàn hủy</Text>
            </Text>
          </View>
          {!checkbox && (
            <Text
              style={{ color: "red", marginLeft: 20, marginTop: 5, fontSize: 13 }}
            >
              Vui lòng chọn vào nút đồng ý.
            </Text>
          )}
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <View style={styles.priceInfo}>
            <View style={styles.priceRow}>
              <Text style={styles.label}>Tổng cộng:</Text>
              <Text style={styles.totalAmount}>
                đ {totalPrice.toLocaleString("vi-VN")}
              </Text>
            </View>
            <View style={styles.prepayRow}>
              <Text style={styles.label}>Thanh toán trước 30%:</Text>
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

      {/* Modals */}
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