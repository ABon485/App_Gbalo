export type ProvinceType = {
  id: string;
  name: string;
  image?: string;
  description?: string;
};

export type TourItem = {
  id: string;
  name: string;
  slug: string;
  featuredImageUrl: string;
  vote: number;
  fromPrice: number;
  isFavorite: boolean;
  provinceIds: number[];
};

export type PaginationInfo<T> = {
  datas: T[];
  page: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
};

export type TourListResponse = {
  status: string;
  data: PaginationInfo<TourItem>;
};

export type TourExtraService = {
  id: number;
  name: string;
};

export type searchTourType = {
  fromPrice: number;
  toPrice: number;
  provinceIds: number[];
  groupIds: number[];
  durations: string[];
  guestQuantitys: {
    guestTypeId: number;
    quantity: number;
  }[]; 
  page: number;
  pageSize: number;
};

export type GuestQuantity = {
  guestTypeId: number;
  quantity: number;
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
