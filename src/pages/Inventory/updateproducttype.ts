export interface Category {
  id: number;
  category: string;
}

export interface SubCategory {
  id: number;
  category: number;
  subcategory: string;
}

export interface SubSubCategory {
  id: number;
  category: number;
  subcategory: number;
  subsubcategory: string;
}

export interface Brand {
  id: number;
  brand: string;
}

export interface ProductImage {
  id: number;
  preview_image: string;
}

export interface Variant {
  varient_category: string;
  name: string;
}

export interface VariantData {
  id: number;
  varient: Variant[];
  quantity: number;
  price: number;
  quantity_alert: number;
  manuf_date: string | null;
  exp_date: string | null;
  discount_type: string | null;
  discount_value: number | null;
  unit: string | null;
}

export interface SingleProduct {
  unit: string | null;
  quantity: number;
  price: number;
  tax_type: string;
  discount_type: string;
  discount_value: number;
  quantity_alert: number;
  manuf_date: string;
  exp_date: string;
}

export interface ProductData {
  id: number;
  category: Category;
  subcategory: SubCategory;
  subsubcategory: SubSubCategory;
  brand: Brand;
  images: string;
  product_images: ProductImage[];
  varient_data?: VariantData[];
  single_product?: SingleProduct;
  product_name: string;
  slug: string;
  sku: string;
  description: string;
}

export interface Data {
  brand: Brand[];
  categories: Category[];
  subcategories: SubCategory[];
  subsubcategories: SubSubCategory[];
  unit_choices: { unit: string }[];
  varient_category: { varient: string }[];
}