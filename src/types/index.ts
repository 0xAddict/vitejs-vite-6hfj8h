export type ProductCategory = 'Football' | 'Flag Football' | 'Basketball';

export type ProductType = 'Jersey' | 'Pants' | 'Shorts' | 'Jersey + Pants';

export type DetailType = 'Graphic' | 'Number' | 'Description';

export type NumberOption = '9"/10"' | '10"/12"';

export interface Detail {
  id: string;
  type: DetailType;
  x: number;
  y: number;
  content: string;
  dimensions?: { width: number; height: number };
  numberOption?: NumberOption;
}

export interface ViewDetails {
  front: Detail[];
  back: Detail[];
}

export interface OrderState {
  category: ProductCategory | null;
  productType: ProductType | null;
  frontImage: string | null;
  backImage: string | null;
  details: ViewDetails;
  step: number;
}