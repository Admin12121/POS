import { useState, useEffect } from "react";
import style from './style.module.scss';
import DataTable from 'react-data-table-component';
import { useDashboardData } from '@/pages/dashboard/Dashboard';
import { useExpiredproductsViewQuery, useUpdatelowstockproductsMutation } from "@/fetch_Api/service/user_Auth_Api";
import { toast } from 'sonner';
import { FiEdit } from "react-icons/fi";


interface ExpiredProductsProps {
  id: number;
  product_name: string;
  sku: string;
  manuf_date: string;
  exp_date: string;
  varient_data?: Variant;
  single_product?: SingleProduct;
  images: string;
  category: string;
  subcategory: string;
  subsubcategory: string;
}

interface Variant {
  id: number;
  manuf_date: string;
  exp_date: string;
  varient: { name: string }[];
}

interface SingleProduct {
  manuf_date: string;
  exp_date: string;
}

const EpiredProducts = () => {
  const { userData } = useDashboardData();
  const [storeCode, setStoreCode] = useState("");
  const [update, setUpdate] = useState(true);
  const [selectedVariant, setSelectedVariant] = useState<any>(null);
  const [storeData, setStoreData] = useState<any>(null);
  const [UpdateStock] = useUpdatelowstockproductsMutation();
  const { data, refetch } = useExpiredproductsViewQuery({ storeCode }, {skip: !storeCode});

  useEffect(() => {
    if (userData) {
      setStoreCode(userData.stor.code);
    }
  }, [userData]);

  useEffect(() => {
    if(data){
      refetch();
    }
  }, [storeCode, refetch]);

  const updateButton = (id: number, variant ?: number | null) => {
    setUpdate(prev => !prev);
    const itemToUpdate = data.filter((item: { id: number }) => item.id === id)[0];
    if (variant) {
      setSelectedVariant(variant);
    } else {
      setSelectedVariant(null);
    }
    setStoreData(itemToUpdate);
  };

  const [hide, sethide] = useState(true);
  const columns: any = [
    {
      name: "Product",
      selector: (row: any) => row.product,
      sortable: true,
    },
    {
      name: "SKU",
      selector: (row: any) => row.sku,
    },
    {
      name: "Manufactured Date",
      selector: (row: any) => row.mfd,
      sortable: true
    },
    {
      name: "Expired Date",
      selector: (row: any) => row.exp,
      sortable: true
    },
    {
      name: "Action",
      selector: (row: any) => row.action,
      sortable: true
    },
  ];

  const tabledata = data ? data.flatMap(({ id, product_name, varient_data, single_product, sku, images }: ExpiredProductsProps) => {
    if (varient_data) {
      return [({
        id: `${id}`,
        product:( <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <img src={images} style={{ height: "30px" }} />
          <p>{product_name}-</p>
        </div>),
        sku: sku,
        mfd: varient_data?.manuf_date,
        exp: varient_data?.exp_date,
        action: <span style={{ display: "flex", gap: "5px", alignItems: "center", width: "140px" }} onClick={() => updateButton(id, varient_data.id)}>
          <span className="nav_item nav_edit">
            <span className={style.icon_links}>
              <FiEdit/>
            </span>
          </span>
        </span>
      })];
    } else if (single_product) {
      return [{
        id: id,
        product: <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <img src={images} style={{ height: "30px" }} />
          <p>{product_name}</p>
        </div>,
        sku: sku,
        mfd: single_product.manuf_date,
        exp: single_product.exp_date,
        action: <span style={{ display: "flex", gap: "5px", alignItems: "center", width: "140px" }} onClick={() => updateButton(id)}>
          <span className="nav_item nav_edit">
            <span className={style.icon_links}>
              <FiEdit/>
            </span>
          </span>
        </span>
      }];
    } else {
      return [];
    }
  }) : [];

  const currentDate = new Date();
  const conditionalRowStyles = [
    {
      when: (row: any) => new Date(row.exp) > currentDate,
      style: {
        backgroundColor: 'orange',
        color: 'white',
        '&:hover': {
          cursor: 'pointer',
        },
      },
    },
    {
      when: (row: any) => new Date(row.exp) < currentDate,
      style: {
        backgroundColor: 'red',
        color: 'white',
        '&:hover': {
          cursor: 'pointer',
        },
      },
    },
  ];

  const handleInputChange = (e: any) => {
    const { name, value, type, checked } = e.target;
    const newValue = type === 'checkbox' ? checked : value;
    if (selectedVariant) {
      setStoreData((prevData: any) => ({
        ...prevData,
        varient_data: {
          ...prevData.varient_data,
          [name]: newValue
        }
      }));
    } else {
      setStoreData((prevData: any) => ({
        ...prevData,
        single_product: {
          ...prevData.single_product,
          [name]: newValue
        }
      }));
    }
  };
  

  function formatDate(date: any) {
    const d = new Date(date);
    const month = `${d.getMonth() + 1}`.padStart(2, '0');
    const day = `${d.getDate()}`.padStart(2, '0');
    const year = d.getFullYear();
    return `${year}-${month}-${day}`;
  }

  const handelSubmit = async (e: any) => {
    e.preventDefault();
    let id = storeData.id;

    const actualData = {
      stor_code: storeCode,
      manuf_date: selectedVariant ? storeData.varient_data.manuf_date : storeData.single_product.manuf_date,
      exp_date: selectedVariant ? storeData.varient_data.exp_date : storeData.single_product.exp_date,
    };
  
    let res;
    if (selectedVariant) {
      res = await UpdateStock({ actualData, id, varient: selectedVariant });
    } else {
      res = await UpdateStock({ actualData, id });
    }
    if (res.error) {
      console.log(res.error);
    }
    if (res.data) {
      setUpdate(prev => !prev);
      e.target.reset();
      refetch();
      toast.success(res.data.msg, {
        action: {
          label: 'X',
          onClick: () => toast.dismiss(),
        },
      });
      setSelectedVariant(null);
    }
  };

  return (
    <>
      <div className={style.main_products_wrapper}>
        <div className={style.header_section}>
          <span className={style.text_con}>
            <h1>Expired Product</h1>
            <p>Manage your expired products</p>
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
              <div className={style.quick_action} onClick={() => refetch()}>
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
                <div className={style.quick_action} onClick={() => sethide(prev => !prev)}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-filter filter-icon"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"></polygon></svg>
                </div>
                <div className={style.action_selector}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-sliders info-img"><line x1="4" y1="21" x2="4" y2="14"></line><line x1="4" y1="10" x2="4" y2="3"></line><line x1="12" y1="21" x2="12" y2="12"></line><line x1="12" y1="8" x2="12" y2="3"></line><line x1="20" y1="21" x2="20" y2="16"></line><line x1="20" y1="12" x2="20" y2="3"></line><line x1="1" y1="14" x2="7" y2="14"></line><line x1="9" y1="8" x2="15" y2="8"></line><line x1="17" y1="16" x2="23" y2="16"></line></svg>
                  Sort by Date
                </div>
              </div>
            </div>
            <div className={style.hidden_theme} id={hide ? "hide" : ""}>
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
            conditionalRowStyles={conditionalRowStyles}
            fixedHeaderScrollHeight="79vh"
          ></DataTable>
        </div>
      </div>
      {storeData && <div className="Cutomer_form" style={{display:`${update ?  "none" : "flex"} `}}>
        <form action="" onSubmit={handelSubmit} style={{width:"450px", height:"500px"}}>
              <div className="close_button" onClick={(e) =>{ setUpdate(prev=>!prev);e.preventDefault() ;  }}>x</div>
              <span className="header_">Update Customer data</span>
            <div className="flex-row" style={{justifyContent: 'space-between', height: "100%"}}>
              <div className="flex-column" style={{gap:0, width:"100%"}}>
              <label>Product Name</label>
              <div className="inputForm">
                  <input disabled type="text" style={{cursor: "no-drop"}} value={storeData.product_name} className="input" />
              </div>
          </div>
              <div className="flex-column" style={{gap:0}}>
              <label>Category</label>
              <div className="inputForm">
                  <input type="text" style={{cursor: "no-drop"}} value={storeData.category} disabled className="input" /> 
              </div>
          </div>
              <div className="flex-column" style={{gap:0}}>
              <label>Sub Category</label>
              <div className="inputForm">
                  <input type="text" style={{cursor: "no-drop"}} value={storeData.subcategory} disabled className="input" />
              </div>
          </div>
              <div className="flex-column" style={{gap:0}}>
              <label>Sub Sub Category</label>
              <div className="inputForm">
                  <input type="text" style={{cursor: "no-drop"}} value={storeData.subsubcategory} disabled className="input" />
              </div>
          </div>
              <div className="flex-column" style={{gap:0}}>
              <label>Manufacture Date</label>
              <div className="inputForm">
                <input type="date" value={formatDate(selectedVariant ? storeData.varient_data.manuf_date : storeData.single_product?.manuf_date)} onChange={handleInputChange} className="input" name="manuf_date" placeholder="Qty" required />
              </div>
          </div>
              <div className="flex-column" style={{gap:0}}>
              <label>Exp. Date</label>
              <div className="inputForm">
                 <input type="date" value={formatDate(selectedVariant ? storeData.varient_data.exp_date : storeData.single_product?.exp_date)} onChange={handleInputChange} className="input" name="exp_date" placeholder="Quantity Alert" required />
              </div>
          </div>
          <div className="flex-row" style={{justifyContent:"flex-end",gap:"10px"}}>
            <button onClick={(e) =>{ setUpdate(prev=>!prev);e.preventDefault() ; }}>close</button>
            <button type="submit">Update Product</button>
          </div>
            </div>
        </form>
        </div>}      
    </>
  )
}

export default EpiredProducts;