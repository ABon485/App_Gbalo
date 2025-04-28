// services/tour.ts
import api from "@/config/tourApi";
import { TourListResponse, TourDetail,searchTourType} from "@/types/tour";

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
TourDetail: async (id: number): Promise<TourDetail> => {
    try {
      const response = await api.get(`/tour/getbyid/?id=${id}`);
      return response.data.data;
    } catch (error) {
      throw error;
    }
  },
  
  

};

export default tourApi;