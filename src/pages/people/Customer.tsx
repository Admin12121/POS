import { useState ,useEffect} from "react";
import style from '@/pages/Inventory/style.module.scss'
import {Link} from 'react-router-dom'
import DataTable from 'react-data-table-component';
import {toast } from 'sonner';
import { useDashboardData } from '@/pages/dashboard/Dashboard';
import {useCustomerViewQuery ,useAddcustomerMutation ,useUpdatecustomerMutation,useDeletecustomerMutation} from  "@/fetch_Api/service/user_Auth_Api"
import './style.scss'


interface TableDataProps{
    id: number;
    profile: string;
    name: string;
    email: string;
    phone: string;
    addresh: string;
    code: string;
}

const Customer = () => {
    const { userData } = useDashboardData();
    const [storeCode, setStoreCode]  = useState("")
    const {data, refetch } = useCustomerViewQuery({storeCode});
    useEffect(()=>{
      if(userData){
        setStoreCode(userData.stor.code)
      }
    },[userData])
    const [ AddCustomer  ] = useAddcustomerMutation();
    const [ DeleteCustomer ] = useDeletecustomerMutation();
    const [hide, sethide] = useState(true)
    const [add, setAdd] = useState(true)
    const [update, setUpdate] = useState(true)
    const [storeData, setStoreData] = useState('');

    const updateButton = (id:any) => {
        setUpdate(prev => !prev)
        const itemToUpdate = data.results.find((item:{id:number}) => item.id === id);
        setStoreData(itemToUpdate)
    };

    const columns:any = [
      {
        name:"Customer Name",
        selector: (row:{customer:string}) => row.customer,
        sortable:true
      },
      {
        name:"Code",
        selector: (row:{code:number | string}) => row.code,
        width: "100px",
      },
      {
        name:"Email",
        selector: (row:{email:string}) => row.email,
        sortable:true
      },
      {
        name:"Phone",
        selector: (row:{phone:string}) => row.phone,
        sortable:true
      },
      {
        name:"Address",
        selector: (row:{addresh:string}) => row.addresh,
        sortable:true
      },
      {
        name:"Action",
        selector: (row:any) => row.action,
      },
    ]
    const tabledata = data ? data.results.map(({id,profile,name,email,phone,addresh,code}:TableDataProps)=>(
    {
        id:id,
        customer: (<div style={{display:"flex", alignItems:"center", gap:"10px"}}>
        <img src={profile} style={{height:"30px"}}/>
        <p>{name}</p>
      </div>),
        code:  code,
        email: email,
        phone: phone,
        addresh: addresh,
        action: (<>
        <span style={{display:"flex", gap:"5px", alignItems:"center",  width:"140px"}}>
            <span className="nav_item nav_view">
                <Link to="#" className={style.icon_links}>
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-eye action-eye"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
                </Link>
            </span>
            <span className="nav_item nav_edit" onClick={() => updateButton(id)}>
                <Link to="#" className={style.icon_links}>
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-edit"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
                </Link>
            </span>
            <span className="nav_item nav_delete" onClick={() => handleDelete(id)}>
                <Link to="#" className={style.icon_links}>
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-trash-2"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>
                </Link>
            </span>
        </span>
        </>)
      })) : []

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
           setAdd(prev=>!prev)
           e.target.reset(); 
            refetch();
           toast.success(res.data.msg, {
            action: {
               label: 'X',
               onClick: () => toast.dismiss(),
             },} );
        }
      }
      const handleDelete = async(id:number) => {
        const res = await DeleteCustomer(id);
        if(res.data){
          toast.success(res.data.msg, {
            action: {
              label: 'X',
              onClick: () => toast.dismiss(),
            },} );
        }
        else{
          console.log(res.error)
        }
        refetch();
      }
      useEffect(() => {
        refetch();
      }, [storeCode, refetch]);
  return (
    <>
        <div className={style.main_products_wrapper}>
            <div className={style.header_section}>
            <span className={style.text_con}>
                <h1>Customer List</h1>
                <p>Manage your Warehouse</p>
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
                    <div className={style.quick_action} onClick={()=>refetch()}>
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
                <div className={style.main_imp_button}>
                    <Link to="#" onClick={(e) =>{ setAdd(prev=>!prev); e.preventDefault() }} className={style.import_export}>
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
                        className="feather feather-plus-circle me-2"
                    >
                        <circle cx="12" cy="12" r="10"></circle>
                        <line x1="12" y1="8" x2="12" y2="16"></line>
                        <line x1="8" y1="12" x2="16" y2="12"></line>
                    </svg>
                     Add Customer
                    </Link>
                </div>
            </span>
            </div>
            <div className={style.table_section}>
                <div className={style.table_controls}>
                    <div className={style.main_theme}>
                        <span className={style.searchbar}>
                            <input type="text" name="" placeholder="search" id="" />
                        </span>
                        <div className={style.advanced_search}>
                            <div className={style.quick_action} onClick={()=>sethide(prev => !prev)}>
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-filter filter-icon"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"></polygon></svg>
                            </div>
                            <div className={style.action_selector}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-sliders info-img"><line x1="4" y1="21" x2="4" y2="14"></line><line x1="4" y1="10" x2="4" y2="3"></line><line x1="12" y1="21" x2="12" y2="12"></line><line x1="12" y1="8" x2="12" y2="3"></line><line x1="20" y1="21" x2="20" y2="16"></line><line x1="20" y1="12" x2="20" y2="3"></line><line x1="1" y1="14" x2="7" y2="14"></line><line x1="9" y1="8" x2="15" y2="8"></line><line x1="17" y1="16" x2="23" y2="16"></line></svg>
                                Sort by Date
                            </div>
                        </div>
                    </div>
                    <div className={style.hidden_theme} id={ hide ? "hide" : ""}>
                        <div className={style.action_bittons}>
                            <div className={style.action_selector}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-box info-img"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path><polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline><line x1="12" y1="22.08" x2="12" y2="12"></line></svg>
                                Choose Product
                                <span className={style.box_area}>
                                    <b className={style.arrow_presentation}></b>
                                </span>
                            </div>
                            <div className={style.action_selector}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-stop-circle info-img"><circle cx="12" cy="12" r="10"></circle><rect x="9" y="9" width="6" height="6"></rect></svg>
                                Choose Category
                                <span className={style.box_area}>
                                    <b className={style.arrow_presentation}></b>
                                </span>
                            </div>
                            <div className={style.action_selector}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-stop-circle info-img"><circle cx="12" cy="12" r="10"></circle><rect x="9" y="9" width="6" height="6"></rect></svg>
                                Choose Category
                                <span className={style.box_area}>
                                    <b className={style.arrow_presentation}></b>
                                </span>
                            </div>
                        </div>
                        <div className={style.action_button}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-search"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
                            Search
                        </div>
                    </div>
                </div>
                <DataTable
                pagination
                columns={columns}
                data={tabledata}
                selectableRows
                fixedHeader
                highlightOnHover
                pointerOnHover
                selectableRowsHighlight
                fixedHeaderScrollHeight="79vh"
                ></DataTable>
            </div>
        </div>
        <div className="Cutomer_form" style={{display:`${add ?  "none" : "flex"} `}}>
                <form action="" onSubmit={handelSubmit}>
                  <div className="close_button" onClick={(e) =>{ setAdd(prev=>!prev);e.preventDefault() ;  }}>x</div>
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
                  <textarea  rows={10} cols={120} maxLength={220} name="description"  placeholder="Enter Product Name"/>
                  </div>
              </div>
              <div className="flex-row" style={{justifyContent:"flex-end",gap:"10px"}}>
                <button onClick={(e) =>{ setAdd(prev=>!prev);e.preventDefault() ; }}>close</button>
                <button type="submit">Add Customer</button>
              </div>
                </div>
                </form>
            </div>
        {storeData && <CustomerForm storeCode={storeCode} refetch={refetch} storeData={storeData}  setStoreData={setStoreData} setUpdate={setUpdate} update={update}/>}
    </>
  )
}

interface CustomerFormProps{
    refetch: any, 
    storeCode: any, 
    storeData: any, 
    update: any, 
    setUpdate: any, 
    setStoreData: any,
}

const CustomerForm = ({refetch, storeCode, storeData,update,setUpdate,setStoreData}:CustomerFormProps) =>{
    const [UPdateCustomer] = useUpdatecustomerMutation();
    const handleInputChange = (e:any) => {
        const { name, value, type, checked } = e.target;
        const newValue = type === 'checkbox' ? checked : value;
        setStoreData((prevData:any) => ({
          ...prevData,
          [name]: newValue
        }));
      };
      let id = storeData.id;
      const handleUpdate = async(e:any) => {
        e.preventDefault();
        const NewFormData = new FormData();
      
        NewFormData.append('stor_code', storeCode);
        NewFormData.append('name', storeData.name);
        NewFormData.append('email', storeData.email);
        NewFormData.append('phone', storeData.phone);
        NewFormData.append('addresh', storeData.addresh);
        NewFormData.append('city', storeData.city);
        NewFormData.append('country', storeData.country);
        NewFormData.append('description', storeData.description);
    
         const res = await UPdateCustomer({NewFormData , id});
         if(res.data){
           toast.success(res.data.msg, {
             action: {
               label: 'X',
               onClick: () => toast.dismiss(),
             },} );
             setUpdate((prev:any) => !prev);
         }
         else{
          console.log(res.error)
         }
         refetch();
      }
    return(
        <>
            <div className="Cutomer_form" style={{display:`${update ?  "none" : "flex"} `}}>
                <form action="" onSubmit={handleUpdate}>
                  <div className="close_button" onClick={() =>{ setUpdate((prev:any)=>!prev);setStoreData('')}}>x</div>
                  <span className="header_">Update Customer data</span>
                <div className="flex-row">
                  <div className="flex-column" style={{gap:0}}>
                  <label>Customer Name</label>
                  <div className="inputForm">
                      <input type="text" className="input" value={storeData.name} onChange={handleInputChange} name="name" placeholder="customer" />
                  </div>
              </div>
                  <div className="flex-column" style={{gap:0}}>
                  <label>Email</label>
                  <div className="inputForm">
                      <input type="text" className="input" name="email" onChange={handleInputChange} value={storeData.email} placeholder="Email" />
                  </div>
              </div>
                  <div className="flex-column" style={{gap:0, width:"100%"}}>
                  <label>Phone</label>
                  <div className="inputForm">
                      <input type="number" className="input" name="phone" value={storeData.phone} onChange={handleInputChange} placeholder="+977 XXXXXXXXXX" />
                  </div>
              </div>
                  <div className="flex-column" style={{gap:0, width:"100%"}}>
                  <label>Address</label>
                  <div className="inputForm">
                      <input type="text" className="input" name="addresh" value={storeData.addresh}  onChange={handleInputChange} placeholder="Address" />
                  </div>
              </div>
                  <div className="flex-column" style={{gap:0}}>
                  <label>City</label>
                  <div className="inputForm">
                      <input type="text" className="input" name="city" value={storeData.city} onChange={handleInputChange} placeholder="City" />
                  </div>
              </div>
                  <div className="flex-column" style={{gap:0}}>
                  <label>Country</label>
                  <div className="inputForm">
                      <input type="text" className="input" name="country" value={storeData.country} onChange={handleInputChange} placeholder="Country" />
                  </div>
              </div>
                  <div className="flex-column" style={{gap:0, width:"100%"}}>
                  <label>Description</label>
                  <div className="inputForm" style={{height:"100px", padding:0}}>
                  <textarea rows={10} cols={120} maxLength={220} value={storeData.description} onChange={handleInputChange} name="description" placeholder="Enter Product Name"/>
                  </div>
              </div>
              <div className="flex-row" style={{justifyContent:"flex-end",gap:"10px"}}>
                <button onClick={() =>{ setUpdate((prev:any)=>!prev);setStoreData('')}}>close</button>
                <button type="submit">Update Customer</button>
              </div>
                </div>
                </form>
            </div>
        </>
    )
}

export default Customer
