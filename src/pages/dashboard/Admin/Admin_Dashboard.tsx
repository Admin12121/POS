import { useState ,useEffect} from "react";
import style from "./style.module.scss";
import { Link } from "react-router-dom";
import DataTable from 'react-data-table-component';
import { useDashboardData } from '@/pages/dashboard/Dashboard';
import Staff_Dashboard from "@/pages/dashboard/Staff/Staff_Dashboard";
const Admin_Dashboard = () => {
  const { userData } = useDashboardData();
  const [_storeCode, setStoreCode]  = useState("")
  useEffect(()=>{
      if(userData){
        setStoreCode(userData.stor.code)
      }
    },[userData])

  const columns = [
    {
      name:"Product",
      selector: (row:any) => row.product,
      width: "66%",
      sortable:true
    },
    {
      name:"Price",
      selector: (row:any) => row.price,
      sortable:true
    },
  ]

  const data =[
    {
      id:1,
      product: <div style={{display:"flex", alignItems:"center", gap:"10px"}}><img src="https://i.pinimg.com/564x/74/01/91/74019147bfab5bac73ed1152969a9f31.jpg" style={{height:"30px"}}/><p>Laptop</p></div>,
      price:"$1200"
    },
    {
      id:2,
      product: <div style={{display:"flex", alignItems:"center", gap:"10px"}}><img src="https://i.pinimg.com/564x/74/01/91/74019147bfab5bac73ed1152969a9f31.jpg" style={{height:"30px"}}/><p>Laptop</p></div>,
      price:"$1200"
    },
    {
      id:3,
      product: <div style={{display:"flex", alignItems:"center", gap:"10px"}}><img src="https://i.pinimg.com/564x/74/01/91/74019147bfab5bac73ed1152969a9f31.jpg" style={{height:"30px"}}/><p>Laptop</p></div>,
      price:"$1200"
    },
    {
      id:4,
      product: <div style={{display:"flex", alignItems:"center", gap:"10px"}}><img src="https://i.pinimg.com/564x/74/01/91/74019147bfab5bac73ed1152969a9f31.jpg" style={{height:"30px"}}/><p>Laptop</p></div>,
      price:"$1200"
    },
    {
      id:5,
      product: <div style={{display:"flex", alignItems:"center", gap:"10px"}}><img src="https://i.pinimg.com/564x/74/01/91/74019147bfab5bac73ed1152969a9f31.jpg" style={{height:"30px"}}/><p>Laptop</p></div>,
      price:"$1200"
    },
    {
      id:6,
      product: <div style={{display:"flex", alignItems:"center", gap:"10px"}}><img src="https://i.pinimg.com/564x/74/01/91/74019147bfab5bac73ed1152969a9f31.jpg" style={{height:"30px"}}/><p>Laptop</p></div>,
      price:"$1200"
    },

  ]

  if(userData && !userData.is_admin || !userData){
    return<Staff_Dashboard/>
  }

  return (
    <>
      <div className={style.main_dashboard}>
        <div className={style.cards_wrapper}>
          <div className={style.finance_cards}>

            <div className={style.card}>
              <span className={style.card_icon}>
                <img
                  src="https://dreamspos.dreamstechnologies.com/html/template/assets/img/icons/dash1.svg"
                  alt=""
                />
              </span>
              <span>
                <h2>$307144</h2>
                <h1>Total Purchase Due</h1>
              </span>
            </div>
            <div className={style.card}>
              <span className={style.card_icon}>
                <img src="assets/img/icons/dash2.svg" alt="img" />
              </span>
              <span>
                <h2>$4385</h2>
                <h1>Total Sales Due</h1>
              </span>
            </div>
            <div className={style.card}>
              <span className={style.card_icon}>
                <img src="assets/img/icons/dash3.svg" alt="img" />
              </span>
              <span>
                <h2>$385656.5</h2>
                <h1>Total Sale Amount</h1>
              </span>
            </div>
            <div className={style.card}>
              <span className={style.card_icon}>
                <img src="assets/img/icons/dash4.svg" alt="img" />
              </span>
              <span>
                <h2>$40000</h2>
                <h1>Total Expense Amount</h1>
              </span>
            </div>
          </div>
          <div className={style.user_management_cards}>
            <div className={style.card}>
              <span>
                <h2>$307144</h2>
                <h1>Total Purchase Due</h1>
              </span>
              <div className={style.logo_section}>
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
                  className="feather feather-user"
                >
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                  <circle cx="12" cy="7" r="4"></circle>
                </svg>
              </div>
            </div>
            <div className={style.card}>
              <span>
                <h2>$307144</h2>
                <h1>Total Purchase Due</h1>
              </span>
              <div className={style.logo_section}>
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
                  className="feather feather-user-check"
                >
                  <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                  <circle cx="8.5" cy="7" r="4"></circle>
                  <polyline points="17 11 19 13 23 9"></polyline>
                </svg>
              </div>
            </div>
            <div className={style.card}>
              <span>
                <h2>$307144</h2>
                <h1>Total Purchase Due</h1>
              </span>
              <div className={style.logo_section}>
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
                  className="feather feather-file"
                >
                  <path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"></path>
                  <polyline points="13 2 13 9 20 9"></polyline>
                </svg>
              </div>
            </div>
            <div className={style.card}>
              <span>
                <h2>$307144</h2>
                <h1>Total Purchase Due</h1>
              </span>
              <div className={style.logo_section}>
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
                  className="feather feather-file"
                >
                  <path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"></path>
                  <polyline points="13 2 13 9 20 9"></polyline>
                </svg>
              </div>
            </div>
          </div>
        </div>
        <div className={style.rest_area}>
          <div className={style.chart_area}></div>
          <div className={style.recent_products}>
            <span className={style.table_header}>
              <h1>Recent Products</h1>
              <Link to="/">View All</Link>
            </span>
            {/* <div className={style.main_table}>
              <div className={style.header}>
                <span>
                  <h3>#</h3>
                  <h4>Products</h4>
                </span>
                <h3>Price</h3>
              </div>
              <div className={style.list_of_product}>
                <span className={style.list}>
                  <span>
                    <h1>1</h1>
                    <img
                      src="https://dreamspos.dreamstechnologies.com/html/template/assets/img/products/stock-img-01.png"
                      alt=""
                    />
                    <p>Nitro 7</p>
                  </span>
                  <h2>$1200</h2>
                </span>
                <span className={style.list}>
                  <span>
                    <h1>2</h1>
                    <img
                      src="https://dreamspos.dreamstechnologies.com/html/template/assets/img/products/stock-img-01.png"
                      alt=""
                    />
                    <p>Nitro 7</p>
                  </span>
                  <h2>$1200</h2>
                </span>
                <span className={style.list}>
                  <span>
                    <h1>3</h1>
                    <img
                      src="https://dreamspos.dreamstechnologies.com/html/template/assets/img/products/stock-img-01.png"
                      alt=""
                    />
                    <p>Nitro 7</p>
                  </span>
                  <h2>$1200</h2>
                </span>
                <span className={style.list}>
                  <span>
                    <h1>4</h1>
                    <img
                      src="https://dreamspos.dreamstechnologies.com/html/template/assets/img/products/stock-img-01.png"
                      alt=""
                    />
                    <p>Nitro 7</p>
                  </span>
                  <h2>$1200</h2>
                </span>
                <span className={style.list}>
                  <span>
                    <h1>5</h1>
                    <img
                      src="https://dreamspos.dreamstechnologies.com/html/template/assets/img/products/stock-img-01.png"
                      alt=""
                    />
                    <p>Nitro 7</p>
                  </span>
                  <h2>$1200</h2>
                </span>
              </div>
            </div> */}
            <DataTable
              pagination
              columns={columns}
              data={data}
              selectableRows
              fixedHeader
              fixedHeaderScrollHeight="280px"
            ></DataTable>
          </div>
        </div>
        <div className={style.main_t_table}>
          <div className={style.header}>
            <span>
              <h3>#</h3>
              <h4>Products</h4>
            </span>
            <h3>Price</h3>
          </div>
          <div className={style.list_of_product}>
            <span className={style.list}>
              <span>
                <h1>1</h1>
                <img
                  src="https://dreamspos.dreamstechnologies.com/html/template/assets/img/products/stock-img-01.png"
                  alt=""
                />
                <p>Nitro 7</p>
              </span>
              <h2>$1200</h2>
            </span>
            <span className={style.list}>
              <span>
                <h1>2</h1>
                <img
                  src="https://dreamspos.dreamstechnologies.com/html/template/assets/img/products/stock-img-01.png"
                  alt=""
                />
                <p>Nitro 7</p>
              </span>
              <h2>$1200</h2>
            </span>
            <span className={style.list}>
              <span>
                <h1>3</h1>
                <img
                  src="https://dreamspos.dreamstechnologies.com/html/template/assets/img/products/stock-img-01.png"
                  alt=""
                />
                <p>Nitro 7</p>
              </span>
              <h2>$1200</h2>
            </span>
            <span className={style.list}>
              <span>
                <h1>4</h1>
                <img
                  src="https://dreamspos.dreamstechnologies.com/html/template/assets/img/products/stock-img-01.png"
                  alt=""
                />
                <p>Nitro 7</p>
              </span>
              <h2>$1200</h2>
            </span>
            <span className={style.list}>
              <span>
                <h1>5</h1>
                <img
                  src="https://dreamspos.dreamstechnologies.com/html/template/assets/img/products/stock-img-01.png"
                  alt=""
                />
                <p>Nitro 7</p>
              </span>
              <h2>$1200</h2>
            </span>
          </div>
        </div>
      </div>
    </>
  );
};

export default Admin_Dashboard;
