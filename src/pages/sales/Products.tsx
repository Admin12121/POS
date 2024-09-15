import { useState, useEffect, useRef } from 'react';
import { usePosProductsViewQuery } from "@/fetch_Api/service/user_Auth_Api";
import { toast } from 'sonner';

interface Product {
  id: number;
  images: string | null;
  category: string;
  brand: string;
  subcategory: string;
  subsubcategory: string;
  createdby: string;
  profile: string | null;
  product_images: ProductImage[];
  single_product?: SingleProduct; 
  varient_data?: Variant[]; 
  product_name: string;
  slug: string;
  sku: string;
  description: string;
  store: number;
}

interface ProductImage {
  preview_image: string;
}

interface SingleProduct {
  unit: string | null;
  quantity: number;
  price: number;
  tax_type: string;
  discount_type: string | null;
  discount_value: number | null;
  quantity_alert: number;
  manuf_date: string | null;
  exp_date: string | null;
}

interface Variant {
  id: number;
  varient: VariantDetail[];
  name: string | null;
  quantity: number;
  price: number;
  quantity_alert: number;
  manuf_date: string | null;
  exp_date: string | null;
  discount_type: string | null;
  discount_value: number | null;
  product: number;
}

interface VariantDetail {
  varient_category: string;
  name: string;
}

const Products = ({ category, selectedItems, setSelectedItems, storeCode }:{category:string, selectedItems:any, setSelectedItems:any, storeCode:string}) => {

  const [page, _setPage] = useState<number>(1);
  const [search, _setSearch] = useState<string>("");
  const [pageSize, _setPageSize] = useState<number>(10);
  const { data, refetch } = usePosProductsViewQuery({ storeCode, category, page, search, pageSize},{skip: !storeCode});
  const [storeData, setStoreData] = useState<Product []>();
  const [buttonStates, setButtonStates] = useState<boolean[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<number | null>(null);

  useEffect(() => {
    if (category) {
      refetch();
    }
  }, [category]);

  useEffect(() => {
    if (data) {
      setStoreData(data.results);
    }
  }, [data, category]);

  useEffect(() => {
    if (Array.isArray(storeData) && storeData.length > 0) {
      const newButtonStates = storeData.map(item => selectedItems.some((selectedItem:any) => selectedItem.id === item.id));
      setButtonStates(newButtonStates);
    }
  }, [selectedItems, storeData]);

  const toggleButtonState = ({ productId, variantId }: { productId: number; variantId?: number }) => {
    const selectedIndex = selectedItems.findIndex((item: any) => item.id === productId && (!variantId || item.variant?.id === variantId));
    if (selectedIndex !== -1) {
      setSelectedItems((prevItems: any) => prevItems.filter((item: any) => !(item.id === productId && (!variantId || item.variant?.id === variantId))));
    } else {
      const product = storeData?.find(item => item.id === productId);
      if (product) {
        const newItem = variantId 
          ? { ...product, variant: product.varient_data?.find(variant => variant.id === variantId) }
          : { ...product };
        setSelectedItems((prevItems: any) => [...prevItems, newItem]);
      }
    }
    const newButtonStates = [...buttonStates];
    const index = storeData ? storeData.findIndex(item => item.id === productId) : -1;
    if (index !== -1) {
      newButtonStates[index] = !newButtonStates[index];
      setButtonStates(newButtonStates);
    }
  };

  const getTotalQuantity = (product:Product) => {
    if (product.varient_data && product.varient_data.length > 0) {
      return product.varient_data.reduce((sum, variant) => sum + variant.quantity, 0);
    }
    return product.single_product?.quantity || 0;
  };

  return (
    <>
      <div className='main_wrapper_'>
        <h1>Products</h1>
        <div className="products_wrapper">
          {storeData && storeData.map((product:Product, index:number) => (
            <div key={product.id} className="products" onClick={() => {
              if (getTotalQuantity(product) > 0) {
                if (product?.varient_data && product.varient_data.length > 0) {
                  setSelectedProduct(product.id);
                } else {
                  toggleButtonState({ productId: product.id });
                }
              } else {
                toast.warning("Out of Stock", {
                  action: {
                    label: 'X',
                    onClick: () => toast.dismiss(),
                  },
                });
              }
            }} style={{ border: `${buttonStates[index] ? "1px solid var(--primary-color)" : ""}` }}>
              <div className="image_wrapper">
                {buttonStates[index] && (
                  <span className='selected'>
                    <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-check feather-16"><polyline points="20 6 9 17 4 12"></polyline></svg>
                  </span>
                )}
                <img src={product.images!} alt={product.product_name} />
              </div>
              <div className="text_wrapper">
                <div className="product_desc">
                  <p>{product.category}</p>
                  <h1>{product.product_name}</h1>
                </div>
                <div className="product_price_dec">
                  <p style={{ color: `${getTotalQuantity(product) > 0 ? `${getTotalQuantity(product) > 5 ? "green" : "orange"}` : 'red'}` }}>
                    {`${getTotalQuantity(product) > 0 ? `${getTotalQuantity(product)} Pcs` : "Out of Stock"}`}
                  </p>
                  <p>रू{product?.single_product ? product.single_product?.price : product.varient_data?.[0]?.price}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      {selectedProduct && storeData && <div className="varient_product">
        {selectedProduct && <ProductVarient product={storeData.find(p => p.id === selectedProduct)} setSelectedProduct={setSelectedProduct} toggleButtonState={toggleButtonState} />}
      </div>}
    </>
  );
}

const ProductVarient = ({ product, setSelectedProduct, toggleButtonState }: { product: any, setSelectedProduct: any, toggleButtonState: any }) => {
  const varientRef = useRef<HTMLDivElement>(null);
  const [quantity, setQuantity] = useState<number>(1);
  const [selectedVariants, setSelectedVariants] = useState<Record<string, any>>({});
  const [availableCombinations, setAvailableCombinations] = useState<Record<string, any>>({});
  const [price, setPrice] = useState<number | null>(null);
  const [availableQuantity, setAvailableQuantity] = useState<number | null>(null);

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    const combinations: Record<string, string[]> = {};
    product.varient_data.forEach((variant: any) => {
      variant.varient.forEach(({ varient_category, name }: { varient_category: string, name: string }) => {
        if (!combinations[varient_category]) {
          combinations[varient_category] = [];
        }
        if (!combinations[varient_category].includes(name)) {
          combinations[varient_category].push(name);
        }
      });
    });
    setAvailableCombinations(combinations);
  }, [product]);

  const handleClickOutside = (event: any) => {
    if (varientRef.current && !varientRef.current.contains(event.target)) {
      setSelectedProduct(null);
    }
  };

  const handleVariantChange = (category: string, name: string) => {
    setSelectedVariants(prev => {
      if (prev[category] === name) {
        const { [category]: removed, ...rest } = prev;
        return rest;
      } else {
        return { ...prev, [category]: name };
      }
    });
  };

  useEffect(() => {
    const selectedKeys = Object.keys(selectedVariants);
    if (selectedKeys.length === Object.keys(availableCombinations).length) {
      const selectedVariant = product.varient_data.find((variant: any) => {
        return selectedKeys.every(key => {
          const varient = variant.varient.find((v: any) => v.varient_category === key);
          return varient && varient.name === selectedVariants[key];
        });
      });

      if (selectedVariant) {
        setPrice(selectedVariant.price);
        setAvailableQuantity(selectedVariant.quantity || 0);
        if (selectedVariant.quantity > 0) {
          setQuantity(Math.min(quantity, selectedVariant.quantity));
        } else {
          setQuantity(0);
        }
      } else {
        setPrice(null);
        setAvailableQuantity(null);
        setQuantity(1);
      }
    } else {
      setPrice(null);
      setAvailableQuantity(null);
      setQuantity(1);
    }
  }, [selectedVariants, availableCombinations, product, quantity]);

  const handleAddToCart = () => {
    const selectedVariant = product.varient_data.find((variant: any) => {
      return Object.keys(selectedVariants).every(key => {
        const varient = variant.varient.find((v: any) => v.varient_category === key);
        return varient && varient.name === selectedVariants[key];
      });
    });

    if (selectedVariant && selectedVariant.quantity > 0) {
      toggleButtonState({ productId: product.id, variantId: selectedVariant.id });
      setSelectedProduct(null);
    } else {
      toast.warning("Please select all variants first", {
        action: {
          label: 'X',
          onClick: () => toast.dismiss(),
        },
      });
    }
  };

  const isVariantDisabled = (category: string, option: string) => {
    const tempSelectedVariants = { ...selectedVariants, [category]: option };
    const selectedKeys = Object.keys(tempSelectedVariants);
    if (selectedKeys.length === Object.keys(availableCombinations).length) {
      const selectedVariant = product.varient_data.find((variant: any) => {
        return selectedKeys.every(key => {
          const varient = variant.varient.find((v: any) => v.varient_category === key);
          return varient && varient.name === tempSelectedVariants[key];
        });
      });
      return !selectedVariant || selectedVariant.quantity === 0;
    }
    return false;
  };

  return (
    <div className="App" ref={varientRef}>
      <div className="modal">
        <img
          src={product.images}
          alt={product.product_name}
          className="modal-image"
        />
        <div className="modal-content">
          <h2>{product.product_name}</h2>
          <h3>रू {price ? price : 'Select variant'} {availableQuantity !== null && `(${availableQuantity} available)`}</h3>
          <br />
          {Object.keys(availableCombinations).map((category, index) => (
            <div key={index} className="variant-options">
              <h4>{category}</h4>
              {availableCombinations[category].map((option: any, idx: any) => (
                <button
                  key={idx}
                  onClick={() => handleVariantChange(category, option)}
                  className={`variant-button ${selectedVariants[category] === option ? 'selected' : ''}`}
                  disabled={isVariantDisabled(category, option)}
                >
                  {option}
                </button>
              ))}
            </div>
          ))}
          <button className="add-to-cart" onClick={handleAddToCart} disabled={Object.keys(selectedVariants).length !== Object.keys(availableCombinations).length || availableQuantity === 0}>Add to Cart</button>
        </div>
      </div>
    </div>
  );
};
export default Products;