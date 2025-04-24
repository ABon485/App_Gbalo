// services/tour.ts
import api from "@/config/tourApi";
import { TourListResponse } from "@/types/tour";

const tourApi = {
  ListTour: async (page: number = 1, pageSize: number = 20): Promise<TourListResponse> => {
    try {
      const response = await api.get("/tour/featured", {
        params: { page, pageSize },
      });
      return response.data; // Trả về response.data
    } catch (error) {
      throw error;
    }
  },
};

export default tourApi;