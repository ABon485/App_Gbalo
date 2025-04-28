// services/tour.ts
import api from "@/config/tourApi";
import { TourListResponse,searchTourType } from "@/types/tour";

const tourApi = {
  ListTour: async (page: number = 1, pageSize: number = 20): Promise<TourListResponse> => {
    try {
      const response = await api.get("/tour/featured", {
        params: { page, pageSize },
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  searchTour: (formData: searchTourType): Promise<TourListResponse> =>
    api.post("/tour/search", formData, {
    }),
};

export default tourApi;