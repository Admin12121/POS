import { useState,useEffect, useRef } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { useDashboardData } from '@/pages/dashboard/Dashboard';
// import {useCategoryViewQuery, useRedeemCodeViewMutation, useAddInvoiceMutation,useAddcustomerMutation} from  "../../Fetch_Api/Service/User_Auth_Api"
import {useCategoryViewQuery, useAddInvoiceMutation,useAddcustomerMutation} from  "@/fetch_Api/service/user_Auth_Api"
import {toast } from 'sonner';
import './style.scss'
import "swiper/css";
import Products from "@/pages/sales/Products";
import OrderList from "@/pages/sales/OrderList";
import Calculate from "@/pages/sales/Calculate";
import View_invoice from "@/pages/sales/View_invoice";
import On_Hold from "@/pages/sales/On_Hold";
import { LuShoppingCart } from "react-icons/lu";
import { IoReloadOutline } from "react-icons/io5";
import { LuRefreshCw } from "react-icons/lu";
import { SlCreditCard } from "react-icons/sl";
import { BsCash } from "react-icons/bs";
import { MdQrCode2 } from "react-icons/md";

interface BillUserDetails {
    user: {
      code: string;
      store: string;
      name: string;
    };
    transactionID: string;
  }
  
  interface BillUser {
    total: number;
    sub_total: number;
    discount: number;
    shipping: number;
    tax: number;
  }

const POS = () => {
    const { userData } = useDashboardData();
    const [storeCode, setStoreCode] = useState<string>("");
    const { data } = useCategoryViewQuery({storeCode, page: 1, pageSize: 100},{skip: !storeCode});
    const [_cate, setCate] = useState<string>("All products");
    const [cateslug, setCateslug] = useState<string>("");
    const [selectedItems, setSelectedItems] = useState<any[]>([]);
    const [pcs, setPcs] = useState<Record<string, number>>({});
    const [tax, setTax] = useState<string>('Include');
    const [shipping, setShipping] = useState<number>(0);
    const [discount, setDiscount] = useState<number>(0);
    const [openDropdown, setOpenDropdown] = useState<number | null>(null);
    const [totalPrice, setTotalPrice] = useState<number>(0);
    // const [grandtotalPrice, setGrandTotalPrice] = useState<number>(0);
    const [disfromredem, _setDisfromredem] = useState<any>();
    const [payment_form, setPayment_form] = useState<boolean>(false);
    const [invoice, setInvoice] = useState<boolean>(false);
    const [billDetails, setBillDetails] = useState<any[]>([]);
    const [billUser, setBillUser] = useState<BillUser | undefined>();
    const [billUserdetails, setBillUserdetails] = useState<BillUserDetails | undefined>();
    const [invoicenum, setInvoicenum] = useState<string | undefined>();
    const [paymentmethod, setPayment_method] = useState<string>("");
    const [add, setAdd] = useState<boolean>(false);
    const [AddInvoice] = useAddInvoiceMutation();
    const [status, setStatus] = useState<boolean>(false);
    const [invoiceReport, setInvoicereport] = useState<boolean>(false);
    const [holdinvoiceReport, setHoldInvoicereport] = useState<boolean>(false);
    const [due, setDue] = useState<number>(0);
    const [paid, setPaid] = useState<number>(0);
    const [paiderr, setPaiderr] = useState<boolean>(false);

    useEffect(()=>{
        if(userData){
            setStoreCode(userData.stor.code)
        }
    },[userData])

    const handleDropdown = (index:number | null) => {
        setOpenDropdown(openDropdown === index ? null : index);
    };

    const handleInputchange = (event:any) =>{
        setShipping(event.target.value)
    }

    useEffect(() => {
        if (billUser) {
            setPaid(billUser.total);
            setDue(0);
        }
    }, [billUser]);

    useEffect(() => {
        if (billUser) {
            const newDue = billUser.total - paid;
            setDue(newDue);
            if (paid > billUser.total) {
                toast.error("Enter a valid Amount", {
                    action: {
                        label: 'X',
                        onClick: () => toast.dismiss(),
                    },
                });
                setPaid(billUser.total);
                setDue(0);
                setPaiderr(true);
            } else {
                setPaiderr(false);
            }
        }
    }, [paid, billUser]);

    const handlePaidChange = (event: any) => {
        setPaid(event.target.value);
    }

    function generateInvoice(store:string) {
        const words = store.split(' ').filter(word => word !== '');
        let abbreviation = words.map(word => word[0]).join('');
        if (abbreviation.length < 3) {
            abbreviation += 'X'.repeat(3 - abbreviation.length);
        } else {
            abbreviation = abbreviation.substring(0, 3);
        }
        const randomNum = Math.floor(100000 + Math.random() * 900000);
        const invoiceNumber = abbreviation + randomNum;
        return invoiceNumber;
    }

    useEffect(()=>{
        if(billUserdetails && billUserdetails.user && billUserdetails.user.store){  
            let Store = billUserdetails.user.store
            const invoice1 = generateInvoice(Store);
            setInvoicenum(invoice1)
        }
    },[billUserdetails])
    
    const Handel_Submit_ = async (e:any) =>{
        e.preventDefault();
        
        if (!billUserdetails || !billUserdetails.user) {
            toast.error("Please Add User First", {
                action: {
                    label: 'X',
                    onClick: () => toast.dismiss(),
                },
            });
            return;
        }
        if (billDetails.length === 0) {
            toast.error("Please Add Products To Continue", {
                action: {
                    label: 'X',
                    onClick: () => toast.dismiss(),
                },
            });
            return;
        }
        if(status){
            if(paymentmethod === ""){
                toast.error("Please Add Payment Method", {
                    action: {
                        label: 'X',
                        onClick: () => toast.dismiss(),
                    },
                });
                return;
            }
        }else{
            if(paymentmethod){
                setPayment_method("")
            }
        }

        const modifiedBillDetails = billDetails.map((item:any) => ({...item, pcs: 0, total: 0}));
        const transactionID = billUserdetails.transactionID;
        const cleanTransactionID = transactionID && transactionID.replace('#', '');
        const actualData = {
            stor_code: storeCode,
            costumer_code: billUserdetails.user.code,
            invoiceno: invoicenum,
            transactionuid: cleanTransactionID,
            sub_total: billUser?.sub_total,
            discount: billUser?.discount,
            shipping: billUser?.shipping,
            status: status,
            tax: status ? billUser?.tax : 0,
            payment_method: paymentmethod,
            total_amt: status ? billUser?.total : 0,
            grand_total: status ? billUser?.total : 0,
            paid: status ? paid : 0,
            due: status ? due : 0,
            invoice_data: status ? billDetails : modifiedBillDetails,

        };
        try {
            const res = await AddInvoice(actualData);
            type FetchBaseQueryError = {
                status: number;
                data?: {
                  error?: string;
                };
              };
            if (res.error) {
                const errorMessage = (res.error as FetchBaseQueryError).data?.error || 'An error occurred';
                toast.error(errorMessage, {
                  action: {
                    label: 'X',
                    onClick: () => toast.dismiss(),
                  },
                });
                // toast.error(res.error.data.errors.msg);
            }
            if (res.data) {
                toast.success(res.data && res.data.msg);
                setPayment_form(true);
            }
        } catch (error) {
            console.error("Error in HandleProjectSubmit:", error);
        }
    };
    
  return (
    <>
    <div className="pos">
    <div className="header_button_wrapper">
            <span className="action_button" onClick={()=>setHoldInvoicereport(true)}>
               <LuShoppingCart size={15}/>
                View order</span>
            <span className="action_button">
                <IoReloadOutline size={15}/>
                Reset</span>
            <span className="action_button" onClick={()=>setInvoicereport(true)}>
                <LuRefreshCw size={15}/>
                Transition</span>
        </div>
        <div className="main_pos_container">
            <div className="Products_item">
                <div className="category_view">
                    <span className="header">
                        <h1>Categories</h1>
                        <p>Select From Below Categories</p>
                    </span>
                    <Swiper watchSlidesProgress={true} loop={true} slidesPerView={6} className="mySwiper">
                        <SwiperSlide onClick={()=>{setCate("All products");setCateslug('')}}>
                        <span className="category_swiper">
                                    <img src="https://dreamspos.dreamstechnologies.com/html/template/assets/img/categories/category-01.png" alt="" />
                                    <p>All category</p>
                                </span>
                        </SwiperSlide>
                        {data && data.results.map(({id,category_image,category,categoryslug}:{id:number,category:string,category_image:string,categoryslug:string})=>(
                            <SwiperSlide key={id} onClick={()=>{setCate(category); setCateslug(categoryslug)}}>
                                <span className="category_swiper">
                                    <img src={category_image} alt="" />
                                    <p>{category}</p>
                                </span>
                            </SwiperSlide>
                        ))}
                    </Swiper>
                </div>
                <Products category={cateslug} selectedItems={selectedItems} setSelectedItems={setSelectedItems}/>
            </div>
            <form onSubmit={Handel_Submit_} className="item">
                <OrderList add={add} setAdd={setAdd} billUserdetails={billUserdetails} setBillUserdetails={setBillUserdetails} pcs={pcs} setPcs={setPcs} selectedItems={selectedItems} storeCode={storeCode} setSelectedItems={setSelectedItems}/>
            <div className="action_buttons_">
                <div className="flex-row" style={{justifyContent:"center"}}>
                    <div className="flex-column" style={{width:"30%"}} tabIndex={0} onClick={() => handleDropdown(0)}>
                        <label htmlFor="">Order Tax</label>
                        <span className="drop_down_">{tax}</span>
                        {openDropdown === 0 && 
                            <span className="Drop_">
                                <div className="drop_box" onClick={() => { setTax("Exclude"); setOpenDropdown(null) }}>
                                    Exclude
                                </div>
                                <div className="drop_box"  onClick={() => { setTax("Include"); setOpenDropdown(null) }}>
                                    Include
                                </div>
                            </span>
                        }
                    </div>
                    <div className="flex-column" style={{width:"30%"}}>
                        <label htmlFor="">Shipping</label>
                        <input type="number"  min="0" step="1" value={shipping} onChange={handleInputchange} style={{height:"40px",outline:"none"}} className="drop_down_"/>

                    </div>
                    <div className="flex-column" style={{width:"30%"}} tabIndex={0} onClick={() => handleDropdown(1)}>
                        <label htmlFor="">Discount</label>
                        <span className="drop_down_">{discount}%</span>
                        {openDropdown === 1 && 
                            <span className="Drop_">
                                <div className="drop_box"  onClick={() => { setDiscount(0); setOpenDropdown(null) }} >
                                    No Discount
                                </div>
                                <div className="drop_box"  onClick={() => { setDiscount(15); setOpenDropdown(null) }} >
                                    15%
                                </div>
                                <div className="drop_box"  onClick={() => { setDiscount(20); setOpenDropdown(null) }}>
                                    20%
                                </div>
                            </span>
                            }
                    </div>
                </div>
                <Calculate setBillUser={setBillUser} setBillDetails={setBillDetails} billDetails={billDetails} disfromredem={disfromredem} setTotalPrice={setTotalPrice} totalPrice={totalPrice} tax={tax} shipping={shipping} discount={discount} pcs={pcs} selectedItems={selectedItems}/>
            </div>
            <div className="flex-column" style={{width:"100%"}}>
               {/* <Redeem_Code_Handeler setDisfromredem={setDisfromredem} storeCode={storeCode} totalPrice={totalPrice} setGrandTotalPrice={setGrandTotalPrice} grandtotalPrice={grandtotalPrice}/> */}
            </div>
            <div className="patment_process_">
                <p>Payment Method</p>
                <div className="payment_box_">
                    <div className="box_wrapper" onClick={()=>setPayment_method("Cash")} style={{background:`${paymentmethod == "Cash" ? "var(--primary-color)" : ""}`,color: `${paymentmethod == "Cash" ? "#fff" : ""}`}}>
                        <BsCash size={24}/>
                        Cash
                    </div>
                    <div className="box_wrapper"  onClick={()=>setPayment_method("Debit Card")} style={{background:`${paymentmethod == "Debit Card" ? "var(--primary-color)" : ""}`,color: `${paymentmethod == "Debit Card" ? "#fff" : ""}`}}>
                        <SlCreditCard size={24}/>
                        Debit Card
                        </div>
                    <div className="box_wrapper"  onClick={()=>setPayment_method("Scan")} style={{background:`${paymentmethod == "Scan" ? "var(--primary-color)" : ""}`,color: `${paymentmethod == "Scan" ? "#fff" : ""}`}}>
                       <MdQrCode2 size={24}/>
                        Scan    
                      </div>
                </div>
                  {paymentmethod &&  <div className="flex-row" style={{justifyContent: 'space-between', height: "100%"}}>
                            <div className="flex-column" style={{gap:0,width:"48%"}}>
                                <label>Paid Amt</label>
                                <div className="inputForm">
                                    रु <input type="text" style={{marginLeft:"5px"}} onChange={handlePaidChange} value={paid}  placeholder="Paid Amount"  className="input" />
                                </div>
                              </div>
                            <div className="flex-column" style={{gap:0,width:"48%"}}>
                                <label>Due Amt</label>
                                <div className="inputForm" style={{border:`1px solid ${paiderr ? "red" : "green"}`}}>
                                    रु <input type="text" style={{marginLeft:"5px"}} value={due} disabled placeholder="Due Amount" className="input" /> 
                                </div>
                            </div>
                    </div>}
                <div className="_grand_total">
                    {/* Grand Total : रू {grandtotalPrice} */}
                    Grand Total : रू {totalPrice}
                </div>
                <div className="_grand_final">
                    <button type="submit" className="box_wrapper" onClick={()=>setStatus(false)}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-pause feather-16"><rect x="6" y="4" width="4" height="16"></rect><rect x="14" y="4" width="4" height="16"></rect></svg>
                        Hold 
                    </button>
                    <div className="box_wrapper">
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-trash-2 feather-16"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>
                        Void
                    </div>
                    <button type="submit"  className="box_wrapper" onClick={()=>setStatus(true)}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-credit-card feather-16"><rect x="1" y="4" width="22" height="16" rx="2" ry="2"></rect><line x1="1" y1="10" x2="23" y2="10"></line></svg>
                        Payment
                    </button>
                </div>
            </div>
            </form>
        </div>
         {payment_form && <Order_submitted status={status} setBillDetails={setBillDetails} setBillUserdetails={setBillUserdetails} setInvoicenum={setInvoicenum} setBillUser={setBillUser} setInvoice={setInvoice} payment_form={payment_form} setPayment_form={setPayment_form}/>}
        {invoice && <Recipt  due={due} invoicenum={invoicenum} billUserdetails={billUserdetails} billUser={billUser} billDetails={billDetails} setInvoice={setInvoice}/>}
    </div>
    {add && <CustomerAdd add={add} setAdd={setAdd}/>}
    {invoiceReport && <View_invoice setInvoicereport={setInvoicereport}/>}
    {holdinvoiceReport && <On_Hold setHoldInvoicereport={setHoldInvoicereport}/>}
    </>
  )
}



interface OrderSubmittedProps {
    payment_form: any;
    setInvoice: (value: boolean) => void;
    setPayment_form: (value: boolean) => void;
    setInvoicenum: (value: any) => void;
    setBillUserdetails: (value: any) => void;
    setBillUser: (value: any) => void;
    setBillDetails: (value: any) => void;
    status: boolean;
}

const Order_submitted = ({ setInvoice, setPayment_form, status}: OrderSubmittedProps) => {

    const paymentRef = useRef<HTMLDivElement>(null);
    
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (paymentRef.current && !paymentRef.current.contains(event.target as Node)) {
                setPayment_form(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);
    
    const Handel_Invoice = () =>{
        setInvoice(true)
        setPayment_form(false);
    }

    const Handel_Next_order = () =>{
        window.location.reload();
    }
    return(
        <>
         <div className="Payment_wrapper">
            <div className="button_wrapper" ref={paymentRef}>
                <svg xmlns="http://www.w3.org/2000/svg" width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-check-circle feather-40"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
                <h1>Payment Completed</h1>
                <p>Do you want to Print Receipt for the Completed Order</p>
                <div className="buttons_box_wrapper">
                    <span className="box_wrapper" onClick={()=>{if(status){Handel_Invoice()}else{
                        
                        toast.error("Complete the payment to gennerate the Invoice");
                    }}}>Print Receipt</span>
                    <span className="box_wrapper" onClick={Handel_Next_order}>Next Order</span>
                </div>
            </div>
         </div>
        </>
    )
}

interface ReciptProps {
    setInvoice: (value: boolean) => void;
    due: number;
    invoicenum: any;
    billDetails: any[];
    billUser: any;
    billUserdetails: any;
}

const Recipt = ({ due, invoicenum, billDetails, billUser, billUserdetails}: ReciptProps) => {
    const Handel_Next_order = () =>{
        window.location.reload();
    }
    
    return(
        <>
            <div className="recipt_wrapper" id="_invoice_">
                <div className="modal-content">
                    <div className="justify-content-end">
                        <button
                        onClick={Handel_Next_order}
                        type="button"
                        className="close p-0"
                        data-bs-dismiss="modal"
                        aria-label="Close"
                        >
                        <span  aria-hidden="true">×</span>
                        </button>
                    </div>
                    <div className="modal-body">
                        <div className="text-center">
                            <a href="javascript:void(0);">
                                <img
                                style={{filter:"invert(1)"}}
                                src="https://kantipurinfotech.com/wp-content/themes/kantipurinfotech/assets/images/kit-logo.svg"
                                width="100"
                                height="30"
                                alt="Receipt Logo"
                                />
                            </a>
                        </div>
                        <div className="text-center info">
                            <h6>Dreamguys Technologies Pvt Ltd.,</h6>
                            <p className="mb-0">Phone Number: +1 5656665656</p>
                            <p className="mb-0">
                                Email: <a href="mailto:example@gmail.com">example@gmail.com</a>
                            </p>
                        </div>
                        <div className="tax-invoice">
                            <h6 className="text-center">Tax Invoice</h6>
                            <div className="row">
                                <div className="col-sm-1md6">
                                    <div className="invoice-user-name">
                                        <span>Name: </span><span>{billUserdetails.user && billUserdetails.user.name}</span>
                                    </div>
                                    <div className="invoice-user-name">
                                        <span>Invoice No: </span><span>{invoicenum}</span>
                                    </div>
                                </div>
                                <div className="col-sm-1md6">
                                    <div className="invoice-user-name">
                                        <span>Customer Id: </span><span>#{billUserdetails.user && billUserdetails.user.code}</span>
                                    </div>
                                    <div className="invoice-user-name">
                                        <span>Date: </span><span>{new Date().toLocaleDateString()}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <table className="table-borderless w-100 table-fit">
                            <thead>
                                <tr>
                                    <th># Item</th>
                                    <th>Price</th>
                                    <th>Qty</th>
                                    <th className="text-end">Total</th>
                                </tr>
                            </thead>
                            <tbody>
                               {billDetails && billDetails.map((items:any)=>(
                                <tr key={items.product_id}>
                                    <td>{items.product_name}</td>
                                    <td>रू {items.product_price}</td>
                                    <td>{items.pcs}</td>
                                    <td className="text-end">रू {items.total}</td>
                                </tr>
                               )) }
                                <tr>
                                <td colSpan={4}>
                                    <table className="table-borderless w-100 table-fit">
                                        <tbody className="last_table">
                                            <tr>
                                            <td>Sub Total :</td>
                                            <td className="text-end">रू {billUser.sub_total}</td>
                                            </tr>
                                            <tr>
                                            <td>Discount :</td>
                                            <td className="text-end">रू {billUser.discount}</td>
                                            </tr>
                                            <tr>
                                            <td>Shipping :</td>
                                            <td className="text-end">रू {billUser.shipping}</td>
                                            </tr>
                                            <tr>
                                            <td>Tax (13%) :</td>
                                            <td className="text-end">रू {billUser.tax}</td>
                                            </tr>
                                            <tr>
                                            <td>Total Bill :</td>
                                            <td className="text-end">रू {billUser.total}</td>
                                            </tr>
                                            <tr>
                                            <td>Due :</td>
                                            <td className="text-end">रू {due}</td>
                                            </tr>
                                            <tr>
                                            <td className="final_amt">Total Payable :</td>
                                            <td className="text-end final_amt">रू {due ? billUser.total-due : billUser.total}</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </td>
                                </tr>
                            </tbody>
                        </table>
                        <div className="text-center invoice-bar">
                        <p>
                            **VAT against this challan is payable through central registration.
                            Thank you for your business!
                        </p>
                        <a href="javascript:void(0);">
                            <img src="assets/img/barcode/barcode-03.jpg" alt="Barcode" />
                        </a>
                        <p>Sale 31</p>
                        <p>Thank You For Shopping With Us. Please Come Again</p>
                         <a className="btn btn-primary">Print Receipt</a>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

const CustomerAdd = ({add,setAdd}:{add:boolean, setAdd:any})  => {
    const { userData } = useDashboardData();
    const [storeCode, setStoreCode]  = useState("")
    const [ AddCustomer ] = useAddcustomerMutation();
    const cusomerRef = useRef<HTMLFormElement>(null);

    useEffect(() => {
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);
  
    const handleClickOutside = (event:any) => {
    if (cusomerRef.current && !cusomerRef.current.contains(event.target)) {
        setAdd(false)
    }
  };
  
    useEffect(()=>{
        if(userData){
          setStoreCode(userData.stor.code)
        }
      },[userData])
    const handelSubmit = async (e:any) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
      
        formData.append('stor_code', storeCode);
        formData.append('name', e.currentTarget.elements.name.value);
        formData.append('email', e.currentTarget.elements.email.value);
        formData.append('phone', e.currentTarget.elements.phone.value);
        formData.append('addresh', e.currentTarget.elements.addresh.value);
        formData.append('city', e.currentTarget.elements.city.value);
        formData.append('country', e.currentTarget.elements.country.value);
        formData.append('description', e.currentTarget.elements.description.value);
  
        const res = await AddCustomer(formData);
        if(res.error){
          console.log(res.error)
         }
        if(res.data){
           setAdd((prev:any)=>!prev)
           e.target.reset(); 
           toast.success(res.data.msg, {
            action: {
               label: 'X',
               onClick: () => toast.dismiss(),
             },} );
        }
      }
    return(
        <>
        <div className="Cutomer_form" style={{display:`${add ?  "flex" : "none"} `}}>
                <form action="" onSubmit={handelSubmit} ref={cusomerRef}>
                  <div className="close_button" onClick={(e) =>{ setAdd((prev:any)=>!prev);e.preventDefault() ;  }}>x</div>
                  <span className="header_">Update Customer data</span>
                <div className="flex-row" style={{justifyContent: 'space-between', height: "100%"}}>
                  <div className="flex-column" style={{gap:0, width:"32%"}}>
                  <label>Customer Name</label>
                  <div className="inputForm">
                      <input type="text" className="input"  name="name" placeholder="customer" required />
                  </div>
              </div>
                  <div className="flex-column" style={{gap:0, width:"32%"}}>
                  <label>Email</label>
                  <div className="inputForm">
                      <input type="text" className="input" name="email"  placeholder="Email"  required/>
                  </div>
              </div>
                  <div className="flex-column" style={{gap:0, width:"32%"}}>
                  <label>Phone</label>
                  <div className="inputForm">
                      <input type="number" className="input" name="phone" placeholder="+977 XXXXXXXXXX"  required/>
                  </div>
              </div>
                  <div className="flex-column" style={{gap:0, width:"100%"}}>
                  <label>Address</label>
                  <div className="inputForm">
                      <input type="text" className="input" name="addresh" placeholder="Address" required/>
                  </div>
              </div>
                  <div className="flex-column" style={{gap:0}}>
                  <label>City</label>
                  <div className="inputForm">
                      <input type="text" className="input" name="city"  placeholder="City" required/>
                  </div>
              </div>
                  <div className="flex-column" style={{gap:0}}>
                  <label>Country</label>
                  <div className="inputForm">
                      <input type="text" className="input" name="country"  placeholder="Country" required/>
                  </div>
              </div>
                  <div className="flex-column" style={{gap:0, width:"100%"}}>
                  <label>Description</label>
                  <div className="inputForm" style={{height:"100px", padding:0}}>
                  <textarea rows={10} cols={120} maxLength={220} name="description"  placeholder="Enter Product Name"/>
                  </div>
              </div>
              <div className="flex-row" style={{justifyContent:"flex-end",gap:"10px"}}>
                <button onClick={(e) =>{ setAdd((prev:any)=>!prev);e.preventDefault() ; }}>close</button>
                <button type="submit">Add Customer</button>
              </div>
                </div>
                </form>
            </div>
        </>
    )
}

export default POS



// const Redeem_Code_Handeler = ({grandtotalPrice,setDisfromredem,storeCode,totalPrice,setGrandTotalPrice}:{grandtotalPrice:number,setDisfromredem:any,storeCode:string,totalPrice:number,setGrandTotalPrice:any}) =>{
//     const [query, SetQuery] = useState('');
//     const [code, SetCode] = useState('');
//     const [redcode, SetRedCode] = useState();
//     const [bordercolor, SetBorderColor] = useState();
//     const [Check,{isLoading}] = useRedeemCodeViewMutation();
//     useEffect(()=>{
//         setGrandTotalPrice(totalPrice)
//     },[totalPrice])
//     const handleInputchange = event =>{
//         SetQuery(event.target.value)
//     }
//     const handelCode = () => {
//         SetCode(query)
//     }
//     const HandelCode_checker = async () =>{
//         const res = await Check({storeCode, code})
//         if(res.data){
//             SetRedCode(res.data[0])
//             if(res.data[0].status){
//                 SetBorderColor('green')
//             }
//         }
//         else{
//             SetBorderColor('red')
//             setGrandTotalPrice(totalPrice)
//             SetRedCode('')
//         }
//     }
//     useEffect(()=>{
//        if(code){
//         HandelCode_checker();
//        }
//     },[code])
//     useEffect(()=>{
//         if(redcode){
//             if(redcode.type){
//                 let disval = redcode.discount
//                 let priceafterredeemcode = parseFloat((disval/100  * totalPrice).toFixed(3));
//                 setGrandTotalPrice(totalPrice - priceafterredeemcode)
//                 setDisfromredem({dis:disval , disval: priceafterredeemcode})
//             }
//             else{
//                 let disval = redcode.discount
//                 setGrandTotalPrice(totalPrice - disval)
//                 setDisfromredem({ disval: disval})
//             }
//         }
//         else{
//             setDisfromredem("")
//         }
//     },[redcode,totalPrice,code])

//     return(
//         <>
//             <label htmlFor="">Redeem Code :</label>
//                 <div className="inputForm" style={{border:`${redcode ? `1px solid ${bordercolor}` : `1px solid ${bordercolor}`}`, gap:"5px"}}>
//                     <input type="text" style={{padding:"0 10px"}} value={query}  className="input" onChange={handleInputchange}  name="quantity_alert" placeholder="Redeem Code"/>
//                     <span className="Check_" style={{cursor:`${query ? "pointer" : 'no-drop'}`}} onClick={()=>{if(query){handelCode()}}}>Check</span>
//                 </div>
//         </>
//     )
// }