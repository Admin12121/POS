import React, { useState } from "react";
import style from "./style.module.scss";
import { Link } from "react-router-dom";
import { Reorder } from "framer-motion";
const Admin_Dashboard = () => {
  const [items, setItems] = useState([1,2,3,4])
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
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  class="feather feather-user"
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
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  class="feather feather-user-check"
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
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  class="feather feather-file"
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
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  class="feather feather-file"
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
              <Link>View All</Link>
            </span>
            <div className={style.main_table}>
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
