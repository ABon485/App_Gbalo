
export type TourItem = {
  // id: number;
  // name: string;
  // slug: string;
  // featuredImageUrl: string;
  // provinceId: number;
  // vote: number;
  // fromPrice: number;
  id: string
  title: string
  image: []
  rating: number
  reviews: number
  price: number
  isFavorite: boolean
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
    tourExtraServices: TourExtraService[];
    tourPrices: TourPrice[];
  };
  
  export type TourDetailResponse = {
    data: TourDetail;
  };
  