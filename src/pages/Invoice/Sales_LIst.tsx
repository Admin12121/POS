import { useState, useEffect, useRef } from "react";
import moment from 'moment';
import style from "@/pages/Inventory/style.module.scss"
import DataTable from 'react-data-table-component';
import { useDashboardData } from '@/pages/dashboard/Dashboard';
import {useGetInvoiceDataQuery} from  "@/fetch_Api/service/user_Auth_Api"
import { MdOutlineRemoveRedEye } from "react-icons/md";
import { MdDeleteOutline } from "react-icons/md";

import "./style.scss"
const Sales_LIst = () => {
    const { userData } = useDashboardData();
    const [storeCode, setStoreCode]  = useState("");
    const {data, refetch } = useGetInvoiceDataQuery({storeCode},{skip: !storeCode});

    useEffect(()=>{
      if(userData){
        setStoreCode(userData.stor.code)
      }
    },[userData])

    useEffect(()=>{
      if(data){
        refetch();
      }
    },[storeCode])

    const [update, setUpdate] = useState(true);
    const [storeData, setStoreData] = useState('');
    const updateButton = (id:number) => {
        setUpdate(prev => !prev)
        const itemToUpdate = data.filter((item:{id:number}) => item.id === id)[0];
        setStoreData(itemToUpdate)
      }
    const columns:any = [
        {
          name:"Customer Name",
          selector: (row:{customer:string}) => row.customer,
          sortable:true
        },
        {
          name:"Transaction Id",
          selector: (row:{transactionuid:number}) => row.transactionuid,
          sortable:true
        },
        {
          name:"Created on",
          selector: (row:{createdon:string}) => row.createdon,
          sortable:true
        },
        {
          name:"Status",
          selector: (row:{status:any}) => row.status,
          sortable:true
        },
        {
          name:"Grand Total",
          selector: (row:{amount:number}) => row.amount,
        },
        {
          name:"Due",
          selector: (row:{due:number}) => row.due,
        },
        {
          name:"Paid",
          selector: (row:{paid:number}) => row.paid,
        },
        {
          name:"Biller",
          selector: (row:{biller:string}) => row.biller,
          sortable:true
        },
        {
          name:"Payment Status",
          selector: (row:{paymentstatus:any}) => row.paymentstatus,
          sortable:true
        },
        {
            name:"Action",
            selector: (row:{action:any}) => row.action,
        },
      ]
      const table_data = data ? data.map(({id,transactionuid,costumer_name,created,status,paid,due,grand_total,biller}:any)=>({
          id:id,
          transactionuid: transactionuid,
          customer : costumer_name,
          createdon: moment(created).format('YYYY-MM-DD'),
          status: <>
          {status ? <>
          <p className="status_paid">Completed</p>
          </> : <p className="status_hold">Pending</p>}
          </>
          ,
          amount: grand_total,
          paid: paid ? paid : 0,
          due: due ? due : 0 ,
          biller : biller,
          paymentstatus:
          <>{  Number(due) <= 0 ?
          <>
           <p className="status_paid">Paid</p>
          </> : <p className="status_hold">Due</p>}
          </>,
          action: <span style={{display:"flex", gap:"5px", alignItems:"center",  width:"140px"}}>
      <span className="nav_item nav_view" onClick={() => updateButton(id)}>
          <span className={style.icon_links}>
            <MdOutlineRemoveRedEye size={20}/>
          </span>
      </span>
        <span className="nav_item nav_delete">
            <span className={style.icon_links}>
             <MdDeleteOutline size={20}/>
            </span>
        </span>
    </span>

      })) :[
      ]
  return (
    <>
          <div className={style.main_products_wrapper}>
        <div className={style.header_section}>
          <span className={style.text_con}>
            <h1>Invoice Report</h1>
            <p>Manage your Invoice Report</p>
          </span>
          <span className={style.action_buttons}>
            <span className={style.small_button}>
                <div className={style.quick_action}>
                <img
                    src="https://dreamspos.dreamstechnologies.com/html/template/assets/img/icons/pdf.svg"
                    alt="pdf"
                />
                </div>
                <div className={style.quick_action}>
                <img
                    src="https://dreamspos.dreamstechnologies.com/html/template/assets/img/icons/excel.svg"
                    alt="excel"
                />
                </div>
                <div className={style.quick_action}>
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="feather feather-printer feather-rotate-ccw"
                >
                    <polyline points="6 9 6 2 18 2 18 9"></polyline>
                    <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"></path>
                    <rect x="6" y="14" width="12" height="8"></rect>
                </svg>
                </div>
                <div className={style.quick_action} onClick={refetch}>
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="feather feather-rotate-ccw"
                >
                    <polyline points="1 4 1 10 7 10"></polyline>
                    <path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10"></path>
                </svg>
                </div>
            </span>
          </span>
        </div>
        <div className={style.table_section}>
            <div className={style.table_controls}>
                <div className={style.main_theme}>
                    <span className={style.searchbar}>
                        <input type="text" name="" placeholder="search" id="" />
                    </span>
                    <div className={style.advanced_search}>
                        <div className={style.quick_action}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-filter filter-icon"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"></polygon></svg>
                        </div>
                        <div className={style.action_selector}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-sliders info-img"><line x1="4" y1="21" x2="4" y2="14"></line><line x1="4" y1="10" x2="4" y2="3"></line><line x1="12" y1="21" x2="12" y2="12"></line><line x1="12" y1="8" x2="12" y2="3"></line><line x1="20" y1="21" x2="20" y2="16"></line><line x1="20" y1="12" x2="20" y2="3"></line><line x1="1" y1="14" x2="7" y2="14"></line><line x1="9" y1="8" x2="15" y2="8"></line><line x1="17" y1="16" x2="23" y2="16"></line></svg>
                            Sort by Date
                        </div>
                    </div>
                </div>
            </div>
            <DataTable
              pagination
              columns={columns}
              data={table_data}
              selectableRows
              fixedHeader
              highlightOnHover
              pointerOnHover
              selectableRowsHighlight
              fixedHeaderScrollHeight="79vh"
            ></DataTable>
        </div>
      </div>
      {storeData && update && <ViewInvoice storeData={storeData} setUpdate={setUpdate} update={update} />}

    </>
  )
}

const ViewInvoice = ({storeData,setUpdate}:any) => {
    const paymentRef = useRef(null);
    useEffect(() => {
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    const handleClickOutside = (event:MouseEvent) => {
      const currentRef = paymentRef.current as HTMLElement | null;
      if (currentRef && !currentRef.contains(event.target as Node)) {
             setUpdate(false);
        }
    };

    const columns:any = [
        {
          name:"Product name",
          selector: (row:{product_name:string}) => row.product_name,
        },
        {
          name:"Transaction Id",
          selector: (row:{transactionuid:number}) => row.transactionuid,
        },
        {
          name:"Price",
          selector: (row:{price:number}) => row.price,
        },
        {
          name:"Qty",
          selector: (row:{qty:number}) => row.qty,
          sortable:true
        },
        {
          name:"Total",
          selector: (row:{total:number}) => row.total,
          sortable:true
        },
      ]
      const table_data = storeData && storeData.products ? storeData.products.map(({id,product_name,price,qty,total}:any)=>({
          id:id,
          product_name: product_name,
          transactionuid : storeData.transactionuid,
          price: price,
          qty: qty,
          total : total,
      })) :[
      ]
    return(
        <>
         <div className="invoice_wrapper">
            <div className="main_invoice" ref={paymentRef}>
                <div className="invoice_header">
                    <span>Invoice No : {storeData && storeData.invoiceno}</span>
                        <span className="action_buttons">
                            <span className="small_button" >
                                <div className="quick_action">
                                <img
                                    src="https://dreamspos.dreamstechnologies.com/html/template/assets/img/icons/pdf.svg"
                                    alt="pdf"
                                />
                                </div>
                                <div className="quick_action">
                                <img
                                    src="https://dreamspos.dreamstechnologies.com/html/template/assets/img/icons/excel.svg"
                                    alt="excel"
                                />
                                </div>
                                <div className="quick_action">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="24"
                                    height="24"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    className="feather feather-printer feather-rotate-ccw"
                                >
                                    <polyline points="6 9 6 2 18 2 18 9"></polyline>
                                    <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"></path>
                                    <rect x="6" y="14" width="12" height="8"></rect>
                                </svg>
                                </div>

                            </span>
                        </span>
                </div>
                <div className="customer_over_view">
                    <div className="customer_info view">
                        <h1>Customer Info</h1>
                        <p>{storeData && storeData.costumer_name}</p>
                    </div>
                    <div className="company-over_view view">
                        <h1>Company Info</h1>
                    </div>
                    <div className="invoice_info view">
                        <h1>Invoice Info</h1>
                    </div>
                </div>
                <div className="Order_invoice">
                    <p>Order Summary</p>
                    <DataTable
                        columns={columns}
                        data={table_data}
                        highlightOnHover
                        pointerOnHover
                    ></DataTable>
                </div>
                <div className="invoice_calculation">
                    <div className="final_invoice">
                    <table className="table-borderless w-100 table-fit">
                                    <tbody className="last_table">
                                        <tr>
                                        <td>Sub Total :</td>
                                        <td className="text-end">रू {storeData.sub_total}</td>
                                        </tr>
                                        <tr>
                                        <td>Discount :</td>
                                        <td className="text-end">रू {storeData.discount}</td>
                                        </tr>
                                        <tr>
                                        <td>Shipping :</td>
                                        <td className="text-end">रू {storeData.shipping}</td>
                                        </tr>
                                        <tr>
                                        <td>Tax (13%) :</td>
                                        <td className="text-end">रू {storeData.tax}</td>
                                        </tr>
                                        <tr>
                                        <td>Total Bill :</td>
                                        <td className="text-end">रू {storeData.total_amt}</td>
                                        </tr>
                                        <tr>
                                        <td>Due :</td>
                                        <td className="text-end">रू {storeData.due}</td>
                                        </tr>
                                        <tr>
                                        <td className="final_amt">Total Payable :</td>
                                        <td className="text-end final_amt">रू {storeData.paid}</td>
                                        </tr>
                                    </tbody>
                                    </table>
                    </div>
                </div>
            </div>
         </div>
        </>
    )
}

export default Sales_LIst
