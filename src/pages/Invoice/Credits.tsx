import { useState, useEffect, useRef } from "react";
import moment from 'moment';
import style from "@/pages/Inventory/style.module.scss"
import {toast } from 'sonner';
import DataTable from 'react-data-table-component';
import { useDashboardData } from '@/pages/dashboard/Dashboard';
import {useCreditsDataQuery,useClearCreditMutation} from  "@/fetch_Api/service/user_Auth_Api"
import { MdOutlineRemoveRedEye } from "react-icons/md";
import { FiEdit } from "react-icons/fi";

import "./style.scss"
const Credits = () => {
    const { userData } = useDashboardData();
    const [storeCode, setStoreCode]  = useState("");
    const [code, serCustomer] = useState<any>()
    const {data, refetch } = useCreditsDataQuery({storeCode, code},{skip: !storeCode});
    const [add, setAdd] = useState('');
    
    useEffect(()=>{
      if(userData){
        setStoreCode(userData.stor.code)
      }
    },[userData])
    const [update, setUpdate] = useState(true);
    const [storeData, setStoreData] = useState('');
    const [CreditData, setCreditData] = useState<any>('');
    const [total_credit , setTotal_Credit] = useState(null)
    // const [UpdateCredit] = useClearCreditMutation();
    const [paying_amt, setPaying_amt] = useState(0)

    // const handelSubmit = async (e:any) =>{
    //   e.preventDefault();
    //   let id = CreditData.transactionuid
    //   const actualData = {
    //     due :  CreditData.due - parseFloat(pay),
    //     paid : CreditData.paid + parseFloat(pay),
    //   }
    //   const res = await UpdateCredit({actualData, id})
    //   if (res.error) {
    //     toast.error(res.error as string);
    //   }
    //   if (res.data) {
    //       toast.success(res.data.msg);
    //       setUpdate(false);
    //       refetch()
    //   }
    // }
    const handelePAyingAmt = (event:any) =>{
      setPaying_amt(event.target.value)
    }

    useEffect(() => {
      if (data && code) {
        const totalDue = data.reduce((total:number, entry:any) => total + entry.due, 0);
        setTotal_Credit(totalDue);
        setPaying_amt(totalDue)
        console.log(total_credit)
      }
    }, [data,code]);


    const HandelRefetch = () =>{
        serCustomer(null)
        refetch()
    }
    const updateButton = (id:number) => {
        setUpdate(prev => !prev)
        const itemToUpdate = data.filter((item:{id:number}) => item.id === id)[0];
        setStoreData(itemToUpdate.sales[0])
        setCreditData(itemToUpdate)
      }
    const viewButton = (id:number) => {
        const itemToUpdate = data.filter((item:{id:number}) => item.id === id)[0];
        setAdd(itemToUpdate)
      }
    const columns = [
        {
          name:"Customer Name",
          selector: (row:any) => row.customer,
          sortable:true
        },
        {
          name:"Invoice No",
          selector: (row:any) => row.invoiceno,
          sortable:true
        },
        {
          name:"Total ",
          selector: (row:any) => row.total,
          sortable:true
        },
        {
          name:"Paid",
          selector: (row:any) => row.paid,
        },
        {
          name:"Due",
          selector: (row:any) => row.due,
        },
        {
          name:"Created on",
          selector: (row:any) => row.created,
          sortable:true
        },
        {
            name:"Action",
            selector: (row:any) => row.action,
        },
      ]
      const table_data = data ? data.map(({id,invoice_no,costumer_name,customer_code,created,grand_total,biller,status,paid,due}:any)=>({
        id:id,
        invoiceno: invoice_no,
        customer : <p className="hover_" onClick={()=>{serCustomer(customer_code);}} style={{cursor:"pointer"}}>{costumer_name}</p>,
        total: grand_total,
        created: moment(created).format('YYYY-MM-DD'),
        paid: paid ,
        due: <p style={{color:"red"}}>{due}</p> ,
        biller : biller,
        status: <>
        {status ? <>
        <p className="status_paid">Paid</p>
        </> : <p className="status_hold">unpaid</p>}
        </>
        ,
        action: <span style={{display:"flex", gap:"5px", alignItems:"center",  width:"140px"}}>
      <span className="nav_item nav_view" >
          <span className={style.icon_links} onClick={() => viewButton(id)}>
           <MdOutlineRemoveRedEye size={20}/>
          </span>
      </span>
     {code && <span className="nav_item nav_edit" onClick={() => updateButton(id)}>
          <span className={style.icon_links} >
            <FiEdit size={20}/>
          </span>
      </span>}
    </span>

    })) :[
    ]
  return (
    <>
          <div className={style.main_products_wrapper}>
        <div className={style.header_section}>
          <span className={style.text_con}>
            <h1>Credits Report</h1>
            <p>Manage your Credits Report</p>
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
                <div className={style.quick_action} onClick={HandelRefetch}>
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
              fixedHeaderScrollHeight={`${code ? "50vh" : "79vh"}`}
            ></DataTable>
            {code && 
            <>
                <div className="clear_credit_wrapper">
                  <div className="table_wrapper">
                    <span>
                      <p>Total Due Amount = </p>
                      <p style={{width:"100px"}}>{total_credit}</p>
                    </span>
                    <span>
                      <p>Enter Amount :</p>
                      <input type="text" value={paying_amt} onChange={handelePAyingAmt}/>
                      <button>Clear Due</button>
                    </span>
                  </div>
                </div>
            </>}
        </div>
      </div>
      {storeData && update && <ViewInvoice refetch={refetch} CreditData={CreditData} storeData={storeData} setUpdate={setUpdate} update={update} />}
      {add && <UpdateCtegory  add={add} refetch={refetch} setAdd={setAdd}/>}
    </>
  )
}

const ViewInvoice = ({storeData,setUpdate ,CreditData, refetch}:any) => {
    const paymentRef = useRef(null);
    const [pay , setPay] = useState(0)
    useEffect(()=>{
      setPay(storeData.due)
    },[storeData])
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
    const columns: any = [
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
    const handelPayChange = (event:any) =>{
      setPay(event.target.value)
    }
    const [UpdateCredit] = useClearCreditMutation();

    const handelSubmit = async (e:any) =>{
      e.preventDefault();
      let id = CreditData.transactionuid
      const actualData = {
        due: parseFloat((CreditData.due - pay).toFixed(2)),
        paid: parseFloat((CreditData.paid + pay).toFixed(2)),
      }
      const res = await UpdateCredit({actualData, id})
      if ('error' in res) {
        toast.error(res.error as string);
      }
      if ('data' in res) {
          toast.success((res.data as any).msg);
          setUpdate(false);
          refetch()
      }
    }
    return(
        <>
         <div className="invoice_wrapper">
            <form className="main_invoice" onSubmit={handelSubmit} ref={paymentRef}>
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
                                        <td className="final_amt">Total Paid :</td>
                                        <td className="text-end final_amt">रू {storeData.paid}</td>
                                        </tr>
                                        <tr>
                                        <td className="final_amt">Enter Paying Amount :</td>
                                        {/* <td className="text-end final_amt">रू {storeData.paid}</td> */}
                                        <input type="text" className="input" name="pay" style={{padding: "7px 10px"}}  value={pay} onChange={handelPayChange}/>
                                        </tr>
                                        <tr  className="final_amt" >
                                          <td></td>
                                          <td style={{display:"flex", justifyContent:"end"}}>
                                              <button type="submit" className="box_wrapper"> Submit </button>
                                          </td>
                                        </tr>
                                    </tbody>
                                    </table>
                    </div>
                </div>
            </form>
         </div>
        </>
    )
}


const UpdateCtegory = ({setAdd, add, refetch} :any) =>{
  const [UpdateCredit] = useClearCreditMutation();

  console.log(add)
  const handelSubmit = async (e:any) =>{
    e.preventDefault();
    let id = add.transactionuid
    const actualData = {
      due : 0 ,
      paid : add.grand_total,
    }

    const res = await UpdateCredit({actualData, id})
    if (res.error) {
      toast.error(res.error as string);
    }
    if (res.data) {
        toast.success(res.data.msg);
        setAdd('')
        refetch()
    }
  }
  return(
    <>
    <div className="uploading_form" style={{display:`flex`}}>
      <form action="" onSubmit={handelSubmit}>
              <div className="flex-row">
                  <label>{add.costumer_name} Credit</label>
                  <label className="close_btn" style={{cursor:"pointer"}} onClick={() =>{ setAdd('') }}>x</label>
              </div>
              <div className="flex-row">
                  <label>Invoice no</label>
                      {add.invoice_no}
              </div>
              <div className="flex-row">
                  <label>Grand Total</label>
                  {add.grand_total}
              </div>
              <div className="flex-row">
                  <label>Paid Amount</label>
                  {add.paid}
              </div>
              <div className="flex-row">
                  <label>Due Amount</label>
                  {add.due}
              </div>
              <div className="flex-row">
                  <label>Date</label>
                  {moment(add.created).format('YYYY-MM-DD')}
              </div>
              <div className="flex-row">
                <span></span>
                <div className="button">
                  <button onClick={() =>{ setAdd('') }}>Close</button>
                  <button type="submit"> Clear Due </button>
                </div>
              </div>

      </form>
    </div>
    </>
  )
}
export default Credits
