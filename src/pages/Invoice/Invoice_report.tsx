import { useState, useEffect } from "react";
import moment from 'moment';
import style from "@/pages/Inventory/style.module.scss"
import DataTable from 'react-data-table-component';
import { useDashboardData } from '@/pages/dashboard/Dashboard';
import {useGetInvoiceDataQuery} from  "@/fetch_Api/service/user_Auth_Api"



const Invoice_report = () => {
    const { userData } = useDashboardData();
    const [storeCode, setStoreCode]  = useState("");
    const {data, refetch } = useGetInvoiceDataQuery({storeCode},{skip: !storeCode});

    useEffect(()=>{
      if(userData){
        setStoreCode(userData.stor.code)
      }
    },[userData])

    const columns = [
        {
          name:"Invoice No",
          selector: (row:any) => row.invoiceno,
        },
        {
          name:"Customer",
          selector: (row:any) => row.customer,
        },
        {
          name:"Created on",
          selector: (row:any) => row.createdon,
          sortable:true
        },
        {
          name:"Grand Total",
          selector: (row:any) => row.amount,
        },
        {
          name:"Due",
          selector: (row:any) => row.due,
        },
        {
          name:"Paid",
          selector: (row:any) => row.paid,
        },
        {
          name:"Biller",
          selector: (row:any) => row.biller,
          sortable:true
        },
        {
          name:"Status",
          selector: (row:any) => row.status,
          sortable:true
        },
      ]
      const table_data = data ? data.map(({id,invoiceno,costumer_name,created,grand_total,biller,paid,due}:any)=>({
          id:id,
          invoiceno: invoiceno,
          customer : costumer_name,
          amount: grand_total,
          createdon: moment(created).format('YYYY-MM-DD'),
          paid: paid ? paid : 0,
          due: due ? due : 0,
          biller : biller,
          status: <>
          {due  == 0 ? <>
          <p className="status_paid">Paid</p>
          </> : <p className="status_hold">unpaid</p>}
          </>
          ,

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
    </>
  )
}

export default Invoice_report
