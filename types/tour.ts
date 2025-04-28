
export type TourItem = {
  id: string; 
  name: string;
  slug: string;
  featuredImageUrl: string; 
  provinceId: number;
  vote: number;
  fromPrice: number;
  isFavorite: boolean;
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
export type GuestQuantity = {
  guestTypeId: number;
  quantity: number;
}

export type searchTourType = {
  fromPrice: number;
  toPrice: number;
  provinceIds: number[];
  groupIds: number[];
  durations: string[];
  guestQuantitys: GuestQuantity[];
  page: number;
  pageSize: number;
}
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
    }[];
  };
  
  export type TourDetailResponse = {
    data: TourDetail;
  };
  
  
