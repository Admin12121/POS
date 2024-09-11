import {useState, useEffect,useRef} from 'react'
import "./style.scss"
import { useDashboardData } from '@/pages/dashboard/Dashboard';
import {useDailyHoldInvoiceDataQuery} from  "@/fetch_Api/service/user_Auth_Api"
import moment from 'moment';

const On_Hold = ({setHoldInvoicereport}:any) => {
  const { userData } = useDashboardData(); 
  const [storeCode, setStoreCode]  = useState("");
  useEffect(()=>{
    if(userData){
      setStoreCode(userData.stor.code)
    }
  },[userData])
  const {data } = useDailyHoldInvoiceDataQuery(storeCode);
//   const columns = [
//     {
//       name:"Date",
//       selector: (row:any) => row.createdon,
//       sortable:true
//     },
//     {
//       name:"Transaction Id",
//       selector: (row:any) => row.transactionuid,
//       sortable:true
//     },
//     {
//       name:"Customer",
//           selector: (row:any) => row.customer,
//       sortable:true
//     },
//     {
//       name:"Grand Total",
//       selector: (row:any) => row.amount,
//     },
//     {
//         name:"Action",
//         selector: (row:any) => row.action,
//     },
//   ]
//   console.log(data)
//   const table_data = data ? data.map(({id,transactionuid,costumer_name,created,status,paid,due,grand_total,biller}:any)=>({
//       id:id,
//       transactionuid: transactionuid,
//       customer : costumer_name,
//       createdon: moment(created).format('YYYY-MM-DD'),
//       amount: grand_total,
//       biller : biller,
//       action: <span style={{display:"flex", gap:"5px", alignItems:"center",  width:"140px"}}>
//   <span className="nav_item nav_view">
//       <span className="icon_links">
//       <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-eye action-eye"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
//       </span>
//   </span>
//     <span className="nav_item nav_delete">
//         <span className="icon_links">
//         <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-trash-2"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>
//         </span>
//     </span>
// </span>

//   })) :[
//   ]
  const invoiceRef = useRef(null);
  useEffect(() => {
      document.addEventListener("mousedown", handleClickOutside);
      return () => {
          document.removeEventListener("mousedown", handleClickOutside);
      };
  }, []);
  const handleClickOutside = (event: MouseEvent) => {
      const currentRef = invoiceRef.current as HTMLElement | null;
      if (currentRef && !currentRef.contains(event.target as Node)) {
        setHoldInvoicereport(false);
      }
  };
  return (
    <>
      <div className="Invoice_report_wrapper">
        <div className="main_theme" ref={invoiceRef} style={{width:"600px"}}>
          <div className="header_wrapper">
            <p>On Hold Transactions</p>
            <span onClick={() => setHoldInvoicereport(false)}>×</span>
          </div>
          <div className="header_section">
          <span className="searchbar">
                        <input type="text" name="" placeholder="search" id="" />
                    </span>
          <span className="action_buttons">
            <span className="small_button">
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
                <div className="quick_action" >
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
        <div className="tabledata">
            {data && data.map(({id,transactionuid,costumer_name,created,grand_total,biller}:any)=>(
            <>
                <div key={id} className="onhold_ui">
                    <span className="header">
                        <p>
                        Transition ID : #{transactionuid}
                        </p>
                    </span>
                    <div className="hold_data">
                        <span>
                            <p>Cashier : {biller}</p>
                            <p>Customer : {costumer_name}</p>
                        </span>
                        <span>
                            <p>Total : {grand_total}</p>
                            <p>Date : {moment(created).format('YYYY-MM-DD')}</p>
                        </span>
                    </div>
                        <p className='cen'>Customer need to recheck the product once</p>
                    <div className="action_button">
                        <div className="action">Proceed</div>
                        <div className="action">Delete</div>
                    </div>
                </div>
            </>))}
        </div>
        </div>
      </div>
    </>
  )
}

export default On_Hold;
