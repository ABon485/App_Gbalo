import { apiTour, api } from "@/config/tourApi";
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
  UserProfile,
  UserProfileResponse



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
      console.log("Raw API response:", response);
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
  deleteFavorite: async (userId: number, tourId: number): Promise<FavoriteTour> => {
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
  getUserProfile: async (): Promise<UserProfile> => {
    try {
      const response = await api.get<UserProfileResponse>("/Accounts/Profile");
      return response.data.data;
    } catch (error) {
      console.error("Error fetching user profile:", error);
      throw error;
    }
  },
};

export default tourApi;
