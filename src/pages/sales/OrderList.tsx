import { useState, useEffect } from 'react';
import { useCustomerViewQuery, useProductsViewQuery, useDueCheckerMutation } from "@/fetch_Api/service/user_Auth_Api";
import { toast } from 'sonner';
import { AiOutlineUserAdd } from "react-icons/ai";
import { TbBrandDatabricks } from "react-icons/tb";
interface OrderListProps {
    billUserdetails: any;
    add: any;
    setAdd: any;
    setBillUserdetails: any;
    selectedItems: any;
    setSelectedItems: any;
    storeCode: any;
    pcs: any;
    setPcs: any;
}

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
    variant?: Variant;
    product_name: string;
    slug: string;
    sku: string;
    description: string;
    store: number;
}

interface ProductView {
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

const OrderList: React.FC<OrderListProps> = ({ add, setAdd, setBillUserdetails, selectedItems, setSelectedItems, storeCode, pcs, setPcs }) => {
    const [custo, setCusto] = useState(false);
    const [custoo, setCustoo] = useState(false);
    const [transactionID, setTransactionID] = useState('');
    const [user, setUser] = useState();

    useEffect(() => {
        generateRandomID();
    }, []);

    useEffect(() => {
        const userData = {
            user: user,
            transactionID: transactionID
        };
        setBillUserdetails(userData);
    }, [user, transactionID]);

    const generateRandomID = () => {
        const randomID = '#' + Math.floor(Math.random() * 900000 + 100000) + Date.now();
        const truncatedID = randomID.slice(0, 10);
        setTransactionID(truncatedID);
    };

    useEffect(() => {
        const initialPcsState: { [key: string]: number } = {};
        selectedItems.forEach((item: { id: number, variant?: Variant }) => {
            const key = item.variant ? `${item.id}-${item.variant.id}` : `${item.id}`;
            initialPcsState[key] = 1;
        });
        setPcs(initialPcsState);
    }, [selectedItems]);

    const handleDecrease = (productId: number, variantId?: number) => {
        const key = variantId ? `${productId}-${variantId}` : `${productId}`;
        if (pcs[key] > 1) {
            setPcs((prevPcs: any) => ({
                ...prevPcs,
                [key]: prevPcs[key] - 1
            }));
        }
    };

    const handleIncrease = (productId: number, variantId?: number) => {
        const key = variantId ? `${productId}-${variantId}` : `${productId}`;
        const product = selectedItems.find((item: any) => item.id === productId && (!variantId || item.variant?.id === variantId));
        const maxQuantity = product.single_product ? product.single_product.quantity : product.variant?.quantity;

        if (pcs[key] < maxQuantity) {
            setPcs((prevPcs: any) => ({
                ...prevPcs,
                [key]: (prevPcs[key] || 0) + 1
            }));
        } else {
            toast.warning("Out of stock", {
                action: {
                    label: 'X',
                    onClick: () => toast.dismiss(),
                },
            });
        }
    };

    const handleDelete = (productId: number, variantId?: number) => {
        setSelectedItems((prevItems: any) => prevItems.filter((item: any) => !(item.id === productId && (!variantId || item.variant?.id === variantId))));
    };

    const handleDeleteAll = () => {
        setSelectedItems([]);
    };

    useEffect(() => {
        if (selectedItems.length > 0) {
            const updatedPcs = { ...pcs };
            selectedItems.forEach((item: any) => {
                const key = item.variant ? `${item.id}-${item.variant.id}` : `${item.id}`;
                if (!(key in updatedPcs)) {
                    updatedPcs[key] = 1;
                }
            });
            setPcs(updatedPcs);
        }
    }, [selectedItems]);

    return (
        <>
            <div className="order_list_wrapper_">
                <div className="handel_customer">
                    <h1>Order List</h1>
                    <span>
                        <p>Transaction ID : {transactionID}</p>
                        <p>
                            <svg onClick={() => generateRandomID()} xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-trash-2 feather-16 text-danger"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>
                        </p>
                    </span>
                </div>
                <div className="customer_handeler_">
                    <p>Customer Information</p>
                    <CustomerView add={add} setAdd={setAdd} setUser={setUser} storeCode={storeCode} custo={custo} setCusto={setCusto} selectedItems={selectedItems} />
                    <Product_Search storeCode={storeCode} custo={custoo} setCusto={setCustoo} selectedItems={selectedItems} setSelectedItems={setSelectedItems} />
                </div>
            </div>
            <div className="product_details">
                <span className="header">
                    <p>Product Added {selectedItems && selectedItems.length > 0 && <span>{selectedItems.length}</span>}</p>
                    <p onClick={() => handleDeleteAll()}>X Clear all</p>
                </span>
                <div className="list_of_products">
                    {selectedItems && selectedItems.length > 0 ? selectedItems.map((product: Product) => {
                        const key = product.variant ? `${product.id}-${product.variant.id}` : `${product.id}`;
                        return (
                            <div key={key} className="product_details">
                                <div className='sam_des'>
                                    <div className="product_image">
                                        <img src={product.images!} alt={product.product_name} />
                                    </div>
                                    <div className="text_wrapper">
                                        <p>{product.sku}</p>
                                        <p>{product.product_name}</p>
                                        <p>रू{product.single_product ? product.single_product.price : product.variant?.price}</p>
                                    </div>
                                </div>
                                <div className="action_button">
                                    <span className="pcs_button">
                                        <span onClick={() => handleDecrease(product.id, product.variant?.id)}>
                                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="feather feather-minus-circle feather-14"><circle cx="12" cy="12" r="10"></circle><line x1="8" y1="12" x2="16" y2="12"></line></svg>
                                        </span>
                                        <p>{pcs[key]}</p>
                                        <span onClick={() => handleIncrease(product.id, product.variant?.id)}>
                                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="feather feather-plus-circle feather-14"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="16"></line><line x1="8" y1="12" x2="16" y2="12"></line></svg>
                                        </span>
                                    </span>
                                    <span className='delete_button' onClick={() => handleDelete(product.id, product.variant?.id)}>
                                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-trash-2 feather-16 text-danger"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>
                                    </span>
                                </div>
                            </div>
                        );
                    }) :
                        <>
                            <div className='Add_Product'>
                                <p>Click on Product to Add</p>
                            </div>
                        </>
                    }
                </div>
            </div>
        </>
    );
};

interface CustomerViewProps {
  add: any;
  setAdd: any;
  storeCode: any;
  custo: any;
  setCusto: any;
  selectedItems: any;
  setUser: any;
}

interface CustomerData {
    id: number;
    store: string;
    name: string;
    email: string;
    phone: string;
    addresh: string;
    city: string;
    country: string;
    description: string;
    code: string;
}

const CustomerView: React.FC<CustomerViewProps> = ({ add, setAdd, storeCode, custo, setCusto, selectedItems, setUser }) => {
    const [query, setQuery] = useState("");
    const [Data, setData] = useState<CustomerData[]>([]);
    const [inputBorderColor, setInputBorderColor] = useState('');
    const [filtredUser, setFilterUser] = useState<CustomerData[]>([]);
    const [matchedUser, setMatchedUser] = useState(false); 
    const { data , refetch } = useCustomerViewQuery({storeCode, search: query},{skip: !storeCode});
    const [dueChecker, {isLoading:dueCheckerLoading}] = useDueCheckerMutation();
    const [customerData, setCustomerData] = useState<any>();
    const [dueData, setDueData] = useState<any>();

    const handleDueChecker = async() => {
        if(customerData){
            const result = await dueChecker({storeCode, actualData: customerData});
            type FetchBaseQueryError = {
                status: number;
                data?: {
                  error?: string;
                  existing_dues?: any;
                };
              };
            if(result.data){
                toast.success("All Clear")
            }else if(result.error){
                const errorMessage = (result.error as FetchBaseQueryError).data?.error || 'An error occurred';
                toast.error(errorMessage, {
                  action: {
                    label: 'X',
                    onClick: () => toast.dismiss(),
                },
            });
            setInputBorderColor('red');
            setDueData((result.error as FetchBaseQueryError).data?.existing_dues)
        }
        }
    }

    const inputStyle = {
        border: `1px solid ${inputBorderColor}`
    };

    useEffect(()=>{
        if(data){
            refetch()
        }
    },[add])

    useEffect(()=>{
        if(!matchedUser || !query){
            setDueData(null);
        }
    },[query])

    useEffect(() => {
        if (selectedItems.length > 0 && !queryMatchesUser() || query && !queryMatchesUser()) {
            setInputBorderColor('red');
            setMatchedUser(false); // No user matched
            setDueData(null);
            setUser(null);
        } else {
            setInputBorderColor('');
            setMatchedUser(true); // User matched
            const matchedUserData = Data.find(user => user.name.trim().toLocaleLowerCase() === query.trim().toLocaleLowerCase() || user.code.trim().toLocaleLowerCase() === query.trim().toLocaleLowerCase());
            setUser(matchedUserData || null);
            if(matchedUserData){
                setCustomerData(matchedUserData);
                handleDueChecker();
            }
        }
    }, [selectedItems, query, Data]);

    useEffect(() => {
        if (data) {
            setData(data.results);
        }
    }, [data]);

    useEffect(() => {
        if (query) {
            const filteredData = Data.filter(user =>
                user.name.toLowerCase().includes(query.toLowerCase()) || user.code.toLowerCase().includes(query.toLowerCase())
            );
            setFilterUser(filteredData);
        } else {
            setFilterUser(Data); // Set all user data when query is empty
        }
    }, [query, Data]);

    const handleInputBlur = () => {
        setTimeout(() => {
            if (document.activeElement && !document.activeElement.classList.contains('Customer_filed_wrapper')) {
                setCusto(false);
            }
        }, 500);
    };

    const queryMatchesUser = () => {
        if (query.trim() === "") return false;
        return Data.some(user => user.name.trim().toLocaleLowerCase() === query.trim().toLocaleLowerCase() || user.code.trim().toLocaleLowerCase() === query.trim().toLocaleLowerCase());
    };

    const handleInputChange = (event:any) => {
        setQuery(event.target.value);
    };
    
    const handleUserClick = (name:string) => {
        setQuery(name);
        setCusto(false);
        const matchedUserData = Data.find(user => user.name.trim().toLocaleLowerCase() === name.trim().toLocaleLowerCase() || user.code.trim().toLocaleLowerCase() === name.trim().toLocaleLowerCase());
        setUser(matchedUserData || null); // Set user data if user exists, otherwise set to null
    };
    

    const result = filtredUser.map(({ name, code}) => (
        <p onClick={() =>{ handleUserClick(name), setQuery(name)}} key={name}>
            {name} - {code}
        </p>
    ));

    const handleAddCustomer = (e:any) => {
        e.preventDefault()
        if(!dueCheckerLoading){
            if(dueData){
                toast.error("Customer has due")
            }else{
                setAdd((prev:any)=>!prev);
            }
        }
    }

    return (
        <>
        <div className="Customer_info_wrapper">
            <input type="search" onBlur={handleInputBlur} style={inputStyle} value={query} onFocus={() => setCusto(true)} onChange={handleInputChange} placeholder='Search Customer'/>
            <span className="addCustomer_Button_" onClick={handleAddCustomer}>
                {dueCheckerLoading ?  <svg id="Loader_search" viewBox="25 25 50 50">
                                        <circle id="circle_line" r="20" cy="50" cx="50"></circle>
                                      </svg> : dueData ? <TbBrandDatabricks size={24} color='#fff'/> : <AiOutlineUserAdd size={24} color='#fff'/>}
            </span>
            {custo && <div className="Customer_filed_wrapper">
                {result}
            </div>}
        </div>
        </>
    );
};

interface ProductSearchProps {
    storeCode: any;
    custo: any;
    setCusto: any;
    setSelectedItems: any;
    selectedItems: any;
}

const Product_Search = ({ storeCode, custo, setCusto, setSelectedItems, selectedItems }: ProductSearchProps) => {
    const [query, setQuery] = useState("");
    const { data, refetch } = useProductsViewQuery({ storeCode, search: query },{skip: !storeCode && !query});
    const [Data, setData] = useState<ProductView[]>([]);

    useEffect(() => {
        if (data) {
            setData(data.results);
        }
    }, [data]);

    const handleInputBlur = () => {
        setTimeout(() => {
            if (document.activeElement && !document.activeElement.classList.contains('Customer_filed_wrapper')) {
                setCusto(false);
            }
        }, 500);
    };

    const toggleButtonState = ({ productId, variantId }: { productId: number; variantId?: number }) => {
        const selectedIndex = selectedItems.findIndex((item: any) => item.id === productId && (!variantId || item.variant?.id === variantId));
        if (selectedIndex !== -1) {
            setSelectedItems((prevItems: any) => prevItems.filter((item: any) => !(item.id === productId && (!variantId || item.variant?.id === variantId))));
        } else {
            const product = Data?.find(item => item.id === productId);
            if (product) {
                const newItem = variantId
                    ? { ...product, variant: product.varient_data?.find(variant => variant.id === variantId) }
                    : { ...product, variant: product.varient_data?.[0] }; // Auto-select the first variant if exists
                setSelectedItems((prevItems: any) => [...prevItems, newItem]);
            }
        }
    };

    const handleInputChange = (event: any) => {
        setQuery(event.target.value);
        refetch();
    };
    const getProductStyle = (product: ProductView) => {
        const selectedVariants = selectedItems.filter((item: any) => item.id === product.id);
        if (product.varient_data) {
            if (selectedVariants.length === product.varient_data.length) {
                return { backgroundColor: 'orange', cursor: 'not-allowed' };
            } else if (selectedVariants.length > 0) {
                return { backgroundColor: '#22ca5b', cursor: 'pointer' };
            }
        } else if (selectedVariants.length > 0) {
            return { backgroundColor: 'orange', cursor: 'not-allowed' };
        }
        return { backgroundColor: '#f3f6f9', cursor: 'pointer' };
    };

    const result = Data.map((product, index) => (
        <p
            onClick={() => {
                if (getProductStyle(product).cursor !== 'not-allowed') {
                    toggleButtonState({ productId: product.id });
                    setCusto(false);
                }
            }}
            style={getProductStyle(product)}
            key={index}
        >
            <img src={product.images!} alt="" />
            {product.product_name}
        </p>
    ));

    return (
        <>
            <input
                type="search"
                onBlur={handleInputBlur}
                value={query}
                onFocus={() => setCusto(true)}
                onChange={handleInputChange}
                placeholder="Search Products"
            />
            {custo && (
                <div className="Customer_filed_wrapper" style={{ top: "125px" }}>
                    {result}
                </div>
            )}
        </>
    );
};

export default OrderList
