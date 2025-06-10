export type ProvinceType = {
  type: string;
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
  provinceIds: number;
  provinceName: string;
  ratingCount:number;
  tourExtraServices: TourExtraService[];
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
export type groupType = {
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
  featuredImageUrl: string;
  duration: string;
  description: string;
  metaDescription: string;
  included: string;
  schedule: string;
  policies: string;
  rules: string;
  fromPrice: number;
  isFavorite: boolean;
  provinceId: number;
  provinceName: string;
  regionId: number;
  countryId: number;
  tourGroupIds: number[];
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
    unitName: string;
  }[];
};

export type TourDetailResponse = {
  data: TourDetail;
};

export type guestType = {
  data: Array<{
    id: number;
    guestType: string;
    age: string;
  }>;
};
export type TourGroupType = {
  id: number;
  name: string;
};
export type FavoriteTour = {
  userId: number;
  tourId: number;
};
export interface FavoriteTourAPIResponse {
  data: {
    datas: {
      id: number;
      name: string;
      slug: string;
      featuredImageUrl: string;
      provinceId: number;
      provinceName: string | null;
      vote: number | null;
      fromPrice: number;
      isFavorite: boolean;
      tourExtraServices: any[];
    }[];
    page: number;
    pageSize: number;
    totalCount: number;
    totalPages: number;
    count: number;
  };
  status: string;
}
export type Order = {
  id: string;
  title: string;
  date: string;
  status: "pending" | "paid" | "completed";
  price: string;
  image: string;
  countdown?: string;
}
export type TabType = 'all' | 'pending' | 'paid' | 'completed';


// types/booking.ts

export type Booking = {
  CustomerId: number;
  departureDate: string;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  customerAddress: string;
  note: string;
  services: {
    serviceId: number;
    serviceName: string;
    details: {
      serviceDetailId: number;
      quantity: number;
      price: number;
    }[];
  }[];
  payments: Payment[];
}


export type Payment = {
  paymentDate: string;
  paymentMethodId: number;
  bankCode: string;
  paymentAmount: number;
  paymentAmountByCurrency: number;
  currencyType: string;
  currencyRate: number;
  note: string;
  isDeposit: boolean;
  isDepositPaid: boolean;
}
export type BookingResponse = {
  fullName: any;
  bookingStatus: number;
  bookingCode: string;
  id: number;
  departureDate: string;
  data: BookingData;
  status: string;
}

export type BookingData = {
  id: number;
  departureDate: string; // ISO date-time string (e.g., "2025-05-30T00:00:00")
  bookingCode: string;
  bookingStatus: number;
  bookingStatusName: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  customerAddress: string;
  note: string;
  totalAmount: number;
  pendingAmount: number;
  pendingPaymentCreated: string; // ISO date-time string
  amountPaid: number;
  amountRemaining: number;
  services: {
    imageUrl: string;
    serviceId: number;
    serviceName: string;
    serviceImageUrl: string | null;
    price: number;
    details: {
      serviceDetailId: number;
      serviceDetaiName: string;
      quantity: number;
      price: number;
      description: string;
    }[];
  }[];

}

export type Policy = {
  policies: string[];
  paymentMethod: string;
  depositPercent: number;
  cancelPercent: number;
};
export type BookingItem = {
  id: number;
  bookingCode: string;
  bookingStatus: number;
  bookingStatusName: string;
  departureDate: string; // ISO string format
  serviceName: string;
  serviceImageUrl: string | null;
  totalAmount: number;
  pendingAmount: number;
  pendingPaymentCreated: string; // ISO string format
  amountPaid: number;
  amountRemaining: number;
  serviceType: number;
}

export type BookingListResponse = {
  data: {
    datas: BookingItem[];
  };
}
export type ApiResponse<T> = {
  data: {
    id: any;
    datas: T[];
    page: number;
    pageSize: number;
    totalCount: number;
    totalPages: number;
    count: number;
  };
  status: string;
}
export type Review = {
  id?: number;
  createdAt: string | number | Date;
  userId: number;
  star: number;
  serviceId: number;
  serviceName: string;
  comment: string;
  imageUrls: string[];
  serviceType: 1 | 2 | 3 | 4; // 1: Tour, 2: Khách sạn, 3: Xe, 4: Vé tham quan
};

export type ReviewListResponse = {
  data: Review[];
  pagination: PaginationInfo<Review>;
};

export type ReviewDetailResponse = {
  data: Review;
};

export type RatingListParams = {
  userId: number;
  page: number;
  pageSize: number;
};

