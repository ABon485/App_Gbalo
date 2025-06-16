import { apiTour, api, apiVNPay } from "@/config/tourApi";
import {
  TourListResponse,
  TourDetail,
  searchTourType,
  ProvinceType,
  guestType,
  PaginationInfo,
  TourItem,
  FavoriteTour,
  FavoriteTourAPIResponse,
  Booking,
  BookingResponse,
  Policy,
  PaymentData,
  PaymentResponse,
  PaymentInfoResponse,
  BookingListResponse,
  ApiResponse,
  RatingListParams,
  ReviewListResponse,
  ReviewDetailResponse,
  Review,
  LanguageResponse,
  UpdateCountry,
  BookingServiceRequest,
  CartItem,
  GetCartResponse,
} from "@/types/tour";

const tourApi = {
  ListTour: async (
    page: number = 1,
    pageSize: number = 20
  ): Promise<TourListResponse> => {
    try {
      const response = await apiTour.get("/tour/featured", {
        params: { page, pageSize },
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  searchTour: async (formData: searchTourType): Promise<TourListResponse> => {
    try {
      console.log("Gửi yêu cầu searchTour:", JSON.stringify(formData, null, 2));
      const response = await apiTour.post("/tour/search", formData);
      console.log(
        "Phản hồi searchTour:",
        JSON.stringify(response.data, null, 2)
      );
      return response.data;
    } catch (error) {
      console.error("Lỗi trong searchTour:", error);
      throw error;
    }
  },

  TourDetail: async (id: number): Promise<TourDetail> => {
    try {
      const response = await apiTour.get(`/tour/getbyid/?id=${id}`);
      return response.data.data;
    } catch (error) {
      throw error;
    }
  },

  getProvince: (): Promise<ProvinceType[]> =>
    api.get("/province").then((response) => {
      // console.log("Raw API response:", response);
      const data = response.data?.data;
      if (!Array.isArray(data)) {
        throw new Error("API response data is not an array");
      }
      return data;
    }),
  GuestType: async (): Promise<guestType> => {
    try {
      const response = await apiTour.get(`/tour/guesttype`);
      const data = response.data.data;
      if (!Array.isArray(data)) {
        throw new Error("Guest type response is not an array");
      }
      return { data };
    } catch (error) {
      console.error("Error fetching guest types:", error);
      throw error;
    }
  },
  getTourGroups: async (): Promise<{ id: number; name: string }[]> => {
    try {
      const response = await apiTour.get("/tour/group");
      const data = response.data?.data;
      if (!Array.isArray(data)) {
        throw new Error("Tour group response is not an array");
      }
      return data;
    } catch (error) {
      console.error("Error fetching tour groups:", error);
      throw error;
    }
  },
  getProvinceDestination: async (
    type: "prov" | "dest"
  ): Promise<{ id: string; name: string; type: string }[]> => {
    try {
      const response = await api.get("/province_destination", {
        params: { type },
      });
      const data = response.data?.data;

      if (!Array.isArray(data)) {
        throw new Error("province_destination response is not an array");
      }

      return data;
    } catch (error) {
      console.error("Error fetching province destinations:", error);
      throw error;
    }
  },
  Rating: async (id: number) => {
    try {
      const response = await apiTour.get(`/rating`);
      return response.data.data;
    } catch (error) {
      throw error;
    }
  },
  // Thêm param đầu vào cho userId và tourId

  postFavorite: async (
    userId: number,
    tourId: number
  ): Promise<FavoriteTour> => {
    try {
      const response = await apiTour.post("/tour/favorite/create", {
        userId,
        tourId,
      });
      const data: FavoriteTour = response.data.data;
      return data;
    } catch (error) {
      console.error("Error posting favorite tour:", error);
      throw error;
    }
  },
  deleteFavorite: async (
    userId: number,
    tourId: number
  ): Promise<FavoriteTour> => {
    try {
      const response = await apiTour.post("/tour/favorite/delete", {
        userId,
        tourId,
      });
      const data: FavoriteTour = response.data.data;
      return data;
    } catch (error) {
      console.error("Error deleting favorite tour:", error);
      throw error;
    }
  },

  getFavorite: async (userId: number): Promise<FavoriteTourAPIResponse> => {
    try {
      const response = await apiTour.get("/tour/favorite", {
        params: { userId },
      });
      return response.data;
    } catch (error) {
      console.error("Error getting favorite tours:", error);
      throw error;
    }
  },
  createBooking: async (bookingData: Booking): Promise<any> => {
    try {
      const response = await api.post("/booking/tour/create", bookingData);
      return response.data;
    } catch (error) {
      console.error("Lỗi khi tạo booking:", error);
      throw error;
    }
  },
  getBookingById: async (
    id: number,
    customerId: number
  ): Promise<BookingResponse> => {
    try {
      const response = await api.get(
        `/booking/getbyid?id=${id}&customerId=${customerId}`
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  getPolicy: async (tourId: number, departureDate: string): Promise<Policy> => {
    try {
      const response = await api.get(`/tour/getpolicy`, {
        params: {
          tourId,
          departureDate,
        },
      });
      // console.log("Response API getPolicy:", response);
      return response.data;
    } catch (error) {
      console.error("Lỗi khi gọi API getPolicy:", error);
      throw error;
    }
  },
  getBooking: async (
    customerId: number,
    page: number,
    pageSize: number
  ): Promise<BookingListResponse> => {
    try {
      const response = await api.get(`/booking/bookings`, {
        params: {
          CustomerId: customerId,
          Page: page,
          PageSize: pageSize,
        },
      });
      return response.data;
    } catch (error) {
      console.error("Lỗi khi gọi API getBookings:", error);
      throw error;
    }
  },

  approveTourRating: async (): Promise<void> => {
    try {
      await api.get(`/rating/tour/approved`);
    } catch (error) {
      console.error("Lỗi khi gửi đánh giá tour:", error);
      throw error;
    }
  },
  // Lấy danh sách đánh giá
  getRatingList: async (
    params: RatingListParams
  ): Promise<ReviewListResponse> => {
    try {
      const response = await api.get("/rating", {
        params: {
          UserId: params.userId,
          Page: params.page,
          PageSize: params.pageSize,
        },
      });
      return response.data;
    } catch (error) {
      console.error("Lỗi khi gọi API getRatingList:", error);
      throw error;
    }
  },

  // Xem chi tiết đánh giá
  getRatingById: async (id: number): Promise<ReviewDetailResponse> => {
    try {
      const response = await api.get(`/rating/getbyid?id=${id}`);
      return response.data;
    } catch (error) {
      console.error("Lỗi khi gọi API getRatingById:", error);
      throw error;
    }
  },

  // Tạo đánh giá mới
  createRating: async (review: Review): Promise<ApiResponse<Review>> => {
    try {
      const response = await api.post("/rating/create", review);
      return response.data;
    } catch (error) {
      console.error("Lỗi khi gọi API createRating:", error);
      throw error;
    }
  },

  postPayment: async (paymentData: PaymentData): Promise<PaymentResponse> => {
    try {
      const response = await apiVNPay.post(`/vnpay/create-link`, null, {
        params: {
          Amount: paymentData.Amount,
          ClientIp: paymentData.ClientIp,
          OrderInfo: paymentData.OrderInfo,
          OrderType: paymentData.OrderType,
          ReturnUrl: paymentData.ReturnUrl,
          ExpireDate: paymentData.ExpireDate,
        },
        headers: {
          Accept: "text/plain",
        },
      });
      return response.data;
    } catch (error) {
      console.error("Lỗi khi gọi API postPayment:", error);
      throw error;
    }
  },
  getPaymentResult: async (bookingId: string): Promise<any> => {
    try {
      const response = await apiVNPay.get(`/VnPayResult`, {
        params: { bookingId },
      });
      return response.data;
    } catch (error) {
      console.error("Lỗi khi gọi API getPaymentResult:", error);
      throw error;
    }
  },

  getPaymentInfo: async (paymentId: number): Promise<PaymentInfoResponse> => {
    try {
      const response = await apiVNPay.get(`/payment/${paymentId}`, {
        headers: {
          Accept: "application/json",
        },
      });
      return response.data;
    } catch (error) {
      console.error("Lỗi khi gọi API getPaymentInfo:", error);
      throw error;
    }
  },

  getLanguage: async (): Promise<LanguageResponse> => {
    try {
      const response = await api.get("/common/language");
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  getCountries: async (): Promise<UpdateCountry[]> => {
    try {
      const response = await api.get("/common/country");
      return response.data.data;
    } catch (error) {
      console.error("Lỗi khi lấy danh sách quốc gia:", error);
      throw error;
    }
  },

  AddToCart: async (payload: BookingServiceRequest) => {
    try {
      const response = await api.post<{ data: BookingServiceRequest[] }>(
        "/cart/tour/add",
        payload
      );
      return response.data.data;
    } catch (error) {
      console.error("Lỗi khi thêm vào giỏ hàng:", error);
      throw error;
    }
  },

  GetCart: async (customerId: number): Promise<CartItem[]> => {
    try {
      const response = await api.get<GetCartResponse>(
        `/cart?customerId=${customerId}`
      );
      const result = response.data?.data?.datas;

      console.log(
        "Phản hồi API GetCart:",
        JSON.stringify(response.data, null, 2)
      );

      if (!result) {
        console.warn("Dữ liệu giỏ hàng không tồn tại hoặc rỗng:", result);
        return [];
      }

      if (!Array.isArray(result)) {
        console.warn(
          "API trả về không phải mảng:",
          JSON.stringify(result, null, 2)
        );
        return [];
      }

      const cartItems: CartItem[] = result.map((item) => ({
        id: item.id,
        tourId: item.serviceId,
        tourName: item.serviceName || "Tên tour không có",
        quantity: item.services[0]?.quantity || 1,
        price: item.price || 0,
        imageUrl: item.serviceImageUrl || "https://via.placeholder.com/75",
        departureDate: item.departureDate,
        selected: item.selected ?? false,
        province: item.provinceName || "Không có tỉnh",
        rating: item.rating ?? 0, 
      }));

      return cartItems;
    } catch (error) {
      console.error("Lỗi khi lấy giỏ hàng:", error);
      return [];
    }
  },

  GetShareTour: async (tourId: number): Promise<TourDetail> => {
    try {
      const response = await api.get(`/tour/share?id=${tourId}`);
      return response.data.data;
    } catch (error) {
      throw error;
    }
  }
  
};

export default tourApi;
