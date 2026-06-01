// models/Product.ts
export interface ProductVariant {
  id: string;
  title: string;
  prices: { amount: number; currency_code: string }[];
  inventory_quantity: number;
}

export interface MedusaProduct {
  id: string;
  title: string;
  description: string | null;
  handle: string;
  thumbnail: string | null;
  images: { url: string }[];
  variants: ProductVariant[];
  collection_id: string | null;
  status: 'published' | 'draft';
  tags: { value: string }[];
}