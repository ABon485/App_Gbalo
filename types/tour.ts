// types/tour.ts
export type TourItem = {
  id: string; // Chuyển đổi từ number sang string
  name: string;
  slug: string;
  featuredImageUrl: string; // API trả về null, sẽ xử lý trong code
  provinceId: number;
  vote: number;
  fromPrice: number;
  isFavorite: boolean; // Thêm trường isFavorite
};

// Type cho thông tin phân trang
export type PaginationInfo<T> = {
  datas: T[];
  page: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
};

// Type cho API response
export type TourListResponse = {
  status: string;
  data: PaginationInfo<TourItem>;
};
export type TourExtraService = {
  id: number;
  name: string;
};

export type TourPrice = {
  id: number;
  unitPriceId: number;
  namePrice: string;
  price: number;
  unitId: number;
};

export type TourDetail = {
  id: number;
  name: string;
  slug: string;
  subName: string;
  duration: string;
  description: string;
  included: string;
  schedule: string;
  policies: string;
  rules: string;
  fromPrice: number;
  tourExtraServices: {
    id: number;
    name: string;
  }[];
  tourPrices: {
    id: number;
    guestTypeId: number;
    guestType: string;
    age: string;
    price: number;
    unitId: number;
  }[];
};

export type TourDetailResponse = {
  data: TourDetail;
};
