export interface ProductImage {
    preview_image: string;
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
  
export interface Variant {
    varient_category: string;
    name: string;
  }
  
export interface VariantData {
    id: number;
    varient: Variant[];
    name: string | null;
    quantity: number;
    price: number;
    unit?:string;
    quantity_alert: number;
    manuf_date: string | null;
    exp_date: string | null;
    discount_type: string | null;
    discount_value: number | null;
    product: number;
  }
  
export interface Product {
    id: number;
    images: string;
    category: string;
    brand: string;
    subcategory: string;
    subsubcategory: string;
    createdby: string;
    profile: string | null;
    product_images: ProductImage[];
    single_product?: SingleProduct;
    varient_data?: VariantData[];
    product_name: string;
    slug: string;
    sku: string;
    description: string;
    store: number;
  }
  

export interface ProductVariantRow {
    id: number;
    images: string;
    category: string;
    brand: string;
    subcategory: string;
    subsubcategory: string;
    createdby: string;
    profile: string | null;
    product_images: ProductImage[];
    single_product?: SingleProduct;
    variants?: VariantData[];
    product_name: string;
    slug: string;
    sku: string;
    description: string;
    store: number;
  }
  
export interface ProductRow {
    id: number;
    product: JSX.Element;
    sku: string;
    category: string;
    brand: string;
    price: string;
    unit: string | null;
    qty: number;
    createdby: JSX.Element;
    action: JSX.Element;
  }
  