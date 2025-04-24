export type TourItem = {
  id: string;
  title: string;
  image: [];
  rating: number;
  reviews: number;
  price: number;
  isFavorite: boolean;
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
    unitPriceId: number;
    namePrice: string;
    price: number;
    unitId: number;
  }[];
};
