import { apiTour, api } from "@/config/tourApi";
import { TourListResponse, TourDetail, searchTourType, ProvinceType, PaginationInfo, TourItem } from "@/types/tour";

const tourApi = {
  ListTour: async (page: number = 1, pageSize: number = 20): Promise<TourListResponse> => {
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
      const response = await apiTour.post("/tour/search", formData);
      return response.data; 
    } catch (error) {
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
};

export default tourApi;
