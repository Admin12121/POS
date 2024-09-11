import { useEffect, useState } from "react";
import "./style.scss"
import { useParams } from 'react-router-dom'
import { useProductsViewQuery } from "@/fetch_Api/service/user_Auth_Api"
import { useDashboardData } from '@/pages/dashboard/Dashboard';
import { Card, CardContent } from "@/components/ui/card"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"


interface ProductData {
    product_name: string;
    category: string;
    subcategory: string;
    subsubcategory: string;
    brand: string;
    unit: string;
    sku: string;
    quantity_alert: string;
    quantity: string;
    tax_type: string;
    discount_type: string;
    price: string;
    status: string;
    description: string;
    product_images: {
        preview_image: string;
    }[];
    varient_data?: VariantData[];
    single_product?: SingleProduct;
}

interface VariantData {
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

interface Variant {
    varient_category: string;
    name: string;
}

interface SingleProduct {
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

const Product_view = () => {
    const { id } = useParams();
    const { userData } = useDashboardData();
    const [storeCode, setStoreCode] = useState("");
    const { data } = useProductsViewQuery({ storeCode, id });
    const [product_data, setProductData] = useState<ProductData | null>(null);

    useEffect(() => {
        if (userData) {
            setStoreCode(userData.stor.code);
        }
    }, [userData]);

    useEffect(() => {
        if (data) {
            setProductData(data);
        }
    }, [data]);

    return (
        <>
            <div className="Product_view">
                <div className="header_">
                    <h1>Product Details</h1>
                    <p>Full details of a product</p>
                </div>
                <div className="product_over_view_">
                    <div className="details_">
                        <table>
                            <tbody>
                                <tr>
                                    <th>Product</th>
                                    <td>{product_data && product_data.product_name}</td>
                                </tr>
                                <tr>
                                    <th>Category</th>
                                    <td>{product_data && product_data.category}</td>
                                </tr>
                                <tr>
                                    <th>Sub Category</th>
                                    <td>{product_data && product_data.subcategory}</td>
                                </tr>
                                <tr>
                                    <th>Sub Sub Category</th>
                                    <td>{product_data && product_data.subsubcategory}</td>
                                </tr>
                                <tr>
                                    <th>Brand</th>
                                    <td>{product_data && product_data.brand}</td>
                                </tr>
                                <tr>
                                    <th>SKU</th>
                                    <td>{product_data && product_data.sku}</td>
                                </tr>
                            </tbody>
                        </table>
                                        {product_data?.varient_data && (
                                            <table>
                                                <thead>
                                                    <tr>
                                                        <th>Variant Category</th>
                                                        <th>Variant Name</th>
                                                        <th>Quantity</th>
                                                        <th>Price</th>
                                                        <th>Quantity Alert</th>
                                                        <th>Manufacture Date</th>
                                                        <th>Expiry Date</th>
                                                        <th>Discount Type</th>
                                                        <th>Discount Value</th>
                                                        <th>Unit</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {product_data.varient_data.map((variant, index) => (
                                                        <tr key={index}>
                                                            <td>{variant.varient.map(v => v.varient_category).join(', ')}</td>
                                                            <td>{variant.varient.map(v => v.name).join(', ')}</td>
                                                            <td>{variant.quantity}</td>
                                                            <td>{variant.price}</td>
                                                            <td>{variant.quantity_alert}</td>
                                                            <td>{variant.manuf_date}</td>
                                                            <td>{variant.exp_date}</td>
                                                            <td>{variant.discount_type}</td>
                                                            <td>{variant.discount_value}</td>
                                                            <td>{variant.unit}</td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        )}
                                        {product_data?.single_product && (
                                            <table>
                                                <tbody>
                                                    <tr>
                                                        <th>Unit</th>
                                                        <td>{product_data.single_product.unit}</td>
                                                    </tr>
                                                    <tr>
                                                        <th>Quantity</th>
                                                        <td>{product_data.single_product.quantity}</td>
                                                    </tr>
                                                    <tr>
                                                        <th>Price</th>
                                                        <td>{product_data.single_product.price}</td>
                                                    </tr>
                                                    <tr>
                                                        <th>Tax Type</th>
                                                        <td>{product_data.single_product.tax_type}</td>
                                                    </tr>
                                                    <tr>
                                                        <th>Discount Type</th>
                                                        <td>{product_data.single_product.discount_type}</td>
                                                    </tr>
                                                    <tr>
                                                        <th>Discount Value</th>
                                                        <td>{product_data.single_product.discount_value}</td>
                                                    </tr>
                                                    <tr>
                                                        <th>Quantity Alert</th>
                                                        <td>{product_data.single_product.quantity_alert}</td>
                                                    </tr>
                                                    <tr>
                                                        <th>Manufacture Date</th>
                                                        <td>{product_data.single_product.manuf_date}</td>
                                                    </tr>
                                                    <tr>
                                                        <th>Expiry Date</th>
                                                        <td>{product_data.single_product.exp_date}</td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                        )}
                    </div>
                    <div className="image_">
                        {/* <Swiper
                            effect={'cards'}
                            grabCursor={true}
                            loop={true}
                            modules={[EffectCards]}
                            className="mySwiper"
                        >
                            {product_data && product_data.product_images.map(({ preview_image }, index) => (
                                <SwiperSlide key={index}><img src={preview_image} alt="" /></SwiperSlide>
                            ))}
                        </Swiper> */}
                            <Carousel className="w-full max-w-xs">
                            <CarouselContent>
                                {product_data && product_data.product_images.map(({ preview_image }, index) => (
                                    <CarouselItem key={index}>
                                    <div className="p-1">
                                    <Card>
                                        <CardContent className="flex aspect-square items-center justify-center p-6 h-[300px]">
                                         <img src={preview_image} alt="" className="object-contain w-full h-full"/>
                                        </CardContent>
                                    </Card>
                                    </div>
                                </CarouselItem>
                                ))}                                
                            </CarouselContent>
                            <CarouselPrevious className="absolute top-1/2 left-0 transform -translate-y-1/2 border-0 shadow-none" />
                            <CarouselNext className="absolute top-1/2 right-0 transform -translate-y-1/2 border-0 shadow-none" />
                            </Carousel>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Product_view